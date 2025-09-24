// app/models/clase_vehiculo.ts  ← usa minúsculas en carpeta y archivo
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Vehiculo from '#models/vehiculo'

export default class ClaseVehiculo extends BaseModel {
  public static table = 'clases_vehiculos' // ← plural, igual que en la migración

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string // LIV_PART, LIV_TAXI, LIV_PUBLICO, MOTO

  @column()
  declare nombre: string // "Liviano Particular", etc.

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 1 ClaseVehiculo -> N Vehiculos
  @hasMany(() => Vehiculo, {
    foreignKey: 'claseVehiculoId', // en Vehiculo: @column({ columnName: 'clase_vehiculo_id' })
  })
  declare vehiculos: HasMany<typeof Vehiculo>
}
