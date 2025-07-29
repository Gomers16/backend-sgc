import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  // Define el nombre de la tabla para las sedes
  protected tableName = 'sedes'

  async up() {
    // Crea la tabla 'sedes'
    this.schema.createTable(this.tableName, (table) => {
      // Columna de ID autoincremental y primaria
      table.increments('id')

      // Columna para el nombre de la sede (ej. 'Bogotá', 'Ibagué', 'Caimito')
      // Es NOT NULLable y UNIQUE para asegurar que cada sede tenga un nombre distinto y no nulo.
      table.string('nombre', 100).notNullable().unique()

      // Columnas para registrar la fecha de creación y última actualización
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    // Elimina la tabla 'sedes' si se hace un rollback de la migración
    this.schema.dropTable(this.tableName)
  }
}
