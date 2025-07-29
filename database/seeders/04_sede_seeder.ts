import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Sede from '#models/sede' // ✅ CORREGIDO: Usando alias #models/

export default class SedeSeeder extends BaseSeeder {
  async run() {
    await Sede.createMany([
      { nombre: 'Bogotá' },
      { nombre: 'Ibagué' },
      { nombre: 'Cemoto' }, // Asegúrate de que este sea el nombre correcto
    ])
  }
}
