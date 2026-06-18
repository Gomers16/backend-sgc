import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPlacaToTramites extends BaseSchema {
  protected tableName = 'tramites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('placa', 10).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('placa')
    })
  }
}
