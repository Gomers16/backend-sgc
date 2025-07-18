import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Usuario from './usuario.js'

export default class TurnoRtm extends BaseModel {
  public static table = 'turnos_rtm'

  // Eliminamos: public static boot = [SoftDeletes]

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

  @column()
  declare tipoVehiculo: 'vehiculo' | 'moto'

  @column()
  declare tieneCita: boolean

  // Info adicional
  @column()
  declare convenio?: string | null

  @column()
  declare referidoInterno?: string | null

  @column()
  declare referidoExterno?: string | null

  @column()
  declare medioEntero: 'fachada' | 'redes' | 'telemercadeo' | 'otros'

  @column()
  declare observaciones?: string | null

  // Estado del turno: activo, inactivo, cancelado, etc.
  @column()
  declare estado: 'activo' | 'inactivo' | 'cancelado' // ¡Este es el campo clave para tu soft delete manual!

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

  // Eliminamos: @column.dateTime() declare deletedAt: DateTime | null
}
