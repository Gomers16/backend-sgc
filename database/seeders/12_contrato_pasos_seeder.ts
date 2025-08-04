import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ContratoPaso from '#models/contrato_paso'
import { DateTime } from 'luxon'

export default class ContratoPasoSeeder extends BaseSeeder {
  public async run() {
    await ContratoPaso.createMany([
      // Contrato 1 (laboral) - Carlos Rodríguez
      {
        contratoId: 1,
        fase: 'inicio',
        nombrePaso: 'Reclutamiento/selección',
        fecha: DateTime.fromISO('2024-01-05'),
        archivoUrl: '', // ✅ Cambiado de 'archivo' a 'archivoUrl'
        observacion: 'Proceso completado sin observaciones',
        orden: 1,
        completado: true,
      },
      {
        contratoId: 1,
        fase: 'inicio',
        nombrePaso: 'Referenciación',
        fecha: DateTime.fromISO('2024-01-06'),
        archivoUrl: '', // ✅ Cambiado de 'archivo' a 'archivoUrl'
        observacion: '',
        orden: 2,
        completado: true,
      },
      {
        contratoId: 1,
        fase: 'inicio',
        nombrePaso: 'Pruebas',
        fecha: DateTime.fromISO('2024-01-07'),
        archivoUrl: '', // ✅ Cambiado de 'archivo' a 'archivoUrl'
        observacion: 'Pruebas satisfactorias',
        orden: 3,
        completado: true,
      },

      // Contrato 2 (prestación) - Laura González
      {
        contratoId: 2,
        fase: 'inicio',
        nombrePaso: 'Solicitud',
        fecha: DateTime.fromISO('2024-02-25'),
        archivoUrl: '', // ✅ Cambiado de 'archivo' a 'archivoUrl'
        observacion: '',
        orden: 1,
        completado: true,
      },
      {
        contratoId: 2,
        fase: 'inicio',
        nombrePaso: 'Pruebas',
        fecha: DateTime.fromISO('2024-02-26'),
        archivoUrl: '', // ✅ Cambiado de 'archivo' a 'archivoUrl'
        observacion: 'Pruebas técnicas entregadas',
        orden: 2,
        completado: true,
      },
    ])
  }
}
