// app/models/contrato_paso.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from './contrato.js'
import Usuario from './usuario.js'

export default class ContratoPaso extends BaseModel {
  public static table = 'contrato_pasos'

  @column({ isPrimary: true })
  declare id: number

  // DB: contrato_id
  @column({ columnName: 'contrato_id' })
  declare contratoId: number

  @belongsTo(() => Contrato, { foreignKey: 'contratoId' })
  declare contrato: BelongsTo<typeof Contrato>

  @column()
  declare fase: 'inicio' | 'desarrollo' | 'fin'

  // DB: nombre_paso
  @column({ columnName: 'nombre_paso' })
  declare nombrePaso: string

  // DB: fecha (DATE)
  @column.date({ columnName: 'fecha' })
  declare fecha?: DateTime | null

  @column()
  declare observacion?: string | null

  @column()
  declare orden: number

  @column()
  declare completado: boolean

  // DB: archivo_url
  @column({ columnName: 'archivo_url' })
  declare archivoUrl?: string | null

  // ✅ FK opcional al actor (usuario)
  @column({ columnName: 'usuario_id' })
  declare usuarioId?: number | null

  @belongsTo(() => Usuario, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof Usuario>

  // Timestamps (el modelo los llena con autoCreate/autoUpdate)
  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Conservado si lo usas en lógica de archivo
  nombreArchivo: string | undefined
}
