import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Usuario from '#models/usuario'
import Sede from '#models/sede'

export default class TurnoRtm extends BaseModel {
  public static table = 'turnos_rtm'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sedeId: number

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @column.dateTime({ serializeAs: 'fecha' })
  declare fecha: DateTime

  @column()
  declare horaIngreso: string

  @column()
  declare horaSalida?: string | null

  @column()
  declare tiempoServicio?: string | null

  @column()
  declare turnoNumero: number

  @column()
  declare turnoCodigo: string

  @column()
  declare placa: string

  @column()
  declare tipoVehiculo: 'Liviano Particular' | 'Liviano Taxi' | 'Liviano Público' | 'Motocicleta'

  @column()
  declare tieneCita: boolean

  @column()
  declare convenio?: string | null

  @column()
  declare referidoInterno?: string | null

  @column()
  declare referidoExterno?: string | null

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

  @column()
  declare asesorComercial?: string | null

  @column()
  declare estado: 'activo' | 'inactivo' | 'cancelado' | 'finalizado'

  @column({ columnName: 'funcionario_id' })
  declare funcionarioId: number

  @belongsTo(() => Usuario, {
    foreignKey: 'funcionarioId',
    localKey: 'id',
  })
  declare usuario: BelongsTo<typeof Usuario>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
