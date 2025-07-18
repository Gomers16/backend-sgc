// app/Models/Usuario.ts

import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens' // Esta importación es correcta y necesaria

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Rol from './rol.js'
import RazonSocial from './razon_social.js'
import EntidadSalud from './entidad_salud.js'
import Contrato from './contrato.js'

// Mezcla de autenticación con Finder (para login con correo)
const AuthFinder = withAuthFinder(() => Hash.use('scrypt'), {
  uids: ['correo'],
  passwordColumnName: 'password',
})

// *** IMPORTANTE: Hemos eliminado cualquier 'implements HasApiTokens' aquí ***
export default class Usuario extends compose(BaseModel, AuthFinder) {
  public static table = 'usuarios'

  // *** IMPORTANTE: NO DEBE HABER NINGÚN 'declare accessTokens' aquí. ***
  // Si lo tienes, bórralo.

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare razonSocialId: number

  @column()
  declare rolId: number

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
  declare sede: 'Bogotá' | 'Ibagué'

  @column()
  declare direccion?: string

  @column()
  declare celularPersonal?: string

  @column()
  declare celularCorporativo?: string

  @column()
  declare area?: string

  @column()
  declare centroCosto?: string

  @column()
  declare estado: 'activo' | 'inactivo'

  @column()
  declare recomendaciones: boolean

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

  @belongsTo(() => RazonSocial)
  declare razonSocial: BelongsTo<typeof RazonSocial>

  @belongsTo(() => Rol)
  declare rol: BelongsTo<typeof Rol>

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

  @hasMany(() => Contrato)
  declare contratos: HasMany<typeof Contrato>

  // *** ¡CAMBIO CRÍTICO AQUÍ! ***
  // Usamos 'accessTokens' como nombre de la propiedad estática,
  // tal como lo hacía tu proyecto funcional, en lugar de 'auth_access_tokens'.
  // Esto es para replicar el comportamiento de tu proyecto que sí funciona.
  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
