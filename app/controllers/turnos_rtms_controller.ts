// app/Controllers/TurnosRtmController.ts
import type { HttpContext } from '@adonisjs/core/http'
import TurnoRtm from '#models/turno_rtm'
import { DateTime } from 'luxon'
import ExcelJS from 'exceljs'
import Usuario from '#models/usuario'

// Tipos de vehículo válidos
type TipoVehiculoDB = 'Liviano Particular' | 'Liviano Taxi' | 'Liviano Público' | 'Motocicleta'
const VALID_TIPOS_VEHICULO: TipoVehiculoDB[] = [
  'Liviano Particular',
  'Liviano Taxi',
  'Liviano Público',
  'Motocicleta',
]

export default class TurnosRtmController {
  /**
   * Lista de turnos con filtros (fecha/placa/tipoVehiculo/estado/turnoNumero o rango de fechas).
   */
  public async index({ request, response }: HttpContext) {
    const { fecha, placa, tipoVehiculo, estado, turnoNumero, fechaInicio, fechaFin } = request.qs()

    try {
      let query = TurnoRtm.query().preload('usuario').preload('sede')

      if (fechaInicio && fechaFin) {
        const parsedFechaInicio = DateTime.fromISO(fechaInicio as string).startOf('day')
        const parsedFechaFin = DateTime.fromISO(fechaFin as string).endOf('day')

        if (!parsedFechaInicio.isValid || !parsedFechaFin.isValid) {
          return response.badRequest({
            message: 'Formato de fecha de inicio o fin inválido. Use YYYY-MM-DD.',
          })
        }
        query = query.whereBetween('fecha', [
          parsedFechaInicio.toSQL() as string,
          parsedFechaFin.toSQL() as string,
        ])
      } else if (fechaInicio) {
        const parsedFechaInicio = DateTime.fromISO(fechaInicio as string).startOf('day')
        if (!parsedFechaInicio.isValid) {
          return response.badRequest({
            message: 'Formato de fecha de inicio inválido. Use YYYY-MM-DD.',
          })
        }
        query = query.where('fecha', '>=', parsedFechaInicio.toSQL() as string)
      } else if (fechaFin) {
        const parsedFechaFin = DateTime.fromISO(fechaFin as string).endOf('day')
        if (!parsedFechaFin.isValid) {
          return response.badRequest({
            message: 'Formato de fecha de fin inválido. Use YYYY-MM-DD.',
          })
        }
        query = query.where('fecha', '<=', parsedFechaFin.toSQL() as string)
      } else if (fecha) {
        const fechaAFiltrar = DateTime.fromISO(fecha as string)
        if (!fechaAFiltrar.isValid) {
          return response.badRequest({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' })
        }
        query = query.whereBetween('fecha', [
          fechaAFiltrar.startOf('day').toSQL() as string,
          fechaAFiltrar.endOf('day').toSQL() as string,
        ])
      }

      if (placa) {
        query = query.whereRaw('LOWER(placa) LIKE ?', [`%${(placa as string).toLowerCase()}%`])
      }

      if (turnoNumero) {
        const numTurno = Number.parseInt(turnoNumero as string, 10)
        if (!Number.isNaN(numTurno) && numTurno > 0) {
          query = query.where('turno_numero', numTurno)
        } else {
          return response.badRequest({ message: 'Número de turno inválido.' })
        }
      }

      if (tipoVehiculo) {
        if (VALID_TIPOS_VEHICULO.includes(tipoVehiculo as TipoVehiculoDB)) {
          query = query.where('tipo_vehiculo', tipoVehiculo as TipoVehiculoDB)
        } else {
          return response.badRequest({
            message: `Tipo de vehículo inválido para filtrar. Debe ser uno de: ${VALID_TIPOS_VEHICULO.join(', ')}.`,
          })
        }
      }

      if (estado) {
        if (['activo', 'inactivo', 'cancelado', 'finalizado'].includes(estado as string)) {
          query = query.where(
            'estado',
            estado as 'activo' | 'inactivo' | 'cancelado' | 'finalizado'
          )
        } else {
          return response.badRequest({
            message:
              'Estado de turno inválido. Debe ser "activo", "inactivo", "cancelado" o "finalizado".',
          })
        }
      }

      const turnos = await query.orderBy('fecha', 'desc').orderBy('horaIngreso', 'asc').exec()
      return response.ok(turnos)
    } catch (error: unknown) {
      console.error('Error al obtener los turnos (index consolidado):', error)
      return response.internalServerError({
        message: 'Error al obtener los turnos',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /** Mostrar un turno por ID (con usuario y sede). */
  public async show({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.query()
        .where('id', params.id)
        .preload('usuario')
        .preload('sede')
        .first()

      if (!turno) return response.status(404).json({ message: 'Turno no encontrado' })

      return response.ok(turno)
    } catch (error: unknown) {
      console.error('Error al obtener el turno (show):', error)
      return response.internalServerError({
        message: 'Error al obtener el turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Crear turno (recibe usuarioId primario).
   */
  public async store({ request, response }: HttpContext) {
    try {
      const raw = request.only([
        'placa',
        'tipoVehiculo',
        'tieneCita',
        'convenio',
        'referidoInterno',
        'referidoExterno',
        'medioEntero',
        'observaciones',
        'asesorComercial',
        'fecha',
        'horaIngreso',
        'usuarioId',
      ])

      if (
        !raw.placa ||
        !raw.tipoVehiculo ||
        !raw.medioEntero ||
        !raw.usuarioId ||
        !raw.fecha ||
        !raw.horaIngreso
      ) {
        return response.badRequest({
          message:
            'Faltan campos obligatorios: placa, tipoVehiculo, medioEntero, usuarioId, fecha, horaIngreso.',
        })
      }

      const usuarioCreador = await Usuario.find(Number(raw.usuarioId))
      if (!usuarioCreador) {
        return response.badRequest({
          message: `Usuario con ID '${raw.usuarioId}' no encontrado como creador del turno.`,
        })
      }

      const sedeIdDelUsuario = usuarioCreador.sedeId
      if (!sedeIdDelUsuario) {
        return response.badRequest({
          message: `El usuario con ID '${raw.usuarioId}' no tiene una sede asignada.`,
        })
      }

      const nowBog = DateTime.local().setZone('America/Bogota')
      if (!nowBog.isValid) {
        return response.internalServerError({
          message: 'Error al obtener la fecha actual (Bogotá).',
        })
      }
      const hoy = nowBog.toISODate()!

      const ultimoTurno = await TurnoRtm.query()
        .where('fecha', hoy)
        .andWhere('sedeId', sedeIdDelUsuario)
        .orderBy('turnoNumero', 'desc')
        .first()
      const siguienteTurno = (ultimoTurno?.turnoNumero || 0) + 1

      if (!VALID_TIPOS_VEHICULO.includes(raw.tipoVehiculo as TipoVehiculoDB)) {
        return response.badRequest({
          message: `Valor inválido para 'tipoVehiculo': ${raw.tipoVehiculo}. Debe ser uno de: ${VALID_TIPOS_VEHICULO.join(', ')}.`,
        })
      }
      const tipoVehiculoGuardar = raw.tipoVehiculo as TipoVehiculoDB

      let medioEnteroMapeado:
        | 'Redes Sociales'
        | 'Convenio o Referido Externo'
        | 'Call Center'
        | 'Fachada'
        | 'Referido Interno'
        | 'Asesor Comercial'

      switch (raw.medioEntero) {
        case 'redes_sociales':
          medioEnteroMapeado = 'Redes Sociales'
          break
        case 'convenio_referido_externo':
          medioEnteroMapeado = 'Convenio o Referido Externo'
          break
        case 'call_center':
          medioEnteroMapeado = 'Call Center'
          break
        case 'fachada':
          medioEnteroMapeado = 'Fachada'
          break
        case 'referido_interno':
          medioEnteroMapeado = 'Referido Interno'
          break
        case 'asesor_comercial':
          medioEnteroMapeado = 'Asesor Comercial'
          break
        default:
          return response.badRequest({
            message: `Valor inválido para 'medioEntero': '${raw.medioEntero}'.`,
          })
      }

      const fechaGuardar = DateTime.fromISO(raw.fecha, { zone: 'America/Bogota' })
      if (!fechaGuardar.isValid) {
        return response.badRequest({ message: 'Formato de fecha inválido recibido del frontend.' })
      }

      const horaIngresoGuardar = DateTime.fromFormat(raw.horaIngreso, 'HH:mm', {
        zone: 'America/Bogota',
      })
      if (!horaIngresoGuardar.isValid) {
        return response.badRequest({ message: 'Formato de hora de ingreso inválido (HH:mm).' })
      }

      const turno = await TurnoRtm.create({
        sedeId: sedeIdDelUsuario,
        placa: raw.placa,
        tipoVehiculo: tipoVehiculoGuardar,
        tieneCita: Boolean(raw.tieneCita),
        medioEntero: medioEnteroMapeado,
        funcionarioId: usuarioCreador.id,
        convenio: raw.convenio || null,
        referidoInterno: raw.referidoInterno || null,
        referidoExterno: raw.referidoExterno || null,
        observaciones: raw.observaciones || null,
        asesorComercial: raw.asesorComercial || null,
        fecha: fechaGuardar,
        horaIngreso: horaIngresoGuardar.toFormat('HH:mm'),
        turnoNumero: siguienteTurno,
        turnoCodigo: `RTM-${nowBog.toFormat('yyyyMMddHHmmss')}`,
        estado: 'activo',
      })

      await turno.load('usuario')
      await turno.load('sede')

      return response.created(turno)
    } catch (error: unknown) {
      console.error('Error al crear el turno (store):', error)
      return response.internalServerError({
        message: 'Error al crear el turno en el servidor',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Actualizar turno.
   * (SIN restricción por sede)
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const raw = request.only([
        'placa',
        'tipoVehiculo',
        'tieneCita',
        'convenio',
        'referidoInterno',
        'referidoExterno',
        'medioEntero',
        'observaciones',
        'usuarioId',
        'horaSalida',
        'tiempoServicio',
        'estado',
        'asesorComercial',
      ])

      const idNumericoUsuario = Number(raw.usuarioId)
      if (Number.isNaN(idNumericoUsuario)) {
        return response.badRequest({
          message: 'El usuarioId proporcionado no es un número válido.',
        })
      }

      const usuarioActualizador = await Usuario.find(idNumericoUsuario)
      if (!usuarioActualizador) {
        return response.unauthorized({
          message: `Usuario con ID '${idNumericoUsuario}' no encontrado para actualizar el turno.`,
        })
      }

      const turno = await TurnoRtm.query().where('id', params.id).preload('sede').first()
      if (!turno)
        return response.status(404).json({ message: 'Turno no encontrado para actualizar' })

      let tipoVehiculoParaActualizar: TipoVehiculoDB | undefined
      if (raw.tipoVehiculo) {
        if (!VALID_TIPOS_VEHICULO.includes(raw.tipoVehiculo as TipoVehiculoDB)) {
          return response.badRequest({
            message: `Valor inválido para 'tipoVehiculo': ${raw.tipoVehiculo}. Debe ser uno de: ${VALID_TIPOS_VEHICULO.join(', ')}.`,
          })
        }
        tipoVehiculoParaActualizar = raw.tipoVehiculo as TipoVehiculoDB
      }

      let medioEnteroMapeadoUpdate:
        | 'Redes Sociales'
        | 'Convenio o Referido Externo'
        | 'Call Center'
        | 'Fachada'
        | 'Referido Interno'
        | 'Asesor Comercial'
        | undefined

      if (raw.medioEntero) {
        switch (raw.medioEntero) {
          case 'redes_sociales':
            medioEnteroMapeadoUpdate = 'Redes Sociales'
            break
          case 'convenio_referido_externo':
            medioEnteroMapeadoUpdate = 'Convenio o Referido Externo'
            break
          case 'call_center':
            medioEnteroMapeadoUpdate = 'Call Center'
            break
          case 'fachada':
            medioEnteroMapeadoUpdate = 'Fachada'
            break
          case 'referido_interno':
            medioEnteroMapeadoUpdate = 'Referido Interno'
            break
          case 'asesor_comercial':
            medioEnteroMapeadoUpdate = 'Asesor Comercial'
            break
          default:
            return response.badRequest({
              message: `Valor inválido para 'medioEntero': ${raw.medioEntero}.`,
            })
        }
      }

      turno.merge({
        placa: raw.placa,
        tipoVehiculo: tipoVehiculoParaActualizar,
        tieneCita: typeof raw.tieneCita === 'boolean' ? raw.tieneCita : turno.tieneCita,
        medioEntero: medioEnteroMapeadoUpdate,
        funcionarioId: usuarioActualizador.id,
        horaSalida: raw.horaSalida || null,
        tiempoServicio: raw.tiempoServicio || null,
        estado: raw.estado as 'activo' | 'inactivo' | 'cancelado' | 'finalizado',
        convenio: raw.convenio || null,
        referidoInterno: raw.referidoInterno || null,
        referidoExterno: raw.referidoExterno || null,
        observaciones: raw.observaciones || null,
        asesorComercial: raw.asesorComercial || null,
      })

      await turno.save()
      await turno.load('usuario')
      await turno.load('sede')

      return response.ok(turno)
    } catch (error: unknown) {
      console.error('Error al actualizar el turno (update):', error)
      return response.internalServerError({
        message: 'Error al actualizar el turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /** Activar turno (sin check de sede). */
  public async activar({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId)
        return response.unauthorized({ message: 'Se requiere usuarioId para activar turnos.' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) {
        return response.badRequest({
          message: 'El usuarioId proporcionado no es un número válido para activar turnos.',
        })
      }

      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador) {
        return response.unauthorized({
          message: `Usuario con ID '${idNumericoUsuario}' no encontrado para activar turnos.`,
        })
      }

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.status(404).json({ message: 'Turno no encontrado' })

      turno.estado = 'activo'
      await turno.save()
      return response.ok({ message: 'Turno activado correctamente', turnoId: turno.id })
    } catch (error: unknown) {
      console.error('Error al activar el turno:', error)
      return response.internalServerError({
        message: 'Error al activar el turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /** Cancelar turno (sin check de sede). */
  public async cancelar({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId)
        return response.unauthorized({ message: 'Se requiere usuarioId para cancelar turnos.' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) {
        return response.badRequest({
          message: 'El usuarioId proporcionado no es un número válido para cancelar turnos.',
        })
      }

      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador) {
        return response.unauthorized({
          message: `Usuario con ID '${idNumericoUsuario}' no encontrado para cancelar turnos.`,
        })
      }

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.status(404).json({ message: 'Turno no encontrado' })

      turno.estado = 'cancelado'
      await turno.save()
      return response.ok({ message: 'Turno cancelado correctamente', turnoId: turno.id })
    } catch (error: unknown) {
      console.error('Error al cancelar el turno:', error)
      return response.internalServerError({
        message: 'Error al cancelar el turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /** Inhabilitar (soft delete) turno (sin check de sede). */
  public async destroy({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId)
        return response.unauthorized({ message: 'Se requiere usuarioId para inhabilitar turnos.' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) {
        return response.badRequest({
          message: 'El usuarioId proporcionado no es un número válido para inhabilitar turnos.',
        })
      }

      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador) {
        return response.unauthorized({
          message: `Usuario con ID '${idNumericoUsuario}' no encontrado para inhabilitar turnos.`,
        })
      }

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.status(404).json({ message: 'Turno no encontrado' })

      turno.estado = 'inactivo'
      await turno.save()

      return response.ok({ message: 'Turno inhabilitado correctamente (soft delete)' })
    } catch (error: unknown) {
      console.error('Error al inhabilitar el turno (destroy):', error)
      return response.internalServerError({
        message: 'Error al inhabilitar el turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Registrar salida y calcular tiempo de servicio (sin check de sede).
   */
  public async registrarSalida({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId)
        return response.unauthorized({ message: 'Se requiere usuarioId para registrar la salida.' })

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) {
        return response.badRequest({
          message: 'El usuarioId proporcionado no es un número válido para registrar la salida.',
        })
      }

      const usuarioOperador = await Usuario.find(idNumericoUsuario)
      if (!usuarioOperador) {
        return response.unauthorized({
          message: `Usuario con ID '${idNumericoUsuario}' no encontrado para registrar la salida.`,
        })
      }

      const turno = await TurnoRtm.find(params.id)
      if (!turno) return response.status(404).json({ message: 'Turno no encontrado' })

      const salida = DateTime.local().setZone('America/Bogota')
      let entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm:ss', { zone: 'America/Bogota' })
      if (!entrada.isValid) {
        entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm', { zone: 'America/Bogota' })
      }

      const diff = salida.diff(entrada, ['hours', 'minutes']).toObject()
      let tiempoServicioStr = ''
      if (diff.hours && diff.hours >= 1) {
        tiempoServicioStr += `${Math.floor(diff.hours)} h `
      }
      tiempoServicioStr += `${Math.round(diff.minutes ?? 0) % 60} min`

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
    } catch (error: unknown) {
      console.error('Error al registrar hora de salida:', error)
      return response.internalServerError({
        message: 'Error al registrar hora de salida',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Siguiente número de turno para hoy según la sede del usuario (usuarioId en query).
   */
  public async siguienteTurno({ request, response }: HttpContext) {
    try {
      const { usuarioId } = request.qs()
      if (!usuarioId) {
        return response.badRequest({
          message: 'Se requiere usuarioId en la URL para obtener el siguiente turno.',
        })
      }

      const idNumericoUsuario = Number(usuarioId)
      if (Number.isNaN(idNumericoUsuario)) {
        return response.badRequest({
          message: 'El usuarioId proporcionado no es un número válido.',
        })
      }

      const usuarioSolicitante = await Usuario.find(idNumericoUsuario)
      if (!usuarioSolicitante) {
        return response.badRequest({
          message: `Usuario con ID '${idNumericoUsuario}' no encontrado.`,
        })
      }

      const sedeIdDelUsuario = usuarioSolicitante.sedeId
      if (!sedeIdDelUsuario) {
        return response.badRequest({
          message: `El usuario con ID '${idNumericoUsuario}' no tiene una sede asignada.`,
        })
      }

      const hoy = DateTime.local().setZone('America/Bogota').toISODate()!
      const ultimoTurno = await TurnoRtm.query()
        .where('fecha', hoy)
        .andWhere('sedeId', sedeIdDelUsuario)
        .orderBy('turnoNumero', 'desc')
        .first()

      const siguiente = (ultimoTurno?.turnoNumero || 0) + 1
      return response.ok({ siguiente, sedeId: sedeIdDelUsuario })
    } catch (error: unknown) {
      console.error('Error al obtener el siguiente número de turno:', error)
      return response.internalServerError({
        message: 'Error al obtener el siguiente número de turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Exportar reporte a Excel (requiere fechaInicio y fechaFin).
   */
  public async exportExcel({ request, response }: HttpContext) {
    const { fechaInicio, fechaFin } = request.qs()

    try {
      if (!fechaInicio || !fechaFin) {
        return response.badRequest({
          message:
            'Se requieren las fechas de inicio y fin (fechaInicio, fechaFin) para generar el reporte Excel.',
        })
      }

      const parsedFechaInicio = DateTime.fromISO(fechaInicio as string, {
        zone: 'America/Bogota',
      }).startOf('day')
      const parsedFechaFin = DateTime.fromISO(fechaFin as string, {
        zone: 'America/Bogota',
      }).endOf('day')

      if (!parsedFechaInicio.isValid || !parsedFechaFin.isValid) {
        return response.badRequest({
          message: 'Formato de fecha de inicio o fin inválido para el reporte. Use YYYY-MM-DD.',
        })
      }

      const turnos = await TurnoRtm.query()
        .preload('usuario')
        .preload('sede')
        .whereBetween('fecha', [
          parsedFechaInicio.toSQL() as string,
          parsedFechaFin.toSQL() as string,
        ])
        .orderBy('fecha', 'asc')
        .orderBy('horaIngreso', 'asc')
        .exec()

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Captación')

      worksheet.columns = [
        { header: 'Turno #', key: 'turnoNumero', width: 12 },
        { header: 'Fecha', key: 'fecha', width: 15, style: { numFmt: 'yyyy-mm-dd' } },
        { header: 'Hora Ingreso', key: 'horaIngreso', width: 15 },
        { header: 'Hora Salida', key: 'horaSalida', width: 15 },
        { header: 'Tiempo Servicio', key: 'tiempoServicio', width: 18 },
        { header: 'Placa', key: 'placa', width: 15 },
        { header: 'Tipo Vehículo', key: 'tipoVehiculo', width: 18 },
        { header: 'Tiene Cita', key: 'tieneCita', width: 12 },
        { header: 'Medio Captación', key: 'medioEntero', width: 25 },
        { header: 'Referido Interno', key: 'referidoInterno', width: 25 },
        { header: 'Convenio / Ref. Externo', key: 'convenioReferidoExterno', width: 30 },
        { header: 'Observaciones', key: 'observaciones', width: 40 },
        { header: 'Asesor Comercial', key: 'asesorComercial', width: 25 },
        { header: 'Estado', key: 'estado', width: 15 },
        { header: 'Usuario', key: 'usuario', width: 30 },
        { header: 'Sede', key: 'sede', width: 20 },
      ]

      turnos.forEach((turno) => {
        let fechaParaExcel: Date | string = '-'
        if (turno.fecha instanceof DateTime && turno.fecha.isValid) {
          fechaParaExcel = turno.fecha.toJSDate()
        } else {
          fechaParaExcel = 'Fecha no disponible / Inválida'
        }

        worksheet.addRow({
          turnoNumero: turno.turnoNumero,
          fecha: fechaParaExcel,
          horaIngreso: turno.horaIngreso,
          horaSalida: turno.horaSalida || '-',
          tiempoServicio: turno.tiempoServicio || '-',
          placa: turno.placa,
          tipoVehiculo: turno.tipoVehiculo,
          tieneCita: turno.tieneCita ? 'Sí' : 'No',
          medioEntero: turno.medioEntero,
          referidoInterno:
            turno.medioEntero === 'Referido Interno' && turno.referidoInterno
              ? turno.referidoInterno
              : '-',
          convenioReferidoExterno:
            turno.medioEntero === 'Convenio o Referido Externo' && turno.convenio
              ? turno.convenio
              : turno.medioEntero === 'Convenio o Referido Externo' && turno.referidoExterno
                ? turno.referidoExterno
                : '-',
          observaciones: turno.observaciones || '-',
          asesorComercial: turno.asesorComercial || '-',
          estado: turno.estado,
          usuario: turno.usuario ? `${turno.usuario.nombres} ${turno.usuario.apellidos}` : '-',
          sede: turno.sede ? turno.sede.nombre : '-',
        })
      })

      const buffer = await workbook.xlsx.writeBuffer()
      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      response.header(
        'Content-Disposition',
        `attachment; filename="reporte_captacion_${DateTime.local().setZone('America/Bogota').toISODate()}.xlsx"`
      )
      return response.send(buffer)
    } catch (error: unknown) {
      console.error('Error al exportar a Excel:', error)
      return response.internalServerError({
        message: 'Error al generar el reporte Excel',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}
