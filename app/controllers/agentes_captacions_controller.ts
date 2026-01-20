// app/controllers/agentes_captacions_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import AgenteCaptacion from '#models/agente_captacion'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'
import AsesorProspectoAsignacion from '#models/asesor_prospecto_asignacion'
import Prospecto from '#models/prospecto'

// 👇 nuevos imports para la ficha comercial
import CaptacionDateo from '#models/captacion_dateo'
import Comision from '#models/comision'
import TurnoRtm from '#models/turno_rtm'

/* ========= Helpers ========= */
function normalizePhone(value?: string) {
  return value ? value.replace(/\D/g, '') : value
}

const TIPOS = new Set(['ASESOR_COMERCIAL', 'ASESOR_CONVENIO', 'ASESOR_TELEMERCADEO'])
const DOC_TIPOS = new Set(['CC', 'NIT'])

/** ✅ Calcula activo:
 *  - COMERCIAL / TELEMERCADEO → LOWER(usuarios.estado) = 'activo'
 *  - CONVENIO → agentes_captacions.activo
 *  Devuelve SIEMPRE 1/0 para evitar ambigüedad con boolean/ints.
 */
const ACTIVO_CALC_SQL = `
  CASE
    WHEN agentes_captacions.tipo IN ('ASESOR_COMERCIAL','ASESOR_TELEMERCADEO')
      THEN CASE WHEN LOWER(usuarios.estado) = 'activo' THEN 1 ELSE 0 END
    ELSE CASE WHEN agentes_captacions.activo = TRUE THEN 1 ELSE 0 END
  END
`

// ✅ ACTUALIZADO: Serializa con datos del usuario Y del agente
function rowToPlainWithActivo(model: AgenteCaptacion) {
  const base = model.serialize() as any
  const extras = (model as any).$extras || {}

  const activo = Number(extras.activo_calc) === 1

  const result: any = { ...base, activo }

  // ✅ CORREO: del usuario (desde LEFT JOIN)
  if (extras.usuario_correo !== undefined) {
    result.email = extras.usuario_correo
    result.correo = extras.usuario_correo
  }

  if (extras.usuario_correo_personal !== undefined) {
    result.correoPersonal = extras.usuario_correo_personal
    result.emailPersonal = extras.usuario_correo_personal
  }

  // ✅ DOCUMENTO: del agente (ya viene en base desde agentes_captacions.*)
  // Normalizar keys snake_case y camelCase
  if (base.doc_tipo || base.docTipo) {
    result.doc_tipo = base.doc_tipo || base.docTipo
    result.docTipo = base.doc_tipo || base.docTipo
  }

  if (base.doc_numero || base.docNumero) {
    result.doc_numero = base.doc_numero || base.docNumero
    result.docNumero = base.doc_numero || base.docNumero
  }

  // ✅ TELÉFONO: normalizar
  if (base.telefono) {
    result.telefono = base.telefono
  }

  // 🔍 DEBUG: Log para verificar qué datos se están devolviendo
  console.log('🔍 rowToPlainWithActivo:', {
    id: result.id,
    nombre: result.nombre,
    email: result.email,
    correo: result.correo,
    doc_tipo: result.doc_tipo,
    doc_numero: result.doc_numero,
    telefono: result.telefono,
    activo: result.activo,
  })

  return result
}

