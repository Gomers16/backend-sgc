// app/controllers/facturacion_tickets_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import Database from '@adonisjs/lucid/services/db'
import FacturacionTicket, { type FactEstado } from '#models/facturacion_ticket'
import CaptacionDateo from '#models/captacion_dateo'
import TurnoRtm from '#models/turno_rtm'
import Servicio from '#models/servicio'
import Comision from '#models/comision'

/** Carpeta para subir tickets (local). */
const UPLOAD_BASE_DIR = app.makePath('uploads/tickets')

/** Ventana para considerar duplicado por contenido. */
const DUP_WINDOW_MINUTES = 60

/* ============================== Tipos DTO / Snapshots ============================== */

interface IAgenteDTO {
  id: number
  nombre: string
  tipo?: string | null
}
interface IConvenioDTO {
  id: number
  codigo?: string | null
  nombre: string
}
interface IUsuarioDTO {
  id: number
  nombres?: string | null
  apellidos?: string | null
}
interface ISedeDTO {
  id: number
  nombre: string
}
interface IServicioDTO {
  id: number
  codigoServicio?: string | null
  nombreServicio?: string | null
}

interface IDateoDTO {
  id: number
  canal: string
  agente: IAgenteDTO | null
  asesorConvenio: IAgenteDTO | null
  convenio: IConvenioDTO | null
}

interface ITurnoDTO {
  id: number
  turnoNumero?: number | null
  turnoNumeroServicio?: number | null
  turnoCodigo?: string | null
  placa?: string | null
  estado?: string | null
  fecha?: string | null
  horaIngreso?: string | null
  horaSalida?: string | null
  tiempoServicio?: string | null
  tipoVehiculo?: string | null
  medioEntero?: string | null
  canalAtribucion?: string | null
  servicio: IServicioDTO | null
  usuario: IUsuarioDTO | null
  sede: ISedeDTO | null
  agenteCaptacion: IAgenteDTO | null
  asesorConvenio: IAgenteDTO | null
  convenio: IConvenioDTO | null
}

interface ITurnoSnapshotReadable {
  turnoNumero?: number | null
  turnoNumeroServicio?: number | null
  turnoCodigo?: string | null
  placa?: string | null
  estado?: string | null
  fecha?: string | null
  horaIngreso?: string | null
  horaSalida?: string | null
  tiempoServicio?: string | null
  tipoVehiculo?: string | null
  medioEntero?: string | null
  canalAtribucion?: string | null
  servicioId?: number | null
  sedeId?: number | null
  agenteCaptacionId?: number | null
  $preloaded?: {
    servicio?: { id: number; codigoServicio?: string | null; nombreServicio?: string | null }
    usuario?: { id: number; nombres?: string | null; apellidos?: string | null }
    sede?: { id: number; nombre: string }
    agenteCaptacion?: { id: number; nombre: string; tipo?: string | null }
    captacionDateo?: {
      id: number
      canal: string
      agente?: { id: number; nombre: string; tipo?: string | null } | null
      asesorConvenio?: { id: number; nombre: string; tipo?: string | null } | null
      convenio?: { id: number; codigo?: string | null; nombre: string } | null
    }
  }
}

interface IComisionLiteDTO {
  id: number
  estado: 'PENDIENTE' | 'APROBADA' | 'PAGADA' | 'ANULADA'
  monto: number
  asesor?: { id: number; nombre: string } | null
  convenio?: { id: number; nombre: string } | null
}

interface ITicketDTO {
  id: number
  estado: FactEstado
  hash: string
  filePath: string | null
  fileMime: string | null
  fileSize: number | null
  imageRotation: number
  createdAt: string
  updatedAt: string

  placa: string | null
  fechaPago: string | null
  total: number | null
  subtotal: number | null
  iva: number | null
  totalFactura: number | null
  vendedorText: string | null
  prefijo: string | null
  consecutivo: string | null

  nit?: string | null
  pin?: string | null
  marca?: string | null

  turnoId: number | null
  servicioId: number | null
  sedeId: number | null
  agenteId: number | null
  dateoId: number | null

  servicioCodigo: string | null
  servicioNombre: string | null
  tipoVehiculoSnapshot: string | null
  turnoGlobal: number | null
  turnoServicio: number | null
  turnoCodigo: string | null
  placaTurno: string | null
  sedeNombre: string | null
  funcionarioNombre: string | null
  canalAtribucion: string | null
  medioEntero: string | null

  turno: ITurnoDTO | null
  dateo: IDateoDTO | null

  comisiones?: IComisionLiteDTO[]
}

/* ============================== Controlador ============================== */

export default class FacturacionTicketsController {
  /** GET /facturacion/tickets */
  public async index({ request }: HttpContext) {
    const q = FacturacionTicket.query().orderBy('created_at', 'desc')

    const desde = request.input('desde') as string | undefined
    const hasta = request.input('hasta') as string | undefined
    const sedeId = toIntOrNull(request.input('sede_id'))
    const agenteId = toIntOrNull(request.input('agente_id'))
    const placa =
      (request.input('placa') as string | undefined)?.toUpperCase()?.replace(/\s+/g, '') || null
    const estado = request.input('estado') as FactEstado | undefined
    const turnoId = toIntOrNull(request.input('turno_id'))
    const dateoId = toIntOrNull(request.input('dateo_id'))
    const vendedor = request.input('vendedor') as string | undefined

    if (desde) {
      const d = DateTime.fromISO(desde).toSQL()
      if (d) q.where('created_at', '>=', d)
    }
    if (hasta) {
      const h = DateTime.fromISO(hasta).toSQL()
      if (h) q.where('created_at', '<=', h)
    }
    if (sedeId) q.where('sede_id', sedeId)
    if (agenteId) q.where('agente_id', agenteId)
    if (placa) q.where('placa', placa)
    if (estado) q.where('estado', estado)
    if (turnoId) q.where('turno_id', turnoId)
    if (dateoId) q.where('dateo_id', dateoId)
    if (vendedor && vendedor.trim().length >= 2)
      q.whereILike('vendedor_text', `%${vendedor.trim()}%`)

    const page = Number(request.input('page') || 1)
    const limit = Math.min(Number(request.input('limit') || 20), 100)
    const pag = await q.paginate(page, limit)

    const { meta, data } = pag.toJSON()
    const rows = data.map((t: any) => ({
      id: t.id,
      estado: t.estado,
      placa: t.placa ?? null,
      fecha_pago: t.fechaPago ?? null,
      total_factura: (t.totalFactura ?? t.total) ?? null,

      servicio_nombre: t.servicioNombre ?? null,
      sede_nombre: t.sedeNombre ?? null,
      vendedor_text: t.vendedorText ?? null,

      nit: t.nit ?? null,
      pin: t.pin ?? null,
      marca: t.marca ?? null,

      canal_atribucion: t.canalAtribucion ?? null,
      agente_comercial_nombre: t.agenteComercialNombre ?? null,
      convenio_nombre: t.convenioNombre ?? null,
    }))

    return { meta, data: rows }
  }

