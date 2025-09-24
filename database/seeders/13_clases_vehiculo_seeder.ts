// database/seeders/clases_vehiculo_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClaseVehiculo from '#models/clase_vehiculos'

export default class ClasesVehiculoSeeder extends BaseSeeder {
  public async run() {
    const rows = [
      { codigo: 'LIV_PART', nombre: 'Liviano Particular' },
      { codigo: 'LIV_TAXI', nombre: 'Liviano Taxi' },
      { codigo: 'LIV_PUBLICO', nombre: 'Liviano Público' },
      { codigo: 'MOTO', nombre: 'Motocicleta' },
    ]

    // Idempotente: crea o actualiza por 'codigo'
    for (const row of rows) {
      await ClaseVehiculo.updateOrCreate({ codigo: row.codigo }, row)
    }
  }
}
