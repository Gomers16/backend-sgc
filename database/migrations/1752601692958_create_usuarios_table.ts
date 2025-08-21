import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Relaciones existentes
      table
        .integer('razon_social_id')
        .unsigned()
        .references('id')
        .inTable('razon_social')
        .onDelete('CASCADE')

      table.integer('rol_id').unsigned().references('id').inTable('roles').onDelete('SET NULL')

      // Opcionales
      table.integer('sede_id').unsigned().references('id').inTable('sedes').onDelete('RESTRICT')
      table.integer('cargo_id').unsigned().references('id').inTable('cargos').onDelete('RESTRICT')

      // Afiliaciones (FKs a entidades_salud)
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

      // ===== Archivos por afiliación (1 archivo por tipo) =====
      // EPS
      table.string('eps_doc_path', 255).nullable()
      table.string('eps_doc_nombre', 255).nullable()
      table.string('eps_doc_mime', 100).nullable()
      table.bigInteger('eps_doc_size').nullable()

      // ARL
      table.string('arl_doc_path', 255).nullable()
      table.string('arl_doc_nombre', 255).nullable()
      table.string('arl_doc_mime', 100).nullable()
      table.bigInteger('arl_doc_size').nullable()

      // AFP
      table.string('afp_doc_path', 255).nullable()
      table.string('afp_doc_nombre', 255).nullable()
      table.string('afp_doc_mime', 100).nullable()
      table.bigInteger('afp_doc_size').nullable()

      // AFC
      table.string('afc_doc_path', 255).nullable()
      table.string('afc_doc_nombre', 255).nullable()
      table.string('afc_doc_mime', 100).nullable()
      table.bigInteger('afc_doc_size').nullable()

      // CCF
      table.string('ccf_doc_path', 255).nullable()
      table.string('ccf_doc_nombre', 255).nullable()
      table.string('ccf_doc_mime', 100).nullable()
      table.bigInteger('ccf_doc_size').nullable()

      // ===== Recomendaciones médicas (texto + 1 archivo soporte opcional) =====
      table.text('recomendacion_medica').nullable()
      table.string('reco_med_doc_path', 255).nullable()
      table.string('reco_med_doc_nombre', 255).nullable()
      table.string('reco_med_doc_mime', 100).nullable()
      table.bigInteger('reco_med_doc_size').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
