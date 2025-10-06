// database/seeders/22_prospectos_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Prospecto from '#models/prospecto'

export default class ProspectosSeeder extends BaseSeeder {
  public async run() {
    const hoy = DateTime.now().startOf('day')

    const casos = [
      {
        placa: 'ABC123',
        telefono: '3201112233',
        nombre: 'Juan Ramírez',
        observaciones: 'Pidió precio RTM',
        soatVenc: hoy.plus({ months: 4 }),
        tecnoVenc: hoy.plus({ months: 3 }),
        creadoPor: 1,
      },
      {
        placa: 'BBB222',
        telefono: '3001230002',
        nombre: 'Camilo Pardo',
        observaciones: 'RTM monto',
        soatVenc: hoy.minus({ days: 10 }),
        tecnoVenc: null,
        creadoPor: 1,
      },
      {
        placa: 'HHH888',
        telefono: '3001230008',
        nombre: 'Héctor Díaz',
        observaciones: 'Vence pronto',
        soatVenc: hoy.minus({ months: 1 }),
        tecnoVenc: hoy.minus({ days: 5 }),
        creadoPor: 1,
      },
      {
        placa: 'XYZ789',
        telefono: '3154445566',
        nombre: 'Carolina Díaz',
        observaciones: 'Quiere agenda',
        soatVenc: hoy.plus({ months: 8 }),
        tecnoVenc: null,
        creadoPor: 2,
      },
      {
        placa: 'MNO456',
        telefono: '3117778889',
        nombre: 'Carlos Peña',
        observaciones: 'Consultó tarifas',
        soatVenc: null,
        tecnoVenc: hoy.plus({ months: 1 }),
        creadoPor: 2,
      },
      {
        placa: 'TTT001',
        telefono: '3000000001',
        nombre: 'Sergio Mora',
        observaciones: 'SOAT y Tecno vencidos',
        soatVenc: hoy.minus({ months: 2 }),
        tecnoVenc: hoy.minus({ months: 1 }),
        creadoPor: 1, // ← Cambiar de 3 a 1 o 2
      },
    ]

    const payload = casos.map((c) => {
      const soatVigente = !!(c.soatVenc && c.soatVenc >= hoy)
      const tecnoVigente = !!(c.tecnoVenc && c.tecnoVenc >= hoy)
      return {
        convenioId: null,
        placa: c.placa,
        telefono: c.telefono,
        nombre: c.nombre,
        observaciones: c.observaciones ?? null,
        soatVigente,
        soatVencimiento: c.soatVenc ?? null,
        tecnoVigente,
        tecnoVencimiento: c.tecnoVenc ?? null,
        origen: 'OTRO' as const,
        creadoPor: c.creadoPor ?? 1,
      }
    })

    await Prospecto.updateOrCreateMany('placa', payload)
  }
}
