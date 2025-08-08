import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ContratoHistorialEstados extends BaseSchema {
  protected tableName = 'contrato_historial_estados'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // FK al contrato
      table
        .integer('contrato_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('contratos')
        .onDelete('CASCADE')

      // FK al usuario (puede ser null si el cambio fue automático)
      table
        .integer('usuario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      // Estados de cambio
      table.enum('old_estado', ['activo', 'inactivo']).notNullable()
      table.enum('new_estado', ['activo', 'inactivo']).notNullable()

      // Fecha del cambio de estado
      table.timestamp('fecha_cambio', { useTz: true }).notNullable()

      // Fecha en la que se inició el contrato (puede coincidir con fecha_cambio)
      table.date('fecha_inicio_contrato').notNullable()

      // Motivo del cambio (opcional)
      table.text('motivo').nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
