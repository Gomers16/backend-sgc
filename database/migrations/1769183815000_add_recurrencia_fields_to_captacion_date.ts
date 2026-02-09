import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddRecurrenciaFieldsToCaptacionDateos extends BaseSchema {
  protected tableName = 'captacion_dateos'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('es_cliente_recurrente').notNullable().defaultTo(false)

      table.integer('meses_desde_ultima_visita').unsigned().nullable()

      table
        .integer('turno_recurrente_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos_rtms')
        .onDelete('SET NULL')

      table.index(['es_cliente_recurrente'], 'idx_dateo_recurrente')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('turno_recurrente_id')
      table.dropColumn('meses_desde_ultima_visita')
      table.dropColumn('es_cliente_recurrente')
    })
  }
}
