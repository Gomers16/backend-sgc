import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ConfiguracionRecurrencias extends BaseSchema {
  protected tableName = 'configuracion_recurrencia'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('asesor_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('CASCADE')

      table
        .enu('tipo_asesor', ['COMERCIAL', 'CONVENIO'], {
          useNative: true,
          enumName: 'recurrencia_tipo_asesor_enum',
        })
        .nullable()

      table.integer('periodo_meses').unsigned().notNullable().defaultTo(12)

      table
        .enu('tipo_descuento', ['PORCENTAJE', 'VALOR_FIJO'], {
          useNative: true,
          enumName: 'recurrencia_tipo_descuento_enum',
        })
        .notNullable()

      table.decimal('valor_descuento', 10, 2).notNullable()

      table
        .enu('aplicar_descuento_en', ['SOLO_DATEO', 'SOLO_PLACA', 'DATEO_Y_PLACA'], {
          useNative: true,
          enumName: 'recurrencia_aplicar_en_enum',
        })
        .notNullable()
        .defaultTo('DATEO_Y_PLACA')

      table.boolean('activo').notNullable().defaultTo(true)

      table.index(['asesor_id'], 'idx_rec_asesor')
      table.index(['tipo_asesor'], 'idx_rec_tipo')
      table.index(['activo'], 'idx_rec_activo')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
