import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tramite from '#models/tramite'

export default class TramiteLiquidacion extends BaseModel {
  public static table = 'tramite_liquidaciones'

  @column({ isPrimary: true })
  declare id: number

  // ── Relación con trámite
  @column({ columnName: 'tramite_id' })
  declare tramiteId: number

  @belongsTo(() => Tramite, { foreignKey: 'tramiteId' })
  declare tramite: BelongsTo<typeof Tramite>

  // ── Conceptos de liquidación
  @column()
  declare retencion: number | null

  @column({ columnName: 'derechos_traspaso' })
  declare derechosTraspaso: number | null

  @column({ columnName: 'paz_salvo' })
  declare pazSalvo: number | null

  @column({ columnName: 'levantamiento_prenda' })
  declare levantamientoPrenda: number | null

  @column({ columnName: 'inscripcion_prenda' })
  declare inscripcionPrenda: number | null

  @column()
  declare papeleria: number | null

  @column()
  declare honorarios: number | null

  @column({ columnName: 'impuesto_anio_actual' })
  declare impuestoAnioActual: number | null

  @column({ columnName: 'impuesto_anios_vencidos' })
  declare impuestoAniosVencidos: number | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
