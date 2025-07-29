// app/controllers/entidades_salud_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import EntidadSalud from '#models/entidad_salud' // Importa el modelo EntidadSalud

export default class EntidadesSaludController {
  /**
   * Obtener lista de entidades de salud para selectores (EPS, ARL, AFP, AFC, CCF).
   * Permite buscar por nombre o mostrar todas.
   */
  public async index({ response, request }: HttpContext) {
    try {
      const { name } = request.qs()
      // ✅ Incluye 'tipo' en la selección de columnas
      let query = EntidadSalud.query().select('id', 'nombre', 'tipo').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const entidades = await query.exec()

      if (entidades.length === 0) {
        return response.ok({ message: 'No se encontraron entidades de salud.', data: [] })
      }
      return response.ok({
        message: 'Lista de entidades de salud obtenida exitosamente.',
        data: entidades,
      })
    } catch (error: any) { // Añadido 'any' para el tipo de error
      console.error('Error al obtener entidades de salud:', error)
      return response.internalServerError({
        message: 'Error al obtener entidades de salud',
        error: error.message,
      })
    }
  }

  /**
   * Obtener una entidad de salud por su ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const entidad = await EntidadSalud.query()
        .where('id', id)
        // ✅ Incluye 'tipo' en la selección de columnas
        .select('id', 'nombre', 'tipo')
        .firstOrFail()
      return response.ok({ message: 'Entidad de salud obtenida exitosamente.', data: entidad })
    } catch (error: any) { // Añadido 'any' para el tipo de error
      console.error('Error al obtener entidad de salud por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Entidad de salud no encontrada.' })
      }
      return response.internalServerError({
        message: 'Error al obtener entidad de salud',
        error: error.message,
      })
    }
  }
}
