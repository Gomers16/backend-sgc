// database/migrations/1774100000000_create_comprobantes_pago_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comprobantes_pago'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('periodo_desde').nullable()
      table.date('periodo_hasta').nullable()
      table.enu('beneficiario_tipo', ['CONVENIO', 'ASESOR']).notNullable()
      table.integer('beneficiario_id').unsigned().nullable()
      table.string('beneficiario_nombre').notNullable()
      table.string('medio_pago').nullable()
      table.string('telefono').nullable()
      table.integer('total_motos').unsigned().notNullable().defaultTo(0)
      table.integer('total_vehiculos').unsigned().notNullable().defaultTo(0)
      table.decimal('total_dateo', 14, 2).notNullable().defaultTo(0)
      table.decimal('total_incentivo', 14, 2).notNullable().defaultTo(0)
      table.decimal('total_general', 14, 2).notNullable().defaultTo(0)
      table.json('comision_ids').notNullable()
      table.text('placas_snapshot').nullable()
      table.string('filtro_estado', 20).nullable()
      table.string('filtro_tipo_vehiculo', 10).nullable()
      table.string('evidencia_url').nullable()
      table.integer('generado_por').unsigned().nullable()
      table.text('notas').nullable()
      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.index(['beneficiario_id', 'beneficiario_tipo'])
      table.index(['created_at'])
      table.index(['generado_por'])
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
