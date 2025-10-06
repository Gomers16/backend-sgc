import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CaptacionCanales extends BaseSchema {
  protected tableName = 'captacion_canales'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('codigo', 32).notNullable().unique() // ej: FACHADA, ASESOR, TELEMERCADEO, REDES
      table.string('nombre', 100).notNullable() // ej: Fachada, Asesor, Telemercadeo, Redes Sociales
      table.string('descripcion', 255).nullable()
      table.string('color_hex', 7).nullable() // ej: #6D28D9 (opcional para chips en UI)
      table.boolean('activo').notNullable().defaultTo(true)
      table.smallint('orden').unsigned().notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['activo', 'orden'], 'captacion_canales_activo_orden_idx')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
