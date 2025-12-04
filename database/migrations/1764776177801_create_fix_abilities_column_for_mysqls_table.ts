// database/migrations/XXXX_fix_abilities_column_for_mysql.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FixAbilitiesColumnForMysql extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    // 🔥 PASO 1: Limpiar datos existentes problemáticos
    await this.db.rawQuery(
      `UPDATE ${this.tableName}
       SET abilities = '{}'
       WHERE abilities IS NULL
          OR abilities = ''
          OR abilities = 'null'
          OR TRIM(abilities) = ''`
    )

    // 🔥 PASO 2: Alterar la columna para que nunca sea NULL y tenga default
    this.schema.alterTable(this.tableName, (table) => {
      table.text('abilities').notNullable().defaultTo('{}').alter()
    })

    // 🔥 PASO 3: Crear un índice para mejorar performance (opcional)
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['tokenable_id', 'tokenable_type'], 'idx_tokenable')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex([], 'idx_tokenable')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.text('abilities').nullable().alter()
    })
  }
}
