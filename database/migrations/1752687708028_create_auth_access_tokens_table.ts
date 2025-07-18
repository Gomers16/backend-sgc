import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AuthAccessTokens extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('tokenable_id') // Referencia a usuarios
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table.string('tokenable_type').notNullable().defaultTo('Usuario')
      table.string('hash', 64).notNullable()
      table.string('type').notNullable()
      table.string('name').nullable()
      // ✅ CAMBIO CRÍTICO AQUÍ: Eliminamos defaultTo('[]') para cumplir con la restricción de MySQL.
      // Aseguramos que sea nullable() para que no falle si no se proporciona un valor.
      table.json('abilities').nullable() // Ahora es nullable, sin default
      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
