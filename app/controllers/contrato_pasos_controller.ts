import type { HttpContext } from '@adonisjs/core/http'
import ContratoPaso from '#models/contrato_paso'
import Contrato from '#models/contrato'
import app from '@adonisjs/core/services/app' // Necesario para mover archivos
import { cuid } from '@adonisjs/core/helpers' // Necesario para generar nombres de archivo únicos
import fs from 'node:fs/promises' // Para manejo de archivos
import path from 'node:path' // Para manejo de rutas

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

      await Contrato.findOrFail(contratoId) // Verifica que el contrato exista

      const data = request.only([
        'fase',
        'nombrePaso',
        'fecha',
        'observacion',
        'orden',
        'completado',
      ])

      const archivoPaso = request.file('archivo', { // 'archivo' es el nombre del campo que viene del frontend
        size: '5mb',
        extnames: ['pdf', 'jpg', 'png', 'jpeg'],
      })

      let archivoUrl: string | undefined = undefined;

      if (archivoPaso && archivoPaso.isValid) {
        const uploadDir = 'uploads/pasos_contrato';
        const fileName = `${cuid()}.${archivoPaso.extname}`;
        const destinationDir = path.join(app.publicPath(), uploadDir);
        await fs.mkdir(destinationDir, { recursive: true });
        const fullPath = path.join(destinationDir, fileName);
        await fs.copyFile(archivoPaso.tmpPath, fullPath);
        archivoUrl = `/${uploadDir}/${fileName}`;
      }

      const paso = await ContratoPaso.create({
        ...data,
        contratoId: contratoId,
        archivoUrl: archivoUrl, // ✅ Asigna a 'archivoUrl'
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
        'observacion',
        'orden',
        'completado',
      ])

      const archivoPaso = request.file('archivo', {
        size: '5mb',
        extnames: ['pdf', 'jpg', 'png', 'jpeg'],
      })

      if (archivoPaso && archivoPaso.isValid) {
        // Eliminar archivo anterior si existe
        if (typeof paso.archivoUrl === 'string' && paso.archivoUrl.length > 0) { // ✅ Verificación de tipo más explícita
          const oldFilePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''));
          try {
            await fs.unlink(oldFilePath);
          } catch (unlinkError: any) {
            if (unlinkError.code !== 'ENOENT') {
              console.error('Error al eliminar archivo de paso anterior:', unlinkError);
            }
          }
        }

        const uploadDir = 'uploads/pasos_contrato';
        const fileName = `${cuid()}.${archivoPaso.extname}`;
        const destinationDir = path.join(app.publicPath(), uploadDir);
        await fs.mkdir(destinationDir, { recursive: true });
        const fullPath = path.join(destinationDir, fileName);
        await fs.copyFile(archivoPaso.tmpPath, fullPath);
        paso.archivoUrl = `/${uploadDir}/${fileName}`; // ✅ Asigna a 'archivoUrl'
      } else if (request.input('clearArchivo')) { // Permite limpiar el archivo si se envía una bandera
        if (typeof paso.archivoUrl === 'string' && paso.archivoUrl.length > 0) { // ✅ Verificación de tipo más explícita
          const oldFilePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''));
          try {
            await fs.unlink(oldFilePath);
          } catch (unlinkError: any) {
            if (unlinkError.code !== 'ENOENT') {
              console.error('Error al eliminar archivo de paso al limpiar:', unlinkError);
            }
          }
        }
        paso.archivoUrl = undefined; // Limpia la URL del archivo
      }

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
      
      // Eliminar archivo asociado si existe
      if (typeof paso.archivoUrl === 'string' && paso.archivoUrl.length > 0) { // ✅ Verificación de tipo más explícita
        const filePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''));
        try {
          await fs.unlink(filePath);
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo de paso asociado:', unlinkError);
          }
        }
      }

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
