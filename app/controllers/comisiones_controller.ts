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

/** 💰 reglas fijas:
 *  - sin convenio: 16.000 (placa)
 *  - con convenio: 20.000 (placa/convenio)
 */
const VALOR_PLACA_SIN_CONVENIO = 16000
const VALOR_PLACA_CON_CONVENIO = 20000

function calcularValorCliente(baseDb: any, convenioId: number | null) {
  const db = toNumber(baseDb)
  if (db > 0) return db
  // si no hay nada en BD, usamos las reglas fijas
  return convenioId ? VALOR_PLACA_CON_CONVENIO : VALOR_PLACA_SIN_CONVENIO
}

export default class ComisionesController {
  /**
   * GET /api/comisiones
   * Lista comisiones con filtros: mes (YYYY-MM), asesorId, estado, sortBy, order
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
    const { meta, data } = paginated.toJSON()

    const rows = data.map((c: any) => {
      const dateo = c.$preloaded?.dateo || null
      const turno = dateo?.$preloaded?.turno || null
      const servicio = turno?.$preloaded?.servicio || null

      // 💸 comisión asesor (ya viene como 4.000 en BD)
      const valorAsesor = toNumber(c.monto)

      // 💰 comisión placa / cliente / convenio
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
        estado: c.estado,
        cantidad: 1,
        // 👇 asesor
        valor_unitario: valorAsesor,
        // 👇 comisión placa (cliente / convenio)
        valor_cliente: valorCliente,
        valor_total: valorTotal,
        generado_at: c.fechaCalculo ? c.fechaCalculo.toISO() : null,

        asesor: c.$preloaded?.asesor
          ? {
              id: c.$preloaded.asesor.id,
              nombre: c.$preloaded.asesor.nombre,
              tipo: c.$preloaded.asesor.tipo,
            }
          : null,

        convenio: c.$preloaded?.convenio
          ? {
              id: c.$preloaded.convenio.id,
              nombre: c.$preloaded.convenio.nombre,
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
    })

    return response.ok({
      data: rows,
      total: meta.total,
      page: meta.currentPage,
      perPage: meta.perPage,
    })
  }

  /**
   * GET /api/comisiones/:id
   * Detalle de una comisión con todas sus relaciones
   */
  public async show({ params, response }: HttpContext) {
    const comision = await Comision.query()
      .where('id', params.id)
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

    const c: any = comision
    const dateo = c.$preloaded?.dateo || null
    const turno = dateo?.$preloaded?.turno || null
    const servicio = turno?.$preloaded?.servicio || null

    const valorAsesor = toNumber(c.monto)
    const valorCliente = calcularValorCliente(c.base, c.convenioId ?? null)
    const valorTotal = valorAsesor + valorCliente

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

    const result = {
      id: comision.id,
      estado: comision.estado,
      cantidad: 1,
      valor_unitario: valorAsesor,  // asesor
      valor_cliente: valorCliente,  // comisión placa
      valor_total: valorTotal,
      generado_at: comision.fechaCalculo ? comision.fechaCalculo.toISO() : null,

      aprobado_at: null,
      pagado_at: null,
      anulado_at: null,
      observacion: null,

      asesor: c.$preloaded?.asesor
        ? {
            id: c.$preloaded.asesor.id,
            nombre: c.$preloaded.asesor.nombre,
            tipo: c.$preloaded.asesor.tipo,
          }
        : null,

      convenio: c.$preloaded?.convenio
        ? {
            id: c.$preloaded.convenio.id,
            nombre: c.$preloaded.convenio.nombre,
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

    return response.ok(result)
  }

  /**
   * PATCH /api/comisiones/:id/valores
   * Actualiza cantidad y valor_unitario (solo si estado = PENDIENTE)
   * Aquí asumimos que se está editando el valor del ASESOR (monto).
   */
  public async actualizarValores({ params, request, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    if (comision.estado !== 'PENDIENTE') {
      return response.badRequest({ message: 'Solo se pueden editar comisiones en estado PENDIENTE' })
    }

    const { cantidad, valor_unitario } = request.only(['cantidad', 'valor_unitario'])
    const cant = toNumber(cantidad || 1)
    const vu = toNumber(valor_unitario || 0)

    // Recalcular monto (asesor)
    comision.monto = String(cant * vu)
    await comision.save()

    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/aprobar
   * Cambia estado a APROBADA
   */
  public async aprobar({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    if (comision.estado !== 'PENDIENTE') {
      return response.badRequest({ message: 'Solo se pueden aprobar comisiones PENDIENTES' })
    }

    comision.estado = 'APROBADA'
    await comision.save()

    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/pagar
   * Cambia estado a PAGADA
   */
  public async pagar({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    if (comision.estado !== 'APROBADA') {
      return response.badRequest({ message: 'Solo se pueden pagar comisiones APROBADAS' })
    }

    comision.estado = 'PAGADA'
    await comision.save()

    return this.show({ params, response } as any)
  }

  /**
   * POST /api/comisiones/:id/anular
   * Cambia estado a ANULADA
   */
  public async anular({ params, response }: HttpContext) {
    const comision = await Comision.find(params.id)
    if (!comision) {
      return response.notFound({ message: 'Comisión no encontrada' })
    }

    if (comision.estado === 'PAGADA') {
      return response.badRequest({ message: 'No se pueden anular comisiones PAGADAS' })
    }

    comision.estado = 'ANULADA'
    await comision.save()

    return this.show({ params, response } as any)
  }
}
