// database/migrations/1758650100000_create_captacion_dateos_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CaptacionDateos extends BaseSchema {
  protected tableName = 'captacion_dateos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .enu('canal', ['FACHADA', 'ASESOR', 'TELE', 'REDES'], {
          useNative: true,
          enumName: 'captacion_canal_enum',
        })
        .notNullable()

      table
        .integer('agente_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacion')
        .onDelete('RESTRICT')

      table.string('placa', 12).nullable()
      table.string('telefono', 20).nullable()

      table
        .enu('origen', ['UI', 'WHATSAPP', 'IMPORT'], {
          useNative: true,
          enumName: 'captacion_origen_enum',
        })
        .notNullable()

      table.string('observacion', 255).nullable()

      table.string('imagen_url', 512).nullable()
      table.string('imagen_mime', 100).nullable()
      table.integer('imagen_tamano_bytes').unsigned().nullable()
      table.string('imagen_hash', 128).nullable()
      table.string('imagen_origen_id', 128).nullable()
      table.integer('imagen_subida_por').unsigned().nullable()

      // FK al turno (si ya existe), se marca como consumido
      table
        .integer('consumido_turno_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos_rtms')
        .onDelete('SET NULL')

      // 👉 Sin zona horaria y sin milisegundos
      table.dateTime('consumido_at', { precision: 0 }).nullable()

      table.string('payload_hash', 128).nullable().unique()

      // Timestamps sin tz para evitar offsets
      table.dateTime('created_at', { precision: 0 }).notNullable().defaultTo(this.now())
      table.dateTime('updated_at', { precision: 0 }).notNullable().defaultTo(this.now())

      table.index(['placa', 'created_at'])
      table.index(['telefono', 'created_at'])
      table.index(['canal', 'agente_id', 'created_at'])
      table.index(['consumido_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
