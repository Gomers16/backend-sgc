// database/migrations/1758644517726_create_clases_vehiculos_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clases_vehiculos' // 👈 plural (debe empatar con las FKs)

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.engine('InnoDB') // 👈 asegura motor compatible con FKs
      table.charset('utf8mb4')
      table.collate('utf8mb4_unicode_ci')

      table.increments('id')
      table.string('codigo', 20).notNullable().unique() // LIV_PART, LIV_TAXI, etc.
      table.string('nombre', 60).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
