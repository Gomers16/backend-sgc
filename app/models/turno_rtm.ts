// app/models/turno_rtm.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Usuario from '#models/usuario'
import Sede from '#models/sede'
import Servicio from '#models/servicio'
import Vehiculo from '#models/vehiculo'
import Cliente from '#models/cliente'
import ClaseVehiculo from '#models/clase_vehiculos'
import AgenteCaptacion from '#models/agente_captacion'
import CaptacionDateo from '#models/captacion_dateo'

export type TipoVehiculoUI =
  | 'Liviano Particular'
  | 'Liviano Taxi'
  | 'Liviano Público'
  | 'Motocicleta'

export type MedioEntero = 'Fachada' | 'Redes Sociales' | 'Call Center' | 'Asesor Comercial'
export type EstadoTurno = 'activo' | 'inactivo' | 'cancelado' | 'finalizado'
export type CanalAtribucion = 'FACHADA' | 'ASESOR' | 'TELE' | 'REDES'

export default class TurnoRtm extends BaseModel {
  public static table = 'turnos_rtms'

  @column({ isPrimary: true })
  declare id: number

  // ── FKs base
  @column({ columnName: 'sede_id' })
  declare sedeId: number
  @belongsTo(() => Sede, { foreignKey: 'sedeId' })
  declare sede: BelongsTo<typeof Sede>

  @column({ columnName: 'funcionario_id' })
  declare funcionarioId: number
  @belongsTo(() => Usuario, { foreignKey: 'funcionarioId' })
  declare usuario: BelongsTo<typeof Usuario>

  @column({ columnName: 'servicio_id' })
  declare servicioId: number
  @belongsTo(() => Servicio, { foreignKey: 'servicioId' })
  declare servicio: BelongsTo<typeof Servicio>

  // ── Enlaces opcionales
  @column({ columnName: 'vehiculo_id' })
  declare vehiculoId: number | null
  @belongsTo(() => Vehiculo, { foreignKey: 'vehiculoId' })
  declare vehiculo: BelongsTo<typeof Vehiculo>

  @column({ columnName: 'cliente_id' })
  declare clienteId: number | null
  @belongsTo(() => Cliente, { foreignKey: 'clienteId' })
  declare cliente: BelongsTo<typeof Cliente>

  @column({ columnName: 'clase_vehiculo_id' })
  declare claseVehiculoId: number | null
  @belongsTo(() => ClaseVehiculo, { foreignKey: 'claseVehiculoId' })
  declare claseVehiculo: BelongsTo<typeof ClaseVehiculo>

  @column({ columnName: 'agente_captacion_id' })
  declare agenteCaptacionId: number | null
  @belongsTo(() => AgenteCaptacion, { foreignKey: 'agenteCaptacionId' })
  declare agenteCaptacion: BelongsTo<typeof AgenteCaptacion>

  @column({ columnName: 'captacion_dateo_id' })
  declare captacionDateoId: number | null
  @belongsTo(() => CaptacionDateo, { foreignKey: 'captacionDateoId' })
  declare captacionDateo: BelongsTo<typeof CaptacionDateo>

  // ── Datos del turno
  @column.dateTime({ columnName: 'fecha', serializeAs: 'fecha' })
  declare fecha: DateTime

  @column({ columnName: 'hora_ingreso' })
  declare horaIngreso: string

  @column({ columnName: 'hora_salida' })
  declare horaSalida: string | null

  @column({ columnName: 'tiempo_servicio' })
  declare tiempoServicio: string | null

  @column({ columnName: 'turno_numero' })
  declare turnoNumero: number

  // ✅ nuevo: consecutivo por servicio (sede+día)
  @column({ columnName: 'turno_numero_servicio' })
  declare turnoNumeroServicio: number

  @column({ columnName: 'turno_codigo' })
  declare turnoCodigo: string

  @column()
  declare placa: string

  @column({ columnName: 'tipo_vehiculo' })
  declare tipoVehiculo: TipoVehiculoUI

  // ── Captación “plana” (compat con esquema BD)
  @column({ columnName: 'medio_entero' })
  declare medioEntero: MedioEntero

  // ── Observaciones del turno
  @column()
  declare observaciones: string | null

  // ── Atribución final simple
  @column({ columnName: 'canal_atribucion' })
  declare canalAtribucion: CanalAtribucion

  @column()
  declare estado: EstadoTurno

  // ── Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
