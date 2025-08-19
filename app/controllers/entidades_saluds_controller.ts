// app/controllers/entidades_salud_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import EntidadSalud from '#models/entidad_salud' // Importa el modelo EntidadSalud

// ===== añadidos para gestionar archivo =====
import fs from 'node:fs/promises'
import path from 'node:path'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'
// ==========================================

export default class EntidadesSaludController {
  /**
   * Obtener lista de entidades de salud para selectores (EPS, ARL, AFP, AFC, CCF).
   * Permite buscar por nombre o mostrar todas.
   */
  public async index({ response, request }: HttpContext) {
    try {
      const { name } = request.qs()
      let query = EntidadSalud.query().select('id', 'nombre', 'tipo').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const entidades = await query.exec()

      if (entidades.length === 0) {
        return response.ok({ message: 'No se encontraron entidades de salud.', data: [] })
      }
      return response.ok({
        message: 'Lista de entidades de salud obtenida exitosamente.',
        data: entidades,
      })
    } catch (error: any) {
      console.error('Error al obtener entidades de salud:', error)
      return response.internalServerError({
        message: 'Error al obtener entidades de salud',
        error: error.message,
      })
    }
  }

  /**
   * Obtener una entidad de salud por su ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const entidad = await EntidadSalud.query()
        .where('id', id)
        .select(
          'id',
          'nombre',
          'tipo',
          // ====== Opcional: exponer metadatos del certificado en show ======
          'certificado_nombre_original',
          'certificado_mime',
          'certificado_tamanio',
          'certificado_fecha_emision',
          'certificado_fecha_expiracion'
        )
        .firstOrFail()

      // Puedes incluir una URL de descarga si hay archivo
      const data = entidad.serialize()
      const tieneArchivo = !!data.certificadoNombreArchivo
      const downloadUrl = tieneArchivo
        ? `/api/entidades-salud/${data.id}/certificado/download`
        : null

      return response.ok({
        message: 'Entidad de salud obtenida exitosamente.',
        data: { ...data, certificadoDownloadUrl: downloadUrl },
      })
    } catch (error: any) {
      console.error('Error al obtener entidad de salud por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Entidad de salud no encontrada.' })
      }
      return response.internalServerError({
        message: 'Error al obtener entidad de salud',
        error: error.message,
      })
    }
  }

  // ==========================================================
  // =============== MÉTODOS NUEVOS (archivo) =================
  // ==========================================================

  /**
   * Subir/Reemplazar certificado de la entidad (1 archivo).
   * Campos extra opcionales: fechaEmision (YYYY-MM-DD), fechaExpiracion (YYYY-MM-DD)
   * Campo de archivo: "archivo"
   */
  public async subirCertificado({ params, request, response }: HttpContext) {
    try {
      const entidadId = Number(params.id)
      const entidad = await EntidadSalud.find(entidadId)
      if (!entidad) {
        return response.notFound({ message: 'Entidad de salud no encontrada.' })
      }

      const file = request.file('archivo')
      if (!file || !file.tmpPath || !file.clientName || !file.headers) {
        return response.badRequest({ message: 'No se envió un archivo válido.' })
      }

      const mime = file.headers['content-type'] || 'application/octet-stream'
      const permitido = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      if (!permitido.includes(mime)) {
        return response.badRequest({ message: 'Tipo de archivo no permitido.' })
      }

      // Carpeta destino: uploads/entidades_salud/<id>
      const baseDir = app.makePath('uploads', 'entidades_salud', String(entidadId))
      await fs.mkdir(baseDir, { recursive: true })

      // Si ya había un archivo, eliminarlo para reemplazar
      if (entidad.certificadoNombreArchivo) {
        const anterior = path.join(baseDir, entidad.certificadoNombreArchivo)
        try {
          await fs.unlink(anterior)
        } catch {}
      }

      const ext = path.extname(file.clientName) || ''
      const nombreArchivo = `${cuid()}${ext}`
      const destino = path.join(baseDir, nombreArchivo)
      await fs.copyFile(file.tmpPath, destino)

      const stat = await fs.stat(destino)
      const tamanio = stat.size

      // Fechas opcionales
      const fechaEmisionStr = request.input('fechaEmision') as string | undefined
      const fechaExpiracionStr = request.input('fechaExpiracion') as string | undefined

      entidad.merge({
        certificadoNombreOriginal: file.clientName,
        certificadoNombreArchivo: nombreArchivo,
        certificadoMime: mime,
        certificadoTamanio: Number(tamanio),
        certificadoFechaEmision: fechaEmisionStr ? DateTime.fromISO(fechaEmisionStr) : null,
        certificadoFechaExpiracion: fechaExpiracionStr
          ? DateTime.fromISO(fechaExpiracionStr)
          : null,
      })

      await entidad.save()

      return response.created({
        message: 'Certificado cargado correctamente.',
        data: {
          id: entidad.id,
          nombre: entidad.nombre,
          tipo: entidad.tipo,
          certificadoNombreOriginal: entidad.certificadoNombreOriginal,
          certificadoMime: entidad.certificadoMime,
          certificadoTamanio: entidad.certificadoTamanio,
          certificadoFechaEmision: entidad.certificadoFechaEmision,
          certificadoFechaExpiracion: entidad.certificadoFechaExpiracion,
          downloadUrl: `/api/entidades-salud/${entidad.id}/certificado/download`,
        },
      })
    } catch (error: any) {
      console.error('Error al subir certificado:', error)
      return response.internalServerError({
        message: 'Error al subir certificado',
        error: error.message,
      })
    }
  }

