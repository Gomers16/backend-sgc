// app/controllers/servicios_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Servicio from '#models/servicio'

export default class ServiciosController {
  public async index({ response }: HttpContext) {
    const servicios = await Servicio.query().orderBy('codigo_servicio', 'asc')
    // devolvemos formato limpio para el select
    return response.ok(
      servicios.map((s) => ({
        id: s.id,
        codigo: s.codigoServicio,
        nombre: s.nombreServicio,
      }))
    )
  }
}
