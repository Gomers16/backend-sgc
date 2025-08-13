import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contrato from './contrato.js'

export default class ContratoSalario extends BaseModel {
  public static table = 'contratos_salarios'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'contrato_id' })
  declare contratoId: number

  @belongsTo(() => Contrato, { foreignKey: 'contratoId' })
  declare contrato: BelongsTo<typeof Contrato>

  @column({ columnName: 'salario_basico' })
  declare salarioBasico: number

  @column({ columnName: 'bono_salarial' })
  declare bonoSalarial: number

  @column({ columnName: 'auxilio_transporte' })
  declare auxilioTransporte: number

  @column({ columnName: 'auxilio_no_salarial' })
  declare auxilioNoSalarial: number

  @column.dateTime({ columnName: 'fecha_efectiva' })
  declare fechaEfectiva: DateTime

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
