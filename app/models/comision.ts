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
   *
   * Si es fila de configuración (esConfig = true):
   *  - captacionDateoId → null
   */
  @column({ columnName: 'captacion_dateo_id' })
  declare captacionDateoId: number | null

  /**
   * Asesor PRINCIPAL:
   *  - null  => regla GLOBAL (config)
   *  - valor => comisión real o regla por asesor
   */
  @column({ columnName: 'asesor_id' })
  declare asesorId: number | null

  @column({ columnName: 'convenio_id' })
  declare convenioId: number | null

  @column({ columnName: 'tipo_servicio' })
  declare tipoServicio: ComisionTipoServicio

  @column({ columnName: 'tipo_vehiculo' })
  declare tipoVehiculo: ComisionTipoVehiculo | null

  /**
   * BASE:
   *  - comisión por PLACA (cliente/convenio).
   * Lucid devuelve DECIMAL como string.
   */
  @column()
  declare base: string

  /**
   * PORCENTAJE:
   *  - opcional si quieres manejar %; por defecto 0.
   */
  @column()
  declare porcentaje: string

  /**
   * MONTO:
   *  - comisión por DATEO del asesor.
   */
  @column()
  declare monto: string

  // ========== 💰 DESGLOSE INTERNO (NUEVO) ==========

  /**
   * MONTO_ASESOR:
   *  - Lo que cobra el asesor comercial por el DATEO.
   *  - Lucid devuelve DECIMAL como string, pero puede ser NULL.
   */
  @column({ columnName: 'monto_asesor' })
  declare montoAsesor: string | null

  /**
   * MONTO_CONVENIO:
   *  - Lo que cobra el dueño del convenio por la PLACA.
   */
  @column({ columnName: 'monto_convenio' })
  declare montoConvenio: string | null

  /**
   * ASESOR_SECUNDARIO_ID:
   *  - ID del asesor del convenio (quien recibe montoConvenio).
   */
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
   *  - false => comisión real
   *  - true  => fila de configuración
   */
  @column({ columnName: 'es_config' })
  declare esConfig: boolean

  @column.dateTime({ columnName: 'fecha_calculo' })
  declare fechaCalculo: DateTime

  @column({ columnName: 'calculado_por' })
  declare calculadoPor: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /* ================== Relaciones ================== */

  @belongsTo(() => CaptacionDateo, {
    foreignKey: 'captacionDateoId',
  })
  declare dateo: BelongsTo<typeof CaptacionDateo>

  @belongsTo(() => AgenteCaptacion, {
    foreignKey: 'asesorId',
  })
  declare asesor: BelongsTo<typeof AgenteCaptacion>

  @belongsTo(() => Convenio, {
    foreignKey: 'convenioId',
  })
  declare convenio: BelongsTo<typeof Convenio>

  // 👇 NUEVA RELACIÓN: Asesor secundario (dueño del convenio)
  @belongsTo(() => AgenteCaptacion, {
    foreignKey: 'asesorSecundarioId',
  })
  declare asesorSecundario: BelongsTo<typeof AgenteCaptacion>
}
