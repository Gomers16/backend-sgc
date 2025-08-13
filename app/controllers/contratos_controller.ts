// src/app/controllers/contratos_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import Contrato from '#models/contrato'
import ContratoPaso from '#models/contrato_paso'
import ContratoHistorialEstado from '#models/contrato_historial_estado'
import ContratoSalario from '#models/contrato_salario'
import Usuario from '#models/usuario'
import ContratoCambio from '#models/contrato_cambio'
import EntidadSalud from '#models/entidad_salud'
import Sede from '#models/sede'
import Cargo from '#models/cargo'
import RazonSocial from '#models/razon_social'

import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'
import db from '@adonisjs/lucid/services/db'

type Estado = 'activo' | 'inactivo'

export default class ContratosController {
  /* ============================
     Helpers internos
  ============================ */

  /** Convierte a 'YYYY-MM-DD' o null sin romper si no es DateTime */
  private toIsoDate(value: any): string | null {
    if (!value) return null
    if (typeof value?.toISODate === 'function') return value.toISODate()
    if (typeof value === 'string') {
      const dt = DateTime.fromISO(value)
      return dt.isValid ? dt.toISODate() : null
    }
    if (value instanceof Date) return DateTime.fromJSDate(value).toISODate()
    return null
  }

  /** Convierte a DateTime o null */
  private toDateTime(value: any): DateTime | null {
    if (!value) return null
    if (typeof value?.toISO === 'function') return value as DateTime
    if (typeof value === 'string') {
      const dt = DateTime.fromISO(value)
      return dt.isValid ? dt : null
    }
    if (value instanceof Date) return DateTime.fromJSDate(value)
    return null
  }

  /** Serializa para columnas JSON (old_value/new_value) */
  private json(value: any): string {
    return JSON.stringify(value ?? null)
  }

  /** Obtiene el actor (usuario que hace la acción) con fallbacks */
  private getActorId(ctx: HttpContext): number | null {
    const { auth, request } = ctx
    const fromAuth = auth?.user?.id
    const fromHeader = Number(request.header('x-actor-id'))
    const fromBody = Number(request.input('actorId') ?? request.input('usuarioId'))
    return (
      fromAuth ??
      (Number.isFinite(fromHeader) ? fromHeader : null) ??
      (Number.isFinite(fromBody) ? fromBody : null) ??
      null
    )
  }

  /** Normaliza valores por campo (evita falsos cambios tipo 0 vs false) */
  private normalizeForField(campo: string, v: any): any {
    if (v === undefined) return undefined
    if (v === null) return null
    if (campo === 'tieneRecomendacionesMedicas') {
      if (typeof v === 'boolean') return v
      const s = String(v).trim().toLowerCase()
      return s === '1' || s === 'true' || s === 'si' || s === 'sí'
    }
    return v
  }

  /** Para campos *_Id devuelve { id, nombre } — o el valor tal cual si no aplica */
  private async wrapValueWithName(campo: string, val: any): Promise<any> {
    if (val === null || val === undefined || val === '') return null
    if (typeof val === 'object') return val

    const num = Number(val)
    if (!Number.isFinite(num)) return val

    switch (campo) {
      case 'epsId':
      case 'arlId':
      case 'afpId':
      case 'afcId':
      case 'ccfId': {
        const ent = await EntidadSalud.find(num)
        return { id: num, nombre: ent?.nombre ?? `#${num}` }
      }
      case 'sedeId': {
        const s = await Sede.find(num)
        return { id: num, nombre: s?.nombre ?? `#${num}` }
      }
      case 'cargoId': {
        const c = await Cargo.find(num)
        return { id: num, nombre: c?.nombre ?? `#${num}` }
      }
      case 'razonSocialId': {
        const r = await RazonSocial.find(num)
        return { id: num, nombre: r?.nombre ?? `#${num}` }
      }
      default:
        return val
    }
  }

