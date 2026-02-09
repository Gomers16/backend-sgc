import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AgenteCaptacion from '#models/agente_captacion'

export type TipoAsesorRecurrencia = 'COMERCIAL' | 'CONVENIO'
export type TipoDescuentoRecurrencia = 'PORCENTAJE' | 'VALOR_FIJO'
export type AplicarDescuentoEn = 'SOLO_DATEO' | 'SOLO_PLACA' | 'DATEO_Y_PLACA'

export default class ConfiguracionRecurrencia extends BaseModel {
  public static table = 'configuracion_recurrencia'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'asesor_id' })
  declare asesorId: number | null

  @column({ columnName: 'tipo_asesor' })
  declare tipoAsesor: TipoAsesorRecurrencia | null

  @column({ columnName: 'periodo_meses' })
  declare periodoMeses: number

  @column({ columnName: 'tipo_descuento' })
  declare tipoDescuento: TipoDescuentoRecurrencia

  @column({ columnName: 'valor_descuento' })
  declare valorDescuento: number

  @column({ columnName: 'aplicar_descuento_en' })
  declare aplicarDescuentoEn: AplicarDescuentoEn

  @column()
  declare activo: boolean

  // Relaciones
  @belongsTo(() => AgenteCaptacion, { foreignKey: 'asesorId' })
  declare asesor: BelongsTo<typeof AgenteCaptacion>

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
