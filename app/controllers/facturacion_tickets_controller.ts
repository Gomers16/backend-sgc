// app/controllers/facturacion_tickets_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import FacturacionTicket, { type FactEstado } from '#models/facturacion_ticket'
import CaptacionDateo from '#models/captacion_dateo'
import TurnoRtm from '#models/turno_rtm'

/**
 * Config rápida para almacenamiento local.
 * Ajusta a tu Drive si lo usas: @adonisjs/drive
 */
const UPLOAD_BASE_DIR = app.makePath('uploads/tickets')

/**
 * Tolerancia para "posible duplicado" por contenido
 * - misma placa (normalizada)
 * - mismo total EXACTO
 * - fecha_pago en rango ±1 hora
 */
const DUP_WINDOW_MINUTES = 60

export default class FacturacionTicketsController {
  /**
   * GET /facturacion/tickets
   * Filtros: desde, hasta (ISO), sede_id, agente_id, placa, estado, turno_id, dateo_id
   */
  public async index({ request }: HttpContext) {
    const q = FacturacionTicket.query().orderBy('created_at', 'desc')

    const desde = request.input('desde') as string | undefined
    const hasta = request.input('hasta') as string | undefined
    const sedeId = toIntOrNull(request.input('sede_id'))
    const agenteId = toIntOrNull(request.input('agente_id'))
    const placa = (request.input('placa') as string | undefined)?.toUpperCase()?.replace(/\s+/g, '') || null
    const estado = request.input('estado') as FactEstado | undefined
    const turnoId = toIntOrNull(request.input('turno_id'))
    const dateoId = toIntOrNull(request.input('dateo_id'))

    if (desde) q.where('created_at', '>=', DateTime.fromISO(desde).toSQL())
    if (hasta) q.where('created_at', '<=', DateTime.fromISO(hasta).toSQL())
    if (sedeId) q.where('sede_id', sedeId)
    if (agenteId) q.where('agente_id', agenteId)
    if (placa) q.where('placa', placa)
    if (estado) q.where('estado', estado)
    if (turnoId) q.where('turno_id', turnoId)
    if (dateoId) q.where('dateo_id', dateoId)

    const page = Number(request.input('page') || 1)
    const limit = Math.min(Number(request.input('limit') || 20), 100)

    const data = await q.paginate(page, limit)
    return data
  }

  /**
   * GET /facturacion/tickets/:id
   * 🔸 Enriquecido: turno con servicio/usuario/sede + agenteCaptacion + captacionDateo(agente, asesorConvenio, convenio)
   */
  public async show({ params, response }: HttpContext) {
    const ticket = await FacturacionTicket.query()
      .where('id', params.id)
      .preload('agente')
      .preload('sede')
      .preload('servicio')
      .preload('dateo', (q) => {
        q.preload('agente').preload('asesorConvenio').preload('convenio')
      })
      .preload('turno', (q) => {
        q
          .preload('servicio')
          .preload('usuario')
          .preload('sede')
          .preload('agenteCaptacion') // ← Asesor comercial del turno
          .preload('captacionDateo', (cq) => {
            cq.preload('agente')          // comercial del dateo (por compat)
              .preload('asesorConvenio')  // ← Asesor convenio
              .preload('convenio')        // ← Convenio
          })
      })
      .first()

    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

    // Serialización enriquecida y segura para el front
    const base = ticket.serialize()
    const turno = (ticket as any).turno as TurnoRtm | null

    const turnoEnriquecido = turno ? serializeTurnoEnriquecido(turno) : null

    // Si el ticket NO tiene dateo pero el turno sí lo aporta, lo exponemos también
    const dateoFromTurno = (turno as any)?.captacionDateo ?? null
    const dateoEnriquecido =
      base.dateo ||
      (dateoFromTurno
        ? {
            id: dateoFromTurno.id,
            canal: dateoFromTurno.canal,
            agente: dateoFromTurno.agente
              ? { id: dateoFromTurno.agente.id, nombre: dateoFromTurno.agente.nombre, tipo: dateoFromTurno.agente.tipo }
              : null,
            asesorConvenio: dateoFromTurno.asesorConvenio
              ? { id: dateoFromTurno.asesorConvenio.id, nombre: dateoFromTurno.asesorConvenio.nombre, tipo: dateoFromTurno.asesorConvenio.tipo }
              : null,
            convenio: dateoFromTurno.convenio
              ? { id: dateoFromTurno.convenio.id, codigo: dateoFromTurno.convenio.codigo, nombre: dateoFromTurno.convenio.nombre }
              : null,
          }
        : null)

    return {
      ...base,
      turno: turnoEnriquecido,
      dateo: dateoEnriquecido,
    }
  }

