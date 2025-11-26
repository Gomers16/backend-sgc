// app/Controllers/Http/convenios_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import Convenio from '#models/convenio'
import AgenteCaptacion from '#models/agente_captacion'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'

export default class ConveniosController {
  /**
   * GET /convenios
   * Query params:
   *  - page=1
   *  - perPage=10
   *  - q=texto
   *  - activo=true|false|1|0
   *  - tipo=TALLER|PERSONA
   *  - sortBy=id|nombre|docNumero|activo|createdAt
   *  - order=asc|desc
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 10)), 100)

    const q = String(request.input('q') || '').trim()
    const activoParam = request.input('activo')
    const tipo = request.input('tipo') // 'TALLER' | 'PERSONA' | undefined

    const sortByRaw = String(request.input('sortBy', 'id'))
    const orderRaw = String(request.input('order', 'desc')).toLowerCase()

    // whitelist para evitar inyección en order by
    const ALLOWED_SORT = new Set(['id', 'nombre', 'docNumero', 'activo', 'createdAt'])
    const sortBy = ALLOWED_SORT.has(sortByRaw) ? sortByRaw : 'id'
    const order: 'asc' | 'desc' = orderRaw === 'asc' ? 'asc' : 'desc'

    const query = Convenio.query().orderBy(sortBy, order)

    if (q) {
      const qUpper = q.toUpperCase()
      query.where((qb) => {
        qb.whereRaw('UPPER(nombre) LIKE ?', [`%${qUpper}%`])
          .orWhereRaw('UPPER(doc_numero) LIKE ?', [`%${qUpper}%`])
          .orWhereRaw('UPPER(email) LIKE ?', [`%${qUpper}%`])
      })
    }

    if (tipo) {
      query.where('tipo', String(tipo).toUpperCase())
    }

    if (activoParam !== undefined) {
      const bool =
        activoParam === true || String(activoParam) === 'true' || String(activoParam) === '1'
      query.where('activo', bool)
    }

    // 👇 Paginación real
    return await query.paginate(page, perPage)
  }

  /** GET /convenios/:id */
  public async show({ params, response }: HttpContext) {
    const conv = await Convenio.find(params.id)
    if (!conv) return response.notFound({ message: 'Convenio no encontrado' })
    return conv
  }
// AGREGAR ESTE MÉTODO después del método show() en convenios_controller.ts
// (aproximadamente después de la línea 70)

/**
 * 🆕 GET /convenios/buscar-por-nombre?nombre=Parqueadero Mi Casa
 * Busca UN convenio por nombre EXACTO (case-insensitive)
 */
public async buscarPorNombre({ request, response }: HttpContext) {
  const nombre = String(request.input('nombre') || '').trim()

  if (!nombre) {
    return response.badRequest({ message: 'Parámetro "nombre" requerido' })
  }

  const convenio = await Convenio.query()
    .whereRaw('UPPER(TRIM(nombre)) = ?', [nombre.toUpperCase()])
    .first()

  if (!convenio) {
    return response.notFound({ message: 'Convenio no encontrado' })
  }

  return response.ok(convenio)
}
  /** POST /convenios */
  public async store({ request, response }: HttpContext) {
    const {
      nombre,
      tipo = 'PERSONA',
      activo = true,
      doc_tipo: docTipo,
      doc_numero: docNumero,
      telefono,
      whatsapp,
      email,
      ciudad_id: ciudadId,
      direccion,
      notas,
    } = request.only([
      'nombre',
      'tipo',
      'activo',
      'doc_tipo',
      'doc_numero',
      'telefono',
      'whatsapp',
      'email',
      'ciudad_id',
      'direccion',
      'notas',
    ])

    if (!nombre) return response.badRequest({ message: 'nombre es requerido' })

    // Unicidad por documento si viene
    if (docTipo && docNumero) {
      const exists = await Convenio.query()
        .where('doc_tipo', docTipo)
        .andWhere('doc_numero', docNumero)
        .first()
      if (exists) return response.conflict({ message: 'Documento ya existe en otro convenio' })
    }

    const conv = await Convenio.create({
      nombre,
      tipo,
      activo: !!activo,
      docTipo: docTipo ?? null,
      docNumero: docNumero ?? null,
      telefono: telefono ?? null,
      whatsapp: whatsapp ?? null,
      email: email ?? null,
      ciudadId: ciudadId ?? null,
      direccion: direccion ?? null,
      notas: notas ?? null,
    } as any)

    return response.created(conv)
  }

