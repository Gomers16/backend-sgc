// database/migrations/xxxx_turnos_rtm.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TurnosRtm extends BaseSchema {
  protected tableName = 'turnos_rtm'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // 🔄 CAMBIO: ahora usamos funcionario_id
      table
        .integer('funcionario_id')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('sede_id')
        .unsigned()
        .references('id')
        .inTable('sedes')
        .onDelete('RESTRICT')
        .notNullable()

      table.date('fecha').notNullable()
      table.string('hora_ingreso').notNullable()
      table.string('hora_salida').nullable()
      table.string('tiempo_servicio').nullable()

      table.integer('turno_numero').notNullable()
      table.string('turno_codigo').notNullable().unique()

      table.string('placa').notNullable()

      table
        .enum('tipo_vehiculo', [
          'Liviano Particular',
          'Liviano Taxi',
          'Liviano Público',
          'Motocicleta',
        ])
        .notNullable()

      table.boolean('tiene_cita').defaultTo(false).notNullable()

      table.string('convenio').nullable()
      table.string('referido_interno').nullable()
      table.string('referido_externo').nullable()

      table
        .enum('medio_entero', [
          'Redes Sociales',
          'Convenio o Referido Externo',
          'Call Center',
          'Fachada',
          'Referido Interno',
          'Asesor Comercial',
        ])
        .notNullable()

      table.text('observaciones').nullable()
      table.string('asesor_comercial').nullable()

      table
        .enum('estado', ['activo', 'inactivo', 'cancelado', 'finalizado'])
        .notNullable()
        .defaultTo('activo')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
