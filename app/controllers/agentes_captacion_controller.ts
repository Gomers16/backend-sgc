// app/Controllers/Http/agentes_captacion_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import AgenteCaptacion from '#models/agente_captacion'

function normalizePhone(value?: string) {
  return value ? value.replace(/\D/g, '') : value
}

const TIPOS = new Set(['ASESOR_INTERNO', 'ASESOR_EXTERNO', 'TELEMERCADEO'])
const DOC_TIPOS = new Set(['CC', 'NIT'])

export default class AgentesCaptacionController {
  /**
   * GET /agentes-captacion?page=1&perPage=20&q=juan&tipo=ASESOR_EXTERNO&activo=true
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 20)), 100)
    const q = String(request.input('q', '') || '').trim()
    const tipo = String(request.input('tipo', '') || '').trim()
    const activo = request.input('activo')

    const query = AgenteCaptacion.query().orderBy('id', 'asc')

    if (q) {
      query
        .where('nombre', 'like', `%${q}%`)
        .orWhere('telefono', 'like', `%${q}%`)
        .orWhere('doc_numero', 'like', `%${q}%`)
    }
    if (TIPOS.has(tipo)) {
      query.andWhere('tipo', tipo as any)
    }
    if (activo !== undefined) {
      const val = String(activo).toLowerCase()
      if (['true', '1'].includes(val)) query.andWhere('activo', true)
      if (['false', '0'].includes(val)) query.andWhere('activo', false)
    }

    return await query.paginate(page, perPage)
  }

  /** GET /agentes-captacion/:id */
  public async show({ params, response }: HttpContext) {
    const item = await AgenteCaptacion.find(params.id)
    if (!item) return response.notFound({ message: 'Agente no encontrado' })
    return item
  }

  /**
   * POST /agentes-captacion
   * body: { tipo, nombre, telefono?, doc_tipo?, doc_numero?, activo? }
   */
  public async store({ request, response }: HttpContext) {
    let { tipo, nombre, telefono, doc_tipo, doc_numero, activo } = request.only([
      'tipo',
      'nombre',
      'telefono',
      'doc_tipo',
      'doc_numero',
      'activo',
    ])

    if (!tipo || !TIPOS.has(tipo)) {
      return response.badRequest({
        message: 'tipo inválido (ASESOR_INTERNO | ASESOR_EXTERNO | TELEMERCADEO)',
      })
    }
    if (!nombre) return response.badRequest({ message: 'nombre es requerido' })

    telefono = normalizePhone(telefono)

    if (doc_tipo && !DOC_TIPOS.has(doc_tipo)) {
      return response.badRequest({ message: 'doc_tipo inválido (CC | NIT)' })
    }

    if (doc_tipo && doc_numero) {
      const exists = await AgenteCaptacion.query()
        .where('doc_tipo', doc_tipo)
        .andWhere('doc_numero', String(doc_numero).trim())
        .first()
      if (exists) return response.conflict({ message: 'Documento ya existe' })
    }

    const created = await AgenteCaptacion.create({
      tipo,
      nombre: String(nombre).trim(),
      telefono: telefono || null,
      docTipo: doc_tipo || null,
      docNumero: doc_numero ? String(doc_numero).trim() : null,
      activo: typeof activo === 'boolean' ? activo : true,
    })

    return response.created(created)
  }

  /**
   * PUT /agentes-captacion/:id
   * body parcial: { tipo?, nombre?, telefono?, doc_tipo?, doc_numero?, activo? }
   */
  public async update({ params, request, response }: HttpContext) {
    const item = await AgenteCaptacion.find(params.id)
    if (!item) return response.notFound({ message: 'Agente no encontrado' })

    const payload = request.only(['tipo', 'nombre', 'telefono', 'doc_tipo', 'doc_numero', 'activo'])

    if (payload.tipo !== undefined) {
      if (!TIPOS.has(payload.tipo)) {
        return response.badRequest({ message: 'tipo inválido' })
      }
      item.tipo = payload.tipo
    }

    if (payload.nombre !== undefined) {
      if (!payload.nombre) return response.badRequest({ message: 'nombre no puede ser vacío' })
      item.nombre = String(payload.nombre).trim()
    }

    if (payload.telefono !== undefined) {
      const tel = normalizePhone(payload.telefono) || null
      item.telefono = tel
    }

    if (payload.doc_tipo !== undefined || payload.doc_numero !== undefined) {
      const newTipo = payload.doc_tipo ?? item.docTipo
      const newNum =
        payload.doc_numero !== undefined ? String(payload.doc_numero).trim() : item.docNumero

      if (newTipo && !DOC_TIPOS.has(newTipo)) {
        return response.badRequest({ message: 'doc_tipo inválido (CC | NIT)' })
      }

      if (newTipo && newNum) {
        const exists = await AgenteCaptacion.query()
          .where('doc_tipo', newTipo)
          .andWhere('doc_numero', newNum)
          .whereNot('id', item.id)
          .first()
        if (exists) return response.conflict({ message: 'Documento ya está en uso' })
        item.docTipo = newTipo
        item.docNumero = newNum
      } else {
        item.docTipo = newTipo || null
        item.docNumero = newNum || null
      }
    }

    if (payload.activo !== undefined) {
      const v = String(payload.activo).toLowerCase()
      item.activo = ['true', '1'].includes(v)
        ? true
        : ['false', '0'].includes(v)
          ? false
          : item.activo
    }

    await item.save()
    return item
  }

  /**
   * DELETE /agentes-captacion/:id
   * Bloquea si existen dateos que lo referencien (aplicará desde la migración 5).
   */
  public async destroy({ params, response }: HttpContext) {
    const item = await AgenteCaptacion.find(params.id)
    if (!item) return response.notFound({ message: 'Agente no encontrado' })

    // Este check funcionará una vez exista la tabla 'captacion_dateos'
    const [{ total }] = await db
      .from('captacion_dateos')
      .where('agente_id', params.id)
      .count('* as total')
      .catch(() => [{ total: 0 }])

    if (Number(total) > 0) {
      return response.conflict({
        message: 'No se puede eliminar: existen dateos asociados a este agente.',
      })
    }

    await item.delete()
    return response.noContent()
  }
}
