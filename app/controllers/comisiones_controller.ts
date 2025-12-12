// app/controllers/comisiones_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Database from '@adonisjs/lucid/services/db'

import Comision from '#models/comision'
import AgenteCaptacion from '#models/agente_captacion'

// app/controllers/comisiones_controller.ts
// REEMPLAZA la función mapComisionToDto (aproximadamente línea 50-120)

/* ========= Helpers ========= */
function toNumber(v: any): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

/**
 * Mapea una comision REAL (es_config = false) a DTO de lista/detalle
 * AHORA con desglose interno para mostrar distribución de pagos
 */
function mapComisionToDto(c: Comision) {
  const anyC: any = c

  const dateo = anyC.$preloaded?.dateo || null
  const turno = dateo?.$preloaded?.turno || null
  const servicio = turno?.$preloaded?.servicio || null

  // 💸 Valores principales (compatibilidad con UI antigua)
  const valorAsesor = toNumber(c.monto) // dateo
  const valorCliente = toNumber(c.base) // placa
  const valorTotal = valorAsesor + valorCliente

  // 💰 DESGLOSE DETALLADO (NUEVO)
  const montoAsesorComercial = c.montoAsesor ? toNumber(c.montoAsesor) : null
  const montoConvenioPlaca = c.montoConvenio ? toNumber(c.montoConvenio) : null
  const asesorSecundario = anyC.$preloaded?.asesorSecundario || null

  // Determinar si hay desglose
  const tieneDesglose = montoAsesorComercial !== null || montoConvenioPlaca !== null

  // Turnos: global y por servicio
  const numeroGlobal = turno?.numeroGlobal ?? turno?.turnoNumero ?? turno?.numero ?? turno?.id

  const numeroServicio =
    turno?.numeroServicio ??
    turno?.numero_servicio ??
    turno?.turnoNumeroServicio ??
    turno?.turno_numero_servicio ??
    turno?.numeroPorServicio ??
    null

  return {
    id: c.id,
    dateo_id: c.captacionDateoId,
    estado: c.estado,
    cantidad: 1,

    // 👇 Valores tradicionales (para compatibilidad)
    valor_unitario: valorAsesor, // dateo
    valor_cliente: valorCliente, // placa
    valor_total: valorTotal,
    generado_at: c.fechaCalculo ? c.fechaCalculo.toISO() : null,

    // 💰 DESGLOSE DETALLADO (para mostrar en modal)
    tiene_desglose: tieneDesglose,
    desglose: tieneDesglose
      ? {
          monto_asesor_comercial: montoAsesorComercial, // Lo que cobra el comercial
          monto_convenio_placa: montoConvenioPlaca, // Lo que cobra el convenio
          asesor_secundario: asesorSecundario
            ? {
                id: asesorSecundario.id,
                nombre: asesorSecundario.nombre,
                tipo: asesorSecundario.tipo,
              }
            : null,
        }
      : null,

    // Asesor principal
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
        }
      : null,
  }
}

/**
 * Mapea una FILA DE CONFIGURACIÓN (es_config = true) a DTO
 * para la vista de parámetros de comisiones (reglas de placa/dateo).
 */
function mapConfigToDto(c: Comision) {
  return {
    id: c.id,
    es_config: true,
    asesor_id: c.asesorId ?? null,
    tipo_vehiculo: (c as any).tipoVehiculo ?? null,
    // base = comisión por placa
    valor_placa: toNumber(c.base),
    // monto = comisión por dateo
    valor_dateo: toNumber(c.monto),
    // metas / % meta (solo tiene sentido en configs de meta, pero no estorba aquí)
    meta_rtm: c.metaRtm ?? 0,
    porcentaje_comision_meta: toNumber(c.porcentajeComisionMeta ?? 0),
    fecha_calculo: c.fechaCalculo ? c.fechaCalculo.toISO() : null,
  }
}

/**
 * Mapea una fila de CONFIG (es_config = true) vista como "meta mensual"
 */
