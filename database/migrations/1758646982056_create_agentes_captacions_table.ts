// database/migrations/xxxx_create_agentes_captacion.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'agentes_captacion'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // PK

      table
        .enu('tipo', ['ASESOR_INTERNO', 'ASESOR_EXTERNO', 'TELEMERCADEO'], {
          useNative: true,
          enumName: 'agente_tipo_enum',
        })
        .notNullable()

      table.string('nombre', 120).notNullable()
      table.string('telefono', 20).nullable() // index (no UNIQUE)
      table
        .enu('doc_tipo', ['CC', 'NIT'], {
          useNative: true,
          enumName: 'agente_doc_tipo_enum',
        })
        .nullable()
      table.string('doc_numero', 32).nullable()

      table.boolean('activo').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['doc_tipo', 'doc_numero']) // Unicidad compuesta de documento
      table.index(['telefono'])
      table.index(['tipo'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
    // Nota: en algunos motores hay que dropear los enum types nativos manualmente.
  }
}
