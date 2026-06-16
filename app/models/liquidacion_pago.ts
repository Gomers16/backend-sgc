import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import TramiteLiquidacion from '#models/tramite_liquidacion'

export default class LiquidacionPago extends BaseModel {
  public static table = 'liquidacion_pagos'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'tramite_liquidacion_id' })
  declare tramiteLiquidacionId: number

  @belongsTo(() => TramiteLiquidacion, { foreignKey: 'tramiteLiquidacionId' })
  declare tramiteLiquidacion: BelongsTo<typeof TramiteLiquidacion>

  @column.date({ columnName: 'fecha' })
  declare fecha: DateTime

  @column()
  declare monto: number

  @column({ columnName: 'forma_pago' })
  declare formaPago: string | null

  @column({ columnName: 'referencia_pago' })
  declare referenciaPago: string | null

  @column({ columnName: 'pdf_path' })
  declare pdfPath: string | null

  @column({ columnName: 'evidencia_url' })
  declare evidenciaUrl: string | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
