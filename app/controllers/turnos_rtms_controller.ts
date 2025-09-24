// app/controllers/turnos_rtms_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import ExcelJS from 'exceljs'
import Database from '@adonisjs/lucid/services/db'

import TurnoRtm from '#models/turno_rtm'
import Usuario from '#models/usuario'
import Servicio from '#models/servicio'
import Vehiculo from '#models/vehiculo'
import Cliente from '#models/cliente'
import CaptacionDateo from '#models/captacion_dateo'

// ===== Helpers =====
const toMySQL = (dt: DateTime) => dt.toFormat('yyyy-LL-dd HH:mm:ss')   // DATETIME (sin ms/offset)
const toMySQLDate = (dt: DateTime) => dt.toFormat('yyyy-LL-dd')        // DATE

type TipoVehiculoDB = 'Liviano Particular' | 'Liviano Taxi' | 'Liviano Público' | 'Motocicleta'
const VALID_TIPOS_VEHICULO: TipoVehiculoDB[] = [
  'Liviano Particular',
  'Liviano Taxi',
  'Liviano Público',
  'Motocicleta',
]

type CanalAtrib = 'FACHADA' | 'ASESOR' | 'TELE' | 'REDES'

function normalizePlaca(v?: string) {
  return v ? v.replace(/[\s-]/g, '').toUpperCase() : v
}
function normalizePhone(v?: string) {
  return v ? v.replace(/\D/g, '') : v
}
function parseHoraIngresoToHHmm(h: string): string | null {
  const asHHmm = DateTime.fromFormat(h, 'HH:mm', { zone: 'America/Bogota' })
  if (asHHmm.isValid) return asHHmm.toFormat('HH:mm')
  const asHHmmss = DateTime.fromFormat(h, 'HH:mm:ss', { zone: 'America/Bogota' })
  if (asHHmmss.isValid) return asHHmmss.toFormat('HH:mm')
  return null
}

/** Ventanas de bloqueo por servicio (en meses) */
function bloqueoMesesPorServicio(codigo?: string): number {
  const c = (codigo || '').toUpperCase()
  if (c === 'RTM' || c === 'SOAT') return 12
  if (c === 'PREV') return 2
  // 'PERI' u otros: sin bloqueo
  return 0
}

function ttlSinConsumir(): number {
  return Number(process.env.TTL_SIN_CONSUMIR_DIAS ?? 7)
}
function ttlPostConsumo(): number {
  return Number(process.env.TTL_POST_CONSUMO_DIAS ?? 365)
}
function buildReserva(d: CaptacionDateo) {
  const now = new Date()
  let vigente = false
  let bloqueaHasta: Date | null = null

  if (d.consumidoTurnoId && d.consumidoAt) {
    const hasta = new Date(d.consumidoAt.toJSDate().getTime())
    hasta.setDate(hasta.getDate() + ttlPostConsumo())
    vigente = now < hasta
    bloqueaHasta = hasta
  } else {
    const created = d.createdAt?.toJSDate()
    if (created) {
      const hasta = new Date(created.getTime())
      hasta.setDate(hasta.getDate() + ttlSinConsumir())
      vigente = now < hasta
      bloqueaHasta = hasta
    }
  }
  return { vigente, bloqueaHasta }
}

// medio_entero (BD) derivado del canal (para cumplir enum actual en la DB)
function medioFromCanal(
  canal: CanalAtrib
): 'Fachada' | 'Redes Sociales' | 'Call Center' | 'Asesor Comercial' {
  switch (canal) {
    case 'REDES': return 'Redes Sociales'
    case 'TELE':  return 'Call Center'
    case 'ASESOR':return 'Asesor Comercial'
    case 'FACHADA':
    default:      return 'Fachada'
  }
}

// ============================================================================

