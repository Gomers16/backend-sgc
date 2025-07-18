import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Relaciones
      table
        .integer('razon_social_id')
        .unsigned()
        .references('id')
        .inTable('razon_social')
        .onDelete('CASCADE')

      table.integer('rol_id').unsigned().references('id').inTable('roles').onDelete('SET NULL')

      table
        .integer('eps_id')
        .unsigned()
        .references('id')
        .inTable('entidades_salud')
        .onDelete('SET NULL')

      table
        .integer('arl_id')
        .unsigned()
        .references('id')
        .inTable('entidades_salud')
        .onDelete('SET NULL')

      table
        .integer('afp_id')
        .unsigned()
        .references('id')
        .inTable('entidades_salud')
        .onDelete('SET NULL')

      table
        .integer('afc_id')
        .unsigned()
        .references('id')
        .inTable('entidades_salud')
        .onDelete('SET NULL')

      table
        .integer('ccf_id')
        .unsigned()
        .references('id')
        .inTable('entidades_salud')
        .onDelete('SET NULL')

      // Datos personales y laborales
      table.string('nombres', 100).notNullable()
      table.string('apellidos', 100).notNullable()
      table.string('correo', 150).notNullable().unique()
      table.string('password').notNullable() // 👈 NUEVA COLUMNA
      table.string('foto_perfil')

      table.enum('sede', ['Bogotá', 'Ibagué']).notNullable()
      table.string('direccion', 150)
      table.string('celular_personal', 50)
      table.string('celular_corporativo', 50)

      table.string('area', 100)
      table.string('centro_costo', 100)

      table.enum('estado', ['activo', 'inactivo']).defaultTo('activo').notNullable()
      table.boolean('recomendaciones').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
