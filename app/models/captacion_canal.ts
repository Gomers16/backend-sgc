import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import AgenteCaptacion from '#models/agente_captacion'

export default class CaptacionCanal extends BaseModel {
  public static table = 'captacion_canales'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column()
  declare descripcion?: string | null

  @column({ columnName: 'color_hex' })
  declare colorHex?: string | null

  @column()
  declare activo: boolean

  @column()
  declare orden: number

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null

  /**
   * Many-to-many: canales ⇄ agentes (pivot: agente_canal_membresias)
   * Incluye columnas de pivot y timestamps.
   */
  @manyToMany(() => AgenteCaptacion, {
    pivotTable: 'agente_canal_membresias',
    pivotColumns: ['is_default', 'activo'],
    pivotTimestamps: true,
  })
  declare agentes: ManyToMany<typeof AgenteCaptacion>
}
