import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPagoFieldsTramites extends BaseSchema {
  protected tableName = 'tramites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('estado_pago', 20).nullable()
      table.decimal('valor_liquidado', 12, 2).nullable()
      table.string('forma_pago_cobro', 50).nullable()
      table.string('referencia_pago', 100).nullable()
      table.string('evidencia_pago_url', 500).nullable()
      table.timestamp('fecha_pago', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('estado_pago')
      table.dropColumn('valor_liquidado')
      table.dropColumn('forma_pago_cobro')
      table.dropColumn('referencia_pago')
      table.dropColumn('evidencia_pago_url')
      table.dropColumn('fecha_pago')
    })
  }
}
