import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PasswordReset extends BaseModel {
  static table = 'password_resets'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare correo: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime // ⬅️ Campo agregado

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
