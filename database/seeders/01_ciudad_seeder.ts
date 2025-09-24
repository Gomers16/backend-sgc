import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Ciudad from '#models/ciudad'

export default class CiudadSeeder extends BaseSeeder {
  public async run() {
    await Ciudad.updateOrCreateMany('id', [
      { id: 1, nombre: 'Ibagué', departamento: 'Tolima', activo: true },
      { id: 2, nombre: 'Bogotá D.C.', departamento: 'Bogotá D.C.', activo: true },
    ])
  }
}
