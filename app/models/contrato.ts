import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Usuario from '#models/usuario'
import ContratoPaso from '#models/contrato_paso'
import Sede from '#models/sede'

export default class Contrato extends BaseModel {
  public static table = 'contratos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare usuarioId: number

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  @column()
  declare sedeId: number

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @column()
  declare tipoContrato: 'prestacion' | 'temporal' | 'laboral'

  @column()
  declare estado: 'activo' | 'inactivo'

  @column.date()
  declare fechaInicio: DateTime

  @column.date()
  declare fechaFin?: DateTime

  // ✅ Nuevas columnas para el archivo físico del contrato
  @column()
  declare nombreArchivoContratoFisico?: string

  @column()
  declare rutaArchivoContratoFisico?: string

  @hasMany(() => ContratoPaso)
  declare pasos: HasMany<typeof ContratoPaso>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
