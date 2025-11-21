// app/controllers/captacion_dateos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import CaptacionDateo, { Canal, Origen } from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'
import Convenio from '#models/convenio'
import TurnoRtm from '#models/turno_rtm'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'
import Prospecto from '#models/prospecto'

/* ======================= Constantes / Tipos ======================= */
const CANALES_DB = ['FACHADA', 'ASESOR_COMERCIAL', 'ASESOR_CONVENIO', 'TELE', 'REDES'] as const
type CanalDb = (typeof CANALES_DB)[number]
const CANAL_ALIAS_ASESOR = ['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const

const ORIGENES = ['UI', 'WHATSAPP', 'IMPORT'] as const
type OrigenVal = (typeof ORIGENES)[number]

const RESULTADOS = ['PENDIENTE', 'EN_PROCESO', 'EXITOSO', 'NO_EXITOSO'] as const
type Resultado = (typeof RESULTADOS)[number]

function normalizePlaca(v?: string | null) {
  return v ? v.replace(/[\s-]/g, '').toUpperCase() : (v ?? null)
}
function normalizePhone(v?: string | null) {
  return v ? v.replace(/\D/g, '') : (v ?? null)
}
function ttlSinConsumir() {
  return Number(process.env.TTL_SIN_CONSUMIR_DIAS ?? 7)
}
function ttlPostConsumo() {
  return Number(process.env.TTL_POST_CONSUMO_DIAS ?? 365)
}

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

/** 🔎 Construye el bloque turnoInfo para la UI */
function serializeTurnoInfo(t: any | null) {
  if (!t) return null
  const fechaISO = t.fecha?.toISODate ? t.fecha.toISODate() : t.fecha || null
  const numeroServicio = (t as any).turnoNumeroServicio ?? (t as any).turno_numero_servicio ?? null
  return {
    id: t.id ?? null,
    fecha: fechaISO,
    numeroGlobal: t.turnoNumero ?? null,
    numeroServicio: numeroServicio,
    estado: t.estado ?? null,
    servicioCodigo: (t as any).$preloaded?.servicio?.codigoServicio ?? null,
  }
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
    const convenioId = readOptionalNumber(
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
      .preload('convenio', (qb) => qb.select(['id', 'nombre']))

    if (placa) q.andWhere('placa', placa)
    if (telefono) q.andWhere('telefono', telefono)

    if (canalIsAsesor) {
      q.whereIn('canal', CANAL_ALIAS_ASESOR as unknown as string[])
    } else if (canalDb) {
      q.andWhere('canal', canalDb)
    }

    if (agenteId !== null) q.andWhere('agente_id', agenteId)
    if (convenioId !== null) q.andWhere('convenio_id', convenioId)

    if (resultado && (RESULTADOS as readonly string[]).includes(resultado))
      q.andWhere('resultado', resultado)
    if (consumido === 'true') q.andWhereNotNull('consumido_turno_id')
    if (consumido === 'false') q.andWhereNull('consumido_turno_id')
    if (desde) q.andWhere('created_at', '>=', `${desde} 00:00:00`)
    if (hasta) q.andWhere('created_at', '<=', `${hasta} 23:59:59`)

    q.orderBy(sortCol, order as 'asc' | 'desc')

    const result = await q.paginate(page, perPage)
    const serialized = result.serialize().data as any[]

    // Resolver turnoInfo en batch para evitar N+1
    const turnoIds = serialized
      .map((r) => r.consumidoTurnoId)
      .filter((v: unknown): v is number => typeof v === 'number' && Number.isFinite(v))

    let turnosById: Record<number, any> = {}
    if (turnoIds.length) {
      const uniq = Array.from(new Set(turnoIds))
      const turnos = await TurnoRtm.query()
        .whereIn('id', uniq)
        .preload('servicio')
        .select(['id', 'fecha', 'turnoNumero', 'turno_numero_servicio', 'estado', 'servicio_id'])
      turnosById = Object.fromEntries(turnos.map((t) => [t.id, t]))
    }

    const data = serialized.map((row: any) => {
      const base = {
        ...row,
        canal: (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const).includes(row.canal)
          ? 'ASESOR'
          : row.canal,
      }
      const snake = toSnake(base)
      const t = snake.consumido_turno_id ? turnosById[snake.consumido_turno_id] : null
      return {
        ...snake,
        turnoInfo: serializeTurnoInfo(t),
      }
    })

    return { data, total: result.total, page: result.currentPage, perPage: result.perPage }
  }

  /** GET /captacion-dateos/:id */
  public async show({ params, response }: HttpContext) {
    const item = await CaptacionDateo.query()
      .where('id', params.id)
      .preload('agente')
      .preload('convenio', (qb) => qb.select(['id', 'nombre']))
      .first()

    if (!item) return response.notFound({ message: 'Dateo no encontrado' })

    const out = item.serialize() as any
    out.canal = (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const).includes(out.canal)
      ? 'ASESOR'
      : out.canal

    // turnoInfo puntual
    let turnoInfo = null
    if (item.consumidoTurnoId) {
      const t = await TurnoRtm.query()
        .where('id', item.consumidoTurnoId)
        .preload('servicio')
        .select(['id', 'fecha', 'turnoNumero', 'turno_numero_servicio', 'estado', 'servicio_id'])
        .first()
      turnoInfo = serializeTurnoInfo(t)
    }

    const reserva = buildReserva(item)
    return { ...toSnake(out), reserva, turnoInfo }
  }

  /**
   * POST /captacion-dateos
   */
  public async store({ request, response, auth }: HttpContext) {
    // Agente (por body o por usuario logueado)
    let agenteId = readOptionalNumber(
      (request.input('agente_id') ?? request.input('agenteId')) as unknown
    )

    let agente: AgenteCaptacion | null = null

    if (agenteId === null && auth.user) {
      agente = await AgenteCaptacion.findBy('usuarioId', auth.user.id)
      if (agente) {
        agenteId = agente.id
      }
    }

    // Canal (resolviendo alias ASESOR según tipo agente)
    let canalRaw = String(request.input('canal') || '').toUpperCase()
    if (!canalRaw) canalRaw = 'ASESOR'

    let canal: CanalDb

    if (canalRaw === 'ASESOR') {
      if (!agente && agenteId !== null) {
        agente = await AgenteCaptacion.find(agenteId)
      }

      const tipo = (agente?.tipo || '').toUpperCase()
      if (tipo === 'ASESOR_CONVENIO') {
        canal = 'ASESOR_CONVENIO'
      } else {
        canal = 'ASESOR_COMERCIAL'
      }
    } else if ((CANALES_DB as readonly string[]).includes(canalRaw)) {
      canal = canalRaw as CanalDb
    } else {
      return response.badRequest({ message: 'canal inválido' })
    }

    // Convenio (body)
    let convenioId = readOptionalNumber(
      (request.input('convenio_id') ?? request.input('convenioId')) as unknown
    )
    let convenio: Convenio | null = null

    if (convenioId !== null) {
      convenio = await Convenio.find(convenioId)
      if (!convenio) return response.badRequest({ message: 'convenio_id no existe' })
    }

    // Campos básicos
    const placa = normalizePlaca(request.input('placa') as string | undefined)
    const telefono = normalizePhone(request.input('telefono') as string | undefined)
    const origen = request.input('origen') as OrigenVal
    const observacion = (request.input('observacion') as string | undefined) ?? null

    // Imagen
    const imagenUrl = (request.input('imagen_url') as string | undefined) ?? null
    const imagenMime = (request.input('imagen_mime') as string | undefined) ?? null
    const imagenTamanoBytesRaw = request.input('imagen_tamano_bytes') as number | string | undefined
    const imagenTamanoBytes =
      imagenTamanoBytesRaw === undefined || imagenTamanoBytesRaw === null
        ? null
        : Number(imagenTamanoBytesRaw)
    const imagenHash = (request.input('imagen_hash') as string | undefined) ?? null
    const imagenOrigenId =
      (request.input('imagen_origen_id') as string | number | undefined) ?? null
    const imagenSubidaPor = readOptionalNumber(request.input('imagen_subida_por') as unknown)

    if (!ORIGENES.includes(origen)) {
      return response.badRequest({ message: 'origen inválido (UI | WHATSAPP | IMPORT)' })
    }
    if (!placa) {
      return response.badRequest({ message: 'La placa es obligatoria' })
    }

    // Necesidad de agente según canal
    if (
      (canal === 'ASESOR_COMERCIAL' || canal === 'ASESOR_CONVENIO' || canal === 'TELE') &&
      agenteId === null
    ) {
      return response.badRequest({ message: 'agente_id es requerido para canal ASESOR/TELE' })
    }

    if (agenteId !== null && !agente) {
      agente = await AgenteCaptacion.find(agenteId)
      if (!agente) return response.badRequest({ message: 'agente_id no existe' })
    }

    // =========== Reglas negocio ASESOR_COMERCIAL / ASESOR_CONVENIO + convenio ===========
    let asesorConvenioId: number | null = null

    if (agente && agente.tipo === 'ASESOR_CONVENIO') {
      // 🔒 Un asesor convenio solo puede datear para SU convenio
      canal = 'ASESOR_CONVENIO'

      const convenioDelAsesor = await Convenio.query()
        .where('asesor_convenio_id', agente.id)
        .first()

      if (!convenioDelAsesor) {
        return response.unprocessableEntity({
          message: 'El asesor convenio no tiene un convenio asociado para datear.',
        })
      }

      // Si viene un convenioId distinto, no se permite
      if (convenioId !== null && convenioId !== convenioDelAsesor.id) {
        return response.forbidden({
          message:
            'No puede datear para un convenio distinto al que tiene asociado como asesor convenio.',
        })
      }

      convenioId = convenioDelAsesor.id
      convenio = convenioDelAsesor
      asesorConvenioId = agente.id // ✅ Solo se llena cuando ES el asesor convenio quien datea

    } else if (agente && canal === 'ASESOR_COMERCIAL') {
      // 💼 Comercial: puede datear sin convenio, pero si viene convenioId debe estar asignado
      if (convenioId !== null) {
        const asignacion = await AsesorConvenioAsignacion.query()
          .where('asesor_id', agente.id)
          .where('convenio_id', convenioId)
          .where('activo', true)
          .whereNull('fecha_fin')
          .first()

        if (!asignacion) {
          return response.forbidden({
            message:
              'Este asesor comercial no tiene asignado el convenio seleccionado. No puede datear para él.',
          })
        }

        // ✅ NO llenamos asesor_convenio_id cuando un comercial datea con convenio
        // El campo asesor_convenio_id solo se usa cuando ES el asesor convenio quien datea
      }
    }
    // ✅ Para otros canales (TELE, FACHADA, REDES) tampoco llenamos asesor_convenio_id

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

    // Crear Dateo
    const created = await CaptacionDateo.create({
      canal: canal as Canal,
      agenteId,
      convenioId,
      asesorConvenioId,
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

    // Archivar prospecto con misma placa (si existe y no está archivado)
    try {
      await Prospecto.query()
        .where('archivado', false)
        .whereRaw("REPLACE(UPPER(placa), '-', '') = ?", [placa!])
        .update({ archivado: true })
    } catch (err) {
      console.error('No se pudo archivar prospecto asociado a la placa', placa, err)
    }

    const out = created.serialize() as any
    out.canal = (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const).includes(out.canal)
      ? 'ASESOR'
      : out.canal
    return response.created(toSnake(out))
  }

  /**
   * PUT /captacion-dateos/:id
   */
  public async update({ params, request, response }: HttpContext) {
    const item = await CaptacionDateo.find(params.id)
    if (!item) return response.notFound({ message: 'Dateo no encontrado' })

    const observacion = request.input('observacion') as string | undefined
    const resultado = request.input('resultado') as Resultado | undefined

    const imagenUrl = request.input('imagen_url') as string | undefined
    const imagenMime = request.input('imagen_mime') as string | undefined
    const imagenTamanoBytesRaw = request.input('imagen_tamano_bytes') as number | string | undefined
    const imagenHash = request.input('imagen_hash') as string | undefined
    const imagenOrigenId = request.input('imagen_origen_id') as string | number | undefined
    const imagenSubidaPorRaw = request.input('imagen_subida_por') as unknown

    const consumidoTurnoIdRaw = request.input('consumido_turno_id') as unknown

    if (resultado !== undefined) {
      if (!(RESULTADOS as readonly string[]).includes(resultado)) {
        return response.badRequest({ message: 'resultado inválido' })
      }
      item.resultado = resultado
    }

    if (observacion !== undefined) item.observacion = observacion ?? null

    if (imagenUrl !== undefined) item.imagenUrl = imagenUrl || null
    if (imagenMime !== undefined) item.imagenMime = imagenMime || null
    if (imagenTamanoBytesRaw !== undefined) {
      item.imagenTamanoBytes =
        imagenTamanoBytesRaw === null ? null : Number(imagenTamanoBytesRaw as number | string)
    }
    if (imagenHash !== undefined) item.imagenHash = imagenHash || null
    if (imagenOrigenId !== undefined)
      item.imagenOrigenId = imagenOrigenId === null ? null : String(imagenOrigenId)
    if (imagenSubidaPorRaw !== undefined)
      item.imagenSubidaPor = readOptionalNumber(imagenSubidaPorRaw)

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
    out.canal = (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const).includes(out.canal)
      ? 'ASESOR'
      : out.canal

    let turnoInfo = null
    if (item.consumidoTurnoId) {
      const t = await TurnoRtm.query()
        .where('id', item.consumidoTurnoId)
        .preload('servicio')
        .select(['id', 'fecha', 'turnoNumero', 'turno_numero_servicio', 'estado', 'servicio_id'])
        .first()
      turnoInfo = serializeTurnoInfo(t)
    }

    const reserva = buildReserva(item)
    return { ...toSnake(out), reserva, turnoInfo }
  }

  /** DELETE /captacion-dateos/:id */
  public async destroy({ params, response }: HttpContext) {
    const item = await CaptacionDateo.find(params.id)
    if (!item) return response.notFound({ message: 'Dateo no encontrado' })
    await item.delete()
    return response.noContent()
  }
}
