// Crea un nuevo archivo de migración con el siguiente comando:
// node ace make:migration create_contrato_eventos_table

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contrato_eventos' // Un nombre claro para la tabla

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('contrato_id')
        .unsigned()
        .references('id')
        .inTable('contratos')
        .onDelete('CASCADE') // Si se elimina un contrato, se eliminan sus eventos

      table
        .enum('tipo', [
          'incapacidad',
          'suspension',
          'licencia',
          'permiso',
          'vacaciones',
          'cesantias',
          'disciplinario',
          'terminacion',
        ])
        .notNullable()

      table.string('subtipo').nullable()

      table.date('fecha_inicio').notNullable()
      table.date('fecha_fin').nullable()
      table.text('descripcion').nullable()

      table.string('documento_url').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
