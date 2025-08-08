import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contratos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Elimina la columna 'salario' que ahora será manejada en la tabla `contratos_salarios`
      // Esto es correcto si tu modelo Contrato ya no tiene la columna 'salario'
      table.dropColumn('salario')

      // ✅ Eliminada la línea que duplicaba 'termino_contrato'
      // table.enum('termino_contrato', ['fijo', 'obra_o_labor', 'indefinido']).nullable()

      // Modifica la columna 'tipo_contrato' para ser más específica
      // Asegúrate de que los valores del enum coincidan con los que usas en tu aplicación
      table.enum('tipo_contrato', ['laboral', 'temporal', 'prestacion']).notNullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Revierte los cambios
      // Si 'termino_contrato' no fue añadido por esta migración, no debería ser eliminado aquí.
      // Si la columna 'salario' fue eliminada en 'up', debe restaurarse aquí.
      // Si 'tipo_contrato' fue alterado, debe revertirse a su estado anterior.

      // Si 'termino_contrato' se añadió en la migración de create_table, no lo elimines aquí.
      // table.dropColumn('termino_contrato') // <-- Comentada, ya que se asume que se creó en la migración inicial

      // Restaura la columna 'salario' si fue eliminada en 'up'
      table.decimal('salario', 15, 2).nullable()

      // Restaura el tipo de 'tipo_contrato' a su estado anterior si fue alterado
      table.string('tipo_contrato', 50).notNullable().alter()
    })
  }
}
