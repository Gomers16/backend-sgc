import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from '#models/contrato'

export default class ContratoEvento extends BaseModel { // ✅ Nombre de la clase cambiado a ContratoEvento
  public static table = 'contrato_eventos' // ✅ Nombre de la tabla cambiado a 'contrato_eventos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contratoId: number

  @column()
  declare tipo: 'incapacidad' | 'suspension' | 'licencia' | 'permiso' | 'vacaciones' | 'cesantias' | 'disciplinario' | 'terminacion'

  @column()
  declare subtipo?: string

  @column.date()
  declare fechaInicio: DateTime

  @column.date()
  declare fechaFin?: DateTime

  @column()
  declare descripcion?: string

  @column()
  declare documentoUrl?: string

  @belongsTo(() => Contrato)
  declare contrato: BelongsTo<typeof Contrato>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
