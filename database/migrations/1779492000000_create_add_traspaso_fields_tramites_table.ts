import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddTraspasoFieldsTramites extends BaseSchema {
  protected tableName = 'tramites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('valor_vehiculo', 12, 2).nullable()
      table.string('forma_pago', 50).nullable()
      table.date('fecha_entrega').nullable()
      table.decimal('destrate', 12, 2).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('valor_vehiculo')
      table.dropColumn('forma_pago')
      table.dropColumn('fecha_entrega')
      table.dropColumn('destrate')
    })
  }
}
