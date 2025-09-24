// database/migrations/1750000000000_create_servicios_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Servicios extends BaseSchema {
  protected tableName = 'servicios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('codigo_servicio', 10).notNullable().unique()  // RTM, PREV, PERI, SOAT, etc.
      table.string('nombre_servicio', 100).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
