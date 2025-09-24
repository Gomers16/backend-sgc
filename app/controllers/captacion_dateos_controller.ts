// app/Controllers/Http/captacion_dateos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import CaptacionDateo, { Canal, Origen } from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'

const CANALES: Canal[] = ['FACHADA', 'ASESOR', 'TELE', 'REDES']
const ORIGENES: Origen[] = ['UI', 'WHATSAPP', 'IMPORT']

function normalizePlaca(v?: string) {
  return v ? v.replace(/[\s-]/g, '').toUpperCase() : v
}
function normalizePhone(v?: string) {
  return v ? v.replace(/\D/g, '') : v
}

function ttlSinConsumir(): number {
  return Number(process.env.TTL_SIN_CONSUMIR_DIAS ?? 7)
}
function ttlPostConsumo(): number {
  return Number(process.env.TTL_POST_CONSUMO_DIAS ?? 365)
}

/** Calcula si un dateo está vigente (reserva activa) según TTL y consumo */
function buildReserva(d: CaptacionDateo) {
  const created = d.createdAt
  const consumed = d.consumidoAt
  const now = new Date()

  let vigente = false
  let bloqueaHasta: Date | null = null
  let titular: string | undefined

  if (d.consumidoTurnoId && consumed) {
    // Reserva larga tras consumo
    const hasta = new Date(consumed.toJSDate().getTime())
    hasta.setDate(hasta.getDate() + ttlPostConsumo())
    vigente = now < hasta
    bloqueaHasta = hasta
  } else {
    // Reserva corta sin consumo
    const hasta = new Date(created.toJSDate().getTime())
    hasta.setDate(hasta.getDate() + ttlSinConsumir())
    vigente = now < hasta
    bloqueaHasta = hasta
  }

  return {
    vigente,
    bloqueaHasta: bloqueaHasta ? bloqueaHasta.toISOString() : null,
    titular,
  }
}

export default class CaptacionDateosController {
  /**
   * GET /captacion-dateos
   * Filtros:
   *  - placa, telefono, canal, agente_id
   *  - vigente=true|false (calcula por TTL)
   *  - consumido=true|false
   *  - page, perPage
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 20)), 100)

    const placa = normalizePlaca(request.input('placa'))
    const telefono = normalizePhone(request.input('telefono'))
    const canal = request.input('canal') as Canal | undefined
    const agenteId = request.input('agente_id') ? Number(request.input('agente_id')) : undefined
    const vigente = request.input('vigente') // 'true' | 'false' | undefined
    const consumido = request.input('consumido') // 'true' | 'false' | undefined

    const query = CaptacionDateo.query().preload('agente').orderBy('created_at', 'desc')

    if (placa) query.andWhere('placa', placa)
    if (telefono) query.andWhere('telefono', telefono)
    if (canal && CANALES.includes(canal)) query.andWhere('canal', canal)
    if (agenteId) query.andWhere('agente_id', agenteId)

    // Filtro por consumido (simple)
    if (consumido === 'true') query.andWhereNotNull('consumido_turno_id')
    if (consumido === 'false') query.andWhereNull('consumido_turno_id')

    const result = await query.paginate(page, perPage)

    // Enriquecer con 'reserva' (vigencia) si se solicitó 'vigente'
    const serialized = result.serialize()
    if (vigente === undefined) return serialized

    const want = String(vigente).toLowerCase() === 'true'
    serialized.data = serialized.data.filter((row) => {
      const d = new CaptacionDateo()
      Object.assign(d, {
        id: row.id,
        canal: row.canal,
        agenteId: row.agente_id ?? row.agenteId,
        placa: row.placa,
        telefono: row.telefono,
        origen: row.origen,
        createdAt: row.created_at
          ? typeof row.created_at === 'string'
            ? row.created_at
            : row.created_at
          : undefined,
        consumidoTurnoId: row.consumido_turno_id ?? row.consumidoTurnoId,
        consumidoAt: row.consumido_at
          ? typeof row.consumido_at === 'string'
            ? row.consumido_at
            : row.consumido_at
          : undefined,
      })
      // Reconstruir DateTime de Luxon desde ISO si es string
      // (Si tu app ya devuelve DateTime correctamente, esto no hace falta)
      if (typeof d.createdAt === 'string') d.createdAt = (d as any).$createDateTime(d.createdAt)
      if (typeof d.consumidoAt === 'string')
        d.consumidoAt = (d as any).$createDateTime(d.consumidoAt)

      const r = buildReserva(d)
      return r.vigente === want
    })

    return serialized
  }

  /** GET /captacion-dateos/:id */
  public async show({ params, response }: HttpContext) {
    const item = await CaptacionDateo.query().where('id', params.id).preload('agente').first()
    if (!item) return response.notFound({ message: 'Dateo no encontrado' })

    const reserva = buildReserva(item)
    return { ...item.serialize(), reserva }
  }

