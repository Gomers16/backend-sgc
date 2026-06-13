// Permite que un mismo turno (turno_numero / turno_codigo) agrupe
// múltiples trámites — un cliente puede realizar más de un trámite
// en la misma visita/turno.
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DropUniqueTurnoTramites extends BaseSchema {
  protected tableName = 'tramites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Eliminar unique global de turno_codigo
      table.dropUnique(['turno_codigo'])
      // Eliminar unique compuesto (sede_id, fecha, turno_numero)
      table.dropUnique(['sede_id', 'fecha', 'turno_numero'], 'uq_tramites_sede_fecha_turno')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['turno_codigo'])
      table.unique(['sede_id', 'fecha', 'turno_numero'], {
        indexName: 'uq_tramites_sede_fecha_turno',
      })
    })
  }
}
