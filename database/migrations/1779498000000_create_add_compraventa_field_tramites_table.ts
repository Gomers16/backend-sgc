import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCompraventaFieldTramites extends BaseSchema {
  protected tableName = 'tramites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('incluye_compraventa').nullable().defaultTo(false)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('incluye_compraventa')
    })
  }
}
