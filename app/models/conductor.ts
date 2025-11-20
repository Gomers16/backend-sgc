// app/models/conductor.ts
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Conductor extends BaseModel {
  public static table = 'conductores'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column({ columnName: 'doc_tipo' })
  declare docTipo: string | null

  @column({ columnName: 'doc_numero' })
  declare docNumero: string | null

  @column()
  declare telefono: string | null

  @column()
  declare email: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
