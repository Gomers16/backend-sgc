// database/migrations/1769270000000_create_configuracion_recurrencia_global_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ConfiguracionRecurrenciaGlobals extends BaseSchema {
  protected tableName = 'configuracion_recurrencia_global'

  public async up() {
    // 👇 Eliminar si existe (desarrollo)
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Meses mínimos desde última visita para considerar recurrencia
       * Por defecto: 24 meses
       */
      table.integer('meses_minimos').unsigned().notNullable().defaultTo(24)

      /**
       * Valor de comisión por dateo cuando hay recurrencia
       * Por defecto: 4300
       */
      table.decimal('valor_dateo_recurrencia', 12, 2).notNullable().defaultTo(4300)

      /** ⏱️ Timestamps */
      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(this.now())
    })

    // 🎯 Crear registro por defecto
    await this.db.table(this.tableName).insert({
      meses_minimos: 24,
      valor_dateo_recurrencia: 4300,
      created_at: this.now(),
      updated_at: this.now(),
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
