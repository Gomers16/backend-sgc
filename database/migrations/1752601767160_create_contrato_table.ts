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

      table
        .integer('sede_id')
        .unsigned()
        .references('id')
        .inTable('sedes')
        .onDelete('RESTRICT')
        .notNullable()

      table.enum('tipo_contrato', ['prestacion', 'temporal', 'laboral']).notNullable()
      table.enum('estado', ['activo', 'inactivo']).defaultTo('activo').notNullable()

      table.date('fecha_inicio').notNullable()
      table.date('fecha_fin').nullable()

      // ✅ Nuevas columnas para el archivo físico del contrato
      table.string('nombre_archivo_contrato_fisico').nullable()
      table.string('ruta_archivo_contrato_fisico').nullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
