// app/controllers/contrato_pasos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import ContratoPaso from '#models/contrato_paso'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'
import { DateTime } from 'luxon'

type FasePaso = 'inicio' | 'desarrollo' | 'fin'

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

export default class ContratoPasosController {
  /**
   * Listar pasos del contrato
   * GET /api/contratos/:contratoId/pasos
   * Admite ?fase=inicio|desarrollo|fin
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

      if (fase) {
        const f = String(fase).toLowerCase()
        if (['inicio', 'desarrollo', 'fin'].includes(f)) {
          query.where('fase', f as FasePaso)
        }
      }

      const pasos = await query.orderBy('fase', 'asc').orderBy('orden', 'asc').orderBy('id', 'asc')

      // Lucid ya serializa correctamente (incluye fecha como ISO y camelCase si lo definiste en el modelo)
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
      const paso = await ContratoPaso.findOrFail(params.id)
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
  public async store({ params, request, response }: HttpContext) {
    const contratoIdParam = params.contratoId ? Number(params.contratoId) : undefined
    const body = request.only([
      'contratoId',
      'fase',
      'nombrePaso',
      'fecha',
      'observacion',
      'orden',
      'completado',
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
    if (!['inicio', 'desarrollo', 'fin'].includes(fase)) {
      return response.badRequest({ message: "La fase debe ser 'inicio', 'desarrollo' o 'fin'." })
    }

    const archivoPaso = request.file('archivo', {
      extnames: ['pdf', 'jpg', 'jpeg', 'png'],
      size: '5mb',
    })

    try {
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

      const paso = await ContratoPaso.create({
        contratoId,
        fase,
        nombrePaso,
        observacion: body.observacion || undefined,
        orden: orden ?? undefined,
        fecha: fechaISO ? DateTime.fromISO(fechaISO) : undefined,
        completado: completado ?? false,
        archivoUrl,
      })

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
  public async update({ params, request, response }: HttpContext) {
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
      ])
      const fase = body.fase ? (String(body.fase).toLowerCase() as FasePaso) : undefined
      const nombrePaso = body.nombrePaso ? String(body.nombrePaso).trim() : undefined
      const orden = toNumber(body.orden)
      const completado = toBoolean(body.completado)
      const fechaISO = body.fecha ? String(body.fecha) : undefined
      const clearArchivo = toBoolean(body.clearArchivo) === true

      const archivoPaso = request.file('archivo', {
        extnames: ['pdf', 'jpg', 'jpeg', 'png'],
        size: '5mb',
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
          try {
            await fs.unlink(oldFilePath)
          } catch (unlinkError: any) {
            if (unlinkError.code !== 'ENOENT') {
              console.error('Error al eliminar archivo anterior del paso:', unlinkError)
            }
          }
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
          try {
            await fs.unlink(oldFilePath)
          } catch (unlinkError: any) {
            if (unlinkError.code !== 'ENOENT') {
              console.error('Error al eliminar archivo anterior del paso (clear):', unlinkError)
            }
          }
        }
        archivoUrl = null
      }

      paso.merge({
        fase: fase ?? paso.fase,
        nombrePaso: nombrePaso ?? paso.nombrePaso,
        observacion: body.observacion ?? paso.observacion,
        orden: orden ?? paso.orden,
        fecha: fechaISO ? DateTime.fromISO(fechaISO) : paso.fecha,
        completado: completado ?? paso.completado,
        archivoUrl: archivoUrl as any, // string | null
      })

      await paso.save()
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
        try {
          await fs.unlink(filePath)
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo del paso:', unlinkError)
          }
        }
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