export default class TurnosRtmController {
  /** Lista turnos con filtros (incluye servicioId/servicioCodigo y canal/agente). */
  public async index({ request, response }: HttpContext) {
    const {
      fecha,
      placa,
      tipoVehiculo,
      estado,
      turnoNumero,
      fechaInicio,
      fechaFin,
      servicioId,
      servicioCodigo,

      // 🔎 Nuevos filtros
      canalAtribucion,
      agenteId,
      agenteTipo, // 'ASESOR_INTERNO' | 'ASESOR_EXTERNO' | 'TELEMERCADEO'
      clienteId,
      vehiculoId,
    } = request.qs()

    try {
      let query = TurnoRtm.query()
        .preload('usuario')
        .preload('sede')
        .preload('servicio')
        .preload('vehiculo')
        .preload('cliente')
        .preload('agenteCaptacion')
        .preload('captacionDateo')

      // Fechas (columna DATE): usar yyyy-mm-dd
      if (fechaInicio && fechaFin) {
        const fi = DateTime.fromISO(String(fechaInicio), { zone: 'America/Bogota' }).startOf('day')
        const ff = DateTime.fromISO(String(fechaFin), { zone: 'America/Bogota' }).endOf('day')
        if (!fi.isValid || !ff.isValid) return response.badRequest({ message: 'Fechas inválidas' })
        query.whereBetween('fecha', [toMySQLDate(fi), toMySQLDate(ff)])
      } else if (fecha) {
        const f = DateTime.fromISO(String(fecha), { zone: 'America/Bogota' })
        if (!f.isValid) return response.badRequest({ message: 'Fecha inválida' })
        query.whereBetween('fecha', [toMySQLDate(f.startOf('day')), toMySQLDate(f.endOf('day'))])
      }

      if (placa) {
        query.whereRaw('LOWER(placa) LIKE ?', [`%${String(placa).toLowerCase()}%`])
      }
      if (turnoNumero) {
        const n = Number(turnoNumero)
        if (Number.isNaN(n)) return response.badRequest({ message: 'turnoNumero inválido' })
        query.where('turno_numero', n)
      }
      if (tipoVehiculo) {
        if (!VALID_TIPOS_VEHICULO.includes(tipoVehiculo as TipoVehiculoDB)) {
          return response.badRequest({ message: `tipoVehiculo inválido: ${tipoVehiculo}` })
        }
        query.where('tipo_vehiculo', tipoVehiculo as TipoVehiculoDB)
      }
      if (estado) {
        const ok = ['activo', 'inactivo', 'cancelado', 'finalizado']
        if (!ok.includes(String(estado))) return response.badRequest({ message: 'estado inválido' })
        query.where('estado', String(estado) as any)
      }

      // Servicio
      if (servicioId) {
        const sid = Number(servicioId)
        if (Number.isNaN(sid)) return response.badRequest({ message: 'servicioId debe ser numérico' })
        query.where('servicio_id', sid)
      } else if (servicioCodigo) {
        const s = await Servicio.query().where('codigo_servicio', String(servicioCodigo)).first()
        if (!s) return response.badRequest({ message: `Servicio código '${servicioCodigo}' no existe` })
        query.where('servicio_id', s.id)
      }

      // 🔎 Nuevos filtros
      if (canalAtribucion) {
        const allowed: CanalAtrib[] = ['FACHADA', 'ASESOR', 'TELE', 'REDES']
        const c = String(canalAtribucion).toUpperCase() as CanalAtrib
        if (!allowed.includes(c)) return response.badRequest({ message: 'canalAtribucion inválido' })
        query.where('canal_atribucion', c)
      }
      if (agenteId) query.where('agente_captacion_id', Number(agenteId))
      if (agenteTipo) {
        query.whereHas('agenteCaptacion', (q) => {
          q.where('tipo', String(agenteTipo))
        })
      }

      if (clienteId) query.where('cliente_id', Number(clienteId))
      if (vehiculoId) query.where('vehiculo_id', Number(vehiculoId))

      const turnos = await query
        .orderBy('fecha', 'desc')
        .orderBy('turno_numero', 'desc')

      return response.ok(turnos)
    } catch (error) {
      console.error('Error en index turnos:', error)
      return response.internalServerError({ message: 'Error al obtener turnos' })
    }
  }

  /** Mostrar un turno con relaciones. */
  public async show({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.query()
        .where('id', params.id)
        .preload('usuario')
        .preload('sede')
        .preload('servicio')
        .preload('vehiculo')
        .preload('cliente')
        .preload('agenteCaptacion')
        .preload('captacionDateo')
        .first()

      if (!turno) return response.notFound({ message: 'Turno no encontrado' })
      return response.ok(turno)
    } catch (error) {
      console.error('Error en show turno:', error)
      return response.internalServerError({ message: 'Error al obtener el turno' })
    }
  }

