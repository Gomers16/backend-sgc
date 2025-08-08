import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from '#models/contrato'

export default class ContratoEvento extends BaseModel {
  public static table = 'contrato_eventos' // Nombre de la tabla explícito

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contratoId: number

  @column()
  declare tipo:
    | 'incapacidad'
    | 'suspension'
    | 'licencia'
    | 'permiso'
    | 'vacaciones'
    | 'cesantias'
    | 'disciplinario'
    | 'terminacion'

  @column()
  declare subtipo?: string | null // Asegúrate que puede ser nulo en la DB

  @column.date()
  declare fechaInicio: DateTime

  @column.date()
  declare fechaFin?: DateTime | null // Asegúrate que puede ser nulo en la DB

  @column()
  declare descripcion?: string | null // Asegúrate que puede ser nulo en la DB

  @column()
  declare documentoUrl?: string | null // Asegúrate que puede ser nulo en la DB

  @belongsTo(() => Contrato)
  declare contrato: BelongsTo<typeof Contrato>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ✅ ¡IMPORTANTE! Las siguientes propiedades NO pertenecen a ContratoEvento y han sido eliminadas:
  // declare nombrePaso: string | undefined
  // declare fase: "inicio" | "desarrollo" | "fin" | undefined
  // declare orden: number | undefined
}
