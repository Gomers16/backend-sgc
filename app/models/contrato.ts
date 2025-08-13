import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'

import ContratoPaso from './contrato_paso.js'
import ContratoEvento from './contrato_evento.js'
import ContratoHistorialEstado from './contrato_historial_estado.js'
import ContratoSalario from './contrato_salario.js'
import Usuario from './usuario.js'
import Sede from './sede.js'
import Cargo from './cargo.js'
import EntidadSalud from './entidad_salud.js'
import RazonSocial from './razon_social.js'
import ContratoCambio from './contrato_cambio.js' // 👈 NUEVO

export default class Contrato extends BaseModel {
  public static table = 'contratos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare usuarioId: number

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  @column()
  declare razonSocialId: number

  @belongsTo(() => RazonSocial)
  declare razonSocial: BelongsTo<typeof RazonSocial>

  @column()
  declare identificacion: string

  @column()
  declare sedeId: number

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @column()
  declare cargoId: number

  @belongsTo(() => Cargo)
  declare cargo: BelongsTo<typeof Cargo>

  @column()
  declare funcionesCargo?: string | null

  @column.date()
  declare fechaInicio: DateTime

  @column.date()
  declare fechaTerminacion?: DateTime | null

  @column()
  declare tipoContrato: 'laboral' | 'temporal' | 'prestacion'

  @column()
  declare terminoContrato?: 'fijo' | 'obra_o_labor' | 'indefinido' | null

  @column()
  declare estado: 'activo' | 'inactivo'

  @column()
  declare periodoPrueba?: number | null

  @column()
  declare horarioTrabajo?: string | null

  @column()
  declare centroCosto?: string | null

  @column()
  declare epsId?: number | null
  @belongsTo(() => EntidadSalud, { foreignKey: 'epsId' })
  declare eps: BelongsTo<typeof EntidadSalud>

  @column()
  declare arlId?: number | null
  @belongsTo(() => EntidadSalud, { foreignKey: 'arlId' })
  declare arl: BelongsTo<typeof EntidadSalud>

  @column()
  declare afpId?: number | null
  @belongsTo(() => EntidadSalud, { foreignKey: 'afpId' })
  declare afp: BelongsTo<typeof EntidadSalud>

  @column()
  declare afcId?: number | null
  @belongsTo(() => EntidadSalud, { foreignKey: 'afcId' })
  declare afc: BelongsTo<typeof EntidadSalud>

  @column()
  declare ccfId?: number | null
  @belongsTo(() => EntidadSalud, { foreignKey: 'ccfId' })
  declare ccf: BelongsTo<typeof EntidadSalud>

  @column()
  declare nombreArchivoContratoFisico?: string | null

  @column()
  declare rutaArchivoContratoFisico?: string | null

  @column()
  declare motivoFinalizacion?: string | null

  @column()
  declare tieneRecomendacionesMedicas: boolean

  @column()
  declare rutaArchivoRecomendacionMedica?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relaciones
  @hasMany(() => ContratoPaso)
  declare pasos: HasMany<typeof ContratoPaso>

  @hasMany(() => ContratoEvento)
  declare eventos: HasMany<typeof ContratoEvento>

  @hasMany(() => ContratoHistorialEstado)
  declare historialEstados: HasMany<typeof ContratoHistorialEstado>

  @hasMany(() => ContratoSalario)
  declare salarios: HasMany<typeof ContratoSalario>

  // 👇 NUEVO: relación con cambios
  @hasMany(() => ContratoCambio, { foreignKey: 'contratoId' })
  declare cambios: HasMany<typeof ContratoCambio>
}
