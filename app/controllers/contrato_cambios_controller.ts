import type { HttpContext } from '@adonisjs/core/http'
import ContratoCambio from '#models/contrato_cambio'

export default class ContratoCambiosController {
  public async index({ params, response }: HttpContext) {
    const cambios = await ContratoCambio.query()
      .where('contratoId', params.contratoId)
      .preload('usuario')
      .orderBy('created_at', 'desc')

    return response.ok(cambios)
  }

  // opcional: crear manualmente un cambio
  public async store({ params, request, auth, response }: HttpContext) {
    const actorId = auth?.user?.id ?? null
    const { campo, oldValue, newValue } = request.only(['campo', 'oldValue', 'newValue'])

    const cambio = await ContratoCambio.create({
      contratoId: Number(params.contratoId),
      usuarioId: actorId,
      campo,
      oldValue: oldValue ?? null,
      newValue: newValue ?? null,
    })

    return response.created(cambio)
  }
}
