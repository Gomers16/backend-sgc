import type { HttpContext } from '@adonisjs/core/http'
import ContratoPaso from '#models/contrato_paso'
import Contrato from '#models/contrato'

export default class ContratoPasosController {
  /**
   * Obtener pasos de un contrato específico
   */
  public async index({ params, response }: HttpContext) {
    try {
      const pasos = await ContratoPaso.query()
        .where('contrato_id', params.contratoId)
        .orderBy('fase', 'asc')
        .orderBy('orden', 'asc')

      return response.ok(pasos)
    } catch (error) {
      console.error('Error al obtener pasos del contrato:', error)
      return response.internalServerError({
        message: 'Error al obtener pasos',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo paso para un contrato
   */
  public async store({ request, response, params }: HttpContext) {
    try {
      const contratoId = params.contratoId

      const contrato = await Contrato.findOrFail(contratoId)

      const data = request.only([
        'fase',
        'nombrePaso',
        'fecha',
        'archivo',
        'observacion',
        'orden',
        'completado',
      ])

      const paso = await ContratoPaso.create({
        ...data,
        contratoId: contrato.id,
      })

      return response.created(paso)
    } catch (error) {
      console.error('Error al crear paso de contrato:', error)
      return response.internalServerError({
        message: 'Error al crear paso',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un paso de contrato
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const paso = await ContratoPaso.findOrFail(params.id)

      const data = request.only([
        'fase',
        'nombrePaso',
        'fecha',
        'archivo',
        'observacion',
        'orden',
        'completado',
      ])

      paso.merge(data)
      await paso.save()

      return response.ok(paso)
    } catch (error) {
      console.error('Error al actualizar paso:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso no encontrado' })
      }
      return response.internalServerError({
        message: 'Error al actualizar paso',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un paso de contrato
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const paso = await ContratoPaso.findOrFail(params.id)
      await paso.delete()
      return response.ok({ message: 'Paso eliminado correctamente' })
    } catch (error) {
      console.error('Error al eliminar paso:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso no encontrado para eliminar' })
      }
      return response.internalServerError({
        message: 'Error al eliminar paso',
        error: error.message,
      })
    }
  }
}
