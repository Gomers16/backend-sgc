// app/controllers/razones_sociales_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import RazonSocial from '#models/razon_social' // Importa el modelo RazonSocial

export default class RazonesSocialesController {
  /**
   * Obtener lista de razones sociales para selectores.
   * Permite buscar por nombre o mostrar todas.
   */
  public async index({ response, request }: HttpContext) {
    try {
      const { name } = request.qs()
      let query = RazonSocial.query().select('id', 'nombre').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const razonesSociales = await query.exec()

      if (razonesSociales.length === 0) {
        return response.ok({ message: 'No se encontraron razones sociales.', data: [] })
      }
      return response.ok({
        message: 'Lista de razones sociales obtenida exitosamente.',
        data: razonesSociales,
      })
    } catch (error) {
      console.error('Error al obtener razones sociales:', error)
      return response.internalServerError({
        message: 'Error al obtener razones sociales',
        error: error.message,
      })
    }
  }

  /**
   * Obtener una razón social por su ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const razonSocial = await RazonSocial.query()
        .where('id', id)
        .select('id', 'nombre')
        .firstOrFail()
      return response.ok({ message: 'Razón social obtenida exitosamente.', data: razonSocial })
    } catch (error) {
      console.error('Error al obtener razón social por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Razón social no encontrada.' })
      }
      return response.internalServerError({
        message: 'Error al obtener razón social',
        error: error.message,
      })
    }
  }
}
