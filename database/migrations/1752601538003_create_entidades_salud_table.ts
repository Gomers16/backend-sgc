import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entidades_salud'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('nombre', 100).notNullable()
      table.enum('tipo', ['eps', 'arl', 'afp', 'afc', 'ccf']).notNullable()

      // === Campos para certificado ===
      table.string('certificado_nombre_original', 255).nullable()
      table.string('certificado_nombre_archivo', 255).nullable()
      table.string('certificado_mime', 100).nullable()
      table.bigInteger('certificado_tamanio').nullable()
      table.date('certificado_fecha_emision').nullable()
      table.date('certificado_fecha_expiracion').nullable()
      // ===============================

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
