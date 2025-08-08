import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from './contrato.js'
import Usuario from './usuario.js'

export default class ContratoHistorialEstado extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  /** Relación con contrato */
  @column()
  declare contratoId: number

  @belongsTo(() => Contrato)
  declare contrato: BelongsTo<typeof Contrato>

  /** Usuario que realizó el cambio (opcional) */
  @column()
  declare usuarioId: number | null

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  /** Estado anterior */
  @column()
  declare oldEstado: 'activo' | 'inactivo'

  /** Nuevo estado */
  @column()
  declare newEstado: 'activo' | 'inactivo'

  /** Fecha en la que se hizo el cambio de estado */
  @column.dateTime()
  declare fechaCambio: DateTime

  /** Fecha de inicio del contrato (si aplica) */
  @column.date()
  declare fechaInicioContrato: DateTime

  /** Motivo del cambio de estado (opcional) */
  @column()
  declare motivo?: string | null

  /** Timestamps */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
