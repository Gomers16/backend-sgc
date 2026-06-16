import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateLiquidacionPagosTable extends BaseSchema {
  protected tableName = 'liquidacion_pagos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('tramite_liquidacion_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tramite_liquidaciones')
        .onDelete('CASCADE')

      table.date('fecha').notNullable()
      table.decimal('monto', 12, 2).notNullable()
      table.string('forma_pago', 50).nullable()
      table.string('referencia_pago', 100).nullable()
      table.string('pdf_path', 500).nullable()
      table.string('evidencia_url', 500).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
