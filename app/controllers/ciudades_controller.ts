// app/controllers/ciudades_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Ciudad from '#models/ciudad'

export default class CiudadesController {
  /**
   * GET /api/ciudades
   * Lista de ciudades con filtros opcionales
   */
  public async index({ request, response }: HttpContext) {
    try {
      const { name, activo, page, perPage } = request.qs()

      let query = Ciudad.query()
        .select('id', 'nombre', 'departamento', 'activo')
        .orderBy('nombre', 'asc')

      // Filtro por nombre
      if (name) {
        query = query.where('nombre', 'like', `%${name}%`)
      }

      // Filtro por activo
      if (activo !== undefined) {
        query = query.where('activo', activo === '1' || activo === 'true')
      }

      // Paginación o lista completa
      if (page && perPage) {
        const paginated = await query.paginate(Number(page), Number(perPage))
        return response.ok({
          data: paginated.all(),
          meta: paginated.getMeta(),
        })
      }

      // Sin paginación: devolver array directo
      const ciudades = await query.exec()

      // 🔥 IMPORTANTE: Serializar manualmente para evitar duplicados
      const ciudadesSerializadas = ciudades.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        departamento: c.departamento,
        activo: c.activo,
      }))

      return response.ok({
        data: ciudadesSerializadas,
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
   * GET /api/ciudades/:id
   * Obtener una ciudad por ID
   */
  public async show({ params, response }: HttpContext) {
    try {
      const ciudad = await Ciudad.query()
        .where('id', params.id)
        .select('id', 'nombre', 'departamento', 'activo')
        .firstOrFail()

      return response.ok({
        data: {
          id: ciudad.id,
          nombre: ciudad.nombre,
          departamento: ciudad.departamento,
          activo: ciudad.activo,
        },
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
