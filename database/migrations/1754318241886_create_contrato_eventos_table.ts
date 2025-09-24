import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contrato_eventos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('contrato_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('contratos')
        .onDelete('CASCADE')

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

      // Quién creó/modificó el evento (nullable)
      table
        .integer('usuario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      // Timestamps con valor por defecto
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())

      // Índices útiles
      table.index(['contrato_id'])
      table.index(['usuario_id'])
      table.index(['tipo'])
      table.index(['fecha_inicio'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
