import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'

export default class RazonSocial extends BaseModel {
  public static table = 'razon_social' // ✅ Nombre exacto de la tabla

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare nit: string

  @column()
  declare activo: boolean

  @hasMany(() => Usuario)
  declare usuarios: HasMany<typeof Usuario>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
