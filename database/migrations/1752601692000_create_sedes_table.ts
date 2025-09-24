import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sedes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // PK

      // Relación obligatoria con razón social
      table
        .integer('razon_social_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('razon_social')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      // Relación obligatoria con ciudad (catálogo 'ciudades')
      table
        .integer('ciudad_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ciudades')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      // Nombre visible de la sede (único por razón social)
      table.string('nombre', 100).notNullable()

      // Dirección opcional (para reportes/documentos)
      table.string('direccion', 200).nullable()

      // Zona horaria (default America/Bogota para dejarlo future-proof)
      table.string('timezone', 64).notNullable().defaultTo('America/Bogota')

      // Estado
      table.boolean('activo').notNullable().defaultTo(true)

      // Unicidad: no se pueden repetir nombres dentro de la misma razón social
      table.unique(['razon_social_id', 'nombre'])

      // Índices útiles
      table.index(['ciudad_id'])
      table.index(['razon_social_id'])

      // Timestamps con zona horaria
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
