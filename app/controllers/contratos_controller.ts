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

// ⬇️ para servir el archivo descargable
import { createReadStream, existsSync, statSync } from 'node:fs'
import mime from 'mime-types'

type Estado = 'activo' | 'inactivo'
type TipoContrato = 'prestacion' | 'temporal' | 'laboral' | 'aprendizaje'

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
    if (typeof value?.toISO === 'function') return value as any
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

  /** Normaliza boolean-like a boolean o null */
  private toBoolOrNull(v: any): boolean | null {
    if (v === null || v === undefined) return null
    if (typeof v === 'boolean') return v
    if (typeof v === 'number') return v !== 0
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase()
      if (s === 'true' || s === '1' || s === 'si' || s === 'sí') return true
      if (s === 'false' || s === '0' || s === 'no') return false
      return s.length ? true : null
    }
    return !!v
  }

  /** Validación de tipo de contrato (evita truncados en DB) */
  private assertTipoContrato(tipo: any): asserts tipo is TipoContrato {
    const ok = ['prestacion', 'temporal', 'laboral', 'aprendizaje'].includes(String(tipo))
    if (!ok) {
      throw new Error("Valor inválido para 'tipoContrato'. Debe ser 'prestacion' | 'temporal' | 'laboral' | 'aprendizaje'.")
    }
  }

  /** ¿Requiere fecha de terminación? */
  private requiresEndDate(tipo: TipoContrato, terminoContrato: string | null | undefined): boolean {
    if (tipo === 'prestacion' || tipo === 'aprendizaje' || tipo === 'temporal') return true
    if (tipo === 'laboral') return (terminoContrato ?? '').toLowerCase() !== 'indefinido'
    return false
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
        fechaFin,
        fechaFinalizacion,
        fechaTerminacion: fechaTermInput,
        ...contratoData
      } = allRequestData

      // Validar tipo_contrato explícitamente
      this.assertTipoContrato(contratoData.tipoContrato)
      const tipo: TipoContrato = contratoData.tipoContrato

      // 🔹 salario: acepta 'salario' o 'salarioBasico' y lo exige si NO es prestación
      const rawSalario = allRequestData.salario ?? salarioBasico
      const salarioNum = Number(rawSalario)
      let salarioFinal: number
      if (tipo !== 'prestacion') {
        if (!Number.isFinite(salarioNum)) {
          await trx.rollback()
          return response.badRequest({
            message: "El campo 'salario' (o 'salarioBasico') es obligatorio para contratos de tipo " + tipo,
          })
        }
        salarioFinal = salarioNum
      } else {
        salarioFinal = Number.isFinite(salarioNum) ? salarioNum : 0
      }

      // alias robusto para fecha de terminación
      const aliasFechaTerm = fechaTermInput ?? fechaFin ?? fechaFinalizacion ?? null

      // normaliza '' a null para columnas numéricas/FK
      const nullIfEmpty = (v: any) => (v === '' || v === undefined ? null : v)

      const contratoDataNorm: any = {
        ...contratoData,
        usuarioId: nullIfEmpty(contratoData.usuarioId),
        razonSocialId: nullIfEmpty(contratoData.razonSocialId),
        sedeId: nullIfEmpty(contratoData.sedeId),
        cargoId: nullIfEmpty(contratoData.cargoId),
        epsId: nullIfEmpty(contratoData.epsId),
        arlId: nullIfEmpty(contratoData.arlId),
        afpId: nullIfEmpty(contratoData.afpId),
        afcId: nullIfEmpty(contratoData.afcId),
        ccfId: nullIfEmpty(contratoData.ccfId),
      }

      const fechaInicioLuxon = this.toDateTime(contratoDataNorm.fechaInicio)
      if (!fechaInicioLuxon) {
        await trx.rollback()
        return response.badRequest({ message: "La 'fechaInicio' es inválida o no fue enviada." })
      }

      // Reglas: fechaTerminacion requerida según tipo/termino
      const terminoEff =
        tipo === 'prestacion' || tipo === 'aprendizaje'
          ? null
          : (contratoDataNorm.terminoContrato ?? 'indefinido')

      if (this.requiresEndDate(tipo, terminoEff) && !aliasFechaTerm) {
        await trx.rollback()
        return response.badRequest({ message: "La 'fechaTerminacion' es obligatoria para el tipo de contrato enviado." })
      }

      const fechaTerminacionLuxon = this.toDateTime(aliasFechaTerm)

      const contrato = await Contrato.create(
        {
          ...contratoDataNorm,
          razonSocialId: contratoDataNorm.razonSocialId,
          fechaInicio: fechaInicioLuxon,
          fechaTerminacion: fechaTerminacionLuxon || null,
          estado: 'activo',
          // ✅ incluir salario para cumplir NOT NULL
          salario: salarioFinal,
          // aprendizaje sin término; prestación también
          terminoContrato:
            tipo === 'prestacion' || tipo === 'aprendizaje'
              ? null
              : (contratoDataNorm.terminoContrato || 'indefinido'),
        },
        { client: trx }
      )

      // crea salario histórico solo si no es prestación y el campo fue enviado explícitamente
      if (tipo !== 'prestacion' && salarioBasico !== undefined) {
        await ContratoSalario.create(
          {
            contratoId: contrato.id,
            salarioBasico: Number(salarioBasico) || 0,
            bonoSalarial: Number(bonoSalarial) || 0,
            auxilioTransporte: Number(auxilioTransporte) || 0,
            auxilioNoSalarial: Number(auxilioNoSalarial) || 0,
            fechaEfectiva: DateTime.now(),
          },
          { client: trx }
        )
      }

      // pasos robusto: acepta array o JSON string
      let pasosRecibidos: any[] = []
      if (Array.isArray(pasos)) {
        pasosRecibidos = pasos
      } else if (typeof pasos === 'string' && pasos.trim()) {
        try { pasosRecibidos = JSON.parse(pasos) } catch { pasosRecibidos = [] }
      }

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
            completado: !!pasoData.completado,
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
        // ====== MODO A: anexar a contrato existente ======
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

      // ====== MODO B (legacy): Crear + anexar en una sola llamada ======
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
        fechaFin,
        fechaFinalizacion,
        fechaTerminacion: fechaTermInput,
        tieneRecomendacionesMedicas,
        ...contratoData
      } = allRequestData

      // Validar tipo_contrato explícitamente
      this.assertTipoContrato(contratoData.tipoContrato)
      const tipo: TipoContrato = contratoData.tipoContrato

      // 🔹 salario: acepta 'salario' o 'salarioBasico' y lo exige si NO es prestación
      const rawSalario2 = allRequestData.salario ?? salarioBasico
      const salarioNum2 = Number(rawSalario2)
      let salarioFinal2: number
      if (tipo !== 'prestacion') {
        if (!Number.isFinite(salarioNum2)) {
          await trx.rollback()
          return response.badRequest({
            message: "El campo 'salario' (o 'salarioBasico') es obligatorio para contratos de tipo " + tipo,
          })
        }
        salarioFinal2 = salarioNum2
      } else {
        salarioFinal2 = Number.isFinite(salarioNum2) ? salarioNum2 : 0
      }

      // (en esta rama ya exigías sedeId; lo mantengo por compatibilidad)
      if (!contratoData.sedeId) return response.badRequest({ message: "El campo 'sedeId' es obligatorio." })

      const aliasFechaTerm = fechaTermInput ?? fechaFin ?? fechaFinalizacion ?? null

      const fechaInicioLuxon = this.toDateTime(contratoData.fechaInicio)
      if (!fechaInicioLuxon) {
        await trx.rollback()
        return response.badRequest({ message: "La 'fechaInicio' es inválida o no fue enviada." })
      }

      // Reglas: fechaTerminacion requerida según tipo/termino
      const terminoEff =
        tipo === 'prestacion' || tipo === 'aprendizaje'
          ? null
          : (contratoData.terminoContrato ?? 'indefinido')

      if (this.requiresEndDate(tipo, terminoEff) && !aliasFechaTerm) {
        await trx.rollback()
        return response.badRequest({ message: "La 'fechaTerminacion' es obligatoria para el tipo de contrato enviado." })
      }

      const fechaTerminacionLuxon = this.toDateTime(aliasFechaTerm)

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
          // ✅ incluir salario para cumplir NOT NULL
          salario: salarioFinal2,
          // aprendizaje sin término; prestación también
          terminoContrato:
            tipo === 'prestacion' || tipo === 'aprendizaje'
              ? null
              : (contratoData.terminoContrato || 'indefinido'),
          tieneRecomendacionesMedicas: tieneRecomendacionesMedicas === 'true',
          rutaArchivoRecomendacionMedica: rutaArchivoRecomendacionMedica,
        },
        { client: trx }
      )

      if (tipo !== 'prestacion' && salarioBasico !== undefined) {
        await ContratoSalario.create(
          {
            contratoId: contrato.id,
            salarioBasico: Number(salarioBasico) || 0,
            bonoSalarial: Number(bonoSalarial) || 0,
            auxilioTransporte: Number(auxilioTransporte) || 0,
            auxilioNoSalarial: Number(auxilioNoSalarial) || 0,
            fechaEfectiva: DateTime.now(),
          },
          { client: trx }
        )
      }

      let pasosRecibidos: any[] = []
      if (Array.isArray(pasos)) {
        pasosRecibidos = pasos
      } else if (typeof pasos === 'string' && pasos.trim()) {
        try { pasosRecibidos = JSON.parse(pasos) } catch { pasosRecibidos = [] }
      }

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
            completado: !!pasoData.completado,
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
          usuarioId: this.getActorId(ctx),
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
          usuarioId: this.getActorId(ctx),
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

      // ⚠️ Usamos el raw para saber QUÉ campos realmente llegaron
      const raw = request.all()

      const currentSalario = await ContratoSalario.query({ client: trx })
        .where('contratoId', contrato.id)
        .orderBy('fecha_efectiva', 'desc')
        .first()

      // Normalizamos BEFORE
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
        // 👇 aquí normalizamos boolean-like
        tieneRecomendacionesMedicas: this.toBoolOrNull((contrato as any).tieneRecomendacionesMedicas),
        salarioBasico: currentSalario?.salarioBasico ?? null,
        bonoSalarial: currentSalario?.bonoSalarial ?? null,
        auxilioTransporte: currentSalario?.auxilioTransporte ?? null,
        auxilioNoSalarial: currentSalario?.auxilioNoSalarial ?? null,
      }

      // payload seleccionado (para merge) desde el RAW
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

      // Aliases de fecha de terminación también aceptados en update
      const aliasFechaTerm =
        raw.fechaTerminacion ?? raw.fechaFin ?? raw.fechaFinalizacion

      // Determinar tipo/termino efectivos considerando payload + estado actual
      const tipoEff: TipoContrato = (payload.tipoContrato as TipoContrato) ?? (contrato.tipoContrato as TipoContrato)
      this.assertTipoContrato(tipoEff)

      const terminoEff =
        (tipoEff === 'prestacion' || tipoEff === 'aprendizaje')
          ? null
          : ((payload.terminoContrato ?? (contrato as any).terminoContrato) || 'indefinido')

      // Escribir fechas si llegaron en payload
      if (payload.fechaInicio !== undefined && typeof payload.fechaInicio === 'string') {
        contrato.fechaInicio = DateTime.fromFormat(payload.fechaInicio, 'yyyy-MM-dd').startOf('day').toUTC()
      }
      if (aliasFechaTerm !== undefined && typeof aliasFechaTerm === 'string') {
        contrato.fechaTerminacion = DateTime.fromFormat(aliasFechaTerm, 'yyyy-MM-dd').startOf('day').toUTC()
      }

      // Validar requerimiento de fecha terminación (usar la definitiva: payload o existente)
      const fechaTermDef = aliasFechaTerm !== undefined
        ? this.toDateTime(aliasFechaTerm)
        : (contrato.fechaTerminacion ?? null)

      if (this.requiresEndDate(tipoEff, terminoEff) && !fechaTermDef) {
        await trx.rollback()
        return response.badRequest({ message: "La 'fechaTerminacion' es obligatoria para el tipo/termino de contrato actual." })
      }

      const {
        salarioBasico,
        bonoSalarial,
        auxilioTransporte,
        auxilioNoSalarial,
        ...contratoPayload
      } = payload

      // Ajuste: si el tipo efectivo es prestacion/aprendizaje, forzar terminoContrato = null
      if (tipoEff === 'prestacion' || tipoEff === 'aprendizaje') {
        (contratoPayload as any).terminoContrato = null
      }

      contrato.merge(contratoPayload)
      await contrato.save({ client: trx })

      // ======= Salario =======
      const sbRaw  = salarioBasico
      const bsRaw  = bonoSalarial
      const atRaw  = auxilioTransporte
      const ansRaw = auxilioNoSalarial

      // 🔎 flags por-campo: ¿llegó en el request?
      const sbSent  = Object.prototype.hasOwnProperty.call(raw, 'salarioBasico')
      const bsSent  = Object.prototype.hasOwnProperty.call(raw, 'bonoSalarial')
      const atSent  = Object.prototype.hasOwnProperty.call(raw, 'auxilioTransporte')
      const ansSent = Object.prototype.hasOwnProperty.call(raw, 'auxilioNoSalarial')

      const salarioFueEnviado = sbSent || bsSent || atSent || ansSent

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
        // 👇 normalizado otra vez
        tieneRecomendacionesMedicas: this.toBoolOrNull(
          (contrato as any).tieneRecomendacionesMedicas
        ),
        salarioBasico: nuevoSalario
          ? nuevoSalario.salarioBasico
          : (currentSalario?.salarioBasico ?? null),
        bonoSalarial: nuevoSalario
          ? nuevoSalario.bonoSalarial
          : (currentSalario?.bonoSalarial ?? null),
        auxilioTransporte: nuevoSalario
          ? nuevoSalario.auxilioTransporte
          : (currentSalario?.auxilioTransporte ?? null),
        auxilioNoSalarial: nuevoSalario
          ? nuevoSalario.auxilioNoSalarial
          : (currentSalario?.auxilioNoSalarial ?? null),
      }

      const camposTrackeables: (keyof typeof after)[] = [
        'razonSocialId',
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
        'tieneRecomendacionesMedicas',
        'salarioBasico',
        'bonoSalarial',
        'auxilioTransporte',
        'auxilioNoSalarial',
      ]

      const cambios: Array<{
        contratoId: number
        usuarioId: number | null
        campo: string
        oldValue: any
        newValue: any
      }> = []

      const vinoEnPayloadFor = (campo: string) => {
        if (campo === 'salarioBasico') return sbSent
        if (campo === 'bonoSalarial') return bsSent
        if (campo === 'auxilioTransporte') return atSent
        if (campo === 'auxilioNoSalarial') return ansSent
        if (campo === 'tieneRecomendacionesMedicas') return Object.prototype.hasOwnProperty.call(raw, 'tieneRecomendacionesMedicas')
        if (campo === 'fechaTerminacion') return (
            Object.prototype.hasOwnProperty.call(raw, 'fechaTerminacion') ||
            Object.prototype.hasOwnProperty.call(raw, 'fechaFin') ||
            Object.prototype.hasOwnProperty.call(raw, 'fechaFinalizacion')
          )
        return Object.prototype.hasOwnProperty.call(raw, campo)
      }

      for (const campo of camposTrackeables) {
        if (!vinoEnPayloadFor(String(campo))) continue

        let oldV = (before as any)[campo]
        let newV = (after as any)[campo]

        // compara booleans normalizados para TRM
        if (campo === 'tieneRecomendacionesMedicas') {
          oldV = this.toBoolOrNull(oldV)
          newV = this.toBoolOrNull(newV)
        }

        if ((oldV ?? null) === (newV ?? null)) continue

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
      if (error.code === 'E_ROW_NOT_FOUND')
        return response.notFound({ message: 'Contrato no encontrado para actualizar' })
      return response.internalServerError({
        message: 'Error al actualizar contrato',
        error: error.message,
      })
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
          if (unlinkError.code !== 'ENOENT')
            console.error(
              'Error al eliminar archivo de recomendación anterior en update:',
              unlinkError
            )
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
      return response.internalServerError({
        message: 'Error al actualizar el archivo de recomendación médica',
        error: error.message,
      })
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

  /* =========================
     DESCARGA DE ARCHIVO (NUEVO)
  ========================= */
  public async descargarArchivo({ params, response }: HttpContext) {
    const contrato = await Contrato.findOrFail(params.id)

    const relativo = contrato.rutaArchivoContratoFisico
    if (!relativo) {
      return response.notFound({ message: 'Contrato sin archivo' })
    }

    const absPath = path.join(app.publicPath(), relativo.replace(/^\//, ''))
    if (!existsSync(absPath)) {
      return response.notFound({ message: 'Archivo no existe' })
    }

    const stat = statSync(absPath)
    const contentType = (mime.lookup(absPath) as string) || 'application/octet-stream'
    const fileName = path.basename(absPath)

    response.header('Content-Type', contentType)
    response.header('Content-Length', String(stat.size))
    // Si prefieres abrir en navegador: usa "inline"
    response.header('Content-Disposition', `attachment; filename="${fileName}"`)

    return response.stream(createReadStream(absPath))
  }
}
