// app/controllers/agentes_captacion_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import AgenteCaptacion from '#models/agente_captacion'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'
import AsesorProspectoAsignacion from '#models/asesor_prospecto_asignacion'
import Prospecto from '#models/prospecto'

/* ========= Helpers ========= */
function normalizePhone(value?: string) {
  return value ? value.replace(/\D/g, '') : value
}

// ✅ ÚNICOS tipos válidos (alineados a tu enum de la migración)
const TIPOS = new Set(['ASESOR_COMERCIAL', 'ASESOR_CONVENIO', 'ASESOR_TELEMERCADEO'])
const DOC_TIPOS = new Set(['CC', 'NIT'])

// Fragmento SQL que calcula "activo" en función del tipo:
// - COMERCIAL o TELEMERCADEO ⟶ usuarios.estado === 'activo'
// - CONVENIO               ⟶ agentes_captacions.activo
const ACTIVO_CALC_SQL = `
  CASE
    WHEN agentes_captacions.tipo IN ('ASESOR_COMERCIAL','ASESOR_TELEMERCADEO')
      THEN (usuarios.estado = 'activo')
    ELSE agentes_captacions.activo
  END
`

export default class AgentesCaptacionController {
  /**
   * GET /agentes-captacion/by-user/:userId
   * Retorna el agente activo (calculado) asociado a un usuario específico (SIN usar auth).
   */
  public async byUser({ params, response }: HttpContext) {
    const userId = Number(params.userId)
    if (!Number.isFinite(userId)) {
      return response.badRequest({ message: 'userId inválido' })
    }

    const row = await AgenteCaptacion.query()
      .where('agentes_captacions.usuario_id', userId)
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select('agentes_captacions.*', db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`))
      .first()

    if (!row) {
      return response.notFound({
        message: 'No hay agente de captación vinculado a este usuario',
        usuario_id: userId,
      })
    }

    const plain = row.serialize()
    const activo =
      plain.activo_calc === true || plain.activo_calc === 1 || plain.activo_calc === '1'
    return { ...plain, activo }
  }

  /**
   * GET /agentes-captacion?page=1&perPage=20&q=juan&tipo=ASESOR_CONVENIO&activo=true
   * Lista paginada con "activo" calculado.
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 20)), 100)
    const q = String(request.input('q', '') || '').trim()
    const tipo = String(request.input('tipo', '') || '').trim()
    const activoParam = request.input('activo') // 'true' | 'false' | 1 | 0 | '' | undefined

    // Ordenamiento opcional
    const sortBy = String(request.input('sortBy', 'id')).trim()
    const orderRaw = String(request.input('order', 'asc')).toLowerCase()
    const order: 'asc' | 'desc' = orderRaw === 'desc' ? 'desc' : 'asc'
    const SORTABLE = new Set(['id', 'nombre', 'tipo', 'telefono', 'doc_numero', 'created_at', 'updated_at'])
    const sortCol = SORTABLE.has(sortBy) ? sortBy : 'id'

    const query = AgenteCaptacion.query()
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select('agentes_captacions.*', db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`))
      .orderBy(`agentes_captacions.${sortCol}`, order)

    if (q) {
      query.where((qb) => {
        qb.where('agentes_captacions.nombre', 'like', `%${q}%`)
          .orWhere('agentes_captacions.telefono', 'like', `%${q}%`)
          .orWhere('agentes_captacions.doc_numero', 'like', `%${q}%`)
      })
    }

    if (TIPOS.has(tipo)) {
      query.andWhere('agentes_captacions.tipo', tipo as any)
    }

    // Filtro por activo sobre activo calculado
    if (activoParam !== undefined && activoParam !== '') {
      const val = String(activoParam).toLowerCase()
      if (['true', '1', 'activo'].includes(val)) {
        query.andWhereRaw(`${ACTIVO_CALC_SQL} = TRUE`)
      } else if (['false', '0', 'inactivo'].includes(val)) {
        query.andWhereRaw(`${ACTIVO_CALC_SQL} = FALSE`)
      }
    }

    const pageResult = await query.paginate(page, perPage)
    const serialized = pageResult.serialize()

    serialized.data = serialized.data.map((row: any) => {
      const activo = row.activo_calc === true || row.activo_calc === 1 || row.activo_calc === '1'
      return { ...row, activo }
    })

