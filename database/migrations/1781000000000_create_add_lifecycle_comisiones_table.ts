import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comisiones'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('aprobado_at', { useTz: false }).nullable()
      table
        .integer('aprobado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.timestamp('pagado_at', { useTz: false }).nullable()
      table
        .integer('pagado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.timestamp('anulado_at', { useTz: false }).nullable()
      table
        .integer('anulado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.text('observacion').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['aprobado_por'])
      table.dropForeign(['pagado_por'])
      table.dropForeign(['anulado_por'])
      table.dropColumn('aprobado_at')
      table.dropColumn('aprobado_por')
      table.dropColumn('pagado_at')
      table.dropColumn('pagado_por')
      table.dropColumn('anulado_at')
      table.dropColumn('anulado_por')
      table.dropColumn('observacion')
    })
  }
}
