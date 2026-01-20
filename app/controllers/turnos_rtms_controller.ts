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
import Conductor from '#models/conductor' //  NUEVO
import CaptacionDateo from '#models/captacion_dateo'
import FacturacionTicket from '#models/facturacion_ticket'
import AgenteCaptacion from '#models/agente_captacion' // 👈 AGREGAR
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion' // 👈 AGREGAR

// ===== Helpers =====
const toMySQL = (dt: DateTime) => dt.toFormat('yyyy-LL-dd HH:mm:ss')
const toMySQLDate = (dt: DateTime) => dt.toFormat('yyyy-LL-dd')

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
  if (c === 'PREV' || c === 'PERI') return 2 // 👈 AGREGAR PERI AQUÍ
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

/** Normaliza canal a enum de atribución */
const normalizeCanal = (v?: string): CanalAtrib | null => {
  const x = (v || '').toUpperCase().trim()
  if (['FACHADA', 'ASESOR', 'TELE', 'REDES'].includes(x)) return x as CanalAtrib
  if (['REDES_SOCIALES', 'RRSS'].includes(x)) return 'REDES'
  if (['CALLCENTER', 'CALL_CENTER', 'TELEMERCADEO', 'TELEMARKETING', 'TELEFONO'].includes(x))
    return 'TELE'
  if (['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'].includes(x)) return 'ASESOR'
  return null
}

function medioFromCanal(
  canal: CanalAtrib
): 'Fachada' | 'Redes Sociales' | 'Call Center' | 'Asesor Comercial' {
  switch (canal) {
    case 'REDES':
      return 'Redes Sociales'
    case 'TELE':
      return 'Call Center'
    case 'ASESOR':
      return 'Asesor Comercial'
    case 'FACHADA':
    default:
      return 'Fachada'
  }
}

// ============================================================================

