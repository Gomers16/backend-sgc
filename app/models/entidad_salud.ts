import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/usuario'

export default class EntidadSalud extends BaseModel {
  public static table = 'entidades_salud'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare tipo: 'eps' | 'arl' | 'afp' | 'afc' | 'ccf'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Usuarios que referencian esta entidad por cada tipo
  @hasMany(() => Usuario, { foreignKey: 'eps_id' })
  declare usuariosEps: HasMany<typeof Usuario>

  @hasMany(() => Usuario, { foreignKey: 'arl_id' })
  declare usuariosArl: HasMany<typeof Usuario>

  @hasMany(() => Usuario, { foreignKey: 'afp_id' })
  declare usuariosAfp: HasMany<typeof Usuario>

  @hasMany(() => Usuario, { foreignKey: 'afc_id' })
  declare usuariosAfc: HasMany<typeof Usuario>

  @hasMany(() => Usuario, { foreignKey: 'ccf_id' })
  declare usuariosCcf: HasMany<typeof Usuario>
}
