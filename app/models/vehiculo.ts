// app/models/vehiculo.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ClaseVehiculo from '#models/clase_vehiculos' // ← ajusta al nombre real del archivo
import Cliente from '#models/cliente'

export default class Vehiculo extends BaseModel {
  public static table = 'vehiculos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare placa: string // siempre UPPER

  @column({ columnName: 'clase_vehiculo_id' })
  declare claseVehiculoId: number

  @column()
  declare marca: string | null

  @column()
  declare linea: string | null

  @column()
  declare modelo: number | null

  @column({ columnName: 'cliente_id' })
  declare clienteId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** belongsTo: clase de vehículo */
  @belongsTo(() => ClaseVehiculo, { foreignKey: 'claseVehiculoId' })
  declare clase: BelongsTo<typeof ClaseVehiculo>

  /** belongsTo: dueño actual (opcional) */
  @belongsTo(() => Cliente, { foreignKey: 'clienteId' })
  declare cliente: BelongsTo<typeof Cliente>
}
