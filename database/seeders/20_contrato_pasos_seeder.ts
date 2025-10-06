import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ContratoPaso from '#models/contrato_paso'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class ContratoPasoSeeder extends BaseSeeder {
  public async run() {
    // Limpiar tabla de pasos
    await ContratoPaso.query().delete()

    // Buscar IDs reales de los contratos por identificación
    const contrato1 = await db
      .from('contratos')
      .select('id')
      .where('identificacion', '1020304050')
      .first()
    const contrato2 = await db
      .from('contratos')
      .select('id')
      .where('identificacion', '1098765432')
      .first()

    if (!contrato1?.id || !contrato2?.id) {
      console.error('❌ No se encontraron los contratos requeridos para sembrar pasos.')
      return
    }

    await ContratoPaso.createMany([
      // Contrato 1 (laboral)
      {
        contratoId: contrato1.id,
        fase: 'inicio',
        nombrePaso: 'Reclutamiento/selección',
        fecha: DateTime.fromISO('2024-01-05'),
        archivoUrl: '',
        observacion: 'Proceso completado sin observaciones',
        orden: 1,
        completado: true,
      },
      {
        contratoId: contrato1.id,
        fase: 'inicio',
        nombrePaso: 'Referenciación',
        fecha: DateTime.fromISO('2024-01-06'),
        archivoUrl: '',
        observacion: '',
        orden: 2,
        completado: true,
      },
      {
        contratoId: contrato1.id,
        fase: 'inicio',
        nombrePaso: 'Pruebas',
        fecha: DateTime.fromISO('2024-01-07'),
        archivoUrl: '',
        observacion: 'Pruebas satisfactorias',
        orden: 3,
        completado: true,
      },

      // Contrato 2 (prestación)
      {
        contratoId: contrato2.id,
        fase: 'inicio',
        nombrePaso: 'Solicitud',
        fecha: DateTime.fromISO('2024-02-25'),
        archivoUrl: '',
        observacion: '',
        orden: 1,
        completado: true,
      },
      {
        contratoId: contrato2.id,
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
