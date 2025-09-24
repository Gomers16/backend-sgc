// database/migrations/1758650000000_create_turnos_rtms_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TurnosRtms extends BaseSchema {
  protected tableName = 'turnos_rtms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('funcionario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table
        .integer('sede_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('sedes')
        .onDelete('RESTRICT')

      table
        .integer('servicio_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('servicios')
        .onDelete('RESTRICT')

      table
        .integer('vehiculo_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('vehiculos')
        .onDelete('SET NULL')

      table
        .integer('cliente_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('clientes')
        .onDelete('SET NULL')

      table
        .integer('clase_vehiculo_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('clases_vehiculos')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      // Agente opcional
      table
        .integer('agente_captacion_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacion')
        .onDelete('SET NULL')

      // SIN FK (solo integer) para evitar ciclo con captacion_dateos
      table.integer('captacion_dateo_id').unsigned().nullable()

      table.date('fecha').notNullable()
      table.string('hora_ingreso').notNullable()
      table.string('hora_salida').nullable()
      table.string('tiempo_servicio').nullable()

      // Consecutivos
      table.integer('turno_numero').notNullable() // consecutivo global por sede+día
      table.integer('turno_numero_servicio').notNullable() // ✅ consecutivo por servicio (sede+día)

      table.string('turno_codigo').notNullable().unique()

      table.string('placa').notNullable()

      table
        .enu(
          'tipo_vehiculo',
          ['Liviano Particular', 'Liviano Taxi', 'Liviano Público', 'Motocicleta'],
          { useNative: true, enumName: 'tipo_vehiculo_enum' }
        )
        .notNullable()

      // Medio de captación “plano” (derivado del canal; se conserva por compat de esquema)
      table
        .enu('medio_entero', [
          'Redes Sociales',
          'Convenio o Referido Externo',
          'Call Center',
          'Fachada',
          'Referido Interno',
          'Asesor Comercial',
        ])
        .notNullable()

      // Observaciones del turno
      table.text('observaciones').nullable()

      // Canal final: FACHADA | ASESOR | TELE | REDES
      table
        .enu('canal_atribucion', ['FACHADA', 'ASESOR', 'TELE', 'REDES'])
        .notNullable()
        .defaultTo('FACHADA')

      table
        .enu('estado', ['activo', 'inactivo', 'cancelado', 'finalizado'])
        .notNullable()
        .defaultTo('activo')

      // Únicos
      table.unique(['sede_id', 'fecha', 'turno_numero'], 'uq_turno_por_dia_y_sede')
      table.unique(
        ['sede_id', 'fecha', 'servicio_id', 'turno_numero_servicio'],
        'uq_turno_por_servicio_dia_sede' // ✅ evita duplicados en el consecutivo por servicio
      )

      // Índices útiles
      table.index(['servicio_id'], 'idx_turno_servicio')
      table.index(['placa'], 'idx_turno_placa')
      table.index(['fecha', 'sede_id'], 'idx_turno_fecha_sede')
      table.index(['vehiculo_id'], 'idx_turno_vehiculo')
      table.index(['cliente_id'], 'idx_turno_cliente')
      table.index(['canal_atribucion'], 'idx_turno_canal')
      table.index(['captacion_dateo_id'], 'idx_turno_dateo')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
