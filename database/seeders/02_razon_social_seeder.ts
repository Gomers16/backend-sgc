import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RazonSocial from '#models/razon_social'

export default class RazonSocialSeeder extends BaseSeeder {
  public async run() {
    await RazonSocial.createMany([
      { id: 1, nombre: 'CDA del Centro' },
      { id: 2, nombre: 'Activautos Centro de Diagnóstico' },
      { id: 3, nombre: 'JEF & CO' },
      { id: 4, nombre: 'Activa Marketing' },
    ])
  }
}
