import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contrato_pasos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('contrato_id')
        .unsigned()
        .references('id')
        .inTable('contratos')
        .onDelete('CASCADE')
        .notNullable()

      // FK opcional al actor (usuario)
      table
        .integer('usuario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table
        .enum('fase', ['inicio', 'desarrollo', 'fin'], {
          useNative: true,
          enumName: 'contrato_pasos_fase_enum',
        })
        .notNullable()

      table.string('nombre_paso', 150).notNullable()

      // DATE (no datetime)
      table.date('fecha').nullable()

      // Ruta pública del archivo
      table.string('archivo_url').nullable()

      table.text('observacion').nullable()

      table.integer('orden').notNullable()
      table.boolean('completado').notNullable().defaultTo(false)

      // Timestamps (llenados por el modelo con autoCreate/autoUpdate)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Índices útiles
      table.index(['contrato_id'])
      table.index(['usuario_id'])
      table.index(['fase'])
      table.index(['orden'])
    })
  }

  async down() {
    // borrar enum nativo si tu motor lo crea (Postgres). Si usas MySQL/MariaDB, esto es inofensivo.
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['contrato_id'])
      table.dropIndex(['usuario_id'])
      table.dropIndex(['fase'])
      table.dropIndex(['orden'])
    })

    this.schema.dropTable(this.tableName)

    // Nota: En Postgres podrías querer soltar el enum si lo creaste con useNative:
    // this.schema.raw('DROP TYPE IF EXISTS contrato_pasos_fase_enum')
  }
}
