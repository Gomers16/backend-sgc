// database/migrations/1769270000001_create_configuracion_recurrencia_asesores_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ConfiguracionRecurrenciaAsesores extends BaseSchema {
  protected tableName = 'configuracion_recurrencia_asesores'

  public async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Asesor al que aplica esta configuración
       */
      table
        .integer('asesor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('CASCADE')

      /**
       * ¿Está habilitada la recurrencia para este asesor?
       */
      table.boolean('recurrencia_habilitada').notNullable().defaultTo(false)

      /**
       * Meses mínimos personalizados (NULL = usa global)
       */
      table.integer('meses_minimos').unsigned().nullable()

      /**
       * 🔄 Valor personalizado de dateo RECURRENTE para este asesor
       * (vino hace MENOS de mesesMinimos)
       * NULL = usa el valor global
       */
      table.decimal('valor_dateo_recurrencia', 12, 2).nullable()

      /**
       * 💛 Valor personalizado de dateo RECUPERACIÓN para este asesor
       * (vino hace MÁS de mesesMinimos — regresó después de mucho tiempo)
       * NULL = usa el valor global
       */
      table.decimal('valor_dateo_recuperacion', 12, 2).nullable()

      /**
       * Tipo de vehículo al que aplica
       */
      table
        .enu('tipo_vehiculo', ['MOTO', 'VEHICULO', 'AMBOS'], {
          useNative: true,
          enumName: 'recurrencia_tipo_vehiculo_enum',
        })
        .notNullable()
        .defaultTo('AMBOS')

      /** ⏱️ Timestamps */
      table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(this.now())

      /* ===== Índices ===== */
      table.index(['asesor_id'])
      table.index(['recurrencia_habilitada'])
      table.unique(['asesor_id', 'tipo_vehiculo'], 'cfg_recur_asesor_unique')
    })
  }

  public async down() {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
