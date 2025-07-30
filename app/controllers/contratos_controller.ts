import type { HttpContext } from '@adonisjs/core/http'
import Contrato from '#models/contrato'

export default class ContratosController {
  /**
   * Listar todos los contratos
   */
  public async index({ response }: HttpContext) {
    try {
      const contratos = await Contrato.query()
        .preload('usuario')
        .preload('sede')
        .orderBy('id', 'desc')

      return response.ok(contratos)
    } catch (error) {
      console.error('Error al obtener contratos:', error)
      return response.internalServerError({
        message: 'Error al obtener contratos',
        error: error.message,
      })
    }
  }

  /**
   * Mostrar contrato por ID
   */
  public async show({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.query()
        .where('id', params.id)
        .preload('usuario')
        .preload('sede')
        .preload('pasos')
        .firstOrFail()

      return response.ok(contrato)
    } catch (error) {
      console.error('Error al obtener contrato por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Contrato no encontrado' })
      }
      return response.internalServerError({
        message: 'Error al obtener contrato',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo contrato (sede se obtiene del usuario autenticado)
   */
  public async store({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const payload = request.only([
        'usuarioId',
        'tipoContrato',
        'estado',
        'fechaInicio',
        'fechaFin',
      ])

      const contrato = await Contrato.create({
        ...payload,
        sedeId: user.sedeId, // ✅ Aquí asignamos automáticamente la sede del funcionario logueado
      })

      await contrato.load('usuario')
      await contrato.load('sede')

      return response.created(contrato)
    } catch (error) {
      console.error('Error al crear contrato:', error)
      return response.internalServerError({
        message: 'Error al crear contrato',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un contrato
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)

      const payload = request.only(['tipoContrato', 'estado', 'fechaInicio', 'fechaFin'])

      contrato.merge(payload)
      await contrato.save()

      await contrato.load('usuario')
      await contrato.load('sede')

      return response.ok(contrato)
    } catch (error) {
      console.error('Error al actualizar contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Contrato no encontrado para actualizar' })
      }
      return response.internalServerError({
        message: 'Error al actualizar contrato',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un contrato
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)
      await contrato.delete()
      return response.ok({ message: 'Contrato eliminado correctamente' })
    } catch (error) {
      console.error('Error al eliminar contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Contrato no encontrado para eliminar' })
      }
      return response.internalServerError({
        message: 'Error al eliminar contrato',
        error: error.message,
      })
    }
  }
}
