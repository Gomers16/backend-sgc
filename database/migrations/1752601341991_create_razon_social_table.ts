import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'razon_social'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Clave primaria autoincremental
      table.string('nombre', 100).notNullable().unique() // Nombre único y obligatorio
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
