// database/migrations/1759154693735_create_convenios_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateConveniosTable extends BaseSchema {
  protected tableName = 'convenios'

  public async up() {
    // Eliminar si existe para evitar conflictos
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .enu('tipo', ['PERSONA', 'TALLER'], { useNative: true, enumName: 'convenio_tipo_enum' })
        .notNullable()

      table.string('codigo', 64).nullable()
      table.string('nombre', 150).notNullable()
      table.string('doc_tipo', 10).nullable()
      table.string('doc_numero', 32).nullable()
      table.string('telefono', 20).nullable()
      table.string('whatsapp', 20).nullable()
      table.string('email', 120).nullable()

      table
        .integer('ciudad_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('ciudades')
        .onDelete('SET NULL')

      table.string('direccion', 180).nullable()
      table.text('notas').nullable()
      table.boolean('activo').notNullable().defaultTo(true)

      table.unique(['doc_tipo', 'doc_numero'])
      table.index(['activo', 'tipo'])
      table.index(['codigo'], 'idx_convenios_codigo')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
