// app/controllers/contrato_evento_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import ContratoEvento from '#models/contrato_evento'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'

/* ===== Helpers rutas/ids ===== */
function buildUploadDir(contratoId: number) {
  return `uploads/contratos/${contratoId}/eventos`
}
function toRelativePublicPath(p: string) {
  return p.replace(/^[\\/]+/, '')
}
function resolvePublicPathFromUrl(urlOrPath: string) {
  const rel = toRelativePublicPath(urlOrPath)
  return path.join(app.publicPath(), rel)
}
function toIntOrNull(v: any): number | null {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : null
}

export default class ContratoEventoController {
  /**
   * GET /api/contratos/:contratoId/eventos
   */
  public async index({ params, response }: HttpContext) {
    try {
      const eventos = await ContratoEvento.query()
        .where('contrato_id', params.contratoId)
        .preload('usuario', (q) => q.select(['id', 'nombres', 'apellidos', 'correo']))
        .orderBy('created_at', 'desc')

      return response.ok(eventos)
    } catch (error) {
      console.error('Error al obtener eventos del contrato:', error)
      return response.internalServerError({ message: 'Error al obtener eventos del contrato' })
    }
  }

  /**
   * POST /api/contratos/:contratoId/eventos
   * Acepta JSON o multipart/form-data (campo de archivo: "documento")
   * Lee el actor desde: auth.user.id -> body.actorId -> header x-actor-id
   */
  public async store({ request, response, params, auth }: HttpContext) {
    try {
      const { contratoId } = params
      const payload = request.only(['tipo', 'subtipo', 'fechaInicio', 'fechaFin', 'descripcion'])

      const actorId =
        toIntOrNull(auth?.user?.id) ??
        toIntOrNull(request.input('actorId')) ??
        toIntOrNull(request.header('x-actor-id')) ??
        null

      const documento = request.file('documento', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      })

      if (!contratoId || !payload.tipo || !payload.fechaInicio) {
        return response.badRequest({
          message: 'Faltan campos requeridos: contratoId, tipo o fechaInicio.',
        })
      }

      const evento = new ContratoEvento()
      evento.contratoId = Number(contratoId)
      evento.usuarioId = actorId ?? null // nunca undefined
      evento.tipo = String(payload.tipo).toLowerCase() as any
      evento.subtipo = (payload.subtipo ?? '').trim() || null
      evento.descripcion = (payload.descripcion ?? '').trim() || null
      evento.fechaInicio = DateTime.fromISO(payload.fechaInicio)
      evento.fechaFin = payload.fechaFin ? DateTime.fromISO(payload.fechaFin) : null

      if (documento) {
        if (!documento.isValid) {
          const error = documento.errors[0]
          return response.badRequest({ message: error.message })
        }
        const uploadDir = buildUploadDir(evento.contratoId)
        const destinationDir = path.join(app.publicPath(), uploadDir)
        const fileName = `${cuid()}.${documento.extname}`
        await fs.mkdir(destinationDir, { recursive: true })
        await documento.move(destinationDir, { name: fileName })
        evento.documentoUrl = `/${uploadDir}/${fileName}`
      }

      await evento.save()

      // Precargar usuario solo si existe FK
      if (evento.usuarioId) {
        await evento.load('usuario', (q) => q.select(['id', 'nombres', 'apellidos', 'correo']))
      }

      return response.created(evento)
    } catch (error) {
      console.error('Error al crear evento de contrato:', error)
      return response.internalServerError({ message: 'Error al crear evento de contrato' })
    }
  }

  /**
   * PUT /api/contratos/:contratoId/eventos/:id
   * PATCH /api/contratos/:contratoId/eventos/:id  (opcional)
   * Solo actualiza usuarioId si llega actor; si no, conserva el existente.
   */
  public async update({ params, request, response, auth }: HttpContext) {
    try {
      const evento = await ContratoEvento.findOrFail(params.id)
      const payload = request.only(['tipo', 'subtipo', 'fechaInicio', 'fechaFin', 'descripcion'])

      const actorId =
        toIntOrNull(auth?.user?.id) ??
        toIntOrNull(request.input('actorId')) ??
        toIntOrNull(request.header('x-actor-id')) ??
        null

      const nuevoArchivo = request.file('documento', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      })

      // Campos básicos
      if (payload.tipo) evento.tipo = String(payload.tipo).toLowerCase() as any
      if (payload.subtipo !== undefined) evento.subtipo = (payload.subtipo ?? '').trim() || null
      if (payload.descripcion !== undefined)
        evento.descripcion = (payload.descripcion ?? '').trim() || null
      if (payload.fechaInicio) evento.fechaInicio = DateTime.fromISO(payload.fechaInicio)
      if (payload.fechaFin !== undefined)
        evento.fechaFin = payload.fechaFin ? DateTime.fromISO(payload.fechaFin) : null

      // Mantener el usuario si no llega actorId; si llega, actualizar
      if (actorId !== null) {
        evento.usuarioId = actorId
      } else if (evento.usuarioId === undefined) {
        evento.usuarioId = null
      }

      // Reemplazo de archivo (si llega)
      if (nuevoArchivo) {
        if (!nuevoArchivo.isValid) {
          const error = nuevoArchivo.errors[0]
          return response.badRequest({ message: error.message })
        }

        // eliminar anterior si existe
        if (evento.documentoUrl) {
          try {
            const oldPath = resolvePublicPathFromUrl(evento.documentoUrl)
            await fs.unlink(oldPath)
          } catch (e: any) {
            if (e.code !== 'ENOENT') console.error('No se pudo eliminar el archivo anterior:', e)
          }
        }

        const uploadDir = buildUploadDir(evento.contratoId)
        const destinationDir = path.join(app.publicPath(), uploadDir)
        const fileName = `${cuid()}.${nuevoArchivo.extname}`
        await fs.mkdir(destinationDir, { recursive: true })
        await nuevoArchivo.move(destinationDir, { name: fileName })
        evento.documentoUrl = `/${uploadDir}/${fileName}`
      }

      await evento.save()

      // Preload del usuario solo si hay FK
      if (evento.usuarioId) {
        await evento.load('usuario', (q) => q.select(['id', 'nombres', 'apellidos', 'correo']))
      }

      return response.ok(evento)
    } catch (error) {
      console.error('Error al actualizar evento de contrato:', error)
      if ((error as any).code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Evento no encontrado' })
      }
      return response.internalServerError({ message: 'Error al actualizar evento de contrato' })
    }
  }

  /**
   * DELETE /api/contratos/:contratoId/eventos/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const evento = await ContratoEvento.findOrFail(params.id)

      if (evento.documentoUrl) {
        const filePath = resolvePublicPathFromUrl(evento.documentoUrl)
        try {
          await fs.unlink(filePath)
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('Error al eliminar archivo adjunto:', e)
        }
      }

      await evento.delete()
      return response.noContent()
    } catch (error) {
      console.error('Error al eliminar evento de contrato:', error)
      if ((error as any).code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Evento no encontrado' })
      }
      return response.internalServerError({ message: 'Error al eliminar evento de contrato' })
    }
  }
}
