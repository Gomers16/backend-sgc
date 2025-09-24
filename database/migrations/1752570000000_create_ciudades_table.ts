import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ciudades'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // PK

      table.string('nombre', 100).notNullable().unique() // 'Ibagué', 'Bogotá D.C.'
      table.string('departamento', 100).nullable() // 'Tolima', 'Bogotá D.C.' (opcional)

      table.boolean('activo').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