  /**
   * POST /facturacion/tickets/hash-exists/:hash
   * ó GET según prefieras
   */
  public async hashExists({ params }: HttpContext) {
    const exists = await FacturacionTicket.query().where('hash', params.hash).first()
    return { exists: !!exists }
  }

  /**
   * GET /facturacion/tickets/duplicados
   * Query: placa, total, fecha_pago_iso
   */
  public async checkDuplicados({ request }: HttpContext) {
    const placa =
      (request.input('placa') as string | undefined)?.toUpperCase()?.replace(/\s+/g, '') || ''
    const total = toNumberOrZero(request.input('total'))
    const fechaIso = request.input('fecha_pago_iso') as string | undefined

    if (!placa || !total || !fechaIso) {
      return { possible: false, count: 0 }
    }

    const fecha = DateTime.fromISO(fechaIso)
    const from = fecha.minus({ minutes: DUP_WINDOW_MINUTES }).toSQL()
    const to = fecha.plus({ minutes: DUP_WINDOW_MINUTES }).toSQL()

    const count = await FacturacionTicket.query()
      .where('placa', placa)
      .where('total', total)
      .whereBetween('fecha_pago', [from!, to!])
      .count('* as total')
      .first()

    const n = Number(count?.$extras.total || 0)
    return { possible: n > 0, count: n }
  }

  /**
   * POST /facturacion/tickets
   * Crea ticket desde archivo (image/*) + datos básicos opcionales (turno_id, dateo_id, sede_id, servicio_id)
   * Auto-intenta derivar placa/total/fecha/agente desde el dateo si se suministra dateo_id.
   */
  public async store({ request, auth, response }: HttpContext) {
    const file = request.file('archivo', { size: '8mb', extnames: ['jpg', 'jpeg', 'png'] })
    if (!file) return response.badRequest({ message: 'archivo (image/*) requerido' })
    if (!file.isValid) return response.badRequest({ message: file.errors })

    // Lee buffer para hash y tamaño
    const buffer = await fs.readFile(file.tmpPath!)
    const hash = digestSHA256(buffer)

    // Duplicado por hash
    const dup = await FacturacionTicket.findBy('hash', hash)
    if (dup) {
      return response.conflict({
        message: 'Este ticket ya fue cargado (hash duplicado)',
        id: dup.id,
      })
    }

    // Ruta de guardado
    const now = DateTime.now()
    const yyyy = String(now.year)
    const mm = String(now.month).padStart(2, '0')
    const outDir = path.join(UPLOAD_BASE_DIR, yyyy, mm)
    await fs.mkdir(outDir, { recursive: true })

    const filename = `${cuid()}.${file.extname}`
    const filePath = path.join(outDir, filename)
    await fs.copyFile(file.tmpPath!, filePath)

    // Datos opcionales
    const turnoId = toIntOrNull(request.input('turno_id'))
    const dateoId = toIntOrNull(request.input('dateo_id'))
    const sedeId = toIntOrNull(request.input('sede_id'))
    const servicioId = toIntOrNull(request.input('servicio_id'))
    const imageRotation = Number(request.input('image_rotation') || 0)

    // Base ticket
    const ticket = new FacturacionTicket()
    ticket.hash = hash
    ticket.filePath = filePath.replace(app.makePath(), '') // guarda relativo
    ticket.fileMime = file.type
    ticket.fileSize = buffer.length
    ticket.imageRotation = imageRotation
    ticket.estado = 'BORRADOR'
    ticket.createdById = auth.user?.id ?? null

    ticket.turnoId = turnoId
    ticket.dateoId = dateoId
    ticket.sedeId = sedeId
    ticket.servicioId = servicioId

    // Si viene dateo_id: autollenar algunos campos útiles
    if (dateoId) {
      const dateo = await CaptacionDateo.find(dateoId)
      if (dateo) {
        if (!ticket.placa && (dateo.placa || '').trim()) {
          ticket.placa = (dateo.placa || '').toUpperCase().replace(/\s+/g, '')
        }
        // agente comercial a quien se le acredita comisión (si tu flujo lo establece en el dateo)
        ticket.agenteId = dateo.agenteId ?? null
      }
    }

    await ticket.save()
    return response.created(ticket)
  }