function mapMetaToDto(c: Comision) {
  return {
    id: c.id,
    asesor_id: c.asesorId,
    tipo_vehiculo: (c as any).tipoVehiculo ?? null,
    // meta mensual de RTM (cantidad)
    meta_mensual: c.metaRtm ?? 0,
    // % extra de comisión si cumple la meta
    porcentaje_extra: toNumber(c.porcentajeComisionMeta ?? 0),
    // valores de referencia de RTM (moto / vehículo)
    valor_rtm_moto: c.valorRtmMoto ?? 0,
    valor_rtm_vehiculo: c.valorRtmVehiculo ?? 0,
    fecha_actualizacion: c.updatedAt?.toISO() ?? c.createdAt?.toISO() ?? null,
  }
}

export default class ComisionesController {
  // app/controllers/comisiones_controller.ts
  // REEMPLAZA el método index() (aproximadamente línea 130-200)

  /**
   * GET /api/comisiones
   * Lista comisiones (SOLO reales, es_config = false / null) con filtros
   */
  public async index({ request, response }: HttpContext) {
    const page = Number(request.input('page') || 1)
    const perPage = Math.min(Number(request.input('perPage') || 10), 100)
    const mes = request.input('mes') as string | undefined // "YYYY-MM"
    const asesorId = request.input('asesorId') as number | undefined
    const convenioId = request.input('convenioId') as number | undefined
    const estado = request.input('estado') as string | undefined
    const sortBy = (request.input('sortBy') || 'id') as string
    const order = (request.input('order') || 'desc') as 'asc' | 'desc'

    const query = Comision.query()
      // 👇 comisiones reales: es_config = false O NULL
      .where((q) => {
        q.where('es_config', false).orWhereNull('es_config')
      })
      .preload('asesor')
      .preload('convenio')
      .preload('asesorSecundario') // 👈 NUEVO: preload del asesor secundario
      .preload('dateo', (dq) => {
        dq.preload('turno', (tq) => {
          tq.preload('servicio')
        })
      })

    // Filtro por mes (año-mes)
    if (mes && /^\d{4}-\d{2}$/.test(mes)) {
      const [year, month] = mes.split('-').map(Number)
      const start = DateTime.fromObject({ year, month, day: 1 }).startOf('day').toSQL()
      const end = DateTime.fromObject({ year, month, day: 1 }).endOf('month').toSQL()
      if (start && end) {
        query.whereBetween('fecha_calculo', [start, end])
      }
    }

    // Filtro por asesor
    if (asesorId) {
      query.where('asesor_id', asesorId)
    }

    // Filtro por convenio
    if (convenioId) {
      query.where('convenio_id', convenioId)
    }

    // Filtro por estado
    if (estado) query.where('estado', estado)

    // Ordenamiento
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
   * Resumen mensual por asesor:
   *  - rtm_motos
   *  - rtm_vehiculos
   *  - meta_global_rtm
   *  - porcentaje_comision_meta
   *
   * 🔥 CORRECCIÓN: Solo muestra metas para asesores con configuración específica
   * YA NO usa una "meta global" como fallback para todos los asesores
   */
  public async metasMensuales({ request, response }: HttpContext) {
    const mes = request.input('mes') as string | undefined // "YYYY-MM"
    const asesorIdParam = request.input('asesorId') as number | string | undefined

    // Mes a usar (por defecto, mes actual)
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

    // 1️⃣ Agregamos RTM por asesor (motos / vehículos)
    const baseQ = Database.from('comisiones')
      .where((q) => {
        q.where('es_config', false).orWhereNull('es_config')
      })
      .andWhere('tipo_servicio', 'RTM')
      .whereIn('estado', ['PENDIENTE', 'APROBADA', 'PAGADA'])
      .whereNotNull('asesor_id')

    if (start && end) {
      baseQ.whereBetween('fecha_calculo', [start, end])
    }

    if (asesorId) {
      baseQ.andWhere('asesor_id', asesorId)
    }

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

    // 2️⃣ Configs de meta (es_config = true, meta_rtm > 0)
    const cfgRows = await Comision.query().where('es_config', true).where('meta_rtm', '>', 0)

    // 🔥 CAMBIO: Ya NO usamos cfgGlobal - solo metas específicas por asesor
    const cfgByAsesor = new Map<number, Comision>()

    for (const c of cfgRows) {
      // Solo guardamos metas con asesor_id específico
      if (c.asesorId !== null) {
        cfgByAsesor.set(c.asesorId, c)
      }
      // Si asesor_id es null, la ignoramos (no aplica a todos)
    }

    // 🎯 CORRECCIÓN: Solo mostrar asesores que tienen meta ESPECÍFICA configurada
    // Si se solicita un asesor específico, incluirlo aunque no tenga meta
    const allIds = new Set<number>()

    if (asesorId) {
      // Si se pide un asesor específico, incluirlo siempre
      allIds.add(asesorId)
    } else {
      // Si no, solo mostrar asesores con RTM o con meta específica
      countsByAsesor.forEach((_v, id) => allIds.add(id))
      cfgByAsesor.forEach((_v, id) => allIds.add(id))
    }

    const asesorIds = Array.from(allIds)
    const asesoresMap = new Map<number, { nombre: string; tipo: string | null }>()

    if (asesorIds.length > 0) {
      const asesores = await AgenteCaptacion.query().whereIn('id', asesorIds)
      for (const a of asesores) {
        asesoresMap.set(a.id, {
          nombre: a.nombre,
          tipo: (a as any).tipo ?? null,
        })
      }
    }

    const rows = asesorIds.map((id) => {
      const counts = countsByAsesor.get(id) ?? { rtm_motos: 0, rtm_vehiculos: 0 }

      // 🔥 CORRECCIÓN: Solo usar meta específica del asesor, NO global
      const cfg = cfgByAsesor.get(id) ?? null // 👈 YA NO USA cfgGlobal

      const metaRtm = cfg ? (cfg.metaRtm ?? 0) : 0
      const pctMeta = cfg ? toNumber(cfg.porcentajeComisionMeta ?? 0) : 0

      // 💵 Valores unitarios de referencia para RTM
      // Si no hay cfg específico, usar valores por defecto
      const valorRtmMoto = cfg ? (cfg.valorRtmMoto ?? 126100) : 126100
      const valorRtmVehiculo = cfg ? (cfg.valorRtmVehiculo ?? 208738) : 208738

      // 📈 Facturación real estimada según las unidades y los valores de RTM
      const totalFacturacionMotos = counts.rtm_motos * valorRtmMoto
      const totalFacturacionVehiculos = counts.rtm_vehiculos * valorRtmVehiculo
      const totalFacturacionGlobal = totalFacturacionMotos + totalFacturacionVehiculos

      const info = asesoresMap.get(id)

      return {
        asesor_id: id,
        asesor_nombre: info?.nombre ?? '—',
        asesor_tipo: info?.tipo ?? null,

        // Cantidades
        rtm_motos: counts.rtm_motos,
        rtm_vehiculos: counts.rtm_vehiculos,
        total_rtm_motos: counts.rtm_motos,
        total_rtm_vehiculos: counts.rtm_vehiculos,

        // Meta y % meta (en cantidad) - será 0 si no tiene cfg
        meta_global_rtm: metaRtm,
        porcentaje_comision_meta: pctMeta,

        // Valores unitarios configurados para RTM
        valor_rtm_moto: valorRtmMoto,
        valor_rtm_vehiculo: valorRtmVehiculo,

        // Facturación calculada
        total_facturacion_motos: totalFacturacionMotos,
        total_facturacion_vehiculos: totalFacturacionVehiculos,
        total_facturacion_global: totalFacturacionGlobal,
      }
    })

    return response.ok({ data: rows })
  }

  // app/controllers/comisiones_controller.ts
  // REEMPLAZA el método show() (aproximadamente línea 210-250)

  /**
   * GET /api/comisiones/:id
   * Detalle de una comisión REAL con todas sus relaciones
   */
  public async show({ params, response }: HttpContext) {
    const comision = await Comision.query()
      .where('id', params.id)
      .where((q) => {
        q.where('es_config', false).orWhereNull('es_config')
      })
      .preload('asesor')
      .preload('convenio')
      .preload('asesorSecundario') // 👈 NUEVO
      .preload('dateo', (dq) => {
        dq.preload('turno', (tq) => {
          tq.preload('servicio')
        })
      })
      .first()

    if (!comision) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    const dto = mapComisionToDto(comision)

    // Extendemos con campos de detalle
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
   * Actualiza cantidad y valor_unitario (solo si estado = PENDIENTE y no es config)
   * Aquí asumimos que se está editando el valor del ASESOR (monto).
   */
  public async actualizarValores({ params, request, response }: HttpContext) {
    const comision = await Comision.find(params.id)

    if (!comision || comision.esConfig) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    if (comision.estado !== 'PENDIENTE') {
      return response.badRequest({
        message: 'Solo se pueden editar comisiones en estado PENDIENTE',
      })
    }

    // ✅ Extraer y renombrar
    const { cantidad, valor_unitario: valorUnitario } = request.only(['cantidad', 'valor_unitario'])
    const cant = toNumber(cantidad || 1)
    const vu = toNumber(valorUnitario || 0) // ✅ Usar variable renombrada

    // Recalcular monto (asesor)
    comision.monto = String(cant * vu)
    await comision.save()

    // reutilizamos show para devolver el DTO actualizado
    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/aprobar
   * Cambia estado a APROBADA (solo comisiones reales)
   */
  public async aprobar({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)

    if (!comision || comision.esConfig) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    if (comision.estado !== 'PENDIENTE') {
      return response.badRequest({
        message: 'Solo se pueden aprobar comisiones PENDIENTES',
      })
    }

    comision.estado = 'APROBADA'
    await comision.save()

    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/pagar
   * Cambia estado a PAGADA (solo comisiones reales)
   */
  public async pagar({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)

    if (!comision || comision.esConfig) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    if (comision.estado !== 'APROBADA') {
      return response.badRequest({
        message: 'Solo se pueden pagar comisiones APROBADAS',
      })
    }

    comision.estado = 'PAGADA'
    await comision.save()

    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/anular
   * Cambia estado a ANULADA (solo comisiones reales)
   */
  public async anular({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)

    if (!comision || comision.esConfig) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    if (comision.estado === 'PAGADA') {
      return response.badRequest({
        message: 'No se pueden anular comisiones PAGADAS',
      })
    }

    comision.estado = 'ANULADA'
    await comision.save()

    return this.show({ params, response } as any)
  }

  /* ============================================================
   *          CONFIGURACIONES DE COMISIONES (es_config = true)
   * ============================================================*/

  /**
   * GET /api/comisiones/config
   * Lista las reglas de configuración (es_config = true)
   * Filtros opcionales:
   *  - asesorId
   *  - tipoVehiculo ('MOTO' | 'VEHICULO')
   */
  public async configsIndex({ request, response }: HttpContext) {
    const asesorId = request.input('asesorId') as number | undefined
    const tipoVehiculo = request.input('tipoVehiculo') as string | undefined

    const query = Comision.query().where('es_config', true)

    if (asesorId) {
      query.where('asesor_id', asesorId)
    }

    if (tipoVehiculo) {
      query.where('tipo_vehiculo', tipoVehiculo)
    }

    query.orderBy('asesor_id', 'asc').orderBy('tipo_vehiculo', 'asc')

    const result = await query

    const rows = result.map((c) => mapConfigToDto(c))

    return response.ok({ data: rows })
  }

  /**
   * POST /api/comisiones/config
   * Crea o actualiza (UPSERT) una regla de comisión:
   *  - combinación (asesor_id, tipo_vehiculo)
   *
   * (Reglas de comisión por placa/dateo, NO metas mensuales)
   */
  public async configsUpsert({ request, response }: HttpContext) {
    const payload = request.only([
      'asesor_id',
      'tipo_vehiculo',
      'valor_placa',
      'valor_dateo',
      'meta_rtm',
      'porcentaje_comision_meta',
    ])

    const asesorIdRaw = payload.asesor_id
    const asesorId = asesorIdRaw ? Number(asesorIdRaw) : null
    const tipoVehiculo = (payload.tipo_vehiculo || '').toUpperCase()

    if (!['MOTO', 'VEHICULO'].includes(tipoVehiculo)) {
      return response.badRequest({ message: 'tipo_vehiculo inválido (MOTO o VEHICULO)' })
    }

    const valorPlaca = Math.max(0, toNumber(payload.valor_placa))
    const valorDateo = Math.max(0, toNumber(payload.valor_dateo))

    // Buscar si ya existe una regla para (asesorId, tipoVehiculo)
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
      comision.tipoServicio = 'OTRO' // para reglas no depende del servicio
      ;(comision as any).tipoVehiculo = tipoVehiculo
      comision.porcentaje = '0'
      comision.estado = 'PENDIENTE'
      comision.fechaCalculo = DateTime.now()
      comision.metaRtm = 0
      comision.porcentajeComisionMeta = '0'
      // valores RTM no aplican aquí, se quedan en 0
      comision.valorRtmMoto = 0
      comision.valorRtmVehiculo = 0
    }

    comision.base = String(valorPlaca) // placa
    comision.monto = String(valorDateo) // dateo

    // Meta y % de comisión de meta (si vienen)
    if (payload.meta_rtm !== undefined) {
      comision.metaRtm = Math.max(0, toNumber(payload.meta_rtm))
    }
    if (payload.porcentaje_comision_meta !== undefined) {
      comision.porcentajeComisionMeta = String(
        Math.max(0, toNumber(payload.porcentaje_comision_meta))
      )
    }

    await comision.save()

    return response.ok(mapConfigToDto(comision))
  }

  /**
   * PATCH /api/comisiones/config/:id
   * Edita una regla existente (solo es_config = true)
   */
  public async configsUpdate({ params, request, response }: HttpContext) {
    const comision = await Comision.find(params.id)

    if (!comision || !comision.esConfig) {
      return response.notFound({ message: 'Configuración no encontrada' })
    }

    const payload = request.only([
      'asesor_id',
      'tipo_vehiculo',
      'valor_placa',
      'valor_dateo',
      'meta_rtm',
      'porcentaje_comision_meta',
    ])

    if (payload.asesor_id !== undefined) {
      const asesorIdRaw = payload.asesor_id
      comision.asesorId = asesorIdRaw ? Number(asesorIdRaw) : null
    }

    if (payload.tipo_vehiculo) {
      const tipoVehiculo = String(payload.tipo_vehiculo).toUpperCase()
      if (!['MOTO', 'VEHICULO'].includes(tipoVehiculo)) {
        return response.badRequest({ message: 'tipo_vehiculo inválido (MOTO o VEHICULO)' })
      }
      ;(comision as any).tipoVehiculo = tipoVehiculo
    }

    if (payload.valor_placa !== undefined) {
      comision.base = String(Math.max(0, toNumber(payload.valor_placa)))
    }

    if (payload.valor_dateo !== undefined) {
      comision.monto = String(Math.max(0, toNumber(payload.valor_dateo)))
    }

    if (payload.meta_rtm !== undefined) {
      comision.metaRtm = Math.max(0, toNumber(payload.meta_rtm))
    }

    if (payload.porcentaje_comision_meta !== undefined) {
      comision.porcentajeComisionMeta = String(
        Math.max(0, toNumber(payload.porcentaje_comision_meta))
      )
    }

    await comision.save()

    return response.ok(mapConfigToDto(comision))
  }

  /**
   * DELETE /api/comisiones/config/:id
   * Elimina una regla de configuración (solo es_config = true)
   */
  public async configsDestroy({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)

    if (!comision || !comision.esConfig) {
      return response.notFound({ message: 'Configuración no encontrada' })
    }

    await comision.delete()

    return response.ok({ message: 'Configuración eliminada correctamente' })
  }

  /* ============================================================
   *          NUEVA SECCIÓN: CRUD DE METAS MENSUALES
   *          usando la MISMA tabla comisiones (es_config = true)
   * ============================================================*/

  /**
   * GET /api/comisiones/metas
   * Lista metas mensuales configuradas.
   * Filtros opcionales:
   *  - asesorId
   *  - tipoVehiculo ('MOTO' | 'VEHICULO' | null para global)
   *
   * Usa:
   *  - meta_rtm                 → meta_mensual
   *  - porcentaje_comision_meta → porcentaje_extra
   *  - valor_rtm_moto           → valor_rtm_moto
   *  - valor_rtm_vehiculo       → valor_rtm_vehiculo
   */
  public async metasIndex({ request, response }: HttpContext) {
    const asesorId = request.input('asesorId') as number | undefined
    const tipoVehiculo = request.input('tipoVehiculo') as string | undefined

    const q = Comision.query().where('es_config', true).where('meta_rtm', '>', 0)

    if (asesorId) {
      q.where('asesor_id', asesorId)
    }

    if (tipoVehiculo) {
      q.where('tipo_vehiculo', tipoVehiculo)
    }

    q.orderBy('asesor_id', 'asc').orderBy('tipo_vehiculo', 'asc')

    const rows = await q

    return response.ok({
      data: rows.map((c) => mapMetaToDto(c)),
    })
  }

  /**
   * POST /api/comisiones/metas
   * Crea o actualiza (UPSERT) una meta mensual:
   *  combinación (asesor_id, tipo_vehiculo) en la MISMA tabla comisiones.
   *
   * Body esperado:
   *  - asesor_id
   *  - tipo_vehiculo ('MOTO' | 'VEHICULO' | null/'' para Global)
   *  - meta_mensual
   *  - porcentaje_extra
   *  - valor_rtm_moto
   *  - valor_rtm_vehiculo
   */
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
      if (!['MOTO', 'VEHICULO'].includes(tv)) {
        return response.badRequest({
          message: 'tipo_vehiculo inválido (MOTO o VEHICULO o vacío para Global)',
        })
      }
      tipoVehiculo = tv
    }

    const metaMensual = Math.max(0, toNumber(payload.meta_mensual))
    const porcentajeExtra = Math.max(0, toNumber(payload.porcentaje_extra))
    const valorRtmMoto = Math.max(0, toNumber(payload.valor_rtm_moto))
    const valorRtmVehiculo = Math.max(0, toNumber(payload.valor_rtm_vehiculo))

    const existingQuery = Comision.query().where('es_config', true)

    if (tipoVehiculo === null) {
      existingQuery.whereNull('tipo_vehiculo')
    } else {
      existingQuery.where('tipo_vehiculo', tipoVehiculo)
    }

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
      comision.base = '0'
      comision.monto = '0'
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

  /**
   * PATCH /api/comisiones/metas/:id
   * Actualiza una meta existente (fila es_config = true).
   */
  public async metasUpdate({ params, request, response }: HttpContext) {
    const comision = await Comision.find(params.id)

    if (!comision || !comision.esConfig) {
      return response.notFound({ message: 'Meta mensual no encontrada' })
    }

    const payload = request.only([
      'asesor_id',
      'tipo_vehiculo',
      'meta_mensual',
      'porcentaje_extra',
      'valor_rtm_moto',
      'valor_rtm_vehiculo',
    ])

    if (payload.asesor_id !== undefined) {
      const asesorIdRaw = payload.asesor_id
      comision.asesorId = asesorIdRaw ? Number(asesorIdRaw) : null
    }

    if (payload.tipo_vehiculo !== undefined) {
      const rawTipo = payload.tipo_vehiculo
      if (rawTipo === null || String(rawTipo).trim() === '') {
        // Global
        ;(comision as any).tipoVehiculo = null
      } else {
        const tv = String(rawTipo).toUpperCase()
        if (!['MOTO', 'VEHICULO'].includes(tv)) {
          return response.badRequest({
            message: 'tipo_vehiculo inválido (MOTO o VEHICULO o vacío para Global)',
          })
        }
        ;(comision as any).tipoVehiculo = tv
      }
    }

    if (payload.meta_mensual !== undefined) {
      comision.metaRtm = Math.max(0, toNumber(payload.meta_mensual))
    }

    if (payload.porcentaje_extra !== undefined) {
      comision.porcentajeComisionMeta = String(Math.max(0, toNumber(payload.porcentaje_extra)))
    }

    if (payload.valor_rtm_moto !== undefined) {
      comision.valorRtmMoto = Math.max(0, toNumber(payload.valor_rtm_moto))
    }

    if (payload.valor_rtm_vehiculo !== undefined) {
      comision.valorRtmVehiculo = Math.max(0, toNumber(payload.valor_rtm_vehiculo))
    }

    await comision.save()

    return response.ok(mapMetaToDto(comision))
  }

  /**
   * DELETE /api/comisiones/metas/:id
   * Elimina una meta mensual (fila de configuración).
   */
  public async metasDestroy({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision || !comision.esConfig) {
      return response.notFound({ message: 'Meta mensual no encontrada' })
    }

    await comision.delete()

    return response.ok({ success: true })
  }
}
