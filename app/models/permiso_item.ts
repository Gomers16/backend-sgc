import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Item from './item.js'
import Permiso from './permiso.js'
import RolPermisoItem from './rol_permiso_item.js'

export default class PermisoItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare itemId: number

  @column()
  declare permisoId: number

  @belongsTo(() => Item)
  declare item: BelongsTo<typeof Item>

  @belongsTo(() => Permiso)
  declare permiso: BelongsTo<typeof Permiso>

  @hasMany(() => RolPermisoItem)
  declare roles: HasMany<typeof RolPermisoItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
