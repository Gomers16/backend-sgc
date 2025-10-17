// app/controllers/uploads_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import * as fsp from 'node:fs/promises'
import * as fs from 'node:fs'
import * as path from 'node:path'

const ALLOWED = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'] as const

function sanitizeSegments(seg: string[]) {
  // Une como ruta, normaliza y elimina intentos de path traversal
  const joined = path.join(...seg)
  return path.normalize(joined).replace(/^(\.\.(\/|\\|$))+/g, '')
}

export default class UploadsController {
  /**
   * POST /api/uploads/images
   * Body: multipart/form-data (campo "file", pero tolera image/imagen/photo/picture)
   * Respuesta: { id, url, mime, size, hash }
   */
  public async uploadImage({ request, response }: HttpContext) {
    const candidates = ['file', 'image', 'imagen', 'photo', 'picture']
    let file =
      candidates
        .map((k) => request.file(k, { size: '8mb', extnames: [...ALLOWED] }))
        .find((f) => !!f) || null

    if (!file) {
      const all = request.allFiles()
      const first = Object.values(all).flat()[0] as any | undefined
      if (first) {
        first.sizeLimit = '8mb'
        first.allowedExtensions = [...ALLOWED]
        file = first
      }
    }

    if (!file) {
      const received = Object.keys(request.allFiles() || {})
      return response.badRequest({
        message: 'No se envió archivo "file"',
        hint: received.length ? `Recibidos: ${received.join(', ')}` : 'Formulario vacío',
      })
    }
    if (!file.isValid) {
      return response.unprocessableEntity({
        message: file.errors?.[0]?.message || 'Archivo inválido',
      })
    }
    if (!file.tmpPath) {
      return response.badRequest({ message: 'No se pudo leer el archivo temporal' })
    }

    const now = new Date()
    const y = String(now.getFullYear())
    const m = String(now.getMonth() + 1).padStart(2, '0')

    const baseDir = app.makePath('uploads', 'dateos', y, m)
    await fsp.mkdir(baseDir, { recursive: true })

    const ext = (file.extname || 'jpg').toLowerCase()
    const filename = `${cuid()}.${ext}`
    const absPath = path.join(baseDir, filename)

    await fsp.copyFile(file.tmpPath, absPath)

    const stat = await fsp.stat(absPath)
    // URL relativa servida por GET /api/uploads/*
    const url = `/api/uploads/dateos/${y}/${m}/${filename}`

    return response.created({
      id: filename,
      url,
      mime: file.type || null,
      size: stat.size,
      hash: null,
    })
  }

  /** GET /api/uploads/* → sirve archivos desde <project>/uploads */
  public async serve({ params, response }: HttpContext) {
    const wildcard = params['*']
    // Adonis entrega array de segmentos; si llega string, lo partimos en / o \
    const parts: string[] = Array.isArray(wildcard)
      ? wildcard
      : String(wildcard || '')
          .split(/[\\/]+/)
          .filter(Boolean)

    const safeRel = sanitizeSegments(parts)
    const abs = app.makePath('uploads', safeRel)

    if (!fs.existsSync(abs)) {
      return response.notFound({
        message: 'Archivo no encontrado',
        tried: safeRel,
        absPath: abs,
      })
    }
    return response.download(abs)
  }

  /** DELETE /api/uploads/* → elimina archivo subido */
  public async remove({ params, response }: HttpContext) {
    const wildcard = params['*']
    const parts: string[] = Array.isArray(wildcard)
      ? wildcard
      : String(wildcard || '')
          .split(/[\\/]+/)
          .filter(Boolean)

    const safeRel = sanitizeSegments(parts)
    const abs = app.makePath('uploads', safeRel)

    if (!fs.existsSync(abs)) {
      return response.notFound({ message: 'Archivo no encontrado', tried: safeRel, absPath: abs })
    }
    await fsp.unlink(abs)
    return response.ok({ ok: true, deleted: safeRel })
  }
}
