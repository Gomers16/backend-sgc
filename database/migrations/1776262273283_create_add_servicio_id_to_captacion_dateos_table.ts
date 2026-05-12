import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'captacion_dateos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('servicio_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('servicios')
        .after('descuento_id') // lo pone justo después de descuento_id
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('servicio_id')
    })
  }
}