export default class AgentesCaptacionController {
  /** GET /agentes-captacion/by-user/:userId */
  public async byUser({ params, response }: HttpContext) {
    const userId = Number(params.userId)
    if (!Number.isFinite(userId)) return response.badRequest({ message: 'userId inválido' })

    const row = await AgenteCaptacion.query()
      .where('agentes_captacions.usuario_id', userId)
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select(
        'agentes_captacions.*',
        db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`),
        'usuarios.correo AS usuario_correo',
        'usuarios.correo_personal AS usuario_correo_personal'
      )
      .first()

    if (!row) {
      return response.notFound({
        message: 'No hay agente de captación vinculado a este usuario',
        usuario_id: userId,
      })
    }

    return rowToPlainWithActivo(row)
  }

  /**
   * GET /agentes-captacion?page=1&perPage=20&q=juan&tipo=ASESOR_CONVENIO&activo=true
   */
  public async index({ request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Math.min(Number(request.input('perPage', 20)), 100)
    const q = String(request.input('q', '') || '').trim()
    const tipo = String(request.input('tipo', '') || '').trim()
    const activoParam = request.input('activo')

    const SORTABLE = new Set([
      'id',
      'nombre',
      'tipo',
      'telefono',
      'doc_numero',
      'created_at',
      'updated_at',
    ])
    const sortByReq = String(request.input('sortBy', 'id')).trim()
    const sortBy = SORTABLE.has(sortByReq) ? sortByReq : 'id'
    const orderRaw = String(request.input('order', 'asc')).toLowerCase()
    const order: 'asc' | 'desc' = orderRaw === 'desc' ? 'desc' : 'asc'

    const qbuilder = AgenteCaptacion.query()
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select(
        'agentes_captacions.*',
        db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`),
        'usuarios.correo AS usuario_correo',
        'usuarios.correo_personal AS usuario_correo_personal'
      )
      .orderBy(`agentes_captacions.${sortBy}`, order)

    if (q) {
      qbuilder.where((qb) => {
        qb.where('agentes_captacions.nombre', 'like', `%${q}%`)
          .orWhere('agentes_captacions.telefono', 'like', `%${q}%`)
          .orWhere('agentes_captacions.doc_numero', 'like', `%${q}%`)
      })
    }

    if (TIPOS.has(tipo)) {
      qbuilder.andWhere('agentes_captacions.tipo', tipo as any)
    }

    if (activoParam !== undefined && activoParam !== '') {
      const val = String(activoParam).toLowerCase()
      if (['true', '1', 'activo'].includes(val)) {
        qbuilder.andWhereRaw(`${ACTIVO_CALC_SQL} = 1`)
      } else if (['false', '0', 'inactivo'].includes(val)) {
        qbuilder.andWhereRaw(`${ACTIVO_CALC_SQL} = 0`)
      }
    }

    const paginator = await qbuilder.paginate(page, perPage)

    const data = paginator.all().map(rowToPlainWithActivo)
    const meta = paginator.getMeta()

