// database/migrations/XXXX_add_tipo_sangre_contacto_emergencia_to_usuarios.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Tipo de sangre (enum con los tipos comunes)
      table.enum('tipo_sangre', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).nullable()

      // Contacto de emergencia
      table.string('contacto_emergencia_nombre', 150).nullable()
      table.string('contacto_emergencia_telefono', 50).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('tipo_sangre')
      table.dropColumn('contacto_emergencia_nombre')
      table.dropColumn('contacto_emergencia_telefono')
    })
  }
}
