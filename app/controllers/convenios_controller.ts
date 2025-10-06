// app/controllers/convenios_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import Convenio from '#models/convenio'
import AgenteCaptacion from '#models/agente_captacion'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'

export default class ConveniosController {
  /** Listado con filtros básicos */
  public async index({ request }: HttpContext) {
    const q = String(request.input('q') || '').trim().toUpperCase()
    const activo = request.input('activo')
    const query = Convenio.query().orderBy('id', 'desc')

    if (q) {
      query.where((qb) => {
        qb.whereRaw('UPPER(nombre) LIKE ?', [`%${q}%`])
          .orWhereRaw('UPPER(codigo) LIKE ?', [`%${q}%`]) // si tu tabla no tiene 'codigo', elimina esta línea
      })
    }

    if (activo !== undefined) query.where('activo', String(activo) === 'true')
    return query.exec()
  }

  /** Obtener un convenio por ID */
  public async show({ params, response }: HttpContext) {
    const conv = await Convenio.find(params.id)
    if (!conv) return response.notFound({ message: 'Convenio no encontrado' })
    return conv
  }

  /** Crear convenio */
  public async store({ request, response }: HttpContext) {
    const { codigo, nombre, activo } = request.only(['codigo', 'nombre', 'activo'])
    const tipo = request.input('tipo') ?? 'PERSONA'

    if (!nombre) {
      return response.badRequest({ message: 'nombre es requerido' })
    }

    // Validar unicidad de 'codigo' sólo si lo usas en tu tabla
    if (codigo) {
      const exists = await Convenio.query().where('codigo', codigo).first()
      if (exists) return response.conflict({ message: 'El código de convenio ya existe' })
    }

    const conv = await Convenio.create({
      codigo: codigo ?? null,
      nombre,
      tipo,
      activo: activo ?? true,
    } as any)

    return response.created(conv)
  }

  /** Actualizar convenio */
  public async update({ params, request, response }: HttpContext) {
    const c = await Convenio.find(params.id)
    if (!c) return response.notFound({ message: 'Convenio no encontrado' })

    const { nombre, activo, codigo } = request.only(['nombre', 'activo', 'codigo'])
    const tipo = request.input('tipo')

    if (nombre !== undefined) c.nombre = nombre
    if (activo !== undefined) c.activo = !!activo
    if (tipo !== undefined) c.tipo = tipo
    if (codigo !== undefined) c.codigo = codigo

    await c.save()
    return c
  }

  /** Asesor activo del convenio (basado en activo = true) */
  public async asesorActivo({ params, response }: HttpContext) {
    const conv = await Convenio.find(params.id)
    if (!conv) return response.notFound({ message: 'Convenio no encontrado' })

    const asign = await AsesorConvenioAsignacion.query()
      .where('convenio_id', conv.id)
      .where('activo', true)
      .orderBy('fecha_asignacion', 'desc')
      .first()

    if (!asign) return { convenioId: conv.id, asesor: null }

    const asesor = await AgenteCaptacion.find(asign.asesorId)
    return {
      convenioId: conv.id,
      asesor: asesor ? { id: asesor.id, nombre: asesor.nombre, tipo: asesor.tipo } : null,
      asignacionId: asign.id,
      desde:
        (asign as any)?.fechaAsignacion?.toISO?.() ??
        (asign as any)?.fechaAsignacion?.toISOString?.() ??
        null,
    }
  }

  /**
   * Asignar asesor al convenio.
   * Cierra la asignación vigente (si existe) y crea una nueva con activo = true.
   */
  public async asignarAsesor({ params, request, response, auth }: HttpContext) {
    const trx = await Database.transaction()
    try {
      const conv = await Convenio.find(params.id, { client: trx })
      if (!conv) {
        await trx.rollback()
        return response.notFound({ message: 'Convenio no encontrado' })
      }

      // Aceptamos varias keys por compatibilidad con el front
      const asesorId = Number(
        request.input('asesor_id') ??
          request.input('asesorId') ??
          request.input('agente_captacion_id')
      )
      if (!asesorId) {
        await trx.rollback()
        return response.badRequest({ message: 'asesorId requerido' })
      }

      const asesor = await AgenteCaptacion.find(asesorId, { client: trx })
      if (!asesor) {
        await trx.rollback()
        return response.badRequest({ message: 'asesorId no existe' })
      }

      // Si ya está ese asesor asignado y activo, no hacemos nada
      const yaActiva = await AsesorConvenioAsignacion.query({ client: trx })
        .where('convenio_id', conv.id)
        .where('asesor_id', asesor.id)
        .where('activo', true)
        .first()

      if (yaActiva) {
        await trx.commit()
        return { ok: true, asignacionId: yaActiva.id, noop: true }
      }

      // Cerrar la asignación vigente (si la hay) — usar JS Date para evitar offset en MySQL DATETIME
      await AsesorConvenioAsignacion.query({ client: trx })
        .where('convenio_id', conv.id)
        .where('activo', true)
        .update({
          activo: false,
          fecha_fin: DateTime.now().toJSDate(), // <- sin offset, compatible con DATETIME
          motivo_fin: 'Reasignación',
        })

      // Crear la nueva asignación activa — modelos requieren Luxon DateTime
      const nueva = await AsesorConvenioAsignacion.create(
        {
          convenioId: conv.id,
          asesorId: asesor.id,
          asignadoPor: auth?.user?.id ?? null,
          fechaAsignacion: DateTime.now(),
          activo: true,
        } as any,
        { client: trx }
      )

      await trx.commit()
      return { ok: true, asignacionId: nueva.id }
    } catch (e) {
      await trx.rollback()
      throw e
    }
  }

  /** Retirar asesor (cierra la asignación activa del convenio) */
  public async retirarAsesor({ params, request, response }: HttpContext) {
    const { motivo } = request.only(['motivo'])

    const asign = await AsesorConvenioAsignacion.query()
      .where('convenio_id', Number(params.id))
      .where('activo', true)
      .first()

    if (!asign) return response.notFound({ message: 'No hay asignación activa' })

    asign.merge({
      activo: false,
      fechaFin: DateTime.now(),              // Luxon DateTime para modelos
      motivoFin: motivo ?? 'Retiro manual',
    } as any)

    await asign.save()
    return { ok: true }
  }
}
