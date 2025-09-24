// app/models/captacion_dateo.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AgenteCaptacion from '#models/agente_captacion'

export type Canal = 'FACHADA' | 'ASESOR' | 'TELE' | 'REDES'
export type Origen = 'UI' | 'WHATSAPP' | 'IMPORT'

export default class CaptacionDateo extends BaseModel {
  public static table = 'captacion_dateos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare canal: Canal

  @column({ columnName: 'agente_id' })
  declare agenteId: number | null

  @column()
  declare placa: string | null

  @column()
  declare telefono: string | null

  @column()
  declare origen: Origen

  @column()
  declare observacion: string | null

  // Imagen única (opcional)
  @column({ columnName: 'imagen_url' })
  declare imagenUrl: string | null

  @column({ columnName: 'imagen_mime' })
  declare imagenMime: string | null

  @column({ columnName: 'imagen_tamano_bytes' })
  declare imagenTamanoBytes: number | null

  @column({ columnName: 'imagen_hash' })
  declare imagenHash: string | null

  @column({ columnName: 'imagen_origen_id' })
  declare imagenOrigenId: string | null

  @column({ columnName: 'imagen_subida_por' })
  declare imagenSubidaPor: number | null

  // Consumo
  @column({ columnName: 'consumido_turno_id' })
  declare consumidoTurnoId: number | null

  @column.dateTime({ columnName: 'consumido_at' })
  declare consumidoAt: DateTime | null

  @column({ columnName: 'payload_hash' })
  declare payloadHash: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** belongsTo: agente (opcional, solo ASESOR/TELE) */
  @belongsTo(() => AgenteCaptacion, { foreignKey: 'agenteId' })
  declare agente: BelongsTo<typeof AgenteCaptacion>
}
