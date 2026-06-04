import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddRegrabadoFormulariosRunt extends BaseSchema {
  protected tableName = 'formularios_runt'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('motor_regrabado').nullable().defaultTo(false)
      table.boolean('chasis_regrabado').nullable().defaultTo(false)
      table.boolean('serie_regrabado').nullable().defaultTo(false)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('motor_regrabado')
      table.dropColumn('chasis_regrabado')
      table.dropColumn('serie_regrabado')
    })
  }
}