  /**
   * POST /facturacion/tickets/:id/reocr
   * Reintenta OCR (usa image_rotation actual)
   */
  public async reocr({ params, response }: HttpContext) {
    const ticket = await FacturacionTicket.find(params.id)
    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

    // Hook a tu servicio real:
    // const res = await OcrService.run({ filePath: ticket.filePath, rotation: ticket.imageRotation })
    // Aquí simulo salida:
    const res = fakeOCR()
    ticket.ocrText = res.text
    ticket.ocrConfPlaca = res.confidence.placa
    ticket.ocrConfTotal = res.confidence.total
    ticket.ocrConfFecha = res.confidence.fecha
    ticket.ocrConfAgente = res.confidence.agente

    // Autorrelleno si vienen datos
    if (res.placa) ticket.placa = res.placa
    if (res.total) {
      ticket.total = res.total
      ticket.totalFactura = res.total // mantiene sincronía
    }
    if (res.fechaHora) ticket.fechaPago = DateTime.fromISO(res.fechaHora)

    // Estado: si venía en BORRADOR → OCR_LISTO
    if (ticket.estado === 'BORRADOR') ticket.estado = 'OCR_LISTO'

    await ticket.save()
    return ticket
  }

  /**
   * PATCH /facturacion/tickets/:id
   * Actualiza campos editables del formulario (placa, total, fecha_pago, sede_id, agente_id, prefijo, consecutivo, etc.)
   */
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

