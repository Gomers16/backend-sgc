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
import Servicio from '#models/servicio'

/** Carpeta para subir tickets (local). */
const UPLOAD_BASE_DIR = app.makePath('uploads/tickets')

/** Ventana para considerar duplicado por contenido. */
const DUP_WINDOW_MINUTES = 60

export default class FacturacionTicketsController {
  /**
   * GET /facturacion/tickets
   */
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
   * Devuelve DTO enriquecido.
   */
  public async show({ params, response }: HttpContext) {
    const ticket = await FacturacionTicket.query()
      .where('id', params.id)
      .preload('agente')
      .preload('sede')
      .preload('servicio')
      .preload('dateo', (q) => q.preload('agente').preload('asesorConvenio').preload('convenio'))
      .preload('turno', (q) => {
        q
          .preload('servicio')
          .preload('usuario')
          .preload('sede')
          .preload('agenteCaptacion')
          .preload('captacionDateo', (cq) =>
            cq.preload('agente').preload('asesorConvenio').preload('convenio')
          )
      })
      .first()

    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

    return buildTicketDTO(ticket)
  }

  /**
   * GET /facturacion/tickets/hash-exists/:hash
   */
  public async hashExists({ params }: HttpContext) {
    const dup = await FacturacionTicket.findBy('hash', params.hash)
    return { exists: !!dup }
  }

  /**
   * GET /facturacion/tickets/duplicados
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
   * Sube archivo + metadatos (turno_id, dateo_id, sede_id, servicio_id).
   * Intenta completar placa/agente/sede/servicio desde dateo/turno y
   * guarda snapshots si ya tenemos el turno.
   */
  public async store({ request, auth, response }: HttpContext) {
    const file = request.file('archivo', { size: '8mb', extnames: ['jpg', 'jpeg', 'png'] })
    if (!file) return response.badRequest({ message: 'archivo (image/*) requerido' })
    if (!file.isValid) return response.badRequest({ message: file.errors })

    // Buffer + hash
    const buffer = await fs.readFile(file.tmpPath!)
    const hash = digestSHA256(buffer)

    // Duplicado por hash
    const dup = await FacturacionTicket.findBy('hash', hash)
    if (dup) {
      return response.conflict({ message: 'Este ticket ya fue cargado (hash duplicado)', id: dup.id })
    }

    // Guardar archivo
    const now = DateTime.now()
    const yyyy = String(now.year)
    const mm = String(now.month).padStart(2, '0')
    const outDir = path.join(UPLOAD_BASE_DIR, yyyy, mm)
    await fs.mkdir(outDir, { recursive: true })

    const filename = `${cuid()}.${file.extname}`
    const filePath = path.join(outDir, filename)
    await fs.copyFile(file.tmpPath!, filePath)

    // Metadatos
    const turnoId = toIntOrNull(request.input('turno_id'))
    const dateoId = toIntOrNull(request.input('dateo_id'))
    const sedeId = toIntOrNull(request.input('sede_id'))
    const servicioId = toIntOrNull(request.input('servicio_id'))
    const imageRotation = Number(request.input('image_rotation') || 0)

    // Base
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

    // Completar desde dateo o turno
    if (dateoId) {
      const dateo = await CaptacionDateo.find(dateoId)
      if (dateo) {
        if (!ticket.placa && (dateo.placa || '').trim()) {
          ticket.placa = (dateo.placa || '').toUpperCase().replace(/\s+/g, '')
        }
        ticket.agenteId = dateo.agenteId ?? ticket.agenteId ?? null
      }
    }

    let turno: TurnoRtm | null = null
    if (turnoId) turno = await TurnoRtm.query().where('id', turnoId).preload('servicio').first()

    if (turno) {
      // completar placa/sede/agente/servicio si faltan
      if (!ticket.placa && (turno.placa || '').trim()) {
        ticket.placa = (turno.placa || '').toUpperCase().replace(/\s+/g, '')
      }
      // @ts-ignore
      ticket.sedeId = ticket.sedeId || (turno as any).sedeId || null
      // @ts-ignore
      ticket.agenteId = ticket.agenteId || (turno as any).agenteCaptacionId || null
      // @ts-ignore
      ticket.servicioId = ticket.servicioId || (turno as any).servicioId || null

      // 🧾 Snapshots directos del turno
      await this.fillSnapshotsFromTurno(ticket, turno)
    } else if (ticket.servicioId) {
      // snapshot de servicio si vino directo
      const s = await Servicio.find(ticket.servicioId)
      if (s) {
        // @ts-ignore
        ticket.servicioCodigo = (s as any).codigo ?? null
        // @ts-ignore
        ticket.servicioNombre = (s as any).nombre ?? null
      }
    }

    await ticket.save()
    return response.created(ticket)
  }

