// app/Controllers/TurnosRtmController.ts
import type { HttpContext } from '@adonisjs/core/http'
import TurnoRtm from '#models/turno_rtm'
import { DateTime } from 'luxon'

export default class TurnosRtmController {
  /**
   * Obtiene una lista de turnos RTM.
   * Permite filtrar por fecha (opcional), placa, tipo de vehículo, estado y número de turno.
   *
   * @param {HttpContext} ctx
   * @returns {Promise<TurnoRtm[]>}
   */
  public async index({ request, response }: HttpContext) {
    const {
      fecha, // Opcional: la fecha en formato 'YYYY-MM-DD'.
      placa, // Opcional: parte de la placa para filtrar.
      tipoVehiculo, // Opcional: 'vehiculo' o 'moto'.
      estado, // Opcional: 'activo', 'inactivo', 'cancelado'.
      turnoNumero, // Opcional: el número de turno para filtrar.
    } = request.qs()

    try {
      let query = TurnoRtm.query().preload('funcionario')

      // 1. **Filtro por Fecha (Opcional):**
      // Si se proporciona una fecha, la usamos para filtrar.
      // Si NO se proporciona, NO aplicamos filtro de fecha, mostrando todos los turnos.
      // Si quieres que por defecto siempre muestre los del día actual si no se especifica,
      // puedes usar la lógica comentada en el código del frontend.
      if (fecha) {
        const fechaAFiltrar = DateTime.fromISO(fecha as string);
        if (!fechaAFiltrar.isValid) {
          return response.badRequest({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
        }
        query = query.where('fecha', fechaAFiltrar.toISODate());
      }

      // 2. **Filtro por Placa (Opcional):**
      if (placa) {
        query = query.where('placa', 'LIKE', `%${placa}%`)
      }

      // 3. **Filtro por Número de Turno (Opcional):**
      if (turnoNumero) {
        const numTurno = parseInt(turnoNumero as string, 10);
        if (!isNaN(numTurno) && numTurno > 0) {
          query = query.where('turnoNumero', numTurno);
        } else {
          return response.badRequest({ message: 'Número de turno inválido.' });
        }
      }

      // 4. **Filtro por Tipo de Vehículo (Opcional):**
      if (tipoVehiculo) {
        if (['vehiculo', 'moto'].includes(tipoVehiculo as string)) {
          query = query.where('tipoVehiculo', tipoVehiculo as 'vehiculo' | 'moto')
        } else {
          return response.badRequest({
            message: 'Tipo de vehículo inválido. Debe ser "vehiculo" o "moto".',
          })
        }
      }

      // 5. **Filtro por Estado (Opcional):**
      if (estado) {
        if (['activo', 'inactivo', 'cancelado'].includes(estado as string)) {
          query = query.where('estado', estado as 'activo' | 'inactivo' | 'cancelado')
        } else {
          return response.badRequest({
            message: 'Estado de turno inválido. Debe ser "activo", "inactivo" o "cancelado".',
          })
        }
      }

      // Ordenar los resultados para una presentación consistente: por fecha descendente, luego hora de ingreso ascendente
      query = query.orderBy('fecha', 'desc').orderBy('horaIngreso', 'asc')

      // Ejecutar la consulta y cargar la relación con el funcionario
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
   *
   * @param {HttpContext} ctx
   * @returns {Promise<TurnoRtm>}
   */
  public async show({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.query()
        .where('id', params.id)
        .preload('funcionario') // Carga la información del funcionario asociado
        .first() // Usa first() ya que findOrFail() lanzaría un error 404 por defecto

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
   * Asigna un número de turno consecutivo para la fecha actual.
   *
   * @param {HttpContext} ctx
   * @returns {Promise<TurnoRtm>}
   */
  public async store({ request, response }: HttpContext) {
    try {
      const now = DateTime.local() // Hora actual en la zona de Ibagué, Tolima, Colombia
      const hoy = now.toISODate() // Formato 'YYYY-MM-DD'

      // Obtener el último número de turno para hoy para calcular el siguiente
      const ultimoTurno = await TurnoRtm.query()
        .where('fecha', hoy)
        .orderBy('turnoNumero', 'desc')
        .first()

      const siguienteTurno = (ultimoTurno?.turnoNumero || 0) + 1

      // Cargar solo los campos permitidos del request
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
      ])

      // Validar campos obligatorios
      if (
        !rawPayload.placa ||
        !rawPayload.tipoVehiculo ||
        !rawPayload.medioEntero ||
        !rawPayload.funcionarioId
      ) {
        return response.badRequest({
          message: 'Faltan campos obligatorios: placa, tipoVehiculo, medioEntero, funcionarioId.',
        })
      }

      // Preparar el payload para la creación, asegurando valores nulos para opcionales
      const payload = {
        placa: rawPayload.placa,
        tipoVehiculo: rawPayload.tipoVehiculo as 'vehiculo' | 'moto', // Casting para el tipo enum
        tieneCita: Boolean(rawPayload.tieneCita),
        medioEntero: rawPayload.medioEntero as 'fachada' | 'redes' | 'telemercadeo' | 'otros', // Casting
        funcionarioId: rawPayload.funcionarioId,
        convenio: rawPayload.convenio || null,
        referidoInterno: rawPayload.referidoInterno || null,
        referidoExterno: rawPayload.referidoExterno || null,
        observaciones: rawPayload.observaciones || null,
      }

      // Crear el nuevo turno
      const turno = await TurnoRtm.create({
        ...payload,
        fecha: now, // La fecha del turno será la actual
        horaIngreso: now.toFormat('HH:mm:ss'), // Hora de ingreso actual
        turnoNumero: siguienteTurno, // Asignar el siguiente número de turno
        turnoCodigo: `RTM-${now.toFormat('yyyyMMddHHmmss')}`, // Código único para el turno
        estado: 'activo', // Por defecto, un turno nuevo está activo
      })

      // Cargar la relación del funcionario para la respuesta
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
   * Permite modificar varios campos del turno.
   *
   * @param {HttpContext} ctx
   * @returns {Promise<TurnoRtm>}
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.find(params.id) // Busca el turno por ID

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado para actualizar' })
      }

      // Cargar solo los campos permitidos del request para la actualización
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
        // No permitir actualizar 'fecha', 'horaIngreso', 'turnoNumero', 'turnoCodigo'
        // directamente desde aquí si son campos auto-generados o fijos
      ])

      // Actualizar el turno con los datos del payload
      turno.merge({
        placa: payload.placa,
        tipoVehiculo: payload.tipoVehiculo as 'vehiculo' | 'moto',
        tieneCita: Boolean(payload.tieneCita),
        medioEntero: payload.medioEntero as 'fachada' | 'redes' | 'telemercadeo' | 'otros',
        funcionarioId: payload.funcionarioId,
        horaSalida: payload.horaSalida || null,
        tiempoServicio: payload.tiempoServicio || null,
        estado: payload.estado as 'activo' | 'inactivo' | 'cancelado',
        convenio: payload.convenio || null,
        referidoInterno: payload.referidoInterno || null,
        referidoExterno: payload.referidoExterno || null,
        observaciones: payload.observaciones || null,
      })

      await turno.save() // Guarda los cambios en la base de datos
      await turno.load('funcionario') // Recarga la relación del funcionario

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
   *
   * @param {HttpContext} ctx
   * @returns {Promise<{ message: string, turnoId: number }>}
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
   *
   * @param {HttpContext} ctx
   * @returns {Promise<{ message: string, turnoId: number }>}
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
   *
   * @param {HttpContext} ctx
   * @returns {Promise<{ message: string }>}
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.find(params.id)

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

      turno.estado = 'inactivo' // Cambia el estado a 'inactivo' en lugar de eliminarlo
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
   *
   * @param {HttpContext} ctx
   * @returns {Promise<{ message: string, horaSalida: string | null, tiempoServicio: string | null }>}
   */
  public async registrarSalida({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.find(params.id)

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

      const salida = DateTime.local() // Hora actual para la salida
      // Asegúrate de que 'horaIngreso' tenga el formato correcto para Luxon
      const entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm:ss')

      // Calcula la duración en minutos
      const duracion = salida.diff(entrada, ['minutes']).toObject()

      turno.horaSalida = salida.toFormat('HH:mm:ss') // Formatea la hora de salida
      turno.tiempoServicio = `${Math.round(duracion.minutes ?? 0)} min` // Formatea el tiempo de servicio

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
   *
   * @param {HttpContext} ctx
   * @returns {Promise<{ siguiente: number }>}
   */
  public async siguienteTurno({ response }: HttpContext) {
    try {
      const hoy = DateTime.local().toISODate() // Obtiene la fecha actual en formato 'YYYY-MM-DD'

      const ultimoTurno = await TurnoRtm.query()
        .where('fecha', hoy)
        .orderBy('turnoNumero', 'desc')
        .first()

      const siguiente = (ultimoTurno?.turnoNumero || 0) + 1 // Calcula el siguiente número de turno

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
