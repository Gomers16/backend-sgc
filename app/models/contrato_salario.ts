import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from './contrato.js'

export default class ContratoSalario extends BaseModel {
  public static table = 'contratos_salarios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contratoId: number

  @belongsTo(() => Contrato)
  declare contrato: BelongsTo<typeof Contrato>

  @column()
  declare salarioBasico: number

  @column()
  declare bonoSalarial: number

  @column()
  declare auxilioTransporte: number

  @column()
  declare auxilioNoSalarial: number

  @column.dateTime() // O @column.date() si solo necesitas la fecha sin hora
  declare fechaEfectiva: DateTime // <-- ¡ESTA ES LA LÍNEA CLAVE QUE FALTABA O ESTABA MAL!

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
