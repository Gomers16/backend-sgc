// app/models/contrato_evento.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Usuario from './usuario.js'
import Contrato from './contrato.js'

export default class ContratoEvento extends BaseModel {
  public static table = 'contrato_eventos'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'contrato_id' })
  declare contratoId: number

  @belongsTo(() => Contrato, { foreignKey: 'contratoId' })
  declare contrato: BelongsTo<typeof Contrato>

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

  @column.date({ columnName: 'fecha_inicio' })
  declare fechaInicio: DateTime

  @column.date({ columnName: 'fecha_fin' })
  declare fechaFin?: DateTime | null

  @column()
  declare descripcion?: string | null

  @column({ columnName: 'documento_url' })
  declare documentoUrl?: string | null

  @column({ columnName: 'usuario_id' })
  declare usuarioId?: number | null

  @belongsTo(() => Usuario, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof Usuario>

  // 👇 Auto-llenar y actualizar en memoria
  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