  /**
   * Crear turno (flujo NUEVO):
   * - Valida duplicado diario por placa+servicio+sede.
   * - Valida ventana de bloqueo por servicio si hubo un turno FINALIZADO previo.
   * - Input: canal (FACHADA|REDES|TELE|ASESOR) y agenteCaptacionId (si canal=ASESOR)
   * - Si hay dateo vigente de placa/teléfono, pisa canal/agente y se marca consumido.
   * - Calcula y guarda turno_numero (global) y turno_numero_servicio (por servicio).
   */
  public async store({ request, response }: HttpContext) {
    const trx = await Database.transaction()
    try {
      const raw = request.only([
        'placa',
        'telefono',
        'tipoVehiculo',
        'observaciones',
        'fecha',
        'horaIngreso',
        'usuarioId',
        'servicioId',
        'servicioCodigo',
        // flujo nuevo
        'canal',             // 'FACHADA'|'REDES'|'TELE'|'ASESOR'
        'agenteCaptacionId', // number si canal = ASESOR
      ])

      if (!raw.placa || !raw.tipoVehiculo || !raw.usuarioId || !raw.fecha || !raw.horaIngreso) {
        await trx.rollback()
        return response.badRequest({
          message: 'Faltan campos obligatorios: placa, tipoVehiculo, usuarioId, fecha, horaIngreso.',
        })
      }

      const placa = normalizePlaca(raw.placa)!
      const telefono = normalizePhone(raw.telefono)

      const usuarioCreador = await Usuario.find(Number(raw.usuarioId))
      if (!usuarioCreador) {
        await trx.rollback()
        return response.badRequest({ message: `Usuario ${raw.usuarioId} no encontrado` })
      }
      if (!usuarioCreador.sedeId) {
        await trx.rollback()
        return response.badRequest({ message: 'El usuario no tiene sede asignada' })
      }

      // Servicio
      let servicio: Servicio | null = null
      if (raw.servicioId) {
        const sid = Number(raw.servicioId)
        if (Number.isNaN(sid)) {
          await trx.rollback()
          return response.badRequest({ message: 'servicioId debe ser numérico' })
        }
        servicio = await Servicio.find(sid)
      } else if (raw.servicioCodigo) {
        servicio = await Servicio.query().where('codigo_servicio', String(raw.servicioCodigo)).first()
      }
      if (!servicio) {
        await trx.rollback()
        return response.badRequest({ message: 'Debe enviar servicioId o servicioCodigo válido' })
      }

      // Tipo vehículo
      if (!VALID_TIPOS_VEHICULO.includes(raw.tipoVehiculo as TipoVehiculoDB)) {
        await trx.rollback()
        return response.badRequest({
          message: `tipoVehiculo inválido. Debe ser uno de: ${VALID_TIPOS_VEHICULO.join(', ')}`,
        })
      }

      // Fecha/hora
      const fechaGuardar = DateTime.fromISO(raw.fecha, { zone: 'America/Bogota' })
      if (!fechaGuardar.isValid) {
        await trx.rollback()
        return response.badRequest({ message: 'Fecha inválida' })
      }
      const horaIngresoStr = parseHoraIngresoToHHmm(String(raw.horaIngreso))
      if (!horaIngresoStr) {
        await trx.rollback()
        return response.badRequest({ message: 'Hora de ingreso inválida (HH:mm o HH:mm:ss)' })
      }

      const hoyISO = fechaGuardar.toISODate()!

      // ===== 1) Anti-duplicado diario por placa+servicio+sede =====
      const dupDiario = await trx
        .from('turnos_rtms')
        .where('sede_id', usuarioCreador.sedeId!)
        .andWhere('servicio_id', servicio.id)
        .andWhere('fecha', hoyISO)
        .andWhere('placa', placa)
        .count('* as total')
        .first()

      const totalDup = Number((dupDiario as any)?.total ?? 0)
      if (totalDup > 0) {
        await trx.rollback()
        const manana = fechaGuardar.plus({ days: 1 }).toISODate()
        return response.conflict({
          code: 'DUPLICATE_DAY',
          message: 'Ya existe un turno hoy para esta placa y servicio en esta sede. Intenta nuevamente mañana.',
          nextAllowedDate: manana,
        })
      }

      // ===== 2) Ventana de bloqueo por servicio si hubo FINALIZADO =====
      const lastFinalizado = await TurnoRtm.query({ client: trx })
        .where('placa', placa)
        .andWhere('servicio_id', servicio.id)
        .andWhere('estado', 'finalizado')
        .orderBy('fecha', 'desc')
        .first()

      if (lastFinalizado) {
        const meses = bloqueoMesesPorServicio((servicio as any).codigoServicio)
        if (meses > 0) {
          const ultimaFecha = (lastFinalizado.fecha as DateTime) // columna DATE
          const nextAllowed = ultimaFecha.plus({ months: meses }).startOf('day')
          if (fechaGuardar.startOf('day') < nextAllowed) {
            await trx.rollback()
            return response.conflict({
              code: 'WINDOW_BLOCK',
              message: `No es posible crear un nuevo turno de ${servicio.codigoServicio} aún. Válido nuevamente desde ${nextAllowed.toISODate()}.`,
              servicio: servicio.codigoServicio,
              lastFinalizedOn: ultimaFecha.toISODate(),
              nextAllowedDate: nextAllowed.toISODate(),
              monthsBlocked: meses,
            })
          }
        }
      }

      // ===== 3) Calcular consecutivos en la MISMA transacción =====
      // Global (max turno_numero del día+sede) + 1
      const rowGlobal = await trx
        .from('turnos_rtms')
        .where('sede_id', usuarioCreador.sedeId!)
        .where('fecha', hoyISO)
        .max('turno_numero as max')
        .first()
      const nextGlobal: number = Number(rowGlobal?.max ?? 0) + 1

      // Por servicio (max turno_numero_servicio del día+sede+servicio) + 1
      const rowSvc = await trx
        .from('turnos_rtms')
        .where('sede_id', usuarioCreador.sedeId!)
        .where('servicio_id', servicio.id)
        .where('fecha', hoyISO)
        .max('turno_numero_servicio as max')
        .first()
      const nextPorServicio: number = Number(rowSvc?.max ?? 0) + 1

      // Enlaces opcionales a vehículo/cliente/clase
      let vehiculoId: number | null = null
      let clienteId: number | null = null
      let claseVehiculoId: number | null = null

      const veh = await Vehiculo.query({ client: trx }).where('placa', placa).preload('clase').first()
      if (veh) {
        vehiculoId = veh.id
        claseVehiculoId = (veh as any).claseVehiculoId ?? (veh as any).claseId ?? null
        clienteId = veh.clienteId ?? null
      } else if (telefono) {
        const c = await Cliente.query({ client: trx }).where('telefono', telefono).first()
        if (c) clienteId = c.id
      }

      // Dateo vigente (tiene prioridad)
      const dateo = await CaptacionDateo.query({ client: trx })
        .where((qb) => {
          qb.where('placa', placa)
          if (telefono) qb.orWhere('telefono', telefono)
        })
        .orderBy('created_at', 'desc')
        .first()

      const nowBog = DateTime.local().setZone('America/Bogota')
      const turnoCodigo = `${servicio.codigoServicio}-${nowBog.toFormat('yyyyMMddHHmmss')}`

      // Canal/agente por defecto desde input nuevo
      const allowedCanales: CanalAtrib[] = ['FACHADA', 'ASESOR', 'TELE', 'REDES']
      let canalAtribucion: CanalAtrib = 'FACHADA'
      let agenteCaptacionId: number | null = null

      if (raw.canal) {
        const c = String(raw.canal).toUpperCase() as CanalAtrib
        if (!allowedCanales.includes(c)) {
          await trx.rollback()
          return response.badRequest({ message: `canal inválido: ${raw.canal}` })
        }
        canalAtribucion = c
        if (c === 'ASESOR') {
          agenteCaptacionId = raw.agenteCaptacionId ? Number(raw.agenteCaptacionId) || null : null
        }
      }

      // Si hay dateo vigente, pisa canal/agente por el dateo
      let captacionDateoId: number | null = null
      if (dateo) {
        const r = buildReserva(dateo)
        if (r.vigente) {
          canalAtribucion = dateo.canal as CanalAtrib
          // @ts-ignore
          agenteCaptacionId = (dateo as any).agenteId ?? (dateo as any).agente_id ?? null
          captacionDateoId = dateo.id
        }
      }

      // medio_entero (BD) derivado del canal final
      const medioBD = medioFromCanal(canalAtribucion)

      // Construir payload
      const payload: any = {
        sedeId: usuarioCreador.sedeId!,
        funcionarioId: usuarioCreador.id,

        servicioId: servicio.id,
        fecha: fechaGuardar,
        horaIngreso: horaIngresoStr,
        turnoNumero: nextGlobal,
        turnoCodigo,

        placa,
        tipoVehiculo: raw.tipoVehiculo as TipoVehiculoDB,

        medioEntero: medioBD,
        observaciones: raw.observaciones || null,

        estado: 'activo',

        vehiculoId,
        clienteId,
        claseVehiculoId,

        canalAtribucion,
        agenteCaptacionId,
        captacionDateoId,
      }
      payload.turnoNumeroServicio = nextPorServicio
      payload['turno_numero_servicio'] = nextPorServicio

      const turno = await TurnoRtm.create(payload, { client: trx })

      // Si consumimos un dateo, marcarlo (DATETIME sin ms/offset)
      if (captacionDateoId) {
        await CaptacionDateo.query({ client: trx })
          .where('id', captacionDateoId)
          .update({
            consumidoTurnoId: turno.id,
            consumidoAt: toMySQL(nowBog),
          } as any)
      }

      await trx.commit()

      await turno.load('usuario')
      await turno.load('sede')
      await turno.load('servicio')
      await turno.load('vehiculo')
      await turno.load('cliente')
      await turno.load('agenteCaptacion')
      await turno.load('captacionDateo')

      return response.created(turno)
    } catch (error) {
      try { await (trx as any).rollback() } catch {}
      console.error('Error al crear turno:', error)
      return response.internalServerError({
        message: 'Error al crear el turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /** Actualizar turno (cambio de servicio, canal/agente y metadatos). */
  public async update({ params, request, response }: HttpContext) {
    try {
      const raw = request.only([
        'placa',
        'telefono',
        'tipoVehiculo',
        'observaciones',
        'usuarioId',
        'horaSalida',
        'tiempoServicio',
        'estado',
        'servicioId',
        'servicioCodigo',
        'canal',             // 'FACHADA'|'REDES'|'TELE'|'ASESOR'
        'agenteCaptacionId', // number si canal = ASESOR
        'clienteId',
        'vehiculoId',
        'fecha',
        'horaIngreso',
      ])

      const idNumericoUsuario = Number(raw.usuarioId)
      if (Number.isNaN(idNumericoUsuario)) return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioActualizador = await Usuario.find(idNumericoUsuario)
      if (!usuarioActualizador) return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.notFound({ message: 'Turno no encontrado' })

      let tipoVehiculoNext: TipoVehiculoDB | undefined
      if (raw.tipoVehiculo) {
        if (!VALID_TIPOS_VEHICULO.includes(raw.tipoVehiculo as TipoVehiculoDB)) {
          return response.badRequest({
            message: `tipoVehiculo inválido. Debe ser uno de: ${VALID_TIPOS_VEHICULO.join(', ')}`,
          })
        }
        tipoVehiculoNext = raw.tipoVehiculo as TipoVehiculoDB
      }

      let servicioIdNext: number | undefined
      if (raw.servicioId) {
        const sid = Number(raw.servicioId)
        if (Number.isNaN(sid)) return response.badRequest({ message: 'servicioId debe ser numérico' })
        const s = await Servicio.find(sid)
        if (!s) return response.badRequest({ message: `Servicio id ${sid} no existe` })
        servicioIdNext = s.id
      } else if (raw.servicioCodigo) {
        const s = await Servicio.query().where('codigo_servicio', String(raw.servicioCodigo)).first()
        if (!s) return response.badRequest({ message: `Servicio código '${raw.servicioCodigo}' no existe` })
        servicioIdNext = s.id
      }

      const allowedCanales: CanalAtrib[] = ['FACHADA', 'ASESOR', 'TELE', 'REDES']
      let canalAtribucionNext: CanalAtrib | undefined
      if (raw.canal) {
        const c = String(raw.canal).toUpperCase() as CanalAtrib
        if (!allowedCanales.includes(c)) {
          return response.badRequest({ message: `canal inválido: ${raw.canal}` })
        }
        canalAtribucionNext = c
      }

      let medioBDNext: 'Fachada' | 'Redes Sociales' | 'Call Center' | 'Asesor Comercial' | undefined
      if (canalAtribucionNext) {
        medioBDNext = medioFromCanal(canalAtribucionNext)
      }

      let estadoVal: 'activo' | 'inactivo' | 'cancelado' | 'finalizado' | undefined
      if (raw.estado) {
        const ok = ['activo', 'inactivo', 'cancelado', 'finalizado']
        if (!ok.includes(raw.estado)) {
          return response.badRequest({ message: `Estado inválido. Debe ser uno de: ${ok.join(', ')}` })
        }
        estadoVal = raw.estado as any
      }

      let fechaNext: DateTime | undefined
      if (raw.fecha) {
        const f = DateTime.fromISO(String(raw.fecha), { zone: 'America/Bogota' })
        if (!f.isValid) return response.badRequest({ message: 'Fecha inválida (YYYY-MM-DD)' })
        fechaNext = f
      }
      let horaIngresoNext: string | undefined
      if (raw.horaIngreso) {
        const hi = parseHoraIngresoToHHmm(String(raw.horaIngreso))
        if (!hi) return response.badRequest({ message: 'Hora de ingreso inválida (HH:mm o HH:mm:ss)' })
        horaIngresoNext = hi
      }

      turno.merge({
        placa: raw.placa ? normalizePlaca(raw.placa)! : turno.placa,
        tipoVehiculo: tipoVehiculoNext ?? turno.tipoVehiculo,
        funcionarioId: usuarioActualizador.id,

        observaciones: raw.observaciones ?? turno.observaciones ?? null,

        horaSalida: raw.horaSalida ?? turno.horaSalida ?? null,
        tiempoServicio: raw.tiempoServicio ?? turno.tiempoServicio ?? null,
        estado: estadoVal ?? turno.estado,

        servicioId: servicioIdNext ?? turno.servicioId,

        clienteId: raw.clienteId !== undefined ? (Number(raw.clienteId) || null) : turno.clienteId,
        vehiculoId: raw.vehiculoId !== undefined ? (Number(raw.vehiculoId) || null) : turno.vehiculoId,

        ...(fechaNext ? { fecha: fechaNext } : {}),
        ...(horaIngresoNext ? { horaIngreso: horaIngresoNext } : {}),

        ...(canalAtribucionNext ? { canalAtribucion: canalAtribucionNext } : {}),
        ...(medioBDNext ? { medioEntero: medioBDNext } : {}),
        ...(raw.agenteCaptacionId !== undefined
          ? { agenteCaptacionId: Number(raw.agenteCaptacionId) || null }
          : {}),
      })

      await turno.save()
      await turno.load('usuario')
      await turno.load('sede')
      await turno.load('servicio')
      await turno.load('vehiculo')
      await turno.load('cliente')
      await turno.load('agenteCaptacion')
      await turno.load('captacionDateo')

      return response.ok(turno)
    } catch (error) {
      console.error('Error al actualizar turno:', error)
      return response.internalServerError({ message: 'Error al actualizar el turno' })
    }
  }

  /** Activar turno. */
  public async activar({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) return response.unauthorized({ message: 'usuarioId requerido' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador) return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.notFound({ message: 'Turno no encontrado' })

      turno.estado = 'activo'
      await turno.save()
      return response.ok({ message: 'Turno activado', turnoId: turno.id })
    } catch (error) {
      console.error('Error al activar:', error)
      return response.internalServerError({ message: 'Error al activar el turno' })
    }
  }

  /** Cancelar turno. */
  public async cancelar({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) return response.unauthorized({ message: 'usuarioId requerido' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador) return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.notFound({ message: 'Turno no encontrado' })

      turno.estado = 'cancelado'
      await turno.save()
      return response.ok({ message: 'Turno cancelado', turnoId: turno.id })
    } catch (error) {
      console.error('Error al cancelar:', error)
      return response.internalServerError({ message: 'Error al cancelar el turno' })
    }
  }

  /** Inhabilitar (soft-delete) turno. */
  public async destroy({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) return response.unauthorized({ message: 'usuarioId requerido' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador) return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.notFound({ message: 'Turno no encontrado' })

      turno.estado = 'inactivo'
      await turno.save()
      return response.ok({ message: 'Turno inhabilitado (soft delete)' })
    } catch (error) {
      console.error('Error al inhabilitar:', error)
      return response.internalServerError({ message: 'Error al inhabilitar el turno' })
    }
  }

  /** Registrar salida y calcular tiempo de servicio. */
  public async registrarSalida({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) return response.unauthorized({ message: 'usuarioId requerido' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador) return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.notFound({ message: 'Turno no encontrado' })

      const salida = DateTime.local().setZone('America/Bogota')

      let entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm:ss', { zone: 'America/Bogota' })
      if (!entrada.isValid) {
        entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm', { zone: 'America/Bogota' })
      }

      const diff = salida.diff(entrada, ['hours', 'minutes']).toObject()
      let tiempoServicioStr = ''
      if (diff.hours && diff.hours >= 1) tiempoServicioStr += `${Math.floor(diff.hours)} h `
      tiempoServicioStr += `${Math.round((diff.minutes ?? 0) % 60)} min`

      turno.horaSalida = salida.toFormat('HH:mm:ss')
      turno.tiempoServicio = tiempoServicioStr
      turno.estado = 'finalizado'
      await turno.save()

      return response.ok({
        message: 'Hora de salida registrada',
        horaSalida: turno.horaSalida,
        tiempoServicio: turno.tiempoServicio,
        estado: turno.estado,
      })
    } catch (error) {
      console.error('Error al registrar salida:', error)
      return response.internalServerError({ message: 'Error al registrar salida' })
    }
  }

  /** ✅ Siguientes números de turno (global y por servicio) para HOY por sede del usuario. */
  public async siguienteTurno({ request, response }: HttpContext) {
    try {
      const { usuarioId, servicioId, servicioCodigo } = request.qs()

      if (!usuarioId) return response.badRequest({ message: 'usuarioId requerido' })
      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) {
        return response.badRequest({ message: 'usuarioId inválido' })
      }

      const usuarioSolicitante = await Usuario.find(idNumericoUsuario)
      if (!usuarioSolicitante) {
        return response.badRequest({ message: `Usuario ${idNumericoUsuario} no encontrado` })
      }
      if (!usuarioSolicitante.sedeId) {
        return response.badRequest({ message: 'El usuario no tiene sede asignada' })
      }

      const hoy = DateTime.local().setZone('America/Bogota').toISODate()!

      // Global (sede+día): max(turno_numero)+1
      const rowGlobal = await Database
        .from('turnos_rtms')
        .where('fecha', hoy)
        .andWhere('sede_id', usuarioSolicitante.sedeId)
        .max('turno_numero as max')
        .first()
      const siguiente = Number(rowGlobal?.max ?? 0) + 1

      // Por servicio (sede+día+servicio): max(turno_numero_servicio)+1 — opcional
      let siguientePorServicio: number | null = null
      if (servicioId || servicioCodigo) {
        let sid: number | null = null
        if (servicioId) {
          const s = await Servicio.find(Number(servicioId))
          if (!s) return response.badRequest({ message: `Servicio id ${servicioId} no existe` })
          sid = s.id
        } else if (servicioCodigo) {
          const s = await Servicio.query().where('codigo_servicio', String(servicioCodigo)).first()
          if (!s) return response.badRequest({ message: `Servicio código '${servicioCodigo}' no existe` })
          sid = s.id
        }

        const rowSvc = await Database
          .from('turnos_rtms')
          .where('fecha', hoy)
          .andWhere('sede_id', usuarioSolicitante.sedeId)
          .andWhere('servicio_id', sid!)
          .max('turno_numero_servicio as max')
          .first()

        siguientePorServicio = Number(rowSvc?.max ?? 0) + 1
      }

      return response.ok({
        siguiente,
        siguientePorServicio,
        sedeId: usuarioSolicitante.sedeId,
      })
    } catch (error) {
      console.error('Error en siguienteTurno:', error)
      return response.internalServerError({ message: 'Error al obtener el siguiente número' })
    }
  }

  /**
   * Exportar Excel (rango fechas obligatorio).
   * Columnas incluyen Turno Global y Turno Servicio; muestra canal y agente (con tipo).
   */
  public async exportExcel({ request, response }: HttpContext) {
    const {
      fechaInicio,
      fechaFin,
      servicioId,
      servicioCodigo,

      // 🔎 Nuevos filtros
      canalAtribucion,
      agenteId,
      agenteTipo, // 'ASESOR_INTERNO'|'ASESOR_EXTERNO'|'TELEMERCADEO'
    } = request.qs()

    try {
      if (!fechaInicio || !fechaFin) {
        return response.badRequest({
          message: 'fechaInicio y fechaFin son obligatorios (YYYY-MM-DD)',
        })
      }
      const fi = DateTime.fromISO(String(fechaInicio), { zone: 'America/Bogota' }).startOf('day')
      const ff = DateTime.fromISO(String(fechaFin), { zone: 'America/Bogota' }).endOf('day')
      if (!fi.isValid || !ff.isValid) {
        return response.badRequest({ message: 'Fechas inválidas. Use YYYY-MM-DD' })
      }

      const q = TurnoRtm.query()
        .preload('usuario')
        .preload('sede')
        .preload('servicio')
        .preload('agenteCaptacion')
        .whereBetween('fecha', [toMySQLDate(fi), toMySQLDate(ff)])

      // Servicio
      if (servicioId) {
        const sid = Number(servicioId)
        if (Number.isNaN(sid)) return response.badRequest({ message: 'servicioId debe ser numérico' })
        q.where('servicio_id', sid)
      } else if (servicioCodigo) {
        const s = await Servicio.query().where('codigo_servicio', String(servicioCodigo)).first()
        if (!s) return response.badRequest({ message: `Servicio código '${servicioCodigo}' no existe` })
        q.where('servicio_id', s.id)
      }

      // Nuevos filtros
      if (canalAtribucion) {
        const allowed: CanalAtrib[] = ['FACHADA', 'ASESOR', 'TELE', 'REDES']
        const c = String(canalAtribucion).toUpperCase() as CanalAtrib
        if (!allowed.includes(c)) return response.badRequest({ message: 'canalAtribucion inválido' })
        q.where('canal_atribucion', c)
      }
      if (agenteId) q.where('agente_captacion_id', Number(agenteId))
      if (agenteTipo) {
        q.whereHas('agenteCaptacion', (qq) => qq.where('tipo', String(agenteTipo)))
      }

      const turnos = await q.orderBy('fecha', 'asc').orderBy('turno_numero', 'asc')

      // EXCEL
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte Turnos')

      worksheet.columns = [
        { header: 'Fecha', key: 'fecha', width: 14, style: { numFmt: 'yyyy-mm-dd' } },
        { header: 'Turno Global', key: 'turnoGlobal', width: 14 },
        { header: 'Turno Servicio', key: 'turnoServicio', width: 16 },
        { header: 'Servicio', key: 'servicio', width: 18 },
        { header: 'Hora Ingreso', key: 'horaIngreso', width: 12 },
        { header: 'Hora Salida', key: 'horaSalida', width: 12 },
        { header: 'Tiempo Servicio', key: 'tiempoServicio', width: 16 },
        { header: 'Placa', key: 'placa', width: 12 },
        { header: 'Tipo Vehículo', key: 'tipoVehiculo', width: 18 },
        { header: 'Medio (BD)', key: 'medioEntero', width: 16 },
        { header: 'Canal Atribución', key: 'canalAtribucion', width: 16 },
        { header: 'Agente', key: 'agente', width: 28 },
        { header: 'Observaciones', key: 'observaciones', width: 40 },
        { header: 'Estado', key: 'estado', width: 12 },
        { header: 'Usuario', key: 'usuario', width: 26 },
        { header: 'Sede', key: 'sede', width: 18 },
      ]

      turnos.forEach((t) => {
        const fechaExcel = t.fecha?.toJSDate ? t.fecha.toJSDate() : undefined
        const agente = (t as any).agenteCaptacion
          ? `${(t as any).agenteCaptacion.nombre} (${(t as any).agenteCaptacion.tipo})`
          : '-'

        const turnoServicio =
          (t as any).turnoNumeroServicio ??
          (t as any).turno_numero_servicio ??
          ''

        worksheet.addRow({
          fecha: fechaExcel,
          turnoGlobal: t.turnoNumero,
          turnoServicio,
          servicio: t.servicio ? `${t.servicio.codigoServicio} — ${t.servicio.nombreServicio}` : '-',
          horaIngreso: t.horaIngreso,
          horaSalida: t.horaSalida || '-',
          tiempoServicio: t.tiempoServicio || '-',
          placa: t.placa,
          tipoVehiculo: t.tipoVehiculo,
          medioEntero: t.medioEntero,
          canalAtribucion: (t as any).canalAtribucion ?? '-',
          agente,
          observaciones: t.observaciones || '-',
          estado: t.estado,
          usuario: t.usuario ? `${t.usuario.nombres} ${t.usuario.apellidos}` : '-',
          sede: t.sede ? t.sede.nombre : '-',
        })
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const fileName = `reporte_turnos_${DateTime.local().setZone('America/Bogota').toISODate()}.xlsx`

      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      response.header('Content-Disposition', `attachment; filename="${fileName}"`)
      return response.send(buffer)
    } catch (error) {
      console.error('Error exportExcel:', error)
      return response.internalServerError({ message: 'Error al generar el Excel' })
    }
  }
}
