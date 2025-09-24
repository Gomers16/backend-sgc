// app/models/cliente.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Vehiculo from '#models/vehiculo'

export default class Cliente extends BaseModel {
  public static table = 'clientes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string | null

  @column({ columnName: 'doc_tipo' })
  declare docTipo: string | null

  @column({ columnName: 'doc_numero' })
  declare docNumero: string | null

  @column()
  declare telefono: string

  @column()
  declare email: string | null

  @column({ columnName: 'ciudad_id' })
  declare ciudadId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 1 Cliente -> N Vehículos (FK: vehiculos.cliente_id)
  @hasMany(() => Vehiculo, { foreignKey: 'clienteId' })
  declare vehiculos: HasMany<typeof Vehiculo>
}
