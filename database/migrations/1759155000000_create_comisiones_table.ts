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
        .notNullable()
        .references('id')
        .inTable('captacion_dateos')
        .onDelete('CASCADE')

      table
        .integer('asesor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('RESTRICT')

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

      table.decimal('base', 12, 2).notNullable().defaultTo(0)
      table.decimal('porcentaje', 5, 2).notNullable().defaultTo(0)
      table.decimal('monto', 12, 2).notNullable().defaultTo(0)

      table
        .enu('estado', ['PENDIENTE', 'APROBADA', 'PAGADA', 'ANULADA'], {
          useNative: true,
          enumName: 'comision_estado_enum',
        })
        .notNullable()
        .defaultTo('PENDIENTE')

      table.dateTime('fecha_calculo', { precision: 0 }).notNullable().defaultTo(this.now())

      table
        .integer('calculado_por')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.index(['asesor_id', 'estado'])
      table.index(['tipo_servicio', 'estado'])
      table.index(['fecha_calculo'])
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
