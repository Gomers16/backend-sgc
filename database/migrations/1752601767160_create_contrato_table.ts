import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contratos'

  public async up () {
    // Idempotente: si quedó una tabla vieja, elimínala antes de crear
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Columnas sin claves foráneas
      table.string('identificacion', 255).notNullable()

      // ENUM con 'aprendizaje'
      table.enu('tipo_contrato', ['prestacion', 'temporal', 'laboral', 'aprendizaje']).notNullable()

      table.string('estado', 20).notNullable().defaultTo('activo') // 'activo', 'inactivo'
      table.date('fecha_inicio').notNullable()
      table.date('fecha_terminacion').nullable()
      table.text('funciones_cargo').nullable()

      // MANTENER salario aquí (NO quitar)
      table.decimal('salario', 15, 2).notNullable()

      // término de contrato
      table.string('termino_contrato', 50).nullable()

      table.integer('periodo_prueba').nullable()
      table.string('horario_trabajo').nullable()
      table.string('centro_costo').nullable()
      table.string('nombre_archivo_contrato_fisico', 255).nullable()
      table.string('ruta_archivo_contrato_fisico', 255).nullable()
      table.text('motivo_finalizacion').nullable()

      // Recomendaciones médicas
      table.boolean('tiene_recomendaciones_medicas').defaultTo(false)
      table.string('ruta_archivo_recomendacion_medica', 255).nullable()

      // Claves foráneas (IDs sin FK explícitas)
      table.integer('usuario_id').unsigned().notNullable()
      table.integer('sede_id').unsigned().notNullable()
      table.integer('razon_social_id').unsigned().notNullable()
      table.integer('cargo_id').unsigned().notNullable()
      table.integer('eps_id').unsigned().nullable()
      table.integer('arl_id').unsigned().nullable()
      table.integer('afp_id').unsigned().nullable()
      table.integer('afc_id').unsigned().nullable()
      table.integer('ccf_id').unsigned().nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    // Refuerzo: asegura el ENUM exacto en MySQL
    await this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      MODIFY COLUMN \`tipo_contrato\`
      ENUM('prestacion','temporal','laboral','aprendizaje') NOT NULL
    `)
  }

  public async down () {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
