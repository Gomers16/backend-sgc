import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddRecurrenciaFieldsToComisiones extends BaseSchema {
  protected tableName = 'comisiones'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('descuento_recurrencia_aplicado').notNullable().defaultTo(false)

      table
        .enu('tipo_descuento_recurrencia', ['PORCENTAJE', 'VALOR_FIJO'], {
          useNative: true,
          enumName: 'comision_tipo_desc_rec_enum',
        })
        .nullable()

      table.decimal('valor_descuento_recurrencia', 10, 2).nullable()

      table.decimal('monto_original_dateo', 12, 2).nullable()

      table.decimal('monto_original_placa', 12, 2).nullable()

      table.index(['descuento_recurrencia_aplicado'], 'idx_com_recurrencia')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('monto_original_placa')
      table.dropColumn('monto_original_dateo')
      table.dropColumn('valor_descuento_recurrencia')
      table.dropColumn('tipo_descuento_recurrencia')
      table.dropColumn('descuento_recurrencia_aplicado')
    })
  }
}
