import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CaptacionDateo from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'
import Convenio from '#models/convenio'

export type ComisionServicio = 'RTM' | 'TECNOMECANICA' | 'PREVENTIVA' | 'SOAT' | 'OTRO'
export type ComisionEstado = 'PENDIENTE' | 'APROBADA' | 'PAGADA' | 'ANULADA'

export default class Comision extends BaseModel {
  public static table = 'comisiones'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'captacion_dateo_id' })
  declare captacionDateoId: number

  @column({ columnName: 'asesor_id' })
  declare asesorId: number

  @column({ columnName: 'convenio_id' })
  declare convenioId: number | null

  @column({ columnName: 'tipo_servicio' })
  declare tipoServicio: ComisionServicio

  @column()
  declare base: string // usar string para decimal en TS

  @column()
  declare porcentaje: string // "5.00"

  @column()
  declare monto: string

  @column()
  declare estado: ComisionEstado

  @column.dateTime({ columnName: 'fecha_calculo' })
  declare fechaCalculo: DateTime

  @column({ columnName: 'calculado_por' })
  declare calculadoPor: number | null

  @belongsTo(() => CaptacionDateo, { foreignKey: 'captacionDateoId' })
  declare dateo: BelongsTo<typeof CaptacionDateo>

  @belongsTo(() => AgenteCaptacion, { foreignKey: 'asesorId' })
  declare asesor: BelongsTo<typeof AgenteCaptacion>

  @belongsTo(() => Convenio, { foreignKey: 'convenioId' })
  declare convenio: BelongsTo<typeof Convenio>
}
