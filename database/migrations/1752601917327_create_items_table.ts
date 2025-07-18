import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('nombre', 100).notNullable().unique() // Nombre único del módulo
      table.string('ruta', 150).nullable() // Ruta o identificador opcional
      table.string('descripcion', 200).nullable() // Descripción opcional del ítem

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
