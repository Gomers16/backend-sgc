import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'razon_social'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // PK autoincremental

      // Nombre de la razón social (único y obligatorio)
      table.string('nombre', 100).notNullable().unique()

      // NIT (único y obligatorio). Se define el campo; los valores reales se cargan luego.
      table.string('nit', 20).notNullable().unique()

      // (Opcional útil) Estado activo: por defecto true
      table.boolean('activo').notNullable().defaultTo(true)

      // Timestamps con zona horaria
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
