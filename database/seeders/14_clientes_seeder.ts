// database/seeders/clientes_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Cliente from '#models/cliente'

export default class ClientesSeeder extends BaseSeeder {
  public async run() {
    const rows = [
      // Personas (CC, CE, PAS)
      {
        nombre: 'Andrés Pérez',
        docTipo: 'CC',
        docNumero: '1012345678',
        telefono: '3000000001',
        email: 'andres.perez@example.com',
        ciudadId: null,
      },
      {
        nombre: 'María Torres',
        docTipo: 'CC',
        docNumero: '1034567890',
        telefono: '3010000003',
        email: 'maria.torres@example.com',
        ciudadId: null,
      },
      {
        nombre: 'Carlos Ruiz',
        docTipo: 'CC',
        docNumero: '79876543',
        telefono: '3020000005',
        email: 'carlos.ruiz@example.com',
        ciudadId: null,
      },
      {
        nombre: 'Juanita Rojas',
        docTipo: 'CE',
        docNumero: 'A1234567',
        telefono: '3030000007',
        email: 'juanita.rojas@example.com',
        ciudadId: null,
      },
      {
        nombre: 'Diego Lozano',
        docTipo: 'PAS',
        docNumero: 'P9876543',
        telefono: '3050000009',
        email: 'diego.lozano@example.com',
        ciudadId: null,
      },

      // Empresas (NIT)
      {
        nombre: 'Transporte Gómez SAS',
        docTipo: 'NIT',
        docNumero: '900123456',
        telefono: '3200000002',
        email: 'contacto@tgomez.com',
        ciudadId: null,
      },
      {
        nombre: 'Taller Los Andes SAS',
        docTipo: 'NIT',
        docNumero: '901234567',
        telefono: '3210000004',
        email: 'recepcion@tallerandes.com',
        ciudadId: null,
      },
      {
        nombre: 'Importadora Zeta LTDA',
        docTipo: 'NIT',
        docNumero: '830112233',
        telefono: '3220000006',
        email: 'ventas@zeta.com',
        ciudadId: null,
      },
      {
        nombre: 'Acme Logistics SAS',
        docTipo: 'NIT',
        docNumero: '900987654',
        telefono: '3230000010',
        email: 'info@acmelogistics.co',
        ciudadId: null,
      },

      // Registro mínimo (solo teléfono) para probar enriquecimiento posterior
      {
        nombre: null,
        docTipo: null,
        docNumero: null,
        telefono: '3040000008',
        email: null,
        ciudadId: null,
      },
    ]

    // Idempotente por teléfono (UNIQUE): crea o actualiza cada cliente
    for (const row of rows) {
      await Cliente.updateOrCreate(
        { telefono: row.telefono },
        {
          nombre: row.nombre,
          docTipo: row.docTipo,
          docNumero: row.docNumero,
          telefono: row.telefono,
          email: row.email,
          ciudadId: row.ciudadId,
        }
      )
    }
  }
}
