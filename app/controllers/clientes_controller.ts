// app/Controllers/Http/clientes_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Cliente from '#models/cliente'

function normalizePhone(value?: string): string | undefined {
  if (!value) return value
  return value.replace(/\D/g, '')
}

export default class ClientesController {
  /** GET /clientes?page=1&perPage=20&q=andres */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 20)), 100)
    const q = String(request.input('q', '')).trim()

    const query = Cliente.query().orderBy('id', 'asc')
    if (q) {
      query
        .where('nombre', 'like', `%${q}%`)
        .orWhere('telefono', 'like', `%${q}%`)
        .orWhere('doc_numero', 'like', `%${q}%`)
    }
    return await query.paginate(page, perPage)
  }

  /** GET /clientes/:id */
  public async show({ params, response }: HttpContext) {
    const item = await Cliente.find(params.id)
    if (!item) return response.notFound({ message: 'Cliente no encontrado' })
    return item
  }

  /** POST /clientes  body: { nombre?, doc_tipo?, doc_numero?, telefono, email?, ciudad_id? } */
  public async store({ request, response }: HttpContext) {
    const {
      nombre,
      doc_tipo: docTipo, // alias → camelCase en TS
      doc_numero: docNumero, // alias → camelCase en TS
      telefono: rawTelefono,
      email,
      ciudad_id: ciudadId, // alias → camelCase en TS
    } = request.only(['nombre', 'doc_tipo', 'doc_numero', 'telefono', 'email', 'ciudad_id'])

    const telefono = normalizePhone(rawTelefono) || ''
    if (!telefono) return response.badRequest({ message: 'telefono es requerido' })

    // Unicidad de teléfono
    const telExists = await Cliente.findBy('telefono', telefono)
    if (telExists) return response.conflict({ message: 'El teléfono ya existe' })

    // Unicidad de documento (si viene)
    if (docTipo && docNumero) {
      const docExists = await Cliente.query()
        .where('doc_tipo', docTipo)
        .andWhere('doc_numero', docNumero)
        .first()
      if (docExists) return response.conflict({ message: 'Documento ya existe' })
    }

    const created = await Cliente.create({
      nombre: nombre?.trim() || null,
      docTipo: docTipo || null,
      docNumero: docNumero?.trim() || null,
      telefono,
      email: email?.trim() || null,
      ciudadId: ciudadId ?? null,
    })

    return response.created(created)
  }

  /** PUT /clientes/:id  body parcial: { nombre?, doc_tipo?, doc_numero?, telefono?, email?, ciudad_id? } */
  public async update({ params, request, response }: HttpContext) {
    const item = await Cliente.find(params.id)
    if (!item) return response.notFound({ message: 'Cliente no encontrado' })

    const {
      nombre,
      doc_tipo: docTipo, // alias
      doc_numero: docNumero, // alias
      telefono: rawTelefono,
      email,
      ciudad_id: ciudadId, // alias
    } = request.only(['nombre', 'doc_tipo', 'doc_numero', 'telefono', 'email', 'ciudad_id'])

    if (typeof nombre === 'string') item.nombre = nombre.trim() || null
    if (typeof email === 'string') item.email = email.trim() || null
    if (ciudadId !== undefined) item.ciudadId = ciudadId ?? null

    if (rawTelefono !== undefined) {
      const newTel = normalizePhone(rawTelefono) || null
      if (!newTel) return response.badRequest({ message: 'telefono no puede ser vacío' })
      if (newTel !== item.telefono) {
        const telExists = await Cliente.query()
          .where('telefono', newTel)
          .whereNot('id', item.id)
          .first()
        if (telExists) return response.conflict({ message: 'El teléfono ya está en uso' })
        item.telefono = newTel
      }
    }

    if (docTipo !== undefined || docNumero !== undefined) {
      const newTipo = docTipo ?? item.docTipo
      const newNumero = docNumero?.trim() ?? item.docNumero
      if (newTipo && newNumero) {
        const docExists = await Cliente.query()
          .where('doc_tipo', newTipo)
          .andWhere('doc_numero', newNumero)
          .whereNot('id', item.id)
          .first()
        if (docExists) return response.conflict({ message: 'Documento ya está en uso' })
        item.docTipo = newTipo
        item.docNumero = newNumero
      } else {
        item.docTipo = newTipo || null
        item.docNumero = newNumero || null
      }
    }

    await item.save()
    return item
  }

  /** DELETE /clientes/:id  (bloquea si hay vehículos asociados) */
  public async destroy({ params, response }: HttpContext) {
    const item = await Cliente.find(params.id)
    if (!item) return response.notFound({ message: 'Cliente no encontrado' })

    const [{ total }] = await db
      .from('vehiculos')
      .where('cliente_id', params.id)
      .count('* as total')
    if (Number(total) > 0) {
      return response.conflict({
        message: 'No se puede eliminar: existen vehículos asociados a este cliente.',
      })
    }

    await item.delete()
    return response.noContent()
  }
}
