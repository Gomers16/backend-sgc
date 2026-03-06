// app/controllers/comisiones_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Database from '@adonisjs/lucid/services/db'

import Comision from '#models/comision'
import AgenteCaptacion from '#models/agente_captacion'
import TurnoRtm from '#models/turno_rtm'

/* ========= Helpers ========= */
function toNumber(v: any): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function parseNullable(v: any): number | null {
  if (v === null || v === undefined || v === '') return null
  return Math.max(0, toNumber(v))
}

/**
 * Mapea una comision REAL (es_config = false) a DTO de lista/detalle
 */
function mapComisionToDto(c: Comision) {
  const anyC: any = c

  const dateo = anyC.$preloaded?.dateo || null
  const turno = dateo?.$preloaded?.turno || null
  const servicio = turno?.$preloaded?.servicio || null

  const valorAsesor = toNumber(c.monto)
  const valorCliente = toNumber(c.base)
  const valorTotal = valorAsesor + valorCliente

  const montoAsesorComercial = c.montoAsesor ? toNumber(c.montoAsesor) : null
  const montoConvenioPlaca = c.montoConvenio ? toNumber(c.montoConvenio) : null
  const asesorSecundario = anyC.$preloaded?.asesorSecundario || null

  const tieneDesglose = montoAsesorComercial !== null || montoConvenioPlaca !== null

  const numeroGlobal = turno?.numeroGlobal ?? turno?.turnoNumero ?? turno?.numero ?? turno?.id
  const numeroServicio =
    turno?.numeroServicio ??
    turno?.numero_servicio ??
    turno?.turnoNumeroServicio ??
    turno?.turno_numero_servicio ??
    turno?.numeroPorServicio ??
    null

  const fechaUltimaVisitaRaw = turno
    ? ((turno as any).fechaUltimaVisita ?? (turno as any).fecha_ultima_visita ?? null)
    : null
  const fechaUltimaVisitaISO = fechaUltimaVisitaRaw
    ? fechaUltimaVisitaRaw instanceof DateTime
      ? fechaUltimaVisitaRaw.toISODate()
      : String(fechaUltimaVisitaRaw).substring(0, 10)
    : null

  // 🆕 Extraer descuento del ticket CONFIRMADO del turno
  const tickets: any[] = turno?.$preloaded?.facturacionTickets ?? []
  const ticket = tickets.find((t: any) => t.estado === 'CONFIRMADA') ?? tickets[0] ?? null

  const descuentoRaw = ticket?.$preloaded?.descuento ?? null
  const confirmedByRaw = ticket?.$preloaded?.confirmedBy ?? null
  const autorizadoPorRaw = ticket?.$preloaded?.autorizadoPor ?? null

  const descuento = descuentoRaw
    ? {
        id: descuentoRaw.id,
        codigo: String(descuentoRaw.codigo ?? ''),
        nombre: String(descuentoRaw.nombre ?? ''),
      }
    : null

  // Si tiene autorizadoPorId → fue aplicado manualmente en caja; si no → venía pre-marcado del dateo
  const descuentoOrigen: 'dateo' | 'caja' | null = descuento
    ? ticket?.autorizadoPorId
      ? 'caja'
      : 'dateo'
    : null

  let descuentoAplicadoAt: string | null = null
  if (ticket?.confirmadoAt) {
    descuentoAplicadoAt =
      ticket.confirmadoAt instanceof DateTime
        ? ticket.confirmadoAt.toISO()
        : String(ticket.confirmadoAt)
  }

  const descuentoAplicadoPor = confirmedByRaw
    ? {
        id: confirmedByRaw.id,
        nombres: confirmedByRaw.nombres ?? confirmedByRaw.nombre ?? null,
        apellidos: confirmedByRaw.apellidos ?? null,
      }
    : null

  const descuentoAutorizadoPor = autorizadoPorRaw
    ? {
        id: autorizadoPorRaw.id,
        nombres: autorizadoPorRaw.nombres ?? autorizadoPorRaw.nombre ?? null,
        apellidos: autorizadoPorRaw.apellidos ?? null,
      }
    : null

  return {
    id: c.id,
    dateo_id: c.captacionDateoId,
    estado: c.estado,
    cantidad: 1,

    valor_unitario: valorAsesor,
    valor_cliente: valorCliente,
    valor_total: valorTotal,
    generado_at: c.fechaCalculo ? c.fechaCalculo.toISO() : null,

    tiene_desglose: tieneDesglose,
    desglose: tieneDesglose
      ? {
          monto_asesor_comercial: montoAsesorComercial,
          monto_convenio_placa: montoConvenioPlaca,
          asesor_secundario: asesorSecundario
            ? {
                id: asesorSecundario.id,
                nombre: asesorSecundario.nombre,
                tipo: asesorSecundario.tipo,
              }
            : null,
        }
      : null,

    asesor: anyC.$preloaded?.asesor
      ? {
          id: anyC.$preloaded.asesor.id,
          nombre: anyC.$preloaded.asesor.nombre,
          tipo: anyC.$preloaded.asesor.tipo,
        }
      : null,

    convenio: anyC.$preloaded?.convenio
      ? {
          id: anyC.$preloaded.convenio.id,
          nombre: anyC.$preloaded.convenio.nombre,
        }
      : null,

    turno: turno
      ? {
          id: turno.id,
          numero_global: numeroGlobal,
          numero_servicio: numeroServicio,
          fecha: (turno as any).fecha || turno.createdAt,
          placa: (turno as any).placa,
          servicio: servicio
            ? {
                id: servicio.id,
                codigo: (servicio as any).codigoServicio,
                nombre: (servicio as any).nombreServicio,
              }
            : null,
          es_recurrente: Boolean(
            (turno as any).esRecurrente ?? (turno as any).es_recurrente ?? false
          ),
          es_recuperacion: Boolean(
            (turno as any).esRecuperacion ?? (turno as any).es_recuperacion ?? false
          ),
          meses_desde_ultima_visita:
            (turno as any).mesesDesdeUltimaVisita ??
            (turno as any).meses_desde_ultima_visita ??
            null,
          ultimo_turno_id: (turno as any).ultimoTurnoId ?? (turno as any).ultimo_turno_id ?? null,
          fecha_ultima_visita: fechaUltimaVisitaISO,
          ultima_visita: null as {
            placa: string | null
            conductor_nombre: string | null
            vehiculo_descripcion: string | null
            fecha: string | null
          } | null,
        }
      : null,

    // 🆕 Descuento informativo (viene del FacturacionTicket CONFIRMADA del turno)
    descuento,
    descuento_origen: descuentoOrigen,
    descuento_aplicado_at: descuentoAplicadoAt,
    descuento_aplicado_por: descuentoAplicadoPor,
    descuento_autorizado_por: descuentoAutorizadoPor,
  }
}

