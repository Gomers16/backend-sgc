import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Usuario from './usuario.js'
import RolPermisoItem from './rol_permiso_item.js'

export default class Rol extends BaseModel {
  public static table = 'roles' // ✅ Nombre explícito de la tabla

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string // ✅ Campo que sí existe en la base de datos

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relaciones
  @hasMany(() => Usuario)
  declare usuarios: HasMany<typeof Usuario>

  @hasMany(() => RolPermisoItem)
  declare permisosPorItem: HasMany<typeof RolPermisoItem>
}