  /** Relaciones comunes */
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
        historialQuery.preload('usuario').orderBy('fecha_cambio', 'desc')
      })
      .preload('salarios', (salarioQuery: any) => {
        salarioQuery.orderBy('fecha_efectiva', 'desc').limit(1)
      })
      .preload('cambios', (q: any) => {
        q.preload('usuario').orderBy('created_at', 'desc')
      })
  }

  /* ============================
     SINCRONIZACIÓN USUARIO
  ============================ */

  private async getContratoPrioritario(usuarioId: number): Promise<Contrato | null> {
    const activo = await Contrato
      .query()
      .where('usuarioId', usuarioId)
      .where('estado', 'activo' as Estado)
      .orderBy('fechaInicio', 'desc')
      .first()
    if (activo) return activo

    const masReciente = await Contrato
      .query()
      .where('usuarioId', usuarioId)
      .orderBy('fechaInicio', 'desc')
      .first()
    return masReciente ?? null
  }

  private copiarCamposContratoEnUsuario(src: Contrato, user: Usuario) {
    user.razonSocialId = src.razonSocialId
    user.sedeId = src.sedeId
    user.cargoId = src.cargoId
    if (src.centroCosto !== undefined && src.centroCosto !== null) user.centroCosto = src.centroCosto
    if (src.epsId != null) user.epsId = src.epsId
    if (src.arlId != null) user.arlId = src.arlId
    if (src.afpId != null) user.afpId = src.afpId
    if (src.afcId != null) user.afcId = src.afcId
    if (src.ccfId != null) user.ccfId = src.ccfId
  }

  private async syncUsuarioTrasGuardarContrato(contrato: Contrato) {
    if (!contrato.usuarioId) return
    const user = await Usuario.find(contrato.usuarioId)
    if (!user) return

    if (contrato.estado === 'activo') {
      this.copiarCamposContratoEnUsuario(contrato, user)
      await user.save()
      return
    }

    const primary = await this.getContratoPrioritario(contrato.usuarioId)
    if (primary) {
      this.copiarCamposContratoEnUsuario(primary, user)
      await user.save()
    }
  }

  /* ============================
     CRUD
  ============================ */

  public async index(ctx: HttpContext) {
    const { response } = ctx
    try {
      const query = Contrato.query()
      this.preloadRelations(query)
      const contratos = await query.orderBy('id', 'desc')
      return response.ok(contratos)
    } catch (error: any) {
      console.error('Error al obtener contratos:', error)
      return response.internalServerError({ message: 'Error al obtener contratos', error: error.message })
    }
  }

  public async show(ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const query = Contrato.query().where('id', params.id)
      this.preloadRelations(query)
      const contrato = await query.firstOrFail()
      return response.ok(contrato)
    } catch (error: any) {
      console.error('Error al obtener contrato por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      return response.internalServerError({ message: 'Error al obtener contrato', error: error.message })
    }
  }

  public async getContratosUsuario(ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const usuarioId = params.usuarioId
      const query = Contrato.query().where('usuarioId', usuarioId)
      this.preloadRelations(query)
      const contratos = await query.orderBy('fechaInicio', 'desc')
      return response.ok(contratos)
    } catch (error: any) {
      console.error('Error al obtener contratos del usuario:', error)
      return response.internalServerError({ message: 'Error al obtener contratos del usuario', error: error.message })
    }
  }

  public async store(ctx: HttpContext) {
    const { request, response } = ctx
    const trx = await db.transaction()
    try {
      const actorId = this.getActorId(ctx)
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

      const fechaInicioLuxon = contratoData.fechaInicio ? DateTime.fromISO(contratoData.fechaInicio) : undefined
      const fechaTerminacionLuxon = fechaTerminacion ? DateTime.fromISO(fechaTerminacion) : undefined

      const contrato = await Contrato.create(
        {
          ...contratoData,
          razonSocialId: contratoData.razonSocialId,
          fechaInicio: fechaInicioLuxon,
          fechaTerminacion: fechaTerminacionLuxon || null,
          estado: 'activo',
          terminoContrato: contratoData.tipoContrato === 'prestacion' ? null : contratoData.terminoContrato || 'indefinido',
        },
        { client: trx }
      )

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

      await ContratoHistorialEstado.create(
        {
          contratoId: contrato.id,
          usuarioId: actorId,
          oldEstado: 'inactivo',
          newEstado: 'activo',
          fechaCambio: DateTime.now(),
          fechaInicioContrato: contrato.fechaInicio,
          motivo: 'Creación de contrato',
        },
        { client: trx }
      )

      await ContratoCambio.create(
        {
          contratoId: contrato.id,
          usuarioId: actorId,
          campo: 'creacion',
          oldValue: this.json(null),
          newValue: this.json({ estado: 'activo' }),
        },
        { client: trx }
      )

      await trx.commit()
      await this.syncUsuarioTrasGuardarContrato(contrato)
      await contrato.load((loader) => this.preloadRelations(loader))
      return response.created(contrato)
    } catch (error: any) {
      await trx.rollback()
      console.error('Error al crear contrato:', error)
      return response.internalServerError({ message: 'Error al crear contrato', error: error.message })
    }
  }

  public async anexarFisico(ctx: HttpContext) {
    const { request, response } = ctx
    const trx = await db.transaction()
    try {
      const actorId = this.getActorId(ctx)
      const contratoId = request.input('contratoId')

      if (contratoId) {
        const contrato = await Contrato.findOrFail(contratoId)

        const archivoContrato = request.file('archivo', { size: '5mb', extnames: ['pdf'] })
        if (!archivoContrato || !archivoContrato.isValid) {
          throw new Error(archivoContrato?.errors[0]?.message || 'Archivo de contrato inválido o no adjunto.')
        }

        const razonSocialId = request.input('razonSocialId')
        if (razonSocialId) contrato.razonSocialId = Number(razonSocialId)

        if (contrato.rutaArchivoContratoFisico) {
          try {
            await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoContratoFisico.replace(/^\//, '')))
          } catch (e: any) {
            if (e.code !== 'ENOENT') console.error('No se pudo eliminar archivo anterior:', e)
          }
        }

        const uploadDir = 'uploads/contratos'
        const fileName = `${cuid()}_${archivoContrato.clientName}`
        const destinationDir = path.join(app.publicPath(), uploadDir)
        await fs.mkdir(destinationDir, { recursive: true })
        await archivoContrato.move(destinationDir, { name: fileName })

        contrato.nombreArchivoContratoFisico = fileName
        contrato.rutaArchivoContratoFisico = `/${uploadDir}/${fileName}`

        if (request.input('tieneRecomendacionesMedicas') === 'true') {
          const archivoRec = request.file('archivoRecomendacionMedica', { size: '5mb', extnames: ['pdf', 'doc', 'docx'] })
          if (!archivoRec || !archivoRec.isValid) {
            throw new Error(archivoRec?.errors[0]?.message || 'Archivo de recomendación médica inválido o no adjunto.')
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
        await this.syncUsuarioTrasGuardarContrato(contrato)
        await contrato.load((loader) => this.preloadRelations(loader))
        return response.ok({ message: 'Archivo anexado correctamente', contrato })
      }

      // ====== MODO B (legacy): Crear + anexar ======
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

      if (!contratoData.sedeId) return response.badRequest({ message: "El campo 'sedeId' es obligatorio." })

      const fechaInicioLuxon = contratoData.fechaInicio ? DateTime.fromISO(contratoData.fechaInicio) : undefined
      const fechaTerminacionLuxon = fechaTerminacion ? DateTime.fromISO(fechaTerminacion) : undefined

      const archivoContratoLegacy = request.file('archivoContrato', { size: '5mb', extnames: ['pdf'] })
      if (!archivoContratoLegacy || !archivoContratoLegacy.isValid) {
        throw new Error(archivoContratoLegacy?.errors[0]?.message || 'Archivo de contrato inválido o no adjunto.')
      }

      const uploadDir = 'uploads/contratos'
      const fileName = `${cuid()}_${archivoContratoLegacy.clientName}`
      const destinationDir = path.join(app.publicPath(), uploadDir)
      await fs.mkdir(destinationDir, { recursive: true })
      await archivoContratoLegacy.move(destinationDir, { name: fileName })
      const publicUrl = `/${uploadDir}/${fileName}`

      let rutaArchivoRecomendacionMedica: string | null = null
      if (tieneRecomendacionesMedicas === 'true') {
        const archivoRecomendacion = request.file('archivoRecomendacionMedica', { size: '5mb', extnames: ['pdf', 'doc', 'docx'] })
        if (!archivoRecomendacion || !archivoRecomendacion.isValid) {
          throw new Error(archivoRecomendacion?.errors[0]?.message || 'Archivo de recomendación médica inválido o no adjunto.')
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
          terminoContrato: contratoData.tipoContrato === 'prestacion' ? null : contratoData.terminoContrato || 'indefinido',
          tieneRecomendacionesMedicas: tieneRecomendacionesMedicas === 'true',
          rutaArchivoRecomendacionMedica: rutaArchivoRecomendacionMedica,
        },
        { client: trx }
      )

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

      await ContratoHistorialEstado.create(
        {
          contratoId: contrato.id,
          usuarioId: actorId,
          oldEstado: 'inactivo',
          newEstado: 'activo',
          fechaCambio: DateTime.now(),
          fechaInicioContrato: contrato.fechaInicio,
          motivo: 'Creación de contrato',
        },
        { client: trx }
      )

      await ContratoCambio.create(
        {
          contratoId: contrato.id,
          usuarioId: actorId,
          campo: 'creacion',
          oldValue: this.json(null),
          newValue: this.json({ estado: 'activo' }),
        },
        { client: trx }
      )

      await trx.commit()
      await this.syncUsuarioTrasGuardarContrato(contrato)
      await contrato.load((loader) => this.preloadRelations(loader))
      return response.created({ message: 'Contrato creado y anexado correctamente.', contrato })
    } catch (error: any) {
      await trx.rollback()
      console.error('Error en anexarFisico (crear y/o anexar):', error)
      return response.badRequest({ message: error.message || 'Error al crear y anexar contrato físico' })
    }
  }

  public async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const trx = await db.transaction()
    try {
      const actorId = this.getActorId(ctx)
      const contrato = await Contrato.findOrFail(params.id)
      const oldEstado = contrato.estado

      const currentSalario = await ContratoSalario.query({ client: trx })
        .where('contratoId', contrato.id)
        .orderBy('fecha_efectiva', 'desc')
        .first()

      const before = {
        razonSocialId: contrato.razonSocialId,
        sedeId: contrato.sedeId,
        cargoId: contrato.cargoId,
        funcionesCargo: contrato.funcionesCargo,
        tipoContrato: contrato.tipoContrato,
        terminoContrato: (contrato as any).terminoContrato ?? null,
        fechaInicio: this.toIsoDate(contrato.fechaInicio),
        fechaTerminacion: this.toIsoDate(contrato.fechaTerminacion),
        periodoPrueba: (contrato as any).periodoPrueba ?? null,
        horarioTrabajo: (contrato as any).horarioTrabajo ?? null,
        centroCosto: contrato.centroCosto ?? null,
        epsId: contrato.epsId ?? null,
        arlId: contrato.arlId ?? null,
        afpId: contrato.afpId ?? null,
        afcId: contrato.afcId ?? null,
        ccfId: contrato.ccfId ?? null,
        estado: contrato.estado,
        motivoFinalizacion: contrato.motivoFinalizacion ?? null,
        tieneRecomendacionesMedicas: contrato.tieneRecomendacionesMedicas ?? null,
        salarioBasico: currentSalario?.salarioBasico ?? null,
        bonoSalarial: currentSalario?.bonoSalarial ?? null,
        auxilioTransporte: currentSalario?.auxilioTransporte ?? null,
        auxilioNoSalarial: currentSalario?.auxilioNoSalarial ?? null,
      }

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

      // Normalización y fechas
      if (payload.fechaInicio !== undefined && typeof payload.fechaInicio === 'string') {
        contrato.fechaInicio = DateTime.fromFormat(payload.fechaInicio, 'yyyy-MM-dd').startOf('day').toUTC()
      }
      if (payload.fechaTerminacion !== undefined && typeof payload.fechaTerminacion === 'string') {
        contrato.fechaTerminacion = DateTime.fromFormat(payload.fechaTerminacion, 'yyyy-MM-dd').startOf('day').toUTC()
      }

      // Normaliza boolean para evitar 0 vs false
      if (payload.tieneRecomendacionesMedicas !== undefined) {
        (payload as any).tieneRecomendacionesMedicas = this.normalizeForField(
          'tieneRecomendacionesMedicas',
          payload.tieneRecomendacionesMedicas
        )
      }

      if (payload.tieneRecomendacionesMedicas === false && contrato.rutaArchivoRecomendacionMedica) {
        try {
          await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, '')))
          contrato.rutaArchivoRecomendacionMedica = null
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') console.error('Error al eliminar archivo de recomendación:', unlinkError)
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

      // ======= Salario =======
      const sbRaw  = salarioBasico
      const bsRaw  = bonoSalarial
      const atRaw  = auxilioTransporte
      const ansRaw = auxilioNoSalarial

      const salarioFueEnviado =
        sbRaw !== undefined || bsRaw !== undefined || atRaw !== undefined || ansRaw !== undefined

      let nuevoSalario: { salarioBasico: number; bonoSalarial: number; auxilioTransporte: number; auxilioNoSalarial: number } | null = null

      if (contrato.tipoContrato !== 'prestacion' && salarioFueEnviado) {
        const base = currentSalario || { salarioBasico: 0, bonoSalarial: 0, auxilioTransporte: 0, auxilioNoSalarial: 0 }
        const toNumberOr = (v: any, fallback: number) => {
          if (v === undefined || v === '' || v === null) return fallback
          const n = Number(v)
          return Number.isFinite(n) ? n : fallback
        }

        const nuevo = {
          salarioBasico:     toNumberOr(sbRaw,  base.salarioBasico),
          bonoSalarial:      toNumberOr(bsRaw,  base.bonoSalarial),
          auxilioTransporte: toNumberOr(atRaw,  base.auxilioTransporte),
          auxilioNoSalarial: toNumberOr(ansRaw, base.auxilioNoSalarial),
        }

        const hayCambio =
          !currentSalario ||
          currentSalario.salarioBasico     !== nuevo.salarioBasico ||
          currentSalario.bonoSalarial      !== nuevo.bonoSalarial ||
          currentSalario.auxilioTransporte !== nuevo.auxilioTransporte ||
          currentSalario.auxilioNoSalarial !== nuevo.auxilioNoSalarial

        if (hayCambio) {
          nuevoSalario = nuevo
          if (currentSalario) {
            currentSalario.merge({ ...nuevo, fechaEfectiva: DateTime.now() })
            await currentSalario.save({ client: trx })
          } else {
            await ContratoSalario.create({ contratoId: contrato.id, ...nuevo, fechaEfectiva: DateTime.now() }, { client: trx })
          }
        }
      }
      // ======= Fin salario =======

      if (oldEstado !== contrato.estado) {
        const fechaInicioHist = this.toDateTime(contrato.fechaInicio)
        await ContratoHistorialEstado.create(
          {
            contratoId: contrato.id,
            usuarioId: actorId,
            oldEstado,
            newEstado: contrato.estado,
            fechaCambio: DateTime.now(),
            fechaInicioContrato: fechaInicioHist ?? null,
            motivo: contrato.estado === 'inactivo' ? contrato.motivoFinalizacion : null,
          },
          { client: trx }
        )
      }

      // Construcción de cambios
      const after = {
        razonSocialId: contrato.razonSocialId,
        sedeId: contrato.sedeId,
        cargoId: contrato.cargoId,
        funcionesCargo: contrato.funcionesCargo,
        tipoContrato: contrato.tipoContrato,
        terminoContrato: (contrato as any).terminoContrato ?? null,
        fechaInicio: this.toIsoDate(contrato.fechaInicio),
        fechaTerminacion: this.toIsoDate(contrato.fechaTerminacion),
        periodoPrueba: (contrato as any).periodoPrueba ?? null,
        horarioTrabajo: (contrato as any).horarioTrabajo ?? null,
        centroCosto: contrato.centroCosto ?? null,
        epsId: contrato.epsId ?? null,
        arlId: contrato.arlId ?? null,
        afpId: contrato.afpId ?? null,
        afcId: contrato.afcId ?? null,
        ccfId: contrato.ccfId ?? null,
        estado: contrato.estado,
        motivoFinalizacion: contrato.motivoFinalizacion ?? null,
        tieneRecomendacionesMedicas: contrato.tieneRecomendacionesMedicas ?? null,
        salarioBasico: nuevoSalario ? nuevoSalario.salarioBasico : (currentSalario?.salarioBasico ?? null),
        bonoSalarial: nuevoSalario ? nuevoSalario.bonoSalarial : (currentSalario?.bonoSalarial ?? null),
        auxilioTransporte: nuevoSalario ? nuevoSalario.auxilioTransporte : (currentSalario?.auxilioTransporte ?? null),
        auxilioNoSalarial: nuevoSalario ? nuevoSalario.auxilioNoSalarial : (currentSalario?.auxilioNoSalarial ?? null),
      }

      const camposTrackeables: (keyof typeof after)[] = [
        'razonSocialId','sedeId','cargoId','funcionesCargo','tipoContrato','terminoContrato',
        'fechaInicio','fechaTerminacion','periodoPrueba','horarioTrabajo','centroCosto',
        'epsId','arlId','afpId','afcId','ccfId','estado','motivoFinalizacion',
        'tieneRecomendacionesMedicas','salarioBasico','bonoSalarial','auxilioTransporte','auxilioNoSalarial',
      ]

      const cambios: Array<{ contratoId: number; usuarioId: number | null; campo: string; oldValue: any; newValue: any }> = []

      const rawBody = request.body()

      for (const campo of camposTrackeables) {
        const vinoEnPayload =
          campo === 'salarioBasico' || campo === 'bonoSalarial' || campo === 'auxilioTransporte' || campo === 'auxilioNoSalarial'
            ? salarioFueEnviado
            : Object.prototype.hasOwnProperty.call(rawBody, campo)

        if (!vinoEnPayload) continue

        const oldV = this.normalizeForField(String(campo), (before as any)[campo])
        const newV = this.normalizeForField(String(campo), (after as any)[campo])

        // compara normalizado para evitar 0 vs false, etc.
        if (JSON.stringify(oldV) === JSON.stringify(newV)) continue

        const oldWrapped = await this.wrapValueWithName(String(campo), oldV)
        const newWrapped = await this.wrapValueWithName(String(campo), newV)

        cambios.push({
          contratoId: contrato.id,
          usuarioId: actorId,
          campo: String(campo),
          oldValue: this.json(oldWrapped),
          newValue: this.json(newWrapped),
        })
      }

      if (cambios.length > 0) {
        await ContratoCambio.createMany(cambios, { client: trx })
      }

      await trx.commit()
      await this.syncUsuarioTrasGuardarContrato(contrato)
      await contrato.load((loader) => this.preloadRelations(loader))
      return response.ok(contrato)
    } catch (error: any) {
      await trx.rollback()
      console.error('Error al actualizar contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado para actualizar' })
      return response.internalServerError({ message: 'Error al actualizar contrato', error: error.message })
    }
  }

  public async updateRecomendacionMedica(ctx: HttpContext) {
    const { params, request, response } = ctx
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
        throw new Error(archivoRecomendacion?.errors[0]?.message || 'Archivo de recomendación médica inválido.')
      }

      if (contrato.rutaArchivoRecomendacionMedica) {
        try {
          await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, '')))
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') console.error('Error al eliminar archivo de recomendación anterior en update:', unlinkError)
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
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      return response.internalServerError({ message: 'Error al actualizar el archivo de recomendación médica', error: error.message })
    }
  }

  public async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const contrato = await Contrato.findOrFail(params.id)
      await contrato.delete()
      return response.ok({ message: 'Contrato eliminado correctamente' })
    } catch (error: any) {
      console.error('Error al eliminar contrato:', error)
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado para eliminar' })
      return response.internalServerError({ message: 'Error al eliminar contrato', error: error.message })
    }
  }

  public async uploadRecomendacionMedica(ctx: HttpContext) {
    const { params, request, response } = ctx
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
          if (unlinkError.code !== 'ENOENT') console.error('Error al eliminar archivo de recomendación anterior:', unlinkError)
        }
      }

      const uploadDir = `uploads/pasos/${paso.contratoId}`
      const fileName = `${cuid()}.${archivo.extname}`
      const publicPathDir = path.join(app.publicPath(), uploadDir)
      await fs.mkdir(publicPathDir, { recursive: true })

      await archivo.move(publicPathDir, { name: fileName })

      ;(paso as any).nombreArchivo = archivo.clientName
      paso.archivoUrl = `/${uploadDir}/${fileName}`

      await paso.save()

      return response.ok(paso)
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Paso de contrato no encontrado.' })
      console.error('Error al subir recomendación médica:', error)
      return response.internalServerError({ message: 'Error al subir recomendación médica', error: error.message })
    }
  }

  /* =========================
     SALARIOS
  ========================= */

  public async storeSalario(ctx: HttpContext) {
    return this.createSalario(ctx)
  }

  public async listSalarios(ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const salarios = await ContratoSalario.query()
        .where('contratoId', params.contratoId)
        .orderBy('fecha_efectiva', 'desc')

      return response.ok(salarios)
    } catch (error: any) {
      console.error('Error al listar salarios:', error)
      return response.internalServerError({ message: 'Error al listar salarios', error: error.message })
    }
  }

  public async createSalario(ctx: HttpContext) {
    const { params, request, response } = ctx
    try {
      const contrato = await Contrato.findOrFail(params.contratoId)

      const {
        salarioBasico = 0,
        bonoSalarial = 0,
        auxilioTransporte = 0,
        auxilioNoSalarial = 0,
        fechaEfectiva,
      } = request.only(['salarioBasico','bonoSalarial','auxilioTransporte','auxilioNoSalarial','fechaEfectiva'])

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
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      return response.badRequest({ message: error.message || 'Error al crear salario' })
    }
  }
}
