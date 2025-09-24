// app/controllers/razones_sociales_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import RazonSocial from '#models/razon_social'
import Usuario from '#models/usuario'

export default class RazonesSocialesController {
  /**
   * Obtener lista de razones sociales.
   * Soporta filtro por nombre (?name=) y devuelve: id, nombre, nit, activo.
   */
  public async index({ response, request }: HttpContext) {
    try {
      const { name } = request.qs()
      let query = RazonSocial.query()
        .select('id', 'nombre', 'nit', 'activo')
        .orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      const razonesSociales = await query

      return response.ok({
        message: 'Lista de razones sociales obtenida exitosamente.',
        data: razonesSociales,
      })
    } catch (error: any) {
      console.error('Error al obtener razones sociales:', error)
      return response.internalServerError({
        message: 'Error al obtener razones sociales',
        error: error.message,
      })
    }
  }

  /**
   * Obtener una razón social por su ID.
   * Devuelve: id, nombre, nit, activo.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const razonSocial = await RazonSocial.query()
        .where('id', id)
        .select('id', 'nombre', 'nit', 'activo')
        .firstOrFail()

      return response.ok({
        message: 'Razón social obtenida exitosamente.',
        data: razonSocial,
      })
    } catch (error: any) {
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
   * Obtener los usuarios asociados a una razón social
   * (con sus contratos ordenados por fecha y cargo del contrato).
   * Nota: no se filtra únicamente por activos para permitir
   * mostrar también cargos de contratos anteriores.
   */
  public async usuarios({ params, response }: HttpContext) {
    try {
      const razonSocialId = params.id

      const usuarios = await Usuario.query()
        .where('razon_social_id', razonSocialId)
        .preload('cargo')
        .preload('rol')
        .preload('contratos', (contratoQuery) => {
          contratoQuery
            .preload('cargo') // cargo registrado en el contrato
            .preload('pasos') // pasos del contrato (vista)
            .preload('eventos') // eventos del contrato (vista)
            .orderBy('fecha_inicio', 'desc')
        })

      return response.ok({
        message: 'Usuarios por razón social cargados exitosamente.',
        data: usuarios,
      })
    } catch (error: any) {
      console.error('Error al obtener usuarios de razón social:', error)
      return response.internalServerError({
        message: 'Error al obtener usuarios',
        error: error.message,
      })
    }
  }
}
