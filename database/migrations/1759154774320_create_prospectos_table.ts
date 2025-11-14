import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateProspectosTable extends BaseSchema {
  protected tableName = 'prospectos'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('convenio_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('convenios')
        .onDelete('SET NULL')

      // ⛔ Placa única y obligatoria
      table.string('placa', 12).notNullable().unique()

      table.string('telefono', 20).nullable()
      table.string('nombre', 120).nullable()
      table.string('observaciones', 255).nullable()

      // 🛞 SOAT
      table.boolean('soat_vigente').notNullable().defaultTo(false)
      table.date('soat_vencimiento').nullable()

      // 🧪 RTM (tecnomecánica)
      table.boolean('tecno_vigente').notNullable().defaultTo(false)
      table.date('tecno_vencimiento').nullable()

      // 🧰 Preventiva (cada 2 meses)
      table.boolean('preventiva_vigente').notNullable().defaultTo(false)
      table.date('preventiva_vencimiento').nullable()

      // 🔍 Peritaje (última fecha conocida, no tiene vigencia fija)
      table.date('peritaje_ultima_fecha').nullable()

      table
        .enu('origen', ['IMPORT', 'CAMPO', 'EVENTO', 'OTRO'], {
          useNative: true,
          enumName: 'prospecto_origen_enum',
        })
        .notNullable()
        .defaultTo('OTRO')

      table
        .integer('creado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      // 👇 marca de archivado (cuando ya se convirtió en dateo)
      table.boolean('archivado').notNullable().defaultTo(false)

      table.dateTime('created_at', { precision: 0 }).notNullable().defaultTo(this.now())
      table.dateTime('updated_at', { precision: 0 }).notNullable().defaultTo(this.now())

      table.index(['convenio_id'])
      table.index(['placa'])
      table.index(['telefono'])
      table.index(['soat_vigente', 'soat_vencimiento'])
      table.index(['tecno_vigente', 'tecno_vencimiento'])
      table.index(['preventiva_vigente', 'preventiva_vencimiento'])
      table.index(['origen'])
      table.index(['archivado']) // 👈 para filtrar rápido los archivados
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