/**
 * Mapea una FILA DE CONFIGURACIÓN (es_config = true) a DTO
 */
function mapConfigToDto(c: Comision) {
  return {
    id: c.id,
    es_config: true,
    asesor_id: c.asesorId ?? null,
    tipo_vehiculo: (c as any).tipoVehiculo ?? null,
    // incentivo base (fallback cuando no hay específico por tipo)
    valor_placa: toNumber(c.base),
    // 🆕 incentivos específicos por tipo de vehículo (null = sin configurar, usa valor_placa)
    valor_placa_vehiculo: c.valorPlacaVehiculo !== null ? toNumber(c.valorPlacaVehiculo) : null,
    valor_placa_moto: c.valorPlacaMoto !== null ? toNumber(c.valorPlacaMoto) : null,
    // dateo nuevo via convenio ($8.600)
    valor_dateo: toNumber(c.monto),
    // dateo nuevo directo sin convenio ($17.200)
    valor_nuevo_directo: toNumber(c.valorNuevoDirecto ?? 0),
    meta_rtm: c.metaRtm ?? 0,
    porcentaje_comision_meta: toNumber(c.porcentajeComisionMeta ?? 0),
    fecha_calculo: c.fechaCalculo ? c.fechaCalculo.toISO() : null,
  }
}

function mapMetaToDto(c: Comision) {
  return {
    id: c.id,
    asesor_id: c.asesorId,
    tipo_vehiculo: (c as any).tipoVehiculo ?? null,
    meta_mensual: c.metaRtm ?? 0,
    porcentaje_extra: toNumber(c.porcentajeComisionMeta ?? 0),
    valor_rtm_moto: c.valorRtmMoto ?? 0,
    valor_rtm_vehiculo: c.valorRtmVehiculo ?? 0,
    fecha_actualizacion: c.updatedAt?.toISO() ?? c.createdAt?.toISO() ?? null,
  }
}

export default class ComisionesController {
  /**
   * GET /api/comisiones
   */
  public async index({ request, response }: HttpContext) {
    const page = Number(request.input('page') || 1)
    const perPage = Math.min(Number(request.input('perPage') || 10), 100)
    const mes = request.input('mes') as string | undefined
    const asesorId = request.input('asesorId') as number | undefined
    const convenioId = request.input('convenioId') as number | undefined
    const estado = request.input('estado') as string | undefined
    const sortBy = (request.input('sortBy') || 'id') as string
    const order = (request.input('order') || 'desc') as 'asc' | 'desc'

    const query = Comision.query()
      .where((q) => {
        q.where('es_config', false).orWhereNull('es_config')
      })
      .preload('asesor')
      .preload('convenio')
      .preload('asesorSecundario')
      .preload('dateo', (dq) => {
        dq.preload('turno', (tq) => {
          tq.preload('servicio')
          // 🆕 Cargar tickets confirmados con descuento y usuarios relacionados
          tq.preload('facturacionTickets', (fq) => {
            fq.whereNotNull('descuento_id')
              .preload('descuento')
              .preload('confirmedBy')
              .preload('autorizadoPor')
          })
        })
      })

    if (mes && /^\d{4}-\d{2}$/.test(mes)) {
      const [year, month] = mes.split('-').map(Number)
      const start = DateTime.fromObject({ year, month, day: 1 }).startOf('day').toSQL()
      const end = DateTime.fromObject({ year, month, day: 1 }).endOf('month').toSQL()
      if (start && end) query.whereBetween('fecha_calculo', [start, end])
    }

    if (asesorId) query.where('asesor_id', asesorId)
    if (convenioId) query.where('convenio_id', convenioId)
    if (estado) query.where('estado', estado)

    const SORTABLE = new Set(['id', 'estado', 'fecha_calculo', 'monto', 'asesor_id', 'convenio_id'])
    let sortCol = sortBy === 'generado_at' ? 'fecha_calculo' : sortBy
    if (!SORTABLE.has(sortCol)) sortCol = 'id'
    query.orderBy(sortCol, order)

    const paginated = await query.paginate(page, perPage)
    const meta = paginated.getMeta()
    const data = paginated.all()
    const rows = data.map((c) => mapComisionToDto(c))

    return response.ok({
      data: rows,
      total: meta.total,
      page: meta.currentPage,
      perPage: meta.perPage,
    })
  }

