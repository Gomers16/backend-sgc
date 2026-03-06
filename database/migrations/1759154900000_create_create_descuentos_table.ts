// database/migrations/TIMESTAMP_create_descuentos_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'descuentos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('codigo', 50).notNullable().unique()
      table.string('nombre', 100).notNullable()
      table.decimal('valor_carro', 10, 2).notNullable()
      table.decimal('valor_moto', 10, 2).notNullable()
      table.text('descripcion').nullable()
      table.boolean('activo').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
