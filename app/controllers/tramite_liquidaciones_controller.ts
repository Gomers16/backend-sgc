import type { HttpContext } from '@adonisjs/core/http'
import TramiteLiquidacion from '#models/tramite_liquidacion'
import Tramite from '#models/tramite'

const CAMPOS_LIQUIDACION = [
  'retencion',
  'derechosTraspaso',
  'pazSalvo',
  'levantamientoPrenda',
  'inscripcionPrenda',
  'papeleria',
  'honorarios',
  'impuestoAnioActual',
  'impuestoAniosVencidos',
] as const

const LIQUIDACION_VACIA = {
  id: null,
  retencion: 0,
  derechosTraspaso: 0,
  pazSalvo: 0,
  levantamientoPrenda: 0,
  inscripcionPrenda: 0,
  papeleria: 0,
  honorarios: 0,
  impuestoAnioActual: 0,
  impuestoAniosVencidos: 0,
}

export default class TramiteLiquidacionesController {
  /** GET /tramites/:tramiteId/liquidacion */
  public async getByTramite({ params, response }: HttpContext) {
    try {
      const liquidacion = await TramiteLiquidacion.query()
        .where('tramite_id', Number(params.tramiteId))
        .first()

      if (!liquidacion) {
        return response.ok({ ...LIQUIDACION_VACIA, tramiteId: Number(params.tramiteId) })
      }

      return response.ok(liquidacion)
    } catch (error) {
      console.error('Error en getByTramite liquidacion:', error)
      return response.internalServerError({ message: 'Error al obtener la liquidación' })
    }
  }

  /** PUT /tramites/:tramiteId/liquidacion */
  public async upsert({ params, request, response }: HttpContext) {
    try {
      const tramite = await Tramite.find(Number(params.tramiteId))
      if (!tramite) return response.notFound({ message: 'Trámite no encontrado' })

      const raw = request.only([...CAMPOS_LIQUIDACION])
      const updates = Object.fromEntries(
        Object.entries(raw).filter(([, v]) => v !== undefined)
      )

      let liquidacion = await TramiteLiquidacion.query()
        .where('tramite_id', tramite.id)
        .first()

      if (!liquidacion) {
        liquidacion = await TramiteLiquidacion.create({ tramiteId: tramite.id, ...updates })
      } else {
        liquidacion.merge(updates)
        await liquidacion.save()
      }

      return response.ok(liquidacion)
    } catch (error) {
      console.error('Error en upsert liquidacion:', error)
      return response.internalServerError({ message: 'Error al guardar la liquidación' })
    }
  }
}
