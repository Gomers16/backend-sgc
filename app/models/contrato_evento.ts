import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from '#models/contrato'
import Usuario from '#models/usuario'

export default class ContratoEvento extends BaseModel {
  public static table = 'contrato_eventos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contratoId: number

  // 👇 NUEVO: autor del evento
  @column()
  declare usuarioId: number | null

  @belongsTo(() => Usuario, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof Usuario>

  @column()
  declare tipo:
    | 'incapacidad'
    | 'suspension'
    | 'licencia'
    | 'permiso'
    | 'vacaciones'
    | 'cesantias'
    | 'disciplinario'
    | 'terminacion'

  @column()
  declare subtipo?: string | null

  @column.date()
  declare fechaInicio: DateTime

  @column.date()
  declare fechaFin?: DateTime | null

  @column()
  declare descripcion?: string | null

  @column()
  declare documentoUrl?: string | null

  @belongsTo(() => Contrato)
  declare contrato: BelongsTo<typeof Contrato>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
