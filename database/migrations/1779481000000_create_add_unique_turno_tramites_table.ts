import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUniqueTurnoTramites extends BaseSchema {
  protected tableName = 'tramites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['sede_id', 'fecha', 'turno_numero'], {
        indexName: 'uq_tramites_sede_fecha_turno',
      })
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['sede_id', 'fecha', 'turno_numero'], 'uq_tramites_sede_fecha_turno')
    })
  }
}
