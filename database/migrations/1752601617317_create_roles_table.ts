import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    const exists = await this.schema.hasTable(this.tableName)

    if (!exists) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.string('nombre', 100).notNullable().unique() // 👉 Campo nombre obligatorio y único
        table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
        table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      })
    }
  }

  async down() {
    const exists = await this.schema.hasTable(this.tableName)

    if (exists) {
      this.schema.dropTable(this.tableName)
    }
  }
}
