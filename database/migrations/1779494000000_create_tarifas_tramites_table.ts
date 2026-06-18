import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTarifasTramites extends BaseSchema {
  protected tableName = 'tarifas_tramites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('tipo_tramite', 50).notNullable()
      table.string('clase_vehiculo', 50).nullable()
      table.decimal('valor', 12, 2).notNullable()
      table.date('vigencia_desde').notNullable()
      table.string('descripcion', 200).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      table.index(['tipo_tramite', 'clase_vehiculo'], 'idx_tarifas_tipo_clase')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
