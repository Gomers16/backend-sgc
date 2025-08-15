import type { HttpContext } from '@adonisjs/core/http'
import ContratoEvento from '#models/contrato_evento'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class ContratoEventoController {
 
  /**
   * Obtener todos los eventos de un contrato específico.
   */
  public async index({ params, response }: HttpContext) {
    try {
      const eventos = await ContratoEvento.query().where('contrato_id', params.contratoId)
      return response.ok(eventos)
    } catch (error) {
      console.error('Error al obtener eventos del contrato:', error)
      return response.internalServerError({ message: 'Error al obtener eventos del contrato' })
    }
  }

  /**
   * Crear un nuevo evento para un contrato.
   */
  public async store({ request, response, params }: HttpContext) {
    const contratoId = params.contratoId

    // --- INICIO DE LÍNEAS DE DEPURACIÓN ---
    console.log('--- INICIANDO CONTROLEVENTS.STORE ---')
    console.log('Contrato ID:', contratoId)
    // --- FIN DE LÍNEAS DE DEPURACIÓN ---

    try {
      // 1. Obtener los datos del formulario, incluyendo el archivo
      const payload = request.only(['tipo', 'subtipo', 'fechaInicio', 'fechaFin', 'descripcion'])
      const documento = request.file('documento', {
        size: '2mb',
        extnames: ['jpg', 'png', 'pdf'],
      })
     
      // --- INICIO DE LÍNEAS DE DEPURACIÓN ---
      console.log('Payload recibido:', payload)
      // --- FIN DE LÍNEAS DE DEPURACIÓN ---

      if (!contratoId || !payload.tipo || !payload.fechaInicio) {
        // --- INICIO DE LÍNEAS DE DEPURACIÓN ---
        console.log('Error: Payload incompleto')
        // --- FIN DE LÍNEAS DE DEPURACIÓN ---
        return response.badRequest({ message: 'Faltan campos requeridos: contratoId, tipo o fechaInicio.' })
      }
     
      const newEvento = new ContratoEvento()

      // --- INICIO DE LÍNEAS DE DEPURACIÓN ---
      console.log('Instancia creada:', newEvento)
      console.log('newEvento es una instancia de ContratoEvento:', newEvento instanceof ContratoEvento)
      // --- FIN DE LÍNEAS DE DEPURACIÓN ---

      newEvento.contratoId = contratoId
      newEvento.merge(payload)
      newEvento.fechaInicio = DateTime.fromISO(payload.fechaInicio)
      newEvento.fechaFin = payload.fechaFin ? DateTime.fromISO(payload.fechaFin) : undefined
     
      // --- INICIO DE LÍNEAS DE DEPURACIÓN ---
      console.log('Objeto a guardar (antes de archivo):', newEvento)
      // Si usas relaciones precargadas en el modelo, podrías verlas aquí:
      // console.log('Relaciones (si precargadas):', newEvento.related('contrato'));
      // --- FIN DE LÍNEAS DE DEPURACIÓN ---

      // 2. Manejar la subida de archivos
      if (documento) {
        if (!documento.isValid) {
          const error = documento.errors[0]
          return response.badRequest({
            message: error.message,
          })
        }
       
        const uploadDir = `uploads/contratos/${contratoId}/eventos`
        const fileName = `${cuid()}.${documento.extname}`
       
        const destinationDir = path.join(app.publicPath(), uploadDir)
        await fs.mkdir(destinationDir, { recursive: true })
       
        await documento.move(destinationDir, { name: fileName })
        newEvento.documentoUrl = `/${uploadDir}/${fileName}`
      }

      // 3. Guardar el nuevo evento en la base de datos
      await newEvento.save()

      // --- INICIO DE LÍNEAS DE DEPURACIÓN ---
      console.log('¡Evento guardado con éxito!')
      // --- FIN DE LÍNEAS DE DEPURACIÓN ---

      return response.created(newEvento)
    } catch (error) {
      // --- INICIO DE LÍNEAS DE DEPURACIÓN ---
      console.log('Error capturado en el try-catch:', error)
      // --- FIN DE LÍNEAS DE DEPURACIÓN ---
      console.error('Error al crear evento de contrato:', error)
      return response.internalServerError({ message: 'Error al crear evento de contrato' })
    }
  }

  /**
   * Actualizar un evento existente.
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const evento = await ContratoEvento.findOrFail(params.id)
      const payload = request.only(['tipo', 'subtipo', 'fechaInicio', 'fechaFin', 'descripcion'])
     
      evento.merge(payload)
      evento.fechaInicio = DateTime.fromISO(payload.fechaInicio)
      evento.fechaFin = payload.fechaFin ? DateTime.fromISO(payload.fechaFin) : undefined
     
      // La lógica para actualizar el archivo adjunto es más compleja y se omite
      // Si el frontend envía un nuevo archivo, se debería eliminar el anterior
     
      await evento.save()
      return response.ok(evento)
    } catch (error) {
      console.error('Error al actualizar evento de contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Evento no encontrado' })
      }
      return response.internalServerError({ message: 'Error al actualizar evento de contrato' })
    }
  }

  /**
   * Eliminar un evento.
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const evento = await ContratoEvento.findOrFail(params.id)

      // Lógica para eliminar el archivo si existe
      if (evento.documentoUrl) {
        const filePath = path.join(app.publicPath(), evento.documentoUrl)
        try {
          await fs.unlink(filePath)
        } catch (unlinkError) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo adjunto:', unlinkError)
          }
        }
      }

      await evento.delete()
      return response.noContent()
    } catch (error) {
      console.error('Error al eliminar evento de contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Evento no encontrado' })
      }
      return response.internalServerError({ message: 'Error al eliminar evento de contrato' })
    }
  }
}
