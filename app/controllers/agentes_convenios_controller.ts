
// app/controllers/agentes_convenios_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'

function parseBool(q: unknown): boolean | undefined {
  if (q === null) return undefined
  const s = String(q).toLowerCase()
  if (['true', '1'].includes(s)) return true
  if (['false', '0'].includes(s)) return false
  return undefined
}

export default class AgentesConveniosController {
  /**
   * GET /api/agentes-captacion/:id/convenios?vigente=1
   * Retorna convenios del asesor.
   * - Por defecto, solo vigentes (asignación activa y sin fecha_fin).
   * - Si pasas ?vigente=0 trae todo el historial del asesor.
   */
  public async listByAsesor({ params, request }: HttpContext) {
    const asesorId = Number(params.id)
    const vigenteQ = parseBool(request.input('vigente'))
    const soloVigentes = vigenteQ === undefined ? true : vigenteQ

    const q = AsesorConvenioAsignacion.query()
      .where('asesor_id', asesorId)
      .preload('convenio', (c) => {
        // No asumimos columnas que podrían no existir.
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
      })
      .orderBy('fecha_asignacion', 'desc')

    if (soloVigentes) {
      q.where('activo', true).whereNull('fecha_fin')
    }

    const rows = await q

    // Normalizamos la salida al shape que consume tu front (array puro).
    return rows
      .filter((r) => r.convenio) // por seguridad
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
        // Si algún día agregas columnas de vigencia en convenios, aquí puedes mapearlas.
        vigencia_desde: null,
        vigencia_hasta: null,
        // Datos de la asignación (por si quieres mostrarlos en UI)
        asignacion: {
          id: r.id,
          fecha_asignacion: r.fechaAsignacion?.toISO?.() ?? null,
          fecha_fin: r.fechaFin?.toISO?.() ?? null,
          activo: r.activo,
          motivo_fin: r.motivoFin ?? null,
        },
      }))
  }
}
