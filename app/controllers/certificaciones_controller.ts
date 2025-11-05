// app/controllers/certificaciones_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import fs from 'node:fs/promises'
import path from 'node:path'

import Certificacion from '#models/certificacion'
import TurnoRtm from '#models/turno_rtm'

export default class CertificacionesController {
  /**
   * POST /api/certificaciones
   * Crea una certificación para un turno, sube la imagen y finaliza el turno.
   */
  public async store({ request, auth, response }: HttpContext) {
    // ===== 1) Leer inputs simples =====
    const turnoIdInput = request.input('turno_id')
    const observaciones = request.input('observaciones') as string | undefined

    if (!turnoIdInput || Number.isNaN(Number(turnoIdInput))) {
      return response.badRequest({
        message: 'turno_id es requerido y debe ser numérico',
      })
    }

    const turnoId = Number(turnoIdInput)

    // ===== 2) Archivo imagen =====
    const imagenFile = request.file('imagen', {
      size: '8mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })

    if (!imagenFile) {
      return response.badRequest({
        message: 'La imagen de certificación es obligatoria',
      })
    }

    if (!imagenFile.isValid) {
      return response.badRequest({
        message: 'La imagen no es válida',
        errors: imagenFile.errors,
      })
    }

    // ===== 3) Buscar turno =====
    const turno = await TurnoRtm.findOrFail(turnoId)

    // ===== 4) Preparar carpeta uploads/certificaciones =====
    const uploadsRoot = app.makePath('uploads')
    const certDir = path.join(uploadsRoot, 'certificaciones')
    await fs.mkdir(certDir, { recursive: true })

    // ===== 5) Guardar archivo físicamente =====
    const fileName = `${Date.now()}_${turno.id}.${imagenFile.extname}`
    await imagenFile.move(certDir, {
      name: fileName,
      overwrite: false,
    })

    const relativePath = path.join('uploads', 'certificaciones', fileName) // ruta pública o relativa

    // ===== 6) Crear certificación =====
    const usuario = await auth.authenticate().catch(() => null)

    const certificacion = await Certificacion.create({
      turnoId: turno.id,
      usuarioId: usuario?.id ?? null,
      imagenPath: relativePath,
      observaciones: observaciones?.trim() || null,
    })

    // ===== 7) Finalizar el turno y poner hora de salida como hora de certificación =====
    const now = DateTime.now().setZone('America/Bogota')
    turno.merge({
      estado: 'finalizado',
      horaSalida: now.toFormat('HH:mm:ss'),
    })
    await turno.save()

    return response.created({
      message: 'Certificación registrada y turno finalizado',
      data: certificacion,
      turno: turno,
    })
  }

  /**
   * GET /api/certificaciones/turno/:turnoId
   * Devuelve la certificación (o certificaciones) de un turno.
   */
  public async showByTurno({ params, response }: HttpContext) {
    const turnoId = Number(params.turnoId)

    if (Number.isNaN(turnoId)) {
      return response.badRequest({
        message: 'turnoId debe ser numérico',
      })
    }

    const certificacion = await Certificacion.query()
      .where('turno_id', turnoId)
      .orderBy('created_at', 'desc')
      .first()

    if (!certificacion) {
      return response.notFound({
        message: 'No hay certificación registrada para este turno',
      })
    }

    return {
      data: certificacion,
    }
  }
}
