// app/controllers/captacion_util_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import CaptacionDateo from '#models/captacion_dateo'

export default class CaptacionUtilController {
  /**
   * POST /api/dateos/auto-convenio
   * body: { placa?, telefono?, vehiculoId?, clienteId?, convenioId, prospectoId, agenteId? }
   */
  public async crearAutoPorConvenio({ request, response }: HttpContext) {
    const { placa, telefono, vehiculoId, clienteId, convenioId, prospectoId, agenteId } =
      request.only(['placa','telefono','vehiculoId','clienteId','convenioId','prospectoId','agenteId'])

    if (!convenioId || !prospectoId) {
      return response.badRequest({ message: 'convenioId y prospectoId son requeridos' })
    }

    const d = await CaptacionDateo.create({
      canal: 'ASESOR',
      agenteId: agenteId ?? null,
      convenioId,
      prospectoId,
      vehiculoId: vehiculoId ?? null,
      clienteId: clienteId ?? null,
      placa: placa ?? null,
      telefono: telefono ?? null,
      origen: 'UI',
      observacion: 'Captación automática por base de convenio',
      // si tu modelo la tiene:
      detectadoPorConvenio: true as any,
      resultado: 'PENDIENTE',
    } as Partial<any>)

    return response.created({ id: d.id })
  }
}
