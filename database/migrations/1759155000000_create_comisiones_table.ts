// database/migrations/1759155000000_create_comisiones_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comisiones'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('captacion_dateo_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('captacion_dateos')
        .onDelete('CASCADE')

      table
        .integer('asesor_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('SET NULL')

      table
        .integer('convenio_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('convenios')
        .onDelete('SET NULL')

      table
        .enu('tipo_servicio', ['RTM', 'TECNOMECANICA', 'PREVENTIVA', 'SOAT', 'OTRO'], {
          useNative: true,
          enumName: 'comision_servicio_enum',
        })
        .notNullable()
        .defaultTo('RTM')

      table
        .enu('tipo_vehiculo', ['MOTO', 'VEHICULO'], {
          useNative: true,
          enumName: 'comision_tipo_vehiculo_enum',
        })
        .nullable()

      table.decimal('base', 12, 2).notNullable().defaultTo(0)
      table.decimal('porcentaje', 5, 2).notNullable().defaultTo(0)
      table.decimal('monto', 12, 2).notNullable().defaultTo(0)

      // ========== 💰 DESGLOSE INTERNO ==========
      table.decimal('monto_asesor', 12, 2).nullable()
      table.decimal('monto_convenio', 12, 2).nullable()
      table
        .integer('asesor_secundario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('SET NULL')

      // ========== 🔄 CAMPOS DE RECURRENCIA (NUEVO) ==========
      table.boolean('descuento_recurrencia_aplicado').notNullable().defaultTo(false)
      table
        .enu('tipo_descuento_recurrencia', ['PORCENTAJE', 'VALOR_FIJO'], {
          useNative: true,
          enumName: 'tipo_descuento_recurrencia_enum',
        })
        .nullable()
      table.decimal('valor_descuento_recurrencia', 12, 2).nullable()
      table.decimal('monto_original_dateo', 12, 2).nullable()
      table.decimal('monto_original_placa', 12, 2).nullable()
      // ========== FIN RECURRENCIA ==========

      table.integer('meta_rtm').unsigned().notNullable().defaultTo(0)
      table.decimal('valor_rtm_moto', 12, 2).notNullable().defaultTo(0)
      table.decimal('valor_rtm_vehiculo', 12, 2).notNullable().defaultTo(0)
      table.decimal('porcentaje_comision_meta', 5, 2).notNullable().defaultTo(0)

      table
        .enu('estado', ['PENDIENTE', 'APROBADA', 'PAGADA', 'ANULADA'], {
          useNative: true,
          enumName: 'comision_estado_enum',
        })
        .notNullable()
        .defaultTo('PENDIENTE')

      table.boolean('es_config').notNullable().defaultTo(false)
      table.dateTime('fecha_calculo', { precision: 0 }).notNullable().defaultTo(this.now())

      table
        .integer('calculado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(this.now())

      /* ===== Índices ===== */
      table.index(['asesor_id', 'estado'])
      table.index(['asesor_secundario_id'])
      table.index(['tipo_servicio', 'estado'])
      table.index(['fecha_calculo'])
      table.index(['es_config'])
      table.index(['tipo_vehiculo', 'es_config'])
      table.index(['descuento_recurrencia_aplicado']) // 👈 NUEVO
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
