// app/controllers/razones_sociales_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import RazonSocial from '#models/razon_social'
import Usuario from '#models/usuario'

export default class RazonesSocialesController {
  /**
   * Obtener lista de razones sociales.
   */
  public async index({ response, request }: HttpContext) {
    try {
      const { name } = request.qs()
      let query = RazonSocial.query().select('id', 'nombre').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const razonesSociales = await query.exec()

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

      return response.ok({
        message: 'Razón social obtenida exitosamente.',
        data: razonSocial,
      })
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

  /**
   * Obtener los usuarios asociados a una razón social (con contrato activo).
   */
  public async usuarios({ params, response }: HttpContext) {
    try {
      const razonSocialId = params.id

      const usuarios = await Usuario.query()
        .where('razon_social_id', razonSocialId)
        .preload('cargo')
        .preload('rol')
        .preload('contratos', (contratoQuery) => {
          contratoQuery.where('estado', 'activo')
        })

      return response.ok({
        message: 'Usuarios por razón social cargados exitosamente.',
        data: usuarios,
      })
    } catch (error) {
      console.error('Error al obtener usuarios de razón social:', error)
      return response.internalServerError({
        message: 'Error al obtener usuarios',
        error: error.message,
      })
    }
  }
}