    return { data, ...meta }
  }

  /** GET /agentes-captacion/:id */
  public async show({ params, response, auth }: HttpContext) {
    const row = await AgenteCaptacion.query()
      .where('agentes_captacions.id', params.id)
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select(
        'agentes_captacions.*',
        db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`),
        'usuarios.correo AS usuario_correo',
        'usuarios.correo_personal AS usuario_correo_personal'
      )
      .first()

    if (!row) return response.notFound({ message: 'Agente no encontrado' })

    // 🔐 VALIDACIÓN: Si es COMERCIAL, solo puede ver su propia ficha
    const userRole = auth.user?.rol?.nombre
    if (userRole === 'COMERCIAL') {
      if (!auth.user?.id) {
        return response.unauthorized({ message: 'Usuario no autenticado' })
      }

      const userAgenteRow = await db
        .from('agentes_captacions')
        .where('usuario_id', auth.user.id)
        .select('id')
        .first()

      const userAgenteId = userAgenteRow?.id

      console.log('🔍 Validación COMERCIAL:', {
        userRole,
        userId: auth.user.id,
        userAgenteId,
        requestedId: row.id,
        allowed: userAgenteId && Number(row.id) === Number(userAgenteId),
      })

      if (!userAgenteId || Number(row.id) !== Number(userAgenteId)) {
        return response.forbidden({
          message:
            'No tienes permiso para ver esta ficha comercial. Solo puedes ver tu propia ficha.',
        })
      }
    }

    return rowToPlainWithActivo(row)
  }

  /** GET /agentes-captacion/me */
  public async me({ auth, response }: HttpContext) {
    if (!auth?.user?.id) {
      return response.unauthorized({ message: 'No autenticado' })
    }

    const row = await AgenteCaptacion.query()
      .where('agentes_captacions.usuario_id', auth.user.id)
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select(
        'agentes_captacions.*',
        db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`),
        'usuarios.correo AS usuario_correo',
        'usuarios.correo_personal AS usuario_correo_personal'
      )
      .first()

    if (!row) {
      return response.notFound({
        message: 'No hay agente de captación vinculado a este usuario',
        usuario_id: auth.user.id,
      })
    }

    return rowToPlainWithActivo(row)
  }

  /** POST /agentes-captacion */
  public async store({ request, response }: HttpContext) {
    let {
      tipo,
      nombre,
      telefono,
      doc_tipo: docTipo,
      doc_numero: docNumero,
      activo,
      usuario_id: usuarioId,
    } = request.only([
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
        message: 'tipo inválido (ASESOR_COMERCIAL | ASESOR_CONVENIO | ASESOR_TELEMERCADEO)',
      })
    }
    if (!nombre) return response.badRequest({ message: 'nombre es requerido' })

    telefono = normalizePhone(telefono)

    if (docTipo && !DOC_TIPOS.has(docTipo)) {
      return response.badRequest({ message: 'doc_tipo inválido (CC | NIT)' })
    }

    if (docTipo && docNumero) {
      const exists = await AgenteCaptacion.query()
        .where('doc_tipo', docTipo)
        .andWhere('doc_numero', String(docNumero).trim())
        .first()
      if (exists) return response.conflict({ message: 'Documento ya existe' })
    }

    const created = await AgenteCaptacion.create({
      tipo,
      nombre: String(nombre).trim(),
      telefono: telefono || null,
      docTipo: docTipo || null,
      docNumero: docNumero ? String(docNumero).trim() : null,
      usuarioId: usuarioId ?? null,
      activo: typeof activo === 'boolean' ? activo : true,
    })

    return response.created(created)
  }

  /** PUT /agentes-captacion/:id */
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

    if (payload.activo !== undefined && item.tipo === 'ASESOR_CONVENIO') {
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

  /** DELETE /agentes-captacion/:id */
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

  /** GET /agentes-captacion/:id/resumen */
  public async resumen({ params }: HttpContext) {
    const asesorId = Number(params.id)

    const convTotResult = await AsesorConvenioAsignacion.query()
      .where('asesor_id', asesorId)
      .count('* as total')

    const convTotStr = convTotResult[0].$extras.total

    const convVigResult = await AsesorConvenioAsignacion.query()
      .where('asesor_id', asesorId)
      .where('activo', true)
      .whereNull('fecha_fin')
      .count('* as total')
    const convVigStr = convVigResult[0].$extras.total

    const hoyIni = DateTime.now().startOf('day').toJSDate()
    const hoyFin = DateTime.now().endOf('day').toJSDate()
    const mesIni = DateTime.now().startOf('month').toJSDate()
    const mesFin = DateTime.now().endOf('month').toJSDate()

    const prosVigResult = await AsesorProspectoAsignacion.query()
      .where('asesor_id', asesorId)
      .where('activo', true)
      .whereNull('fecha_fin')
      .count('* as total')
    const prosVigStr = prosVigResult[0].$extras.total

    const prosHoyResult = await AsesorProspectoAsignacion.query()
      .where('asesor_id', asesorId)
      .whereBetween('fecha_asignacion', [hoyIni, hoyFin])
      .count('* as total')
    const prosHoyStr = prosHoyResult[0].$extras.total

    const prosMesResult = await AsesorProspectoAsignacion.query()
      .where('asesor_id', asesorId)
      .whereBetween('fecha_asignacion', [mesIni, mesFin])
      .count('* as total')
    const prosMesStr = prosMesResult[0].$extras.total

    return {
      convenios: {
        total: Number(convTotStr ?? 0),
        vigentes: Number(convVigStr ?? 0),
      },
      prospectos: {
        total: Number(prosVigStr ?? 0),
        vigentes: Number(prosVigStr ?? 0),
        hoy: Number(prosHoyStr ?? 0),
        mes: Number(prosMesStr ?? 0),
      },
    }
  }

  /** GET /agentes-captacion/:id/prospectos?vigente=1&q=... */
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

    let query = db
      .from('agentes_captacions')
      .leftJoin('usuarios', 'usuarios.id', 'agentes_captacions.usuario_id')
      .select(
        ...cols.map((c) => `agentes_captacions.${c}`),
        db.raw(`${ACTIVO_CALC_SQL} AS activo_calc`)
      )

    if (activos) {
      query = query.whereRaw(`${ACTIVO_CALC_SQL} = 1`)
    }

    const rows = await query

    const data = rows.map((r: any) => {
      const activo = Number(r.activo_calc) === 1
      return { ...r, activo }
    })

    return response.ok({ data })
  }

  /** GET /agentes-captacion/:id/convenios?vigente=1 */
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

  /** ✅ NUEVO:
   * GET /agentes-captacion/:id/dateos-detalle?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
   * Devuelve los dateos del asesor + info del turno + monto de comisiones.
   */
  public async dateosDetalle({ params, request }: HttpContext) {
    const asesorId = Number(params.id)

    const desdeStr = request.input('desde') as string | undefined
    const hastaStr = request.input('hasta') as string | undefined

    let desdeSql: string | null = null
    let hastaSql: string | null = null

    if (desdeStr) {
      const d = DateTime.fromISO(desdeStr + 'T00:00:00')
      if (d.isValid) desdeSql = d.toSQL()
    }
    if (hastaStr) {
      const h = DateTime.fromISO(hastaStr + 'T23:59:59')
      if (h.isValid) hastaSql = h.toSQL()
    }

    const q = CaptacionDateo.query().where((qb) => {
      qb.where('asesor_id', asesorId)
        .orWhere('agente_id', asesorId)
        .orWhere('creado_por', asesorId)
        .orWhere('user_id', asesorId)
    })

    if (desdeSql) q.where('created_at', '>=', desdeSql)
    if (hastaSql) q.where('created_at', '<=', hastaSql)

    const dateos = await q

    const result = await Promise.all(
      dateos.map(async (d) => {
        const sumRow = await Comision.query()
          .where('captacion_dateo_id', d.id)
          .where('asesor_id', asesorId)
          .sum('monto as total')
          .first()

        const montoComision = Number(sumRow?.$extras.total || 0)

        const turno = await TurnoRtm.query()
          .where('captacion_dateo_id', d.id)
          .select(['id', 'turno_numero', 'turno_codigo', 'placa', 'estado'])
          .first()

        const tAny = turno as any
        const turnoId = turno?.id ?? null
        const turnoNumero = tAny?.turnoNumero ?? tAny?.turno_numero ?? null
        const turnoCodigo = tAny?.turnoCodigo ?? tAny?.turno_codigo ?? null
        const turnoEstado = tAny?.estado ?? null
        const turnoPlaca = tAny?.placa ?? null

        const r = String((d as any).resultado || '').toUpperCase()
        const exitosoFlag =
          (d as any).exitoso === true ||
          (d as any).consumidoExitoso === true ||
          ['EXITOSO', 'COMPLETADO', 'ATENDIDO', 'CONVERTIDO'].includes(r) ||
          montoComision > 0

        const createdAtIso = (d as any).createdAt?.toISO?.() ?? (d as any).created_at ?? null

        return {
          id: d.id,
          canal: (d as any).canal ?? null,
          placa: (d as any).placa ?? turnoPlaca ?? null,
          telefono: (d as any).telefono ?? null,
          resultado: (d as any).resultado ?? null,
          exitoso: exitosoFlag,
          turno_id: turnoId,
          turno_numero: turnoNumero,
          turno_codigo: turnoCodigo,
          turno_estado: turnoEstado,
          monto: montoComision,
          created_at: createdAtIso,
        }
      })
    )

    return { data: result }
  }
}
