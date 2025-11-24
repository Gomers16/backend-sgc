// database/migrations/1759155000000_create_comisiones_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comisiones'

  public async up() {
    // En desarrollo podemos tirar la tabla y crearla de nuevo
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Si es una comisión generada:
       *  - captacion_dateo_id: obligatorio (FK al dateo original)
       *
       * Si es una FILA DE CONFIGURACIÓN (regla estándar / por asesor / meta):
       *  - captacion_dateo_id: NULL
       */
      table
        .integer('captacion_dateo_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('captacion_dateos')
        .onDelete('CASCADE')

      /**
       * Asesor PRINCIPAL:
       *  - NULL  => regla GLOBAL (aplica a todos los asesores)
       *  - valor => regla específica de ese asesor o comisión generada normal
       */
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

      /**
       * Tipo de servicio de la comisión generada (RTM / TECNOMECANICA / etc.)
       */
      table
        .enu('tipo_servicio', ['RTM', 'TECNOMECANICA', 'PREVENTIVA', 'SOAT', 'OTRO'], {
          useNative: true,
          enumName: 'comision_servicio_enum',
        })
        .notNullable()
        .defaultTo('RTM')

      /**
       * Tipo de vehículo para la REGLA/COMISIÓN:
       *  - MOTO
       *  - VEHICULO (cualquier otro distinto a moto)
       */
      table
        .enu('tipo_vehiculo', ['MOTO', 'VEHICULO'], {
          useNative: true,
          enumName: 'comision_tipo_vehiculo_enum',
        })
        .nullable()

      /**
       * BASE:
       *  - Para comisiones generadas: comisión por PLACA/cliente/convenio.
       *  - Para filas de configuración: valor estándar de comisión por placa.
       */
      table.decimal('base', 12, 2).notNullable().defaultTo(0)

      /**
       * PORCENTAJE:
       *  - Opcional si quieres manejar % sobre base.
       *  - En muchos casos quedará en 0.
       */
      table.decimal('porcentaje', 5, 2).notNullable().defaultTo(0)

      /**
       * MONTO:
       *  - Para comisiones generadas: comisión por DATEO del asesor.
       *  - Para filas de configuración: valor estándar de comisión por dateo.
       */
      table.decimal('monto', 12, 2).notNullable().defaultTo(0)

      // ========== 💰 DESGLOSE INTERNO (NUEVO) ==========

      /**
       * MONTO_ASESOR:
       *  - Lo que cobra el asesor comercial por el DATEO cuando hay convenio.
       *  - Si no hay convenio, igual a `monto`.
       *  - NULL en filas de configuración.
       */
      table.decimal('monto_asesor', 12, 2).nullable()

      /**
       * MONTO_CONVENIO:
       *  - Lo que cobra el dueño del convenio por la PLACA.
       *  - Si no hay convenio, igual a `base`.
       *  - NULL en filas de configuración.
       */
      table.decimal('monto_convenio', 12, 2).nullable()

      /**
       * ASESOR_SECUNDARIO_ID:
       *  - ID del asesor del convenio (quien recibe monto_convenio).
       *  - NULL si no hay convenio o si el mismo asesor datea su convenio.
       */
      table
        .integer('asesor_secundario_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('SET NULL')

      // ========== FIN DESGLOSE ==========

      /**
       * META_RTM:
       *  - Meta mensual de RTM (cantidad de RTM) para filas de CONFIGURACIÓN.
       */
      table.integer('meta_rtm').unsigned().notNullable().defaultTo(0)

      /**
       * Valores de referencia de RTM (solo filas de META MENSUAL):
       */
      table.decimal('valor_rtm_moto', 12, 2).notNullable().defaultTo(0)
      table.decimal('valor_rtm_vehiculo', 12, 2).notNullable().defaultTo(0)

      /**
       * PORCENTAJE_COMISION_META:
       *  - % de comisión sobre la facturación RTM del mes cuando se cumple la meta.
       */
      table.decimal('porcentaje_comision_meta', 5, 2).notNullable().defaultTo(0)

      /**
       * Estado de la comisión:
       */
      table
        .enu('estado', ['PENDIENTE', 'APROBADA', 'PAGADA', 'ANULADA'], {
          useNative: true,
          enumName: 'comision_estado_enum',
        })
        .notNullable()
        .defaultTo('PENDIENTE')

      /**
       * es_config:
       *  - false => comisión real generada
       *  - true  => fila de configuración (reglas/metas)
       */
      table.boolean('es_config').notNullable().defaultTo(false)

      /**
       * Fecha en la que se calculó la comisión / se creó la regla.
       */
      table.dateTime('fecha_calculo', { precision: 0 }).notNullable().defaultTo(this.now())

      table
        .integer('calculado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      /** ⏱️ Timestamps */
      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(this.now())

      /* ===== Índices ===== */
      table.index(['asesor_id', 'estado'])
      table.index(['asesor_secundario_id']) // 👈 NUEVO
      table.index(['tipo_servicio', 'estado'])
      table.index(['fecha_calculo'])
      table.index(['es_config'])
      table.index(['tipo_vehiculo', 'es_config'])
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
