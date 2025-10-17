// app/controllers/captacion_dateos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import CaptacionDateo, { Canal, Origen } from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'
import Convenio from '#models/convenio' // ✅ NUEVO

/* ======================= Constantes / Tipos ======================= */
const CANALES_DB = ['FACHADA', 'ASESOR_COMERCIAL', 'ASESOR_CONVENIO', 'TELE', 'REDES'] as const
type CanalDb = (typeof CANALES_DB)[number]
const CANAL_ALIAS_ASESOR = ['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const

const ORIGENES = ['UI', 'WHATSAPP', 'IMPORT'] as const
type OrigenVal = (typeof ORIGENES)[number]

const RESULTADOS = ['PENDIENTE', 'EN_PROCESO', 'EXITOSO', 'NO_EXITOSO'] as const
type Resultado = (typeof RESULTADOS)[number]

function normalizePlaca(v?: string | null) {
  return v ? v.replace(/[\s-]/g, '').toUpperCase() : v ?? null
}
function normalizePhone(v?: string | null) {
  return v ? v.replace(/\D/g, '') : v ?? null
}
function ttlSinConsumir() { return Number(process.env.TTL_SIN_CONSUMIR_DIAS ?? 7) }
function ttlPostConsumo() { return Number(process.env.TTL_POST_CONSUMO_DIAS ?? 365) }

/** Reserva/ventana de exclusividad */
function buildReserva(d: CaptacionDateo) {
  const now = DateTime.now()
  const base = d.consumidoTurnoId && d.consumidoAt ? d.consumidoAt : d.createdAt
  const days = d.consumidoTurnoId && d.consumidoAt ? ttlPostConsumo() : ttlSinConsumir()
  const hasta = base.plus({ days })
  return { vigente: now < hasta, bloqueaHasta: hasta.toISO() }
}

/** Formato AM/PM Bogotá */
function fmtBogotaAmPm(iso?: string) {
  if (!iso) return ''
  return DateTime.fromISO(iso).setZone('America/Bogota').toFormat('dd/LL/yy hh:mm a')
}

/** Alias camelCase -> snake_case para el front */
function toSnake(row: any) {
  return {
    ...row,
    created_at: row.createdAt,
    created_at_fmt: fmtBogotaAmPm(row.createdAt),
    imagen_url: row.imagenUrl ?? null,
    imagen_mime: row.imagenMime ?? null,
    imagen_tamano_bytes: row.imagenTamanoBytes ?? null,
    imagen_hash: row.imagenHash ?? null,
    imagen_origen_id: row.imagenOrigenId ?? null,
    imagen_subida_por: row.imagenSubidaPor ?? null,
    consumido_turno_id: row.consumidoTurnoId ?? null,
    consumido_at: row.consumidoAt ?? null,
  }
}

/** Número opcional ('' → null) */
function readOptionalNumber(input: unknown): number | null {
  if (input === undefined || input === null) return null
  const s = String(input).trim()
  if (s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export default class CaptacionDateosController {
  /**
   * GET /captacion-dateos
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 20)), 100)

    const placa = normalizePlaca(request.input('placa') as string | undefined)
    const telefono = normalizePhone(request.input('telefono') as string | undefined)

    const canalReq = String(request.input('canal') || '').toUpperCase()
    const canalIsAsesor = canalReq === 'ASESOR'
    const canalDb: CanalDb | undefined = (CANALES_DB as readonly string[]).includes(canalReq)
      ? (canalReq as CanalDb)
      : undefined

    const agenteId = readOptionalNumber(
      (request.input('agente_id') ?? request.input('agenteId')) as unknown
    )
    const convenioId = readOptionalNumber( // ✅ filtro nuevo
      (request.input('convenio_id') ?? request.input('convenioId')) as unknown
    )

    const resultado = request.input('resultado') as Resultado | undefined
    const consumido = request.input('consumido') as 'true' | 'false' | undefined
    const desde = request.input('desde') as string | undefined
    const hasta = request.input('hasta') as string | undefined

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

    const q = CaptacionDateo.query()
      .preload('agente')
      .preload('convenio', (qb) => qb.select(['id', 'nombre'])) // ✅

    if (placa) q.andWhere('placa', placa)
    if (telefono) q.andWhere('telefono', telefono)

    if (canalIsAsesor) {
      q.whereIn('canal', CANAL_ALIAS_ASESOR as unknown as string[])
    } else if (canalDb) {
      q.andWhere('canal', canalDb)
    }

    if (agenteId !== null) q.andWhere('agente_id', agenteId)
    if (convenioId !== null) q.andWhere('convenio_id', convenioId) // ✅

    if (resultado && (RESULTADOS as readonly string[]).includes(resultado)) q.andWhere('resultado', resultado)
    if (consumido === 'true') q.andWhereNotNull('consumido_turno_id')
    if (consumido === 'false') q.andWhereNull('consumido_turno_id')
    if (desde) q.andWhere('created_at', '>=', `${desde} 00:00:00`)
    if (hasta) q.andWhere('created_at', '<=', `${hasta} 23:59:59`)

    q.orderBy(sortCol, order as 'asc' | 'desc')

    const result = await q.paginate(page, perPage)

    const data = result.serialize().data.map((row: any) => {
      const base = {
        ...row,
        canal: (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const).includes(row.canal) ? 'ASESOR' : row.canal,
      }
      return toSnake(base)
    })

    return { data, total: result.total, page: result.currentPage, perPage: result.perPage }
  }

  /** GET /captacion-dateos/:id */
  public async show({ params, response }: HttpContext) {
    const item = await CaptacionDateo.query()
      .where('id', params.id)
      .preload('agente')
      .preload('convenio', (qb) => qb.select(['id', 'nombre'])) // ✅
      .first()

    if (!item) return response.notFound({ message: 'Dateo no encontrado' })

    const out = item.serialize() as any
    out.canal = (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const).includes(out.canal) ? 'ASESOR' : out.canal

    const reserva = buildReserva(item)
    return { ...toSnake(out), reserva }
  }

  /**
   * POST /captacion-dateos
   * body: { canal, agente_id?, placa, telefono?, origen, observacion?, imagen_*?, convenio_id? }
   */
  public async store({ request, response }: HttpContext) {
    let canal = String(request.input('canal') || '').toUpperCase()
    if (canal === 'ASESOR') canal = 'ASESOR_COMERCIAL'
    if (!(CANALES_DB as readonly string[]).includes(canal)) {
      return response.badRequest({ message: 'canal inválido' })
    }

    const agenteId = readOptionalNumber(
      (request.input('agente_id') ?? request.input('agenteId')) as unknown
    )
    const convenioId = readOptionalNumber( // ✅ NUEVO
      (request.input('convenio_id') ?? request.input('convenioId')) as unknown
    )

    const placa = normalizePlaca(request.input('placa') as string | undefined)
    const telefono = normalizePhone(request.input('telefono') as string | undefined)
    const origen = request.input('origen') as OrigenVal
    const observacion = (request.input('observacion') as string | undefined) ?? null

    // Imagen (snake → camel)
    const imagenUrl = (request.input('imagen_url') as string | undefined) ?? null
    const imagenMime = (request.input('imagen_mime') as string | undefined) ?? null
    const imagenTamanoBytesRaw = request.input('imagen_tamano_bytes') as number | string | undefined
    const imagenTamanoBytes =
      imagenTamanoBytesRaw === undefined || imagenTamanoBytesRaw === null
        ? null
        : Number(imagenTamanoBytesRaw)
    const imagenHash = (request.input('imagen_hash') as string | undefined) ?? null
    const imagenOrigenId = (request.input('imagen_origen_id') as string | number | undefined) ?? null
    const imagenSubidaPor = readOptionalNumber(request.input('imagen_subida_por') as unknown)

    if (!ORIGENES.includes(origen)) {
      return response.badRequest({ message: 'origen inválido (UI | WHATSAPP | IMPORT)' })
    }
    if (!placa) {
      return response.badRequest({ message: 'La placa es obligatoria' })
    }
    if ((canal === 'ASESOR_COMERCIAL' || canal === 'ASESOR_CONVENIO' || canal === 'TELE') && agenteId === null) {
      return response.badRequest({ message: 'agente_id es requerido para canal ASESOR/TELE' })
    }
    if (agenteId !== null) {
      const ag = await AgenteCaptacion.find(agenteId)
      if (!ag) return response.badRequest({ message: 'agente_id no existe' })
    }

    // ✅ Regla de negocio: si canal es asesor, convenio es obligatorio
    const canalEsAsesor = canal === 'ASESOR_COMERCIAL' || canal === 'ASESOR_CONVENIO'
    if (canalEsAsesor && convenioId === null) {
      return response.badRequest({ message: 'convenio_id es requerido para canal ASESOR' })
    }
    if (convenioId !== null) {
      const conv = await Convenio.find(convenioId)
      if (!conv) return response.badRequest({ message: 'convenio_id no existe' })
      // (opcional: validar conv.activo)
    }

    // Exclusividad por placa/teléfono
    const ultimo = await CaptacionDateo.query()
      .andWhere((q) => {
        q.orWhere('placa', placa!)
        if (telefono) q.orWhere('telefono', telefono)
      })
      .preload('agente', (q) => q.select(['id', 'nombre', 'tipo']))
      .orderBy('created_at', 'desc')
      .first()

    if (ultimo) {
      const reserva = buildReserva(ultimo)
      if (reserva.vigente) {
        const u = ultimo.serialize() as any
        return response.status(409).send({
          message: 'Ya existe un dateo activo para esta placa/teléfono dentro de la ventana.',
          dateoId: u.id,
          bloqueadoHasta: reserva.bloqueaHasta,
          por: u?.agente?.nombre ?? null,
        })
      }
    }

    const created = await CaptacionDateo.create({
      canal: canal as Canal,
      agenteId,
      convenioId, // ✅ guarda el origen (convenio)
      placa: placa!,
      telefono,
      origen: origen as Origen,
      observacion,
      resultado: 'PENDIENTE',
      imagenUrl,
      imagenMime,
      imagenTamanoBytes,
      imagenHash,
      imagenOrigenId: imagenOrigenId === null ? null : String(imagenOrigenId),
      imagenSubidaPor,
    })

    const out = created.serialize() as any
    out.canal = (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const).includes(out.canal) ? 'ASESOR' : out.canal
    return response.created(toSnake(out))
  }

  /**
   * PUT /captacion-dateos/:id
   * Actualiza: observacion, imagen_*, consumido_turno_id y resultado
   */
  public async update({ params, request, response }: HttpContext) {
    const item = await CaptacionDateo.find(params.id)
    if (!item) return response.notFound({ message: 'Dateo no encontrado' })

    // Campos simples
    const observacion = request.input('observacion') as string | undefined
    const resultado = request.input('resultado') as Resultado | undefined

    // Imagen (snake → camel)
    const imagenUrl = request.input('imagen_url') as string | undefined
    const imagenMime = request.input('imagen_mime') as string | undefined
    const imagenTamanoBytesRaw = request.input('imagen_tamano_bytes') as number | string | undefined
    const imagenHash = request.input('imagen_hash') as string | undefined
    const imagenOrigenId = request.input('imagen_origen_id') as string | number | undefined
    const imagenSubidaPorRaw = request.input('imagen_subida_por') as unknown

    // Turno consumido
    const consumidoTurnoIdRaw = request.input('consumido_turno_id') as unknown

    if (resultado !== undefined) {
      if (!(RESULTADOS as readonly string[]).includes(resultado)) {
        return response.badRequest({ message: 'resultado inválido' })
      }
      item.resultado = resultado
    }

    if (observacion !== undefined) item.observacion = observacion ?? null

    // 👇 imagen
    if (imagenUrl !== undefined) item.imagenUrl = imagenUrl || null
    if (imagenMime !== undefined) item.imagenMime = imagenMime || null
    if (imagenTamanoBytesRaw !== undefined) {
      item.imagenTamanoBytes =
        imagenTamanoBytesRaw === null ? null : Number(imagenTamanoBytesRaw as number | string)
    }
    if (imagenHash !== undefined) item.imagenHash = imagenHash || null
    if (imagenOrigenId !== undefined) item.imagenOrigenId = imagenOrigenId == null ? null : String(imagenOrigenId)
    if (imagenSubidaPorRaw !== undefined) item.imagenSubidaPor = readOptionalNumber(imagenSubidaPorRaw)

    if (consumidoTurnoIdRaw !== undefined) {
      const n = readOptionalNumber(consumidoTurnoIdRaw)
      if (n === null) {
        item.consumidoTurnoId = null
        item.consumidoAt = null
      } else {
        item.consumidoTurnoId = n
        // @ts-ignore
        item.consumidoAt = (item as any).$createDateTime(new Date().toISOString())
      }
    }

    await item.save()

    const out = item.serialize() as any
    out.canal = (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const).includes(out.canal) ? 'ASESOR' : out.canal
    const reserva = buildReserva(item)
    return { ...toSnake(out), reserva }
  }

  /** DELETE /captacion-dateos/:id */
  public async destroy({ params, response }: HttpContext) {
    const item = await CaptacionDateo.find(params.id)
    if (!item) return response.notFound({ message: 'Dateo no encontrado' })
    await item.delete()
    return response.noContent()
  }
}
