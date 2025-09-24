import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Servicio extends BaseModel {
  // Por convención, la tabla será 'servicios' (plural de Servicio)
  // Si quisieras fijarla manualmente: public static table = 'servicios'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'codigo_servicio' })
  declare codigoServicio: string // 'RTM' | 'PREV' | 'PERI'

  @column({ columnName: 'nombre_servicio' })
  declare nombreServicio: string // texto visible en UI

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
