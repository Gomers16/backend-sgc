// app/models/configuracion_recurrencia_asesor.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import AgenteCaptacion from '#models/agente_captacion'

export type RecurrenciaTipoVehiculo = 'MOTO' | 'VEHICULO' | 'AMBOS'

export default class ConfiguracionRecurrenciaAsesor extends BaseModel {
  public static table = 'configuracion_recurrencia_asesores'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'asesor_id' })
  declare asesorId: number

  @column({ columnName: 'recurrencia_habilitada' })
  declare recurrenciaHabilitada: boolean

  @column({ columnName: 'meses_minimos' })
  declare mesesMinimos: number | null

  @column({ columnName: 'valor_dateo_recurrencia' })
  declare valorDateoRecurrencia: number | null

  @column({ columnName: 'tipo_vehiculo' })
  declare tipoVehiculo: RecurrenciaTipoVehiculo

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  /* ================== Relaciones ================== */

  @belongsTo(() => AgenteCaptacion, {
    foreignKey: 'asesorId',
  })
  declare asesor: BelongsTo<typeof AgenteCaptacion>
}
