// database/migrations/xxxx_create_vehiculos.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehiculos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // PK
      table.string('placa', 12).notNullable().unique() // UPPER, sin espacios/guiones

      table
        .integer('clase_vehiculo_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clases_vehiculos')
        .onDelete('RESTRICT') // no borrar clase si hay vehículos

      table.string('marca', 60).nullable()
      table.string('linea', 80).nullable()
      table.integer('modelo').nullable()

      // 🆕 Ampliado de 40 a 100: el TECNOBASE tiene colores largos
      table.string('color', 100).nullable()

      // número de matrícula / tarjeta de propiedad
      table.string('matricula', 50).nullable()

      table
        .integer('cliente_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('clientes')
        .onDelete('SET NULL') // si borran cliente, no borra vehículo

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['clase_vehiculo_id'])
      table.index(['cliente_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
