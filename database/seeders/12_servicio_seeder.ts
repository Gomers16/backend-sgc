// database/seeders/ServicioSeeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Servicio from '#models/servicio' // o 'App/Models/Servicio' según tu alias

export default class extends BaseSeeder {
  public async run() {
    await Servicio.updateOrCreateMany('codigoServicio', [
      { codigoServicio: 'RTM', nombreServicio: 'RTM (Revisión Técnico Mecánica)' },
      { codigoServicio: 'PREV', nombreServicio: 'Preventiva' },
      { codigoServicio: 'PERI', nombreServicio: 'Peritaje' },
      { codigoServicio: 'SOAT', nombreServicio: 'SOAT' }, // 👈 nuevo
    ])
  }
}
