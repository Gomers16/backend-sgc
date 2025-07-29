import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Usuario from '#models/usuario' // Updated import using alias
import ContratoPaso from '#models/contrato_paso' // Updated import using alias
import Sede from '#models/sede' // Importación del modelo Sede

export default class Contrato extends BaseModel {
  public static table = 'contratos' // ✅ Corrección importante

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare usuarioId: number

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  // Columna para el ID de la sede a la que pertenece el contrato
  @column()
  declare sedeId: number

  // Relación con el modelo Sede
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

  @hasMany(() => ContratoPaso)
  declare pasos: HasMany<typeof ContratoPaso>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
