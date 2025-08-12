import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from './contrato.js'

export default class ContratoPaso extends BaseModel {
  public static table = 'contrato_pasos' // Se recomienda usar `public static table`

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contratoId: number

  @belongsTo(() => Contrato)
  declare contrato: BelongsTo<typeof Contrato>

  @column()
  declare fase: 'inicio' | 'desarrollo' | 'fin' // Se recomienda tiparlo correctamente

  @column()
  declare nombrePaso: string

  @column.dateTime()
  declare fecha?: DateTime | null

  @column()
  declare observacion?: string | null

  @column()
  declare orden: number

  @column()
  declare completado: boolean

  @column()
  declare archivoUrl?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  nombreArchivo: string | undefined
}
