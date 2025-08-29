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

// descarga
import { createReadStream, existsSync, statSync } from 'node:fs'
import mime from 'mime-types'

type Estado = 'activo' | 'inactivo'
type TipoContrato = 'prestacion' | 'temporal' | 'laboral' | 'aprendizaje'

export default class ContratosController {
  /* ============================
     Helpers base
  ============================ */

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

  private json(value: any): string {
    return JSON.stringify(value ?? null)
  }

  private getActorId(ctx: HttpContext): number | null {
    const { auth, request } = ctx
    const fromAuth = auth?.user?.id
    const fromHeader = Number(request.header('x-actor-id'))
    const fromBody = Number(request.input('actorId') ?? request.input('usuarioId'))
    return (
      fromAuth ?? (Number.isFinite(fromHeader) ? fromHeader : null) ?? (Number.isFinite(fromBody) ? fromBody : null) ?? null
    )
  }

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

  private assertTipoContrato(tipo: any): asserts tipo is TipoContrato {
    const ok = ['prestacion', 'temporal', 'laboral', 'aprendizaje'].includes(String(tipo))
    if (!ok) {
      throw new Error(
        "Valor inválido para 'tipoContrato'. Debe ser 'prestacion' | 'temporal' | 'laboral' | 'aprendizaje'."
      )
    }
  }

  // === NUEVO: normalización y validación de 'terminoContrato' por tipo ===
  private normTerm = (v?: string | null) =>
    v === 'obra_o_labor' ? 'obra_o_labor_determinada' : (v ?? null)

  private allowedTerminosByTipo: Record<TipoContrato, string[]> = {
    prestacion: ['fijo', 'obra_o_labor_determinada'],
    temporal: ['obra_o_labor_determinada'],
    laboral: ['fijo', 'obra_o_labor_determinada', 'indefinido'],
    aprendizaje: ['fijo'],
  }

  private assertTerminoParaTipo(tipo: TipoContrato, termino: string | null) {
    const allowed = this.allowedTerminosByTipo[tipo]
    if (!termino) {
      if (tipo === 'laboral') return // laboral admite default indefinido si viene vacío
      throw new Error(`'terminoContrato' es obligatorio para tipo '${tipo}'.`)
    }
    if (!allowed.includes(termino)) {
      throw new Error(`'terminoContrato' inválido para tipo '${tipo}'. Valores válidos: ${allowed.join(', ')}`)
    }
  }

  private requiresEndDate(tipo: TipoContrato, terminoContrato: string | null | undefined): boolean {
    if (tipo === 'prestacion' || tipo === 'aprendizaje' || tipo === 'temporal') return true
    if (tipo === 'laboral') return (terminoContrato ?? '').toLowerCase() !== 'indefinido'
    return false
  }

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
     Helpers de LOG para archivos
  ============================ */

  private async logArchivoSubido(contrato: Contrato, nombre: string, url: string, by: number | null) {
    await ContratoCambio.create({
      contratoId: contrato.id,
      usuarioId: contrato.usuarioId,
      campo: 'recomendacion_medica_archivo',
      oldValue: this.json(null),
      newValue: this.json({ nombre, url, by }),
    })
  }

  private async logArchivoReemplazado(
    contrato: Contrato,
    viejo: { nombre: string; url: string } | null,
    nuevo: { nombre: string; url: string },
    by: number | null
  ) {
    await ContratoCambio.create({
      contratoId: contrato.id,
      usuarioId: contrato.usuarioId,
      campo: 'recomendacion_medica_archivo',
      oldValue: this.json(viejo),
      newValue: this.json({ ...nuevo, by }),
    })
  }

  private async logArchivoEliminado(contrato: Contrato, viejo: { nombre: string; url: string } | null, by: number | null) {
    await ContratoCambio.create({
      contratoId: contrato.id,
      usuarioId: contrato.usuarioId,
      campo: 'recomendacion_medica_archivo',
      oldValue: this.json(viejo),
      newValue: this.json(null),
    })
  }

  private fileMetaFromRelPath(rel: string | null | undefined): { nombre: string; url: string } | null {
    if (!rel) return null
    const nombre = path.basename(rel)
    return { nombre, url: rel }
  }

  /* ========= LOGs archivo físico del contrato ========= */
  private async logContratoFisicoCambio(
    contrato: Contrato,
    oldMeta: { nombre: string; url: string } | null,
    newMeta: { nombre: string; url: string } | null,
    by: number | null,
  ) {
    await ContratoCambio.create({
      contratoId: contrato.id,
      usuarioId: contrato.usuarioId,
      campo: 'contrato_fisico_archivo',
      oldValue: this.json(oldMeta),
      newValue: this.json(newMeta ? { ...newMeta, by } : null),
    })
  }

  private async logContratoFisicoObservacion(contrato: Contrato, nota: string | null, by: number | null) {
    if (!nota?.trim()) return
    await ContratoCambio.create({
      contratoId: contrato.id,
      usuarioId: contrato.usuarioId,
      campo: 'contrato_fisico_archivo_observacion',
      oldValue: this.json(null),
      newValue: this.json({ nota: nota.trim(), by }),
    })
  }

  /* ============================
     Archivos por afiliación (CONTRATO)
  ============================ */

  private static readonly TIPOS_AFILIACION = ['eps', 'arl', 'afp', 'afc', 'ccf'] as const

  private camposAfiContrato(tipo: typeof ContratosController.TIPOS_AFILIACION[number]) {
    return {
      path: `${tipo}DocPath` as const,
      nombre: `${tipo}DocNombre` as const,
      mime: `${tipo}DocMime` as const,
      size: `${tipo}DocSize` as const,
      dir: `uploads/contratos/afiliaciones/${tipo}`,
    }
  }

