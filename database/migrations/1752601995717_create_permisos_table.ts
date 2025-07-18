import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permisos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('nombre', 50).notNullable().unique() // Ej: ver, crear, editar, eliminar
      table.string('descripcion', 150).nullable() // Descripción opcional

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
