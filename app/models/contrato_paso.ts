import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Contrato from './contrato.js'

export default class ContratoPaso extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contratoId: number

  @belongsTo(() => Contrato)
  declare contrato: BelongsTo<typeof Contrato>

  @column()
  declare fase: 'inicio' | 'desarrollo' | 'fin'

  @column()
  declare nombrePaso: string

  @column.date()
  declare fecha?: DateTime

  @column()
  declare archivo?: string

  @column()
  declare observacion?: string

  @column()
  declare orden: number

  @column()
  declare completado: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
