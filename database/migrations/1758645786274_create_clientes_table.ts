// database/migrations/1758645786274_create_clientes_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clientes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // PK
      table.string('nombre', 120).nullable() // Persona o empresa
      table.string('doc_tipo', 10).nullable() // CC | NIT | CE | PAS
      table.string('doc_numero', 32).nullable() // UNIQUE junto a doc_tipo
      table.string('telefono', 20).nullable() // 🆕 Nullable: hay clientes sin teléfono
      table.string('email', 120).nullable()
      table.integer('ciudad_id').unsigned().nullable() // (FK opcional si manejas ciudades)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['doc_tipo', 'doc_numero']) // Unicidad compuesta de documento
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
