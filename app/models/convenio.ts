import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'
import CaptacionDateo from '#models/captacion_dateo'

export type ConvenioTipo = 'PERSONA' | 'TALLER'

export default class Convenio extends BaseModel {
  public static table = 'convenios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tipo: ConvenioTipo

  // 🔹 FALTABA
  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column({ columnName: 'doc_tipo' })
  declare docTipo: string | null

  @column({ columnName: 'doc_numero' })
  declare docNumero: string | null

  @column()
  declare telefono: string | null

  @column()
  declare whatsapp: string | null

  @column()
  declare email: string | null

  @column({ columnName: 'ciudad_id' })
  declare ciudadId: number | null

  @column()
  declare direccion: string | null

  @column()
  declare notas: string | null

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relaciones
  @hasMany(() => AsesorConvenioAsignacion, { foreignKey: 'convenioId' })
  declare asignaciones: HasMany<typeof AsesorConvenioAsignacion>

  @hasMany(() => CaptacionDateo, { foreignKey: 'convenioId' })
  declare dateos: HasMany<typeof CaptacionDateo>
}