export default class TurnosRtmController {
  /** Lista turnos con filtros. */
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
      canalAtribucion,
      agenteId,
      agenteTipo,
      clienteId,
      vehiculoId,
    } = request.qs()

    try {
      const query = TurnoRtm.query()
        .preload('usuario')
        .preload('sede')
        .preload('servicio')
        .preload('vehiculo')
        .preload('cliente')
        .preload('conductor') // 👈 NUEVO
        .preload('agenteCaptacion')
        .preload('captacionDateo', (q) => q.preload('agente').preload('convenio'))
        .preload('certificaciones')

      // ====== FILTROS ======
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
      // Servicio (soporta múltiples)
      if (servicioId) {
        const servicioIds = String(servicioId)
          .split(',')
          .map((id) => Number(id.trim()))
          .filter((n) => !Number.isNaN(n))
        if (servicioIds.length > 0) {
          query.whereIn('servicio_id', servicioIds)
        }
      } else if (servicioCodigo) {
        const codigos = String(servicioCodigo)
          .split(',')
          .map((c) => c.trim().toUpperCase())
        const servicios = await Servicio.query().whereIn('codigo_servicio', codigos)
        if (servicios.length > 0) {
          query.whereIn(
            'servicio_id',
            servicios.map((s) => s.id)
          )
        }
      }

      // Filtros adicionales
      if (canalAtribucion) {
        const allowed: CanalAtrib[] = ['FACHADA', 'ASESOR', 'TELE', 'REDES']
        const canales = String(canalAtribucion)
          .split(',')
          .map((c) => c.trim().toUpperCase())
          .filter((c) => allowed.includes(c as CanalAtrib))

        if (canales.length > 0) {
          query.whereIn('canal_atribucion', canales as CanalAtrib[])
        }
      }
      if (agenteId) query.where('agente_captacion_id', Number(agenteId))
      if (agenteTipo) {
        query.whereHas('agenteCaptacion', (q) => q.where('tipo', String(agenteTipo)))
      }
      if (clienteId) query.where('cliente_id', Number(clienteId))
      if (vehiculoId) query.where('vehiculo_id', Number(vehiculoId))

      const turnos = await query.orderBy('fecha', 'desc').orderBy('turno_numero', 'desc')

      // ====== FACTURACIÓN CONFIRMADA ======
      const turnoIds = turnos.map((t) => t.id)
      let turnosConFactura = new Set<number>()
      if (turnoIds.length > 0) {
        const facturadas = await FacturacionTicket.query()
          .whereIn('turno_id', turnoIds)
          .where('estado', 'CONFIRMADA')
          .select('turno_id')

        turnosConFactura = new Set<number>(
          facturadas.map((f) => (f as any).turnoId ?? (f as any).turno_id)
        )
      }

      // ====== HISTORIAL COMPLETO POR PLACA ======
      type HistItem = {
        id: number
        fechaStr: string
        clienteNombre: string | null
        servicioCodigo: string | null
      }

      const placasUnicas = Array.from(new Set(turnos.map((t) => t.placa)))
      const historialPorPlaca: Record<string, HistItem[]> = {}

      const getClienteNombre = (c: Cliente | null | undefined): string | null => {
        if (!c) return null
        const any = c as any
        if (any.nombreCompleto) return String(any.nombreCompleto)
        if (any.nombre) return String(any.nombre)
        const partes = [any.nombres, any.apellidos].filter(Boolean).join(' ').trim()
        if (partes) return partes
        if (any.razonSocial) return String(any.razonSocial)
        return null
      }

      for (const p of placasUnicas) {
        const rows = await TurnoRtm.query()
          .where('placa', p)
          .whereNot('estado', 'inactivo')
          .orderBy('fecha', 'asc')
          .orderBy('hora_ingreso', 'asc')
          .preload('cliente')
          .preload('servicio')

        historialPorPlaca[p] = rows.map((r) => ({
          id: r.id,
          fechaStr: toMySQLDate(r.fecha as DateTime),
          clienteNombre: getClienteNombre(r.cliente),
          servicioCodigo: r.servicio ? ((r.servicio as any).codigoServicio ?? null) : null,
        }))
      }

      const visitaLabel = (n: number | null): string => {
        if (!n || n <= 0) return '—'
        if (n === 1) return 'Primera vez'
        if (n === 2) return 'Segunda vez'
        if (n === 3) return 'Tercera vez'
        return `${n}ª vez`
      }

      const payload = turnos.map((t) => {
        const plain = t.serialize()
        const hist = historialPorPlaca[t.placa] ?? []

        let visitaNumero: number | null = null
        const ultimasFechas: string[] = []
        let visitasDetalle: HistItem[] = []

        if (hist.length) {
          const idxFound = hist.findIndex((h) => h.id === t.id)
          const idx = idxFound >= 0 ? idxFound : hist.length - 1

          visitaNumero = idx + 1
          if (idx > 0) ultimasFechas.push(hist[idx - 1].fechaStr)
          if (idx > 1) ultimasFechas.push(hist[idx - 2].fechaStr)

          visitasDetalle = hist
        }

        return {
          ...plain,
          tieneFacturacion: turnosConFactura.has(t.id),
          tieneCertificacion: (t.certificaciones ?? []).length > 0,

          visitaVehiculoNumero: visitaNumero,
          visitaVehiculoTexto: visitaLabel(visitaNumero),
          visitaVehiculoUltimasFechas: ultimasFechas,
          visitasVehiculoDetalle: visitasDetalle,
        }
      })

      return response.ok(payload)
    } catch (error) {
      console.error('Error en index turnos:', error)
      return response.internalServerError({ message: 'Error al obtener turnos' })
    }
  }

  /** GET /turnos/:id */
  public async show({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (Number.isNaN(id)) {
        return response.badRequest({ message: 'id inválido' })
      }

      const turno = await TurnoRtm.query()
        .where('id', id)
        .preload('usuario')
        .preload('sede')
        .preload('servicio')
        .preload('vehiculo', (q) => q.preload('clase'))
        .preload('cliente')
        .preload('conductor') // 👈 NUEVO
        .preload('agenteCaptacion')
        .preload('captacionDateo', (q) => q.preload('agente').preload('convenio'))
        .preload('certificaciones')
        .first()

      if (!turno) {
        return response.notFound({ message: 'Turno no encontrado' })
      }

      return response.ok(turno)
    } catch (error) {
      console.error('Error en show turno:', error)
      return response.internalServerError({ message: 'Error al obtener el turno' })
    }
  }

  /** Crear turno */
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
        // atribución
        'canal',
        'agenteCaptacionId',
        // extras cliente
        'dateoId',
        'clienteTelefono',
        'clienteNombre',
        'clienteEmail',
        // 👇 NUEVOS campos de conductor
        'conductorId',
        'conductorTelefono',
        'conductorNombre',
        'asesorDetectadoId', // 👈 AGREGAR ESTA LÍNEA
      ])

      if (!raw.placa || !raw.tipoVehiculo || !raw.usuarioId || !raw.fecha || !raw.horaIngreso) {
        await trx.rollback()
        return response.badRequest({
          message:
            'Faltan campos obligatorios: placa, tipoVehiculo, usuarioId, fecha, horaIngreso.',
        })
      }

      const placa = normalizePlaca(raw.placa)!
      const telefono = normalizePhone(raw.telefono) ?? normalizePhone(raw.clienteTelefono)
      const conductorTelefono = normalizePhone(raw.conductorTelefono)

      // ✅ REEMPLAZAR POR ESTO:
      // 🔥 VALIDACIÓN ROBUSTA DE USUARIO
      const idUsuario = Number(raw.usuarioId)

      // 1. Validar que sea un número válido
      if (Number.isNaN(idUsuario) || idUsuario <= 0) {
        console.error('❌ [TURNO-CREATE] ID usuario inválido:', {
          recibido: raw.usuarioId,
          tipo: typeof raw.usuarioId,
          parseado: idUsuario,
          timestamp: new Date().toISOString(),
        })
        await trx.rollback()
        return response.badRequest({
          message: 'ID de usuario inválido. Por favor, cierra sesión y vuelve a ingresar.',
          debug: {
            recibido: raw.usuarioId,
            parseado: idUsuario,
          },
        })
      }

      // 2. Buscar usuario con preload de sede
      const usuarioCreador = await Usuario.query().where('id', idUsuario).preload('sede').first()

      // 3. Log de debugging
      console.log('🔍 [TURNO-CREATE] Usuario encontrado:', {
        id: usuarioCreador?.id,
        correo: usuarioCreador?.correo,
        sedeId: usuarioCreador?.sedeId,
        sede: usuarioCreador?.sede?.nombre,
        timestamp: new Date().toISOString(),
      })

      // 4. Validar existencia
      if (!usuarioCreador) {
        console.error('❌ [TURNO-CREATE] Usuario no existe:', { idBuscado: idUsuario })
        await trx.rollback()
        return response.badRequest({
          message: `Usuario ${idUsuario} no encontrado en el sistema`,
        })
      }

      // 5. Validar sede con doble check
      if (!usuarioCreador.sedeId || !usuarioCreador.sede) {
        console.error('❌ [TURNO-CREATE] Usuario sin sede:', {
          usuarioId: idUsuario,
          correo: usuarioCreador.correo,
          sedeId: usuarioCreador.sedeId,
          sede: usuarioCreador.sede,
          timestamp: new Date().toISOString(),
        })
        await trx.rollback()
        return response.badRequest({
          message: 'Tu usuario no tiene sede asignada. Contacta al administrador.',
          debug: {
            usuarioId: idUsuario,
            correo: usuarioCreador.correo,
            sedeId: usuarioCreador.sedeId,
          },
        })
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
        servicio = await Servicio.query()
          .where('codigo_servicio', String(raw.servicioCodigo))
          .first()
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

      // 1) Anti-duplicado diario
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
          message:
            'Ya existe un turno hoy para esta placa y servicio en esta sede. Intenta nuevamente mañana.',
          nextAllowedDate: manana,
        })
      }

      // 2) Ventana de bloqueo por servicio
      const lastFinalizado = await TurnoRtm.query({ client: trx })
        .where('placa', placa)
        .andWhere('servicio_id', servicio.id)
        .andWhere('estado', 'finalizado')
        .orderBy('fecha', 'desc')
        .first()

      if (lastFinalizado) {
        const meses = bloqueoMesesPorServicio((servicio as any).codigoServicio)
        if (meses > 0) {
          const ultimaFecha = lastFinalizado.fecha as DateTime
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

      // 3) Consecutivos
      // 3) Consecutivos CON ADVISORY LOCK
      // 🔒 Generar lock ID único para sede + fecha
      const lockKey = `${usuarioCreador.sedeId!}${hoyISO.replace(/-/g, '')}`
      // Ejemplo: sede 1, fecha 2025-12-29 → lockKey = "120251229"
      const lockId = Number.parseInt(lockKey.substring(0, 10), 10) || 1

      // 🔒 Obtener lock exclusivo (automáticamente se libera al commit/rollback)
      await trx.raw('SELECT pg_advisory_xact_lock(?)', [lockId])

      // Ahora SÍ podemos leer el MAX de forma segura (solo esta transacción puede ejecutar esto)
      const rowGlobal = await trx
        .from('turnos_rtms')
        .where('sede_id', usuarioCreador.sedeId!)
        .where('fecha', hoyISO)
        .where('turno_numero', '>', 0)
        .whereIn('estado', ['activo', 'finalizado'])
        .max('turno_numero as max')
        .first()
      const nextGlobal: number = Number(rowGlobal?.max ?? 0) + 1

      const rowSvc = await trx
        .from('turnos_rtms')
        .where('sede_id', usuarioCreador.sedeId!)
        .where('servicio_id', servicio.id)
        .where('fecha', hoyISO)
        .where('turno_numero_servicio', '>', 0)
        .whereIn('estado', ['activo', 'finalizado'])
        .max('turno_numero_servicio as max')
        .first()
      const nextPorServicio: number = Number(rowSvc?.max ?? 0) + 1

      // 3.1 Cliente / Vehículo
      let vehiculoId: number | null = null
      let clienteId: number | null = null
      let claseVehiculoId: number | null = null

      const veh = await Vehiculo.query({ client: trx })
        .where('placa', placa)
        .preload('clase')
        .first()
      if (veh) {
        vehiculoId = veh.id
        claseVehiculoId = (veh as any).claseVehiculoId ?? (veh as any).claseId ?? null
        clienteId = veh.clienteId ?? null
      }

      // ✅ SOLO crear cliente si NO es un asesor detectado
      const esAsesorDetectado = !!raw.asesorDetectadoId
      if (!clienteId && telefono && !esAsesorDetectado) {
        const cExist = await Cliente.query({ client: trx }).where('telefono', telefono).first()
        if (cExist) {
          clienteId = cExist.id
        } else if (raw.clienteNombre || raw.clienteEmail) {
          // Solo crear cliente si hay nombre o email explícito
          const cNuevo = await Cliente.create(
            {
              nombre: String(raw.clienteNombre || 'Cliente'),
              telefono,
              email: raw.clienteEmail || null,
            } as any,
            { client: trx }
          )
          clienteId = cNuevo.id
        }
      }
      // 3.2 Conductor
      let conductorId: number | null = null

      if (raw.conductorId) {
        const c = await Conductor.find(Number(raw.conductorId))
        if (c) conductorId = c.id
      }

      if (!conductorId && (conductorTelefono || raw.conductorNombre)) {
        let cExist: Conductor | null = null
        if (conductorTelefono) {
          cExist = await Conductor.query({ client: trx })
            .where('telefono', conductorTelefono)
            .first()
        }

        if (cExist) {
          conductorId = cExist.id
        } else {
          const nuevoConductor = await Conductor.create(
            {
              nombre: String(raw.conductorNombre || 'Conductor'),
              telefono: conductorTelefono || null,
            } as any,
            { client: trx }
          )
          conductorId = nuevoConductor.id
        }
      }

      // 4) Atribución / Dateo
      const nowBog = DateTime.local().setZone('America/Bogota')
      const turnoCodigo = `${servicio.codigoServicio}-${nowBog.toFormat('yyyyMMddHHmmss')}`

      // ✅ Solo normalizar si el usuario envió un canal
      let canalAtribucion: CanalAtrib | null = raw.canal ? normalizeCanal(raw.canal) : null
      let agenteCaptacionId: number | null = null
      if (canalAtribucion === 'ASESOR') {
        agenteCaptacionId = raw.agenteCaptacionId ? Number(raw.agenteCaptacionId) || null : null
      }

      let dateo: CaptacionDateo | null = null
      if (raw.dateoId) {
        dateo = await CaptacionDateo.query({ client: trx }).where('id', Number(raw.dateoId)).first()
      }
      if (!dateo) {
        dateo = await CaptacionDateo.query({ client: trx })
          .where((qb) => {
            qb.where('placa', placa)
            if (telefono) qb.orWhere('telefono', telefono)
          })
          .orderBy('created_at', 'desc')
          .first()
      }

      let captacionDateoId: number | null = null
      if (dateo) {
        const r = buildReserva(dateo)
        if (r.vigente) {
          const cRaw = (dateo as any).canal as string | undefined
          const cNorm = normalizeCanal(cRaw)

          // ✅ SOLO usar canal del dateo si el usuario NO seleccionó uno
          if (cNorm && !canalAtribucion) {
            canalAtribucion = cNorm
          }

          // ✅ SOLO usar agente del dateo si el usuario NO seleccionó uno
          // @ts-ignore
          if (!agenteCaptacionId) {
            agenteCaptacionId = (dateo as any).agenteId ?? (dateo as any).agente_id ?? null
          }

          captacionDateoId = dateo.id
        } else {
          dateo = null
        }
      }

      // 5) Construir payload
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

        observaciones: raw.observaciones || null,
        estado: 'activo',

        vehiculoId,
        clienteId,
        claseVehiculoId,

        conductorId, // 👈 NUEVO
        canalAtribucion,
        agenteCaptacionId,
        captacionDateoId: captacionDateoId ?? null,
      }

      if (canalAtribucion) {
        payload.medioEntero = medioFromCanal(canalAtribucion)
      }

      payload.turnoNumeroServicio = nextPorServicio
      payload['turno_numero_servicio'] = nextPorServicio

      const turno = await TurnoRtm.create(payload, { client: trx })

      if (captacionDateoId) {
        await CaptacionDateo.query({ client: trx })
          .where('id', captacionDateoId)
          .update({
            resultado: 'EN_PROCESO',
            consumidoTurnoId: turno.id,
            consumidoAt: toMySQL(nowBog),
            updatedAt: toMySQL(nowBog) as any,
          } as any)
      }
      // ========================================
      // 🎯 AUTO-DATEO: Si es RTM + hay asesor detectado por teléfono
      // ========================================
      const esRTM = servicio.codigoServicio?.toUpperCase() === 'RTM'
      const asesorDetectadoPorTelefono = raw.asesorDetectadoId
        ? Number(raw.asesorDetectadoId)
        : null

      // 👇 AGREGAR ESTE LOG
      console.log('🔍 Auto-dateo check:', {
        esRTM,
        asesorDetectadoPorTelefono,
        placa,
        condicion: esRTM && asesorDetectadoPorTelefono && placa,
      })

      if (esRTM && asesorDetectadoPorTelefono && placa) {
        try {
          // 1️⃣ Buscar dateo PENDIENTE del asesor con esa placa
          const dateoExistente = await CaptacionDateo.query({ client: trx })
            .where('agente_id', asesorDetectadoPorTelefono)
            .where('placa', placa)
            .where('resultado', 'PENDIENTE')
            .first()

          if (dateoExistente) {
            // ✅ CONSUMIR dateo existente
            dateoExistente.resultado = 'EN_PROCESO'
            dateoExistente.consumidoTurnoId = turno.id
            dateoExistente.consumidoAt = nowBog // 👈 SIN toMySQL()
            await dateoExistente.useTransaction(trx).save()

            // Actualizar turno con el dateo consumido
            turno.captacionDateoId = dateoExistente.id
            await turno.useTransaction(trx).save()

            console.log(
              `✅ Dateo existente #${dateoExistente.id} consumido para turno #${turno.id}`
            )
          } else {
            // ✅ CREAR dateo nuevo
            const asesor = await AgenteCaptacion.find(asesorDetectadoPorTelefono)
            if (asesor) {
              const canal =
                (asesor as any).tipo === 'ASESOR_CONVENIO' ? 'ASESOR_CONVENIO' : 'ASESOR_COMERCIAL'

              // Buscar convenio si es asesor convenio
              let convenioId: number | null = null
              if ((asesor as any).tipo === 'ASESOR_CONVENIO') {
                const asignacion = await AsesorConvenioAsignacion.query({ client: trx })
                  .where('asesor_id', asesor.id)
                  .where('activo', true)
                  .whereNull('fecha_fin')
                  .first()
                if (asignacion) convenioId = asignacion.convenioId
              }

              const nuevoDateo = await CaptacionDateo.create(
                {
                  canal: canal as any,
                  agenteId: asesor.id,
                  convenioId,
                  placa,
                  telefono: telefono || null,
                  origen: 'UI',
                  resultado: 'EN_PROCESO',
                  consumidoTurnoId: turno.id,
                  consumidoAt: nowBog, // 👈 SIN toMySQL()
                  observacion: 'Auto-dateo por teléfono detectado',
                } as any,
                { client: trx }
              )

              // Actualizar turno con el nuevo dateo
              turno.captacionDateoId = nuevoDateo.id
              await turno.useTransaction(trx).save()

              console.log(`✅ Nuevo dateo #${nuevoDateo.id} creado para turno #${turno.id}`)
            }
          }
        } catch (err) {
          console.error('❌ Error en auto-dateo:', err)
          // No hacer rollback, solo logear el error
        }
      }
      // ========================================
      // FIN AUTO-DATEO
      // ========================================
      await trx.commit()

      await turno.load('usuario')
      await turno.load('sede')
      await turno.load('servicio')
      await turno.load('vehiculo')
      await turno.load('cliente')
      await turno.load('conductor') // 👈 NUEVO
      await turno.load('agenteCaptacion')
      await turno.load('captacionDateo', (q) => q.preload('agente').preload('convenio'))

      return response.created(turno)
    } catch (error) {
      try {
        await (trx as any).rollback()
      } catch {}
      console.error('Error al crear turno:', error)
      return response.internalServerError({
        message: 'Error al crear el turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /** Actualizar turno */
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
        'canal',
        'agenteCaptacionId',
        'clienteId',
        'vehiculoId',
        'fecha',
        'horaIngreso',
        // 👇 NUEVOS campos de conductor
        'conductorId',
        'conductorTelefono',
        'conductorNombre',
        'asesorDetectadoId', // 👈 AGREGAR ESTA LÍNEA
      ])

      const idNumericoUsuario = Number(raw.usuarioId)

      if (Number.isNaN(idNumericoUsuario) || idNumericoUsuario <= 0) {
        console.error('❌ [TURNO-UPDATE] ID inválido:', idNumericoUsuario)
        return response.badRequest({ message: 'usuarioId inválido' })
      }

      const usuarioActualizador = await Usuario.query()
        .where('id', idNumericoUsuario)
        .preload('sede')
        .first()

      console.log('🔍 [TURNO-UPDATE] Usuario:', {
        id: usuarioActualizador?.id,
        correo: usuarioActualizador?.correo,
        sedeId: usuarioActualizador?.sedeId,
      })
      if (!usuarioActualizador)
        return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

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
        if (Number.isNaN(sid))
          return response.badRequest({ message: 'servicioId debe ser numérico' })
        const s = await Servicio.find(sid)
        if (!s) return response.badRequest({ message: `Servicio id ${sid} no existe` })
        servicioIdNext = s.id
      } else if (raw.servicioCodigo) {
        const s = await Servicio.query()
          .where('codigo_servicio', String(raw.servicioCodigo))
          .first()
        if (!s)
          return response.badRequest({
            message: `Servicio código '${raw.servicioCodigo}' no existe`,
          })
        servicioIdNext = s.id
      }

      let canalAtribucionNext: (CanalAtrib | null) | undefined
      if (raw.canal !== undefined) {
        canalAtribucionNext = normalizeCanal(raw.canal)
      }

      let medioBDNext: 'Fachada' | 'Redes Sociales' | 'Call Center' | 'Asesor Comercial' | undefined
      if (canalAtribucionNext) {
        medioBDNext = medioFromCanal(canalAtribucionNext)
      }

      let estadoVal: 'activo' | 'inactivo' | 'cancelado' | 'finalizado' | undefined
      if (raw.estado) {
        const ok = ['activo', 'inactivo', 'cancelado', 'finalizado']
        if (!ok.includes(raw.estado)) {
          return response.badRequest({
            message: `Estado inválido. Debe ser uno de: ${ok.join(', ')}`,
          })
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
        if (!hi)
          return response.badRequest({ message: 'Hora de ingreso inválida (HH:mm o HH:mm:ss)' })
        horaIngresoNext = hi
      }

      // Resolver conductor en update
      let conductorIdNext: number | null | undefined
      const conductorTelefono = normalizePhone(raw.conductorTelefono)

      if (raw.conductorId !== undefined) {
        conductorIdNext = Number(raw.conductorId) || null
      } else if (conductorTelefono || raw.conductorNombre) {
        let cExist: Conductor | null = null
        if (conductorTelefono) {
          cExist = await Conductor.query().where('telefono', conductorTelefono).first()
        }
        if (cExist) {
          conductorIdNext = cExist.id
        } else {
          const nuevoConductor = await Conductor.create({
            nombre: String(raw.conductorNombre || 'Conductor'),
            telefono: conductorTelefono || null,
          } as any)
          conductorIdNext = nuevoConductor.id
        }
      }

      turno.merge({
        ...(conductorIdNext !== undefined ? { conductorId: conductorIdNext } : {}),
      })

      turno.merge({
        placa: raw.placa ? normalizePlaca(raw.placa)! : turno.placa,
        tipoVehiculo: tipoVehiculoNext ?? turno.tipoVehiculo,
        funcionarioId: usuarioActualizador.id,

        observaciones: raw.observaciones ?? turno.observaciones ?? null,

        horaSalida: raw.horaSalida ?? turno.horaSalida ?? null,
        tiempoServicio: raw.tiempoServicio ?? turno.tiempoServicio ?? null,
        estado: estadoVal ?? turno.estado,

        servicioId: servicioIdNext ?? turno.servicioId,

        clienteId: raw.clienteId !== undefined ? Number(raw.clienteId) || null : turno.clienteId,
        vehiculoId:
          raw.vehiculoId !== undefined ? Number(raw.vehiculoId) || null : turno.vehiculoId,

        ...(fechaNext ? { fecha: fechaNext } : {}),
        ...(horaIngresoNext ? { horaIngreso: horaIngresoNext } : {}),

        ...(canalAtribucionNext !== undefined ? { canalAtribucion: canalAtribucionNext } : {}),

        ...(medioBDNext ? { medioEntero: medioBDNext } : {}),

        ...(raw.agenteCaptacionId !== undefined
          ? { agenteCaptacionId: Number(raw.agenteCaptacionId) || null }
          : {}),

        ...(conductorIdNext !== undefined ? { conductorId: conductorIdNext } : {}),
      })

      await turno.save()
      await turno.load('usuario')
      await turno.load('sede')
      await turno.load('servicio')
      await turno.load('vehiculo')
      await turno.load('cliente')
      await turno.load('conductor') // 👈 NUEVO
      await turno.load('agenteCaptacion')
      await turno.load('captacionDateo', (q) => q.preload('agente').preload('convenio'))

      return response.ok(turno)
    } catch (error) {
      console.error('Error al actualizar turno:', error)
      return response.internalServerError({ message: 'Error al actualizar el turno' })
    }
  }

  /** Activar turno */
  public async activar({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) return response.unauthorized({ message: 'usuarioId requerido' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario))
        return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador)
        return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

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

  /** Cancelar turno */
  public async cancelar({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) return response.unauthorized({ message: 'usuarioId requerido' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario))
        return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador)
        return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.notFound({ message: 'Turno no encontrado' })

      turno.estado = 'cancelado'

      if (turno.turnoNumero && turno.turnoNumero > 0) {
        turno.turnoNumero = -turno.turnoNumero
      }
      const tAny = turno as any
      if (tAny.turnoNumeroServicio && tAny.turnoNumeroServicio > 0) {
        tAny.turnoNumeroServicio = -tAny.turnoNumeroServicio
      }

      await turno.save()
      return response.ok({ message: 'Turno cancelado', turnoId: turno.id })
    } catch (error) {
      console.error('Error al cancelar:', error)
      return response.internalServerError({ message: 'Error al cancelar el turno' })
    }
  }

  /** Inhabilitar turno */
  public async destroy({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) return response.unauthorized({ message: 'usuarioId requerido' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario))
        return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador)
        return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

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

  /** Registrar salida */
  public async registrarSalida({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) return response.unauthorized({ message: 'usuarioId requerido' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario))
        return response.badRequest({ message: 'usuarioId inválido' })
      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador)
        return response.unauthorized({ message: `Usuario ${idNumericoUsuario} no encontrado` })

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.notFound({ message: 'Turno no encontrado' })

      const salida = DateTime.local().setZone('America/Bogota')

      let entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm:ss', {
        zone: 'America/Bogota',
      })
      if (!entrada.isValid) {
        entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm', { zone: 'America/Bogota' })
      }

      let diff = salida.diff(entrada, ['hours', 'minutes']).toObject()
      if ((diff.hours ?? 0) < 0 || (diff.minutes ?? 0) < 0) {
        diff = { hours: 0, minutes: 0 }
      }

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

  /** Siguiente número de turno */
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

      const rowGlobal = await Database.from('turnos_rtms')
        .where('fecha', hoy)
        .andWhere('sede_id', usuarioSolicitante.sedeId)
        .where('turno_numero', '>', 0)
        .whereIn('estado', ['activo', 'finalizado'])
        .max('turno_numero as max')
        .first()
      const siguiente = Number(rowGlobal?.max ?? 0) + 1

      let siguientePorServicio: number | null = null
      if (servicioId || servicioCodigo) {
        let sid: number | null = null
        if (servicioId) {
          const s = await Servicio.find(Number(servicioId))
          if (!s) return response.badRequest({ message: `Servicio id ${servicioId} no existe` })
          sid = s.id
        } else if (servicioCodigo) {
          const s = await Servicio.query().where('codigo_servicio', String(servicioCodigo)).first()
          if (!s)
            return response.badRequest({ message: `Servicio código '${servicioCodigo}' no existe` })
          sid = s.id
        }

        const rowSvc = await Database.from('turnos_rtms')
          .where('fecha', hoy)
          .andWhere('sede_id', usuarioSolicitante.sedeId)
          .andWhere('servicio_id', sid!)
          .where('turno_numero_servicio', '>', 0)
          .whereIn('estado', ['activo', 'finalizado'])
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

  /** Exportar Excel */
  public async exportExcel({ request, response }: HttpContext) {
    const {
      fechaInicio,
      fechaFin,
      servicioId,
      servicioCodigo,
      canalAtribucion,
      agenteId,
      agenteTipo,
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

      // ✅ Servicios (soporta múltiples)
      if (servicioId) {
        const servicioIds = String(servicioId)
          .split(',')
          .map((id) => Number(id.trim()))
          .filter((n) => !Number.isNaN(n))
        if (servicioIds.length > 0) {
          q.whereIn('servicio_id', servicioIds)
        }
      } else if (servicioCodigo) {
        const codigos = String(servicioCodigo)
          .split(',')
          .map((c) => c.trim().toUpperCase())
        const servicios = await Servicio.query().whereIn('codigo_servicio', codigos)
        if (servicios.length > 0) {
          q.whereIn(
            'servicio_id',
            servicios.map((s) => s.id)
          )
        }
      }

      // ✅ Canales (soporta múltiples)
      if (canalAtribucion) {
        const allowed: CanalAtrib[] = ['FACHADA', 'ASESOR', 'TELE', 'REDES']
        const canales = String(canalAtribucion)
          .split(',')
          .map((c) => c.trim().toUpperCase())
          .filter((c) => allowed.includes(c as CanalAtrib))

        if (canales.length > 0) {
          q.whereIn('canal_atribucion', canales as CanalAtrib[])
        }
      }
      if (agenteId) q.where('agente_captacion_id', Number(agenteId))
      if (agenteTipo) {
        q.whereHas('agenteCaptacion', (qq) => qq.where('tipo', String(agenteTipo)))
      }

      const turnos = await q.orderBy('fecha', 'asc').orderBy('turno_numero', 'asc')

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
        { header: 'Canal Atribución', key: 'canalAtribucion', width: 16 },
        { header: 'Agente', key: 'agente', width: 28 },
        { header: 'Observaciones', key: 'observaciones', width: 40 },
        { header: 'Estado', key: 'estado', width: 12 },
        { header: 'Usuario', key: 'usuario', width: 26 },
        { header: 'Sede', key: 'sede', width: 18 },
        { header: 'Conductor', key: 'conductor', width: 28 }, // 👈 NUEVO
      ]

      turnos.forEach((t) => {
        const fechaExcel = t.fecha?.toJSDate ? t.fecha.toJSDate() : undefined
        const agente = (t as any).agenteCaptacion
          ? `${(t as any).agenteCaptacion.nombre} (${(t as any).agenteCaptacion.tipo})`
          : '-'

        const isCancelOrInactive = t.estado === 'cancelado' || t.estado === 'inactivo'

        const turnoGlobal = isCancelOrInactive ? '' : t.turnoNumero
        const turnoServicioRaw =
          (t as any).turnoNumeroServicio ?? (t as any).turno_numero_servicio ?? ''
        const turnoServicio = isCancelOrInactive ? '' : turnoServicioRaw

        const conductor = (t as any).conductor ? `${(t as any).conductor.nombre}` : '-' // 👈 NUEVO

        worksheet.addRow({
          fecha: fechaExcel,
          turnoGlobal,
          turnoServicio,
          servicio: t.servicio ? t.servicio.codigoServicio : '-',
          horaIngreso: t.horaIngreso,
          horaSalida: t.horaSalida || '-',
          tiempoServicio: t.tiempoServicio || '-',
          placa: t.placa,
          tipoVehiculo: t.tipoVehiculo,
          canalAtribucion: (t as any).canalAtribucion ?? '-',
          agente,
          observaciones: t.observaciones || '-',
          estado: t.estado,
          usuario: t.usuario ? `${t.usuario.nombres} ${t.usuario.apellidos}` : '-',
          sede: t.sede ? t.sede.nombre : '-',
          conductor, // 👈 NUEVO
        })
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const fileName = `reporte_turnos_${DateTime.local()
        .setZone('America/Bogota')
        .toISODate()}.xlsx`

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