  /** PUT /convenios/:id */
  public async update({ params, request, response }: HttpContext) {
    const c = await Convenio.find(params.id)
    if (!c) return response.notFound({ message: 'Convenio no encontrado' })

    const payload = request.only([
      'nombre',
      'tipo',
      'activo',
      'doc_tipo',
      'doc_numero',
      'telefono',
      'whatsapp',
      'email',
      'ciudad_id',
      'direccion',
      'notas',
    ])

    if (payload.doc_tipo !== undefined || payload.doc_numero !== undefined) {
      const newTipo = payload.doc_tipo ?? c.docTipo
      const newNum = (payload.doc_numero ?? c.docNumero) || null
      if (newTipo && newNum) {
        const exists = await Convenio.query()
          .where('doc_tipo', newTipo)
          .andWhere('doc_numero', newNum)
          .whereNot('id', c.id)
          .first()
        if (exists) return response.conflict({ message: 'Documento ya está en uso' })
        c.docTipo = newTipo
        c.docNumero = newNum
      } else {
        c.docTipo = newTipo || null
        c.docNumero = newNum || null
      }
    }

    if (payload.nombre !== undefined) c.nombre = payload.nombre
    if (payload.tipo !== undefined) c.tipo = payload.tipo
    if (payload.activo !== undefined) c.activo = !!payload.activo
    if (payload.telefono !== undefined) c.telefono = payload.telefono ?? null
    if (payload.whatsapp !== undefined) c.whatsapp = payload.whatsapp ?? null
    if (payload.email !== undefined) c.email = payload.email ?? null
    if (payload.ciudad_id !== undefined) c.ciudadId = payload.ciudad_id ?? null
    if (payload.direccion !== undefined) c.direccion = payload.direccion ?? null
    if (payload.notas !== undefined) c.notas = payload.notas ?? null

    await c.save()
    return c
  }

  /** GET /convenios/:id/asesor-activo */
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
   * POST /convenios/:id/asignar-asesor
   * body: { asesorId | asesor_id | agente_captacion_id }
   */
  public async asignarAsesor({ params, request, response, auth }: HttpContext) {
    const trx = await Database.transaction()
    try {
      const conv = await Convenio.find(params.id, { client: trx })
      if (!conv) {
        await trx.rollback()
        return response.notFound({ message: 'Convenio no encontrado' })
      }

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

      // Si ya está activo con ese asesor, noop
      const yaActiva = await AsesorConvenioAsignacion.query({ client: trx })
        .where('convenio_id', conv.id)
        .where('asesor_id', asesor.id)
        .where('activo', true)
        .first()
      if (yaActiva) {
        await trx.commit()
        return { ok: true, asignacionId: yaActiva.id, noop: true }
      }

      // Cerrar la vigente
      await AsesorConvenioAsignacion.query({ client: trx })
        .where('convenio_id', conv.id)
        .where('activo', true)
        .update({
          activo: false,
          fecha_fin: DateTime.now().toJSDate(),
          motivo_fin: 'Reasignación',
        })

      // Crear nueva activa
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
      await Database.rollbackGlobalTransaction()
      throw e
    }
  }

  /** POST /convenios/:id/retirar-asesor  body: { motivo? } */
  public async retirarAsesor({ params, request, response }: HttpContext) {
    const { motivo } = request.only(['motivo'])

    const asign = await AsesorConvenioAsignacion.query()
      .where('convenio_id', Number(params.id))
      .where('activo', true)
      .first()

    if (!asign) return response.notFound({ message: 'No hay asignación activa' })

    asign.merge({
      activo: false,
      fechaFin: DateTime.now(),
      motivoFin: motivo ?? 'Retiro manual',
    } as any)

    await asign.save()
    return { ok: true }
  }

  /**
   * 🔹 GET /convenios/asignados?asesor_id=3
   * Devuelve SOLO los convenios activos asignados a un asesor comercial.
   */
  public async asignadosPorAsesor({ request, response }: HttpContext) {
    const raw = request.input('asesor_id') ?? request.input('asesorId')
    const asesorId = Number(raw)

    if (!Number.isFinite(asesorId) || asesorId <= 0) {
      return response.badRequest({ message: 'asesor_id inválido' })
    }

    const asignaciones = await AsesorConvenioAsignacion.query()
      .where('asesor_id', asesorId)
      .where('activo', true)
      .whereNull('fecha_fin')
      .preload('convenio', (q) => q.select(['id', 'nombre']).where('activo', true))

    const convenios = asignaciones.map((a) => a.convenio).filter((c): c is Convenio => !!c)

    return response.ok(
      convenios.map((c) => ({
        id: c.id,
        nombre: c.nombre,
      }))
    )
  }

  /**
   * GET /convenios/light?activo=1&select=id,nombre&perPage=100
   * Respuesta: { data: [{ id, nombre, ...}] }
   */
  public async light({ request, response }: HttpContext) {
    const activoParam = request.input('activo')
    const onlyActive =
      activoParam === undefined
        ? true
        : activoParam === true || String(activoParam) === '1' || String(activoParam) === 'true'

    const selectRaw = String(request.input('select', 'id,nombre'))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const cols = selectRaw.length ? selectRaw : ['id', 'nombre']
    const perPage = Math.min(Number(request.input('perPage', 100)), 500)

    const qb = Database.from('convenios').select(cols).limit(perPage)
    if (onlyActive) qb.where('activo', true)

    const rows = await qb
    return response.ok({ data: rows })
  }
}
