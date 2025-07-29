// app/controllers/roles_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Rol from '#models/rol' // Importa el modelo Rol

export default class RolesController {
  /**
   * Obtener lista de roles para selectores.
   * Permite buscar por nombre o mostrar todos.
   * Si se proporciona un ID en los parámetros, busca por ID.
   */
  public async index({ response, request }: HttpContext) {
    try {
      const { name } = request.qs() // Obtener parámetro de búsqueda por nombre
      let query = Rol.query().select('id', 'nombre').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const roles = await query.exec()

      if (roles.length === 0) {
        return response.ok({ message: 'No se encontraron roles.', data: [] })
      }
      return response.ok({ message: 'Lista de roles obtenida exitosamente.', data: roles })
    } catch (error) {
      console.error('Error al obtener roles:', error)
      return response.internalServerError({
        message: 'Error al obtener roles',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un rol por su ID.
   * Corresponde a la solicitud de "que los roles los coja por el id".
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const rol = await Rol.query().where('id', id).select('id', 'nombre').firstOrFail()
      return response.ok({ message: 'Rol obtenido exitosamente.', data: rol })
    } catch (error) {
      console.error('Error al obtener rol por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Rol no encontrado.' })
      }
      return response.internalServerError({
        message: 'Error al obtener rol',
        error: error.message,
      })
    }
  }
}
