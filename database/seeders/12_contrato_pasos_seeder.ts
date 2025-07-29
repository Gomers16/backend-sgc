import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ContratoPaso from '#models/contrato_paso'
import { DateTime } from 'luxon'

export default class ContratoPasoSeeder extends BaseSeeder {
  public async run() {
    await ContratoPaso.createMany([
      // Contrato 1 (laboral) - Carlos Rodríguez
      {
        id: 1, // Se puede omitir si es auto-incremental y no se necesita un ID específico
        contratoId: 1,
        fase: 'inicio',
        nombrePaso: 'Reclutamiento/selección',
        fecha: DateTime.fromISO('2024-01-05'),
        archivo: '',
        observacion: 'Proceso completado sin observaciones',
        orden: 1,
        completado: true,
      },
      {
        id: 2, // Se puede omitir si es auto-incremental y no se necesita un ID específico
        contratoId: 1,
        fase: 'inicio',
        nombrePaso: 'Referenciación',
        fecha: DateTime.fromISO('2024-01-06'),
        archivo: '',
        observacion: '',
        orden: 2,
        completado: true,
      },
      {
        id: 3, // Se puede omitir si es auto-incremental y no se necesita un ID específico
        contratoId: 1,
        fase: 'inicio',
        nombrePaso: 'Pruebas',
        fecha: DateTime.fromISO('2024-01-07'),
        archivo: '',
        observacion: 'Pruebas satisfactorias',
        orden: 3,
        completado: true,
      },

      // Contrato 2 (prestación) - Laura González
      {
        id: 4, // Se puede omitir si es auto-incremental y no se necesita un ID específico
        contratoId: 2,
        fase: 'inicio',
        nombrePaso: 'Solicitud',
        fecha: DateTime.fromISO('2024-02-25'),
        archivo: '',
        observacion: '',
        orden: 1,
        completado: true,
      },
      {
        id: 5, // Se puede omitir si es auto-incremental y no se necesita un ID específico
        contratoId: 2,
        fase: 'inicio',
        nombrePaso: 'Pruebas',
        fecha: DateTime.fromISO('2024-02-26'),
        archivo: '',
        observacion: 'Pruebas técnicas entregadas',
        orden: 2,
        completado: true,
      },
    ])
  }
}
