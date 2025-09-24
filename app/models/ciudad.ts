import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Sede from '#models/sede'

export default class Ciudad extends BaseModel {
  public static table = 'ciudades'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare departamento?: string | null

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Sede)
  declare sedes: HasMany<typeof Sede>
}
