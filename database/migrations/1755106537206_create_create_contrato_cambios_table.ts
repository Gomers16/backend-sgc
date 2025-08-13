import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contrato_cambios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('contrato_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('contratos')
        .onDelete('CASCADE')

      table
        .integer('usuario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.string('campo', 100).notNullable()

      // 👇 IMPORTANTE: usar TEXT en lugar de JSON
      table.text('old_value').nullable()
      table.text('new_value').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
