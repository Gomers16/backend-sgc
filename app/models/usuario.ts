// app/models/usuario.ts

import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'

import Rol from '#models/rol'
import RazonSocial from '#models/razon_social'
import EntidadSalud from '#models/entidad_salud'
import Contrato from '#models/contrato'
import Sede from '#models/sede'
import Cargo from '#models/cargo'
import AgenteCaptacion from '#models/agente_captacion'

const AuthFinder = withAuthFinder(() => Hash.use('scrypt'), {
  uids: ['correo'],
  passwordColumnName: 'password',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  public static table = 'usuarios'

  @column({ isPrimary: true })
  declare id: number

  // === Mapea FKs a snake_case si tu migración las creó así ===
  @column({ columnName: 'razon_social_id' })
  declare razonSocialId: number

  @column({ columnName: 'rol_id' })
  declare rolId: number

  @column({ columnName: 'cargo_id' })
  declare cargoId: number

  @column({ columnName: 'sede_id' })
  declare sedeId: number

  // 🆕 Campo virtual para agenteId (se obtiene de la relación)
  @column({ columnName: 'agente_id' })
  declare agenteId?: number | null

  @column()
  declare nombres: string

  @column()
  declare apellidos: string

  @column()
  declare correo: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare fotoPerfil?: string

  @column()
  declare direccion?: string

  @column()
  declare celularPersonal?: string

  @column()
  declare celularCorporativo?: string

  @column()
  declare centroCosto?: string

  @column()
  declare estado: 'activo' | 'inactivo'

  @column()
  declare recomendaciones: boolean

  // Entidades de salud (mapea si están en snake_case)
  @column({ columnName: 'eps_id' })
  declare epsId: number

  @column({ columnName: 'arl_id' })
  declare arlId: number

  @column({ columnName: 'afp_id' })
  declare afpId: number

  @column({ columnName: 'afc_id' })
  declare afcId: number

  @column({ columnName: 'ccf_id' })
  declare ccfId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null

  // Relaciones existentes
  @belongsTo(() => RazonSocial, { foreignKey: 'razonSocialId' })
  declare razonSocial: BelongsTo<typeof RazonSocial>

  @belongsTo(() => Rol, { foreignKey: 'rolId' })
  declare rol: BelongsTo<typeof Rol>

  @belongsTo(() => Sede, { foreignKey: 'sedeId' })
  declare sede: BelongsTo<typeof Sede>

  @belongsTo(() => Cargo, { foreignKey: 'cargoId' })
  declare cargo: BelongsTo<typeof Cargo>

  @belongsTo(() => EntidadSalud, { foreignKey: 'epsId' })
  declare eps: BelongsTo<typeof EntidadSalud>

  @belongsTo(() => EntidadSalud, { foreignKey: 'arlId' })
  declare arl: BelongsTo<typeof EntidadSalud>

  @belongsTo(() => EntidadSalud, { foreignKey: 'afpId' })
  declare afp: BelongsTo<typeof EntidadSalud>

  @belongsTo(() => EntidadSalud, { foreignKey: 'afcId' })
  declare afc: BelongsTo<typeof EntidadSalud>

  @belongsTo(() => EntidadSalud, { foreignKey: 'ccfId' })
  declare ccf: BelongsTo<typeof EntidadSalud>

  @hasMany(() => Contrato, { foreignKey: 'usuarioId' })
  declare contratos: HasMany<typeof Contrato>

  // 🆕 Relación con AgenteCaptacion (1:1)
  @hasOne(() => AgenteCaptacion, {
    foreignKey: 'usuarioId',
  })
  declare agenteCaptacion: HasOne<typeof AgenteCaptacion>

  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
