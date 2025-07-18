import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contratos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('usuario_id')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table.enum('tipo_contrato', ['prestacion', 'temporal', 'laboral']).notNullable()
      table.enum('estado', ['activo', 'inactivo']).defaultTo('activo').notNullable()

      table.date('fecha_inicio').notNullable()
      table.date('fecha_fin').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
