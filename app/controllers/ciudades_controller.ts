// app/controllers/ciudades_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Ciudad from '#models/ciudad'

export default class CiudadesController {
  /**
   * Lista de ciudades (opcional filtro ?name=).
   * Devuelve: id, nombre.
   */
  public async index({ request, response }: HttpContext) {
    try {
      const { name } = request.qs()
      let query = Ciudad.query().select('id', 'nombre').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const ciudades = await query.exec()
      return response.ok({
        message: 'Lista de ciudades obtenida exitosamente.',
        data: ciudades,
      })
    } catch (error: any) {
      console.error('Error al obtener ciudades:', error)
      return response.internalServerError({
        message: 'Error al obtener ciudades',
        error: error.message,
      })
    }
  }

  /**
   * Obtener una ciudad por ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const ciudad = await Ciudad.query()
        .where('id', params.id)
        .select('id', 'nombre')
        .firstOrFail()

      return response.ok({
        message: 'Ciudad obtenida exitosamente.',
        data: ciudad,
      })
    } catch (error: any) {
      console.error('Error al obtener ciudad por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Ciudad no encontrada.' })
      }
      return response.internalServerError({
        message: 'Error al obtener ciudad',
        error: error.message,
      })
    }
  }
}