  /**
   * GET /api/comisiones/metas-mensuales
   */
  public async metasMensuales({ request, response }: HttpContext) {
    const mes = request.input('mes') as string | undefined
    const asesorIdParam = request.input('asesorId') as number | string | undefined

    let year: number
    let month: number

    if (mes && /^\d{4}-\d{2}$/.test(mes)) {
      const [y, m] = mes.split('-').map(Number)
      year = y
      month = m
    } else {
      const now = DateTime.now()
      year = now.year
      month = now.month
    }

    const start = DateTime.fromObject({ year, month, day: 1 }).startOf('day').toSQL()
    const end = DateTime.fromObject({ year, month, day: 1 }).endOf('month').toSQL()

    const asesorId =
      asesorIdParam !== undefined && asesorIdParam !== null ? Number(asesorIdParam) : undefined

    const baseQ = Database.from('comisiones')
      .where((q) => {
        q.where('es_config', false).orWhereNull('es_config')
      })
      .andWhere('tipo_servicio', 'RTM')
      .whereIn('estado', ['PENDIENTE', 'APROBADA', 'PAGADA'])
      .whereNotNull('asesor_id')

    if (start && end) baseQ.whereBetween('fecha_calculo', [start, end])
    if (asesorId) baseQ.andWhere('asesor_id', asesorId)

    const agregados = await baseQ
      .select('asesor_id')
      .select(Database.raw("SUM(CASE WHEN tipo_vehiculo = 'MOTO' THEN 1 ELSE 0 END) AS rtm_motos"))
      .select(
        Database.raw(
          "SUM(CASE WHEN tipo_vehiculo = 'VEHICULO' OR tipo_vehiculo IS NULL THEN 1 ELSE 0 END) AS rtm_vehiculos"
        )
      )
      .groupBy('asesor_id')

    const countsByAsesor = new Map<number, { rtm_motos: number; rtm_vehiculos: number }>()
    for (const row of agregados as any[]) {
      const id = Number(row.asesor_id)
      if (!Number.isFinite(id)) continue
      countsByAsesor.set(id, {
        rtm_motos: Number(row.rtm_motos || 0),
        rtm_vehiculos: Number(row.rtm_vehiculos || 0),
      })
    }

    const cfgRows = await Comision.query().where('es_config', true).where('meta_rtm', '>', 0)
    const cfgByAsesor = new Map<number, Comision>()
    for (const c of cfgRows) {
      if (c.asesorId !== null) cfgByAsesor.set(c.asesorId, c)
    }

    const allIds = new Set<number>()
    if (asesorId) {
      allIds.add(asesorId)
    } else {
      countsByAsesor.forEach((_v, id) => allIds.add(id))
      cfgByAsesor.forEach((_v, id) => allIds.add(id))
    }

    const asesorIds = Array.from(allIds)
    const asesoresMap = new Map<number, { nombre: string; tipo: string | null }>()

    if (asesorIds.length > 0) {
      const asesores = await AgenteCaptacion.query().whereIn('id', asesorIds)
      for (const a of asesores) {
        asesoresMap.set(a.id, { nombre: a.nombre, tipo: (a as any).tipo ?? null })
      }
    }

    const rows = asesorIds.map((id) => {
      const counts = countsByAsesor.get(id) ?? { rtm_motos: 0, rtm_vehiculos: 0 }
      const cfg = cfgByAsesor.get(id) ?? null

      const metaRtm = cfg ? (cfg.metaRtm ?? 0) : 0
      const pctMeta = cfg ? toNumber(cfg.porcentajeComisionMeta ?? 0) : 0
      const valorRtmMoto = cfg ? (cfg.valorRtmMoto ?? 126100) : 126100
      const valorRtmVehiculo = cfg ? (cfg.valorRtmVehiculo ?? 208738) : 208738

      const totalFacturacionMotos = counts.rtm_motos * valorRtmMoto
      const totalFacturacionVehiculos = counts.rtm_vehiculos * valorRtmVehiculo
      const totalFacturacionGlobal = totalFacturacionMotos + totalFacturacionVehiculos
      const info = asesoresMap.get(id)

      return {
        asesor_id: id,
        asesor_nombre: info?.nombre ?? '—',
        asesor_tipo: info?.tipo ?? null,
        rtm_motos: counts.rtm_motos,
        rtm_vehiculos: counts.rtm_vehiculos,
        total_rtm_motos: counts.rtm_motos,
        total_rtm_vehiculos: counts.rtm_vehiculos,
        meta_global_rtm: metaRtm,
        porcentaje_comision_meta: pctMeta,
        valor_rtm_moto: valorRtmMoto,
        valor_rtm_vehiculo: valorRtmVehiculo,
        total_facturacion_motos: totalFacturacionMotos,
        total_facturacion_vehiculos: totalFacturacionVehiculos,
        total_facturacion_global: totalFacturacionGlobal,
      }
    })

    return response.ok({ data: rows })
  }

