import type { HttpContext } from '@adonisjs/core/http'
import TarifaTramite from '#models/tarifa_tramite'

export default class TarifasTramitesController {
  /** GET /api/tarifas/tramite?tipo=X&clase=Y
   *
   * Busca la tarifa vigente más específica:
   *   1. tipo_tramite + clase_vehiculo exactos
   *   2. tipo_tramite + clase_vehiculo IS NULL (aplica a todos)
   * Si no encuentra ninguna devuelve 404.
   */
  public async byTipoClase({ request, response }: HttpContext) {
    const tipo  = request.input('tipo',  '') as string
    const clase = request.input('clase', '') as string | ''

    if (!tipo) {
      return response.badRequest({ message: 'El parámetro "tipo" es requerido.' })
    }

    // Intentar con clase específica primero
    let tarifa: TarifaTramite | null = null

    if (clase) {
      tarifa = await TarifaTramite.query()
        .where('tipo_tramite', tipo)
        .where('clase_vehiculo', clase)
        .orderBy('vigencia_desde', 'desc')
        .first()
    }

    // Fallback: tarifa genérica (clase_vehiculo IS NULL)
    if (!tarifa) {
      tarifa = await TarifaTramite.query()
        .where('tipo_tramite', tipo)
        .whereNull('clase_vehiculo')
        .orderBy('vigencia_desde', 'desc')
        .first()
    }

    if (!tarifa) {
      return response.notFound({
        message: `No hay tarifa registrada para tipo="${tipo}" clase="${clase || 'cualquiera'}".`,
      })
    }

    return response.ok(tarifa)
  }
}
