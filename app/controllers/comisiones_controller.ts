// app/controllers/comisiones_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Comision from '#models/comision'

/* ========= Helpers ========= */
function toNumber(v: any): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

/** 💰 reglas fijas por defecto:
 *  - sin convenio: 16.000 (placa)
 *  - con convenio: 20.000 (placa/convenio)
 *
 *  Si en BD (columna base) hay un valor > 0, se usa ese.
 */
const VALOR_PLACA_SIN_CONVENIO = 16000
const VALOR_PLACA_CON_CONVENIO = 20000

function calcularValorCliente(baseDb: any, convenioId: number | null) {
  const db = toNumber(baseDb)
  if (db > 0) return db
  // si no hay nada en BD, usamos las reglas fijas
  return convenioId ? VALOR_PLACA_CON_CONVENIO : VALOR_PLACA_SIN_CONVENIO
}

/**
 * Mapea una comision REAL (es_config = false) a DTO de lista/detalle
 */
function mapComisionToDto(c: Comision) {
  const anyC: any = c

  const dateo = anyC.$preloaded?.dateo || null
  const turno = dateo?.$preloaded?.turno || null
  const servicio = turno?.$preloaded?.servicio || null

  // 💸 comisión asesor (ya viene como 4.000 en BD)
  const valorAsesor = toNumber(c.monto)

  // 💰 comisión placa / cliente / convenio (16k / 20k si no hay base en BD)
  const valorCliente = calcularValorCliente(c.base, c.convenioId ?? null)

  const valorTotal = valorAsesor + valorCliente

  // Turnos: global y por servicio
  const numeroGlobal =
    turno?.numeroGlobal ??
    turno?.turnoNumero ??
    turno?.numero ??
    turno?.id

  const numeroServicio =
    turno?.numeroServicio ??
    turno?.numero_servicio ??
    turno?.turnoNumeroServicio ??
    turno?.turno_numero_servicio ??
    turno?.numeroPorServicio ??
    null

  return {
    id: c.id,
    // 🔗 para enlazar con captacion_dateos.id en el front
    dateo_id: c.captacionDateoId,

    estado: c.estado,
    cantidad: 1,

    // 👇 asesor
    valor_unitario: valorAsesor,
    // 👇 comisión placa (cliente / convenio)
    valor_cliente: valorCliente,
    valor_total: valorTotal,
    generado_at: c.fechaCalculo ? c.fechaCalculo.toISO() : null,

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
          fecha: turno.fecha || turno.createdAt,
          placa: turno.placa,
          servicio: servicio
            ? {
                id: servicio.id,
                codigo: servicio.codigoServicio,
                nombre: servicio.nombreServicio,
              }
            : null,
        }
      : null,
  }
}

/**
 * Mapea una FILA DE CONFIGURACIÓN (es_config = true) a DTO
 * para la vista de parámetros de comisiones.
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
    fecha_calculo: c.fechaCalculo ? c.fechaCalculo.toISO() : null,
  }
}

export default class ComisionesController {
  /**
   * GET /api/comisiones
   * Lista comisiones (SOLO reales, es_config = false / null) con filtros:
   * - mes (YYYY-MM)
   * - asesorId
   * - estado
   * - sortBy, order
   */
  public async index({ request, response }: HttpContext) {
    const page = Number(request.input('page') || 1)
    const perPage = Math.min(Number(request.input('perPage') || 10), 100)
    const mes = request.input('mes') as string | undefined // "YYYY-MM"
    const asesorId = request.input('asesorId') as number | undefined
    const estado = request.input('estado') as string | undefined
    const sortBy = (request.input('sortBy') || 'id') as string
    const order = (request.input('order') || 'desc') as 'asc' | 'desc'

    const query = Comision.query()
      // 👇 comisiones reales: es_config = false O NULL (viejas)
      .where((q) => {
        q.where('es_config', false).orWhereNull('es_config')
      })
      .preload('asesor')
      .preload('convenio')
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
    if (asesorId) query.where('asesor_id', asesorId)

    // Filtro por estado
    if (estado) query.where('estado', estado)

    // Ordenamiento (solo columnas reales)
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
   * GET /api/comisiones/:id
   * Detalle de una comisión REAL (no config) con todas sus relaciones
   */
  public async show({ params, response }: HttpContext) {
    const comision = await Comision.query()
      .where('id', params.id)
      // 👇 igual que en index: reales = false o NULL
      .where((q) => {
        q.where('es_config', false).orWhereNull('es_config')
      })
      .preload('asesor')
      .preload('convenio')
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

    // Extendemos con campos de detalle (por ahora null / reservados)
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

    const { cantidad, valor_unitario } = request.only(['cantidad', 'valor_unitario'])
    const cant = toNumber(cantidad || 1)
    const vu = toNumber(valor_unituario || 0)

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
   *          SECCIÓN NUEVA: CONFIGURACIONES DE COMISIONES
   *          (usa la MISMA tabla comisiones con es_config = true)
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
   * Body:
   *  {
   *    asesor_id?: number | null,   // null => regla global
   *    tipo_vehiculo: 'MOTO' | 'VEHICULO',
   *    valor_placa: number,
   *    valor_dateo: number
   *  }
   */
  public async configsUpsert({ request, response }: HttpContext) {
    const payload = request.only(['asesor_id', 'tipo_vehiculo', 'valor_placa', 'valor_dateo'])

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
      comision.porcentaje = 0
      comision.estado = 'PENDIENTE'
      comision.fechaCalculo = DateTime.now()
    }

    comision.base = String(valorPlaca) // placa
    comision.monto = String(valorDateo) // dateo

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

    const payload = request.only(['asesor_id', 'tipo_vehiculo', 'valor_placa', 'valor_dateo'])

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
}
