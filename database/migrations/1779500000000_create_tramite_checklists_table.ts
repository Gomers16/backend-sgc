import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTramiteChecklistsTable extends BaseSchema {
  protected tableName = 'tramite_checklists'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('sede_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('sedes')
        .onDelete('RESTRICT')

      table.date('fecha').notNullable()
      table.integer('turno_numero').notNullable()

      // ── Documentos
      table.boolean('tarjeta_propiedad').nullable().defaultTo(false)
      table.boolean('soat').nullable().defaultTo(false)
      table.boolean('runt_vendedor').nullable().defaultTo(false)
      table.boolean('runt_comprador').nullable().defaultTo(false)
      table.boolean('antecedentes_comprador').nullable().defaultTo(false)
      table.boolean('antecedentes_vendedor').nullable().defaultTo(false)
      table.boolean('levanta_prenda_original').nullable().defaultTo(false)
      table.boolean('inscribe_prenda_original').nullable().defaultTo(false)
      table.boolean('camara_comercio').nullable().defaultTo(false)
      table.boolean('certificado_impuestos').nullable().defaultTo(false)
      table.boolean('declaracion_extrajuicio').nullable().defaultTo(false)
      table.boolean('paz_salvo_empresa').nullable().defaultTo(false)
      table.boolean('cesion_derecho_empresa').nullable().defaultTo(false)

      table.text('observaciones').nullable()

      // ── Un solo checklist por turno
      table.unique(['sede_id', 'fecha', 'turno_numero'], {
        indexName: 'uq_tramite_checklists_sede_fecha_turno',
      })

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
