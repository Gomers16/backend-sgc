import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'turnos_rtm'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // 'table' sin anotación explícita de tipo. TypeScript debería inferirlo correctamente.
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
      // ACTUALIZADO: 'tipo_vehiculo' con los nuevos valores ['carro', 'moto', 'taxi', 'enseñanza']
      table.enum('tipo_vehiculo', ['carro', 'moto', 'taxi', 'enseñanza']).notNullable()
      table.boolean('tiene_cita').defaultTo(false).notNullable()

      table.string('convenio').nullable()
      table.string('referido_interno').nullable()
      table.string('referido_externo').nullable()

      // ACTUALIZADO: 'medio_entero' con los valores de las imágenes
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

      // Campo nuevo: asesor_comercial
      table.string('asesor_comercial').nullable() // Puede ser nulo

      // ACTUALIZADO: 'estado' del turno con 'finalizado'
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
