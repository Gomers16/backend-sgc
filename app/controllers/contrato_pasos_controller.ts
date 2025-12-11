// app/controllers/contrato_pasos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import ContratoPaso from '#models/contrato_paso'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'
import { DateTime } from 'luxon'

type FasePaso = 'inicio' | 'desarrollo' | 'fin'

const ALLOWED_EXTS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'] as const
const MAX_FILE_SIZE = '10mb' as const

const USER_SELECT = ['id', 'nombres', 'apellidos', 'correo'] as const

function toBoolean(val: unknown): boolean | undefined {
  if (val === undefined || val === null || val === '') return undefined
  if (typeof val === 'boolean') return val
  const s = String(val).toLowerCase()
  if (s === 'true' || s === '1' || s === 'si' || s === 'sí') return true
  if (s === 'false' || s === '0' || s === 'no') return false
  return undefined
}

function toNumber(val: unknown): number | undefined {
  if (val === undefined || val === null || val === '') return undefined
  const n = Number(val)
  return Number.isFinite(n) ? n : undefined
}

function toIntOrNull(val: unknown): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = Number(val)
  return Number.isFinite(n) ? n : null
}

function isValidPhase(f?: string): f is FasePaso {
  return !!f && ['inicio', 'desarrollo', 'fin'].includes(f)
}

function resolveActorId(ctx: HttpContext): number | null {
  const { auth, request } = ctx

  // Prioridad: auth.user.id → body.actorId → header x-actor-id
  const fromAuth = (auth as any)?.user?.id
  if (fromAuth != null) return Number(fromAuth)

  const fromBody = toIntOrNull(request.input('actorId'))
  if (fromBody) return fromBody

  const fromHeader = toIntOrNull(request.header('x-actor-id'))
  return fromHeader
}

async function safeUnlink(absPath: string) {
  try {
    await fs.unlink(absPath)
  } catch (e: any) {
    if (e?.code !== 'ENOENT') {
      console.error('Error al eliminar archivo:', e)
    }
  }
}

export default class ContratoPasosController {
  /**
   * Listar pasos del contrato
   * GET /api/contratos/:contratoId/pasos?fase=inicio|desarrollo|fin
   */
  public async index({ params, request, response }: HttpContext) {
    try {
      const contratoIdParam = params.contratoId
      const contratoId = contratoIdParam ? Number(contratoIdParam) : undefined
      const { fase } = request.qs() as { fase?: string }

      const query = ContratoPaso.query()

      if (Number.isFinite(contratoId)) {
        query.where('contrato_id', Number(contratoId))
      }

      if (fase && isValidPhase(String(fase).toLowerCase())) {
        query.where('fase', String(fase).toLowerCase() as FasePaso)
      }

      const pasos = await query
        .orderByRaw(`
          CASE fase
            WHEN 'inicio' THEN 1
            WHEN 'desarrollo' THEN 2
            WHEN 'fin' THEN 3
            ELSE 4
          END
        `)
        .orderBy('orden', 'asc')
        .orderBy('id', 'asc')
        .preload('usuario', (q) => q.select(USER_SELECT)) // ✅ incluir usuario

      return response.ok(pasos)
    } catch (error: any) {
      console.error('Error al obtener pasos de contrato:', error)
      return response.internalServerError({
        message: 'Error al obtener pasos de contrato',
        error: error.message,
      })
    }
  }