  /**
   * POST /captacion-dateos
   * body: { canal, agente_id?, placa?, telefono?, origen, observacion?, imagen_url? ... }
   * Reglas:
   *  - canal requerido y válido
   *  - si canal = ASESOR o TELE -> agente_id requerido
   *  - al menos UNO: placa o telefono
   */
  public async store({ request, response }: HttpContext) {
    const canal = request.input('canal') as Canal
    const agenteId = request.input('agente_id') ? Number(request.input('agente_id')) : null
    const placa = normalizePlaca(request.input('placa'))
    const telefono = normalizePhone(request.input('telefono'))
    const origen = request.input('origen') as Origen
    const observacion = request.input('observacion') ?? null

    const imagen_url = request.input('imagen_url') ?? null
    const imagen_mime = request.input('imagen_mime') ?? null
    const imagen_tamano_bytes = request.input('imagen_tamano_bytes') ?? null
    const imagen_hash = request.input('imagen_hash') ?? null
    const imagen_origen_id = request.input('imagen_origen_id') ?? null
    const imagen_subida_por = request.input('imagen_subida_por') ?? null

    if (!canal || !CANALES.includes(canal)) {
      return response.badRequest({ message: 'canal inválido (FACHADA | ASESOR | TELE | REDES)' })
    }
    if (!origen || !ORIGENES.includes(origen)) {
      return response.badRequest({ message: 'origen inválido (UI | WHATSAPP | IMPORT)' })
    }
    if (!placa && !telefono) {
      return response.badRequest({ message: 'Se requiere placa o telefono' })
    }
    if ((canal === 'ASESOR' || canal === 'TELE') && !agenteId) {
      return response.badRequest({ message: 'agente_id es requerido para canal ASESOR/TELE' })
    }
    if (agenteId) {
      const ag = await AgenteCaptacion.find(agenteId)
      if (!ag) return response.badRequest({ message: 'agente_id no existe' })
    }

    const created = await CaptacionDateo.create({
      canal,
      agenteId,
      placa: placa ?? null,
      telefono: telefono ?? null,
      origen,
      observacion,
      imagenUrl: imagen_url,
      imagenMime: imagen_mime,
      imagenTamanoBytes: imagen_tamano_bytes ? Number(imagen_tamano_bytes) : null,
      imagenHash: imagen_hash,
      imagenOrigenId: imagen_origen_id,
      imagenSubidaPor: imagen_subida_por ? Number(imagen_subida_por) : null,
    })

    return response.created(created)
  }

  /**
   * PUT /captacion-dateos/:id
   * Permite actualizar observacion, imagen_* y (opcional) marcar consumo: consumido_turno_id
   */
  public async update({ params, request, response }: HttpContext) {
    const item = await CaptacionDateo.find(params.id)
    if (!item) return response.notFound({ message: 'Dateo no encontrado' })

    const observacion = request.input('observacion')
    const imagen_url = request.input('imagen_url')
    const imagen_mime = request.input('imagen_mime')
    const imagen_tamano_bytes = request.input('imagen_tamano_bytes')
    const imagen_hash = request.input('imagen_hash')
    const imagen_origen_id = request.input('imagen_origen_id')
    const imagen_subida_por = request.input('imagen_subida_por')

    const consumido_turno_id = request.input('consumido_turno_id')

    if (observacion !== undefined) item.observacion = observacion ?? null
    if (imagen_url !== undefined) item.imagenUrl = imagen_url ?? null
    if (imagen_mime !== undefined) item.imagenMime = imagen_mime ?? null
    if (imagen_tamano_bytes !== undefined) item.imagenTamanoBytes = imagen_tamano_bytes ? Number(imagen_tamano_bytes) : null
    if (imagen_hash !== undefined) item.imagenHash = imagen_hash ?? null
    if (imagen_origen_id !== undefined) item.imagenOrigenId = imagen_origen_id ?? null
    if (imagen_subida_por !== undefined) item.imagenSubidaPor = imagen_subida_por ? Number(imagen_subida_por) : null

    if (consumido_turno_id !== undefined) {
      if (consumido_turno_id === null || consumido_turno_id === '') {
        item.consumidoTurnoId = null
        item.consumidoAt = null
      } else {
        item.consumidoTurnoId = Number(consumido_turno_id)
        item.consumidoAt = (item as any).$createDateTime(new Date().toISOString())
      }
    }

    await item.save()
    const reserva = buildReserva(item)
    return { ...item.serialize(), reserva }
  }

  /** DELETE /captacion-dateos/:id (permitido; es histórico, pero por si hay errores de carga) */
  public async destroy({ params, response }: HttpContext) {
    const item = await CaptacionDateo.find(params.id)
    if (!item) return response.notFound({ message: 'Dateo no encontrado' })
    await item.delete()
    return response.noContent()
  }
}
