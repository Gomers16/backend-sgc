import type { HttpContext } from '@adonisjs/core/http'
import EntidadSalud from '#models/entidad_salud'

const TIPOS_VALIDOS = ['eps', 'arl', 'afp', 'afc', 'ccf'] as const
type TipoEntidad = (typeof TIPOS_VALIDOS)[number]

export default class EntidadesSaludController {
  /**
   * GET /entidades-salud?name=...&tipo=eps|arl|afp|afc|ccf
   * Listado con filtro opcional por nombre y tipo.
   */
  public async index({ request, response }: HttpContext) {
    try {
      const { name, tipo } = request.qs()

      let query = EntidadSalud.query().select('id', 'nombre', 'tipo').orderBy('nombre', 'asc')

      if (name) {
        query = query.where('nombre', 'like', `%${String(name)}%`)
      }
      if (tipo && TIPOS_VALIDOS.includes(String(tipo) as TipoEntidad)) {
        query = query.where('tipo', String(tipo))
      }

      const entidades = await query
      return response.ok({
        message: 'Lista de entidades de salud obtenida exitosamente.',
        data: entidades,
      })
    } catch (error: any) {
      console.error('Error al listar entidades de salud:', error)
      return response.internalServerError({
        message: 'Error al obtener entidades de salud',
        error: error.message,
      })
    }
  }

  /**
   * GET /entidades-salud/:id
   * Detalle por ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const entidad = await EntidadSalud.query()
        .where('id', Number(params.id))
        .select('id', 'nombre', 'tipo')
        .firstOrFail()

      return response.ok({
        message: 'Entidad de salud obtenida exitosamente.',
        data: entidad.serialize(),
      })
    } catch (error: any) {
      console.error('Error al obtener entidad de salud:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Entidad de salud no encontrada.' })
      }
      return response.internalServerError({
        message: 'Error al obtener entidad de salud',
        error: error.message,
      })
    }
  }

  /**
   * POST /entidades-salud
   * Crea una nueva entidad del catálogo.
   * Body: { nombre: string, tipo: 'eps'|'arl'|'afp'|'afc'|'ccf' }
   * (Sin validator: validación mínima inline)
   */
  public async store({ request, response }: HttpContext) {
    try {
      const nombre = String(request.input('nombre') || '').trim()
      const tipo = String(request.input('tipo') || '').trim() as TipoEntidad

      if (!nombre) {
        return response.badRequest({ message: 'El nombre es obligatorio.' })
      }
      if (!TIPOS_VALIDOS.includes(tipo)) {
        return response.badRequest({ message: 'Tipo inválido.' })
      }

      // Evitar duplicados por nombre+tipo (regla de negocio usual)
      const existe = await EntidadSalud.query()
        .where('nombre', nombre)
        .andWhere('tipo', tipo)
        .first()
      if (existe) {
        return response.conflict({ message: 'Ya existe una entidad con ese nombre y tipo.' })
      }

      const entidad = await EntidadSalud.create({ nombre, tipo })
      return response.created({
        message: 'Entidad de salud creada correctamente.',
        data: entidad.serialize(),
      })
    } catch (error: any) {
      console.error('Error al crear entidad de salud:', error)
      return response.internalServerError({
        message: 'Error al crear entidad de salud',
        error: error.message,
      })
    }
  }

  /**
   * PUT /entidades-salud/:id
   * Actualiza nombre y/o tipo.
   * Body: { nombre?: string, tipo?: 'eps'|'arl'|'afp'|'afc'|'ccf' }
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const entidad = await EntidadSalud.find(Number(params.id))
      if (!entidad) {
        return response.notFound({ message: 'Entidad de salud no encontrada.' })
      }

      const nombre = request.input('nombre')
      const tipo = request.input('tipo')

      if (nombre !== undefined) {
        const n = String(nombre).trim()
        if (!n) return response.badRequest({ message: 'El nombre no puede estar vacío.' })
        entidad.nombre = n
      }

      if (tipo !== undefined) {
        const t = String(tipo).trim() as TipoEntidad
        if (!TIPOS_VALIDOS.includes(t)) {
          return response.badRequest({ message: 'Tipo inválido.' })
        }
        entidad.tipo = t
      }

      // Verifica duplicado si cambiaron nombre o tipo
      const duplicado = await EntidadSalud.query()
        .where('nombre', entidad.nombre)
        .andWhere('tipo', entidad.tipo)
        .andWhereNot('id', entidad.id)
        .first()
      if (duplicado) {
        return response.conflict({ message: 'Ya existe una entidad con ese nombre y tipo.' })
      }

      await entidad.save()

      return response.ok({
        message: 'Entidad de salud actualizada correctamente.',
        data: entidad.serialize(),
      })
    } catch (error: any) {
      console.error('Error al actualizar entidad de salud:', error)
      return response.internalServerError({
        message: 'Error al actualizar entidad de salud',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /entidades-salud/:id
   * Elimina la entidad (ten en cuenta FKs en usuarios con ON DELETE SET NULL).
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const entidad = await EntidadSalud.find(Number(params.id))
      if (!entidad) {
        return response.notFound({ message: 'Entidad de salud no encontrada.' })
      }

      await entidad.delete()

      return response.ok({ message: 'Entidad de salud eliminada correctamente.' })
    } catch (error: any) {
      console.error('Error al eliminar entidad de salud:', error)
      return response.internalServerError({
        message: 'Error al eliminar entidad de salud',
        error: error.message,
      })
    }
  }
}
