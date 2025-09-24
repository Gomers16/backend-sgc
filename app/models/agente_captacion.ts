// app/models/agente_captacion.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import CaptacionDateo from '#models/captacion_dateo'

export default class AgenteCaptacion extends BaseModel {
  public static table = 'agentes_captacion' // asegúrate que la migración use exactamente este nombre

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tipo: 'ASESOR_INTERNO' | 'ASESOR_EXTERNO' | 'TELEMERCADEO'

  @column()
  declare nombre: string

  @column()
  declare telefono: string | null

  @column({ columnName: 'doc_tipo' })
  declare docTipo: 'CC' | 'NIT' | null

  @column({ columnName: 'doc_numero' })
  declare docNumero: string | null

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // 1 Agente -> N Dateos (FK: captacion_dateos.agente_id)
  @hasMany(() => CaptacionDateo, { foreignKey: 'agenteId' })
  declare dateos: HasMany<typeof CaptacionDateo>
}
