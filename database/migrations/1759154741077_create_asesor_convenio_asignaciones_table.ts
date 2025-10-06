// database/migrations/1759154741077_create_asesor_convenio_asignaciones_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateAsesorConvenioAsignaciones extends BaseSchema {
  protected tableName = 'asesor_convenio_asignaciones'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('convenio_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('convenios')
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

      table.index(['convenio_id', 'activo'], 'idx_convenio_activo')
      table.index(['convenio_id', 'fecha_fin'], 'idx_convenio_fecha_fin')
      table.index(['asesor_id', 'activo'], 'idx_asesor_activo')
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
