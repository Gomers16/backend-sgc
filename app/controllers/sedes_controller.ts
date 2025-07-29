// app/controllers/sedes_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Sede from '#models/sede' // Importa el modelo Sede

export default class SedesController {
  /**
   * Obtener lista de sedes para selectores.
   * Permite buscar por nombre o mostrar todas.
   */
  public async index({ response, request }: HttpContext) {
    try {
      const { name } = request.qs()
      let query = Sede.query().select('id', 'nombre').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const sedes = await query.exec()

      if (sedes.length === 0) {
        return response.ok({ message: 'No se encontraron sedes.', data: [] })
      }
      return response.ok({ message: 'Lista de sedes obtenida exitosamente.', data: sedes })
    } catch (error) {
      console.error('Error al obtener sedes:', error)
      return response.internalServerError({
        message: 'Error al obtener sedes',
        error: error.message,
      })
    }
  }

  /**
   * Obtener una sede por su ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const sede = await Sede.query().where('id', id).select('id', 'nombre').firstOrFail()
      return response.ok({ message: 'Sede obtenida exitosamente.', data: sede })
    } catch (error) {
      console.error('Error al obtener sede por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Sede no encontrada.' })
      }
      return response.internalServerError({
        message: 'Error al obtener sede',
        error: error.message,
      })
    }
  }
}
