// database/migrations/1759154950000_create_captacion_dateos_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CaptacionDateos extends BaseSchema {
  protected tableName = 'captacion_dateos'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .enu('canal', ['FACHADA', 'ASESOR_COMERCIAL', 'ASESOR_CONVENIO', 'TELE', 'REDES'], {
          useNative: true,
          enumName: 'captacion_canal_enum',
        })
        .notNullable()

      table
        .integer('agente_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacions')
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

      // Imagen
      table.string('imagen_url', 512).nullable()
      table.string('imagen_mime', 100).nullable()
      table.integer('imagen_tamano_bytes').unsigned().nullable()
      table.string('imagen_hash', 128).nullable()
      table.string('imagen_origen_id', 128).nullable()
      table.integer('imagen_subida_por').unsigned().nullable()

      // Consumo
      table
        .integer('consumido_turno_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos_rtms')
        .onDelete('SET NULL')

      table.dateTime('consumido_at', { precision: 0 }).nullable()
      table.string('payload_hash', 128).nullable().unique()

      // Vínculos
      table
        .integer('convenio_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('convenios')
        .onDelete('SET NULL')

      table
        .integer('prospecto_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('prospectos')
        .onDelete('SET NULL')

      table
        .integer('vehiculo_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('vehiculos')
        .onDelete('SET NULL')

      table
        .integer('cliente_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('clientes')
        .onDelete('SET NULL')

      // ✅ Estados incluye EN_PROCESO
      table
        .enu('resultado', ['PENDIENTE', 'EN_PROCESO', 'EXITOSO', 'NO_EXITOSO'], {
          useNative: true,
          enumName: 'dateo_resultado_enum',
        })
        .notNullable()
        .defaultTo('PENDIENTE')

      table.string('motivo_no_exitoso', 180).nullable()

      table.dateTime('created_at', { precision: 0 }).notNullable().defaultTo(this.now())
      table.dateTime('updated_at', { precision: 0 }).notNullable().defaultTo(this.now())

      table.index(['placa', 'created_at'])
      table.index(['telefono', 'created_at'])
      table.index(['canal', 'agente_id', 'created_at'])
      table.index(['consumido_at'])
      table.index(['resultado', 'created_at'])
      table.index(['convenio_id'])
      table.index(['prospecto_id'])
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
