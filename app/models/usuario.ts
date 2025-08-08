import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

// Importaciones de modelos relacionados
import Rol from '#models/rol'
import RazonSocial from '#models/razon_social'
import EntidadSalud from '#models/entidad_salud'
import Contrato from '#models/contrato'
import Sede from '#models/sede'
import Cargo from '#models/cargo'

// Mezcla de autenticación con Finder (para login con correo)
const AuthFinder = withAuthFinder(() => Hash.use('scrypt'), {
  uids: ['correo'], // El usuario se autentica por su correo
  passwordColumnName: 'password',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  public static table = 'usuarios'

  @column({ isPrimary: true })
  declare id: number // Este es el ID primario que usarás para relacionar todo

  // ❌ LA COLUMNA 'authId' SE HA ELIMINADO DE AQUÍ.
  //    ASEGÚRATE DE QUE TAMBIÉN SE HAYA ELIMINADO DE LA MIGRACIÓN DE CREACIÓN DE LA TABLA.

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

  @column({ serializeAs: null }) // La contraseña no se serializa en las respuestas
  declare password: string

  @column()
  declare fotoPerfil?: string // Campo opcional

  @column()
  declare direccion?: string // Campo opcional

  @column()
  declare celularPersonal?: string // Campo opcional

  @column()
  declare celularCorporativo?: string // Campo opcional

  @column()
  declare centroCosto?: string // Campo opcional

  @column()
  declare estado: 'activo' | 'inactivo'

  @column()
  declare recomendaciones: boolean

  // IDs de entidades de salud
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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null // Para Soft Deletes

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
  @hasMany(() => Contrato, {
    foreignKey: 'usuarioId', // ✅ ¡Esta es la clave! Define explícitamente la clave foránea
  })
  declare contratos: HasMany<typeof Contrato>

  // Configuración de Tokens de Acceso (usa el ID primario por defecto para relacionar)
  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
