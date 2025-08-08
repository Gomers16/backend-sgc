import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contratos_salarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('contrato_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('contratos')
        .onDelete('CASCADE')
      table.decimal('salario_basico', 15, 2).notNullable()
      table.decimal('bono_salarial', 15, 2).defaultTo(0).notNullable()
      table.decimal('auxilio_transporte', 15, 2).defaultTo(0).notNullable()
      table.decimal('auxilio_no_salarial', 15, 2).defaultTo(0).notNullable()
      table.date('fecha_efectiva').notNullable() // <-- **AGREGADO**

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable() // <-- Puede ser nullable
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
