import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ContratoPaso from '#models/contrato_paso'
import { DateTime } from 'luxon'

export default class ContratoPasoSeeder extends BaseSeeder {
  public async run() {
    // Es buena práctica limpiar la tabla antes de sembrar para evitar duplicados
    await ContratoPaso.query().delete()

    await ContratoPaso.createMany([
      // Contrato 1 (laboral) - Carlos Rodríguez
      {
        contratoId: 1, // Este ID debe existir en la tabla 'contratos'
        fase: 'inicio',
        nombrePaso: 'Reclutamiento/selección',
        fecha: DateTime.fromISO('2024-01-05'),
        archivoUrl: '', // ✅ Correcto: coincide con el modelo y migración
        observacion: 'Proceso completado sin observaciones',
        orden: 1,
        completado: true,
      },
      {
        contratoId: 1,
        fase: 'inicio',
        nombrePaso: 'Referenciación',
        fecha: DateTime.fromISO('2024-01-06'),
        archivoUrl: '',
        observacion: '',
        orden: 2,
        completado: true,
      },
      {
        contratoId: 1,
        fase: 'inicio',
        nombrePaso: 'Pruebas',
        fecha: DateTime.fromISO('2024-01-07'),
        archivoUrl: '',
        observacion: 'Pruebas satisfactorias',
        orden: 3,
        completado: true,
      },

      // Contrato 2 (prestación) - Laura González
      {
        contratoId: 2, // Este ID también debe existir en la tabla 'contratos'
        fase: 'inicio',
        nombrePaso: 'Solicitud',
        fecha: DateTime.fromISO('2024-02-25'),
        archivoUrl: '',
        observacion: '',
        orden: 1,
        completado: true,
      },
      {
        contratoId: 2,
        fase: 'inicio',
        nombrePaso: 'Pruebas',
        fecha: DateTime.fromISO('2024-02-26'),
        archivoUrl: '',
        observacion: 'Pruebas técnicas entregadas',
        orden: 2,
        completado: true,
      },
    ])
  }
}
