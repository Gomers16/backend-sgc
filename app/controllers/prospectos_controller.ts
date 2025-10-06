// app/controllers/prospectos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Prospecto from '#models/prospecto'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'
import AsesorProspectoAsignacion from '#models/asesor_prospecto_asignacion'
import { DateTime } from 'luxon'

function normPlaca(raw?: string | null): string | null {
  if (!raw) return null
  return raw.toUpperCase().replace(/[\s-]+/g, '')
}
function normTel(raw?: string | null): string | null {
  if (!raw) return null
  return raw.replace(/\D+/g, '')
}

export default class ProspectosController {
  /** Crear prospecto (mínimos: placa, telefono, nombre) */
  public async store({ request, response, auth }: HttpContext) {
    const body = request.only([
      'placa',
      'telefono',
      'nombre',
      'convenioId',
      'origen',
      'soatVigente',
      'soatVencimiento',
      'tecnoVigente',
      'tecnoVencimiento',
      'observaciones',
    ])

    const placa = normPlaca(body.placa)
    const telefono = normTel(body.telefono)
    const nombre = (body.nombre ?? '').trim()
    if (!placa || !telefono || !nombre) {
      return response.badRequest({
        message: 'placa, telefono y nombre son obligatorios',
        details: { placa: !!placa, telefono: !!telefono, nombre: !!nombre },
      })
    }

    const soatVenc = body.soatVencimiento ? DateTime.fromISO(body.soatVencimiento) : null
    const tecnoVenc = body.tecnoVencimiento ? DateTime.fromISO(body.tecnoVencimiento) : null

    const prospecto = await Prospecto.create({
      convenioId: body.convenioId ?? null,
      placa,
      telefono,
      nombre,
      origen: (body.origen as Prospecto['origen']) ?? 'OTRO',
      creadoPor: auth?.user?.id ?? null,
      soatVigente: !!body.soatVigente,
      soatVencimiento: soatVenc && soatVenc.isValid ? soatVenc : null,
      tecnoVigente: !!body.tecnoVigente,
      tecnoVencimiento: tecnoVenc && tecnoVenc.isValid ? tecnoVenc : null,
      observaciones: body.observaciones ?? null,
    })

    return response.created(prospecto)
  }

  /** Editar prospecto */
  public async update({ request, params, response }: HttpContext) {
    const id = Number(params.id)
    const prospecto = await Prospecto.find(id)
    if (!prospecto) return response.notFound({ message: 'Prospecto no encontrado' })

    const body = request.only([
      'placa',
      'telefono',
      'nombre',
      'convenioId',
      'origen',
      'soatVigente',
      'soatVencimiento',
      'tecnoVigente',
      'tecnoVencimiento',
      'observaciones',
    ])

    if (body.placa !== undefined) prospecto.placa = normPlaca(body.placa)
    if (body.telefono !== undefined) prospecto.telefono = normTel(body.telefono)
    if (body.nombre !== undefined) prospecto.nombre = (body.nombre ?? null)?.trim() || null
    if (body.convenioId !== undefined) prospecto.convenioId = body.convenioId ?? null
    if (body.origen !== undefined) prospecto.origen = body.origen as any

    if (body.soatVigente !== undefined) prospecto.soatVigente = !!body.soatVigente
    if (body.soatVencimiento !== undefined) {
      const d = body.soatVencimiento ? DateTime.fromISO(body.soatVencimiento) : null
      prospecto.soatVencimiento = d && d.isValid ? d : null
    }
    if (body.tecnoVigente !== undefined) prospecto.tecnoVigente = !!body.tecnoVigente
    if (body.tecnoVencimiento !== undefined) {
      const d = body.tecnoVencimiento ? DateTime.fromISO(body.tecnoVencimiento) : null
      prospecto.tecnoVencimiento = d && d.isValid ? d : null
    }
    if (body.observaciones !== undefined) prospecto.observaciones = body.observaciones ?? null

    await prospecto.save()
    return prospecto
  }

