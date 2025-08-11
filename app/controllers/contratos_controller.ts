// src/app/controllers/contratos_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import Contrato from '#models/contrato'
import ContratoPaso from '#models/contrato_paso'
import ContratoHistorialEstado from '#models/contrato_historial_estado'
import ContratoSalario from '#models/contrato_salario'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'
import db from '@adonisjs/lucid/services/db'

export default class ContratosController {
  /**
   * Relacionado común para contratos.
   */
  private preloadRelations(query: any) {
    query
      .preload('usuario')
      .preload('sede')
      .preload('cargo')
      .preload('eps')
      .preload('arl')
      .preload('afp')
      .preload('afc')
      .preload('ccf')
      .preload('pasos')
      .preload('eventos')
      .preload('historialEstados', (historialQuery: any) => {
        historialQuery.preload('usuario')
      })
      .preload('salarios', (salarioQuery: any) => {
        // la columna en DB es fecha_efectiva
        salarioQuery.orderBy('fecha_efectiva', 'desc').limit(1)
      })
  }

  /** Lista todos los contratos */
  public async index({ response }: HttpContext) {
    try {
      const query = Contrato.query()
      this.preloadRelations(query)
      const contratos = await query.orderBy('id', 'desc')
      return response.ok(contratos)
    } catch (error: any) {
      console.error('Error al obtener contratos:', error)
      return response.internalServerError({
        message: 'Error al obtener contratos',
        error: error.message,
      })
    }
  }

