// database/seeders/razon_social_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RazonSocial from '#models/razon_social'

export default class RazonSocialSeeder extends BaseSeeder {
  public async run() {
    // Usa 'id' como clave única para mantener IDs fijos
    await RazonSocial.updateOrCreateMany('id', [
      { id: 1, nit: '900123456-7', nombre: 'CDA del Centro', activo: true },
      { id: 2, nit: '901234567-8', nombre: 'CDA Activa', activo: true }, // antes: Activautos Centro de Diagnóstico
      { id: 3, nit: '902345678-9', nombre: 'JEF & CO', activo: true },
      { id: 4, nit: '903456789-0', nombre: 'Activa Marketing', activo: true },
    ])
  }
}
