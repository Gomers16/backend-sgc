// app/models/comision.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import CaptacionDateo from '#models/captacion_dateo'
import Convenio from '#models/convenio'
// 👇 Ajusta este import si tu modelo se llama distinto
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
   * Asesor:
   *  - null  => regla GLOBAL (config)
   *  - valor => comisión real o regla por asesor
   */
  @column({ columnName: 'asesor_id' })
  declare asesorId: number | null

  @column({ columnName: 'convenio_id' })
  declare convenioId: number | null

  @column({ columnName: 'tipo_servicio' })
  declare tipoServicio: ComisionTipoServicio

  /**
   * Tipo de vehículo para la regla / comisión:
   *  - 'MOTO'
   *  - 'VEHICULO'
   *
   * En comisiones reales se puede dejar null si lo deduces desde turno/vehículo.
   */
  @column({ columnName: 'tipo_vehiculo' })
  declare tipoVehiculo: ComisionTipoVehiculo | null

  /**
   * BASE:
   *  - comisión por placa (cliente/convenio) o valor estándar en reglas.
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
   *  - en comisiones reales: comisión del asesor (dateo).
   *  - en reglas: valor estándar de comisión por dateo.
   */
  @column()
  declare monto: string

  @column()
  declare estado: ComisionEstado

  /**
   * esConfig:
   *  - false => comisión real (lo que ves en la vista 💸 Comisiones)
   *  - true  => fila de configuración (reglas globales / por asesor)
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
}
