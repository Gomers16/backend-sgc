// app/controllers/asignaciones_prospectos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import AsesorProspectoAsignacion from '#models/asesor_prospecto_asignacion'
import Prospecto from '#models/prospecto'
import AgenteCaptacion from '#models/agente_captacion'

export default class AsignacionesProspectosController {
  /**
   * POST /prospectos/:id/asignar
   * Body:
   *  - asesor_id?: number            ← si no llega, se infiere
   *  - asignado_por?: number         ← id de usuario que ejecuta la asignación (opcional)
   *  - motivo_fin?: string           ← texto para cerrar la asignación previa (opcional)
   *
   * Reglas de inferencia de asesor:
   *  1) usar asesor_id del body
   *  2) si no, buscar agente con usuario_id = asignado_por
   *  3) si no, buscar agente del creador del prospecto (usuario_id = prospecto.creadoPor)
   */
  public async asignar({ params, request, response }: HttpContext) {
    const prospectoId = Number(params.id)
    if (!Number.isFinite(prospectoId)) {
      return response.badRequest({ message: 'prospecto_id inválido' })
    }

    // quién ejecuta la acción (no requiere auth, viene en body si quieres dejar traza)
    const asignadoPorRaw = request.input('asignado_por')
    const asignadoPor =
      Number(Number.isNaN(Number(asignadoPorRaw)) ? null : Number(asignadoPorRaw)) || null

    let asesorId = Number(request.input('asesor_id') ?? request.input('asesorId'))
    const motivoFin = (request.input('motivo_fin') ?? 'Reasignación').toString().trim()

    // 2) si no llega, intentar por asignado_por → agente vinculado a ese usuario
    if (!Number.isFinite(asesorId) && Number.isFinite(asignadoPor as any)) {
      const ag = await AgenteCaptacion.query()
        .where('usuario_id', asignadoPor as number)
        .where('activo', true)
        .first()
      if (ag) asesorId = ag.id
    }

    // 3) si aún no, intentar por creador del prospecto
    if (!Number.isFinite(asesorId)) {
      const p = await Prospecto.find(prospectoId)
      if (!p) return response.notFound({ message: 'Prospecto no encontrado' })

      if (p.creadoPor) {
        const agCreador = await AgenteCaptacion.query()
          .where('usuario_id', p.creadoPor)
          .where('activo', true)
          .first()
        if (agCreador) asesorId = agCreador.id
      }
    }

    if (!Number.isFinite(asesorId)) {
      return response.badRequest({
        message:
          'asesor_id es requerido y no se pudo inferir (ni por asignado_por ni por creador del prospecto)',
      })
    }

    const trx = await db.transaction()
    try {
      // cerrar previa (si existe)
      const activa = await AsesorProspectoAsignacion.query({ client: trx })
        .where('prospecto_id', prospectoId)
        .where('activo', true)
        .whereNull('fecha_fin')
        .first()

      if (activa) {
        activa.merge({
          activo: false,
          fechaFin: DateTime.now(),
          motivoFin: motivoFin || 'Reasignación',
        } as any)
        await activa.save()
      }

      // crear nueva activa
      const nueva = await AsesorProspectoAsignacion.create(
        {
          prospectoId,
          asesorId: Number(asesorId),
          asignadoPor, // ← puede ser null si no lo envías
          fechaAsignacion: DateTime.now(),
          fechaFin: null,
          motivoFin: null,
          activo: true,
        } as any,
        { client: trx }
      )

      await trx.commit()
      return response.created({ message: 'Asignación creada', id: nueva.id })
    } catch (e) {
      await trx.rollback()
      return response.internalServerError({ message: 'Error al asignar', error: String(e) })
    }
  }

  /**
   * POST /prospectos/:id/retirar
   * Body: { motivo?: string }
   */
  public async retirar({ params, request, response }: HttpContext) {
    const prospectoId = Number(params.id)
    if (!Number.isFinite(prospectoId)) {
      return response.badRequest({ message: 'prospecto_id inválido' })
    }

    const motivo = (request.input('motivo') ?? 'Retiro manual').toString().trim()

    const activa = await AsesorProspectoAsignacion.query()
      .where('prospecto_id', prospectoId)
      .where('activo', true)
      .whereNull('fecha_fin')
      .first()

    if (!activa) {
      return response.badRequest({ message: 'No existe asignación activa para este prospecto' })
    }

    activa.merge({
      activo: false,
      fechaFin: DateTime.now(),
      motivoFin: motivo || 'Retiro manual',
    } as any)

    await activa.save()
    return { ok: true, message: 'Asignación cerrada' }
  }
}
