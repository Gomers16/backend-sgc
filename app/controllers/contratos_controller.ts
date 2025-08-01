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
    // ✅ Eliminado 'auth' del desestructurado
    try {
      // ✅ Eliminado: const user = await auth.authenticate()

      // Valida y obtiene los datos del payload
      const usuarioId = request.input('usuarioId')
      const tipoContrato = request.input('tipoContrato')
      const fechaInicio = request.input('fechaInicio')
      const fechaFin = request.input('fechaFin') // Puede ser nulo o indefinido

      // Obtiene el archivo adjunto
      const archivoContrato = request.file('archivo')

      if (!archivoContrato) {
        return response.badRequest({ message: 'No se adjuntó ningún archivo de contrato.' })
      }

      // Define el subdirectorio dentro de 'public' para los uploads de contratos
      const uploadDir = 'uploads/contratos'
      // Define el nombre del archivo
      const fileName = `${Date.now()}_${archivoContrato.clientName}`
      // Define la ruta completa dentro de la carpeta pública
      const filePathInPublic = `${uploadDir}/${fileName}`

      // Mueve el archivo a la carpeta 'public/uploads/contratos'
      // Asegúrate de que el directorio 'public/uploads/contratos' exista y sea accesible
      await archivoContrato.move(app.publicPath(uploadDir), {
        name: fileName,
      })

      // La URL pública para acceder al archivo
      const publicUrl = `/${filePathInPublic}`

      // Crea el registro del contrato en la base de datos
      const contrato = await Contrato.create({
        usuarioId: usuarioId,
        // ✅ TEMPORAL: Asignación fija de sedeId.
        // Si esta ruta no requiere autenticación, sedeId debe venir del frontend
        // o ser determinado de otra manera (ej. un valor por defecto si aplica).
        sedeId: 1, // <<-- ✅ IMPORTANTE: Reemplaza '1' con un ID de sede válido de tu DB
        tipoContrato: tipoContrato,
        estado: 'activo', // Estado inicial del contrato
        fechaInicio: DateTime.fromISO(fechaInicio), // Convierte a DateTime
        fechaFin: fechaFin ? DateTime.fromISO(fechaFin) : undefined, // Convierte si existe
        nombreArchivoContratoFisico: fileName, // Guarda el nombre del archivo
        rutaArchivoContratoFisico: publicUrl, // Guarda la URL pública
      })

      // Carga las relaciones para la respuesta
      await contrato.load('usuario')
      await contrato.load('sede')

      return response.created(contrato) // Retorna el contrato creado
    } catch (error) {
      console.error('Error al anexar contrato físico:', error)
      return response.internalServerError({
        message: 'Error al anexar contrato físico',
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
