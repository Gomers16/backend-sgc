import { BaseSeeder } from '@adonisjs/lucid/seeders'
import EntidadSalud from '#models/entidad_salud'

export default class EntidadSaludSeeder extends BaseSeeder {
  public async run() {
    await EntidadSalud.createMany([
      { id: 1, nombre: 'Sura', tipo: 'eps' },
      { id: 2, nombre: 'Nueva EPS', tipo: 'eps' },
      { id: 3, nombre: 'Colpatria', tipo: 'arl' },
      { id: 4, nombre: 'AXA Colpatria', tipo: 'arl' },
      { id: 5, nombre: 'Protección', tipo: 'afp' },
      { id: 6, nombre: 'Porvenir', tipo: 'afp' },
      { id: 7, nombre: 'Bancolombia AFC', tipo: 'afc' },
      { id: 8, nombre: 'Davivienda AFC', tipo: 'afc' },
      { id: 9, nombre: 'Comfandi', tipo: 'ccf' },
      { id: 10, nombre: 'Compensar', tipo: 'ccf' },
    ])
  }
}
