import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/usuario'
import RazonSocial from '#models/razon_social'
import Ciudad from '#models/ciudad'

export default class Sede extends BaseModel {
  public static table = 'sedes'

  @column({ isPrimary: true })
  declare id: number

  // FK → razon_social.id
  @column({ columnName: 'razon_social_id' })
  declare razonSocialId: number

  // FK → ciudades.id
  @column({ columnName: 'ciudad_id' })
  declare ciudadId: number

  // Nombre visible de la sede
  @column()
  declare nombre: string

  // Dirección opcional
  @column()
  declare direccion?: string | null

  // Zona horaria (por defecto 'America/Bogota')
  @column()
  declare timezone: string

  // Estado
  @column()
  declare activo: boolean

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relaciones
  @hasMany(() => Usuario)
  declare usuarios: HasMany<typeof Usuario>

  @belongsTo(() => RazonSocial, { foreignKey: 'razonSocialId' })
  declare razonSocial: BelongsTo<typeof RazonSocial>

  @belongsTo(() => Ciudad, { foreignKey: 'ciudadId' })
  declare ciudad: BelongsTo<typeof Ciudad>
}
