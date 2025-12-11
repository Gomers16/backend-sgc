import type { HttpContext } from '@adonisjs/core/http'
import CaptacionCanal from '#models/captacion_canal'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/** ===== Validadores ===== */
const createSchema = vine.compile(
  vine.object({
    codigo: vine.string().trim().toUpperCase().minLength(3).maxLength(32),
    nombre: vine.string().trim().minLength(3).maxLength(100),
    descripcion: vine.string().trim().maxLength(255).optional(),
    colorHex: vine
      .string()
      .regex(/^#([0-9A-Fa-f]{6})$/)
      .optional(),
    activo: vine.boolean().optional(),
    orden: vine.number().min(0).max(32767).optional(),
  })
)

const updateSchema = vine.compile(
  vine.object({
    codigo: vine.string().trim().toUpperCase().minLength(3).maxLength(32).optional(),
    nombre: vine.string().trim().minLength(3).maxLength(100).optional(),
    descripcion: vine.string().trim().maxLength(255).optional(),
    colorHex: vine
      .string()
      .regex(/^#([0-9A-Fa-f]{6})$/)
      .optional(),
    activo: vine.boolean().optional(),
    orden: vine.number().min(0).max(32767).optional(),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'codigo.required': 'El código es obligatorio',
  'nombre.required': 'El nombre es obligatorio',
  'colorHex.regex': 'colorHex debe ser un HEX válido, ej: #6D28D9',
})

export default class CaptacionCanalesController {
  /** GET /api/captacion/canales?q=&activo=&page=&perPage=&orderBy=&order= */
  public async index({ request }: HttpContext) {
    const q = (request.input('q') || '').toString().trim()
    const activoParam = request.input('activo') // true/false/null
    const page = Number(request.input('page') ?? 1)
    const perPage = Math.min(Number(request.input('perPage') ?? 25), 100)

    const orderBy = (request.input('orderBy') || 'orden') as
      | 'orden'
      | 'codigo'
      | 'nombre'
      | 'created_at'
    const order = (request.input('order') || 'asc') as 'asc' | 'desc'

    const query = CaptacionCanal.query()
      .if(q !== '', (qb) => {
        const like = `%${q}%`
        qb.where((w) => {
          w.where('codigo', 'like', like)
            .orWhere('nombre', 'like', like)
            .orWhere('descripcion', 'like', like)
        })
      })
      .if(typeof activoParam !== 'undefined' && activoParam !== null, (qb) => {
        const val = String(activoParam).toLowerCase()
        if (['true', 'false', '1', '0'].includes(val)) {
          qb.where('activo', ['true', '1'].includes(val))
        }
      })
      .orderBy(orderBy, order)

    const result = await query.paginate(page, perPage)
    return result
  }

  /** GET /api/captacion/canales/:id */
  public async show({ params }: HttpContext) {
    const canal = await CaptacionCanal.findOrFail(params.id)
    return canal
  }

  /** POST /api/captacion/canales */
  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSchema)

    // Asegurar unicidad de codigo
    const exists = await CaptacionCanal.findBy('codigo', payload.codigo)
    if (exists) {
      return response.conflict({ message: `Ya existe un canal con el código ${payload.codigo}` })
    }

    const canal = await CaptacionCanal.create({
      codigo: payload.codigo,
      nombre: payload.nombre,
      descripcion: payload.descripcion ?? null,
      colorHex: payload.colorHex ?? null,
      activo: payload.activo ?? true,
      orden: payload.orden ?? 0,
    })

    return response.created(canal)
  }

  /** PUT/PATCH /api/captacion/canales/:id */
  public async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateSchema)
    const canal = await CaptacionCanal.findOrFail(params.id)

    if (payload.codigo && payload.codigo !== canal.codigo) {
      const exists = await CaptacionCanal.findBy('codigo', payload.codigo)
      if (exists) {
        return response.conflict({ message: `Ya existe un canal con el código ${payload.codigo}` })
      }
      canal.codigo = payload.codigo
    }

    if (typeof payload.nombre !== 'undefined') canal.nombre = payload.nombre
    if (typeof payload.descripcion !== 'undefined') canal.descripcion = payload.descripcion ?? null
    if (typeof payload.colorHex !== 'undefined') canal.colorHex = payload.colorHex ?? null
    if (typeof payload.activo !== 'undefined') canal.activo = payload.activo
    if (typeof payload.orden !== 'undefined') canal.orden = payload.orden

    await canal.save()
    return canal
  }

  /** DELETE /api/captacion/canales/:id  → desactiva (soft) */
  public async destroy({ params }: HttpContext) {
    const canal = await CaptacionCanal.findOrFail(params.id)
    canal.activo = false
    await canal.save()
    return { ok: true, message: 'Canal desactivado' }
  }

  /** POST /api/captacion/canales/:id/restore → reactiva */
  public async restore({ params }: HttpContext) {
    const canal = await CaptacionCanal.findOrFail(params.id)
    canal.activo = true
    await canal.save()
    return { ok: true, message: 'Canal reactivado' }
  }
}
