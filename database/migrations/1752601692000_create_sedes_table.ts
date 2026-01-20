// database/migrations/XXXX_create_sedes_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sedes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // PK

      // ❌ ELIMINADO: razon_social_id (las sedes son independientes)

      // Relación obligatoria con ciudad (catálogo 'ciudades')
      table
        .integer('ciudad_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ciudades')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      // Nombre visible de la sede (único)
      table.string('nombre', 100).notNullable().unique()

      // Dirección opcional (para reportes/documentos)
      table.string('direccion', 200).nullable()

      // Zona horaria (default America/Bogota)
      table.string('timezone', 64).notNullable().defaultTo('America/Bogota')

      // Estado
      table.boolean('activo').notNullable().defaultTo(true)

      // Índice útil
      table.index(['ciudad_id'])

      // Timestamps con zona horaria
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
