// database/migrations/xxxx_create_certificaciones.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateCertificaciones extends BaseSchema {
  protected tableName = 'certificaciones'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('turno_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('turnos_rtms') // 👈 ajusta al nombre REAL de tu tabla de turnos
        .onDelete('CASCADE')

      table
        .integer('usuario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios') // 👈 ajusta al nombre REAL de tu tabla de usuarios
        .onDelete('SET NULL')

      table.string('imagen_path').notNullable()
      table.text('observaciones').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