  /**
   * POST /facturacion/tickets/:id/reocr
   */
  public async reocr({ params, response }: HttpContext) {
    const ticket = await FacturacionTicket.find(params.id)
    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

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

  /**
   * PATCH /facturacion/tickets/:id
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

      // OCR / totales explícitos
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
      ticket.placa = String(up.placa || '').toUpperCase().replace(/\s+/g, '')
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

    // Nuevos del OCR
    if (up.nit !== undefined) ticket.nit = nullIfEmpty(sanitizeNit(up.nit))
    if (up.pin !== undefined) ticket.pin = nullIfEmpty(String(up.pin))
    if (up.marca !== undefined) ticket.marca = nullIfEmpty(String(up.marca))
    if (up.vendedor_text !== undefined) ticket.vendedorText = nullIfEmpty(String(up.vendedor_text))
    const vendedorAlias = request.input('vendedor')
    if (vendedorAlias !== undefined && vendedorAlias !== null) {
      ticket.vendedorText = nullIfEmpty(String(vendedorAlias))
    }

    if (up.subtotal !== undefined) ticket.subtotal = toNumberOrZero(up.subtotal)
    if (up.iva !== undefined) ticket.iva = toNumberOrZero(up.iva)
    if (up.total_factura !== undefined) ticket.totalFactura = toNumberOrZero(up.total_factura)

    if (up.pago_consignacion !== undefined)
      ticket.pagoConsignacion = toNumberOrZero(up.pago_consignacion)
    if (up.pago_tarjeta !== undefined) ticket.pagoTarjeta = toNumberOrZero(up.pago_tarjeta)
    if (up.pago_efectivo !== undefined) ticket.pagoEfectivo = toNumberOrZero(up.pago_efectivo)
    if (up.pago_cambio !== undefined) ticket.pagoCambio = toNumberOrZero(up.pago_cambio)

    // Sincronía total vs total_factura
    if ((!ticket.total || ticket.total === 0) && ticket.totalFactura && ticket.totalFactura > 0) {
      ticket.total = ticket.totalFactura
    }
    if ((!ticket.totalFactura || ticket.totalFactura === 0) && ticket.total && ticket.total > 0) {
      ticket.totalFactura = ticket.total
    }

    // Si ya cumple para confirmar, súbelo a LISTA_CONFIRMAR
    if (
      canConfirm(ticket, false) &&
      (ticket.estado === 'BORRADOR' || ticket.estado === 'OCR_LISTO')
    ) {
      ticket.estado = 'LISTA_CONFIRMAR'
    }

    // Si cambiaron servicio_id manualmente, refresca snapshots de servicio
    if (up.servicio_id !== undefined && ticket.servicioId) {
      const s = await Servicio.find(ticket.servicioId)
      if (s) {
        // @ts-ignore
        ticket.servicioCodigo = (s as any).codigo ?? null
        // @ts-ignore
        ticket.servicioNombre = (s as any).nombre ?? null
      }
    }

    await ticket.save()
    return ticket
  }

  /**
   * POST /facturacion/tickets/:id/confirmar
   * Confirma y persiste snapshots del turno/servicio en la fila.
   */
  public async confirmar({ params, request, response, auth }: HttpContext) {
    const forzar = !!request.input('forzar')
    const ticket = await FacturacionTicket.find(params.id)
    if (!ticket) return response.notFound({ message: 'Ticket no encontrado' })

    // Validación obligatorios
    if (!canConfirm(ticket, true)) {
      return response.badRequest({ message: 'Faltan campos obligatorios para confirmar' })
    }

    // Duplicado por contenido
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
    // @ts-ignore
    ticket.confirmedById = auth.user?.id ?? null

    // Fallbacks desde dateo/turno
    if (!ticket.agenteId && ticket.dateoId) {
      const d = await CaptacionDateo.find(ticket.dateoId)
      if (d?.agenteId) ticket.agenteId = d.agenteId
    }
    if (!ticket.sedeId && ticket.turnoId) {
      const t = await TurnoRtm.find(ticket.turnoId)
      // @ts-ignore
      if (t?.sedeId) ticket.sedeId = (t as any).sedeId
    }
    if (!ticket.servicioId && ticket.turnoId) {
      const t = await TurnoRtm.find(ticket.turnoId)
      // @ts-ignore
      if (t?.servicioId) ticket.servicioId = (t as any).servicioId
    }

    // 🔗 Snapshots desde el turno (si existe)
    let turno: TurnoRtm | null = null
    if (ticket.turnoId) {
      turno = await TurnoRtm.query()
        .where('id', ticket.turnoId)
        .preload('servicio')
        .first()
      if (turno) await this.fillSnapshotsFromTurno(ticket, turno)
    }

    // Si no hay turno pero sí servicio, llena servicio_* igualmente
    if (!turno && ticket.servicioId) {
      const s = await Servicio.find(ticket.servicioId)
      if (s) {
        // @ts-ignore
        ticket.servicioCodigo = (s as any).codigo ?? null
        // @ts-ignore
        ticket.servicioNombre = (s as any).nombre ?? null
      }
    }

    await ticket.save()

    // Hook de comisiones (no bloqueante)
    try {
      await this.applyCommissionHook(ticket)
    } catch (err) {
      console.error('Commission hook failed:', err)
    }

    // DTO enriquecido
    const dto = await this.getTicketDTOById(ticket.id)
    return dto
  }

  // ========================== Privados / Helpers ==========================

  /** Rellena columnas snapshot del ticket a partir del Turno. */
  private async fillSnapshotsFromTurno(ticket: FacturacionTicket, turno: TurnoRtm) {
    // Numeraciones
    // @ts-ignore
    ticket.turnoGlobal = (turno as any).turnoNumero ?? null
    // @ts-ignore
    ticket.turnoServicio = (turno as any).turnoNumeroServicio ?? null
    // @ts-ignore
    ticket.turnoCodigo = (turno as any).turnoCodigo ?? null

    // Tipo vehiculo y canal/medio
    // @ts-ignore
    ticket.tipoVehiculo = (turno as any).tipoVehiculo ?? ticket.tipoVehiculo ?? null
    // @ts-ignore
    ticket.canalAtribucion = (turno as any).canalAtribucion ?? ticket.canalAtribucion ?? null
    // @ts-ignore
    ticket.medioEntero = (turno as any).medioEntero ?? ticket.medioEntero ?? null

    // Servicio (si vino preloaded, mejor)
    let s = (turno as any).$preloaded?.servicio || null
    if (!s && (turno as any).servicioId) {
      s = await Servicio.find((turno as any).servicioId)
    }
    if (s) {
      ticket.servicioId = ticket.servicioId || s.id
      // @ts-ignore
      ticket.servicioCodigo = (s as any).codigo ?? null
      // @ts-ignore
      ticket.servicioNombre = (s as any).nombre ?? null
    }
  }

  private async applyCommissionHook(ticket: FacturacionTicket) {
    // Si no hay dateo_id, intenta inferirlo desde el turno
    if (!ticket.dateoId && ticket.turnoId) {
      const turno = await TurnoRtm.find(ticket.turnoId)
      if (turno && (turno as any).dateoId) {
        ticket.dateoId = (turno as any).dateoId
        await ticket.save()
      }
    }
    // Aquí conectar tu servicio real de comisiones.
  }

  private async getTicketDTOById(id: number) {
    const t = await FacturacionTicket.query()
      .where('id', id)
      .preload('servicio')
      .preload('sede')
      .preload('agente')
      .preload('turno', (q) =>
        q.preload('servicio').preload('usuario').preload('sede').preload('agenteCaptacion')
      )
      .firstOrFail()

    return buildTicketDTO(t)
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
    .first()

  const n = Number(row?.$extras.total || 0)
  return n > 0
}

/* =================== DTO / Serializadores =================== */
function buildTicketDTO(ticket: FacturacionTicket) {
  const base = ticket.serialize()
  const pre = (ticket as any).$preloaded || {}

  const turno = pre.turno ? serializeTurnoEnriquecido(pre.turno as TurnoRtm) : null
  const dateoFromTurno = (pre.turno as any)?.captacionDateo ?? null
  const dateoEnriquecido =
    base.dateo ||
    (dateoFromTurno
      ? {
          id: dateoFromTurno.id,
          canal: dateoFromTurno.canal,
          agente: dateoFromTurno.agente
            ? {
                id: dateoFromTurno.agente.id,
                nombre: dateoFromTurno.agente.nombre,
                tipo: dateoFromTurno.agente.tipo,
              }
            : null,
          asesorConvenio: dateoFromTurno.asesorConvenio
            ? {
                id: dateoFromTurno.asesorConvenio.id,
                nombre: dateoFromTurno.asesorConvenio.nombre,
                tipo: dateoFromTurno.asesorConvenio.tipo,
              }
            : null,
          convenio: dateoFromTurno.convenio
            ? {
                id: dateoFromTurno.convenio.id,
                codigo: dateoFromTurno.convenio.codigo,
                nombre: dateoFromTurno.convenio.nombre,
              }
            : null,
        }
      : null)

  // Si existen snapshots, úsalos; si no, cae al turno.
  const servicioCodigo =
    (base as any).servicio_codigo ?? turno?.servicio?.codigoServicio ?? null
  const servicioNombre =
    (base as any).servicio_nombre ?? turno?.servicio?.nombreServicio ?? null
  const tipoVehiculoSnapshot =
    (base as any).tipo_vehiculo ?? turno?.tipoVehiculo ?? null
  const turnoGlobal = (base as any).turno_global ?? turno?.turnoNumero ?? null
  const turnoServicio = (base as any).turno_servicio ?? turno?.turnoNumeroServicio ?? null

  return {
    ...base,
    turno,
    dateo: dateoEnriquecido,

    turnoGlobal,
    turnoServicio,
    tipoVehiculoSnapshot,
    servicioCodigo,
    servicioNombre,
  }
}

function serializeTurnoEnriquecido(turno: TurnoRtm) {
  // @ts-ignore
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
    turnoNumero: (turno as any).turnoNumero,
    turnoNumeroServicio: (turno as any).turnoNumeroServicio,
    turnoCodigo: (turno as any).turnoCodigo,
    placa: (turno as any).placa,
    estado: (turno as any).estado,
    fecha: (turno as any).fecha?.toISODate?.() || (turno as any).fecha,
    horaIngreso: (turno as any).horaIngreso,
    horaSalida: (turno as any).horaSalida,
    tiempoServicio: (turno as any).tiempoServicio,
    tipoVehiculo: (turno as any).tipoVehiculo,
    medioEntero: (turno as any).medioEntero,
    canalAtribucion: (turno as any).canalAtribucion,

    servicio,
    usuario,
    sede,
    agenteCaptacion,
    asesorConvenio,
    convenio,
  }
}

/* ======================== OCR Fake (ejemplo) ======================== */
function fakeOCR() {
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
    fechaHora,
  }
}
