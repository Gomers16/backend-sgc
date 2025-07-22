// app/Controllers/TurnosRtmController.ts
import type { HttpContext } from '@adonisjs/core/http'
import TurnoRtm from '#models/turno_rtm'
import { DateTime } from 'luxon'

export default class TurnosRtmController {
  /**
   * Obtiene una lista de turnos RTM.
   * Permite filtrar por fecha (opcional), placa, tipo de vehículo, estado, número de turno,
   * y ahora también por rango de fechas (fechaInicio y fechaFin).
   *
   * @param {HttpContext} ctx
   * @returns {Promise<TurnoRtm[]>}
   */
  public async index({ request, response }: HttpContext) {
    const { fecha, placa, tipoVehiculo, estado, turnoNumero, fechaInicio, fechaFin } = request.qs()

    // --- DEBUGGING: Log del parámetro 'placa' recibido en el backend ---
    console.log('Backend received placa parameter:', placa);
    // --- FIN DEBUGGING ---

    try {
      let query = TurnoRtm.query().preload('funcionario')

      // 1. **Lógica de Filtro por Rango de Fechas (Prioritario si están presentes):**
      if (fechaInicio && fechaFin) {
        const parsedFechaInicio = DateTime.fromISO(fechaInicio as string).startOf('day')
        const parsedFechaFin = DateTime.fromISO(fechaFin as string).endOf('day')

        if (!parsedFechaInicio.isValid || !parsedFechaFin.isValid) {
          return response.badRequest({
            message: 'Formato de fecha de inicio o fin inválido. Use YYYY-MM-DD.',
          })
        }
        // CORRECCIÓN: Asignar a variables explícitamente tipadas como string
        const sqlFechaInicio: string = parsedFechaInicio.toSQL() as string
        const sqlFechaFin: string = parsedFechaFin.toSQL() as string
        query = query.whereBetween('fecha', [sqlFechaInicio, sqlFechaFin])
      } else if (fechaInicio) {
        const parsedFechaInicio = DateTime.fromISO(fechaInicio as string).startOf('day')
        if (!parsedFechaInicio.isValid) {
          return response.badRequest({
            message: 'Formato de fecha de inicio inválido. Use YYYY-MM-DD.',
          })
        }
        // CORRECCIÓN: Asignar a variable explícitamente tipada como string
        const sqlFechaInicio: string = parsedFechaInicio.toSQL() as string
        query = query.where('fecha', '>=', sqlFechaInicio)
      } else if (fechaFin) {
        const parsedFechaFin = DateTime.fromISO(fechaFin as string).endOf('day')
        if (!parsedFechaFin.isValid) {
          return response.badRequest({
            message: 'Formato de fecha de fin inválido. Use YYYY-MM-DD.',
          })
        }
        // CORRECCIÓN: Asignar a variable explícitamente tipada como string
        const sqlFechaFin: string = parsedFechaFin.toSQL() as string
        query = query.where('fecha', '<=', sqlFechaFin)
      } else if (fecha) {
        const fechaAFiltrar = DateTime.fromISO(fecha as string)
        if (!fechaAFiltrar.isValid) {
          return response.badRequest({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' })
        }
        // CORRECCIÓN: Asignar a variables explícitamente tipadas como string
        const sqlFechaStart: string = fechaAFiltrar.startOf('day').toSQL() as string
        const sqlFechaEnd: string = fechaAFiltrar.endOf('day').toSQL() as string
        query = query.whereBetween('fecha', [sqlFechaStart, sqlFechaEnd])
      }

      // 2. **Filtro por Placa (Opcional):**
      if (placa) {
        // CAMBIO: Usar LOWER(placa) LIKE ? para compatibilidad con MySQL y búsqueda insensible a mayúsculas/minúsculas
        query = query.whereRaw('LOWER(placa) LIKE ?', [`%${(placa as string).toLowerCase()}%`])
      }

      // 3. **Filtro por Número de Turno (Opcional):**
      if (turnoNumero) {
        const numTurno = Number.parseInt(turnoNumero as string, 10)
        if (!Number.isNaN(numTurno) && numTurno > 0) {
          query = query.where('turno_numero', numTurno)
        } else {
          return response.badRequest({ message: 'Número de turno inválido.' })
        }
      }

      // 4. **Filtro por Tipo de Vehículo (Opcional):**
      if (tipoVehiculo) {
        if (['carro', 'moto', 'taxi', 'enseñanza'].includes(tipoVehiculo as string)) {
          query = query.where(
            'tipo_vehiculo',
            tipoVehiculo as 'carro' | 'moto' | 'taxi' | 'enseñanza'
          )
        } else {
          return response.badRequest({
            message: 'Tipo de vehículo inválido. Debe ser "carro", "moto", "taxi" o "enseñanza".',
          })
        }
      }

      // 5. **Filtro por Estado (Opcional):**
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

      query = query.orderBy('fecha', 'desc').orderBy('horaIngreso', 'asc')

      const turnos = await query.exec()

      return response.ok(turnos)
    } catch (error: unknown) {
      console.error('Error al obtener los turnos (index consolidado):', error)
      return response.internalServerError({
        message: 'Error al obtener los turnos',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Muestra un turno específico por ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.query().where('id', params.id).preload('funcionario').first()

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

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
   * Crea un nuevo turno RTM.
   */
  public async store({ request, response }: HttpContext) {
    try {
      // Obtener la hora actual en la zona horaria de Bogotá para el código del turno
      const nowInBogota = DateTime.local().setZone('America/Bogota')
      const hoy = nowInBogota.toISODate()

      const ultimoTurno = await TurnoRtm.query()
        .where('fecha', hoy)
        .orderBy('turnoNumero', 'desc')
        .first()

      const siguienteTurno = (ultimoTurno?.turnoNumero || 0) + 1

      const rawPayload = request.only([
        'placa',
        'tipoVehiculo',
        'tieneCita',
        'convenio',
        'referidoInterno',
        'referidoExterno',
        'medioEntero',
        'observaciones',
        'funcionarioId',
        'asesorComercial',
        'fecha', // Incluir la fecha del frontend
        'horaIngreso', // Incluir la hora de ingreso del frontend
      ])

      console.log('Raw Payload recibido en store:', rawPayload)

      if (
        !rawPayload.placa ||
        !rawPayload.tipoVehiculo ||
        !rawPayload.medioEntero ||
        !rawPayload.funcionarioId ||
        !rawPayload.fecha ||
        !rawPayload.horaIngreso
      ) {
        return response.badRequest({
          message:
            'Faltan campos obligatorios: placa, tipoVehiculo, medioEntero, funcionarioId, fecha, horaIngreso.',
        })
      }

      // --- Mapeo de tipoVehiculo ---
      let tipoVehiculoMapeado: 'carro' | 'moto' | 'taxi' | 'enseñanza'
      switch (rawPayload.tipoVehiculo) {
        case 'carro': // Ahora el frontend envía 'carro' directamente
          tipoVehiculoMapeado = 'carro'
          break
        case 'moto':
          tipoVehiculoMapeado = 'moto'
          break
        case 'taxi':
          tipoVehiculoMapeado = 'taxi'
          break
        case 'enseñanza':
          tipoVehiculoMapeado = 'enseñanza'
          break
        default:
          return response.badRequest({
            message: `Valor inválido para 'tipoVehiculo': ${rawPayload.tipoVehiculo}. Debe ser "carro", "moto", "taxi" o "enseñanza".`,
          })
      }

      // --- Mapeo de medioEntero ---
      let medioEnteroMapeado:
        | 'Redes Sociales'
        | 'Convenio o Referido Externo'
        | 'Call Center'
        | 'Fachada'
        | 'Referido Interno'
        | 'Asesor Comercial'

      switch (rawPayload.medioEntero) {
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
            message: `Valor inválido para 'medioEntero': '${rawPayload.medioEntero}'. Asegúrese de que el valor enviado desde el frontend coincida con los valores esperados (ej. 'redes_sociales', 'convenio_referido_externo', 'fachada', etc.).`,
          })
      }

      // --- Corrección de la hora y fecha ---
      // Parsear la fecha del frontend con la zona horaria correcta
      const fechaParaGuardar = DateTime.fromISO(rawPayload.fecha, { zone: 'America/Bogota' })
      if (!fechaParaGuardar.isValid) {
        return response.badRequest({ message: 'Formato de fecha inválido recibido del frontend.' })
      }

      // Asegurar que horaIngreso sea un string HH:mm (como lo envía el frontend)
      // Esto evita que Adonis/DB le añadan segundos o hagan conversiones de zona horaria inesperadas
      const horaIngresoParaGuardar = DateTime.fromFormat(rawPayload.horaIngreso, 'HH:mm', {
        zone: 'America/Bogota',
      }).toFormat('HH:mm')
      if (
        !DateTime.fromFormat(rawPayload.horaIngreso, 'HH:mm', { zone: 'America/Bogota' }).isValid
      ) {
        return response.badRequest({
          message: 'Formato de hora de ingreso inválido recibido del frontend.',
        })
      }

      const finalPayload = {
        placa: rawPayload.placa,
        tipoVehiculo: tipoVehiculoMapeado,
        tieneCita: Boolean(rawPayload.tieneCita),
        medioEntero: medioEnteroMapeado,
        funcionarioId: rawPayload.funcionarioId,
        convenio: rawPayload.convenio || null,
        referidoInterno: rawPayload.referidoInterno || null,
        referidoExterno: rawPayload.referidoExterno || null,
        observaciones: rawPayload.observaciones || null,
        asesorComercial: rawPayload.asesorComercial || null,
        fecha: fechaParaGuardar, // Pasa el objeto DateTime de Luxon
        horaIngreso: horaIngresoParaGuardar, // Pasa el string HH:mm formateado
        turnoNumero: siguienteTurno,
        turnoCodigo: `RTM-${nowInBogota.toFormat('yyyyMMddHHmmss')}`, // Usar la hora de Bogotá para el código
        estado: 'activo' as 'activo', // CORRECCIÓN: Aserción de tipo para 'estado'
      }

      console.log('Final Payload para crear turno:', finalPayload) // NUEVO LOG AQUI

      const turno = await TurnoRtm.create(finalPayload)

      await turno.load('funcionario')

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
   * Actualiza un turno RTM por ID.
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.find(params.id)

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado para actualizar' })
      }

      const payload = request.only([
        'placa',
        'tipoVehiculo',
        'tieneCita',
        'convenio',
        'referidoInterno',
        'referidoExterno',
        'medioEntero',
        'observaciones',
        'funcionarioId',
        'horaSalida',
        'tiempoServicio',
        'estado',
        'asesorComercial',
      ])

      // --- Mapeo de tipoVehiculo para UPDATE ---
      let tipoVehiculoMapeadoUpdate: 'carro' | 'moto' | 'taxi' | 'enseñanza' | undefined
      if (payload.tipoVehiculo) {
        switch (payload.tipoVehiculo) {
          case 'carro': // Ahora el frontend envía 'carro' directamente
            tipoVehiculoMapeadoUpdate = 'carro'
            break
          case 'moto':
            tipoVehiculoMapeadoUpdate = 'moto'
            break
          case 'taxi':
            tipoVehiculoMapeadoUpdate = 'taxi'
            break
          case 'enseñanza':
            tipoVehiculoMapeadoUpdate = 'enseñanza'
            break
          default:
            console.warn(`Valor inválido para 'tipoVehiculo' en update: ${payload.tipoVehiculo}`)
            return response.badRequest({
              message: `Valor inválido para 'tipoVehiculo': ${payload.tipoVehiculo}.`,
            })
        }
      }

      // --- Mapeo de medioEntero para UPDATE ---
      let medioEnteroMapeadoUpdate:
        | 'Redes Sociales'
        | 'Convenio o Referido Externo'
        | 'Call Center'
        | 'Fachada'
        | 'Referido Interno'
        | 'Asesor Comercial'
        | undefined // Permitir undefined si no se envía en la actualización

      if (payload.medioEntero) {
        switch (payload.medioEntero) {
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
            console.warn(`Valor inválido para 'medioEntero' en update: ${payload.medioEntero}`)
            return response.badRequest({
              message: `Valor inválido para 'medioEntero': ${payload.medioEntero}.`,
            })
        }
      }

      turno.merge({
        placa: payload.placa,
        tipoVehiculo: tipoVehiculoMapeadoUpdate,
        tieneCita: Boolean(payload.tieneCita),
        medioEntero: medioEnteroMapeadoUpdate,
        funcionarioId: payload.funcionarioId,
        horaSalida: payload.horaSalida || null,
        tiempoServicio: payload.tiempoServicio || null,
        estado: payload.estado as 'activo' | 'inactivo' | 'cancelado' | 'finalizado', // CORRECCIÓN: Aserción de tipo para 'estado'
        convenio: payload.convenio || null,
        referidoInterno: payload.referidoInterno || null,
        referidoExterno: payload.referidoExterno || null,
        observaciones: payload.observaciones || null,
        asesorComercial: payload.asesorComercial || null,
      })

      await turno.save()
      await turno.load('funcionario')

      return response.ok(turno)
    } catch (error: unknown) {
      console.error('Error al actualizar el turno (update):', error)
      return response.internalServerError({
        message: 'Error al actualizar el turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Activa un turno cambiando su estado a 'activo'.
   */
  public async activar({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.find(params.id)

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

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

  /**
   * Cancela un turno cambiando su estado a 'cancelado'.
   */
  public async cancelar({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.find(params.id)

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

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

  /**
   * Realiza un "soft delete" de un turno cambiando su estado a 'inactivo'.
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.find(params.id)

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

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
   * Registra la hora de salida de un turno y calcula el tiempo de servicio.
   */
  public async registrarSalida({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.find(params.id)

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

      const salida = DateTime.local()
      const entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm:ss')

      const duracion = salida.diff(entrada, ['minutes']).toObject()

      turno.horaSalida = salida.toFormat('HH:mm:ss')
      turno.tiempoServicio = `${Math.round(duracion.minutes ?? 0)} min`

      await turno.save()

      return response.ok({
        message: 'Hora de salida registrada',
        horaSalida: turno.horaSalida,
        tiempoServicio: turno.tiempoServicio,
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
   * Devuelve el siguiente número de turno para el día actual.
   */
  public async siguienteTurno({ response }: HttpContext) {
    try {
      const hoy = DateTime.local().toISODate()

      const ultimoTurno = await TurnoRtm.query()
        .where('fecha', hoy)
        .orderBy('turnoNumero', 'desc')
        .first()

      const siguiente = (ultimoTurno?.turnoNumero || 0) + 1

      return response.ok({ siguiente })
    } catch (error: unknown) {
      console.error('Error al obtener el siguiente número de turno:', error)
      return response.internalServerError({
        message: 'Error al obtener el siguiente número de turno',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}
