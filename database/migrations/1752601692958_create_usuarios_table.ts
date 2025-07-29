import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // ❌ ELIMINA ESTA LÍNEA:
      // table.string('auth_id', 255).unique().nullable() // o .notNullable() si es siempre requerido

      // Relaciones existentes
      table
        .integer('razon_social_id')
        .unsigned()
        .references('id')
        .inTable('razon_social')
        .onDelete('CASCADE')

      table.integer('rol_id').unsigned().references('id').inTable('roles').onDelete('SET NULL')

      // Clave foránea para la tabla 'sedes'
      table
        .integer('sede_id')
        .unsigned()
        .references('id')
        .inTable('sedes')
        .onDelete('RESTRICT')
        .notNullable()

      // *** NUEVA RELACIÓN: La clave foránea para la tabla 'cargos' ***
      table
        .integer('cargo_id')
        .unsigned()
        .references('id')
        .inTable('cargos')
        .onDelete('RESTRICT')
        .notNullable()

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
      table.string('password').notNullable()
      table.string('foto_perfil').nullable()

      table.string('direccion', 150).nullable()
      table.string('celular_personal', 50).nullable()
      table.string('celular_corporativo', 50).nullable()

      table.string('centro_costo', 100).nullable()

      table.enum('estado', ['activo', 'inactivo']).defaultTo('activo').notNullable()
      table.boolean('recomendaciones').defaultTo(false).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      // ✅ AÑADIDA: Columna para Soft Deletes (esta sí la dejas)
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
