import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Rol from './rol.js'
import PermisoItem from './permiso_item.js'

export default class RolPermisoItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rolId: number

  @column()
  declare permisoItemId: number

  @belongsTo(() => Rol)
  declare rol: BelongsTo<typeof Rol>

  @belongsTo(() => PermisoItem)
  declare permisoItem: BelongsTo<typeof PermisoItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
