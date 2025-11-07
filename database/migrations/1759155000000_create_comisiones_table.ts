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
       * Si es una FILA DE CONFIGURACIÓN (regla estándar / por asesor):
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
       * Asesor:
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
       * Para filas de configuración se puede dejar en 'OTRO' si quieres usarlo.
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
       *
       * Para comisiones generadas, puedes rellenarlo o dejarlo NULL y deducirlo
       * desde el turno/vehículo cuando calcules.
       */
      table
        .enu('tipo_vehiculo', ['MOTO', 'VEHICULO'], {
          useNative: true,
          enumName: 'comision_tipo_vehiculo_enum',
        })
        .nullable()

      /**
       * BASE:
       *  - Para comisiones generadas: base de comisión por placa/cliente/convenio.
       *  - Para filas de configuración: valor estándar de comisión por placa para esa regla.
       */
      table.decimal('base', 12, 2).notNullable().defaultTo(0)

      /**
       * PORCENTAJE:
       *  - Lo puedes usar si en algún caso quieres manejar % sobre base.
       *  - En muchos casos quedará en 0.
       */
      table.decimal('porcentaje', 5, 2).notNullable().defaultTo(0)

      /**
       * MONTO:
       *  - Para comisiones generadas: comisión del ASESOR (dateo) ya calculada.
       *  - Para filas de configuración: valor estándar de comisión por dateo para esa regla.
       */
      table.decimal('monto', 12, 2).notNullable().defaultTo(0)

      /**
       * Estado de la comisión:
       *  - En comisiones generadas: flujo normal (PENDIENTE/APROBADA/PAGADA/ANULADA).
       *  - En filas de configuración: puedes dejar siempre en 'PENDIENTE' o ignorarlo,
       *    el flag es_config es el que manda.
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
       *  - false => fila corresponde a una comisión generada real (lo que ya usas hoy).
       *  - true  => fila es una REGLA de configuración (global o por asesor + tipo_vehiculo).
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

      /** ⏱️ Timestamps que espera el modelo (createdAt / updatedAt) */
      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(this.now())

      /* ===== Índices ===== */
      table.index(['asesor_id', 'estado'])
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
