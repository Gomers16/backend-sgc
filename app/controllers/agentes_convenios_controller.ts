// app/controllers/agentes_convenios_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'
import AgenteCaptacion from '#models/agente_captacion'

function parseBool(q: unknown): boolean | undefined {
  if (q === null || q === undefined) return undefined
  const s = String(q).toLowerCase()
  if (s === 'true' || s === '1') return true
  if (s === 'false' || s === '0') return false
  return undefined
}

/**
 * GET /api/agentes-captacion/:id/convenios?vigente=1&light=0
 * - Solo permite asesores con tipo = ASESOR_COMERCIAL
 */
export default class AgentesConveniosController {
  public async listByAsesor({ params, request, response }: HttpContext) {
    const asesorId = Number(params.id)
    if (!Number.isFinite(asesorId) || asesorId <= 0) {
      return response.badRequest({ message: 'id de asesor inválido' })
    }

    // ⚠️ Validar que el asesor sea COMERCIAL
    const agente = await AgenteCaptacion.find(asesorId)
    if (!agente) {
      return response.notFound({ message: 'Asesor no encontrado' })
    }
    if (agente.tipo !== 'ASESOR_COMERCIAL') {
      return response.badRequest({
        message:
          'Este listado solo aplica para asesores COMERCIALES. El asesor indicado no es ASESOR_COMERCIAL.',
      })
    }

    const vigenteQ = parseBool(request.input('vigente'))
    const soloVigentes = vigenteQ === undefined ? true : vigenteQ
    const light = parseBool(request.input('light')) === true

    try {
      const q = AsesorConvenioAsignacion.query()
        .where('asesor_id', asesorId)
        .preload('convenio', (c) => {
          if (light) {
            c.select(['id', 'nombre'])
          } else {
            c.select([
              'id',
              'nombre',
              'tipo',
              'doc_tipo',
              'doc_numero',
              'telefono',
              'whatsapp',
              'email',
              'direccion',
              'activo',
            ])
          }
        })
        .orderBy('fecha_asignacion', 'desc')

      if (soloVigentes) {
        q.where('activo', true).whereNull('fecha_fin')
      }

      const rows = await q

      if (light) {
        return rows
          .filter((r) => r.convenio)
          .map((r) => ({ id: r.convenio!.id, nombre: r.convenio!.nombre }))
      }

      return rows
        .filter((r) => r.convenio)
        .map((r) => ({
          id: r.convenio!.id,
          nombre: r.convenio!.nombre,
          tipo: r.convenio!.tipo,
          doc_tipo: r.convenio!.docTipo,
          doc_numero: r.convenio!.docNumero,
          telefono: r.convenio!.telefono,
          whatsapp: r.convenio!.whatsapp,
          email: r.convenio!.email,
          direccion: r.convenio!.direccion,
          activo: r.convenio!.activo,
          vigencia_desde: null,
          vigencia_hasta: null,
          asignacion: {
            id: r.id,
            fecha_asignacion: r.fechaAsignacion?.toISO?.() ?? null,
            fecha_fin: r.fechaFin?.toISO?.() ?? null,
            activo: r.activo,
            motivo_fin: r.motivoFin ?? null,
          },
        }))
    } catch (err: any) {
      return response.internalServerError({
        message: 'Error consultando convenios del asesor',
        error: err?.message ?? String(err),
      })
    }
  }
}