  /**
   * GET /api/comisiones/:id
   */
  public async show({ params, response }: HttpContext) {
    const comision = await Comision.query()
      .where('id', params.id)
      .where((q) => {
        q.where('es_config', false).orWhereNull('es_config')
      })
      .preload('asesor')
      .preload('convenio')
      .preload('asesorSecundario')
      .preload('dateo', (dq) => {
        dq.preload('turno', (tq) => {
          tq.preload('servicio')
          // 🆕 Cargar tickets con descuento para trazabilidad completa
          tq.preload('facturacionTickets', (fq) => {
            fq.whereNotNull('descuento_id')
              .preload('descuento')
              .preload('confirmedBy')
              .preload('autorizadoPor')
          })
        })
      })
      .first()

    if (!comision) return response.notFound({ message: 'Comisión no encontrada' })

    const dto = mapComisionToDto(comision)

    const ultimoTurnoId = dto.turno?.ultimo_turno_id ?? null
    if (ultimoTurnoId && dto.turno) {
      const ultimoTurno = await TurnoRtm.query()
        .where('id', ultimoTurnoId)
        .preload('conductor')
        .preload('vehiculo')
        .first()

      if (ultimoTurno) {
        const conductor = (ultimoTurno as any).$preloaded?.conductor ?? null
        const vehiculo = (ultimoTurno as any).$preloaded?.vehiculo ?? null
        const vehiculoDescripcion = vehiculo
          ? [vehiculo.marca, vehiculo.linea, vehiculo.modelo].filter(Boolean).join(' ') || null
          : null

        dto.turno.ultima_visita = {
          placa: (ultimoTurno as any).placa ?? null,
          conductor_nombre: conductor?.nombre ?? null,
          vehiculo_descripcion: vehiculoDescripcion,
          fecha:
            ultimoTurno.fecha instanceof DateTime
              ? ultimoTurno.fecha.toISODate()
              : String(ultimoTurno.fecha).substring(0, 10),
        }
      }
    }

    const result = {
      ...dto,
      aprobado_at: null,
      pagado_at: null,
      anulado_at: null,
      observacion: null,
    }

    return response.ok(result)
  }