  /**
   * Descargar certificado
   */
  public async descargarCertificado({ params, response }: HttpContext) {
    try {
      const entidadId = Number(params.id)
      const entidad = await EntidadSalud.find(entidadId)
      if (!entidad) {
        return response.notFound({ message: 'Entidad de salud no encontrada.' })
      }
      if (!entidad.certificadoNombreArchivo) {
        return response.notFound({ message: 'La entidad no tiene certificado cargado.' })
      }

      const filePath = app.makePath(
        'uploads',
        'entidades_salud',
        String(entidadId),
        entidad.certificadoNombreArchivo
      )
      try {
        await fs.access(filePath)
      } catch {
        return response.notFound({ message: 'Archivo de certificado no encontrado.' })
      }

      response.header('Content-Type', entidad.certificadoMime || 'application/octet-stream')
      response.header(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(entidad.certificadoNombreOriginal || 'certificado')}"`
      )
      return response.download(filePath)
    } catch (error: any) {
      console.error('Error al descargar certificado:', error)
      return response.internalServerError({
        message: 'Error al descargar certificado',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar certificado (borra archivo y limpia campos)
   */
  public async eliminarCertificado({ params, response }: HttpContext) {
    try {
      const entidadId = Number(params.id)
      const entidad = await EntidadSalud.find(entidadId)
      if (!entidad) {
        return response.notFound({ message: 'Entidad de salud no encontrada.' })
      }
      if (!entidad.certificadoNombreArchivo) {
        return response.badRequest({ message: 'La entidad no tiene certificado para eliminar.' })
      }

      const filePath = app.makePath(
        'uploads',
        'entidades_salud',
        String(entidadId),
        entidad.certificadoNombreArchivo
      )
      try {
        await fs.unlink(filePath)
      } catch {}

      entidad.merge({
        certificadoNombreOriginal: null,
        certificadoNombreArchivo: null,
        certificadoMime: null,
        certificadoTamanio: null,
        certificadoFechaEmision: null,
        certificadoFechaExpiracion: null,
      })
      await entidad.save()

      return response.ok({ message: 'Certificado eliminado correctamente.' })
    } catch (error: any) {
      console.error('Error al eliminar certificado:', error)
      return response.internalServerError({
        message: 'Error al eliminar certificado',
        error: error.message,
      })
    }
  }
}
