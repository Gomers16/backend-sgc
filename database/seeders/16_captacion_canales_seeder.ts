// database/seeders/captacion_canales_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CaptacionCanal from '#models/captacion_canal'

export default class CaptacionCanalesSeeder extends BaseSeeder {
  public async run() {
    const rows = [
      {
        codigo: 'FACHADA',
        nombre: 'Fachada',
        descripcion: 'Ingreso por puerta / mostrador',
        colorHex: '#F59E0B', // naranja
        orden: 1,
        activo: true,
      },
      {
        codigo: 'ASESOR',
        nombre: 'Asesor',
        descripcion: 'Captación por asesor (interno o externo)',
        colorHex: '#10B981', // verde
        orden: 2,
        activo: true,
      },
      {
        codigo: 'TELEMERCADEO',
        nombre: 'Telemercadeo',
        descripcion: 'Llamadas / call center',
        colorHex: '#6366F1', // índigo
        orden: 3,
        activo: true,
      },
      {
        codigo: 'REDES',
        nombre: 'Redes Sociales',
        descripcion: 'Leads desde redes sociales',
        colorHex: '#8B5CF6', // púrpura
        orden: 4,
        activo: true,
      },
    ]

    for (const row of rows) {
      await CaptacionCanal.updateOrCreate({ codigo: row.codigo }, row)
    }
  }
}
