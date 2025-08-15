import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contratos'

  public async up () {
    // 👇 NO eliminamos salario; lo reafirmamos como NOT NULL (opcional, pero explícito)
    await this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      MODIFY COLUMN \`salario\` DECIMAL(15,2) NOT NULL
    `)

    // Mantener el ENUM con 'aprendizaje'
    await this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      MODIFY COLUMN \`tipo_contrato\`
      ENUM('prestacion','temporal','laboral','aprendizaje') NOT NULL
    `)
  }

  public async down () {
    // Dejamos el ENUM igual que en la creación (incluye 'aprendizaje')
    await this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      MODIFY COLUMN \`tipo_contrato\`
      ENUM('prestacion','temporal','laboral','aprendizaje') NOT NULL
    `)

    // Reafirmamos también salario como NOT NULL
    await this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      MODIFY COLUMN \`salario\` DECIMAL(15,2) NOT NULL
    `)
  }
}
