// database/migrations/1769270000000_create_configuracion_recurrencia_global_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ConfiguracionRecurrenciaGlobals extends BaseSchema {
  protected tableName = 'configuracion_recurrencia_global'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Meses mínimos desde última visita para considerar RECURRENTE
       * Si mesesTranscurridos < mesesMinimos → RECURRENTE (vino reciente)
       * Si mesesTranscurridos >= mesesMinimos → RECUPERACIÓN (volvió después de mucho tiempo)
       * Por defecto: 24
       */
      table.integer('meses_minimos').unsigned().notNullable().defaultTo(24)

      /**
       * 🔄 Comisión BASE por dateo RECURRENTE — fallback si no hay valor por tipo vehículo
       * Por defecto: $4,300
       */
      table.decimal('valor_dateo_recurrencia', 12, 2).notNullable().defaultTo(4300)

      /**
       * 💛 Comisión BASE por dateo RECUPERACIÓN — fallback si no hay valor por tipo vehículo
       * Por defecto: $8,600
       */
      table.decimal('valor_dateo_recuperacion', 12, 2).notNullable().defaultTo(8600)

      /**
       * 🔄 Comisión recurrente específica para VEHÍCULO LIVIANO
       * Si null → usa valor_dateo_recurrencia como fallback
       */
      table
        .decimal('valor_dateo_recurrencia_vehiculo', 12, 2)
        .nullable()
        .comment('Recurrente para vehículo liviano. Si null usa valor_dateo_recurrencia')

      /**
       * 🔄 Comisión recurrente específica para MOTO
       * Si null → usa valor_dateo_recurrencia como fallback
       */
      table
        .decimal('valor_dateo_recurrencia_moto', 12, 2)
        .nullable()
        .comment('Recurrente para moto. Si null usa valor_dateo_recurrencia')

      /**
       * 💛 Comisión recuperación específica para VEHÍCULO LIVIANO
       * Si null → usa valor_dateo_recuperacion como fallback
       */
      table
        .decimal('valor_dateo_recuperacion_vehiculo', 12, 2)
        .nullable()
        .comment('Recuperación para vehículo liviano. Si null usa valor_dateo_recuperacion')

      /**
       * 💛 Comisión recuperación específica para MOTO
       * Si null → usa valor_dateo_recuperacion como fallback
       */
      table
        .decimal('valor_dateo_recuperacion_moto', 12, 2)
        .nullable()
        .comment('Recuperación para moto. Si null usa valor_dateo_recuperacion')

      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(this.now())
    })

    // Registro inicial con valores por defecto
    await this.db.table(this.tableName).insert({
      meses_minimos: 24,
      valor_dateo_recurrencia: 4300,
      valor_dateo_recuperacion: 8600,
      valor_dateo_recurrencia_vehiculo: null,
      valor_dateo_recurrencia_moto: null,
      valor_dateo_recuperacion_vehiculo: null,
      valor_dateo_recuperacion_moto: null,
      created_at: this.now(),
      updated_at: this.now(),
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
