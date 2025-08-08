import type { HttpContext } from '@adonisjs/core/http'
import ContratoPaso from '#models/contrato_paso'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'
import { DateTime } from 'luxon'

export default class ContratoPasosController {
  /**
   * Listar todos los pasos de contrato
   */
  public async index({ response }: HttpContext) {
    try {
      const pasos = await ContratoPaso.query().orderBy('id', 'desc')
      return response.ok(pasos)
    } catch (error) {
      console.error('Error al obtener pasos de contrato:', error)
      return response.internalServerError({
        message: 'Error al obtener pasos de contrato',
        error: error.message,
      })
    }
  }

  /**
   * Mostrar un paso de contrato por ID
   */
  public async show({ params, response }: HttpContext) {
    try {
      const paso = await ContratoPaso.findOrFail(params.id)
      return response.ok(paso)
    } catch (error) {
      console.error('Error al obtener paso de contrato por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso de contrato no encontrado' })
      }
      return response.internalServerError({
        message: 'Error al obtener paso de contrato',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo paso de contrato
   */
  public async store({ request, response }: HttpContext) {
    const payload = request.only([
      'contratoId',
      'fase',
      'nombrePaso',
      'fecha',
      'observacion',
      'orden',
      'completado',
    ])
    const archivoPaso = request.file('archivo')

    try {
      let archivoUrl: string | undefined = undefined

      if (archivoPaso) {
        if (!archivoPaso.isValid) {
          const error = archivoPaso.errors[0]
          return response.badRequest({
            message: error?.message || 'Archivo adjunto inválido.',
          })
        }
        // ✅ CORRECCIÓN: Verificar tmpPath antes de usarlo
        if (!archivoPaso.tmpPath) {
          return response.internalServerError({ message: 'No se pudo obtener la ruta temporal del archivo.' });
        }

        const uploadDir = `uploads/pasos_contrato/${payload.contratoId}`
        const fileName = `${cuid()}.${archivoPaso.extname}`
        const destinationDir = path.join(app.publicPath(), uploadDir)
        await fs.mkdir(destinationDir, { recursive: true })
        const fullPath = path.join(destinationDir, fileName)
        await fs.copyFile(archivoPaso.tmpPath, fullPath)
        archivoUrl = `/${uploadDir}/${fileName}`
      }

      const paso = await ContratoPaso.create({
        ...payload,
        fecha: payload.fecha ? DateTime.fromISO(payload.fecha) : undefined,
        completado: payload.completado === 'true' || payload.completado === true,
        archivoUrl: archivoUrl,
      })

      return response.created(paso)
    } catch (error) {
      console.error('Error al crear paso de contrato:', error)
      return response.internalServerError({
        message: 'Error al crear paso de contrato',
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

      const payload = request.only([
        'fase',
        'nombrePaso',
        'fecha',
        'observacion',
        'orden',
        'completado',
      ])
      const archivoPaso = request.file('archivo')

      let archivoUrl: string | undefined | null = paso.archivoUrl

      if (archivoPaso) {
        if (!archivoPaso.isValid) {
          const error = archivoPaso.errors[0]
          return response.badRequest({
            message: error?.message || 'Archivo adjunto inválido.',
          })
        }
        // ✅ CORRECCIÓN: Verificar tmpPath antes de usarlo
        if (!archivoPaso.tmpPath) {
          return response.internalServerError({ message: 'No se pudo obtener la ruta temporal del archivo.' });
        }

        // Eliminar archivo anterior si existe
        if (paso.archivoUrl) {
          const oldFilePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''))
          try {
            await fs.unlink(oldFilePath)
          } catch (unlinkError: any) {
            if (unlinkError.code !== 'ENOENT') {
              console.error('Error al eliminar archivo anterior del paso:', unlinkError)
            }
          }
        }

        const uploadDir = `uploads/pasos_contrato/${paso.contratoId}`
        const fileName = `${cuid()}.${archivoPaso.extname}`
        const destinationDir = path.join(app.publicPath(), uploadDir)
        await fs.mkdir(destinationDir, { recursive: true })
        const fullPath = path.join(destinationDir, fileName)
        await fs.copyFile(archivoPaso.tmpPath, fullPath)
        archivoUrl = `/${uploadDir}/${fileName}`
      } else if (request.input('clearArchivo')) {
        // Opción para eliminar el archivo sin subir uno nuevo
        if (paso.archivoUrl) {
          const oldFilePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''))
          try {
            await fs.unlink(oldFilePath)
          } catch (unlinkError: any) {
            if (unlinkError.code !== 'ENOENT') {
              console.error('Error al eliminar archivo anterior del paso (clear):', unlinkError)
            }
          }
        }
        archivoUrl = null // Establecer a null para borrar la referencia en la DB
      }

      paso.merge({
        ...payload,
        fecha: payload.fecha ? DateTime.fromISO(payload.fecha) : undefined,
        completado: payload.completado === 'true' || payload.completado === true,
        archivoUrl: archivoUrl,
      })

      await paso.save()

      return response.ok(paso)
    } catch (error) {
      console.error('Error al actualizar paso de contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso de contrato no encontrado para actualizar' })
      }
      return response.internalServerError({
        message: 'Error al actualizar paso de contrato',
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

      // Eliminar el archivo asociado si existe
      if (paso.archivoUrl) {
        const filePath = path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, ''))
        try {
          await fs.unlink(filePath)
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo del paso:', unlinkError)
          }
        }
      }

      await paso.delete()
      return response.ok({ message: 'Paso de contrato eliminado correctamente' })
    } catch (error) {
      console.error('Error al eliminar paso de contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso de contrato no encontrado para eliminar' })
      }
      return response.internalServerError({
        message: 'Error al eliminar paso de contrato',
        error: error.message,
      })
    }
  }
}
