import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FormulariosRunt extends BaseSchema {
  protected tableName = 'formularios_runt'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // ── Relación 1-a-1 con tramites
      table
        .integer('tramite_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('tramites')
        .onDelete('CASCADE')

      // ── Datos del vehículo
      table.string('placa', 10).nullable()
      table.string('marca', 80).nullable()
      table.string('linea', 80).nullable()
      table.string('modelo', 4).nullable()
      table.string('color', 50).nullable()
      table
        .enu('clase_vehiculo', [
          'automovil',
          'bus',
          'buseta',
          'camion',
          'camioneta',
          'campero',
          'microbus',
          'tractocamion',
          'motocicleta',
          'motocarro',
          'mototriciciclo',
          'cuatrimoto',
          'volqueta',
          'otro',
        ])
        .nullable()
      table
        .enu('combustible', [
          'gasolina',
          'diesel',
          'gas',
          'electrico',
          'hibrido',
          'etanol',
          'biodiesel',
        ])
        .nullable()
      table.string('no_motor', 40).nullable()
      table.string('no_chasis', 40).nullable()
      table.string('no_serie', 40).nullable()
      table.string('no_vin', 20).nullable()
      table
        .enu('tipo_servicio', [
          'particular',
          'publico',
          'diplomatico',
          'oficial',
          'especial',
          'otros',
        ])
        .nullable()
      table.string('carroceria_codigo', 10).nullable()
      table.string('carroceria_tipo', 80).nullable()
      table.string('capacidad_kg', 20).nullable()
      table.boolean('blindaje').notNullable().defaultTo(false)
      table.string('potencia_hp', 20).nullable()
      table.string('cilindrada', 20).nullable()

      // ── Datos del propietario
      table.string('prop_primer_apellido', 60).nullable()
      table.string('prop_segundo_apellido', 60).nullable()
      table.string('prop_nombres', 120).nullable()
      table
        .enu('prop_tipo_documento', [
          'cc',
          'nit',
          'nn',
          'pasaporte',
          'c_extranjeria',
          't_identidad',
          'nuip',
          'c_diplomatico',
        ])
        .nullable()
      table.string('prop_no_documento', 30).nullable()
      table.string('prop_direccion', 150).nullable()
      table.string('prop_ciudad', 80).nullable()
      table.string('prop_telefono', 20).nullable()

      // ── Datos del comprador (solo traspaso)
      table.string('comp_primer_apellido', 60).nullable()
      table.string('comp_segundo_apellido', 60).nullable()
      table.string('comp_nombres', 120).nullable()
      table
        .enu('comp_tipo_documento', [
          'cc',
          'nit',
          'nn',
          'pasaporte',
          'c_extranjeria',
          't_identidad',
          'nuip',
          'c_diplomatico',
        ])
        .nullable()
      table.string('comp_no_documento', 30).nullable()
      table.string('comp_direccion', 150).nullable()
      table.string('comp_ciudad', 80).nullable()
      table.string('comp_telefono', 20).nullable()

      // ── Importación o remate
      table
        .enu('importacion_tipo', [
          'manif_o_acta',
          'dec_importacion',
          'acta',
          'entidad',
          'lugar',
          'codigo',
        ])
        .nullable()
      table.string('importacion_no_documento', 60).nullable()
      table.date('importacion_fecha').nullable()

      // ── Alertas
      table.boolean('alerta_hurto').notNullable().defaultTo(false)
      table.boolean('alerta_lim_propiedad').notNullable().defaultTo(false)
      table.boolean('alerta_embargo').notNullable().defaultTo(false)
      table.string('alerta_otro', 200).nullable()

      // ── Observaciones
      table.text('observaciones').nullable()

      // ── Índices de búsqueda frecuente
      table.index(['placa'], 'idx_frunt_placa')
      table.index(['prop_no_documento'], 'idx_frunt_prop_doc')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
