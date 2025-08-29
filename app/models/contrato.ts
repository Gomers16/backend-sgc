// app/models/contrato.ts
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
import ContratoCambio from './contrato_cambio.js'

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
  declare tipoContrato: 'laboral' | 'temporal' | 'prestacion' | 'aprendizaje'

  @column()
  declare terminoContrato?: 'fijo' | 'obra_o_labor_determinada' | 'indefinido' | null

  @column()
  declare estado: 'activo' | 'inactivo'

  @column()
  declare periodoPrueba?: number | null

  @column()
  declare horarioTrabajo?: string | null

  @column()
  declare centroCosto?: string | null

  /** Salario reflejado en el contrato (NOT NULL en DB) */
  @column({ columnName: 'salario' })
  declare salario: number

  // ===== Afiliaciones (IDs de entidades) =====
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

  // ===== Archivo contrato físico =====
  @column()
  declare nombreArchivoContratoFisico?: string | null

  @column()
  declare rutaArchivoContratoFisico?: string | null

  // ===== Finalización =====
  @column()
  declare motivoFinalizacion?: string | null

  // ===== Recomendación médica =====
  @column({ columnName: 'tiene_recomendaciones_medicas' })
  declare tieneRecomendacionesMedicas: boolean

  @column({ columnName: 'ruta_archivo_recomendacion_medica' })
  declare rutaArchivoRecomendacionMedica?: string | null

  // ======= NUEVO: archivos por afiliación (se guardan en el controller) =======
  // EPS
  @column({ columnName: 'eps_doc_path' })   declare epsDocPath?: string | null
  @column({ columnName: 'eps_doc_nombre' }) declare epsDocNombre?: string | null
  @column({ columnName: 'eps_doc_mime' })   declare epsDocMime?: string | null
  @column({ columnName: 'eps_doc_size' })   declare epsDocSize?: number | null

  // ARL
  @column({ columnName: 'arl_doc_path' }) declare arlDocPath?: string | null
  @column({ columnName: 'arl_doc_nombre' }) declare arlDocNombre?: string | null
  @column({ columnName: 'arl_doc_mime' })   declare arlDocMime?: string | null
  @column({ columnName: 'arl_doc_size' })   declare arlDocSize?: number | null

  // AFP
  @column({ columnName: 'afp_doc_path' })   declare afpDocPath?: string | null
  @column({ columnName: 'afp_doc_nombre' }) declare afpDocNombre?: string | null
  @column({ columnName: 'afp_doc_mime' })   declare afpDocMime?: string | null
  @column({ columnName: 'afp_doc_size' })   declare afpDocSize?: number | null

  // AFC (cesantías)
  @column({ columnName: 'afc_doc_path' })   declare afcDocPath?: string | null
  @column({ columnName: 'afc_doc_nombre' }) declare afcDocNombre?: string | null
  @column({ columnName: 'afc_doc_mime' })   declare afcDocMime?: string | null
  @column({ columnName: 'afc_doc_size' })   declare afcDocSize?: number | null

  // CCF
  @column({ columnName: 'ccf_doc_path' })   declare ccfDocPath?: string | null
  @column({ columnName: 'ccf_doc_nombre' }) declare ccfDocNombre?: string | null
  @column({ columnName: 'ccf_doc_mime' })   declare ccfDocMime?: string | null
  @column({ columnName: 'ccf_doc_size' })   declare ccfDocSize?: number | null

  // ===== Relaciones =====
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ContratoPaso)
  declare pasos: HasMany<typeof ContratoPaso>

  @hasMany(() => ContratoEvento)
  declare eventos: HasMany<typeof ContratoEvento>

  @hasMany(() => ContratoHistorialEstado)
  declare historialEstados: HasMany<typeof ContratoHistorialEstado>

  @hasMany(() => ContratoSalario)
  declare salarios: HasMany<typeof ContratoSalario>

  @hasMany(() => ContratoCambio, { foreignKey: 'contratoId' })
  declare cambios: HasMany<typeof ContratoCambio>
}
