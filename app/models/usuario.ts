import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

// Modelos relacionados
import Rol from '#models/rol'
import RazonSocial from '#models/razon_social'
import EntidadSalud from '#models/entidad_salud'
import Contrato from '#models/contrato'
import Sede from '#models/sede'
import Cargo from '#models/cargo'

// Auth by email
const AuthFinder = withAuthFinder(() => Hash.use('scrypt'), {
  uids: ['correo'],
  passwordColumnName: 'password',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  public static table = 'usuarios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare razonSocialId: number

  @column()
  declare rolId: number

  @column()
  declare cargoId: number

  @column()
  declare sedeId: number

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

  // FKs a entidades_salud (uno por tipo)
  @column()
  declare epsId: number

  @column()
  declare arlId: number

  @column()
  declare afpId: number

  @column()
  declare afcId: number

  @column()
  declare ccfId: number

  // ⛔️ Eliminado: campos de archivos por afiliación (epsDoc*, arlDoc*, afpDoc*, afcDoc*, ccfDoc*)
  // ⛔️ Eliminado: recomendación médica y su archivo (recomendacionMedica, recoMedDoc*)

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  // Relaciones (BelongsTo)
  @belongsTo(() => RazonSocial)
  declare razonSocial: BelongsTo<typeof RazonSocial>

  @belongsTo(() => Rol)
  declare rol: BelongsTo<typeof Rol>

  @belongsTo(() => Sede)
  declare sede: BelongsTo<typeof Sede>

  @belongsTo(() => Cargo)
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

  // Relación (HasMany)
  @hasMany(() => Contrato, { foreignKey: 'usuarioId' })
  declare contratos: HasMany<typeof Contrato>

  // Tokens
  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
