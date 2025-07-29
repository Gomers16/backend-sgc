import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js' // Importa el modelo de Usuario para definir la relación

export default class Sede extends BaseModel {
  // Define el nombre de la tabla en la base de datos
  public static table = 'sedes'

  // Columna primaria de la tabla
  @column({ isPrimary: true })
  declare id: number

  // Columna para el nombre de la sede
  @column()
  declare nombre: string

  // Timestamp de creación automática
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Timestamp de actualización automática
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Define la relación HasMany: una Sede puede tener muchos Usuarios
  // La clave foránea 'sedeId' en el modelo Usuario apuntará al 'id' de Sede
  @hasMany(() => Usuario)
  declare usuarios: HasMany<typeof Usuario>
}
