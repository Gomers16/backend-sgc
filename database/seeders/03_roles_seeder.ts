import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Rol from '#models/rol'

export default class RolSeeder extends BaseSeeder {
  public async run() {
    await Rol.createMany([
      { id: 1, nombre: 'admin' },
      { id: 2, nombre: 'rrhh' },
      { id: 3, nombre: 'tecnico' },
      { id: 4, nombre: 'operador' },
    ])
  }
}
