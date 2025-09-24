// database/seeders/sede_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Sede from '#models/sede'

export default class SedeSeeder extends BaseSeeder {
  public async run() {
    await Sede.updateOrCreateMany('id', [
      {
        id: 1,
        nombre: 'Bogotá',
        razonSocialId: 2, // CDA Activa
        ciudadId: 2, // Bogotá D.C.
        direccion: null,
        timezone: 'America/Bogota',
        activo: true,
      },
      {
        id: 2,
        nombre: 'Ibagué',
        razonSocialId: 1, // CDA del Centro
        ciudadId: 1, // Ibagué
        direccion: null,
        timezone: 'America/Bogota',
        activo: true,
      },
      {
        id: 3,
        nombre: 'Cemoto',
        razonSocialId: 3, // JEF & CO
        ciudadId: 2, // Bogotá D.C.
        direccion: null,
        timezone: 'America/Bogota',
        activo: true,
      },
      {
        id: 4,
        nombre: 'Activa Marketing', // 👈 nombre de la sede
        razonSocialId: 4, // 👈 Razón Social: Activa Marketing
        ciudadId: 2, // Bogotá D.C.
        direccion: null,
        timezone: 'America/Bogota',
        activo: true,
      },
    ])
  }
}
