// database/migrations/1780000000000_create_add_reasignado_turnos_rtms_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddReasignadoDeTurnoId extends BaseSchema {
  protected tableName = 'turnos_rtms'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('reasignado_de_turno_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos_rtms')
        .onDelete('SET NULL')

      table.index(['reasignado_de_turno_id'], 'idx_turno_reasignado_de')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['reasignado_de_turno_id'], 'idx_turno_reasignado_de')
      table.dropForeign(['reasignado_de_turno_id'])
      table.dropColumn('reasignado_de_turno_id')
    })
  }
}
