// app/controllers/agentes_convenios_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'

/** Convierte query strings a booleano (true/false) o undefined si no aplica */
function parseBool(q: unknown): boolean | undefined {
  if (q === null || q === undefined) return undefined
  const s = String(q).toLowerCase()
  if (['true', '1'].includes(s)) return true
  if (['false', '0'].includes(s)) return false
  return undefined
}

/**
 * Rutas esperadas:
 *   GET /api/agentes-captacion/:id/convenios?vigente=1&light=0
 * Parámetros:
 *   - vigente: (1|0|true|false) — por defecto 1 (solo asignaciones activas sin fecha_fin)
 *   - light:   (1|0|true|false) — si 1, devuelve solo { id, nombre } de los convenios
 */
export default class AgentesConveniosController {
  public async listByAsesor({ params, request, response }: HttpContext) {
    const asesorId = Number(params.id)
    if (!Number.isFinite(asesorId) || asesorId <= 0) {
      return response.badRequest({ message: 'id de asesor inválido' })
    }

    const vigenteQ = parseBool(request.input('vigente'))
    const soloVigentes = vigenteQ === undefined ? true : vigenteQ
    const light = parseBool(request.input('light')) === true

    try {
      const q = AsesorConvenioAsignacion.query()
        .where('asesor_id', asesorId)
        .preload('convenio', (c) => {
          // En modo "light" necesitamos solo id y nombre
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

      // Normalizamos salida según "light"
      if (light) {
        // Solo convenios vigentes/histórico según filtro: [{ id, nombre }]
        return rows
          .filter((r) => r.convenio)
          .map((r) => ({
            id: r.convenio!.id,
            nombre: r.convenio!.nombre,
          }))
      }

      // Salida completa (con datos del convenio y de la asignación)
      return rows
        .filter((r) => r.convenio)
        .map((r) => ({
          // Convenio
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
          // Si en el futuro agregas vigencias de convenio, mapea aquí:
          vigencia_desde: null,
          vigencia_hasta: null,
          // Datos de la asignación (pivot)
          asignacion: {
            id: r.id,
            fecha_asignacion: r.fechaAsignacion?.toISO?.() ?? null,
            fecha_fin: r.fechaFin?.toISO?.() ?? null,
            activo: r.activo,
            motivo_fin: r.motivoFin ?? null,
          },
        }))
    } catch (err) {
      // Si algo sale mal (incluido nombre de tabla), devolvemos 500 con detalle mínimo
      return response.internalServerError({
        message: 'Error consultando convenios del asesor',
        error: err?.message ?? String(err),
      })
    }
  }
}
