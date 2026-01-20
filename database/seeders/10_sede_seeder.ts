// database/seeders/10_sede_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'
import Sede from '#models/sede'

export default class SedeSeeder extends BaseSeeder {
  public async run() {
    // 🔄 PASO 1: Actualizar usuarios que usan sedes 3 y 4 para que usen Bogotá (2)
    await Database.from('usuarios').whereIn('sede_id', [3, 4]).update({ sede_id: 2 })

    console.log('🔄 Usuarios reasignados a Bogotá')

    // 🔥 PASO 2: AHORA SÍ podemos eliminar
    await Database.from('sedes').delete()

    console.log('🗑️  Sedes anteriores eliminadas')

    // ✅ PASO 3: CREAR SEDES LIMPIAS
    await Sede.createMany([
      {
        nombre: 'Ibagué',
        ciudadId: 1,
        direccion: null,
        timezone: 'America/Bogota',
        activo: true,
      },
      {
        nombre: 'Bogotá',
        ciudadId: 2,
        direccion: null,
        timezone: 'America/Bogota',
        activo: true,
      },
    ])

    console.log('✅ Sedes creadas: Ibagué, Bogotá')
  }
}
