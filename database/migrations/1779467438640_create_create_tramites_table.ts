// database/migrations/1760000000000_create_tramites_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Tramites extends BaseSchema {
  protected tableName = 'tramites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // ── FKs base
      table
        .integer('sede_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('sedes')
        .onDelete('RESTRICT')

      table
        .integer('funcionario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table
        .integer('servicio_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('servicios')
        .onDelete('RESTRICT')

      // ── Datos del solicitante
      table.string('nombre_cliente', 150).notNullable()
      table.string('cedula', 20).notNullable()
      table.string('telefono', 20).nullable()
      table.string('email', 150).nullable()

      // ── Turno / cola
      table.integer('turno_numero').notNullable() // consecutivo global del día por sede
      table.string('turno_codigo', 60).notNullable().unique()

      // ── Tipo de trámite (se puede llenar después)
      table
        .enu('tipo_tramite', [
          'LICENCIA_CONDUCCION',
          'DUPLICADO_LICENCIA',
          'TRASLADO_CUENTA',
          'CAMBIO_PROPIETARIO',
          'MATRICULA',
          'DESENGAJE',
          'REVISION_DOCUMENTAL',
          'OTRO',
        ])
        .nullable() // <-- nullable: se categoriza después desde TramitesView

      // ── Ciclo de vida
      table
        .enu('estado', ['en_espera', 'en_atencion', 'completado', 'cancelado'])
        .notNullable()
        .defaultTo('en_espera')

      // ── Tiempos
      table.date('fecha').notNullable()
      table.string('hora_ingreso', 8).notNullable()
      table.string('hora_atencion', 8).nullable() // cuando pasa a "en_atencion"
      table.string('hora_fin', 8).nullable() // cuando se completa/cancela
      table.string('tiempo_atencion', 30).nullable() // ej "12 min"

      // ── Notas
      table.text('observaciones').nullable()
      table.text('resultado').nullable() // lo que se resolvió

      // ── Índices
      table.index(['sede_id', 'fecha'], 'idx_tramites_sede_fecha')
      table.index(['cedula'], 'idx_tramites_cedula')
      table.index(['estado'], 'idx_tramites_estado')
      table.index(['tipo_tramite'], 'idx_tramites_tipo')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
