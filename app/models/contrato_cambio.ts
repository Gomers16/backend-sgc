import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from '#models/contrato'
import Usuario from '#models/usuario'

export default class ContratoCambio extends BaseModel {
  public static table = 'contrato_cambios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contratoId: number

  @belongsTo(() => Contrato, { foreignKey: 'contratoId' })
  declare contrato: BelongsTo<typeof Contrato>

  @column()
  declare usuarioId: number | null

  @belongsTo(() => Usuario, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof Usuario>

  @column()
  declare campo: string

  // Guardas JSON como string desde el controller; aquí lo dejamos tal cual.
  @column()
  declare oldValue: any | null

  @column()
  declare newValue: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
