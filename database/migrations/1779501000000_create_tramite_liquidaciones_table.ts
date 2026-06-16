import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTramiteLiquidacionesTable extends BaseSchema {
  protected tableName = 'tramite_liquidaciones'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('tramite_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('tramites')
        .onDelete('CASCADE')

      // ── Conceptos de liquidación
      table.decimal('retencion', 12, 2).nullable().defaultTo(0)
      table.decimal('derechos_traspaso', 12, 2).nullable().defaultTo(0)
      table.decimal('paz_salvo', 12, 2).nullable().defaultTo(0)
      table.decimal('levantamiento_prenda', 12, 2).nullable().defaultTo(0)
      table.decimal('inscripcion_prenda', 12, 2).nullable().defaultTo(0)
      table.decimal('papeleria', 12, 2).nullable().defaultTo(0)
      table.decimal('honorarios', 12, 2).nullable().defaultTo(0)
      table.decimal('impuesto_anio_actual', 12, 2).nullable().defaultTo(0)
      table.decimal('impuesto_anios_vencidos', 12, 2).nullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
