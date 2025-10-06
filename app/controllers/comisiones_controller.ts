// app/controllers/comisiones_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Database from '@adonisjs/lucid/services/db'
import Comision from '#models/comision'

type EstadoComision = 'PENDIENTE' | 'APROBADA' | 'PAGADA' | 'ANULADA'

function parseISODate(d?: string) {
  if (!d) return null
  const dt = DateTime.fromISO(d, { zone: 'America/Bogota' })
  return dt.isValid ? dt : null
}

export default class ComisionesController {
  /**
   * GET /api/comisiones
   * Filtros: asesorId, convenioId, estado, servicioCodigo, desde, hasta, minTotal, maxTotal
   * Paginación: page, perPage
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 20)), 100)

    const asesorId = request.input('asesorId') ? Number(request.input('asesorId')) : undefined
    const convenioId = request.input('convenioId') ? Number(request.input('convenioId')) : undefined
    const estado = request.input('estado') as EstadoComision | undefined
    const servicioCodigo = request.input('servicioCodigo') as string | undefined

    const desde = parseISODate(request.input('desde'))
    const hasta = parseISODate(request.input('hasta'))

    const minTotal = request.input('minTotal') ? Number(request.input('minTotal')) : undefined
    const maxTotal = request.input('maxTotal') ? Number(request.input('maxTotal')) : undefined

    const q = Comision.query().orderBy('generado_at', 'desc')

    if (asesorId !== undefined) q.where('asesor_id', asesorId)
    if (convenioId !== undefined) q.where('convenio_id', convenioId)
    if (estado) q.where('estado', estado)
    if (servicioCodigo) q.where('servicio_codigo', servicioCodigo)

    if (desde && hasta) {
      q.whereBetween('generado_at', [desde.toISO(), hasta.toISO()])
    } else if (desde) {
      q.where('generado_at', '>=', desde.toISO())
    } else if (hasta) {
      q.where('generado_at', '<=', hasta.toISO())
    }

    if (minTotal !== undefined) q.where('valor_total', '>=', minTotal)
    if (maxTotal !== undefined) q.where('valor_total', '<=', maxTotal)

    return q.paginate(page, perPage)
  }

  /** GET /api/comisiones/:id */
  public async show({ params, response }: HttpContext) {
    const c = await Comision.find(params.id)
    if (!c) return response.notFound({ message: 'Comisión no encontrada' })
    return c
  }

  /**
   * PATCH /api/comisiones/:id/valores
   * body: { cantidad?, valorUnitario? } → recalcula valorTotal
   * Solo permitido cuando estado = 'PENDIENTE'
   */
  public async actualizarValores({ params, request, response }: HttpContext) {
    const trx = await Database.transaction()
    try {
      const c = await Comision.find(params.id, { client: trx })
      if (!c) {
        await trx.rollback()
        return response.notFound({ message: 'Comisión no encontrada' })
      }
      if (c.estado !== 'PENDIENTE') {
        await trx.rollback()
        return response.badRequest({
          message: 'Solo se pueden actualizar valores en estado PENDIENTE',
        })
      }

      const { cantidad, valorUnitario } = request.only(['cantidad', 'valorUnitario'])
      if (cantidad !== undefined) c.cantidad = Number(cantidad)
      if (valorUnitario !== undefined) c.valorUnitario = Number(valorUnitario)
      c.valorTotal = Number(c.cantidad) * Number(c.valorUnitario)
      await c.save()

      await trx.commit()
      return c
    } catch (e) {
      await trx.rollback()
      throw e
    }
  }

  /**
   * POST /api/comisiones/:id/aprobar
   * Transición: PENDIENTE → APROBADA
   */
  public async aprobar({ params, response }: HttpContext) {
    const c = await Comision.find(params.id)
    if (!c) return response.notFound({ message: 'Comisión no encontrada' })
    if (c.estado !== 'PENDIENTE') {
      return response.badRequest({
        message: 'Solo se puede aprobar una comisión en estado PENDIENTE',
      })
    }
    c.estado = 'APROBADA'
    await c.save()
    return c
  }

  /**
   * POST /api/comisiones/:id/pagar
   * Transición: APROBADA → PAGADA
   */
  public async pagar({ params, response }: HttpContext) {
    const c = await Comision.find(params.id)
    if (!c) return response.notFound({ message: 'Comisión no encontrada' })
    if (c.estado !== 'APROBADA') {
      return response.badRequest({ message: 'Solo se puede pagar una comisión en estado APROBADA' })
    }
    c.estado = 'PAGADA'
    await c.save()
    return c
  }

  /**
   * POST /api/comisiones/:id/anular
   * Transiciones válidas: PENDIENTE|APROBADA → ANULADA
   */
  public async anular({ params, response }: HttpContext) {
    const c = await Comision.find(params.id)
    if (!c) return response.notFound({ message: 'Comisión no encontrada' })
    if (!['PENDIENTE', 'APROBADA'].includes(c.estado as string)) {
      return response.badRequest({ message: 'Solo se puede anular si está PENDIENTE o APROBADA' })
    }
    c.estado = 'ANULADA'
    await c.save()
    return c
  }
}
