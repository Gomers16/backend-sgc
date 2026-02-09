// app/models/convenio.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'

import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'
import CaptacionDateo from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'

export type ConvenioTipo = 'PERSONA' | 'TALLER' | 'PARQUEADERO' | 'LAVADERO'
export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'CHEQUE'

export default class Convenio extends BaseModel {
  public static table = 'convenios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tipo: ConvenioTipo

  @column()
  declare codigo: string | null

  @column()
  declare nombre: string

  @column()
  declare establecimiento: string | null

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

  // ✅ NUEVO: Fecha de apertura del convenio
  @column.date({ columnName: 'fecha_apertura' })
  declare fechaApertura: DateTime | null

  // Campos de método de pago
  @column({ columnName: 'metodo_pago' })
  declare metodoPago: MetodoPago | null

  @column({ columnName: 'numero_metodo_pago' })
  declare numeroMetodoPago: string | null

  @column({ columnName: 'asesor_convenio_id' })
  declare asesorConvenioId: number | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // ========== RELACIONES ==========
  @hasMany(() => AsesorConvenioAsignacion, { foreignKey: 'convenioId' })
  declare asignaciones: HasMany<typeof AsesorConvenioAsignacion>

  @hasMany(() => CaptacionDateo, { foreignKey: 'convenioId' })
  declare dateos: HasMany<typeof CaptacionDateo>

  @belongsTo(() => AgenteCaptacion, { foreignKey: 'asesorConvenioId' })
  declare asesorConvenio: BelongsTo<typeof AgenteCaptacion>
}
