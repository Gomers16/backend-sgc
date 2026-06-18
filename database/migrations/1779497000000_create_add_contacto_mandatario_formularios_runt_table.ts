import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddContactoMandatarioFormulariosRunt extends BaseSchema {
  protected tableName = 'formularios_runt'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('prop_correo', 150).nullable()
      table.string('comp_correo', 150).nullable()
      table.integer('puertas').unsigned().nullable()
      table.string('mandatario_nombre', 150).nullable()
      table.string('mandatario_documento', 30).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('prop_correo')
      table.dropColumn('comp_correo')
      table.dropColumn('puertas')
      table.dropColumn('mandatario_nombre')
      table.dropColumn('mandatario_documento')
    })
  }
}
