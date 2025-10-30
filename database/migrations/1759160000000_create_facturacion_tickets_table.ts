// database/migrations/xxxx_create_facturacion_tickets.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateFacturacionTickets extends BaseSchema {
  protected tableName = 'facturacion_tickets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Evidencia / archivo
      table.string('hash', 128).notNullable().unique()
      table.string('file_path', 512).notNullable()
      table.string('file_mime', 64).nullable()
      table.integer('file_size').unsigned().nullable()
      table.integer('image_rotation').unsigned().notNullable().defaultTo(0)

      // Estado del flujo
      table
        .enu('estado', ['BORRADOR', 'OCR_LISTO', 'LISTA_CONFIRMAR', 'CONFIRMADA', 'REVERTIDA'], {
          useNative: true,
          enumName: 'fact_ticket_estado_enum',
        })
        .notNullable()
        .defaultTo('BORRADOR')

      // A. Datos mínimos para comisión
      table.string('placa', 12).nullable().index()
      table.decimal('total', 14, 2).nullable().index()
      table.dateTime('fecha_pago', { useTz: true }).nullable().index()

      // Totales explícitos
      table.decimal('subtotal', 14, 2).nullable()
      table.decimal('iva', 14, 2).nullable()
      table.decimal('total_factura', 14, 2).nullable()

      // Datos OCR adicionales
      table.string('nit', 40).nullable()
      table.string('pin', 60).nullable()
      table.string('marca', 120).nullable()
      table.string('vendedor_text', 180).nullable()

      // Detalle de pago (si luego usas MIXTO)
      table.decimal('pago_consignacion', 14, 2).nullable()
      table.decimal('pago_tarjeta', 14, 2).nullable()
      table.decimal('pago_efectivo', 14, 2).nullable()
      table.decimal('pago_cambio', 14, 2).nullable()

      // Relaciones (visibles en tarjeta / comisiones)
      table
        .integer('agente_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agentes_captacions')
        .onDelete('SET NULL')
        .index()

      table
        .integer('sede_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('sedes')
        .onDelete('SET NULL')
        .index()

      table
        .integer('turno_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turnos_rtms')
        .onDelete('SET NULL')
        .index()

      table
        .integer('dateo_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('captacion_dateos')
        .onDelete('SET NULL')
        .index()

      table
        .integer('servicio_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('servicios')
        .onDelete('SET NULL')
        .index()

      // B. Comprobante (opcionales)
      table.string('prefijo', 20).nullable()
      table.string('consecutivo', 30).nullable()
      table
        .enu('forma_pago', ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'MIXTO'], {
          useNative: true,
          enumName: 'fact_forma_pago_enum',
        })
        .nullable()

      // C. Cliente / Vehículo (enriquecimiento)
      table
        .enu('doc_tipo', ['CC', 'NIT'], {
          useNative: true,
          enumName: 'fact_doc_tipo_enum',
        })
        .nullable()
      table.string('doc_numero', 40).nullable()
      table.string('nombre', 180).nullable()
      table.string('telefono', 40).nullable()
      table.text('observaciones').nullable()

      table
        .integer('cliente_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('clientes')
        .onDelete('SET NULL')

      table
        .integer('vehiculo_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('vehiculos')
        .onDelete('SET NULL')

      // OCR
      table.text('ocr_text').nullable()
      table.float('ocr_conf_placa').notNullable().defaultTo(0)
      table.float('ocr_conf_total').notNullable().defaultTo(0)
      table.float('ocr_conf_fecha').notNullable().defaultTo(0)
      table.float('ocr_conf_agente').notNullable().defaultTo(0)
      table.boolean('ocr_conf_baja_revisado').notNullable().defaultTo(false)

      // Duplicados
      table.boolean('duplicado_por_hash').notNullable().defaultTo(false)
      table.boolean('duplicado_por_contenido').notNullable().defaultTo(false)
      table.dateTime('posible_duplicado_at', { useTz: true }).nullable()

      // Confirmación / Reversión
      table.dateTime('confirmado_at', { useTz: true }).nullable()

      // ⬅️ NUEVO: quién confirmó
      table
        .integer('confirmed_by_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')
        .index()

      table.boolean('ajuste_total_flag').notNullable().defaultTo(false)
      table.decimal('ajuste_total_diff', 14, 2).notNullable().defaultTo(0)
      table.boolean('revertida_flag').notNullable().defaultTo(false)
      table.string('revertida_motivo', 180).nullable()
      table.dateTime('revertida_at', { useTz: true }).nullable()

      // Auditoría (quién creó el ticket)
      table
        .integer('created_by_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')
        .index()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Índices útiles
      table.index(['placa', 'total', 'fecha_pago'], 'idx_fact_placa_total_fecha')
      table.index(['prefijo', 'consecutivo'])
      table.index(['estado'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
    // this.schema.raw('DROP TYPE IF EXISTS fact_ticket_estado_enum')
    // this.schema.raw('DROP TYPE IF EXISTS fact_forma_pago_enum')
    // this.schema.raw('DROP TYPE IF EXISTS fact_doc_tipo_enum')
  }
}
