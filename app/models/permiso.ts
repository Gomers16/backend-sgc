import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import PermisoItem from './permiso_item.js'

export default class Permiso extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string // Ej: ver, editar, eliminar

  @column()
  declare descripcion?: string

  @hasMany(() => PermisoItem)
  declare items: HasMany<typeof PermisoItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
