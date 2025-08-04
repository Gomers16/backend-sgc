import type { HttpContext } from '@adonisjs/core/http'
import Contrato from '#models/contrato'
import app from '@adonisjs/core/services/app' // Importa el servicio 'app' para manejo de archivos
import { DateTime } from 'luxon' // Asegúrate de importar DateTime si lo usas para fechas

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
        // ✅ IMPORTANTE: Si el frontend espera los eventos aquí, también precárgalos
        // .preload('eventos') // Descomenta esta línea si necesitas los eventos aquí
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
        sedeId: user.sedeId, // Aquí asignamos automáticamente la sede del funcionario logueado
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
   * Método para anexar un contrato físico y crear el registro en la DB
   */
  public async anexarFisico({ request, response }: HttpContext) {
    try {
      const usuarioId = request.input('usuarioId')
      const tipoContrato = request.input('tipoContrato')
      const fechaInicio = request.input('fechaInicio')
      const fechaFin = request.input('fechaFin')

      const archivoContrato = request.file('archivo')

      if (!archivoContrato) {
        return response.badRequest({ message: 'No se adjuntó ningún archivo de contrato.' })
      }

      const uploadDir = 'uploads/contratos'
      const fileName = `${Date.now()}_${archivoContrato.clientName}`
      const filePathInPublic = `${uploadDir}/${fileName}`

      await archivoContrato.move(app.publicPath(uploadDir), {
        name: fileName,
      })

      const publicUrl = `/${filePathInPublic}`

      const contrato = await Contrato.create({
        usuarioId: usuarioId,
        sedeId: 1, // <<-- ✅ IMPORTANTE: Reemplaza '1' con un ID de sede válido de tu DB
        tipoContrato: tipoContrato,
        estado: 'activo',
        fechaInicio: DateTime.fromISO(fechaInicio),
        fechaFin: fechaFin ? DateTime.fromISO(fechaFin) : undefined,
        nombreArchivoContratoFisico: fileName,
        rutaArchivoContratoFisico: publicUrl,
      })

      await contrato.load('usuario')
      await contrato.load('sede')

      return response.created(contrato)
    } catch (error) {
      console.error('Error al anexar contrato físico:', error)
      return response.internalServerError({
        message: 'Error al anexar contrato físico',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un contrato (para actualizaciones parciales como el estado)
   * Este método ahora maneja las peticiones PATCH de forma más robusta.
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)

      // Obtenemos todos los campos que podrían ser actualizados.
      // `request.only` devolverá `undefined` para los campos no presentes en la petición.
      const payload = request.only(['tipoContrato', 'estado', 'fechaInicio', 'fechaFin', 'nombreArchivoContratoFisico', 'rutaArchivoContratoFisico'])

      // Iteramos sobre el payload y solo asignamos los valores que no son `undefined`.
      // Esto es crucial para las actualizaciones PATCH, donde no todos los campos están presentes.
      Object.keys(payload).forEach(key => {
        // Manejo especial para fechas que pueden ser nulas
        if (key === 'fechaInicio' && payload.fechaInicio !== undefined) {
          contrato.fechaInicio = DateTime.fromISO(payload.fechaInicio)
        } else if (key === 'fechaFin' && payload.fechaFin !== undefined) {
          // Permite que fechaFin sea null si se envía explícitamente null
          contrato.fechaFin = payload.fechaFin ? DateTime.fromISO(payload.fechaFin) : null
        } else if (payload[key] !== undefined) {
          // Asigna otros campos si no son undefined
          (contrato as any)[key] = payload[key]
        }
      })

      await contrato.save()

      // Recargar relaciones para la respuesta, asegurando que los datos estén completos
      await contrato.load('usuario')
      await contrato.load('sede')
      await contrato.load('pasos')
      // ✅ IMPORTANTE: Si el frontend espera los eventos aquí, también precárgalos
      // await contrato.load('eventos') // Descomenta esta línea si necesitas los eventos aquí

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