  /** GET /facturacion/tickets/:id */
  public async show({ params, response }: HttpContext) {
    const ticket = await FacturacionTicket.query()
      .where('id', params.id)
      .preload('agente')
      .preload('sede')
      .preload('servicio')
      .preload('dateo', (q) =>
        q.preload('agente').preload('asesorConvenio').preload('convenio')
      )
      .preload('turno', (q) => {
        q.preload('servicio')
          .preload('usuario')
          .preload('sede')
          .preload('agenteCaptacion')
          .preload('captacionDateo', (cq) =>
            cq.preload('agente').preload('asesorConvenio').preload('convenio')
          )
      })
      .first()

    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })
    const dto = await this.getTicketDTOById(ticket.id)
    return dto
  }

  /** GET /facturacion/tickets/hash-exists/:hash */
  public async hashExists({ params }: HttpContext) {
    const dup = await FacturacionTicket.findBy('hash', params.hash)
    return { exists: !!dup }
  }

  /** GET /facturacion/tickets/duplicados */
  public async checkDuplicados({ request }: HttpContext) {
    const placa =
      (request.input('placa') as string | undefined)?.toUpperCase()?.replace(/\s+/g, '') || ''
    const total = toNumberOrZero(request.input('total'))
    const fechaIso = request.input('fecha_pago_iso') as string | undefined
    if (!placa || !total || !fechaIso) return { possible: false, count: 0 }

    const fecha = DateTime.fromISO(fechaIso)
    const from = fecha.minus({ minutes: DUP_WINDOW_MINUTES }).toSQL()
    const to = fecha.plus({ minutes: DUP_WINDOW_MINUTES }).toSQL()

    const countRow = await FacturacionTicket.query()
      .where('placa', placa)
      .where('total', total)
      .whereBetween('fecha_pago', [from!, to!])
      .count('* as total')
      .first()

    const n = Number(countRow?.$extras.total || 0)
    return { possible: n > 0, count: n }
  }

  /**
   * POST /facturacion/tickets
   * Sube archivo + metadatos (turno_id, dateo_id, sede_id, servicio_id).
   * Completa placa/agente/sede/servicio desde dateo/turno y persiste snapshots.
   */
  public async store({ request, auth, response }: HttpContext) {
    const file = request.file('archivo', { size: '8mb', extnames: ['jpg', 'jpeg', 'png'] })
    if (!file) return response.badRequest({ message: 'archivo (image/*) requerido' })
    if (!file.isValid) return response.badRequest({ message: file.errors })

    const buffer = await fs.readFile(file.tmpPath!)
    const hash = digestSHA256(buffer)

    const dup = await FacturacionTicket.findBy('hash', hash)
    if (dup)
      return response.conflict({
        message: 'Este ticket ya fue cargado (hash duplicado)',
        id: dup.id,
      })

    const now = DateTime.now()
    const outDir = path.join(
      UPLOAD_BASE_DIR,
      String(now.year),
      String(now.month).padStart(2, '0')
    )
    await fs.mkdir(outDir, { recursive: true })
    const filename = `${cuid()}.${file.extname}`
    const filePath = path.join(outDir, filename)
    await fs.copyFile(file.tmpPath!, filePath)

    const turnoId = toIntOrNull(request.input('turno_id'))
    const dateoId = toIntOrNull(request.input('dateo_id'))
    const sedeId = toIntOrNull(request.input('sede_id'))
    const servicioId = toIntOrNull(request.input('servicio_id'))
    const imageRotation = Number(request.input('image_rotation') || 0)

    const ticket = new FacturacionTicket()
    ticket.hash = hash
    ticket.filePath = filePath.replace(app.makePath(), '')
    ticket.fileMime = file.type
    ticket.fileSize = buffer.length
    ticket.imageRotation = imageRotation
    ticket.estado = 'BORRADOR'
    ticket.createdById = auth.user?.id ?? null

    ticket.turnoId = turnoId
    ticket.dateoId = dateoId
    ticket.sedeId = sedeId
    ticket.servicioId = servicioId

    // === DETECTAR SI ES SOAT ===
    let esSOAT = false
    if (servicioId) {
      const s = await Servicio.find(servicioId)
      if (s) {
        esSOAT = isSOAT(s.codigoServicio, s.nombreServicio)
        ticket.servicioCodigo = s.codigoServicio ?? null
        ticket.servicioNombre = s.nombreServicio ?? null
      }
    }

    if (dateoId) {
      const dateo = await CaptacionDateo.query()
        .where('id', dateoId)
        .preload('agente')
        .preload('asesorConvenio')
        .preload('convenio')
        .first()

      if (dateo) {
        if (!ticket.placa && (dateo.placa || '').trim()) {
          ticket.placa = (dateo.placa || '').toUpperCase().replace(/\s+/g, '')
        }
        ticket.agenteId = dateo.agenteId ?? ticket.agenteId ?? null
        ticket.captacionCanal = dateo.canal ?? null
        ticket.agenteComercialNombre = dateo.$preloaded?.agente?.nombre ?? null
        ticket.asesorConvenioNombre = dateo.$preloaded?.asesorConvenio?.nombre ?? null
        ticket.convenioNombre = dateo.$preloaded?.convenio?.nombre ?? null
      }
    }

    let turno: TurnoRtm | null = null
    if (turnoId) {
      turno = await TurnoRtm.query()
        .where('id', turnoId)
        .preload('servicio')
        .preload('usuario')
        .preload('sede')
        .first()
    }

    if (turno) {
      const turnSnap = turno as unknown as ITurnoSnapshotReadable
      if (!ticket.placa && (turnSnap.placa || '').trim()) {
        ticket.placa = (turnSnap.placa || '').toUpperCase().replace(/\s+/g, '')
      }
      ticket.sedeId = ticket.sedeId || turnSnap.sedeId || null
      ticket.agenteId = ticket.agenteId || turnSnap.agenteCaptacionId || null
      ticket.servicioId = ticket.servicioId || turnSnap.servicioId || null
      await this.fillSnapshotsFromTurno(ticket, turno)
    } else if (ticket.servicioId && !esSOAT) {
      const s = await Servicio.find(ticket.servicioId)
      if (s) {
        ticket.servicioCodigo = s.codigoServicio ?? null
        ticket.servicioNombre = s.nombreServicio ?? null
      }
    }

    await ticket.save()
    return response.created(ticket)
  }

  /** POST /facturacion/tickets/:id/reocr */
  public async reocr({ params, response }: HttpContext) {
    const ticket = await FacturacionTicket.find(params.id)
    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

    // === NO HACER OCR SI ES SOAT ===
    const esSOAT = isSOAT(ticket.servicioCodigo, ticket.servicioNombre)
    if (esSOAT) {
      return response.ok({ message: 'SOAT no requiere OCR', ticket })
    }

    const res = fakeOCR()
    ticket.ocrText = res.text
    ticket.ocrConfPlaca = res.confidence.placa
    ticket.ocrConfTotal = res.confidence.total
    ticket.ocrConfFecha = res.confidence.fecha
    ticket.ocrConfAgente = res.confidence.agente

    if (res.placa) ticket.placa = res.placa
    if (res.total) {
      ticket.total = res.total
      ticket.totalFactura = res.total
    }
    if (res.fechaHora) ticket.fechaPago = DateTime.fromISO(res.fechaHora)

    if (ticket.estado === 'BORRADOR') ticket.estado = 'OCR_LISTO'

    await ticket.save()
    return ticket
  }

  /** PATCH /facturacion/tickets/:id */
  public async update({ params, request, response }: HttpContext) {
    const ticket = await FacturacionTicket.find(params.id)
    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

    const up = request.only([
      'placa',
      'total',
      'fecha_pago',
      'sede_id',
      'agente_id',
      'prefijo',
      'consecutivo',
      'forma_pago',
      'servicio_id',
      'doc_tipo',
      'doc_numero',
      'nombre',
      'telefono',
      'observaciones',
      'ocr_conf_baja_revisado',
      'image_rotation',
      'nit',
      'pin',
      'marca',
      'vendedor_text',
      'subtotal',
      'iva',
      'total_factura',
      'pago_consignacion',
      'pago_tarjeta',
      'pago_efectivo',
      'pago_cambio',
      'turno_id',
      'dateo_id',
      'vendedor',
      'ocr_campos',
    ]) as Record<string, unknown>

    // === DETECTAR SI ES SOAT ===
    const esSOAT = isSOAT(ticket.servicioCodigo, ticket.servicioNombre)

    if ('placa' in up) ticket.placa = String(up.placa || '').toUpperCase().replace(/\s+/g, '')
    if ('total' in up) ticket.total = toNumberOrZero(up.total)
    if ('fecha_pago' in up)
      ticket.fechaPago = up.fecha_pago ? DateTime.fromISO(String(up.fecha_pago)) : null
    if ('sede_id' in up) ticket.sedeId = toIntOrNull(up.sede_id)
    if ('agente_id' in up) ticket.agenteId = toIntOrNull(up.agente_id)
    if ('prefijo' in up) ticket.prefijo = nullIfEmpty(up.prefijo)
    if ('consecutivo' in up) ticket.consecutivo = nullIfEmpty(up.consecutivo)
    if ('forma_pago' in up) ticket.formaPago = nullIfEmpty(up.forma_pago)
    if ('servicio_id' in up) ticket.servicioId = toIntOrNull(up.servicio_id)
    if ('doc_tipo' in up) ticket.docTipo = nullIfEmpty(up.doc_tipo)
    if ('doc_numero' in up) ticket.docNumero = nullIfEmpty(up.doc_numero)
    if ('nombre' in up) ticket.nombre = nullIfEmpty(up.nombre)
    if ('telefono' in up) ticket.telefono = nullIfEmpty(up.telefono)
    if ('observaciones' in up) ticket.observaciones = nullIfEmpty(up.observaciones)
    if ('ocr_conf_baja_revisado' in up)
      ticket.ocrConfBajaRevisado = Boolean(up.ocr_conf_baja_revisado)
    if ('image_rotation' in up) ticket.imageRotation = Number(up.image_rotation) || 0

    if ('nit' in up) ticket.nit = nullIfEmpty(sanitizeNit(String(up.nit)))
    if ('pin' in up) ticket.pin = nullIfEmpty(String(up.pin))
    if ('marca' in up) ticket.marca = nullIfEmpty(String(up.marca))
    if ('vendedor_text' in up) ticket.vendedorText = nullIfEmpty(String(up.vendedor_text))
    if ('vendedor' in up && up.vendedor !== undefined && up.vendedor !== null) {
      ticket.vendedorText = nullIfEmpty(String(up.vendedor))
    }

    if ('subtotal' in up) ticket.subtotal = toNumberOrZero(up.subtotal)
    if ('iva' in up) ticket.iva = toNumberOrZero(up.iva)
    if ('total_factura' in up) ticket.totalFactura = toNumberOrZero(up.total_factura)

    if ('pago_consignacion' in up)
      ticket.pagoConsignacion = toNumberOrZero(up.pago_consignacion)
    if ('pago_tarjeta' in up) ticket.pagoTarjeta = toNumberOrZero(up.pago_tarjeta)
    if ('pago_efectivo' in up) ticket.pagoEfectivo = toNumberOrZero(up.pago_efectivo)
    if ('pago_cambio' in up) ticket.pagoCambio = toNumberOrZero(up.pago_cambio)

    if (up.ocr_campos && typeof up.ocr_campos === 'object') {
      const c = up.ocr_campos as any
      if (c.vendedor) ticket.vendedorText = ticket.vendedorText ?? String(c.vendedor)
      if (c.prefijo) ticket.prefijo = ticket.prefijo ?? String(c.prefijo)
      if (c.consecutivo) ticket.consecutivo = ticket.consecutivo ?? String(c.consecutivo)

      if (c.nit) ticket.nit = ticket.nit ?? sanitizeNit(String(c.nit))
      if (c.pin) ticket.pin = ticket.pin ?? String(c.pin)
      if (c.marca) ticket.marca = ticket.marca ?? String(c.marca)

      const sub = Number(c.subtotal || 0)
      const iva = Number(c.iva || 0)
      const tf = Number(c.totalFactura || c.total || 0)
      if (!ticket.subtotal && sub) ticket.subtotal = sub
      if (!ticket.iva && iva) ticket.iva = iva
      if (!ticket.totalFactura && tf) ticket.totalFactura = tf
      if (!ticket.total && tf) ticket.total = tf

      if (!ticket.fechaPago && c.fechaHora) {
        const dt = DateTime.fromISO(String(c.fechaHora))
        if (dt.isValid) ticket.fechaPago = dt
      }

      if (!ticket.placa && c.placa) {
        ticket.placa = String(c.placa).toUpperCase().replace(/\s+/g, '')
      }
    }

    // === PARA SOAT: NO VALIDAR CAMPOS OBLIGATORIOS ===
    if (!esSOAT && canConfirm(ticket, false) &&
        (ticket.estado === 'BORRADOR' || ticket.estado === 'OCR_LISTO')) {
      ticket.estado = 'LISTA_CONFIRMAR'
    }

    if ('servicio_id' in up && ticket.servicioId) {
      const s = await Servicio.find(ticket.servicioId)
      if (s) {
        ticket.servicioCodigo = s.codigoServicio ?? null
        ticket.servicioNombre = s.nombreServicio ?? null
      }
    }

    const newTurnoId = toIntOrNull(up.turno_id)
    const newDateoId = toIntOrNull(up.dateo_id)
    if (newTurnoId && !ticket.turnoId) ticket.turnoId = newTurnoId
    if (newDateoId && !ticket.dateoId) ticket.dateoId = newDateoId

    if (ticket.turnoId) {
      const t = await TurnoRtm.query()
        .where('id', ticket.turnoId)
        .preload('servicio')
        .preload('usuario')
        .preload('sede')
        .first()
      if (t) await this.fillSnapshotsFromTurno(ticket, t)
    }

    if (ticket.dateoId) {
      const d = await CaptacionDateo.query()
        .where('id', ticket.dateoId)
        .preload('agente')
        .preload('asesorConvenio')
        .preload('convenio')
        .first()
      if (d) {
        ticket.captacionCanal = d.canal ?? ticket.captacionCanal ?? null
        ticket.agenteComercialNombre =
          d.$preloaded?.agente?.nombre ?? ticket.agenteComercialNombre ?? null
        ticket.asesorConvenioNombre =
          d.$preloaded?.asesorConvenio?.nombre ?? ticket.asesorConvenioNombre ?? null
        ticket.convenioNombre =
          d.$preloaded?.convenio?.nombre ?? ticket.convenioNombre ?? null
      }
    }

    await ticket.save()
    return ticket
  }

  /**
   * POST /facturacion/tickets/:id/confirmar
   * Confirma y persiste snapshots del turno/servicio en la fila.
   * Genera comisiones según reglas RTM + dateo.
   */
  public async confirmar({ params, request, response, auth }: HttpContext) {
    const forzar = Boolean(request.input('forzar'))
    const ticket = await FacturacionTicket.find(params.id)
    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

    // === DETECTAR SI ES SOAT ===
    const esSOAT = isSOAT(ticket.servicioCodigo, ticket.servicioNombre)

    // === VALIDACIÓN OBLIGATORIOS (excepto para SOAT) ===
    if (!esSOAT && !canConfirm(ticket, true)) {
      return response.badRequest({ message: 'Faltan campos obligatorios para confirmar' })
    }

    // === PARA SOAT: SOLO VALIDAR QUE TENGA IMAGEN ===
    if (esSOAT && !ticket.filePath) {
      return response.badRequest({ message: 'SOAT requiere al menos la imagen de la factura' })
    }

    // Duplicado por contenido (solo si NO es SOAT)
    if (!esSOAT) {
      const dup = await isContentDuplicate(ticket)
      ticket.duplicadoPorContenido = dup
      ticket.posibleDuplicadoAt = dup ? DateTime.now() : null
      if (dup && !forzar) {
        await ticket.save()
        return response.conflict({
          message: 'Posible duplicado por contenido (placa+total+fecha ±1h)',
          posibleDuplicado: true,
        })
      }
    }

    ticket.estado = 'CONFIRMADA'
    ticket.confirmadoAt = DateTime.now()
    ticket.confirmedById = auth.user?.id ?? null

    if (!ticket.agenteId && ticket.dateoId) {
      const d = await CaptacionDateo.find(ticket.dateoId)
      if (d?.agenteId) ticket.agenteId = d.agenteId
    }
    if (!ticket.sedeId && ticket.turnoId) {
      const t = await TurnoRtm.find(ticket.turnoId)
      if (t?.sedeId) ticket.sedeId = (t as unknown as { sedeId: number | null }).sedeId ?? null
    }
    if (!ticket.servicioId && ticket.turnoId) {
      const t = await TurnoRtm.find(ticket.turnoId)
      if (t?.servicioId)
        ticket.servicioId = (t as unknown as { servicioId: number | null }).servicioId ?? null
    }

    let turno: TurnoRtm | null = null
    if (ticket.turnoId) {
      turno = await TurnoRtm.query()
        .where('id', ticket.turnoId)
        .preload('servicio')
        .preload('usuario')
        .preload('sede')
        .first()
      if (turno) await this.fillSnapshotsFromTurno(ticket, turno)
    }

    if (!turno && ticket.servicioId) {
      const s = await Servicio.find(ticket.servicioId)
      if (s) {
        ticket.servicioCodigo = s.codigoServicio ?? null
        ticket.servicioNombre = s.nombreServicio ?? null
      }
    }

    await ticket.save()

    if (ticket.turnoId) {
      const turnoToUpdate = await TurnoRtm.find(ticket.turnoId)
      if (turnoToUpdate) {
        const nowBog = DateTime.local().setZone('America/Bogota')
        turnoToUpdate.tieneFacturacion = true
        turnoToUpdate.horaFacturacion = nowBog.toFormat('HH:mm:ss')
        await turnoToUpdate.save()
      }
    }

    // === COMISIONES: SOLO PARA RTM (NO PARA SOAT) ===
    if (!esSOAT) {
      try {
        await this.applyCommissionHook(ticket)
      } catch (err) {
        console.error('Commission hook failed:', err)
      }
    }

    const dto = await this.getTicketDTOById(ticket.id)
    return dto
  }

  // ========================== Privados / Hook Comisiones ==========================

  private async applyCommissionHook(ticket: FacturacionTicket) {
    if (ticket.estado !== 'CONFIRMADA') return

    // === SOLO RTM GENERA COMISIONES ===
    const esRTM = isRTM(ticket.servicioCodigo, ticket.servicioNombre)
    if (!esRTM) return

    let turnoForTipo: TurnoRtm | null = null

    if (!ticket.dateoId && ticket.turnoId) {
      turnoForTipo = await TurnoRtm.find(ticket.turnoId)
      const maybe = turnoForTipo as unknown as { captacionDateoId?: number | null } | null
      if (maybe?.captacionDateoId) {
        ticket.dateoId = maybe.captacionDateoId
        await ticket.save()
      }
    }

    if (!ticket.dateoId) return

    const dateo = await CaptacionDateo.query()
      .where('id', ticket.dateoId)
      .preload('agente')
      .preload('asesorConvenio')
      .preload('convenio', (qConvenio) => {
        qConvenio.preload('asesorConvenio')
      })
      .first()

    if (!dateo) return

    let turnoTipoVehiculo: string | null = null
    if (!turnoForTipo && ticket.turnoId) {
      turnoForTipo = await TurnoRtm.find(ticket.turnoId)
    }
    if (turnoForTipo) {
      const anyTurno = turnoForTipo as any
      turnoTipoVehiculo = anyTurno.tipoVehiculo ?? anyTurno.tipo_vehiculo ?? null
    }

    const tipoVehiculoComision = inferTipoVehiculoComision({
      ticketTipo: (ticket as any).tipoVehiculoSnapshot ?? (ticket as any).tipo_vehiculo ?? null,
      turnoTipo: turnoTipoVehiculo,
    })

    const now = DateTime.now()
    const usuarioId = ticket.confirmedById ?? ticket.createdById ?? null

    let valorPlacaAsesor = 0
    let valorDateoAsesor = 0
    let valorPlacaConvenio = 0
    let valorDateoConvenio = 0

    const configGlobal = await findConfigComisionDateo({
      asesorId: null,
      tipoVehiculo: tipoVehiculoComision,
    })

    if (configGlobal) {
      valorPlacaAsesor = configGlobal.valorPlaca
      valorDateoAsesor = configGlobal.valorDateo
      valorPlacaConvenio = configGlobal.valorPlaca
      valorDateoConvenio = configGlobal.valorDateo
    }

    if (dateo.agenteId) {
      const cfgAsesor = await findConfigComisionDateo({
        asesorId: dateo.agenteId,
        tipoVehiculo: tipoVehiculoComision,
      })

      if (cfgAsesor) {
        valorPlacaAsesor = cfgAsesor.valorPlaca
        valorDateoAsesor = cfgAsesor.valorDateo
      }
    }

    let asesorConvenioIdReal: number | null = null

    if (dateo.convenioId && dateo.$preloaded?.convenio?.$preloaded?.asesorConvenio) {
      asesorConvenioIdReal = dateo.$preloaded.convenio.$preloaded.asesorConvenio.id

      const cfgConvenio = await findConfigComisionDateo({
        asesorId: asesorConvenioIdReal,
        tipoVehiculo: tipoVehiculoComision,
      })

      if (cfgConvenio) {
        valorPlacaConvenio = cfgConvenio.valorPlaca
        valorDateoConvenio = cfgConvenio.valorDateo
      }
    }

    if (
      valorPlacaAsesor === 0 &&
      valorDateoAsesor === 0 &&
      valorPlacaConvenio === 0 &&
      valorDateoConvenio === 0
    ) {
      console.warn(`⚠️ No hay configuración de comisión para tipo_vehiculo: ${tipoVehiculoComision}`)
      return
    }

    const startDay = now.startOf('day').toSQL()
    const endDay = now.endOf('day').toSQL()

    const trx = await Database.transaction()
    try {
      const existingComision = await Comision.query({ client: trx })
        .where('captacion_dateo_id', dateo.id)
        .whereBetween('fecha_calculo', [startDay!, endDay!])
        .where('tipo_servicio', 'RTM')
        .first()

      if (existingComision) {
        console.log('⚠️ Ya existe una comisión para este dateo hoy')
        await trx.rollback()
        return
      }

      if (dateo.convenioId) {
        const esAsesorConvenioQuienDatea =
          dateo.agenteId && asesorConvenioIdReal && dateo.agenteId === asesorConvenioIdReal

        if (esAsesorConvenioQuienDatea) {
          const c = new Comision()
          c.captacionDateoId = dateo.id
          c.asesorId = asesorConvenioIdReal
          c.convenioId = dateo.convenioId
          c.tipoServicio = 'RTM'
          c.base = String(valorPlacaConvenio)
          c.porcentaje = '0'
          c.monto = String(valorDateoConvenio)
          c.montoAsesor = String(valorDateoConvenio)
          c.montoConvenio = String(valorPlacaConvenio)
          c.asesorSecundarioId = null
          c.estado = 'PENDIENTE'
          c.fechaCalculo = now
          c.calculadoPor = usuarioId
          if (tipoVehiculoComision) (c as any).tipoVehiculo = tipoVehiculoComision
          await c.useTransaction(trx).save()

          console.log(
            `✅ Comisión creada (Caso 2): Asesor convenio datea propio convenio - Dateo: ${valorDateoConvenio}, Placa: ${valorPlacaConvenio}, Total: ${valorPlacaConvenio + valorDateoConvenio}`
          )
        } else {
          if (!dateo.agenteId) {
            console.warn('⚠️ No hay asesor comercial')
            await trx.rollback()
            return
          }

          const c = new Comision()
          c.captacionDateoId = dateo.id
          c.asesorId = dateo.agenteId
          c.convenioId = dateo.convenioId
          c.tipoServicio = 'RTM'
          c.base = String(valorPlacaConvenio)
          c.porcentaje = '0'
          c.monto = String(valorDateoAsesor)

          c.montoAsesor = String(valorDateoAsesor)
          c.montoConvenio = String(valorPlacaConvenio)
          c.asesorSecundarioId = asesorConvenioIdReal

          c.estado = 'PENDIENTE'
          c.fechaCalculo = now
          c.calculadoPor = usuarioId
          if (tipoVehiculoComision) (c as any).tipoVehiculo = tipoVehiculoComision
          await c.useTransaction(trx).save()

          console.log(
            `✅ Comisión creada (Caso 1): Comercial datea convenio - Asesor: ${valorDateoAsesor}, Convenio: ${valorPlacaConvenio}, Total: ${valorDateoAsesor + valorPlacaConvenio}`
          )
        }
      } else {
        if (!dateo.agenteId) {
          console.warn('⚠️ No hay asesor')
          await trx.rollback()
          return
        }

        const c = new Comision()
        c.captacionDateoId = dateo.id
        c.asesorId = dateo.agenteId
        c.convenioId = null
        c.tipoServicio = 'RTM'
        c.base = String(valorPlacaAsesor)
        c.porcentaje = '0'
        c.monto = String(valorDateoAsesor)
        c.montoAsesor = String(valorDateoAsesor)
        c.montoConvenio = String(valorPlacaAsesor)
        c.asesorSecundarioId = null
        c.estado = 'PENDIENTE'
        c.fechaCalculo = now
        c.calculadoPor = usuarioId
        if (tipoVehiculoComision) (c as any).tipoVehiculo = tipoVehiculoComision
        await c.useTransaction(trx).save()

        console.log(
          `✅ Comisión creada (Caso 3): Sin convenio - Dateo: ${valorDateoAsesor}, Placa: ${valorPlacaAsesor}, Total: ${valorPlacaAsesor + valorDateoAsesor}`
        )
      }

      if (dateo.resultado !== 'EXITOSO') {
        dateo.resultado = 'EXITOSO'
        await dateo.useTransaction(trx).save()
      }

      await trx.commit()
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  private async fillSnapshotsFromTurno(ticket: FacturacionTicket, turno: TurnoRtm) {
    const t = turno as unknown as ITurnoSnapshotReadable

    ticket.turnoNumeroGlobal = t.turnoNumero ?? ticket.turnoNumeroGlobal ?? null
    ticket.turnoNumeroServicio = t.turnoNumeroServicio ?? ticket.turnoNumeroServicio ?? null
    ticket.turnoCodigo = t.turnoCodigo ?? ticket.turnoCodigo ?? null

    ticket.tipoVehiculoSnapshot = t.tipoVehiculo ?? ticket.tipoVehiculoSnapshot ?? null
    ticket.placaTurno = t.placa ?? ticket.placaTurno ?? null
    ticket.canalAtribucion = t.canalAtribucion ?? ticket.canalAtribucion ?? null
    ticket.medioEntero = t.medioEntero ?? ticket.medioEntero ?? null

    const s = t.$preloaded?.servicio ?? null
    if (s) {
      ticket.servicioId = ticket.servicioId || s.id || null
      ticket.servicioCodigo = s.codigoServicio ?? ticket.servicioCodigo ?? null
      ticket.servicioNombre = s.nombreServicio ?? ticket.servicioNombre ?? null
    }

    const sede = t.$preloaded?.sede ?? null
    if (sede) ticket.sedeNombre = sede.nombre ?? ticket.sedeNombre ?? null

    const usuario = t.$preloaded?.usuario ?? null
    if (usuario) {
      const nombre = [usuario.nombres, usuario.apellidos].filter(Boolean).join(' ')
      ticket.funcionarioNombre = nombre || ticket.funcionarioNombre || null
    }
  }

  private async getTicketDTOById(id: number): Promise<ITicketDTO> {
    const t = await FacturacionTicket.query()
      .where('id', id)
      .preload('servicio')
      .preload('sede')
      .preload('agente')
      .preload('dateo', (dq) =>
        dq.preload('agente').preload('asesorConvenio').preload('convenio')
      )
      .preload('turno', (tq) =>
        tq
          .preload('servicio')
          .preload('usuario')
          .preload('sede')
          .preload('agenteCaptacion')
          .preload('captacionDateo', (cq) =>
            cq.preload('agente').preload('asesorConvenio').preload('convenio')
          )
      )
      .firstOrFail()

    const dto = buildTicketDTO(t)

    const pre = (t as any).$preloaded || {}
    const dateoIdFromTurno = pre.turno?.$preloaded?.captacionDateo?.id ?? null
    const dateoId: number | null = (t as any).dateoId ?? dateoIdFromTurno ?? null

    if (dateoId) {
      const comisiones = await Comision.query()
        .where('captacion_dateo_id', dateoId)
        .orderBy('fecha_calculo', 'desc')
        .preload('asesor')
        .preload('convenio')

      dto.comisiones = comisiones.map((c) => ({
        id: c.id,
        estado: c.estado,
        monto: Number(c.monto ?? 0),
        asesor: c.$preloaded?.asesor
          ? { id: c.$preloaded.asesor.id, nombre: c.$preloaded.asesor.nombre }
          : null,
        convenio: c.$preloaded?.convenio
          ? { id: c.$preloaded.convenio.id, nombre: c.$preloaded.convenio.nombre }
          : null,
      }))
    }

    return dto
  }

  /**
   * GET /facturacion/tickets/:id/imagen
   * Sirve la imagen del ticket de facturación
   */
  public async servirImagen({ params, response }: HttpContext) {
    const ticket = await FacturacionTicket.find(params.id)

    if (!ticket) {
      return response.notFound({ message: 'Ticket no encontrado' })
    }

    if (!ticket.filePath) {
      return response.notFound({ message: 'El ticket no tiene imagen asociada' })
    }

    try {
      const absolutePath = app.makePath(ticket.filePath)

      // Verificar que el archivo existe
      await fs.access(absolutePath)

      // Servir el archivo con el tipo MIME correcto
      return response
        .header('Content-Type', ticket.fileMime || 'image/jpeg')
        .download(absolutePath)
    } catch (err) {
      console.error('Error sirviendo imagen del ticket:', err)
      return response.notFound({ message: 'No se pudo cargar la imagen del ticket' })
    }
  }
}

/* ============================== Utils ============================== */

/** Detecta si un servicio es RTM por código o nombre */
function isRTM(codigo?: string | null, nombre?: string | null): boolean {
  const c = (codigo || '').toUpperCase().trim()
  const n = (nombre || '').toUpperCase().trim()
  if (c.includes('RTM')) return true
  if (n.includes('RTM')) return true
  if (n.includes('TECNOMECANICA') || n.includes('TECNOMECÁNICA')) return true
  if (n.includes('REVISION') && n.includes('TECNICO')) return true
  return false
}

/** Detecta si un servicio es SOAT por código o nombre */
function isSOAT(codigo?: string | null, nombre?: string | null): boolean {
  const c = (codigo || '').toUpperCase().trim()
  const n = (nombre || '').toUpperCase().trim()
  return c.includes('SOAT') || n.includes('SOAT')
}

function digestSHA256(buffer: Buffer): string {
  const h = crypto.createHash('sha256')
  h.update(buffer)
  return h.digest('hex')
}

function toIntOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function toNumberOrZero(v: unknown): number {
  const n = Number(String(v).replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function nullIfEmpty(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim()
  return s.length ? s : null
}

function sanitizeNit(v: string): string {
  return String(v).replace(/[^\d\-\.]/g, '')
}

function placaValida(placa?: string | null): boolean {
  if (!placa) return false
  const rex = /^(?:[A-Z]{3}\d{3}|[A-Z]{3}\d{2}[A-Z])$/
  return rex.test(placa.toUpperCase())
}

function canConfirm(t: FacturacionTicket, _hard: boolean): boolean {
  const totalNum = t.total && t.total > 0 ? t.total : t.totalFactura || 0
  const base =
    placaValida(t.placa) &&
    !!totalNum &&
    totalNum > 0 &&
    !!t.fechaPago &&
    (!!t.sedeId || !!t.agenteId)
  return base
}

async function isContentDuplicate(t: FacturacionTicket): Promise<boolean> {
  const totalNum = t.total && t.total > 0 ? t.total : t.totalFactura || 0
  if (!t.placa || !totalNum || !t.fechaPago) return false
  const min = t.fechaPago.minus({ minutes: DUP_WINDOW_MINUTES }).toSQL()
  const max = t.fechaPago.plus({ minutes: DUP_WINDOW_MINUTES }).toSQL()

  const row = await FacturacionTicket.query()
    .whereNot('id', t.id || 0)
    .where('placa', t.placa)
    .where('total', totalNum)
    .whereBetween('fecha_pago', [min!, max!])
    .count('* as total')
  const n = Number(row[0]?.$extras.total || 0)
  return n > 0
}

/* =================== DTO / Serializadores =================== */

function serializeTurnoEnriquecido(turno: TurnoRtm): ITurnoDTO {
  const t = turno as unknown as ITurnoSnapshotReadable

  const servicio: IServicioDTO | null = t.$preloaded?.servicio
    ? {
        id: t.$preloaded.servicio.id,
        codigoServicio: t.$preloaded.servicio.codigoServicio ?? null,
        nombreServicio: t.$preloaded.servicio.nombreServicio ?? null,
      }
    : null

  const usuario: IUsuarioDTO | null = t.$preloaded?.usuario
    ? {
        id: t.$preloaded.usuario.id,
        nombres: t.$preloaded.usuario.nombres ?? null,
        apellidos: t.$preloaded.usuario.apellidos ?? null,
      }
    : null

  const sede: ISedeDTO | null = t.$preloaded?.sede
    ? { id: t.$preloaded.sede.id, nombre: t.$preloaded.sede.nombre }
    : null

  const agenteCaptacion: IAgenteDTO | null = t.$preloaded?.agenteCaptacion
    ? {
        id: t.$preloaded.agenteCaptacion.id,
        nombre: t.$preloaded.agenteCaptacion.nombre,
        tipo: t.$preloaded.agenteCaptacion.tipo ?? null,
      }
    : null

  const dateo = t.$preloaded?.captacionDateo ?? null
  const asesorConvenio: IAgenteDTO | null = dateo?.asesorConvenio
    ? {
        id: dateo.asesorConvenio.id,
        nombre: dateo.asesorConvenio.nombre,
        tipo: dateo.asesorConvenio.tipo ?? null,
      }
    : null

  const convenio: IConvenioDTO | null = dateo?.convenio
    ? {
        id: dateo.convenio.id,
        codigo: dateo.convenio.codigo ?? null,
        nombre: dateo.convenio.nombre,
      }
    : null

  return {
    id: (turno as unknown as { id: number }).id,
    turnoNumero: t.turnoNumero ?? null,
    turnoNumeroServicio: t.turnoNumeroServicio ?? null,
    turnoCodigo: t.turnoCodigo ?? null,
    placa: t.placa ?? null,
    estado: t.estado ?? null,
    fecha: t.fecha ?? null,
    horaIngreso: t.horaIngreso ?? null,
    horaSalida: t.horaSalida ?? null,
    tiempoServicio: t.tiempoServicio ?? null,
    tipoVehiculo: t.tipoVehiculo ?? null,
    medioEntero: t.medioEntero ?? null,
    canalAtribucion: t.canalAtribucion ?? null,
    servicio,
    usuario,
    sede,
    agenteCaptacion,
    asesorConvenio,
    convenio,
  }
}

function buildTicketDTO(ticket: FacturacionTicket): ITicketDTO {
  const s = ticket.serialize() as any

  const pick = (camel: string, snake: string) => s[camel] ?? s[snake] ?? null

  const pre = (ticket as any).$preloaded || {}
  const turnoDTO: ITurnoDTO | null = pre.turno
    ? serializeTurnoEnriquecido(pre.turno as TurnoRtm)
    : null
  const dateoFromTurno = (pre.turno as any)?.$preloaded?.captacionDateo ?? null

  const dateoEnriquecido: IDateoDTO | null =
    s.dateo ??
    (dateoFromTurno
      ? {
          id: dateoFromTurno.id,
          canal: dateoFromTurno.canal,
          agente: dateoFromTurno.agente
            ? {
                id: dateoFromTurno.agente.id,
                nombre: dateoFromTurno.agente.nombre,
                tipo: dateoFromTurno.agente.tipo ?? null,
              }
            : null,
          asesorConvenio: dateoFromTurno.asesorConvenio
            ? {
                id: dateoFromTurno.asesorConvenio.id,
                nombre: dateoFromTurno.asesorConvenio.nombre,
                tipo: dateoFromTurno.asesorConvenio.tipo ?? null,
              }
            : null,
          convenio: dateoFromTurno.convenio
            ? {
                id: dateoFromTurno.convenio.id,
                codigo: dateoFromTurno.convenio.codigo ?? null,
                nombre: dateoFromTurno.convenio.nombre,
              }
            : null,
        }
      : null)

  const servicioCodigo =
    pick('servicioCodigo', 'servicio_codigo') ??
    turnoDTO?.servicio?.codigoServicio ??
    null
  const servicioNombre =
    pick('servicioNombre', 'servicio_nombre') ??
    turnoDTO?.servicio?.nombreServicio ??
    null
  const tipoVehiculoSnapshot =
    pick('tipoVehiculoSnapshot', 'tipo_vehiculo') ??
    turnoDTO?.tipoVehiculo ??
    null
  const turnoGlobal =
    pick('turnoNumeroGlobal', 'turno_numero_global') ??
    turnoDTO?.turnoNumero ??
    null
  const turnoServicio =
    pick('turnoNumeroServicio', 'turno_numero_servicio') ?? turnoDTO?.turnoNumeroServicio ?? null
  const turnoCodigo = pick('turnoCodigo', 'turno_codigo') ?? turnoDTO?.turnoCodigo ?? null
  const placaTurno = pick('placaTurno', 'placa_turno') ?? turnoDTO?.placa ?? null

  const sedeNombre = pick('sedeNombre', 'sede_nombre') ?? turnoDTO?.sede?.nombre ?? null
  const funcionarioNombre =
    pick('funcionarioNombre', 'funcionario_nombre') ??
    (turnoDTO?.usuario
      ? [turnoDTO.usuario.nombres, turnoDTO.usuario.apellidos]
          .filter(Boolean)
          .join(' ')
      : null)

  const canalAtribucion =
    pick('canalAtribucion', 'canal_atribucion') ??
    turnoDTO?.canalAtribucion ??
    null
  const medioEntero =
    pick('medioEntero', 'medio_entero') ??
    turnoDTO?.medioEntero ??
    null

  const dto: ITicketDTO = {
    id: s.id,
    estado: s.estado,
    hash: s.hash,
    filePath: pick('filePath', 'file_path'),
    fileMime: pick('fileMime', 'file_mime'),
    fileSize: pick('fileSize', 'file_size'),
    imageRotation: pick('imageRotation', 'image_rotation'),
    createdAt: pick('createdAt', 'created_at'),
    updatedAt: pick('updatedAt', 'updated_at'),

    placa: s.placa ?? null,
    fechaPago: pick('fechaPago', 'fecha_pago'),
    total: s.total ?? null,
    subtotal: pick('subtotal', 'subtotal'),
    iva: pick('iva', 'iva'),
    totalFactura: pick('totalFactura', 'total_factura'),
    vendedorText: pick('vendedorText', 'vendedor_text'),
    prefijo: s.prefijo ?? null,
    consecutivo: s.consecutivo ?? null,

    nit: s.nit ?? null,
    pin: s.pin ?? null,
    marca: s.marca ?? null,

    turnoId: pick('turnoId', 'turno_id'),
    servicioId: pick('servicioId', 'servicio_id'),
    sedeId: pick('sedeId', 'sede_id'),
    agenteId: pick('agenteId', 'agente_id'),
    dateoId: pick('dateoId', 'dateo_id'),

    servicioCodigo,
    servicioNombre,
    tipoVehiculoSnapshot,
    turnoGlobal,
    turnoServicio,
    turnoCodigo,
    placaTurno,
    sedeNombre,
    funcionarioNombre,
    canalAtribucion,
    medioEntero,

    turno: turnoDTO,
    dateo: dateoEnriquecido,
  }

  return dto
}

/* ======================= Configuración comisiones (helpers) ======================= */

type TipoVehiculoComision = 'MOTO' | 'VEHICULO'

function inferTipoVehiculoComision(opts: {
  ticketTipo?: string | null
  turnoTipo?: string | null
}): TipoVehiculoComision | null {
  const normalize = (v?: string | null) =>
    (v ?? '')
      .toString()
      .toUpperCase()
      .trim()

  const t1 = normalize(opts.ticketTipo)
  const t2 = normalize(opts.turnoTipo)
  const txt = t1 || t2
  if (!txt) return null

  if (txt.includes('MOTO')) return 'MOTO'
  return 'VEHICULO'
}

async function findConfigComisionDateo(params: {
  asesorId: number | null
  tipoVehiculo: TipoVehiculoComision | null
}): Promise<{ valorPlaca: number; valorDateo: number } | null> {
  const { asesorId, tipoVehiculo } = params
  if (!tipoVehiculo) return null

  let row: Comision | null = null

  if (asesorId) {
    row = await Comision.query()
      .where('es_config', true)
      .where('asesor_id', asesorId)
      .where('tipo_vehiculo', tipoVehiculo)
      .first()
  }

  if (!row) {
    row = await Comision.query()
      .where('es_config', true)
      .whereNull('asesor_id')
      .where('tipo_vehiculo', tipoVehiculo)
      .first()
  }

  if (!row && asesorId) {
    row = await Comision.query()
      .where('es_config', true)
      .where('asesor_id', asesorId)
      .whereNull('tipo_vehiculo')
      .first()
  }

  if (!row) {
    row = await Comision.query()
      .where('es_config', true)
      .whereNull('asesor_id')
      .whereNull('tipo_vehiculo')
      .first()
  }

  if (!row) return null

  const num = (v: any) => {
    const n = Number(String(v ?? '').replace(/[^\d.-]/g, ''))
    return Number.isFinite(n) ? n : 0
  }

  return {
    valorPlaca: num(row.base),
    valorDateo: num(row.monto),
  }
}

/* ======================== OCR Fake (ejemplo) ======================== */

function fakeOCR(): {
  text: string
  confidence: { placa: number; total: number; fecha: number; agente: number }
  placa: string
  total: number
  fechaHora: string
} {
  const placas = ['ABC123', 'QQX91C', 'FDS456']
  const placa = placas[Math.floor(Math.random() * placas.length)]
  const totals = [90000, 120000, 150000, 307850]
  const total = totals[Math.floor(Math.random() * totals.length)]
  const fechaHora = DateTime.now().minus({ minutes: 5 }).toISO()

  return {
    text: `TICKET\nTOTAL: ${total}\nPLACA: ${placa}\nFECHA: ${fechaHora}`,
    confidence: { placa: 0.86, total: 0.92, fecha: 0.78, agente: 0.55 },
    placa,
    total,
    fechaHora: fechaHora || DateTime.now().toISO(),
  }
}
