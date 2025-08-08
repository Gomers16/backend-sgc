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
   * Carga todas las relaciones comunes de un contrato.
   */
  private preloadRelations(query: any) { // Explicitly type query as any
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
      .preload('historialEstados', (historialQuery: any) => { // Explicitly type historialQuery as any
        historialQuery.preload('usuario')
      })
      .preload('salarios', (salarioQuery: any) => { // Explicitly type salarioQuery as any
        salarioQuery.orderBy('fecha_efectiva', 'desc').limit(1)
      })
  }

  /**
   * Obtiene todos los contratos paginados con sus relaciones.
   */
  public async index({ response }: HttpContext) {
    try {
      const query = Contrato.query()
      this.preloadRelations(query)
      const contratos = await query.orderBy('id', 'desc')
      return response.ok(contratos)
    } catch (error: any) { // Explicitly type error
      console.error('Error al obtener contratos:', error)
      return response.internalServerError({
        message: 'Error al obtener contratos',
        error: error.message,
      })
    }
  }

  /**
   * Obtiene un contrato por su ID con todas sus relaciones.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const query = Contrato.query().where('id', params.id)
      this.preloadRelations(query)
      const contrato = await query.firstOrFail()
      return response.ok(contrato)
    } catch (error: any) { // Explicitly type error
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
   * Obtiene todos los contratos para un usuario específico.
   */
  public async getContratosUsuario({ params, response }: HttpContext) {
    try {
      const usuarioId = params.usuarioId
      const query = Contrato.query().where('usuarioId', usuarioId)
      this.preloadRelations(query)
      const contratos = await query.orderBy('fechaInicio', 'desc')

      return response.ok(contratos)
    } catch (error: any) { // Explicitly type error
      console.error('Error al obtener contratos del usuario:', error)
      return response.internalServerError({
        message: 'Error al obtener contratos del usuario',
        error: error.message,
      })
    }
  }

  /**
   * Crea un nuevo contrato.
   */
  public async store({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const allRequestData = request.all()

      // Renombrado de 'fechaFin' a 'fechaTerminacion' en la desestructuración
      const { pasos, salarioBasico, bonoSalarial, auxilioTransporte, auxilioNoSalarial, fechaTerminacion, ...contratoData } = allRequestData

      // Convertir fechas a Luxon
      const fechaInicioLuxon = contratoData.fechaInicio ? DateTime.fromISO(contratoData.fechaInicio) : undefined
      // Uso de 'fechaTerminacion' en lugar de 'fechaFin'
      const fechaTerminacionLuxon = fechaTerminacion ? DateTime.fromISO(fechaTerminacion) : undefined

      const contrato = await Contrato.create({
        ...contratoData,
        fechaInicio: fechaInicioLuxon,
        fechaTerminacion: fechaTerminacionLuxon || null, // Asignación a 'fechaTerminacion'
        estado: 'activo',
        terminoContrato: contratoData.tipoContrato === 'prestacion' ? null : (contratoData.terminoContrato || 'indefinido'), // Termino de contrato es nulo para prestación
      }, { client: trx })

      // Crear el registro de salario solo si el tipo de contrato no es "prestacion"
      if (contratoData.tipoContrato !== 'prestacion' && salarioBasico !== undefined) {
        await ContratoSalario.create({
          contratoId: contrato.id,
          salarioBasico: salarioBasico || 0,
          bonoSalarial: bonoSalarial || 0,
          auxilioTransporte: auxilioTransporte || 0,
          auxilioNoSalarial: auxilioNoSalarial || 0,
          fechaEfectiva: DateTime.now(), // Correct use of DateTime.now()
        }, { client: trx })
      }

      const pasosRecibidos = JSON.parse(pasos || '[]') // Parse pasos from string
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

      await ContratoHistorialEstado.create({
        contratoId: contrato.id,
        usuarioId: contrato.usuarioId,
        oldEstado: 'inactivo',
        newEstado: 'activo',
        fechaCambio: DateTime.now(),
        fechaInicioContrato: contrato.fechaInicio,
        motivo: 'Creación de contrato',
      }, { client: trx })

      await trx.commit()

      await contrato.load((loader) => this.preloadRelations(loader))
      return response.created(contrato)
    } catch (error: any) { // Explicitly type error
      await trx.rollback()
      console.error('Error al crear contrato:', error)
      return response.internalServerError({
        message: 'Error al crear contrato',
        error: error.message,
      })
    }
  }

  /**
   * Crea un nuevo contrato y anexa un archivo físico en una sola operación.
   */
  public async anexarFisico({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const allRequestData = request.all()

      // Renombrado de 'fechaFin' a 'fechaTerminacion' en la desestructuración
      // Añadido 'tieneRecomendacionesMedicas' y 'archivoRecomendacionMedica'
      const {
        pasos,
        salarioBasico,
        bonoSalarial,
        auxilioTransporte,
        auxilioNoSalarial,
        fechaTerminacion, // Usar fechaTerminacion
        tieneRecomendacionesMedicas, // Añadido
        ...contratoData
      } = allRequestData

      if (!contratoData.sedeId) {
        return response.badRequest({ message: "El campo 'sedeId' es obligatorio." });
      }

      const fechaInicioLuxon = contratoData.fechaInicio ? DateTime.fromISO(contratoData.fechaInicio) : undefined
      // Uso de 'fechaTerminacion' en lugar de 'fechaFin'
      const fechaTerminacionLuxon = fechaTerminacion ? DateTime.fromISO(fechaTerminacion) : undefined

      const archivoContrato = request.file('archivoContrato', {
        size: '5mb',
        extnames: ['pdf'],
      })

      if (!archivoContrato || !archivoContrato.isValid) {
        throw new Error(archivoContrato?.errors[0]?.message || 'Archivo de contrato inválido o no adjunto.')
      }

      const uploadDir = 'uploads/contratos'
      const fileName = `${cuid()}_${archivoContrato.clientName}`
      const destinationDir = path.join(app.publicPath(), uploadDir)

      await fs.mkdir(destinationDir, { recursive: true })
      await archivoContrato.move(destinationDir, { name: fileName })
      const publicUrl = `/${uploadDir}/${fileName}`

      // Manejo del archivo de recomendación médica
      let rutaArchivoRecomendacionMedica: string | null = null;
      if (tieneRecomendacionesMedicas === 'true') { // El valor viene como string 'true' o 'false' de FormData
        const archivoRecomendacion = request.file('archivoRecomendacionMedica', {
          size: '5mb',
          extnames: ['pdf', 'doc', 'docx'],
        });

        if (!archivoRecomendacion || !archivoRecomendacion.isValid) {
          throw new Error(archivoRecomendacion?.errors[0]?.message || 'Archivo de recomendación médica inválido o no adjunto.');
        }

        const recomendacionUploadDir = 'uploads/recomendaciones_medicas';
        const recomendacionFileName = `${cuid()}_${archivoRecomendacion.clientName}`;
        const recomendacionDestinationDir = path.join(app.publicPath(), recomendacionUploadDir);

        await fs.mkdir(recomendacionDestinationDir, { recursive: true });
        await archivoRecomendacion.move(recomendacionDestinationDir, { name: recomendacionFileName });
        rutaArchivoRecomendacionMedica = `/${recomendacionUploadDir}/${recomendacionFileName}`;
      }

      const contrato = await Contrato.create({
        ...contratoData,
        fechaInicio: fechaInicioLuxon,
        fechaTerminacion: fechaTerminacionLuxon || null, // Asignación a 'fechaTerminacion'
        estado: 'activo',
        nombreArchivoContratoFisico: fileName, // Correct property name
        rutaArchivoContratoFisico: publicUrl, // Correct property name
        terminoContrato: contratoData.tipoContrato === 'prestacion' ? null : (contratoData.terminoContrato || 'indefinido'), // Termino de contrato es nulo para prestación
        tieneRecomendacionesMedicas: tieneRecomendacionesMedicas === 'true', // Asignación del booleano
        rutaArchivoRecomendacionMedica: rutaArchivoRecomendacionMedica, // Asignación de la ruta
      }, { client: trx })

      // Crear el registro de salario solo si el tipo de contrato no es "prestacion"
      if (contratoData.tipoContrato !== 'prestacion' && salarioBasico !== undefined) {
        await ContratoSalario.create({
          contratoId: contrato.id,
          salarioBasico: salarioBasico || 0,
          bonoSalarial: bonoSalarial || 0,
          auxilioTransporte: auxilioTransporte || 0,
          auxilioNoSalarial: auxilioNoSalarial || 0,
          fechaEfectiva: DateTime.now(), // Correct use of DateTime.now()
        }, { client: trx })
      }

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

      await ContratoHistorialEstado.create({
        contratoId: contrato.id,
        usuarioId: contrato.usuarioId,
        oldEstado: 'inactivo',
        newEstado: 'activo',
        fechaCambio: DateTime.now(),
        fechaInicioContrato: contrato.fechaInicio,
        motivo: 'Creación de contrato',
      }, { client: trx })

      await trx.commit()

      await contrato.load((loader) => this.preloadRelations(loader))

      return response.created({
        message: 'Contrato creado y anexado correctamente.',
        contrato: contrato,
      })
    } catch (error: any) { // Explicitly type error
      await trx.rollback()
      console.error('Error en anexarFisico (crear y anexar):', error)
      return response.internalServerError({
        message: 'Error al crear y anexar contrato físico',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza un contrato existente.
   */
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
        // Renombrado de 'fechaFin' a 'fechaTerminacion'
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
        // Añadido para recomendaciones médicas
        'tieneRecomendacionesMedicas',
      ])

      const salarioPayload = request.only([
        'salarioBasico',
        'bonoSalarial',
        'auxilioTransporte',
        'auxilioNoSalarial',
      ])

      // Convertir fechas a Luxon si vienen como string
      if (payload.fechaInicio !== undefined && typeof payload.fechaInicio === 'string') {
        contrato.fechaInicio = DateTime.fromFormat(payload.fechaInicio, 'yyyy-MM-dd').startOf('day').toUTC()
      }
      // Uso de 'fechaTerminacion' en lugar de 'fechaFin'
      if (payload.fechaTerminacion !== undefined && typeof payload.fechaTerminacion === 'string') {
        contrato.fechaTerminacion = DateTime.fromFormat(payload.fechaTerminacion, 'yyyy-MM-dd').startOf('day').toUTC()
      }

      // Manejo del archivo de recomendación médica en la actualización
      if (request.hasFile('archivoRecomendacionMedica')) {
        const archivoRecomendacion = request.file('archivoRecomendacionMedica', {
          size: '5mb',
          extnames: ['pdf', 'doc', 'docx'],
        });

        if (!archivoRecomendacion || !archivoRecomendacion.isValid) {
          throw new Error(archivoRecomendacion?.errors[0]?.message || 'Archivo de recomendación médica inválido o no adjunto.');
        }

        // Eliminar archivo anterior si existe
        if (contrato.rutaArchivoRecomendacionMedica) {
          try {
            await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, '')));
          } catch (unlinkError: any) {
            if (unlinkError.code !== 'ENOENT') {
              console.error('Error al eliminar archivo de recomendación anterior en update:', unlinkError);
            }
          }
        }

        const recomendacionUploadDir = 'uploads/recomendaciones_medicas';
        const recomendacionFileName = `${cuid()}_${archivoRecomendacion.clientName}`;
        const recomendacionDestinationDir = path.join(app.publicPath(), recomendacionUploadDir);

        await fs.mkdir(recomendacionDestinationDir, { recursive: true });
        await archivoRecomendacion.move(recomendacionDestinationDir, { name: recomendacionFileName });
        contrato.rutaArchivoRecomendacionMedica = `/${recomendacionUploadDir}/${recomendacionFileName}`;
      } else if (payload.tieneRecomendacionesMedicas === 'false' && contrato.rutaArchivoRecomendacionMedica) {
        // Si el checkbox se desmarca y había un archivo, eliminarlo
        try {
          await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, '')));
          contrato.rutaArchivoRecomendacionMedica = null;
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo de recomendación al desmarcar checkbox:', unlinkError);
          }
        }
      }


      // Actualizar el contrato principal
      contrato.merge(payload)
      await contrato.save({ client: trx })

      // Verificar si los datos de salario han cambiado y crear un nuevo registro si es así
      // Solo si el tipo de contrato no es "prestacion"
      if (
        contrato.tipoContrato !== 'prestacion' &&
        currentSalario &&
        (
          currentSalario.salarioBasico !== salarioPayload.salarioBasico ||
          currentSalario.bonoSalarial !== salarioPayload.bonoSalarial ||
          currentSalario.auxilioTransporte !== salarioPayload.auxilioTransporte ||
          currentSalario.auxilioNoSalarial !== salarioPayload.auxilioNoSalarial
        )
      ) {
        await ContratoSalario.create({
            contratoId: contrato.id,
            salarioBasico: salarioPayload.salarioBasico || 0,
            bonoSalarial: salarioPayload.bonoSalarial || 0,
            auxilioTransporte: salarioPayload.auxilioTransporte || 0,
            auxilioNoSalarial: salarioPayload.auxilioNoSalarial || 0,
            fechaEfectiva: DateTime.now(), // Correct use of DateTime.now()
          },
          { client: trx }
        )
      }

      if (oldEstado !== contrato.estado) {
        await ContratoHistorialEstado.create({
            contratoId: contrato.id,
            usuarioId: null, // Asume que un usuario autenticado lo hizo
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
    } catch (error: any) { // Explicitly type error
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

  /**
   * Elimina un contrato.
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)
      await contrato.delete()
      return response.ok({ message: 'Contrato eliminado correctamente' })
    } catch (error: any) { // Explicitly type error
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

  /**
   * Sube un archivo de recomendación médica para un paso de contrato específico.
   */
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

      // Elimina el archivo anterior si existe
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
}