  /** Listado con filtros simples */
  public async index({ request }: HttpContext) {
    const { convenioId, vencenEnDias, soat, tecno, q, creadoPor } = request.qs()
    const query = Prospecto.query()

    if (convenioId) query.where('convenio_id', Number(convenioId))
    if (creadoPor) query.where('creado_por', Number(creadoPor))

    const dias = Number(vencenEnDias)
    if (!Number.isNaN(dias) && dias > 0 && (soat === 'true' || tecno === 'true')) {
      const hoy = DateTime.now().startOf('day')
      const hasta = hoy.plus({ days: dias })
      query.where((grp) => {
        if (soat === 'true') {
          grp.where((sub) => {
            sub
              .where('soat_vigente', true)
              .whereNotNull('soat_vencimiento')
              .whereBetween('soat_vencimiento', [hoy.toISODate()!, hasta.toISODate()!])
          })
        }
        if (tecno === 'true') {
          grp.orWhere((sub) => {
            sub
              .where('tecno_vigente', true)
              .whereNotNull('tecno_vencimiento')
              .whereBetween('tecno_vencimiento', [hoy.toISODate()!, hasta.toISODate()!])
          })
        }
      })
    }

    if (q) {
      const like = `%${String(q).trim().toUpperCase()}%`
      query.where((sub) => {
        sub
          .whereRaw('UPPER(placa) LIKE ?', [like])
          .orWhereRaw('UPPER(nombre) LIKE ?', [like])
          .orWhere('telefono', 'like', `%${String(q).replace(/\D+/g, '')}%`)
      })
    }

    query.orderBy('updated_at', 'desc').limit(200)
    return query.exec()
  }

  /** Resumen por asesor (convenios + conteo de prospectos asignados activos) */
  public async resumenByAsesor({ params }: HttpContext) {
    const asesorId = Number(params.id)

    const [{ 'count(*)': asignTotStr }] = await AsesorConvenioAsignacion.query()
      .where('asesor_id', asesorId)
      .count('*')

    const [{ 'count(*)': vigStr }] = await AsesorConvenioAsignacion.query()
      .where('asesor_id', asesorId)
      .where('activo', true)
      .whereNull('fecha_fin')
      .count('*')

    const hoyIni = DateTime.now().startOf('day')
    const hoyFin = DateTime.now().endOf('day')
    const mesIni = DateTime.now().startOf('month')
    const mesFin = DateTime.now().endOf('month')

    // Sólo asignaciones activas cuentan
    const base = AsesorProspectoAsignacion.query().where('asesor_id', asesorId).where('activo', true)

    const [{ 'count(*)': totStr }] = await base.clone().count('*')
    const [{ 'count(*)': hoyStr }] = await base
      .clone()
      .whereBetween('fecha_asignacion', [hoyIni.toJSDate(), hoyFin.toJSDate()])
      .count('*')
    const [{ 'count(*)': mesStr }] = await base
      .clone()
      .whereBetween('fecha_asignacion', [mesIni.toJSDate(), mesFin.toJSDate()])
      .count('*')

    return {
      convenios: {
        vigentes: Number(vigStr ?? 0),
        asignaciones: Number(asignTotStr ?? 0),
        total: Number(asignTotStr ?? 0),
      },
      prospectos: {
        total: Number(totStr ?? 0),
        hoy: Number(hoyStr ?? 0),
        mes: Number(mesStr ?? 0),
      },
    }
  }

  /** 👉 Listar prospectos de un asesor (usado por el modal) */
  public async listByAsesor({ params, request }: HttpContext) {
    const asesorId = Number(params.id)
    const vigente = String(request.input('vigente', '1')) // 1 = sólo asignaciones activas
    const q = Prospecto.query()
      .join('asesor_prospecto_asignaciones as apa', 'apa.prospecto_id', 'prospectos.id')
      .where('apa.asesor_id', asesorId)
      .select('prospectos.*')
      .orderBy('prospectos.updated_at', 'desc')
      .limit(500)

    if (vigente === '1') q.andWhere('apa.activo', true).andWhereNull('apa.fecha_fin')

    return await q
  }
}
