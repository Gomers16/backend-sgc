// database/migrations/1759154804822_create_asesor_prospecto_asignaciones_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'asesor_prospecto_asignaciones'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('prospecto_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('prospectos')
        .onDelete('CASCADE')

      table
        .integer('asesor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('RESTRICT')

      table
        .integer('asignado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.dateTime('fecha_asignacion', { precision: 0 }).notNullable().defaultTo(this.now())
      table.dateTime('fecha_fin', { precision: 0 }).nullable()
      table.string('motivo_fin', 180).nullable()
      table.boolean('activo').notNullable().defaultTo(true)

      table.unique(['prospecto_id', 'activo'], 'uq_prospecto_asignacion_activa')
      table.index(['asesor_id', 'activo'])
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