      // 🔹 campos nuevos del OCR/ticket
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
    ])

    if (up.placa !== undefined)
      ticket.placa = String(up.placa || '')
        .toUpperCase()
        .replace(/\s+/g, '')
    if (up.total !== undefined) ticket.total = toNumberOrZero(up.total)
    if (up.fecha_pago !== undefined)
      ticket.fechaPago = up.fecha_pago ? DateTime.fromISO(String(up.fecha_pago)) : null
    if (up.sede_id !== undefined) ticket.sedeId = toIntOrNull(up.sede_id)
    if (up.agente_id !== undefined) ticket.agenteId = toIntOrNull(up.agente_id)
    if (up.prefijo !== undefined) ticket.prefijo = nullIfEmpty(up.prefijo)
    if (up.consecutivo !== undefined) ticket.consecutivo = nullIfEmpty(up.consecutivo)
    if (up.forma_pago !== undefined) ticket.formaPago = nullIfEmpty(up.forma_pago)
    if (up.servicio_id !== undefined) ticket.servicioId = toIntOrNull(up.servicio_id)
    if (up.doc_tipo !== undefined) ticket.docTipo = nullIfEmpty(up.doc_tipo)
    if (up.doc_numero !== undefined) ticket.docNumero = nullIfEmpty(up.doc_numero)
    if (up.nombre !== undefined) ticket.nombre = nullIfEmpty(up.nombre)
    if (up.telefono !== undefined) ticket.telefono = nullIfEmpty(up.telefono)
    if (up.observaciones !== undefined) ticket.observaciones = nullIfEmpty(up.observaciones)
    if (up.ocr_conf_baja_revisado !== undefined)
      ticket.ocrConfBajaRevisado = !!up.ocr_conf_baja_revisado
    if (up.image_rotation !== undefined) ticket.imageRotation = Number(up.image_rotation) || 0

    // 🔹 nuevos campos
    if (up.nit !== undefined) ticket.nit = nullIfEmpty(sanitizeNit(up.nit))
    if (up.pin !== undefined) ticket.pin = nullIfEmpty(String(up.pin))
    if (up.marca !== undefined) ticket.marca = nullIfEmpty(String(up.marca))
    if (up.vendedor_text !== undefined) ticket.vendedorText = nullIfEmpty(String(up.vendedor_text))
    // alias conveniente por si frontend manda "vendedor"
    const vendedorAlias = request.input('vendedor')
    if (vendedorAlias !== undefined && vendedorAlias !== null) {
      ticket.vendedorText = nullIfEmpty(String(vendedorAlias))
    }

    if (up.subtotal !== undefined) ticket.subtotal = toNumberOrZero(up.subtotal)
    if (up.iva !== undefined) ticket.iva = toNumberOrZero(up.iva)
    if (up.total_factura !== undefined) ticket.totalFactura = toNumberOrZero(up.total_factura)

    if (up.pago_consignacion !== undefined) ticket.pagoConsignacion = toNumberOrZero(up.pago_consignacion)
    if (up.pago_tarjeta !== undefined) ticket.pagoTarjeta = toNumberOrZero(up.pago_tarjeta)
    if (up.pago_efectivo !== undefined) ticket.pagoEfectivo = toNumberOrZero(up.pago_efectivo)
    if (up.pago_cambio !== undefined) ticket.pagoCambio = toNumberOrZero(up.pago_cambio)

    // Si llegó total_factura y no hay total, sincroniza
    if (
      (ticket.total === null || ticket.total === 0) &&
      ticket.totalFactura &&
      ticket.totalFactura > 0
    ) {
      ticket.total = ticket.totalFactura
    }
    // Si llegó total y no hay total_factura, sincroniza
    if (
      (ticket.totalFactura === null || ticket.totalFactura === 0) &&
      ticket.total &&
      ticket.total > 0
    ) {
      ticket.totalFactura = ticket.total
    }

    // Si los obligatorios ya están OK → pasa a LISTA_CONFIRMAR
    if (
      canConfirm(ticket, false) &&
      (ticket.estado === 'BORRADOR' || ticket.estado === 'OCR_LISTO')
    ) {
      ticket.estado = 'LISTA_CONFIRMAR'
    }

    await ticket.save()
    return ticket
  }

  /**
   * POST /facturacion/tickets/:id/confirmar
   * Revalida duplicado por contenido y confirma.
   * Integra comisión ligada al dateo (hook service).
   */
  public async confirmar({ params, request, response }: HttpContext) {
    const forzar = !!request.input('forzar') // permite confirmar pese a posibleDuplicado
    const ticket = await FacturacionTicket.find(params.id)
    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

    // Validación obligatorios
    if (!canConfirm(ticket, true)) {
      return response.badRequest({ message: 'Faltan campos obligatorios para confirmar' })
    }

    // Check duplicado por contenido
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

    // Confirmar
    ticket.estado = 'CONFIRMADA'
    ticket.confirmadoAt = DateTime.now()
    await ticket.save()

    // 🔗 Hook de comisión
    try {
      await this.applyCommissionHook(ticket)
    } catch (err) {
      console.error('Commission hook failed:', err)
    }

    return ticket
  }

  // ========================== Privados / Helpers ==========================

  private async applyCommissionHook(ticket: FacturacionTicket) {
    // Si no hay dateo_id, intenta inferirlo desde el turno
    if (!ticket.dateoId && ticket.turnoId) {
      const turno = await TurnoRtm.find(ticket.turnoId)
      if (turno && (turno as any).dateoId) {
        ticket.dateoId = (turno as any).dateoId
        await ticket.save()
      }
    }
    // Aquí conectar con tu servicio real de comisiones si aplica.
  }
}

/* ============================== Utils ============================== */

function digestSHA256(buffer: Buffer) {
  const h = crypto.createHash('sha256')
  h.update(buffer)
  return h.digest('hex')
}

