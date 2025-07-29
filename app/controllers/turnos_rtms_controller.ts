// app/Controllers/TurnosRtmController.ts
import type { HttpContext } from '@adonisjs/core/http'
import TurnoRtm from '#models/turno_rtm'
import { DateTime } from 'luxon'
import ExcelJS from 'exceljs'
import Usuario from '#models/usuario' // Importa el modelo de Usuario

// Definimos los tipos de vehículo válidos una sola vez para reutilizar.
type TipoVehiculoDB = 'Liviano Particular' | 'Liviano Taxi' | 'Liviano Público' | 'Motocicleta'
const VALID_TIPOS_VEHICULO: TipoVehiculoDB[] = [
  'Liviano Particular',
  'Liviano Taxi',
  'Liviano Público',
  'Motocicleta',
]

export default class TurnosRtmController {
  /**
   * Obtiene una lista de turnos RTM.
   * Permite filtrar por fecha (opcional), placa, tipo de vehículo, estado, número de turno,
   * y ahora también por rango de fechas (fechaInicio y fechaFin).
   * Siempre precarga las relaciones 'usuario' y 'sede'.
   *
   * @param {HttpContext} ctx
   * @returns {Promise<TurnoRtm[]>}
   */
  public async index({ request, response }: HttpContext) {
    const { fecha, placa, tipoVehiculo, estado, turnoNumero, fechaInicio, fechaFin } = request.qs()

    try {
      // Precargamos 'usuario' y 'sede'
      let query = TurnoRtm.query().preload('usuario').preload('sede')

      if (fechaInicio && fechaFin) {
        const parsedFechaInicio = DateTime.fromISO(fechaInicio as string).startOf('day')
        const parsedFechaFin = DateTime.fromISO(fechaFin as string).endOf('day')

        if (!parsedFechaInicio.isValid || !parsedFechaFin.isValid) {
          return response.badRequest({
            message: 'Formato de fecha de inicio o fin inválido. Use YYYY-MM-DD.',
          })
        }
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
        const sqlFechaInicio: string = parsedFechaInicio.toSQL() as string
        query = query.where('fecha', '>=', sqlFechaInicio)
      } else if (fechaFin) {
        const parsedFechaFin = DateTime.fromISO(fechaFin as string).endOf('day')
        if (!parsedFechaFin.isValid) {
          return response.badRequest({
            message: 'Formato de fecha de fin inválido. Use YYYY-MM-DD.',
          })
        }
        const sqlFechaFin: string = parsedFechaFin.toSQL() as string
        query = query.where('fecha', '<=', sqlFechaFin)
      } else if (fecha) {
        const fechaAFiltrar = DateTime.fromISO(fecha as string)
        if (!fechaAFiltrar.isValid) {
          return response.badRequest({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' })
        }
        const sqlFechaStart: string = fechaAFiltrar.startOf('day').toSQL() as string
        const sqlFechaEnd: string = fechaAFiltrar.endOf('day').toSQL() as string
        query = query.whereBetween('fecha', [sqlFechaStart, sqlFechaEnd])
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

      // --- VALIDACIÓN Y FILTRO DE TIPO DE VEHÍCULO (directo, sin mapeo) ---
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
   * Siempre precarga las relaciones 'usuario' y 'sede'.
   *
   * @param {HttpContext} ctx
   */
  public async show({ params, response }: HttpContext) {
    try {
      const turno = await TurnoRtm.query()
        .where('id', params.id)
        .preload('usuario')
        .preload('sede')
        .first()

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
   * **NOTA:** Recibe el `usuarioId` (que es el ID primario) en el payload y busca su sede.
   *
   * @param {HttpContext} ctx
   */
  public async store({ request, response }: HttpContext) {
    // 'auth' ya no se usa aquí
    try {
      const rawPayload = request.only([
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
        'usuarioId', // Se espera usuarioId (el ID primario) desde el frontend
      ])

      // Validación inicial de campos obligatorios
      if (
        !rawPayload.placa ||
        !rawPayload.tipoVehiculo ||
        !rawPayload.medioEntero ||
        !rawPayload.usuarioId || // `usuarioId` (el ID primario) es obligatorio
        !rawPayload.fecha ||
        !rawPayload.horaIngreso
      ) {
        return response.badRequest({
          message:
            'Faltan campos obligatorios: placa, tipoVehiculo, medioEntero, usuarioId, fecha, horaIngreso.',
        })
      }

      // --- Obtener la sede del usuario que crea el turno (buscando por el ID primario) ---
      // ✅ CAMBIO CLAVE AQUÍ: Usamos find() con el ID primario (numérico)
      const usuarioCreador = await Usuario.find(rawPayload.usuarioId) // Se espera que rawPayload.usuarioId sea un número
      if (!usuarioCreador) {
        // Mensaje de error si el usuario no se encuentra por su ID primario
        return response.badRequest({
          message: `Usuario con ID '${rawPayload.usuarioId}' no encontrado como creador del turno.`,
        })
      }
      const sedeIdDelUsuario = usuarioCreador.sedeId // Asumiendo que el modelo Usuario tiene una propiedad sedeId

      if (!sedeIdDelUsuario) {
        // Mensaje de error si la sede no está asignada al usuario
        return response.badRequest({
          message: `El usuario con ID '${rawPayload.usuarioId}' no tiene una sede asignada.`,
        })
      }

      const nowInBogota = DateTime.local().setZone('America/Bogota')

      if (!nowInBogota.isValid) {
        return response.internalServerError({
          message: 'Error al obtener la fecha actual en la zona horaria de Bogotá.',
        })
      }
      const hoy = nowInBogota.toISODate()!

      const ultimoTurno = await TurnoRtm.query()
        .where('fecha', hoy)
        .andWhere('sedeId', sedeIdDelUsuario) // Filtramos por sede del usuario
        .orderBy('turnoNumero', 'desc')
        .first()

      const siguienteTurno = (ultimoTurno?.turnoNumero || 0) + 1

      // --- VALIDACIÓN DE TIPO DE VEHÍCULO (directa, sin mapeo) ---
      if (!VALID_TIPOS_VEHICULO.includes(rawPayload.tipoVehiculo as TipoVehiculoDB)) {
        return response.badRequest({
          message: `Valor inválido para 'tipoVehiculo': ${rawPayload.tipoVehiculo}. Debe ser uno de: ${VALID_TIPOS_VEHICULO.join(', ')}.`,
        })
      }
      const tipoVehiculoParaGuardar = rawPayload.tipoVehiculo as TipoVehiculoDB

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

      const fechaParaGuardar = DateTime.fromISO(rawPayload.fecha, { zone: 'America/Bogota' })
      if (!fechaParaGuardar.isValid) {
        return response.badRequest({ message: 'Formato de fecha inválido recibido del frontend.' })
      }

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
        sedeId: sedeIdDelUsuario, // Asignamos la sede del usuario que viene en el payload y se buscó
        placa: rawPayload.placa,
        tipoVehiculo: tipoVehiculoParaGuardar, // Usamos el valor directamente validado
        tieneCita: Boolean(rawPayload.tieneCita),
        medioEntero: medioEnteroMapeado,
        funcionarioId: usuarioCreador.id, // ✅ Usamos el ID NUMÉRICO del usuario encontrado
        convenio: rawPayload.convenio || null,
        referidoInterno: rawPayload.referidoInterno || null,
        referidoExterno: rawPayload.referidoExterno || null,
        observaciones: rawPayload.observaciones || null,
        asesorComercial: rawPayload.asesorComercial || null,
        fecha: fechaParaGuardar,
        horaIngreso: horaIngresoParaGuardar,
        turnoNumero: siguienteTurno,
        turnoCodigo: `RTM-${nowInBogota.toFormat('yyyyMMddHHmmss')}`,
        estado: 'activo' as 'activo',
      }

      const turno = await TurnoRtm.create(finalPayload)

      await turno.load('usuario')
      await turno.load('sede') // Precargamos también la sede para la respuesta

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
   * **NOTA:** Recibe el `usuarioId` (ID primario) en el payload y busca su sede.
   *
   * @param {HttpContext} ctx
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const rawPayload = request.only([
        'placa',
        'tipoVehiculo',
        'tieneCita',
        'convenio',
        'referidoInterno',
        'referidoExterno',
        'medioEntero',
        'observaciones',
        'usuarioId', // Se espera usuarioId (el ID primario) desde el frontend
        'horaSalida',
        'tiempoServicio',
        'estado',
        'asesorComercial',
      ])

      // Validar que usuarioId esté presente y sea numérico
      const idNumericoUsuario = Number(rawPayload.usuarioId)
      if (Number.isNaN(idNumericoUsuario)) {
        return response.badRequest({
          message: 'El usuarioId proporcionado no es un número válido para la actualización.',
        })
      }

      // --- Obtener la sede del usuario que actualiza el turno (buscando por el ID primario) ---
      // ✅ CAMBIO CLAVE AQUÍ: Usamos find() con el ID primario
      const usuarioActualizador = await Usuario.find(idNumericoUsuario)
      if (!usuarioActualizador) {
        return response.unauthorized({
          message: `Usuario con ID '${idNumericoUsuario}' no encontrado para actualizar el turno.`,
        })
      }
      const sedeIdDelUsuarioActualizador = usuarioActualizador.sedeId

      const turno = await TurnoRtm.query().where('id', params.id).preload('sede').first()

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado para actualizar' })
      }

      // Validar que el turno pertenezca a la sede del usuario que lo actualiza
      if (turno.sedeId !== sedeIdDelUsuarioActualizador) {
        return response.forbidden({
          message: `No tienes permiso para actualizar turnos de la sede ${turno.sede?.nombre || 'desconocida'}.`,
        })
      }

      // --- VALIDACIÓN DE TIPO DE VEHÍCULO PARA UPDATE (directa, sin mapeo) ---
      let tipoVehiculoParaActualizar: TipoVehiculoDB | undefined
      if (rawPayload.tipoVehiculo) {
        if (!VALID_TIPOS_VEHICULO.includes(rawPayload.tipoVehiculo as TipoVehiculoDB)) {
          console.warn(`Valor inválido para 'tipoVehiculo' en update: ${rawPayload.tipoVehiculo}`)
          return response.badRequest({
            message: `Valor inválido para 'tipoVehiculo': ${rawPayload.tipoVehiculo}. Debe ser uno de: ${VALID_TIPOS_VEHICULO.join(', ')}.`,
          })
        }
        tipoVehiculoParaActualizar = rawPayload.tipoVehiculo as TipoVehiculoDB
      }

      let medioEnteroMapeadoUpdate:
        | 'Redes Sociales'
        | 'Convenio o Referido Externo'
        | 'Call Center'
        | 'Fachada'
        | 'Referido Interno'
        | 'Asesor Comercial'
        | undefined

      if (rawPayload.medioEntero) {
        switch (rawPayload.medioEntero) {
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
            console.warn(`Valor inválido para 'medioEntero' en update: ${rawPayload.medioEntero}`)
            return response.badRequest({
              message: `Valor inválido para 'medioEntero': ${rawPayload.medioEntero}.`,
            })
        }
      }

      turno.merge({
        placa: rawPayload.placa,
        tipoVehiculo: tipoVehiculoParaActualizar,
        tieneCita:
          typeof rawPayload.tieneCita === 'boolean' ? rawPayload.tieneCita : turno.tieneCita,
        medioEntero: medioEnteroMapeadoUpdate,
        funcionarioId: usuarioActualizador.id, // ✅ Usamos el ID NUMÉRICO del usuario encontrado
        horaSalida: rawPayload.horaSalida || null,
        tiempoServicio: rawPayload.tiempoServicio || null,
        estado: rawPayload.estado as 'activo' | 'inactivo' | 'cancelado' | 'finalizado',
        convenio: rawPayload.convenio || null,
        referidoInterno: rawPayload.referidoInterno || null,
        referidoExterno: rawPayload.referidoExterno || null,
        observaciones: rawPayload.observaciones || null,
        asesorComercial: rawPayload.asesorComercial || null,
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

  /**
   * Activa un turno cambiando su estado a 'activo'.
   * **NOTA:** Recibe el `usuarioId` (ID primario) en el payload y busca su sede para validar.
   *
   * @param {HttpContext} ctx
   */
  public async activar({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) {
        return response.unauthorized({ message: 'Se requiere usuarioId para activar turnos.' })
      }
      // ✅ CAMBIO CLAVE AQUÍ: Usamos find() con el ID primario
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
      const sedeIdDelUsuarioOperador = usuarioOperador.sedeId

      const turno = await TurnoRtm.query().where('id', params.id).preload('sede').first()

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

      if (turno.sedeId !== sedeIdDelUsuarioOperador) {
        return response.forbidden({
          message: `No tienes permiso para activar turnos de la sede ${turno.sede?.nombre || 'desconocida'}.`,
        })
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
   * **NOTA:** Recibe el `usuarioId` (ID primario) en el payload y busca su sede para validar.
   *
   * @param {HttpContext} ctx
   */
  public async cancelar({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) {
        return response.unauthorized({ message: 'Se requiere usuarioId para cancelar turnos.' })
      }
      // ✅ CAMBIO CLAVE AQUÍ: Usamos find() con el ID primario
      const idNumericoUsuario = Number(usuarioId);
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
      const sedeIdDelUsuarioOperador = usuarioOperador.sedeId

      const turno = await TurnoRtm.query().where('id', params.id).preload('sede').first()

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

      if (turno.sedeId !== sedeIdDelUsuarioOperador) {
        return response.forbidden({
          message: `No tienes permiso para cancelar turnos de la sede ${turno.sede?.nombre || 'desconocida'}.`,
        })
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
   * **NOTA:** Recibe el `usuarioId` (ID primario) en el payload y busca su sede para validar.
   *
   * @param {HttpContext} ctx
   */
  public async destroy({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) {
        return response.unauthorized({ message: 'Se requiere usuarioId para inhabilitar turnos.' })
      }
      // ✅ CAMBIO CLAVE AQUÍ: Usamos find() con el ID primario
      const idNumericoUsuario = Number(usuarioId);
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
      const sedeIdDelUsuarioOperador = usuarioOperador.sedeId

      const turno = await TurnoRtm.query().where('id', params.id).preload('sede').first()

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

      if (turno.sedeId !== sedeIdDelUsuarioOperador) {
        return response.forbidden({
          message: `No tienes permiso para inhabilitar turnos de la sede ${turno.sede?.nombre || 'desconocida'}.`,
        })
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
   * **NOTA:** Recibe el `usuarioId` (ID primario) en el payload y busca su sede para validar.
   *
   * @param {HttpContext} ctx
   */
  public async registrarSalida({ params, response, request }: HttpContext) {
    try {
      const { usuarioId } = request.only(['usuarioId'])
      if (!usuarioId) {
        return response.unauthorized({ message: 'Se requiere usuarioId para registrar la salida.' })
      }
      // ✅ CAMBIO CLAVE AQUÍ: Usamos find() con el ID primario
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
      const sedeIdDelUsuarioOperador = usuarioOperador.sedeId

      const turno = await TurnoRtm.query().where('id', params.id).preload('sede').first()

      if (!turno) {
        return response.status(404).json({ message: 'Turno no encontrado' })
      }

      if (turno.sedeId !== sedeIdDelUsuarioOperador) {
        return response.forbidden({
          message: `No tienes permiso para registrar la salida de turnos de la sede ${turno.sede?.nombre || 'desconocida'}.`,
        })
      }

      const salida = DateTime.local().setZone('America/Bogota')
      const entrada = DateTime.fromFormat(turno.horaIngreso, 'HH:mm:ss', {
        zone: 'America/Bogota',
      })

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
   * Devuelve el siguiente número de turno para el día actual, basado en la sede del usuario.
   * **NOTA:** Recibe el `usuarioId` (ID primario) en la query string para obtener la sede.
   *
   * @param {HttpContext} ctx
   */
  public async siguienteTurno({ request, response }: HttpContext) {
    try {
      const { usuarioId } = request.qs() // Espera usuarioId (el ID primario) en la query string
      if (!usuarioId) {
        return response.badRequest({
          message: 'Se requiere usuarioId en la URL para obtener el siguiente turno.',
        })
      }

      // ✅ CAMBIO CLAVE AQUÍ: Usamos find() con el ID primario
      const idNumericoUsuario = Number(usuarioId); // Convertimos usuarioId a número
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
        .andWhere('sedeId', sedeIdDelUsuario) // Filtramos por sede del usuario
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
   * Exporta un reporte de turnos a Excel (XLSX).
   * Permite filtrar por rango de fechas (fechaInicio y fechaFin).
   */
  public async exportExcel({ request, response }: HttpContext) {
    const { fechaInicio, fechaFin } = request.qs()

    try {
      let query = TurnoRtm.query().preload('usuario').preload('sede')

      if (fechaInicio && fechaFin) {
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
        const sqlFechaInicio: string = parsedFechaInicio.toSQL() as string
        const sqlFechaFin: string = parsedFechaFin.toSQL() as string
        query = query.whereBetween('fecha', [sqlFechaInicio, sqlFechaFin])
      } else {
        return response.badRequest({
          message:
            'Se requieren las fechas de inicio y fin (fechaInicio, fechaFin) para generar el reporte Excel.',
        })
      }

      const turnos = await query.orderBy('fecha', 'asc').orderBy('horaIngreso', 'asc').exec()

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
        { header: 'Usuario', key: 'usuario', width: 30 }, // Cambiado de 'Funcionario' a 'Usuario'
        { header: 'Sede', key: 'sede', width: 20 }, // Nueva columna para la sede
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
          sede: turno.sede ? turno.sede.nombre : '-', // Usa la relación 'sede' para obtener el nombre
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
