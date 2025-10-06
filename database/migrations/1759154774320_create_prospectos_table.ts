// database/migrations/1759154774320_create_prospectos_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateProspectosTable extends BaseSchema {
  protected tableName = 'prospectos'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('convenio_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('convenios')
        .onDelete('SET NULL')

      table.string('placa', 12).nullable()
      table.string('telefono', 20).nullable()
      table.string('nombre', 120).nullable()
      table.string('observaciones', 255).nullable()

      table.boolean('soat_vigente').notNullable().defaultTo(false)
      table.date('soat_vencimiento').nullable()

      table.boolean('tecno_vigente').notNullable().defaultTo(false)
      table.date('tecno_vencimiento').nullable()

      table
        .enu('origen', ['IMPORT', 'CAMPO', 'EVENTO', 'OTRO'], {
          useNative: true,
          enumName: 'prospecto_origen_enum',
        })
        .notNullable()
        .defaultTo('OTRO')

      table
        .integer('creado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.dateTime('created_at', { precision: 0 }).notNullable().defaultTo(this.now())
      table.dateTime('updated_at', { precision: 0 }).notNullable().defaultTo(this.now())

      table.index(['convenio_id'])
      table.index(['placa'])
      table.index(['telefono'])
      table.index(['soat_vigente', 'soat_vencimiento'])
      table.index(['tecno_vigente', 'tecno_vencimiento'])
      table.index(['origen'])
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