function toIntOrNull(v: any): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function toNumberOrZero(v: any): number {
  const n = Number(String(v).replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function nullIfEmpty(v: any) {
  if (v === null || v === undefined) return null
  const s = String(v).trim()
  return s.length ? s : null
}

function sanitizeNit(v: string) {
  return String(v).replace(/[^\d\-\.]/g, '')
}

function placaValida(placa?: string | null): boolean {
  if (!placa) return false
  const rex = /^(?:[A-Z]{3}\d{3}|[A-Z]{3}\d{2}[A-Z])$/ // ABC123 o ABC12D
  return rex.test(placa.toUpperCase())
}

function canConfirm(t: FacturacionTicket, hard: boolean): boolean {
  // Usa total o totalFactura (sincronizados por hook, pero por si acaso)
  const totalNum = (t.total && t.total > 0) ? t.total : (t.totalFactura || 0)

  const base =
    placaValida(t.placa) &&
    !!totalNum &&
    totalNum > 0 &&
    !!t.fechaPago &&
    (!!t.sedeId || !!t.agenteId)

  if (!hard) return base
  return base
}

async function isContentDuplicate(t: FacturacionTicket): Promise<boolean> {
  const totalNum = (t.total && t.total > 0) ? t.total : (t.totalFactura || 0)
  if (!t.placa || !totalNum || !t.fechaPago) return false
  const min = t.fechaPago.minus({ minutes: DUP_WINDOW_MINUTES }).toSQL()
  const max = t.fechaPago.plus({ minutes: DUP_WINDOW_MINUTES }).toSQL()

  const row = await FacturacionTicket.query()
    .whereNot('id', t.id || 0)
    .where('placa', t.placa)
    .where('total', totalNum) // se indexa por "total" (compat)
    .whereBetween('fecha_pago', [min!, max!])
    .count('* as total')
    .first()

  const n = Number(row?.$extras.total || 0)
  return n > 0
}

/* ======================== OCR Fake (ejemplo) ======================== */
function fakeOCR() {
  // Simula salida del OCR. Reemplaza por tu servicio real.
  const placas = ['ABC123', 'QQX91C', 'FDS456']
  const placa = placas[Math.floor(Math.random() * placas.length)]
  const totals = [90000, 120000, 150000]
  const total = totals[Math.floor(Math.random() * totals.length)]
  const fechaHora = DateTime.now().minus({ minutes: 5 }).toISO()

  return {
    text: `TICKET\nTOTAL: ${total}\nPLACA: ${placa}\nFECHA: ${fechaHora}`,
    confidence: { placa: 0.86, total: 0.92, fecha: 0.78, agente: 0.55 },
    placa,
    total,
    fechaHora,
  }
}

/* ======= Helper de serialización del turno ======= */
function serializeTurnoEnriquecido(turno: TurnoRtm) {
  // @ts-ignore – usamos $preloaded de Lucid
  const s = turno.$preloaded || {}

  const servicio = s.servicio
    ? { id: s.servicio.id, codigoServicio: s.servicio.codigo, nombreServicio: s.servicio.nombre }
    : null

  const usuario = s.usuario
    ? { id: s.usuario.id, nombres: s.usuario.nombres, apellidos: s.usuario.apellidos }
    : null

  const sede = s.sede ? { id: s.sede.id, nombre: s.sede.nombre } : null

  const agenteCaptacion = s.agenteCaptacion
    ? { id: s.agenteCaptacion.id, nombre: s.agenteCaptacion.nombre, tipo: s.agenteCaptacion.tipo }
    : null

  const dateo = s.captacionDateo || null
  const asesorConvenio = dateo?.asesorConvenio
    ? { id: dateo.asesorConvenio.id, nombre: dateo.asesorConvenio.nombre, tipo: dateo.asesorConvenio.tipo }
    : null

  const convenio = dateo?.convenio
    ? { id: dateo.convenio.id, codigo: dateo.convenio.codigo, nombre: dateo.convenio.nombre }
    : null

  return {
    id: turno.id,
    turnoNumero: turno.turnoNumero,
    turnoNumeroServicio: turno.turnoNumeroServicio,
    turnoCodigo: turno.turnoCodigo,
    placa: turno.placa,
    estado: turno.estado,
    fecha: (turno as any).fecha?.toISODate?.() || (turno as any).fecha,
    horaIngreso: turno.horaIngreso,
    horaSalida: turno.horaSalida,
    tiempoServicio: turno.tiempoServicio,
    tipoVehiculo: (turno as any).tipoVehiculo,
    medioEntero: (turno as any).medioEntero,
    canalAtribucion: (turno as any).canalAtribucion,

    servicio,
    usuario,
    sede,

    // 👇 Lo que necesita tu tarjeta de “Captación / Dateo”
    agenteCaptacion, // → Asesor comercial
    asesorConvenio, // → Asesor convenio
    convenio, // → Convenio
  }
}
