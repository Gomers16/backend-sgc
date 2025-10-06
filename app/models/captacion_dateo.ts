import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AgenteCaptacion from '#models/agente_captacion'
import Convenio from '#models/convenio'
import Prospecto from '#models/prospecto'
import Vehiculo from '#models/vehiculo'
import Cliente from '#models/cliente'

export type Canal = 'FACHADA' | 'ASESOR' | 'TELE' | 'REDES'
export type Origen = 'UI' | 'WHATSAPP' | 'IMPORT'
export type ResultadoDateo = 'PENDIENTE' | 'ATENDIDO' | 'EXITOSO' | 'NO_EXITOSO'

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

  // Imagen (opcional)
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

  // ── Nuevos vínculos comerciales
  @column({ columnName: 'convenio_id' })
  declare convenioId: number | null

  @column({ columnName: 'prospecto_id' })
  declare prospectoId: number | null

  @column({ columnName: 'vehiculo_id' })
  declare vehiculoId: number | null

  @column({ columnName: 'cliente_id' })
  declare clienteId: number | null

  @column()
  declare resultado: ResultadoDateo

  @column({ columnName: 'motivo_no_exitoso' })
  declare motivoNoExitoso: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ── Relaciones
  @belongsTo(() => AgenteCaptacion, { foreignKey: 'agenteId' })
  declare agente: BelongsTo<typeof AgenteCaptacion>

  @belongsTo(() => Convenio, { foreignKey: 'convenioId' })
  declare convenio: BelongsTo<typeof Convenio>

  @belongsTo(() => Prospecto, { foreignKey: 'prospectoId' })
  declare prospecto: BelongsTo<typeof Prospecto>

  @belongsTo(() => Vehiculo, { foreignKey: 'vehiculoId' })
  declare vehiculo: BelongsTo<typeof Vehiculo>

  @belongsTo(() => Cliente, { foreignKey: 'clienteId' })
  declare cliente: BelongsTo<typeof Cliente>
}