  /**
   * PATCH /api/comisiones/:id/valores
   */
  public async actualizarValores({ params, request, response }: HttpContext) {
    const comision = await Comision.find(params.id)

    if (!comision || comision.esConfig)
      return response.notFound({ message: 'Comisión no encontrada' })

    if (comision.estado !== 'PENDIENTE')
      return response.badRequest({
        message: 'Solo se pueden editar comisiones en estado PENDIENTE',
      })

    const { cantidad, valor_unitario: valorUnitario } = request.only(['cantidad', 'valor_unitario'])
    const cant = toNumber(cantidad || 1)
    const vu = toNumber(valorUnitario || 0)

    comision.monto = String(cant * vu)
    await comision.save()

    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/aprobar
   */
  public async aprobar({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision || comision.esConfig)
      return response.notFound({ message: 'Comisión no encontrada' })
    if (comision.estado !== 'PENDIENTE')
      return response.badRequest({ message: 'Solo se pueden aprobar comisiones PENDIENTES' })

    comision.estado = 'APROBADA'
    await comision.save()
    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/pagar
   */
  public async pagar({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision || comision.esConfig)
      return response.notFound({ message: 'Comisión no encontrada' })
    if (comision.estado !== 'APROBADA')
      return response.badRequest({ message: 'Solo se pueden pagar comisiones APROBADAS' })

    comision.estado = 'PAGADA'
    await comision.save()
    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/anular
   */
  public async anular({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision || comision.esConfig)
      return response.notFound({ message: 'Comisión no encontrada' })
    if (comision.estado === 'PAGADA')
      return response.badRequest({ message: 'No se pueden anular comisiones PAGADAS' })

    comision.estado = 'ANULADA'
    await comision.save()
    return this.show({ params, response } as any)
  }

  /* ============================================================
   *          CONFIGURACIONES DE COMISIONES (es_config = true)
   * ============================================================*/

  /**
   * GET /api/comisiones/config
   */
  public async configsIndex({ request, response }: HttpContext) {
    const asesorId = request.input('asesorId') as number | undefined
    const tipoVehiculo = request.input('tipoVehiculo') as string | undefined

    const query = Comision.query().where('es_config', true)
    if (asesorId) query.where('asesor_id', asesorId)
    if (tipoVehiculo) query.where('tipo_vehiculo', tipoVehiculo)
    query.orderBy('asesor_id', 'asc').orderBy('tipo_vehiculo', 'asc')

    const result = await query
    return response.ok({ data: result.map((c) => mapConfigToDto(c)) })
  }

  /**
   * POST /api/comisiones/config
   */
  public async configsUpsert({ request, response }: HttpContext) {
    const payload = request.only([
      'asesor_id',
      'tipo_vehiculo',
      'valor_placa',
      'valor_placa_vehiculo',
      'valor_placa_moto',
      'valor_dateo',
      'valor_nuevo_directo',
      'meta_rtm',
      'porcentaje_comision_meta',
    ])

    const asesorIdRaw = payload.asesor_id
    const asesorId = asesorIdRaw ? Number(asesorIdRaw) : null
    const tipoVehiculo = (payload.tipo_vehiculo || '').toUpperCase()

    if (!['MOTO', 'VEHICULO'].includes(tipoVehiculo))
      return response.badRequest({ message: 'tipo_vehiculo inválido (MOTO o VEHICULO)' })

    const valorPlaca = Math.max(0, toNumber(payload.valor_placa))
    const valorDateo = Math.max(0, toNumber(payload.valor_dateo))
    const valorNuevoDirecto = Math.max(0, toNumber(payload.valor_nuevo_directo ?? 0))
    const valorPlacaVehiculo = parseNullable(payload.valor_placa_vehiculo)
    const valorPlacaMoto = parseNullable(payload.valor_placa_moto)

    const existingQuery = Comision.query()
      .where('es_config', true)
      .where('tipo_vehiculo', tipoVehiculo)

    if (asesorId === null) {
      existingQuery.whereNull('asesor_id')
    } else {
      existingQuery.where('asesor_id', asesorId)
    }

    let comision = await existingQuery.first()

    if (!comision) {
      comision = new Comision()
      comision.esConfig = true
      comision.captacionDateoId = null
      comision.asesorId = asesorId
      comision.convenioId = null
      comision.tipoServicio = 'OTRO'
      ;(comision as any).tipoVehiculo = tipoVehiculo
      comision.porcentaje = '0'
      comision.estado = 'PENDIENTE'
      comision.fechaCalculo = DateTime.now()
      comision.metaRtm = 0
      comision.porcentajeComisionMeta = '0'
      comision.valorRtmMoto = 0
      comision.valorRtmVehiculo = 0
    }

    comision.base = String(valorPlaca)
    comision.monto = String(valorDateo)
    comision.valorNuevoDirecto = String(valorNuevoDirecto)
    comision.valorPlacaVehiculo = valorPlacaVehiculo !== null ? String(valorPlacaVehiculo) : null
    comision.valorPlacaMoto = valorPlacaMoto !== null ? String(valorPlacaMoto) : null

    if (payload.meta_rtm !== undefined) comision.metaRtm = Math.max(0, toNumber(payload.meta_rtm))
    if (payload.porcentaje_comision_meta !== undefined)
      comision.porcentajeComisionMeta = String(
        Math.max(0, toNumber(payload.porcentaje_comision_meta))
      )

    await comision.save()
    return response.ok(mapConfigToDto(comision))
  }

  /**
   * PATCH /api/comisiones/config/:id
   */
  public async configsUpdate({ params, request, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision || !comision.esConfig)
      return response.notFound({ message: 'Configuración no encontrada' })

    const payload = request.only([
      'asesor_id',
      'tipo_vehiculo',
      'valor_placa',
      'valor_placa_vehiculo',
      'valor_placa_moto',
      'valor_dateo',
      'valor_nuevo_directo',
      'meta_rtm',
      'porcentaje_comision_meta',
    ])

    if (payload.asesor_id !== undefined)
      comision.asesorId = payload.asesor_id ? Number(payload.asesor_id) : null

    if (payload.tipo_vehiculo) {
      const tipoVehiculo = String(payload.tipo_vehiculo).toUpperCase()
      if (!['MOTO', 'VEHICULO'].includes(tipoVehiculo))
        return response.badRequest({ message: 'tipo_vehiculo inválido (MOTO o VEHICULO)' })
      ;(comision as any).tipoVehiculo = tipoVehiculo
    }

    if (payload.valor_placa !== undefined)
      comision.base = String(Math.max(0, toNumber(payload.valor_placa)))

    if (payload.valor_dateo !== undefined)
      comision.monto = String(Math.max(0, toNumber(payload.valor_dateo)))

    if (payload.valor_nuevo_directo !== undefined)
      comision.valorNuevoDirecto = String(Math.max(0, toNumber(payload.valor_nuevo_directo)))

    if (payload.valor_placa_vehiculo !== undefined) {
      const v = parseNullable(payload.valor_placa_vehiculo)
      comision.valorPlacaVehiculo = v !== null ? String(v) : null
    }

    if (payload.valor_placa_moto !== undefined) {
      const v = parseNullable(payload.valor_placa_moto)
      comision.valorPlacaMoto = v !== null ? String(v) : null
    }

    if (payload.meta_rtm !== undefined) comision.metaRtm = Math.max(0, toNumber(payload.meta_rtm))

    if (payload.porcentaje_comision_meta !== undefined)
      comision.porcentajeComisionMeta = String(
        Math.max(0, toNumber(payload.porcentaje_comision_meta))
      )

    await comision.save()
    return response.ok(mapConfigToDto(comision))
  }

  /**
   * DELETE /api/comisiones/config/:id
   */
  public async configsDestroy({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision || !comision.esConfig)
      return response.notFound({ message: 'Configuración no encontrada' })

    await comision.delete()
    return response.ok({ message: 'Configuración eliminada correctamente' })
  }

  /* ============================================================
   *          METAS MENSUALES
   * ============================================================*/

  public async metasIndex({ request, response }: HttpContext) {
    const asesorId = request.input('asesorId') as number | undefined
    const tipoVehiculo = request.input('tipoVehiculo') as string | undefined

    const q = Comision.query().where('es_config', true).where('meta_rtm', '>', 0)
    if (asesorId) q.where('asesor_id', asesorId)
    if (tipoVehiculo) q.where('tipo_vehiculo', tipoVehiculo)
    q.orderBy('asesor_id', 'asc').orderBy('tipo_vehiculo', 'asc')

    const rows = await q
    return response.ok({ data: rows.map((c) => mapMetaToDto(c)) })
  }

  public async metasUpsert({ request, response }: HttpContext) {
    const payload = request.only([
      'asesor_id',
      'tipo_vehiculo',
      'meta_mensual',
      'porcentaje_extra',
      'valor_rtm_moto',
      'valor_rtm_vehiculo',
    ])

    const asesorIdRaw = payload.asesor_id
    const asesorId = asesorIdRaw ? Number(asesorIdRaw) : null

    const rawTipo = payload.tipo_vehiculo
    let tipoVehiculo: string | null = null
    if (rawTipo !== undefined && rawTipo !== null && String(rawTipo).trim() !== '') {
      const tv = String(rawTipo).toUpperCase()
      if (!['MOTO', 'VEHICULO'].includes(tv))
        return response.badRequest({
          message: 'tipo_vehiculo inválido (MOTO o VEHICULO o vacío para Global)',
        })
      tipoVehiculo = tv
    }

    const metaMensual = Math.max(0, toNumber(payload.meta_mensual))
    const porcentajeExtra = Math.max(0, toNumber(payload.porcentaje_extra))
    const valorRtmMoto = Math.max(0, toNumber(payload.valor_rtm_moto))
    const valorRtmVehiculo = Math.max(0, toNumber(payload.valor_rtm_vehiculo))

    const existingQuery = Comision.query().where('es_config', true)
    if (tipoVehiculo === null) existingQuery.whereNull('tipo_vehiculo')
    else existingQuery.where('tipo_vehiculo', tipoVehiculo)
    if (asesorId === null) existingQuery.whereNull('asesor_id')
    else existingQuery.where('asesor_id', asesorId)

    let comision = await existingQuery.first()

    if (!comision) {
      comision = new Comision()
      comision.esConfig = true
      comision.captacionDateoId = null
      comision.asesorId = asesorId
      comision.convenioId = null
      comision.tipoServicio = 'OTRO'
      ;(comision as any).tipoVehiculo = tipoVehiculo
      comision.base = '0'
      comision.monto = '0'
      comision.valorNuevoDirecto = '0'
      comision.valorPlacaVehiculo = null
      comision.valorPlacaMoto = null
      comision.porcentaje = '0'
      comision.estado = 'PENDIENTE'
      comision.fechaCalculo = DateTime.now()
      comision.metaRtm = 0
      comision.porcentajeComisionMeta = '0'
      comision.valorRtmMoto = 0
      comision.valorRtmVehiculo = 0
    }

    comision.metaRtm = metaMensual
    comision.porcentajeComisionMeta = String(porcentajeExtra)
    comision.valorRtmMoto = valorRtmMoto
    comision.valorRtmVehiculo = valorRtmVehiculo

    await comision.save()
    return response.ok(mapMetaToDto(comision))
  }

  public async metasUpdate({ params, request, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision || !comision.esConfig)
      return response.notFound({ message: 'Meta mensual no encontrada' })

    const payload = request.only([
      'asesor_id',
      'tipo_vehiculo',
      'meta_mensual',
      'porcentaje_extra',
      'valor_rtm_moto',
      'valor_rtm_vehiculo',
    ])

    if (payload.asesor_id !== undefined)
      comision.asesorId = payload.asesor_id ? Number(payload.asesor_id) : null

    if (payload.tipo_vehiculo !== undefined) {
      const rawTipo = payload.tipo_vehiculo
      if (rawTipo === null || String(rawTipo).trim() === '') {
        ;(comision as any).tipoVehiculo = null
      } else {
        const tv = String(rawTipo).toUpperCase()
        if (!['MOTO', 'VEHICULO'].includes(tv))
          return response.badRequest({
            message: 'tipo_vehiculo inválido (MOTO o VEHICULO o vacío para Global)',
          })
        ;(comision as any).tipoVehiculo = tv
      }
    }

    if (payload.meta_mensual !== undefined)
      comision.metaRtm = Math.max(0, toNumber(payload.meta_mensual))
    if (payload.porcentaje_extra !== undefined)
      comision.porcentajeComisionMeta = String(Math.max(0, toNumber(payload.porcentaje_extra)))
    if (payload.valor_rtm_moto !== undefined)
      comision.valorRtmMoto = Math.max(0, toNumber(payload.valor_rtm_moto))
    if (payload.valor_rtm_vehiculo !== undefined)
      comision.valorRtmVehiculo = Math.max(0, toNumber(payload.valor_rtm_vehiculo))

    await comision.save()
    return response.ok(mapMetaToDto(comision))
  }

  public async metasDestroy({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision || !comision.esConfig)
      return response.notFound({ message: 'Meta mensual no encontrada' })
    await comision.delete()
    return response.ok({ success: true })
  }

  /* ============================================================
   *   CONFIGURACIÓN DE RECURRENCIAS
   * ============================================================*/

  public async recurrenciaConfigGlobalGet({ response }: HttpContext) {
    const { default: ConfiguracionRecurrenciaGlobal } = await import(
      '#models/configuracion_recurrencia_global'
    )

    let config = await ConfiguracionRecurrenciaGlobal.query().first()
    if (!config) {
      config = await ConfiguracionRecurrenciaGlobal.create({
        mesesMinimos: 24,
        valorDateoRecurrencia: 4300,
        valorDateoRecuperacion: 8600,
      } as any)
    }

    return response.ok({
      meses_minimos: config.mesesMinimos,
      valor_dateo_recurrencia: config.valorDateoRecurrencia,
      valor_dateo_recuperacion: config.valorDateoRecuperacion ?? 8600,
      valor_dateo_recurrencia_vehiculo: (config as any).valorDateoRecurrenciaVehiculo ?? null,
      valor_dateo_recurrencia_moto: (config as any).valorDateoRecurrenciaMoto ?? null,
      valor_dateo_recuperacion_vehiculo: (config as any).valorDateoRecuperacionVehiculo ?? null,
      valor_dateo_recuperacion_moto: (config as any).valorDateoRecuperacionMoto ?? null,
    })
  }

  public async recurrenciaConfigGlobalUpsert({ request, response }: HttpContext) {
    const { default: ConfiguracionRecurrenciaGlobal } = await import(
      '#models/configuracion_recurrencia_global'
    )

    const payload = request.only([
      'meses_minimos',
      'valor_dateo_recurrencia',
      'valor_dateo_recuperacion',
      'valor_dateo_recurrencia_vehiculo',
      'valor_dateo_recurrencia_moto',
      'valor_dateo_recuperacion_vehiculo',
      'valor_dateo_recuperacion_moto',
    ])

    const mesesMinimos = Math.max(1, toNumber(payload.meses_minimos))
    const valorDateoRecurrencia = Math.max(0, toNumber(payload.valor_dateo_recurrencia))
    const valorDateoRecuperacion = Math.max(0, toNumber(payload.valor_dateo_recuperacion ?? 8600))

    const valorDateoRecurrenciaVehiculo = parseNullable(payload.valor_dateo_recurrencia_vehiculo)
    const valorDateoRecurrenciaMoto = parseNullable(payload.valor_dateo_recurrencia_moto)
    const valorDateoRecuperacionVehiculo = parseNullable(payload.valor_dateo_recuperacion_vehiculo)
    const valorDateoRecuperacionMoto = parseNullable(payload.valor_dateo_recuperacion_moto)

    let config = await ConfiguracionRecurrenciaGlobal.query().first()

    if (!config) {
      config = await ConfiguracionRecurrenciaGlobal.create({
        mesesMinimos,
        valorDateoRecurrencia,
        valorDateoRecuperacion,
        valorDateoRecurrenciaVehiculo,
        valorDateoRecurrenciaMoto,
        valorDateoRecuperacionVehiculo,
        valorDateoRecuperacionMoto,
      } as any)
    } else {
      config.mesesMinimos = mesesMinimos
      config.valorDateoRecurrencia = valorDateoRecurrencia
      config.valorDateoRecuperacion = valorDateoRecuperacion
      config.valorDateoRecurrenciaVehiculo = valorDateoRecurrenciaVehiculo
      config.valorDateoRecurrenciaMoto = valorDateoRecurrenciaMoto
      config.valorDateoRecuperacionVehiculo = valorDateoRecuperacionVehiculo
      config.valorDateoRecuperacionMoto = valorDateoRecuperacionMoto
      await config.save()
    }

    return response.ok({
      meses_minimos: config.mesesMinimos,
      valor_dateo_recurrencia: config.valorDateoRecurrencia,
      valor_dateo_recuperacion: config.valorDateoRecuperacion,
      valor_dateo_recurrencia_vehiculo: (config as any).valorDateoRecurrenciaVehiculo ?? null,
      valor_dateo_recurrencia_moto: (config as any).valorDateoRecurrenciaMoto ?? null,
      valor_dateo_recuperacion_vehiculo: (config as any).valorDateoRecuperacionVehiculo ?? null,
      valor_dateo_recuperacion_moto: (config as any).valorDateoRecuperacionMoto ?? null,
    })
  }

  public async recurrenciaConfigAsesoresIndex({ request, response }: HttpContext) {
    const { default: ConfiguracionRecurrenciaAsesor } = await import(
      '#models/configuracion_recurrencia_asesor'
    )

    const asesorId = request.input('asesorId') as number | undefined
    const query = ConfiguracionRecurrenciaAsesor.query().preload('asesor')
    if (asesorId) query.where('asesor_id', asesorId)

    const configs = await query
    const data = configs.map((c) => {
      const asesor = (c as any).$preloaded?.asesor || null
      return {
        id: c.id,
        asesor_id: c.asesorId,
        asesor_nombre: asesor ? asesor.nombre : null,
        recurrencia_habilitada: c.recurrenciaHabilitada,
        meses_minimos: c.mesesMinimos,
        valor_dateo_recurrencia: c.valorDateoRecurrencia,
        valor_dateo_recuperacion: c.valorDateoRecuperacion,
        tipo_vehiculo: c.tipoVehiculo,
      }
    })

    return response.ok({ data })
  }

  public async recurrenciaConfigAsesoresUpsert({ request, response }: HttpContext) {
    const { default: ConfiguracionRecurrenciaAsesor } = await import(
      '#models/configuracion_recurrencia_asesor'
    )

    const payload = request.only([
      'asesor_id',
      'recurrencia_habilitada',
      'meses_minimos',
      'valor_dateo_recurrencia',
      'valor_dateo_recuperacion',
      'tipo_vehiculo',
    ])

    const asesorId = Number(payload.asesor_id)
    if (!asesorId) return response.badRequest({ message: 'asesor_id es requerido' })

    const recurrenciaHabilitada = Boolean(payload.recurrencia_habilitada)
    const mesesMinimos =
      payload.meses_minimos !== null ? Math.max(1, toNumber(payload.meses_minimos)) : null
    const valorDateoRecurrencia =
      payload.valor_dateo_recurrencia !== null
        ? Math.max(0, toNumber(payload.valor_dateo_recurrencia))
        : null
    const valorDateoRecuperacion =
      payload.valor_dateo_recuperacion !== null
        ? Math.max(0, toNumber(payload.valor_dateo_recuperacion))
        : null
    const tipoVehiculo = String(payload.tipo_vehiculo || 'AMBOS').toUpperCase()
    if (!['MOTO', 'VEHICULO', 'AMBOS'].includes(tipoVehiculo))
      return response.badRequest({ message: 'tipo_vehiculo debe ser MOTO, VEHICULO o AMBOS' })

    let config = await ConfiguracionRecurrenciaAsesor.query()
      .where('asesor_id', asesorId)
      .where('tipo_vehiculo', tipoVehiculo as any)
      .first()

    if (!config) {
      config = await ConfiguracionRecurrenciaAsesor.create({
        asesorId,
        recurrenciaHabilitada,
        mesesMinimos,
        valorDateoRecurrencia,
        valorDateoRecuperacion,
        tipoVehiculo: tipoVehiculo as any,
      })
    } else {
      config.recurrenciaHabilitada = recurrenciaHabilitada
      config.mesesMinimos = mesesMinimos
      config.valorDateoRecurrencia = valorDateoRecurrencia
      config.valorDateoRecuperacion = valorDateoRecuperacion
      await config.save()
    }

    await config.load('asesor')
    const asesor = (config as any).$preloaded?.asesor || null

    return response.ok({
      id: config.id,
      asesor_id: config.asesorId,
      asesor_nombre: asesor ? asesor.nombre : null,
      recurrencia_habilitada: config.recurrenciaHabilitada,
      meses_minimos: config.mesesMinimos,
      valor_dateo_recurrencia: config.valorDateoRecurrencia,
      valor_dateo_recuperacion: config.valorDateoRecuperacion,
      tipo_vehiculo: config.tipoVehiculo,
    })
  }

  public async recurrenciaConfigAsesoresDelete({ params, response }: HttpContext) {
    const { default: ConfiguracionRecurrenciaAsesor } = await import(
      '#models/configuracion_recurrencia_asesor'
    )

    const config = await ConfiguracionRecurrenciaAsesor.find(params.id)
    if (!config) return response.notFound({ message: 'Configuración no encontrada' })

    await config.delete()
    return response.ok({ message: 'Configuración eliminada correctamente' })
  }
}
