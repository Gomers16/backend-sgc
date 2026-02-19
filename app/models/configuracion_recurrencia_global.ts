// app/models/configuracion_recurrencia_global.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ConfiguracionRecurrenciaGlobal extends BaseModel {
  public static table = 'configuracion_recurrencia_global'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'meses_minimos' })
  declare mesesMinimos: number

  @column({ columnName: 'valor_dateo_recurrencia' })
  declare valorDateoRecurrencia: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