  private static readonly AFI_ALLOWED_MIMES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

  private async logCambioArchivo(
    contrato: Contrato,
    campo: string,
    viejo: { nombre: string; url: string } | null,
    nuevo: { nombre: string; url: string } | null,
    by: number | null
  ) {
    await ContratoCambio.create({
      contratoId: contrato.id,
      usuarioId: contrato.usuarioId,
      campo,
      oldValue: this.json(viejo),
      newValue: this.json(nuevo ? { ...nuevo, by } : null),
    })
  }

  /* ============================
     Sincronización usuario
  ============================ */

  private async getContratoPrioritario(usuarioId: number): Promise<Contrato | null> {
    const activo = await Contrato.query().where('usuarioId', usuarioId).where('estado', 'activo' as Estado).orderBy('fechaInicio', 'desc').first()
    if (activo) return activo

    const masReciente = await Contrato.query().where('usuarioId', usuarioId).orderBy('fechaInicio', 'desc').first()
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
     CRUD contratos
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

      this.assertTipoContrato(contratoData.tipoContrato)
      const tipo: TipoContrato = contratoData.tipoContrato

      const baseRaw = salarioBasico ?? allRequestData.salario
      const baseNum = Number(baseRaw)
      if (!Number.isFinite(baseNum)) {
        await trx.rollback()
        return response.badRequest({ message: "El campo 'salarioBasico' es obligatorio y debe ser numérico." })
      }

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

      const aliasFechaTerm = fechaTermInput ?? fechaFin ?? fechaFinalizacion ?? null

      // === término normalizado y validado por tipo ===
      const terminoNorm = this.normTerm(contratoDataNorm.terminoContrato)
      let terminoEff: string | null = terminoNorm
      if (!terminoEff && tipo === 'laboral') {
        terminoEff = 'indefinido'
      }
      this.assertTerminoParaTipo(tipo, terminoEff)

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
          salario: baseNum,
          terminoContrato: terminoEff,
        },
        { client: trx }
      )

      await ContratoSalario.create(
        {
          contratoId: contrato.id,
          salarioBasico: Number(salarioBasico) || baseNum,
          bonoSalarial: Number(bonoSalarial) || 0,
          auxilioTransporte: Number(auxilioTransporte) || 0,
          auxilioNoSalarial: Number(auxilioNoSalarial) || 0,
          fechaEfectiva: DateTime.now(),
        },
        { client: trx }
      )

      // pasos
      let pasosRecibidos: any[] = []
      if (Array.isArray(pasos)) pasosRecibidos = pasos
      else if (typeof pasos === 'string' && pasos.trim()) { try { pasosRecibidos = JSON.parse(pasos) } catch {} }

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
      if (pasosParaGuardar.length > 0) await ContratoPaso.createMany(pasosParaGuardar, { client: trx })

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

      await ContratoCambio.create(
        {
          contratoId: contrato.id,
          usuarioId: contrato.usuarioId,
          campo: 'creacion',
          oldValue: this.json(null),
          newValue: this.json({ estado: 'activo', by: actorId ?? null }),
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

      // Helpers locales para validar PDF por MIME y tamaño
      const getContentType = (file: any): string => {
        return (file?.type && file?.subtype)
          ? `${file.type}/${file.subtype}`
          : (file?.headers?.['content-type'] as string) || ''
      }

      const ensurePdfOrThrow = (file: any, maxBytes: number) => {
        if (!file || !file.tmpPath) {
          throw new Error('Archivo de contrato inválido o no adjunto.')
        }
        const ct = getContentType(file).toLowerCase()
        if (ct !== 'application/pdf') {
          throw new Error('Tipo de archivo no permitido: debe ser PDF.')
        }
        const size = Number(file.size || 0)
        if (size > maxBytes) {
          throw new Error('El PDF supera el tamaño máximo permitido (10MB).')
        }
      }

      if (contratoId) {
        // ====== MODO A: anexar a contrato existente ======
        const contrato = await Contrato.findOrFail(contratoId)

        // CONTRATO (PDF) -> acepta 'archivo' o 'archivoContrato'
        const archivoContrato = request.file('archivo') || request.file('archivoContrato')

        // Validación por MIME y tamaño (10 MB — empata con frontend)
        ensurePdfOrThrow(archivoContrato, 10 * 1024 * 1024)

        const razonSocialId = request.input('razonSocialId')
        if (razonSocialId) contrato.razonSocialId = Number(razonSocialId)

        const oldMeta = this.fileMetaFromRelPath(contrato.rutaArchivoContratoFisico)

        // borrar anterior contrato físico si existía
        if (contrato.rutaArchivoContratoFisico) {
          try {
            await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoContratoFisico.replace(/^\//, '')))
          } catch (e: any) {
            if (e.code !== 'ENOENT') console.error('No se pudo eliminar archivo anterior:', e)
          }
        }

        const uploadDir = 'uploads/contratos'
        const fileName = `${cuid()}.pdf`
        const destinationDir = path.join(app.publicPath(), uploadDir)
        await fs.mkdir(destinationDir, { recursive: true })
        await (archivoContrato as any).move(destinationDir, { name: fileName })

        contrato.nombreArchivoContratoFisico = fileName
        contrato.rutaArchivoContratoFisico = `/${uploadDir}/${fileName}`

        // Observación opcional para el cambio del archivo físico
        const observacionArchivo = String(request.input('observacionArchivo') ?? '').trim()

        await contrato.save({ client: trx })

        // Log del cambio del archivo físico
        await this.logContratoFisicoCambio(
          contrato,
          oldMeta,
          { nombre: fileName, url: `/${uploadDir}/${fileName}` },
          actorId
        )
        await this.logContratoFisicoObservacion(contrato, observacionArchivo, actorId)

        // RECOMENDACIÓN MÉDICA (opcional) -> SOLO 'archivoRecomendacionMedica'
        const tieneRecRaw = request.input('tieneRecomendacionesMedicas')
        const tieneRec = (tieneRecRaw === true) || (String(tieneRecRaw).toLowerCase() === 'true')

        if (tieneRec) {
          const archivoRec = request.file('archivoRecomendacionMedica', {
            size: '10mb',
            extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
          })

          if (!archivoRec || !archivoRec.isValid) {
            throw new Error(archivoRec?.errors?.[0]?.message || 'Archivo de recomendación médica inválido o no adjunto.')
          }

          // meta anterior (si existía)
          const oldMetaRec = this.fileMetaFromRelPath(contrato.rutaArchivoRecomendacionMedica)

          const recDir = 'uploads/recomendaciones_medicas'
          const recName = `${cuid()}_${archivoRec.clientName}`
          const recDest = path.join(app.publicPath(), recDir)
          await fs.mkdir(recDest, { recursive: true })
          await archivoRec.move(recDest, { name: recName })

          contrato.tieneRecomendacionesMedicas = true
          contrato.rutaArchivoRecomendacionMedica = `/${recDir}/${recName}`

          // log
          if (oldMetaRec) {
            await this.logArchivoReemplazado(
              contrato,
              oldMetaRec,
              { nombre: recName, url: `/${recDir}/${recName}` },
              actorId
            )
          } else {
            await this.logArchivoSubido(contrato, recName, `/${recDir}/${recName}`, actorId)
          }
        }

        await trx.commit()
        await this.syncUsuarioTrasGuardarContrato(contrato)
        await contrato.load((loader) => this.preloadRelations(loader))
        return response.ok({ message: 'Archivo anexado correctamente', contrato })
      }

      // ====== MODO B: Crear + anexar en una sola llamada (legacy) ======
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
        observacionArchivo,
        ...contratoData
      } = allRequestData

      this.assertTipoContrato(contratoData.tipoContrato)
      const tipo: TipoContrato = contratoData.tipoContrato

      const baseRaw = salarioBasico ?? allRequestData.salario
      const baseNum = Number(baseRaw)
      if (!Number.isFinite(baseNum)) {
        await trx.rollback()
        return response.badRequest({ message: "El campo 'salarioBasico' es obligatorio y debe ser numérico." })
      }

      if (!contratoData.sedeId) return response.badRequest({ message: "El campo 'sedeId' es obligatorio." })

      const aliasFechaTerm = fechaTermInput ?? fechaFin ?? fechaFinalizacion ?? null
      const fechaInicioLuxon = this.toDateTime(contratoData.fechaInicio)
      if (!fechaInicioLuxon) {
        await trx.rollback()
        return response.badRequest({ message: "La 'fechaInicio' es inválida o no fue enviada." })
      }

      // término normalizado y validado por tipo
      const terminoNorm = this.normTerm(contratoData.terminoContrato)
      let terminoEff: string | null = terminoNorm
      if (!terminoEff && tipo === 'laboral') {
        terminoEff = 'indefinido'
      }
      this.assertTerminoParaTipo(tipo, terminoEff)

      if (this.requiresEndDate(tipo, terminoEff) && !aliasFechaTerm) {
        await trx.rollback()
        return response.badRequest({ message: "La 'fechaTerminacion' es obligatoria para el tipo de contrato enviado." })
      }

      const fechaTerminacionLuxon = this.toDateTime(aliasFechaTerm)

      // CONTRATO (obligatorio) -> acepta 'archivo' o 'archivoContrato'
      const archivoContratoLegacy = request.file('archivo') || request.file('archivoContrato')
      // Validación por MIME y tamaño (10 MB)
      const contentType =
        (archivoContratoLegacy?.type && archivoContratoLegacy?.subtype)
          ? `${archivoContratoLegacy.type}/${archivoContratoLegacy.subtype}`
          : (archivoContratoLegacy?.headers?.['content-type'] as string) || ''
      if (contentType.toLowerCase() !== 'application/pdf') {
        await trx.rollback()
        return response.badRequest({ message: 'Tipo de archivo no permitido: debe ser PDF.' })
      }

      const uploadDir = 'uploads/contratos'
      const fileName = `${cuid()}.pdf`
      const destinationDir = path.join(app.publicPath(), uploadDir)
      await fs.mkdir(destinationDir, { recursive: true })
      await (archivoContratoLegacy as any).move(destinationDir, { name: fileName })
      const publicUrl = `/${uploadDir}/${fileName}`

      // crear contrato
      const contrato = await Contrato.create(
        {
          ...contratoData,
          razonSocialId: contratoData.razonSocialId,
          fechaInicio: fechaInicioLuxon,
          fechaTerminacion: fechaTerminacionLuxon || null,
          estado: 'activo',
          nombreArchivoContratoFisico: fileName,
          rutaArchivoContratoFisico: publicUrl,
          salario: baseNum,
          terminoContrato: terminoEff,
          tieneRecomendacionesMedicas: false,
          rutaArchivoRecomendacionMedica: null,
        },
        { client: trx }
      )

      await ContratoSalario.create(
        {
          contratoId: contrato.id,
          salarioBasico: Number(salarioBasico) || baseNum,
          bonoSalarial: Number(bonoSalarial) || 0,
          auxilioTransporte: Number(auxilioTransporte) || 0,
          auxilioNoSalarial: Number(auxilioNoSalarial) || 0,
          fechaEfectiva: DateTime.now(),
        },
        { client: trx }
      )

      // log: archivo físico subido + observación si vino
      await this.logContratoFisicoCambio(contrato, null, { nombre: fileName, url: publicUrl }, actorId)
      await this.logContratoFisicoObservacion(contrato, String(observacionArchivo ?? ''), actorId)

      // RECOMENDACIÓN (opcional) -> SOLO 'archivoRecomendacionMedica'
      const tieneRecRaw = tieneRecomendacionesMedicas
      const tieneRec = (tieneRecRaw === true) || (String(tieneRecRaw).toLowerCase() === 'true')
      if (tieneRec) {
        const archivoRecomendacion = request.file('archivoRecomendacionMedica', {
          size: '10mb',
          extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
        })

        if (!archivoRecomendacion || !archivoRecomendacion.isValid) {
          throw new Error(archivoRecomendacion?.errors?.[0]?.message || 'Archivo de recomendación médica inválido o no adjunto.')
        }
        const recDir = 'uploads/recomendaciones_medicas'
        const recName = `${cuid()}_${archivoRecomendacion.clientName}`
        const recDest = path.join(app.publicPath(), recDir)
        await fs.mkdir(recDest, { recursive: true })
        await archivoRecomendacion.move(recDest, { name: recName })

        contrato.tieneRecomendacionesMedicas = true
        contrato.rutaArchivoRecomendacionMedica = `/${recDir}/${recName}`

        await this.logArchivoSubido(contrato, recName, `/${recDir}/${recName}`, actorId)
        await contrato.save({ client: trx })
      }

      // pasos
      let pasosRecibidos: any[] = []
      if (Array.isArray(pasos)) pasosRecibidos = pasos
      else if (typeof pasos === 'string' && pasos.trim()) { try { pasosRecibidos = JSON.parse(pasos) } catch {} }

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
      if (pasosParaGuardar.length > 0) await ContratoPaso.createMany(pasosParaGuardar, { client: trx })

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

      await ContratoCambio.create(
        {
          contratoId: contrato.id,
          usuarioId: contrato.usuarioId,
          campo: 'creacion',
          oldValue: this.json(null),
          newValue: this.json({ estado: 'activo', by: actorId ?? null }),
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

      const raw = request.all()

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
        tieneRecomendacionesMedicas: this.toBoolOrNull((contrato as any).tieneRecomendacionesMedicas),
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
        // NUEVO: bandera para borrar recomendación desde update
        'eliminarRecomendacionMedica',
      ])

      const aliasFechaTerm = raw.fechaTerminacion ?? raw.fechaFin ?? raw.fechaFinalizacion

      const tipoEff: TipoContrato = (payload.tipoContrato as TipoContrato) ?? (contrato.tipoContrato as TipoContrato)
      this.assertTipoContrato(tipoEff)

      // --- término normalizado por tipo + default de laboral ---
      const incomingTerm = this.normTerm(payload.terminoContrato ?? (contrato as any).terminoContrato)
      let terminoEff: string | null = incomingTerm
      if (!terminoEff && tipoEff === 'laboral') {
        terminoEff = 'indefinido'
      }
      this.assertTerminoParaTipo(tipoEff, terminoEff)

      // fechas
      if (payload.fechaInicio !== undefined && typeof payload.fechaInicio === 'string') {
        contrato.fechaInicio = DateTime.fromFormat(payload.fechaInicio, 'yyyy-MM-dd').startOf('day').toUTC()
      }
      if (aliasFechaTerm !== undefined && typeof aliasFechaTerm === 'string') {
        contrato.fechaTerminacion = DateTime.fromFormat(aliasFechaTerm, 'yyyy-MM-dd').startOf('day').toUTC()
      }

      const fechaTermDef = aliasFechaTerm !== undefined ? this.toDateTime(aliasFechaTerm) : (contrato.fechaTerminacion ?? null)

      if (this.requiresEndDate(tipoEff, terminoEff) && !fechaTermDef) {
        await trx.rollback()
        return response.badRequest({
          message: "La 'fechaTerminacion' es obligatoria para el tipo/termino de contrato actual.",
        })
      }

      const {
        salarioBasico,
        bonoSalarial,
        auxilioTransporte,
        auxilioNoSalarial,
        ...contratoPayload
      } = payload

      // Aseguramos persistir el término validado
      ;(contratoPayload as any).terminoContrato = terminoEff

      contrato.merge(contratoPayload)
      await contrato.save({ client: trx })

      // ===== Recomendación médica en UPDATE: manejo robusto =====
      const reqQuiereEliminarRec = String((raw.eliminarRecomendacionMedica ?? '')).toLowerCase() === 'true'
      if (reqQuiereEliminarRec && contrato.rutaArchivoRecomendacionMedica) {
        try {
          await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, '')))
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('No se pudo eliminar recomendación (update):', e)
        }
        contrato.rutaArchivoRecomendacionMedica = null
        ;(contrato as any).tieneRecomendacionesMedicas = false
        await contrato.save({ client: trx })
      }

      // Si no pidieron eliminar y existe archivo, forzar booleano a true
      if (!reqQuiereEliminarRec && contrato.rutaArchivoRecomendacionMedica) {
        ;(contrato as any).tieneRecomendacionesMedicas = true
        await contrato.save({ client: trx })
      }

      // ===== Procesar salarios si alguno vino en payload =====
      const sbRaw  = salarioBasico
      const bsRaw  = bonoSalarial
      const atRaw  = auxilioTransporte
      const ansRaw = auxilioNoSalarial

      const sbSent  = Object.prototype.hasOwnProperty.call(raw, 'salarioBasico')
      const bsSent  = Object.prototype.hasOwnProperty.call(raw, 'bonoSalarial')
      const atSent  = Object.prototype.hasOwnProperty.call(raw, 'auxilioTransporte')
      const ansSent = Object.prototype.hasOwnProperty.call(raw, 'auxilioNoSalarial')

      const salarioFueEnviado = sbSent || bsSent || atSent || ansSent
      let nuevoSalario: { salarioBasico: number; bonoSalarial: number; auxilioTransporte: number; auxilioNoSalarial: number } | null = null

      if (salarioFueEnviado) {
        const base = currentSalario || { salarioBasico: contrato.salario ?? 0, bonoSalarial: 0, auxilioTransporte: 0, auxilioNoSalarial: 0 }
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

          if (sbSent) {
            contrato.salario = nuevo.salarioBasico
            await contrato.save({ client: trx })
          }
        }
      }

      if (oldEstado !== contrato.estado) {
        const fechaInicioHist = this.toDateTime(contrato.fechaInicio)
        await ContratoHistorialEstado.create(
          {
            contratoId: contrato.id,
            usuarioId: contrato.usuarioId,
            oldEstado,
            newEstado: contrato.estado,
            fechaCambio: DateTime.now(),
            fechaInicioContrato: fechaInicioHist ?? null,
            motivo: contrato.estado === 'inactivo' ? contrato.motivoFinalizacion : null,
          },
          { client: trx }
        )
      }

      // Cambios
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
        tieneRecomendacionesMedicas: this.toBoolOrNull((contrato as any).tieneRecomendacionesMedicas),
        salarioBasico: nuevoSalario ? nuevoSalario.salarioBasico : (currentSalario?.salarioBasico ?? null),
        bonoSalarial: nuevoSalario ? nuevoSalario.bonoSalarial : (currentSalario?.bonoSalarial ?? null),
        auxilioTransporte: nuevoSalario ? nuevoSalario.auxilioTransporte : (currentSalario?.auxilioTransporte ?? null),
        auxilioNoSalarial: nuevoSalario ? nuevoSalario.auxilioNoSalarial : (currentSalario?.auxilioNoSalarial ?? null),
      }

      const camposTrackeables: (keyof typeof after)[] = [
        'razonSocialId','sedeId','cargoId','funcionesCargo','tipoContrato','terminoContrato','fechaInicio','fechaTerminacion',
        'periodoPrueba','horarioTrabajo','centroCosto','epsId','arlId','afpId','afcId','ccfId','estado',
        'motivoFinalizacion','tieneRecomendacionesMedicas','salarioBasico','bonoSalarial','auxilioTransporte','auxilioNoSalarial',
      ]

      const cambios: Array<{ contratoId: number; usuarioId: number | null; campo: string; oldValue: any; newValue: any }> = []

      const vinoEnPayloadFor = (campo: string) => {
        if (campo === 'salarioBasico') return Object.prototype.hasOwnProperty.call(raw, 'salarioBasico')
        if (campo === 'bonoSalarial') return Object.prototype.hasOwnProperty.call(raw, 'bonoSalarial')
        if (campo === 'auxilioTransporte') return Object.prototype.hasOwnProperty.call(raw, 'auxilioTransporte')
        if (campo === 'auxilioNoSalarial') return Object.prototype.hasOwnProperty.call(raw, 'auxilioNoSalarial')
        if (campo === 'fechaTerminacion') return (
          Object.prototype.hasOwnProperty.call(raw, 'fechaTerminacion') ||
          Object.prototype.hasOwnProperty.call(raw, 'fechaFin') ||
          Object.prototype.hasOwnProperty.call(raw, 'fechaFinalizacion')
        )
        if (campo === 'tieneRecomendacionesMedicas') return Object.prototype.hasOwnProperty.call(raw, 'tieneRecomendacionesMedicas')
        return Object.prototype.hasOwnProperty.call(raw, campo)
      }

      for (const campo of camposTrackeables) {
        if (!vinoEnPayloadFor(String(campo))) continue
        let oldV = (before as any)[campo]
        let newV = (after as any)[campo]
        if (campo === 'tieneRecomendacionesMedicas') {
          oldV = this.toBoolOrNull(oldV)
          newV = this.toBoolOrNull(newV)
        }
        if ((oldV ?? null) === (newV ?? null)) continue

        const oldWrapped = await this.wrapValueWithName(String(campo), oldV)
        const newWrapped = await this.wrapValueWithName(String(campo), newV)

        cambios.push({
          contratoId: contrato.id,
          usuarioId: contrato.usuarioId,
          campo: String(campo),
          oldValue: this.json(oldWrapped),
          newValue: this.json(newWrapped),
        })
      }

      if (cambios.length > 0) await ContratoCambio.createMany(cambios, { client: trx })

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
  /* =========================
     Actualizar SOLO archivo de recomendación (reemplazo)
  ========================= */
  public async updateRecomendacionMedica(ctx: HttpContext) {
    const { params, request, response } = ctx
    const trx = await db.transaction()
    try {
      const actorId = this.getActorId(ctx)
      const contrato = await Contrato.findOrFail(params.id)

      // aceptar 'archivo' o 'archivoRecomendacionMedica'
      const archivoRecomendacion =
        request.file('archivo', {
          size: '10mb',
          extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
        }) ||
        request.file('archivoRecomendacionMedica', {
          size: '10mb',
          extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
        })

      if (!archivoRecomendacion || !archivoRecomendacion.isValid) {
        throw new Error(archivoRecomendacion?.errors?.[0]?.message || 'Archivo de recomendación médica inválido.')
      }

      const oldMeta = this.fileMetaFromRelPath(contrato.rutaArchivoRecomendacionMedica)

      if (contrato.rutaArchivoRecomendacionMedica) {
        try {
          await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, '')))
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('Error al eliminar archivo de recomendación anterior en update:', e)
        }
      }

      const recDir = 'uploads/recomendaciones_medicas'
      const recName = `${cuid()}_${archivoRecomendacion.clientName}`
      const recDest = path.join(app.publicPath(), recDir)
      await fs.mkdir(recDest, { recursive: true })
      await archivoRecomendacion.move(recDest, { name: recName })

      contrato.tieneRecomendacionesMedicas = true
      contrato.rutaArchivoRecomendacionMedica = `/${recDir}/${recName}`
      await contrato.save({ client: trx })

      if (oldMeta) {
        await this.logArchivoReemplazado(contrato, oldMeta, { nombre: recName, url: `/${recDir}/${recName}` }, actorId)
      } else {
        await this.logArchivoSubido(contrato, recName, `/${recDir}/${recName}`, actorId)
      }

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

  /* =========================
     PASOS: subir archivo (sin cambios de negocio)
  ========================= */
  public async uploadRecomendacionMedica(ctx: HttpContext) {
    const { params, request, response } = ctx
    try {
      const paso = await ContratoPaso.query().where('id', params.pasoId).firstOrFail()

      const archivo =
        request.file('archivo', {
          size: '5mb',
          extnames: ['pdf', 'doc', 'docx', 'jpg', 'png'],
        }) ||
        request.file('recomendacion', {
          size: '5mb',
          extnames: ['pdf', 'doc', 'docx', 'jpg', 'png'],
        })

      if (!archivo || !archivo.isValid) {
        throw new Error(archivo?.errors?.[0]?.message || 'Archivo de recomendación inválido.')
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

      const baseNum = Number(salarioBasico)
      if (!Number.isFinite(baseNum)) {
        return response.badRequest({ message: "El campo 'salarioBasico' es obligatorio y debe ser numérico." })
      }

      const fecha = fechaEfectiva ? DateTime.fromISO(fechaEfectiva) : DateTime.now()

      const registro = await ContratoSalario.create({
        contratoId: contrato.id,
        salarioBasico: baseNum,
        bonoSalarial: Number(bonoSalarial) || 0,
        auxilioTransporte: Number(auxilioTransporte) || 0,
        auxilioNoSalarial: Number(auxilioNoSalarial) || 0,
        fechaEfectiva: fecha,
      })

      contrato.salario = baseNum
      await contrato.save()

      return response.created(registro)
    } catch (error: any) {
      console.error('Error al crear salario:', error)
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      return response.badRequest({ message: error.message || 'Error al crear salario' })
    }
  }

  /* =========================
     DESCARGA / META / DELETE de archivo contrato físico
  ========================= */

  // Visor/descarga del archivo del contrato. Usa inline=1 para visor en pestaña.
  public async descargarArchivo({ params, response, request }: HttpContext) {
    const contrato = await Contrato.findOrFail(params.id)

    const relativo = contrato.rutaArchivoContratoFisico
    if (!relativo) {
      return response.notFound({ message: 'Contrato sin archivo' })
    }

    const absPath = path.join(app.publicPath(), relativo.replace(/^\//, ''))
    if (!existsSync(absPath)) {
      return response.notFound({ message: 'Archivo no existe' })
    }

    const st = statSync(absPath)
    const contentType = (mime.lookup(absPath) as string) || 'application/octet-stream'
    const fileName = path.basename(absPath)

    const inlineRaw = String(request.input('inline') ?? (request.qs() as any)?.inline ?? '').toLowerCase()
    const viewInline = ['1','true','inline','si','sí'].includes(inlineRaw)

    response.header('Content-Type', contentType)
    response.header('Content-Length', String(st.size))
    response.header('Content-Disposition', `${viewInline ? 'inline' : 'attachment'}; filename="${fileName}"`)

    return response.stream(createReadStream(absPath))
  }

  // Meta del archivo del contrato (para mostrar nombre/chulo/size, etc.)
  public async getArchivoContratoMeta({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)

      const relativo = contrato.rutaArchivoContratoFisico || null
      if (!relativo) {
        return response.ok({ contratoId: contrato.id, tieneArchivo: false, data: null })
      }

      const absPath = path.join(app.publicPath(), relativo.replace(/^\//, ''))
      if (!existsSync(absPath)) {
        contrato.merge({ rutaArchivoContratoFisico: null, nombreArchivoContratoFisico: null })
        await contrato.save()
        return response.ok({ contratoId: contrato.id, tieneArchivo: false, data: null })
      }

      const st = statSync(absPath)
      const fileName = path.basename(absPath)
      const contentType = (mime.lookup(absPath) as string) || 'application/pdf'

      return response.ok({
        contratoId: contrato.id,
        tieneArchivo: true,
        data: {
          url: relativo,
          nombreOriginal: fileName,
          mime: contentType,
          size: st.size,
        },
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error al obtener meta del archivo de contrato:', error)
      return response.internalServerError({ message: 'Error al obtener meta del archivo de contrato', error: error.message })
    }
  }

  // Eliminar SOLO el archivo físico del contrato (no el contrato)
  public async eliminarArchivoContrato({ params, response, request }: HttpContext) {
    try {
      const actorId = this.getActorId({ request } as any)
      const contrato = await Contrato.findOrFail(params.id)

      const rel = contrato.rutaArchivoContratoFisico
      const old = this.fileMetaFromRelPath(rel)

      if (!rel) {
        return response.ok({ message: 'El contrato no tiene archivo para eliminar.' })
      }

      try {
        await fs.unlink(path.join(app.publicPath(), rel.replace(/^\//, '')))
      } catch (e: any) {
        if (e.code !== 'ENOENT') console.error('No se pudo eliminar archivo del contrato:', e)
      }

      contrato.merge({
        rutaArchivoContratoFisico: null,
        nombreArchivoContratoFisico: null,
      })
      await contrato.save()

      await this.logContratoFisicoCambio(contrato, old, null, actorId)
      await this.logContratoFisicoObservacion(contrato, String(request.input('observacionArchivo') ?? ''), actorId)

      return response.ok({ message: 'Archivo del contrato eliminado.' })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error al eliminar archivo del contrato:', error)
      return response.internalServerError({ message: 'Error al eliminar archivo del contrato', error: error.message })
    }
  }

  /* ==========================================================
     Recomendación Médica por Contrato (CRUD de archivo)
  ========================================================== */

  public async getRecomendacionMedicaMeta({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)

      const relativo = contrato.rutaArchivoRecomendacionMedica || null
      if (!relativo) {
        return response.ok({ contratoId: contrato.id, tieneArchivo: false, data: null })
      }

      const absPath = path.join(app.publicPath(), relativo.replace(/^\//, ''))
      if (!existsSync(absPath)) {
        contrato.merge({ rutaArchivoRecomendacionMedica: null })
        await contrato.save()
        return response.ok({ contratoId: contrato.id, tieneArchivo: false, data: null })
      }

      const st = statSync(absPath)
      const fileName = path.basename(absPath)
      const contentType = (mime.lookup(absPath) as string) || 'application/octet-stream'

      return response.ok({
        contratoId: contrato.id,
        tieneArchivo: true,
        data: {
          url: relativo,
          nombreOriginal: fileName,
          mime: contentType,
          size: st.size,
        },
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error al obtener meta de recomendación médica:', error)
      return response.internalServerError({ message: 'Error al obtener meta de recomendación médica', error: error.message })
    }
  }

  public async subirRecomendacionMedica({ params, request, response }: HttpContext) {
    try {
      const actorId = this.getActorId({ request } as any)
      const contrato = await Contrato.findOrFail(params.id)

      const archivo =
        request.file('archivo', {
          size: '10mb',
          extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
        }) ||
        request.file('archivoRecomendacionMedica', {
          size: '10mb',
          extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
        })

      if (!archivo || !archivo.isValid) {
        throw new Error(archivo?.errors?.[0]?.message || 'Archivo de recomendación inválido o no adjunto.')
      }

      const oldMeta = this.fileMetaFromRelPath(contrato.rutaArchivoRecomendacionMedica)

      if (contrato.rutaArchivoRecomendacionMedica) {
        try {
          await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, '')))
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('No se pudo eliminar recomendación anterior:', e)
        }
      }

      const dir = 'uploads/recomendaciones_medicas'
      const name = `${cuid()}_${archivo.clientName}`
      const absDir = path.join(app.publicPath(), dir)
      await fs.mkdir(absDir, { recursive: true })
      await archivo.move(absDir, { name })

      contrato.merge({
        tieneRecomendacionesMedicas: true,
        rutaArchivoRecomendacionMedica: `/${dir}/${name}`,
      })
      await contrato.save()

      if (oldMeta) {
        await this.logArchivoReemplazado(contrato, oldMeta, { nombre: name, url: `/${dir}/${name}` }, (request as any)?.auth?.user?.id ?? null)
      } else {
        await this.logArchivoSubido(contrato, name, `/${dir}/${name}`, (request as any)?.auth?.user?.id ?? null)
      }

      const absPath = path.join(absDir, name)
      const st = statSync(absPath)
      const contentType = (mime.lookup(absPath) as string) || 'application/octet-stream'

      return response.ok({
        contratoId: contrato.id,
        tieneArchivo: true,
        data: {
          url: `/${dir}/${name}`,
          nombreOriginal: name,
          mime: contentType,
          size: st.size,
        },
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error al subir recomendación médica:', error)
      return response.internalServerError({ message: 'Error al subir recomendación médica', error: error.message })
    }
  }

  public async eliminarRecomendacionMedica({ params, response, request }: HttpContext) {
    try {
      const actorId = this.getActorId({ request } as any)
      const contrato = await Contrato.findOrFail(params.id)

      const oldMeta = this.fileMetaFromRelPath(contrato.rutaArchivoRecomendacionMedica)

      if (contrato.rutaArchivoRecomendacionMedica) {
        try {
          await fs.unlink(path.join(app.publicPath(), contrato.rutaArchivoRecomendacionMedica.replace(/^\//, '')))
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('No se pudo eliminar archivo de recomendación:', e)
        }
      }

      contrato.merge({
        rutaArchivoRecomendacionMedica: null,
        tieneRecomendacionesMedicas: false,
      })
      await contrato.save()

      await this.logArchivoEliminado(contrato, oldMeta, actorId)

      return response.ok({ message: 'Archivo de recomendación médica eliminado.' })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error al eliminar recomendación médica:', error)
      return response.internalServerError({ message: 'Error al eliminar recomendación médica', error: error.message })
    }
  }

  public async descargarRecomendacionMedica({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)
      const relativo = contrato.rutaArchivoRecomendacionMedica
      if (!relativo) {
        return response.notFound({ message: 'El contrato no tiene archivo de recomendación médica.' })
      }

      const absPath = path.join(app.publicPath(), relativo.replace(/^\//, ''))
      if (!existsSync(absPath)) {
        return response.notFound({ message: 'Archivo de recomendación no existe' })
      }

      const st = statSync(absPath)
      const contentType = (mime.lookup(absPath) as string) || 'application/octet-stream'
      const fileName = path.basename(absPath)

      response.header('Content-Type', contentType)
      response.header('Content-Length', String(st.size))
      response.header('Content-Disposition', `attachment; filename="${fileName}"`)

      return response.stream(createReadStream(absPath))
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error al descargar recomendación médica:', error)
      return response.internalServerError({
        message: 'Error al descargar recomendación médica',
        error: error.message,
      })
    }
  }

  /* ==========================================================
     Archivos por Afiliación (CONTRATO) - META / SUBIR / ELIMINAR
  ========================================================== */

  public async getAfiliacionArchivo({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)
      const tipo = String(params.tipo || '').toLowerCase() as any
      if (!ContratosController.TIPOS_AFILIACION.includes(tipo)) {
        return response.badRequest({ message: 'Tipo de afiliación inválido.' })
      }

      const c = this.camposAfiContrato(tipo)
      const rel = (contrato as any)[c.path] as string | null
      if (!rel) return response.ok({ contratoId: contrato.id, tipo, tieneArchivo: false, data: null })

      const absPath = path.join(app.publicPath(), rel.replace(/^\//, ''))
      if (!existsSync(absPath)) {
        contrato.merge({ [c.path]: null, [c.nombre]: null, [c.mime]: null, [c.size]: null } as any)
        await contrato.save()
        return response.ok({ contratoId: contrato.id, tipo, tieneArchivo: false, data: null })
      }

      const st = statSync(absPath)
      const fileName = path.basename(absPath)
      const contentType = (mime.lookup(absPath) as string) || 'application/octet-stream'

      return response.ok({
        contratoId: contrato.id,
        tipo,
        tieneArchivo: true,
        data: { url: rel, nombreOriginal: fileName, mime: contentType, size: st.size },
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error meta afiliación:', error)
      return response.internalServerError({ message: 'Error al obtener meta de afiliación', error: error.message })
    }
  }

  public async subirAfiliacionArchivo({ params, request, response }: HttpContext) {
    try {
      const actorId = this.getActorId({ request } as any)
      const contrato = await Contrato.findOrFail(params.id)
      const tipo = String(params.tipo || '').toLowerCase() as any
      if (!ContratosController.TIPOS_AFILIACION.includes(tipo)) {
        return response.badRequest({ message: 'Tipo de afiliación inválido.' })
      }

      const archivo = request.file('archivo')
      if (!archivo || !archivo.isValid || !archivo.tmpPath || !archivo.clientName) {
        return response.badRequest({ message: 'Archivo inválido o no enviado.' })
      }

      const contentType =
        archivo.type && archivo.subtype
          ? `${archivo.type}/${archivo.subtype}`
          : (archivo.headers?.['content-type'] as string) || ''
      if (!ContratosController.AFI_ALLOWED_MIMES.includes(contentType)) {
        return response.badRequest({ message: 'Tipo de archivo no permitido.' })
      }

      const c = this.camposAfiContrato(tipo)
      const dir = path.join(app.publicPath(), c.dir, String(contrato.id))
      await fs.mkdir(dir, { recursive: true })

      const old = this.fileMetaFromRelPath((contrato as any)[c.path])

      if ((contrato as any)[c.path]) {
        try {
          await fs.unlink(path.join(app.publicPath(), String((contrato as any)[c.path]).replace(/^\//, '')))
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('No se pudo eliminar archivo anterior:', e)
        }
      }

      const name = `${cuid()}_${archivo.clientName}`
      await archivo.move(dir, { name })
      const rel = `${c.dir}/${contrato.id}/${name}`
      const st = statSync(path.join(dir, name))

      ;(contrato as any)[c.path] = `/${rel}`
      ;(contrato as any)[c.nombre] = archivo.clientName
      ;(contrato as any)[c.mime] = contentType
      ;(contrato as any)[c.size] = Number(st.size)
      await contrato.save()

      await this.logCambioArchivo(
        contrato,
        `${tipo}_afiliacion_archivo`,
        old,
        { nombre: name, url: `/${rel}` },
        actorId
      )

      return response.created({
        contratoId: contrato.id,
        tipo,
        tieneArchivo: true,
        data: { url: `/${rel}`, nombreOriginal: archivo.clientName, mime: contentType, size: st.size },
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error subir afiliación:', error)
      return response.internalServerError({ message: 'Error al subir archivo de afiliación', error: error.message })
    }
  }

  public async eliminarAfiliacionArchivo({ params, response, request }: HttpContext) {
    try {
      const actorId = this.getActorId({ request } as any)
      const contrato = await Contrato.findOrFail(params.id)
      const tipo = String(params.tipo || '').toLowerCase() as any
      if (!ContratosController.TIPOS_AFILIACION.includes(tipo)) {
        return response.badRequest({ message: 'Tipo de afiliación inválido.' })
      }

      const c = this.camposAfiContrato(tipo)
      const rel = (contrato as any)[c.path] as string | null
      const old = this.fileMetaFromRelPath(rel)

      if (rel) {
        try {
          await fs.unlink(path.join(app.publicPath(), rel.replace(/^\//, '')))
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('No se pudo eliminar archivo:', e)
        }
      }

      ;(contrato as any)[c.path] = null
      ;(contrato as any)[c.nombre] = null
      ;(contrato as any)[c.mime] = null
      ;(contrato as any)[c.size] = null
      await contrato.save()

      await this.logCambioArchivo(contrato, `${tipo}_afiliacion_archivo`, old, null, actorId)

      return response.ok({ message: `Archivo de ${tipo.toUpperCase()} eliminado.` })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') return response.notFound({ message: 'Contrato no encontrado' })
      console.error('Error eliminar afiliación:', error)
      return response.internalServerError({
        message: 'Error al eliminar archivo de afiliación',
        error: error.message,
      })
    }
  }
}
