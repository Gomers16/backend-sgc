// database/seeders/razon_social_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RazonSocial from '#models/razon_social'

export default class RazonSocialSeeder extends BaseSeeder {
  public async run() {
    // Usa updateOrCreateMany para renombrar sin duplicar registros ya sembrados
    await RazonSocial.updateOrCreateMany('id', [
      { id: 1, nombre: 'CDA del Centro' },
      { id: 2, nombre: 'CDA Activa' }, // antes: Activautos Centro de Diagnóstico
      { id: 3, nombre: 'JEF & CO' },
      { id: 4, nombre: 'Activa Marketing' },
    ])
  }
}
