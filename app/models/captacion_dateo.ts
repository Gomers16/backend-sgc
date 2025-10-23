// app/models/captacion_dateo.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeSave, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import AgenteCaptacion from '#models/agente_captacion'
import Convenio from '#models/convenio'
import Prospecto from '#models/prospecto'
import Vehiculo from '#models/vehiculo'
import Cliente from '#models/cliente'

export type Canal = 'FACHADA' | 'ASESOR_COMERCIAL' | 'ASESOR_CONVENIO' | 'TELE' | 'REDES'

export type Origen = 'UI' | 'WHATSAPP' | 'IMPORT'
export type ResultadoDateo = 'PENDIENTE' | 'EN_PROCESO' | 'EXITOSO' | 'NO_EXITOSO'

// === Helpers TTL usados por controladores y computados ===
function ttlSinConsumir(): number {
  return Number(process.env.TTL_SIN_CONSUMIR_DIAS ?? 7)
}
function ttlPostConsumo(): number {
  return Number(process.env.TTL_POST_CONSUMO_DIAS ?? 365)
}

function normalizePlaca(v?: string | null) {
  return v ? v.replace(/[\s-]/g, '').toUpperCase() : (v ?? null)
}
function normalizePhone(v?: string | null) {
  return v ? v.replace(/\D/g, '') : (v ?? null)
}

export default class CaptacionDateo extends BaseModel {
  public static table = 'captacion_dateos'

  @column({ isPrimary: true })
  declare id: number

  // Origen/canal
  @column()
  declare canal: Canal

  @column({ columnName: 'agente_id' })
  declare agenteId: number | null

  // Datos captados
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

  // Consumo por Turno
  @column({ columnName: 'consumido_turno_id' })
  declare consumidoTurnoId: number | null

  @column.dateTime({ columnName: 'consumido_at' })
  declare consumidoAt: DateTime | null

  @column({ columnName: 'payload_hash' })
  declare payloadHash: string | null

  // Vínculos comerciales
  @column({ columnName: 'convenio_id' })
  declare convenioId: number | null

  @column({ columnName: 'prospecto_id' })
  declare prospectoId: number | null

  @column({ columnName: 'vehiculo_id' })
  declare vehiculoId: number | null

  @column({ columnName: 'cliente_id' })
  declare clienteId: number | null

  // Resultado del dateo
  @column()
  declare resultado: ResultadoDateo

  @column({ columnName: 'motivo_no_exitoso' })
  declare motivoNoExitoso: string | null

  // Marcador de detección automática por convenio
  @column({ columnName: 'detectado_por_convenio' })
  declare detectadoPorConvenio: boolean

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ===== Relaciones =====
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

  // ===== Normalización preventiva =====
  @beforeSave()
  public static normalize(d: CaptacionDateo) {
    d.placa = normalizePlaca(d.placa)
    d.telefono = normalizePhone(d.telefono)
  }

  // ===== Computados útiles =====
  /** ISO hasta cuándo está bloqueado (exclusividad) */
  @computed()
  public get bloqueadoHasta(): string | null {
    if (!this.createdAt) return null
    const base = this.consumidoTurnoId && this.consumidoAt ? this.consumidoAt : this.createdAt
    const days = this.consumidoTurnoId && this.consumidoAt ? ttlPostConsumo() : ttlSinConsumir()
    return base.plus({ days }).toISO()
  }

  /** true si hoy sigue en ventana de exclusividad */
  @computed()
  public get bloqueado(): boolean {
    if (!this.createdAt) return false
    const base = this.consumidoTurnoId && this.consumidoAt ? this.consumidoAt : this.createdAt
    const days = this.consumidoTurnoId && this.consumidoAt ? ttlPostConsumo() : ttlSinConsumir()
    return DateTime.now() < base.plus({ days })
  }
}
