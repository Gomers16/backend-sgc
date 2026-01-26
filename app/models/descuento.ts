// app/models/descuento.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Descuento extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column()
  declare valorCarro: number

  @column()
  declare valorMoto: number

  @column()
  declare descripcion: string | null

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
