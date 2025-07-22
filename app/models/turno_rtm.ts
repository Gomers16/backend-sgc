import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Usuario from './usuario.js'

export default class TurnoRtm extends BaseModel {
  public static table = 'turnos_rtm'

  @column({ isPrimary: true })
  declare id: number

  // Datos de tiempo
  @column.dateTime({ serializeAs: 'fecha' })
  declare fecha: DateTime

  @column()
  declare horaIngreso: string

  @column()
  declare horaSalida?: string | null

  @column()
  declare tiempoServicio?: string | null

  // Turno
  @column()
  declare turnoNumero: number

  @column()
  declare turnoCodigo: string

  // Vehículo
  @column()
  declare placa: string

  // MODIFICACIÓN ANTERIOR: Reemplazado 'vehiculo' por 'carro' y añadido 'taxi', 'enseñanza'
  @column()
  declare tipoVehiculo: 'carro' | 'moto' | 'taxi' | 'enseñanza'

  @column()
  declare tieneCita: boolean

  // Info adicional
  @column()
  declare convenio?: string | null

  @column()
  declare referidoInterno?: string | null

  @column()
  declare referidoExterno?: string | null

  // NUEVA MODIFICACIÓN: Valores de 'medioEntero' basados en las imágenes
  @column()
  declare medioEntero:
    | 'Redes Sociales'
    | 'Convenio o Referido Externo'
    | 'Call Center'
    | 'Fachada'
    | 'Referido Interno'
    | 'Asesor Comercial'

  @column()
  declare observaciones?: string | null

  // CAMPO AGREGADO ANTERIORMENTE: asesorComercial
  @column()
  declare asesorComercial?: string | null // Asumiendo que puede ser opcional

  // Estado del turno: activo, inactivo, cancelado, etc.
  @column()
  declare estado: 'activo' | 'inactivo' | 'cancelado' | 'finalizado' // Añadido 'finalizado' si lo tienes en el frontend

  // Relación con funcionario
  @column()
  declare funcionarioId: number

  @belongsTo(() => Usuario, {
    foreignKey: 'funcionarioId',
  })
  declare funcionario: BelongsTo<typeof Usuario>

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
