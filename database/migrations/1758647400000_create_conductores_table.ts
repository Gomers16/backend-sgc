// database/migrations/xxxx_create_conductores.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conductores'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('nombre', 150).notNullable()

      table.string('doc_tipo', 8).nullable()
      table.string('doc_numero', 30).nullable()

      table.string('telefono', 30).nullable()
      table.string('email', 150).nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['telefono'])
      table.index(['doc_tipo', 'doc_numero'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
