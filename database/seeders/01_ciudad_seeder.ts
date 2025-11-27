// database/seeders/ciudad_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Ciudad from '#models/ciudad'

export default class CiudadSeeder extends BaseSeeder {
  public async run() {
    // 🔥 IMPORTANTE: Usar 'nombre' como unique key (no 'id')
    // Esto evita duplicados si el seeder se ejecuta múltiples veces
    await Ciudad.updateOrCreateMany('nombre', [
      {
        nombre: 'Ibagué',
        departamento: 'Tolima',
        activo: true,
      },
      {
        nombre: 'Bogotá D.C.',
        departamento: 'Cundinamarca ',
        activo: true,
      },
    ])

    console.log('✅ Ciudades sincronizadas (sin duplicados)')
  }
}
