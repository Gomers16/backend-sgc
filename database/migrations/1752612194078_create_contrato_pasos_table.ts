import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contrato_pasos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('contrato_id')
        .unsigned()
        .references('id')
        .inTable('contratos')
        .onDelete('CASCADE')

      table.enum('fase', ['inicio', 'desarrollo', 'fin']).notNullable()
      table.string('nombre_paso', 150).notNullable()

      table.date('fecha').nullable()
      table.string('archivo_url').nullable() // ✅ CORREGIDO: Cambiado de 'archivo' a 'archivo_url'
      table.text('observacion').nullable()

      table.integer('orden').notNullable()
      table.boolean('completado').defaultTo(false).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
