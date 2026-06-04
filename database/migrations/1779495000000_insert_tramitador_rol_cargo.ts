import { BaseSchema } from '@adonisjs/lucid/schema'

export default class InsertTramitadorRolCargo extends BaseSchema {
  public async up() {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)

    const rolExiste = await this.db.from('roles').where('nombre', 'TRAMITADOR').first()
    if (!rolExiste) {
      await this.db.table('roles').insert({ nombre: 'TRAMITADOR', created_at: now, updated_at: now })
    }

    const cargoExiste = await this.db.from('cargos').where('nombre', 'TRAMITADOR').first()
    if (!cargoExiste) {
      await this.db.table('cargos').insert({ nombre: 'TRAMITADOR', created_at: now, updated_at: now })
    }
  }

  public async down() {
    await this.db.from('roles').where('nombre', 'TRAMITADOR').delete()
    await this.db.from('cargos').where('nombre', 'TRAMITADOR').delete()
  }
}
