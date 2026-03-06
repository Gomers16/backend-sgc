// app/models/comision.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import CaptacionDateo from '#models/captacion_dateo'
import Convenio from '#models/convenio'
import AgenteCaptacion from '#models/agente_captacion'

export type ComisionEstado = 'PENDIENTE' | 'APROBADA' | 'PAGADA' | 'ANULADA'
export type ComisionTipoServicio = 'RTM' | 'TECNOMECANICA' | 'PREVENTIVA' | 'SOAT' | 'OTRO'
export type ComisionTipoVehiculo = 'MOTO' | 'VEHICULO'

export default class Comision extends BaseModel {
  public static table = 'comisiones'

  @column({ isPrimary: true })
  declare id: number

  /**
   * Si es comisión real:
   *  - captacionDateoId → id del dateo en captacion_dateos
   * Si es fila de configuración (esConfig = true):
   *  - captacionDateoId → null
   */
  @column({ columnName: 'captacion_dateo_id' })
  declare captacionDateoId: number | null

  @column({ columnName: 'asesor_id' })
  declare asesorId: number | null

  @column({ columnName: 'convenio_id' })
  declare convenioId: number | null

  @column({ columnName: 'tipo_servicio' })
  declare tipoServicio: ComisionTipoServicio

  @column({ columnName: 'tipo_vehiculo' })
  declare tipoVehiculo: ComisionTipoVehiculo | null

  /**
   * BASE = incentivo convenio / comisión por placa (FALLBACK GLOBAL).
   * Se usa cuando no hay valor específico por tipo de vehículo.
   * - Asesor convenio datea cliente nuevo  → base = $14.000 (incentivo)
   * - Comercial datea con convenio         → base = $14.000 (incentivo para convenio)
   */
  @column()
  declare base: string

  @column()
  declare porcentaje: string

  /**
   * MONTO = comisión por dateo.
   * - Cliente nuevo via convenio     → $8.600  (dateo normal)
   * - Cliente recurrente             → valor recurrente (< 24 meses)
   * - Cliente recuperación           → valor recuperación (>= 24 meses)
   * - Asesor convenio datea nuevo    → $0 (solo cobra incentivo en base)
   */
  @column()
  declare monto: string

  /**
   * VALOR_NUEVO_DIRECTO:
   *  - Comisión cuando el comercial trae un cliente NUEVO sin convenio ($17.200).
   *  - Solo aplica en configs (es_config = true) y comisiones reales sin convenio
   *    donde el cliente es nuevo.
   */
  @column({ columnName: 'valor_nuevo_directo' })
  declare valorNuevoDirecto: string

  /**
   * 🆕 VALOR_PLACA_VEHICULO:
   *  - Incentivo específico para CARROS en configs (es_config = true).
   *  - Si es null → se usa `base` como fallback.
   */
  @column({ columnName: 'valor_placa_vehiculo' })
  declare valorPlacaVehiculo: string | null

  /**
   * 🆕 VALOR_PLACA_MOTO:
   *  - Incentivo específico para MOTOS en configs (es_config = true).
   *  - Si es null → se usa `base` como fallback.
   */
  @column({ columnName: 'valor_placa_moto' })
  declare valorPlacaMoto: string | null

  // ========== 💰 DESGLOSE INTERNO ==========

  /** Lo que cobra el asesor comercial por el DATEO. */
  @column({ columnName: 'monto_asesor' })
  declare montoAsesor: string | null

  /** Lo que cobra el dueño del convenio (incentivo). */
  @column({ columnName: 'monto_convenio' })
  declare montoConvenio: string | null

  /** ID del asesor del convenio (quien recibe montoConvenio). */
  @column({ columnName: 'asesor_secundario_id' })
  declare asesorSecundarioId: number | null

  // ========== FIN DESGLOSE ==========

  @column({ columnName: 'meta_rtm' })
  declare metaRtm: number

  @column({ columnName: 'valor_rtm_moto' })
  declare valorRtmMoto: number

  @column({ columnName: 'valor_rtm_vehiculo' })
  declare valorRtmVehiculo: number

  @column({ columnName: 'porcentaje_comision_meta' })
  declare porcentajeComisionMeta: string

  @column()
  declare estado: ComisionEstado

  /**
   * esConfig:
   *  - false → comisión real
   *  - true  → fila de configuración (valores editables en UI)
   */
  @column({ columnName: 'es_config' })
  declare esConfig: boolean

  @column.dateTime({ columnName: 'fecha_calculo' })
  declare fechaCalculo: DateTime

  @column({ columnName: 'calculado_por' })
  declare calculadoPor: number | null

  // ========== 🔄 CAMPOS DE RECURRENCIA ==========
  @column({ columnName: 'descuento_recurrencia_aplicado' })
  declare descuentoRecurrenciaAplicado: boolean

  @column({ columnName: 'tipo_descuento_recurrencia' })
  declare tipoDescuentoRecurrencia: 'PORCENTAJE' | 'VALOR_FIJO' | null

  @column({ columnName: 'valor_descuento_recurrencia' })
  declare valorDescuentoRecurrencia: number | null

  @column({ columnName: 'monto_original_dateo' })
  declare montoOriginalDateo: number | null

  @column({ columnName: 'monto_original_placa' })
  declare montoOriginalPlaca: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /* ================== Relaciones ================== */

  @belongsTo(() => CaptacionDateo, { foreignKey: 'captacionDateoId' })
  declare dateo: BelongsTo<typeof CaptacionDateo>

  @belongsTo(() => AgenteCaptacion, { foreignKey: 'asesorId' })
  declare asesor: BelongsTo<typeof AgenteCaptacion>

  @belongsTo(() => Convenio, { foreignKey: 'convenioId' })
  declare convenio: BelongsTo<typeof Convenio>

  @belongsTo(() => AgenteCaptacion, { foreignKey: 'asesorSecundarioId' })
  declare asesorSecundario: BelongsTo<typeof AgenteCaptacion>

  valorTotal: any
}
