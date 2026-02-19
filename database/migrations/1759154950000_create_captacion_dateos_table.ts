// database/migrations/[TIMESTAMP]_create_captacion_dateos_table.ts
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

      // Consumo por turno
      table
        .integer('consumido_turno_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos_rtms')
        .onDelete('SET NULL')

      table.dateTime('consumido_at', { precision: 0 }).nullable()
      table.string('payload_hash', 128).nullable().unique()

      // Vínculos comerciales
      table
        .integer('convenio_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('convenios')
        .onDelete('SET NULL')

      table
        .integer('asesor_convenio_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('SET NULL')

      table
        .integer('asesor_convenio_usuario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
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

      table
        .enu('resultado', ['PENDIENTE', 'EN_PROCESO', 'EXITOSO', 'NO_EXITOSO', 'RE_DATEAR'], {
          useNative: true,
          enumName: 'dateo_resultado_enum',
        })
        .notNullable()
        .defaultTo('PENDIENTE')

      table.boolean('liberado').notNullable().defaultTo(false)
      table.string('motivo_no_exitoso', 180).nullable()
      table.boolean('detectado_por_convenio').notNullable().defaultTo(false)

      // ========== 🔄 CAMPOS DE RECURRENCIA (NUEVO) ==========
      table.boolean('es_cliente_recurrente').notNullable().defaultTo(false)
      table.integer('meses_desde_ultima_visita').unsigned().nullable()
      // ========== FIN RECURRENCIA ==========

      // Timestamps
      table.dateTime('created_at', { precision: 0 }).notNullable().defaultTo(this.now())
      table.dateTime('updated_at', { precision: 0 }).notNullable().defaultTo(this.now())

      // Índices
      table.index(['placa', 'created_at'])
      table.index(['telefono', 'created_at'])
      table.index(['canal', 'agente_id', 'created_at'])
      table.index(['consumido_at'])
      table.index(['resultado', 'created_at'])
      table.index(['convenio_id'])
      table.index(['asesor_convenio_id'])
      table.index(['prospecto_id'])
      table.index(['liberado', 'resultado'])
      table.index(['es_cliente_recurrente']) // 👈 NUEVO
    })

    // Corrección de datos
    console.log('🔧 Corrigiendo convenio_id en dateos existentes...')

    const result1 = await this.db.rawQuery(`
      UPDATE captacion_dateos cd
      INNER JOIN agentes_captacions ac ON cd.asesor_convenio_id = ac.id
      INNER JOIN convenios c ON ac.nombre = c.nombre
      SET cd.convenio_id = c.id
      WHERE cd.convenio_id IS NULL
        AND cd.asesor_convenio_id IS NOT NULL
        AND ac.tipo = 'ASESOR_CONVENIO'
    `)

    console.log(`✅ ${result1[0]?.affectedRows || 0} dateos actualizados desde asesor_convenio_id`)

    const result2 = await this.db.rawQuery(`
      UPDATE captacion_dateos cd
      INNER JOIN agentes_captacions ac ON cd.agente_id = ac.id
      INNER JOIN convenios c ON ac.nombre = c.nombre
      SET
        cd.convenio_id = c.id,
        cd.asesor_convenio_id = ac.id
      WHERE cd.convenio_id IS NULL
        AND ac.tipo = 'ASESOR_CONVENIO'
    `)

    console.log(`✅ ${result2[0]?.affectedRows || 0} dateos actualizados desde agente_id`)

    const [verificacion] = await this.db
      .from('captacion_dateos')
      .whereNotNull('convenio_id')
      .count('* as total')

    console.log(`🎉 Total dateos con convenio_id: ${verificacion.total}`)
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
