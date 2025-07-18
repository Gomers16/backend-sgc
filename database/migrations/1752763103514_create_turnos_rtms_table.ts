import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'turnos_rtm'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('funcionario_id')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table.date('fecha').notNullable()
      table.string('hora_ingreso').notNullable()
      table.string('hora_salida').nullable()
      table.string('tiempo_servicio').nullable()

      table.integer('turno_numero').notNullable()
      table.string('turno_codigo').notNullable().unique()

      table.string('placa').notNullable()
      table.enum('tipo_vehiculo', ['vehiculo', 'moto']).notNullable()
      table.boolean('tiene_cita').defaultTo(false).notNullable()

      table.string('convenio').nullable()
      table.string('referido_interno').nullable()
      table.string('referido_externo').nullable()
      table.enum('medio_entero', ['fachada', 'redes', 'telemercadeo', 'otros']).notNullable()
      table.text('observaciones').nullable()

      // Campo nuevo: estado del turno
      table.enum('estado', ['activo', 'inactivo', 'cancelado']).notNullable().defaultTo('activo')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
