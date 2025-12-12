/**import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import AgenteCaptacion from '#models/agente_captacion'
import CaptacionCanal from '#models/captacion_canal'


const upsertSchema = vine.compile(
  vine.object({
    canalId: vine.number().positive(),
    isDefault: vine.boolean().optional(),
    activo: vine.boolean().optional(),
  })
)

function parseBool(q: unknown): boolean | undefined {
  if (q === undefined || q === null) return undefined
  const s = String(q).toLowerCase()
  if (['true', '1'].includes(s)) return true
  if (['false', '0'].includes(s)) return false
  return undefined
}

export default class AgenteCanalMembresiasController {
  GET /api/agentes-captacion/:agenteId/canales
  async listByAgente({ params }: HttpContext) {
    const agente = await AgenteCaptacion.query()
      .where('id', params.agenteId)
      .preload('canales', (q) => {
        q.orderBy('orden', 'asc').pivotColumns(['is_default', 'activo'])
      })
      .firstOrFail()

    return agente.canales.map((c) => ({
      id: c.id,
      codigo: c.codigo,
      nombre: c.nombre,
      colorHex: c.colorHex,
      activo: c.activo,
      orden: c.orden,
      pivot: c.$extras.pivot_agente_canal_membresias,  { is_default, activo, created_at, updated_at }
    }))
  }

   GET /api/captacion-canales/:canalId/agentes?tipo=&activo=
  async listByCanal({ params, request }: HttpContext) {
    const tipo = request.input('tipo') as
      | 'ASESOR_INTERNO'
      | 'ASESOR_EXTERNO'
      | 'TELEMERCADEO'
      | undefined
    const activoQ = parseBool(request.input('activo'))

    const canal = await CaptacionCanal.findOrFail(params.canalId)
    await canal.load('agentes', (q) => {
      if (tipo) q.where('tipo', tipo)
      if (activoQ !== undefined) q.where('activo', activoQ)
      q.pivotColumns(['is_default', 'activo']).orderBy('nombre', 'asc')
    })

    return {
      canal: { id: canal.id, codigo: canal.codigo, nombre: canal.nombre },
      agentes: canal.agentes.map((a) => ({
        id: a.id,
        nombre: a.nombre,
        tipo: a.tipo,
        telefono: a.telefono,
        activo: a.activo,
        pivot: a.$extras.pivot_agente_canal_membresias, // { is_default, activo, created_at, updated_at }
      })),
    }
  }

   POST /api/agentes-captacion/:agenteId/canales
  async attach({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(upsertSchema)
    const agente = await AgenteCaptacion.findOrFail(params.agenteId)
    const canal = await CaptacionCanal.findOrFail(payload.canalId)

    Regla: EXTERNO solo canal ASESOR
    if (agente.tipo === 'ASESOR_EXTERNO' && canal.codigo !== 'ASESOR') {
      return response.badRequest({
        message: 'Un asesor EXTERNO solo puede pertenecer al canal ASESOR',
      })
    }

    const existing = await agente
      .related('canales')
      .query()
      .where('captacion_canales.id', payload.canalId)
      .pivotColumns(['is_default', 'activo'])
      .first()

    if (existing) {
       Si ya existe, actualiza flags preservando los actuales si no llegan en el payload
      await agente.related('canales').sync(
        {
          [payload.canalId]: {
            is_default: payload.isDefault ?? Boolean(existing.$extras.pivot_is_default),
            activo: payload.activo ?? Boolean(existing.$extras.pivot_activo),
          },
        },
        false // no borres otras relaciones
      )
    } else {
      await agente.related('canales').attach({
        [payload.canalId]: {
          is_default: payload.isDefault ?? false,
          activo: payload.activo ?? true,
        },
      })
    }

    return { ok: true }
  }

  PUT /api/agentes-captacion/:agenteId/canales/:canalId
  async updatePivot({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(upsertSchema)
    const agente = await AgenteCaptacion.findOrFail(params.agenteId)
    const canal = await CaptacionCanal.findOrFail(params.canalId)

    if (agente.tipo === 'ASESOR_EXTERNO' && canal.codigo !== 'ASESOR') {
      return response.badRequest({
        message: 'Un asesor EXTERNO solo puede pertenecer al canal ASESOR',
      })
    }

    await agente.related('canales').sync(
      {
        [Number(params.canalId)]: {
          is_default: payload.isDefault ?? false,
          activo: payload.activo ?? true,
        },
      },
      false // no borrar otras
    )

    return { ok: true }
  }

  DELETE /api/agentes-captacion/:agenteId/canales/:canalId 
  async detach({ params }: HttpContext) {
    const agente = await AgenteCaptacion.findOrFail(params.agenteId)
    await agente.related('canales').detach([Number(params.canalId)])
    return { ok: true }
  }
} **/