  /** Muestra un contrato por ID */
  public async show({ params, response }: HttpContext) {
    try {
      const query = Contrato.query().where('id', params.id)
      this.preloadRelations(query)
      const contrato = await query.firstOrFail()
      return response.ok(contrato)
    } catch (error: any) {
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

  /** Contratos de un usuario */
  public async getContratosUsuario({ params, response }: HttpContext) {
    try {
      const usuarioId = params.usuarioId
      const query = Contrato.query().where('usuarioId', usuarioId)
      this.preloadRelations(query)
      const contratos = await query.orderBy('fechaInicio', 'desc')
      return response.ok(contratos)
    } catch (error: any) {
      console.error('Error al obtener contratos del usuario:', error)
      return response.internalServerError({
        message: 'Error al obtener contratos del usuario',
        error: error.message,
      })
    }
  }

  /** Crea contrato (solo datos) */
  public async store({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const allRequestData = request.all()

      if (!allRequestData.razonSocialId) {
        return response.badRequest({ message: "El campo 'razonSocialId' es obligatorio." })
      }

      const {
        pasos,
        salarioBasico,
        bonoSalarial,
        auxilioTransporte,
        auxilioNoSalarial,
        fechaTerminacion,
        ...contratoData
      } = allRequestData

      const fechaInicioLuxon = contratoData.fechaInicio
        ? DateTime.fromISO(contratoData.fechaInicio)
        : undefined
      const fechaTerminacionLuxon = fechaTerminacion
        ? DateTime.fromISO(fechaTerminacion)
        : undefined

      const contrato = await Contrato.create(
        {
          ...contratoData,
          razonSocialId: contratoData.razonSocialId,
          fechaInicio: fechaInicioLuxon,
          fechaTerminacion: fechaTerminacionLuxon || null,
          estado: 'activo',
          terminoContrato:
            contratoData.tipoContrato === 'prestacion'
              ? null
              : contratoData.terminoContrato || 'indefinido',
        },
        { client: trx }
      )

      // Crear salario inicial si corresponde (no prestación)
      if (contratoData.tipoContrato !== 'prestacion' && salarioBasico !== undefined) {
        await ContratoSalario.create(
          {
            contratoId: contrato.id,
            salarioBasico: salarioBasico || 0,
            bonoSalarial: bonoSalarial || 0,
            auxilioTransporte: auxilioTransporte || 0,
            auxilioNoSalarial: auxilioNoSalarial || 0,
            fechaEfectiva: DateTime.now(),
          },
          { client: trx }
        )
      }

      // Pasos (si llegan)
      const pasosRecibidos = JSON.parse(pasos || '[]')
      const pasosParaGuardar: any[] = []
      if (Array.isArray(pasosRecibidos)) {
        for (const pasoData of pasosRecibidos) {
          pasosParaGuardar.push({
            contratoId: contrato.id,
            fase: pasoData.fase,
            nombrePaso: pasoData.nombrePaso,
            fecha: pasoData.fecha ? DateTime.fromISO(pasoData.fecha) : null,
            observacion: pasoData.observacion,
            orden: pasoData.orden,
            completado: pasoData.completado,
            archivoUrl: pasoData.archivoUrl || null,
          })
        }
      }
      if (pasosParaGuardar.length > 0) {
        await ContratoPaso.createMany(pasosParaGuardar, { client: trx })
      }

      // Historial estado
      await ContratoHistorialEstado.create(
        {
          contratoId: contrato.id,
          usuarioId: contrato.usuarioId,
          oldEstado: 'inactivo',
          newEstado: 'activo',
          fechaCambio: DateTime.now(),
          fechaInicioContrato: contrato.fechaInicio,
          motivo: 'Creación de contrato',
        },
        { client: trx }
      )

      await trx.commit()

      await contrato.load((loader) => this.preloadRelations(loader))
      return response.created(contrato)
    } catch (error: any) {
      await trx.rollback()
      console.error('Error al crear contrato:', error)
      return response.internalServerError({
        message: 'Error al crear contrato',
        error: error.message,
      })
    }
  }

  /**
   * Anexar archivo físico a contrato existente (MODO A) o
   * crear + anexar (legacy, MODO B).
   */
  public async anexarFisico({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const contratoId = request.input('contratoId')

      // ========== MODO A: Adjuntar a EXISTENTE ==========
      if (contratoId) {
        const contrato = await Contrato.findOrFail(contratoId)

        const archivoContrato = request.file('archivo', {
          size: '5mb',
          extnames: ['pdf'],
        })
        if (!archivoContrato || !archivoContrato.isValid) {
          throw new Error(
            archivoContrato?.errors[0]?.message || 'Archivo de contrato inválido o no adjunto.'
          )
        }

        // (opcional) actualizar razón social
        const razonSocialId = request.input('razonSocialId')
        if (razonSocialId) {
          contrato.razonSocialId = Number(razonSocialId)
        }

        // elimina archivo anterior si existe
        if (contrato.rutaArchivoContratoFisico) {
          try {
            await fs.unlink(
              path.join(app.publicPath(), contrato.rutaArchivoContratoFisico.replace(/^\//, ''))
            )
          } catch (e: any) {
            if (e.code !== 'ENOENT') console.error('No se pudo eliminar archivo anterior:', e)
          }
        }

        // subir archivo
        const uploadDir = 'uploads/contratos'
        const fileName = `${cuid()}_${archivoContrato.clientName}`
        const destinationDir = path.join(app.publicPath(), uploadDir)
        await fs.mkdir(destinationDir, { recursive: true })
        await archivoContrato.move(destinationDir, { name: fileName })

        contrato.nombreArchivoContratoFisico = fileName
        contrato.rutaArchivoContratoFisico = `/${uploadDir}/${fileName}`

        // (opcional) recomendación médica en el mismo request
        if (request.input('tieneRecomendacionesMedicas') === 'true') {
          const archivoRec = request.file('archivoRecomendacionMedica', {
            size: '5mb',
            extnames: ['pdf', 'doc', 'docx'],
          })
          if (!archivoRec || !archivoRec.isValid) {
            throw new Error(
              archivoRec?.errors[0]?.message || 'Archivo de recomendación médica inválido o no adjunto.'
            )
          }

          const recDir = 'uploads/recomendaciones_medicas'
          const recName = `${cuid()}_${archivoRec.clientName}`
          const recDest = path.join(app.publicPath(), recDir)
          await fs.mkdir(recDest, { recursive: true })
          await archivoRec.move(recDest, { name: recName })

          contrato.tieneRecomendacionesMedicas = true
          contrato.rutaArchivoRecomendacionMedica = `/${recDir}/${recName}`
        }

        await contrato.save({ client: trx })
        await trx.commit()

        await contrato.load((loader) => this.preloadRelations(loader))
        return response.ok({ message: 'Archivo anexado correctamente', contrato })
      }

      // ====== MODO B (legacy): Crear + anexar en un solo request ======
      const allRequestData = request.all()

      if (!allRequestData.razonSocialId) {
        return response.badRequest({ message: "El campo 'razonSocialId' es obligatorio." })
      }

      const {
        pasos,
        salarioBasico,
        bonoSalarial,
        auxilioTransporte,
        auxilioNoSalarial,
        fechaTerminacion,
        tieneRecomendacionesMedicas,
        ...contratoData
      } = allRequestData

      if (!contratoData.sedeId) {
        return response.badRequest({ message: "El campo 'sedeId' es obligatorio." })
      }

      const fechaInicioLuxon = contratoData.fechaInicio
        ? DateTime.fromISO(contratoData.fechaInicio)
        : undefined
      const fechaTerminacionLuxon = fechaTerminacion
        ? DateTime.fromISO(fechaTerminacion)
        : undefined

      // en legacy se usaba 'archivoContrato'
      const archivoContratoLegacy = request.file('archivoContrato', {
        size: '5mb',
        extnames: ['pdf'],
      })
      if (!archivoContratoLegacy || !archivoContratoLegacy.isValid) {
        throw new Error(
          archivoContratoLegacy?.errors[0]?.message || 'Archivo de contrato inválido o no adjunto.'
        )
      }

      const uploadDir = 'uploads/contratos'
      const fileName = `${cuid()}_${archivoContratoLegacy.clientName}`
      const destinationDir = path.join(app.publicPath(), uploadDir)
      await fs.mkdir(destinationDir, { recursive: true })
      await archivoContratoLegacy.move(destinationDir, { name: fileName })
      const publicUrl = `/${uploadDir}/${fileName}`

      // recomendación médica (opcional)
      let rutaArchivoRecomendacionMedica: string | null = null
      if (tieneRecomendacionesMedicas === 'true') {
        const archivoRecomendacion = request.file('archivoRecomendacionMedica', {
          size: '5mb',
          extnames: ['pdf', 'doc', 'docx'],
        })
        if (!archivoRecomendacion || !archivoRecomendacion.isValid) {
          throw new Error(
            archivoRecomendacion?.errors[0]?.message || 'Archivo de recomendación médica inválido o no adjunto.'
          )
        }
        const recomendacionUploadDir = 'uploads/recomendaciones_medicas'
        const recomendacionFileName = `${cuid()}_${archivoRecomendacion.clientName}`
        const recomendacionDestinationDir = path.join(app.publicPath(), recomendacionUploadDir)
        await fs.mkdir(recomendacionDestinationDir, { recursive: true })
        await archivoRecomendacion.move(recomendacionDestinationDir, { name: recomendacionFileName })
        rutaArchivoRecomendacionMedica = `/${recomendacionUploadDir}/${recomendacionFileName}`
      }

      const contrato = await Contrato.create(
        {
          ...contratoData,
          razonSocialId: contratoData.razonSocialId,
          fechaInicio: fechaInicioLuxon,
          fechaTerminacion: fechaTerminacionLuxon || null,
          estado: 'activo',
          nombreArchivoContratoFisico: fileName,
          rutaArchivoContratoFisico: publicUrl,
          terminoContrato:
            contratoData.tipoContrato === 'prestacion'
              ? null
              : contratoData.terminoContrato || 'indefinido',
          tieneRecomendacionesMedicas: tieneRecomendacionesMedicas === 'true',
          rutaArchivoRecomendacionMedica: rutaArchivoRecomendacionMedica,
        },
        { client: trx }
      )

      // salario inicial (si no es prestación)
      if (contratoData.tipoContrato !== 'prestacion' && salarioBasico !== undefined) {
        await ContratoSalario.create(
          {
            contratoId: contrato.id,
            salarioBasico: salarioBasico || 0,
            bonoSalarial: bonoSalarial || 0,
            auxilioTransporte: auxilioTransporte || 0,
            auxilioNoSalarial: auxilioNoSalarial || 0,
            fechaEfectiva: DateTime.now(),
          },
          { client: trx }
        )
      }

      // pasos
      const pasosRecibidos = JSON.parse(pasos || '[]')
      const pasosParaGuardar: any[] = []
      if (Array.isArray(pasosRecibidos)) {
        for (const pasoData of pasosRecibidos) {
          pasosParaGuardar.push({
            contratoId: contrato.id,
            fase: pasoData.fase,
            nombrePaso: pasoData.nombrePaso,
            fecha: pasoData.fecha ? DateTime.fromISO(pasoData.fecha) : null,
            observacion: pasoData.observacion,
            orden: pasoData.orden,
            completado: pasoData.completado,
            archivoUrl: pasoData.archivoUrl || null,
          })
        }
      }
      if (pasosParaGuardar.length > 0) {
        await ContratoPaso.createMany(pasosParaGuardar, { client: trx })
      }

      // historial
      await ContratoHistorialEstado.create(
        {
          contratoId: contrato.id,
          usuarioId: contrato.usuarioId,
          oldEstado: 'inactivo',
          newEstado: 'activo',
          fechaCambio: DateTime.now(),
          fechaInicioContrato: contrato.fechaInicio,
          motivo: 'Creación de contrato',
        },
        { client: trx }
      )

      await trx.commit()

      await contrato.load((loader) => this.preloadRelations(loader))
      return response.created({
        message: 'Contrato creado y anexado correctamente.',
        contrato,
      })
    } catch (error: any) {
      await trx.rollback()
      console.error('Error en anexarFisico (crear y/o anexar):', error)
      return response.badRequest({
        message: error.message || 'Error al crear y anexar contrato físico',
      })
    }
  }

  /** Actualiza contrato (datos, no archivos) */
  public async update({ params, request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const contrato = await Contrato.findOrFail(params.id)
      const oldEstado = contrato.estado

      const currentSalario = await ContratoSalario.query({ client: trx })
        .where('contratoId', contrato.id)
        .orderBy('fecha_efectiva', 'desc')
        .first()

      const payload = request.only([
        'identificacion',
        'sedeId',
        'cargoId',
        'funcionesCargo',
        'tipoContrato',
        'terminoContrato',
        'fechaInicio',
        'fechaTerminacion',
        'periodoPrueba',
        'horarioTrabajo',
        'centroCosto',
        'epsId',
        'arlId',
        'afpId',
        'afcId',
        'ccfId',
        'estado',
        'motivoFinalizacion',
        'salarioBasico',
        'bonoSalarial',
        'auxilioTransporte',
        'auxilioNoSalarial',
        'tieneRecomendacionesMedicas',
        'razonSocialId',
      ])

      if (payload.fechaInicio !== undefined && typeof payload.fechaInicio === 'string') {
        contrato.fechaInicio = DateTime.fromFormat(payload.fechaInicio, 'yyyy-MM-dd')
          .startOf('day')
          .toUTC()
      }
      if (payload.fechaTerminacion !== undefined && typeof payload.fechaTerminacion === 'string') {
        contrato.fechaTerminacion = DateTime.fromFormat(payload.fechaTerminacion, 'yyyy-MM-dd')
          .startOf('day')
          .toUTC()
      }

      // si desmarcan recomendaciones, borra archivo anterior si existía
      if (payload.tieneRecomendacionesMedicas === false && contrato.rutaArchivoRecomendacionMedica) {
        try {
          await fs.unlink(
            path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, ''))
          )
          contrato.rutaArchivoRecomendacionMedica = null
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo de recomendación:', unlinkError)
          }
        }
      }

      const {
        salarioBasico,
        bonoSalarial,
        auxilioTransporte,
        auxilioNoSalarial,
        ...contratoPayload
      } = payload

      contrato.merge(contratoPayload)
      await contrato.save({ client: trx })

      // Si cambian valores de salario, crea nuevo registro
      if (
        contrato.tipoContrato !== 'prestacion' &&
        (!currentSalario ||
          currentSalario.salarioBasico !== salarioBasico ||
          currentSalario.bonoSalarial !== bonoSalarial ||
          currentSalario.auxilioTransporte !== auxilioTransporte ||
          currentSalario.auxilioNoSalarial !== auxilioNoSalarial)
      ) {
        await ContratoSalario.create(
          {
            contratoId: contrato.id,
            salarioBasico: salarioBasico || 0,
            bonoSalarial: bonoSalarial || 0,
            auxilioTransporte: auxilioTransporte || 0,
            auxilioNoSalarial: auxilioNoSalarial || 0,
            fechaEfectiva: DateTime.now(),
          },
          { client: trx }
        )
      }

      // Historial de estado si cambió
      if (oldEstado !== contrato.estado) {
        await ContratoHistorialEstado.create(
          {
            contratoId: contrato.id,
            usuarioId: null,
            oldEstado: oldEstado,
            newEstado: contrato.estado,
            fechaCambio: DateTime.now(),
            fechaInicioContrato: contrato.fechaInicio,
            motivo: contrato.estado === 'inactivo' ? contrato.motivoFinalizacion : null,
          },
          { client: trx }
        )
      }

      await trx.commit()

      await contrato.load((loader) => this.preloadRelations(loader))
      return response.ok(contrato)
    } catch (error: any) {
      await trx.rollback()
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

  /** Actualiza SOLO el archivo de recomendación médica del contrato */
  public async updateRecomendacionMedica({ params, request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const contrato = await Contrato.findOrFail(params.id)

      if (!request.hasFile('archivoRecomendacionMedica')) {
        throw new Error('Archivo de recomendación médica no adjunto.')
      }

      const archivoRecomendacion = request.file('archivoRecomendacionMedica', {
        size: '5mb',
        extnames: ['pdf', 'doc', 'docx'],
      })

      if (!archivoRecomendacion || !archivoRecomendacion.isValid) {
        throw new Error(
          archivoRecomendacion?.errors[0]?.message || 'Archivo de recomendación médica inválido.'
        )
      }

      if (contrato.rutaArchivoRecomendacionMedica) {
        try {
          await fs.unlink(
            path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, ''))
          )
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo de recomendación anterior en update:', unlinkError)
          }
        }
      }

      const recomendacionUploadDir = 'uploads/recomendaciones_medicas'
      const recomendacionFileName = `${cuid()}_${archivoRecomendacion.clientName}`
      const recomendacionDestinationDir = path.join(app.publicPath(), recomendacionUploadDir)

      await fs.mkdir(recomendacionDestinationDir, { recursive: true })
      await archivoRecomendacion.move(recomendacionDestinationDir, { name: recomendacionFileName })
      contrato.rutaArchivoRecomendacionMedica = `/${recomendacionUploadDir}/${recomendacionFileName}`

      await contrato.save({ client: trx })
      await trx.commit()
      await contrato.load((loader) => this.preloadRelations(loader))

      return response.ok(contrato)
    } catch (error: any) {
      await trx.rollback()
      console.error('Error al actualizar el archivo de recomendación médica:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Contrato no encontrado' })
      }
      return response.internalServerError({
        message: 'Error al actualizar el archivo de recomendación médica',
        error: error.message,
      })
    }
  }

  /** Elimina contrato */
  public async destroy({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)
      await contrato.delete()
      return response.ok({ message: 'Contrato eliminado correctamente' })
    } catch (error: any) {
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

  /** Sube archivo de recomendación para un PASO específico */
  public async uploadRecomendacionMedica({ params, request, response }: HttpContext) {
    try {
      const paso = await ContratoPaso.query().where('id', params.pasoId).firstOrFail()

      const archivo = request.file('recomendacion', {
        size: '5mb',
        extnames: ['pdf', 'doc', 'docx', 'jpg', 'png'],
      })

      if (!archivo || !archivo.isValid) {
        throw new Error(archivo?.errors[0]?.message || 'Archivo de recomendación inválido.')
      }

      if (paso.archivoUrl) {
        try {
          await fs.unlink(path.join(app.publicPath(), paso.archivoUrl.replace(/^\//, '')))
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo de recomendación anterior:', unlinkError)
          }
        }
      }

      const uploadDir = `uploads/pasos/${paso.contratoId}`
      const fileName = `${cuid()}.${archivo.extname}`
      const publicPath = path.join(app.publicPath(), uploadDir)
      await fs.mkdir(publicPath, { recursive: true })

      await archivo.move(publicPath, { name: fileName })

      paso.nombreArchivo = archivo.clientName
      paso.archivoUrl = `/${uploadDir}/${fileName}`

      await paso.save()

      return response.ok(paso)
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Paso de contrato no encontrado.' })
      }
      console.error('Error al subir recomendación médica:', error)
      return response.internalServerError({
        message: 'Error al subir recomendación médica',
        error: error.message,
      })
    }
  }

  /* =========================
     SALARIOS
     ========================= */

  /** Alias para evitar el 500 en la ruta existente */
  public async storeSalario(ctx: HttpContext) {
    return this.createSalario(ctx)
  }

  /** Lista salarios de un contrato */
  public async listSalarios({ params, response }: HttpContext) {
    try {
      const salarios = await ContratoSalario.query()
        .where('contratoId', params.contratoId)
        .orderBy('fecha_efectiva', 'desc')

      return response.ok(salarios)
    } catch (error: any) {
      console.error('Error al listar salarios:', error)
      return response.internalServerError({
        message: 'Error al listar salarios',
        error: error.message,
      })
    }
  }

  /** Crea registro de salario para un contrato */
  public async createSalario({ params, request, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.contratoId)

      const {
        salarioBasico = 0,
        bonoSalarial = 0,
        auxilioTransporte = 0,
        auxilioNoSalarial = 0,
        fechaEfectiva, // ISO: 'YYYY-MM-DDTHH:mm:ss'
      } = request.only([
        'salarioBasico',
        'bonoSalarial',
        'auxilioTransporte',
        'auxilioNoSalarial',
        'fechaEfectiva',
      ])

      const fecha = fechaEfectiva ? DateTime.fromISO(fechaEfectiva) : DateTime.now()

      const registro = await ContratoSalario.create({
        contratoId: contrato.id,
        salarioBasico: Number(salarioBasico) || 0,
        bonoSalarial: Number(bonoSalarial) || 0,
        auxilioTransporte: Number(auxilioTransporte) || 0,
        auxilioNoSalarial: Number(auxilioNoSalarial) || 0,
        fechaEfectiva: fecha,
      })

      return response.created(registro)
    } catch (error: any) {
      console.error('Error al crear salario:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Contrato no encontrado' })
      }
      return response.badRequest({ message: error.message || 'Error al crear salario' })
    }
  }
}
