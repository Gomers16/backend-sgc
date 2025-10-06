// app/Controllers/Http/captacion_dateos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import CaptacionDateo, { Canal, Origen } from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'

const CANALES: Canal[] = ['FACHADA', 'ASESOR', 'TELE', 'REDES']
const ORIGENES: Origen[] = ['UI', 'WHATSAPP', 'IMPORT']
const RESULTADOS = ['PENDIENTE', 'EXITOSO', 'NO_EXITOSO'] as const
type Resultado = typeof RESULTADOS[number]

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
  const consumed = d.consumidoAt
  const now = new Date()

  let vigente = false
  let bloqueaHasta: Date | null = null
  let titular: string | undefined

  if (d.consumidoTurnoId && consumed) {
    const hasta = new Date(consumed.toJSDate().getTime())
    hasta.setDate(hasta.getDate() + ttlPostConsumo())
    vigente = now < hasta
    bloqueaHasta = hasta
  } else {
    const created = d.createdAt
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
   * Query:
   *  page, perPage, placa, telefono, canal, agente_id|agenteId, resultado, consumido, desde, hasta
   *  sortBy (id|placa|telefono|created_at|resultado|consumido_turno_id), order (asc|desc)
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 20)), 100)

    const placa = normalizePlaca(request.input('placa'))
    const telefono = normalizePhone(request.input('telefono'))
    const canal = request.input('canal') as Canal | undefined
    const agenteId =
      request.input('agente_id') ? Number(request.input('agente_id')) :
      request.input('agenteId') ? Number(request.input('agenteId')) : undefined
    const resultado = request.input('resultado') as Resultado | undefined
    const consumido = request.input('consumido') as 'true' | 'false' | undefined
    const desde = request.input('desde') as string | undefined // YYYY-MM-DD
    const hasta = request.input('hasta') as string | undefined // YYYY-MM-DD
    const sortBy = String(request.input('sortBy', 'id'))
    const order = String(request.input('order', 'desc')).toLowerCase() === 'asc' ? 'asc' : 'desc'

    const SORT_WHITELIST: Record<string, string> = {
      id: 'id',
      placa: 'placa',
      telefono: 'telefono',
      created_at: 'created_at',
      resultado: 'resultado',
      consumido_turno_id: 'consumido_turno_id',
    }
    const sortCol = SORT_WHITELIST[sortBy] || 'created_at'

    const q = CaptacionDateo.query().preload('agente')

    if (placa) q.andWhere('placa', placa)
    if (telefono) q.andWhere('telefono', telefono)
    if (canal && CANALES.includes(canal)) q.andWhere('canal', canal)
    if (agenteId) q.andWhere('agente_id', agenteId)
    if (resultado && (RESULTADOS as readonly string[]).includes(resultado)) q.andWhere('resultado', resultado)
    if (consumido === 'true') q.andWhereNotNull('consumido_turno_id')
    if (consumido === 'false') q.andWhereNull('consumido_turno_id')
    if (desde) q.andWhere('created_at', '>=', `${desde} 00:00:00`)
    if (hasta) q.andWhere('created_at', '<=', `${hasta} 23:59:59`)

    q.orderBy(sortCol, order as 'asc' | 'desc')

    const result = await q.paginate(page, perPage)
    const serialized = result.serialize()

    // normalizamos para el front
    return {
      data: serialized.data,
      total: result.total,
      page: result.currentPage,
      perPage: result.perPage,
    }
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
   * body: { canal, agente_id?, placa?, telefono?, origen, observacion?, imagen_*? }
   */
  public async store({ request, response }: HttpContext) {
    const canal = request.input('canal') as Canal
    const agenteId = request.input('agente_id') ? Number(request.input('agete_id')) : Number(request.input('agente_id')) || null
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
      // por si tu migración no trae default:
      resultado: 'PENDIENTE',
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
   * Permite actualizar: observacion, imagen_*, consumido_turno_id y resultado
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

    const resultado = request.input('resultado') as Resultado | undefined
    if (resultado !== undefined) {
      if (!(RESULTADOS as readonly string[]).includes(resultado)) {
        return response.badRequest({
          message: 'resultado inválido (PENDIENTE | EXITOSO | NO_EXITOSO)',
        })
      }
      item.resultado = resultado
    }

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

  /** DELETE /captacion-dateos/:id */
  public async destroy({ params, response }: HttpContext) {
    const item = await CaptacionDateo.find(params.id)
    if (!item) return response.notFound({ message: 'Dateo no encontrado' })
    await item.delete()
    return response.noContent()
  }
}
