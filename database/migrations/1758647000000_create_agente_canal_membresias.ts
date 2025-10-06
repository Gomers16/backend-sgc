import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AgenteCanalMembresias extends BaseSchema {
  protected tableName = 'agente_canal_membresias'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // FK: agente (tabla plural correcta)
      table
        .integer('agente_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('agentes_captacions') // <- corregido (plural)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      // FK: canal
      table
        .integer('canal_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('captacion_canales')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      // Flags de la membresía
      table.boolean('is_default').notNullable().defaultTo(false)
      table.boolean('activo').notNullable().defaultTo(true)

      // Restricción de unicidad y algunos índices útiles
      table.unique(['agente_id', 'canal_id'], 'uq_agente_canal')
      table.index(['agente_id', 'activo'], 'idx_membresias_agente_activo')
      table.index(['canal_id', 'activo'], 'idx_membresias_canal_activo')

      // Timestamps (sin TZ para mantener consistencia con el resto)
      table.dateTime('created_at', { precision: 0 }).notNullable().defaultTo(this.now())
      table.dateTime('updated_at', { precision: 0 }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
