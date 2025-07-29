// app/controllers/cargos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Cargo from '#models/cargo' // Importa el modelo Cargo

export default class CargosController {
  /**
   * Obtener lista de cargos para selectores.
   * Permite buscar por nombre o mostrar todos.
   */
  public async index({ response, request }: HttpContext) {
    try {
      const { name } = request.qs()
      let query = Cargo.query().select('id', 'nombre').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const cargos = await query.exec()

      if (cargos.length === 0) {
        return response.ok({ message: 'No se encontraron cargos.', data: [] })
      }
      return response.ok({ message: 'Lista de cargos obtenida exitosamente.', data: cargos })
    } catch (error) {
      console.error('Error al obtener cargos:', error)
      return response.internalServerError({
        message: 'Error al obtener cargos',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un cargo por su ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const cargo = await Cargo.query().where('id', id).select('id', 'nombre').firstOrFail()
      return response.ok({ message: 'Cargo obtenido exitosamente.', data: cargo })
    } catch (error) {
      console.error('Error al obtener cargo por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Cargo no encontrado.' })
      }
      return response.internalServerError({
        message: 'Error al obtener cargo',
        error: error.message,
      })
    }
  }
}