  /**
   * Mostrar un paso por ID
   * GET /api/contrato-pasos/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const paso = await ContratoPaso.query()
        .where('id', params.id)
        .preload('usuario', (q) => q.select(USER_SELECT)) // ✅ incluir usuario
        .firstOrFail()

      return response.ok(paso)
    } catch (error: any) {
      console.error('Error al obtener paso de contrato por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso de contrato no encontrado' })
      }
      return response.internalServerError({
        message: 'Error al obtener paso de contrato',
        error: error.message,
      })
    }
  }

  /**
   * Crear paso
   * POST /api/contratos/:contratoId/pasos
   * (acepta archivo opcional en campo 'archivo')
   */
  public async store(ctx: HttpContext) {
    const { params, request, response } = ctx

    const contratoIdParam = params.contratoId ? Number(params.contratoId) : undefined
    const body = request.only([
      'contratoId',
      'fase',
      'nombrePaso',
      'fecha',
      'observacion',
      'orden',
      'completado',
      'actorId', // opcional
    ])

    const contratoId = contratoIdParam ?? (body.contratoId ? Number(body.contratoId) : undefined)
    const fase = (body.fase || '').toString().toLowerCase() as FasePaso
    const nombrePaso = (body.nombrePaso || '').toString().trim()
    const orden = toNumber(body.orden)
    const completado = toBoolean(body.completado)
    const fechaISO = body.fecha ? String(body.fecha) : undefined

    if (!contratoId) {
      return response.badRequest({ message: 'El contratoId es obligatorio.' })
    }
    if (!nombrePaso) {
      return response.badRequest({ message: 'El nombrePaso es obligatorio.' })
    }
    if (!isValidPhase(fase)) {
      return response.badRequest({ message: "La fase debe ser 'inicio', 'desarrollo' o 'fin'." })
    }

    const archivoPaso = request.file('archivo', {
      extnames: [...ALLOWED_EXTS],
      size: MAX_FILE_SIZE,
    })

    try {
      // Si no llega 'orden', asignar el siguiente dentro de esa fase
      let ordenFinal = orden
      if (ordenFinal == null) {
        const last = await ContratoPaso.query()
          .where('contrato_id', contratoId)
          .where('fase', fase)
          .orderBy('orden', 'desc')
          .first()
        ordenFinal = ((last?.orden as number | undefined) ?? 0) + 1
      }

      let archivoUrl: string | undefined

      if (archivoPaso) {
        if (!archivoPaso.isValid) {
          const error = archivoPaso.errors[0]
          return response.badRequest({
            message: error?.message || 'Archivo adjunto inválido.',
          })
        }
        if (!archivoPaso.tmpPath) {
          return response.internalServerError({
            message: 'No se pudo obtener la ruta temporal del archivo.',
          })
        }

        const uploadDir = `uploads/pasos_contrato/${contratoId}`
        const fileName = `${cuid()}.${archivoPaso.extname}`
        const destinationDir = path.join(app.publicPath(), uploadDir)
        await fs.mkdir(destinationDir, { recursive: true })
        const fullPath = path.join(destinationDir, fileName)
        await fs.copyFile(archivoPaso.tmpPath, fullPath)
        archivoUrl = `/${uploadDir}/${fileName}`
      }

      // Resolver actor y setear usuarioId (nunca undefined)
      const actorId = resolveActorId(ctx)
      const usuarioId = actorId ?? null

      const paso = await ContratoPaso.create({
        contratoId,
        fase,
        nombrePaso,
        observacion: body.observacion || undefined,
        orden: ordenFinal!,
        fecha: fechaISO ? DateTime.fromISO(fechaISO) : undefined,
        completado: completado ?? false,
        archivoUrl,
        usuarioId,
      })

      // Responder con usuario precargado (si existe)
      await paso.load('usuario', (q) => q.select(USER_SELECT))
      return response.created(paso)
    } catch (error: any) {
      console.error('Error al crear paso de contrato:', error)
      return response.internalServerError({
        message: 'Error al crear paso de contrato',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un paso
   * PUT /api/contratos/:contratoId/pasos/:id
   * - Soporta reemplazar archivo (campo 'archivo')
   * - Soporta borrar archivo con 'clearArchivo=true'
   */
  public async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    try {
      const paso = await ContratoPaso.findOrFail(params.id)

      const body = request.only([
        'fase',
        'nombrePaso',
        'fecha',
        'observacion',
        'orden',
        'completado',
        'clearArchivo',
        'actorId', // opcional
      ])
      const fase = body.fase ? (String(body.fase).toLowerCase() as FasePaso) : undefined
      const nombrePaso = body.nombrePaso ? String(body.nombrePaso).trim() : undefined
      const orden = toNumber(body.orden)
      const completado = toBoolean(body.completado)
      const fechaISO = body.fecha ? String(body.fecha) : undefined
      const clearArchivo = toBoolean(body.clearArchivo) === true

      const archivoPaso = request.file('archivo', {
        extnames: [...ALLOWED_EXTS],
        size: MAX_FILE_SIZE,
      })

      let archivoUrl: string | undefined | null = paso.archivoUrl

      if (archivoPaso) {
        if (!archivoPaso.isValid) {
          const error = archivoPaso.errors[0]
          return response.badRequest({
            message: error?.message || 'Archivo adjunto inválido.',
          })
        }
        if (!archivoPaso.tmpPath) {
          return response.internalServerError({
            message: 'No se pudo obtener la ruta temporal del archivo.',
          })
        }

        // Eliminar archivo anterior si existe
        if (paso.archivoUrl) {
          const oldFilePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''))
          await safeUnlink(oldFilePath)
        }

        const uploadDir = `uploads/pasos_contrato/${paso.contratoId}`
        const fileName = `${cuid()}.${archivoPaso.extname}`
        const destinationDir = path.join(app.publicPath(), uploadDir)
        await fs.mkdir(destinationDir, { recursive: true })
        const fullPath = path.join(destinationDir, fileName)
        await fs.copyFile(archivoPaso.tmpPath, fullPath)
        archivoUrl = `/${uploadDir}/${fileName}`
      } else if (clearArchivo) {
        if (paso.archivoUrl) {
          const oldFilePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''))
          await safeUnlink(oldFilePath)
        }
        archivoUrl = null
      }

      // Si llega actorId (por auth/body/header), actualizar usuarioId; si no llega, mantener el existente
      const maybeActorId = resolveActorId(ctx)
      const usuarioId = maybeActorId ?? paso.usuarioId ?? null

      paso.merge({
        fase: isValidPhase(fase as any) ? (fase as FasePaso) : paso.fase,
        nombrePaso: nombrePaso ?? paso.nombrePaso,
        observacion: body.observacion ?? paso.observacion,
        orden: orden ?? paso.orden,
        fecha: fechaISO ? DateTime.fromISO(fechaISO) : paso.fecha,
        completado: completado ?? paso.completado,
        archivoUrl: archivoUrl as any, // string | null
        usuarioId, // nunca undefined
      })

      await paso.save()
      await paso.load('usuario', (q) => q.select(USER_SELECT)) // responder con preload
      return response.ok(paso)
    } catch (error: any) {
      console.error('Error al actualizar paso de contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso de contrato no encontrado para actualizar' })
      }
      return response.internalServerError({
        message: 'Error al actualizar paso de contrato',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un paso
   * DELETE /api/contratos/:contratoId/pasos/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const paso = await ContratoPaso.findOrFail(params.id)

      if (paso.archivoUrl) {
        const filePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''))
        await safeUnlink(filePath)
      }

      await paso.delete()
      return response.ok({ message: 'Paso de contrato eliminado correctamente' })
    } catch (error: any) {
      console.error('Error al eliminar paso de contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso de contrato no encontrado para eliminar' })
      }
      return response.internalServerError({
        message: 'Error al eliminar paso de contrato',
        error: error.message,
      })
    }
  }
}
