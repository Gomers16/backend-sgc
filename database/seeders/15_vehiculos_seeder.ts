// database/seeders/vehiculos_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Vehiculo from '#models/vehiculo'
import ClaseVehiculo from '#models/clase_vehiculos'
import Cliente from '#models/cliente'

export default class VehiculosSeeder extends BaseSeeder {
  public async run() {
    // Mapear códigos de clase -> id
    const clases = await ClaseVehiculo.query().select(['id', 'codigo'])
    const claseByCode = Object.fromEntries(clases.map((c) => [c.codigo, c.id]))

    // Cargar clientes por teléfono usados en el seeder anterior
    const phones = [
      '3000000001', // Andrés Pérez
      '3010000003', // María Torres
      '3020000005', // Carlos Ruiz
      '3030000007', // Juanita Rojas
      '3050000009', // Diego Lozano
      '3200000002', // Transporte Gómez SAS
      '3210000004', // Taller Los Andes SAS
      '3220000006', // Importadora Zeta LTDA
      '3230000010', // Acme Logistics SAS
      '3040000008', // registro mínimo
    ]
    const clientes = await Cliente.query().whereIn('telefono', phones).select(['id', 'telefono'])
    const clienteByPhone: Record<string, number> = {}
    clientes.forEach((c) => (clienteByPhone[c.telefono] = c.id))

    // Vehículos de ejemplo
    const rows = [
      {
        placa: 'ABC123',
        clase: 'LIV_PART',
        marca: 'Chevrolet',
        linea: 'Spark GT',
        modelo: 2018,
        tel: '3000000001',
      },
      {
        placa: 'XYZ987',
        clase: 'LIV_TAXI',
        marca: 'Kia',
        linea: 'Picanto',
        modelo: 2016,
        tel: '3010000003',
      },
      {
        placa: 'MNO789',
        clase: 'MOTO',
        marca: 'Bajaj',
        linea: 'Pulsar',
        modelo: 2017,
        tel: '3020000005',
      },
      {
        placa: 'JKL456',
        clase: 'LIV_PUBLICO',
        marca: 'Renault',
        linea: 'Duster',
        modelo: 2019,
        tel: '3200000002',
      },
      {
        placa: 'PQR234',
        clase: 'LIV_PART',
        marca: 'Mazda',
        linea: 'Mazda 3',
        modelo: 2020,
        tel: '3030000007',
      },
      {
        placa: 'STU567',
        clase: 'LIV_PART',
        marca: 'Toyota',
        linea: 'Corolla',
        modelo: 2015,
        tel: '3050000009',
      },
      {
        placa: 'VWX890',
        clase: 'LIV_TAXI',
        marca: 'Chevrolet',
        linea: 'Sail',
        modelo: 2014,
        tel: '3010000003',
      },
      {
        placa: 'QWE123',
        clase: 'LIV_PART',
        marca: 'Nissan',
        linea: 'March',
        modelo: 2013,
        tel: null,
      },
      {
        placa: 'ASD456',
        clase: 'LIV_PUBLICO',
        marca: 'JAC',
        linea: 'N35',
        modelo: 2021,
        tel: '3230000010',
      },
      {
        placa: 'ZXC789',
        clase: 'MOTO',
        marca: 'AKT',
        linea: 'NKD',
        modelo: 2018,
        tel: '3040000008',
      },
      {
        placa: 'RTY321',
        clase: 'LIV_PART',
        marca: 'Renault',
        linea: 'Sandero',
        modelo: 2016,
        tel: '3210000004',
      },
    ]

    for (const r of rows) {
      const claseId = claseByCode[r.clase]
      if (!claseId) continue // si no existe el catálogo, saltar

      const clienteId = r.tel ? (clienteByPhone[r.tel] ?? null) : null

      await Vehiculo.updateOrCreate(
        { placa: r.placa.toUpperCase() },
        {
          placa: r.placa.toUpperCase(),
          claseVehiculoId: claseId,
          marca: r.marca,
          linea: r.linea,
          modelo: r.modelo,
          clienteId: clienteId,
        }
      )
    }
  }
}
