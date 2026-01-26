// app/controllers/descuentos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Descuento from '#models/descuento'

export default class DescuentosController {
  /**
   * Listar todos los descuentos
   */
  async index({ response }: HttpContext) {
    try {
      const descuentos = await Descuento.query().orderBy('id', 'asc')
      return response.ok({
        success: true,
        data: descuentos,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los descuentos',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un descuento específico
   */
  async show({ params, response }: HttpContext) {
    try {
      const descuento = await Descuento.findOrFail(params.id)
      return response.ok({
        success: true,
        data: descuento,
      })
    } catch (error) {
      return response.notFound({
        success: false,
        message: 'Descuento no encontrado',
      })
    }
  }

  /**
   * Crear un nuevo descuento
   */
  async store({ request, response }: HttpContext) {
    try {
      const payload = request.only([
        'codigo',
        'nombre',
        'valorCarro',
        'valorMoto',
        'descripcion',
        'activo',
      ])
      const descuento = await Descuento.create(payload)

      return response.created({
        success: true,
        message: 'Descuento creado exitosamente',
        data: descuento,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Error al crear el descuento',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un descuento existente
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const descuento = await Descuento.findOrFail(params.id)
      const payload = request.only([
        'codigo',
        'nombre',
        'valorCarro',
        'valorMoto',
        'descripcion',
        'activo',
      ])

      descuento.merge(payload)
      await descuento.save()

      return response.ok({
        success: true,
        message: 'Descuento actualizado exitosamente',
        data: descuento,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Error al actualizar el descuento',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un descuento
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const descuento = await Descuento.findOrFail(params.id)

      // Desactivar en lugar de eliminar
      descuento.activo = false
      await descuento.save()

      return response.ok({
        success: true,
        message: 'Descuento desactivado exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Error al desactivar el descuento',
      })
    }
  }

  /**
   * Obtener descuentos activos
   */
  async activos({ response }: HttpContext) {
    try {
      const descuentos = await Descuento.query().where('activo', true).orderBy('nombre', 'asc')
      return response.ok({
        success: true,
        data: descuentos,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los descuentos activos',
      })
    }
  }
}
