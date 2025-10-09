// database/migrations/1758646982056_create_agentes_captacions_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateAgentesCaptacions extends BaseSchema {
  protected tableName = 'agentes_captacions'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // 🎯 Nuevo enum con los 3 tipos reales alineados a cargos
      table
        .enu('tipo', ['ASESOR_COMERCIAL', 'ASESOR_CONVENIO', 'ASESOR_TELEMERCADEO'], {
          useNative: true,
          enumName: 'agente_tipo_enum',
        })
        .notNullable()

      // 🔗 Usuario (solo cuando es comercial o telemercadeo; puede ser NULL en convenios)
      table
        .integer('usuario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.string('nombre', 120).notNullable()
      table.string('telefono', 20).nullable()

      table
        .enu('doc_tipo', ['CC', 'NIT'], {
          useNative: true,
          enumName: 'agente_doc_tipo_enum',
        })
        .nullable()

      table.string('doc_numero', 32).nullable()

      table.boolean('activo').notNullable().defaultTo(true)

      table.dateTime('created_at', { precision: 0 }).notNullable().defaultTo(this.now())
      table.dateTime('updated_at', { precision: 0 }).notNullable().defaultTo(this.now())

      // Índices y restricciones
      table.unique(['doc_tipo', 'doc_numero']) // permite ambos NULL
      table.unique(['usuario_id']) // permite múltiples NULL
      table.index(['telefono'])
      table.index(['tipo', 'activo'])
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
