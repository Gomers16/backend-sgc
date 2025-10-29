// app/models/facturacion_ticket.ts
import { BaseModel, column, belongsTo, computed, beforeSave } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import TurnoRtm from '#models/turno_rtm'
import CaptacionDateo from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'
import Usuario from '#models/usuario'
import Sede from '#models/sede'
import Servicio from '#models/servicio'
import Cliente from '#models/cliente'
import Vehiculo from '#models/vehiculo'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export type FactEstado = 'BORRADOR' | 'OCR_LISTO' | 'LISTA_CONFIRMAR' | 'CONFIRMADA' | 'REVERTIDA'
export type FormaPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'MIXTO'
export type DocTipo = 'CC' | 'NIT'

export default class FacturacionTicket extends BaseModel {
  public static table = 'facturacion_tickets'

  @column({ isPrimary: true })
  declare id: number

  // Archivo
  @column()
  declare hash: string

  @column({ columnName: 'file_path' })
  declare filePath: string

  @column({ columnName: 'file_mime' })
  declare fileMime: string | null

  @column({ columnName: 'file_size' })
  declare fileSize: number | null

  @column({ columnName: 'image_rotation' })
  declare imageRotation: number

  // Estado
  @column()
  declare estado: FactEstado

  // Mínimos
  @column()
  declare placa: string | null

  @column()
  declare total: number | null // DECIMAL(14,2) en DB (compat principal)

  @column({ columnName: 'total_factura' })
  declare totalFactura: number | null // espejo/fuente del total leído

  @column({ columnName: 'subtotal' })
  declare subtotal: number | null

  @column({ columnName: 'iva' })
  declare iva: number | null

  @column.dateTime({ columnName: 'fecha_pago' })
  declare fechaPago: DateTime | null

  // Datos OCR adicionales
  @column()
  declare nit: string | null

  @column()
  declare pin: string | null

  @column()
  declare marca: string | null

  @column({ columnName: 'vendedor_text' })
  declare vendedorText: string | null

  // Detalle de pago
  @column({ columnName: 'pago_consignacion' })
  declare pagoConsignacion: number | null

  @column({ columnName: 'pago_tarjeta' })
  declare pagoTarjeta: number | null

  @column({ columnName: 'pago_efectivo' })
  declare pagoEfectivo: number | null

  @column({ columnName: 'pago_cambio' })
  declare pagoCambio: number | null

  // Relaciones clave
  @column({ columnName: 'agente_id' })
  declare agenteId: number | null

  @belongsTo(() => AgenteCaptacion, { foreignKey: 'agenteId' })
  declare agente: BelongsTo<typeof AgenteCaptacion>

  @column({ columnName: 'sede_id' })
  declare sedeId: number | null

  @belongsTo(() => Sede, { foreignKey: 'sedeId' })
  declare sede: BelongsTo<typeof Sede>

  @column({ columnName: 'turno_id' })
  declare turnoId: number | null

  @belongsTo(() => TurnoRtm, { foreignKey: 'turnoId' })
  declare turno: BelongsTo<typeof TurnoRtm>

  @column({ columnName: 'dateo_id' })
  declare dateoId: number | null

  @belongsTo(() => CaptacionDateo, { foreignKey: 'dateoId' })
  declare dateo: BelongsTo<typeof CaptacionDateo>

  @column({ columnName: 'servicio_id' })
  declare servicioId: number | null

  @belongsTo(() => Servicio, { foreignKey: 'servicioId' })
  declare servicio: BelongsTo<typeof Servicio>

  // Comprobante
  @column()
  declare prefijo: string | null

  @column()
  declare consecutivo: string | null

  @column({ columnName: 'forma_pago' })
  declare formaPago: FormaPago | null

  // Cliente / Vehículo (enriquecimiento)
  @column({ columnName: 'doc_tipo' })
  declare docTipo: DocTipo | null

  @column({ columnName: 'doc_numero' })
  declare docNumero: string | null

  @column()
  declare nombre: string | null

  @column()
  declare telefono: string | null

  @column()
  declare observaciones: string | null

  @column({ columnName: 'cliente_id' })
  declare clienteId: number | null

  @belongsTo(() => Cliente, { foreignKey: 'clienteId' })
  declare cliente: BelongsTo<typeof Cliente>

  @column({ columnName: 'vehiculo_id' })
  declare vehiculoId: number | null

  @belongsTo(() => Vehiculo, { foreignKey: 'vehiculoId' })
  declare vehiculo: BelongsTo<typeof Vehiculo>

  // OCR
  @column({ columnName: 'ocr_text' })
  declare ocrText: string | null

  @column({ columnName: 'ocr_conf_placa' })
  declare ocrConfPlaca: number

  @column({ columnName: 'ocr_conf_total' })
  declare ocrConfTotal: number

  @column({ columnName: 'ocr_conf_fecha' })
  declare ocrConfFecha: number

  @column({ columnName: 'ocr_conf_agente' })
  declare ocrConfAgente: number

  @column({ columnName: 'ocr_conf_baja_revisado' })
  declare ocrConfBajaRevisado: boolean

  // Duplicados
  @column({ columnName: 'duplicado_por_hash' })
  declare duplicadoPorHash: boolean

  @column({ columnName: 'duplicado_por_contenido' })
  declare duplicadoPorContenido: boolean

  @column.dateTime({ columnName: 'posible_duplicado_at' })
  declare posibleDuplicadoAt: DateTime | null

  // Confirmación / Enriquecimiento
  @column.dateTime({ columnName: 'confirmado_at' })
  declare confirmadoAt: DateTime | null

  @column({ columnName: 'ajuste_total_flag' })
  declare ajusteTotalFlag: boolean

  @column({ columnName: 'ajuste_total_diff' })
  declare ajusteTotalDiff: number

  @column({ columnName: 'revertida_flag' })
  declare revertidaFlag: boolean

  @column({ columnName: 'revertida_motivo' })
  declare revertidaMotivo: string | null

  @column.dateTime({ columnName: 'revertida_at' })
  declare revertidaAt: DateTime | null

  // Auditoría
  @column({ columnName: 'created_by_id' })
  declare createdById: number | null

  @belongsTo(() => Usuario, { foreignKey: 'createdById' })
  declare createdBy: BelongsTo<typeof Usuario>

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Helpers
  @computed()
  public get prefijoConsecutivo(): string | null {
    if (!this.prefijo && !this.consecutivo) return null
    const sep = this.prefijo && this.consecutivo ? '-' : ''
    return `${this.prefijo ?? ''}${sep}${this.consecutivo ?? ''}`
  }

  @beforeSave()
  public static normalize(t: FacturacionTicket) {
    if (t.placa) t.placa = t.placa.toUpperCase().replace(/\s+/g, '')
    if (t.nit) t.nit = t.nit.replace(/[^\d\-\.]/g, '')
    // Mantener sincronía total vs totalFactura
    if ((!t.total || t.total === 0) && t.totalFactura && t.totalFactura > 0) {
      t.total = t.totalFactura
    }
    if ((!t.totalFactura || t.totalFactura === 0) && t.total && t.total > 0) {
      t.totalFactura = t.total
    }
  }
}
