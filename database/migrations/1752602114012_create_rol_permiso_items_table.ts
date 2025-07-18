import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rol_permiso_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('rol_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')

      table
        .integer('permiso_item_id')
        .unsigned()
        .references('id')
        .inTable('permiso_items') // ✅ CORREGIDO
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
