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

      // Nueva columna para el ID de la sede
      table
        .integer('sede_id')
        .unsigned()
        .references('id')
        .inTable('sedes')
        .onDelete('RESTRICT') // Restringe la eliminación de una sede si tiene contratos asociados
        .notNullable() // Cada contrato debe estar asociado a una sede

      table.enum('tipo_contrato', ['prestacion', 'temporal', 'laboral']).notNullable()
      table.enum('estado', ['activo', 'inactivo']).defaultTo('activo').notNullable()

      table.date('fecha_inicio').notNullable()
      table.date('fecha_fin').nullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now()) // Added notNullable and defaultTo
      table.timestamp('updated_at').notNullable().defaultTo(this.now()) // Added notNullable and defaultTo
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
