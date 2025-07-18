import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Usuario from './usuario.js'
import ContratoPaso from './contrato_paso.js'

export default class Contrato extends BaseModel {
  public static table = 'contratos' // ✅ Corrección importante

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare usuarioId: number

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  @column()
  declare tipoContrato: 'prestacion' | 'temporal' | 'laboral'

  @column()
  declare estado: 'activo' | 'inactivo'

  @column.date()
  declare fechaInicio: DateTime

  @column.date()
  declare fechaFin?: DateTime

  @hasMany(() => ContratoPaso)
  declare pasos: HasMany<typeof ContratoPaso>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
