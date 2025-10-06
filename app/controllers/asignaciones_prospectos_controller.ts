// app/controllers/asignaciones_prospectos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import AsesorProspectoAsignacion from '#models/asesor_prospecto_asignacion'

export default class AsignacionesProspectosController {
  /** POST /prospectos/:id/asignar  body: { asesor_id } */
  public async asignar({ params, request, auth, response }: HttpContext) {
    const prospectoId = Number(params.id)
    const asesorId = Number(request.input('asesor_id'))

    // cerrar asignación activa previa (si existe)
    await AsesorProspectoAsignacion.query()
      .where('prospecto_id', prospectoId)
      .andWhere('activo', true)
      .andWhereNull('fecha_fin')
      .update({
        activo: false,
        fechaFin: DateTime.local().toJSDate(),
        motivoFin: 'Reasignación',
      })

    // crear nueva asignación
    const created = await AsesorProspectoAsignacion.create({
      prospectoId,
      asesorId,
      asignadoPor: auth?.user?.id ?? null,
      fechaAsignacion: DateTime.local().toJSDate(),
      fechaFin: null,
      motivoFin: null,
      activo: true,
    })

    return response.created(created)
  }

  /** POST /prospectos/:id/retirar  body: { motivo? } */
  public async retirar({ params, request }: HttpContext) {
    const prospectoId = Number(params.id)
    const motivo = (request.input('motivo') ?? 'Retiro manual').toString().trim()

    const updated = await AsesorProspectoAsignacion.query()
      .where('prospecto_id', prospectoId)
      .andWhere('activo', true)
      .andWhereNull('fecha_fin')
      .update({
        activo: false,
        fechaFin: DateTime.local().toJSDate(),
        motivoFin: motivo,
      })

    return { ok: true, updated }
  }
}