    return serialized
  }

  /** GET /agentes-captacion/:id  (con activo calculado) */
  public async show({ params, response }: HttpContext) {
    const row = await AgenteCaptacion.query()
      .where('agentes_captacions.id', params.id)
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select('agentes_captacions.*', db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`))
      .first()

    if (!row) return response.notFound({ message: 'Agente no encontrado' })

    const plain = row.serialize()
    const activo = plain.activo_calc === true || plain.activo_calc === 1 || plain.activo_calc === '1'
    return { ...plain, activo }
  }

  /**
   * ⭐ GET /agentes-captacion/me
   * Devuelve el agente vinculado al usuario autenticado, con activo calculado.
   */
  public async me({ auth, response }: HttpContext) {
    if (!auth?.user?.id) {
      return response.unauthorized({ message: 'No autenticado' })
    }
    const row = await AgenteCaptacion.query()
      .where('agentes_captacions.usuario_id', auth.user.id)
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select('agentes_captacions.*', db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`))
      .first()

    if (!row) {
      return response.notFound({
        message: 'No hay agente de captación vinculado a este usuario',
        usuario_id: auth.user.id,
      })
    }

    const plain = row.serialize()
    const activo = plain.activo_calc === true || plain.activo_calc === 1 || plain.activo_calc === '1'
    return { ...plain, activo }
  }

  /**
   * POST /agentes-captacion
   * body: { tipo, nombre, telefono?, doc_tipo?, doc_numero?, activo?, usuario_id? }
   */
  public async store({ request, response }: HttpContext) {
    let { tipo, nombre, telefono, doc_tipo, doc_numero, activo, usuario_id } = request.only([
      'tipo',
      'nombre',
      'telefono',
      'doc_tipo',
      'doc_numero',
      'activo',
      'usuario_id',
    ])

    if (!tipo || !TIPOS.has(tipo)) {
      return response.badRequest({
        message:
          'tipo inválido (ASESOR_COMERCIAL | ASESOR_CONVENIO | ASESOR_TELEMERCADEO)',
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
      usuarioId: usuario_id ?? null,
      // activo físico solo aplica en convenios; por defecto true
      activo: typeof activo === 'boolean' ? activo : true,
    })

    return response.created(created)
  }

  /**
   * PUT /agentes-captacion/:id
   * body parcial: { tipo?, nombre?, telefono?, doc_tipo?, doc_numero?, activo?, usuario_id? }
   * Nota: activo SOLO se actualiza si tipo === ASESOR_CONVENIO (para no romper sincronía con usuarios).
   */
  public async update({ params, request, response }: HttpContext) {
    const item = await AgenteCaptacion.find(params.id)
    if (!item) return response.notFound({ message: 'Agente no encontrado' })

    const payload = request.only([
      'tipo',
      'nombre',
      'telefono',
      'doc_tipo',
      'doc_numero',
      'activo',
      'usuario_id',
    ])

    if (payload.tipo !== undefined) {
      if (!TIPOS.has(payload.tipo)) return response.badRequest({ message: 'tipo inválido' })
      item.tipo = payload.tipo
    }

    if (payload.nombre !== undefined) {
      if (!payload.nombre) return response.badRequest({ message: 'nombre no puede ser vacío' })
      item.nombre = String(payload.nombre).trim()
    }

    if (payload.telefono !== undefined) {
      item.telefono = normalizePhone(payload.telefono) || null
    }

    if (payload.usuario_id !== undefined) {
      item.usuarioId = payload.usuario_id ?? null
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

    // 🔒 activo solo editable para ASESOR_CONVENIO
    if (payload.activo !== undefined) {
      if (item.tipo === 'ASESOR_CONVENIO') {
        const v = String(payload.activo).toLowerCase()
        item.activo = ['true', '1'].includes(v)
          ? true
          : ['false', '0'].includes(v)
            ? false
            : item.activo
      } else {
        // Ignorar para comerciales/telemercadeo (depende de usuarios.estado)
      }
    }

    await item.save()
    return item
  }

  /**
   * DELETE /agentes-captacion/:id
   * Bloquea si existen dateos que lo referencien
   */
  public async destroy({ params, response }: HttpContext) {
    const item = await AgenteCaptacion.find(params.id)
    if (!item) return response.notFound({ message: 'Agente no encontrado' })

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

  /** GET /agentes-captacion/:id/resumen  */
  public async resumen({ params }: HttpContext) {
    const asesorId = Number(params.id)

    // Convenios
    const [{ 'count(*)': convTotStr }] = await AsesorConvenioAsignacion.query()
      .where('asesor_id', asesorId)
      .count('*')

    const [{ 'count(*)': convVigStr }] = await AsesorConvenioAsignacion.query()
      .where('asesor_id', asesorId)
      .where('activo', true)
      .whereNull('fecha_fin')
      .count('*')

    // Prospectos
    const hoyIni = DateTime.now().startOf('day').toJSDate()
    const hoyFin = DateTime.now().endOf('day').toJSDate()
    const mesIni = DateTime.now().startOf('month').toJSDate()
    const mesFin = DateTime.now().endOf('month').toJSDate()

    const [{ 'count(*)': prosVigStr }] = await AsesorProspectoAsignacion.query()
      .where('asesor_id', asesorId)
      .where('activo', true)
      .whereNull('fecha_fin')
      .count('*')

    const [{ 'count(*)': prosHoyStr }] = await AsesorProspectoAsignacion.query()
      .where('asesor_id', asesorId)
      .whereBetween('fecha_asignacion', [hoyIni, hoyFin])
      .count('*')

    const [{ 'count(*)': prosMesStr }] = await AsesorProspectoAsignacion.query()
      .where('asesor_id', asesorId)
      .whereBetween('fecha_asignacion', [mesIni, mesFin])
      .count('*')

    return {
      convenios: {
        total: Number(convTotStr ?? 0),
        vigentes: Number(convVigStr ?? 0),
      },
      prospectos: {
        total: Number(prosVigStr ?? 0), // si quieres total histórico, cambia la consulta
        vigentes: Number(prosVigStr ?? 0),
        hoy: Number(prosHoyStr ?? 0),
        mes: Number(prosMesStr ?? 0),
      },
    }
  }

  /** GET /agentes-captacion/:id/prospectos?vigente=1&q=… */
  public async prospectos({ params, request }: HttpContext) {
    const asesorId = Number(params.id)
    const vigente = String(request.input('vigente', '1')) === '1'
    const q = String(request.input('q', '') || '').trim()

    const query = Prospecto.query()
      .join('asesor_prospecto_asignaciones as apa', 'apa.prospecto_id', 'prospectos.id')
      .where('apa.asesor_id', asesorId)
      .select('prospectos.*')
      .orderBy('prospectos.updated_at', 'desc')

    if (vigente) query.where('apa.activo', true).whereNull('apa.fecha_fin')

    if (q) {
      const like = `%${q.toUpperCase()}%`
      query.where((sub) => {
        sub
          .whereRaw('UPPER(prospectos.placa) LIKE ?', [like])
          .orWhereRaw('UPPER(prospectos.nombre) LIKE ?', [like])
          .orWhere('prospectos.telefono', 'like', `%${q.replace(/\D+/g, '')}%`)
      })
    }

    return query.exec()
  }

  /** GET /agentes-captacion/light?activos=1&select=id,nombre,tipo */
  public async light({ request, response }: HttpContext) {
    const activos = String(request.input('activos', '1')) === '1'
    const selectRaw = String(request.input('select', 'id,nombre,tipo'))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const cols = selectRaw.length ? selectRaw : ['id', 'nombre', 'tipo']

    const rows = await db
      .from('agentes_captacions')
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select(
        ...cols.map((c) => `agentes_captacions.${c}`),
        db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`)
      )
      .modify((qb) => {
        if (activos) {
          qb.whereRaw(`${ACTIVO_CALC_SQL} = TRUE`)
        }
      })

    const data = rows.map((r: any) => {
      const activo = r.activo_calc === true || r.activo_calc === 1 || r.activo_calc === '1'
      return { ...r, activo }
    })

    return response.ok({ data })
  }

  /**
   * ✅ GET /agentes-captacion/:id/convenios?vigente=1
   * Devuelve los convenios asociados al asesor. Si `vigente=1`, solo los activos (pivot activo y sin fecha_fin).
   * Devuelve un arreglo tipo: [{ id, nombre, ...pivot }]
   */
  public async conveniosByAgente({ params, request }: HttpContext) {
    const asesorId = Number(params.id)
    const vigente = String(request.input('vigente', '1')) === '1'

    const rows = await db
      .from('convenios')
      .join('asesor_convenio_asignaciones as aca', 'aca.convenio_id', 'convenios.id')
      .where('aca.asesor_id', asesorId)
      .if(vigente, (qb) => qb.where('aca.activo', true).whereNull('aca.fecha_fin'))
      .select(
        'convenios.id',
        'convenios.nombre',
        'convenios.activo',
        'aca.activo as pivot_activo',
        'aca.fecha_inicio as pivot_fecha_inicio',
        'aca.fecha_fin as pivot_fecha_fin'
      )
      .orderBy('convenios.nombre', 'asc')

    return rows
  }
}
