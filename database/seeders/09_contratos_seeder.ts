import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Contrato from '#models/contrato'
import { DateTime } from 'luxon'

export default class ContratoSeeder extends BaseSeeder {
  public async run() {
    await Contrato.createMany([
      {
        id: 1,
        usuarioId: 1, // Carlos Rodríguez (admin)
        tipoContrato: 'laboral',
        estado: 'activo',
        fechaInicio: DateTime.fromISO('2024-01-10'),
        fechaFin: undefined,
      },
      {
        id: 2,
        usuarioId: 2, // Laura González (rrhh)
        tipoContrato: 'prestacion',
        estado: 'activo',
        fechaInicio: DateTime.fromISO('2024-03-01'),
        fechaFin: DateTime.fromISO('2024-12-31'),
      },
    ])
  }
}
