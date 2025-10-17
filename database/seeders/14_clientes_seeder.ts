// database/seeders/clientes_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Cliente from '#models/cliente'

type PersonaDoc = 'CC' | 'CE' | 'PAS'
type EmpresaDoc = 'NIT'

export default class ClientesSeeder extends BaseSeeder {
  public async run() {
    // 1) Semilla fija (legible para pruebas manuales)
    const base: Array<{
      nombre: string | null
      docTipo: PersonaDoc | EmpresaDoc | null
      docNumero: string | null
      telefono: string
      email: string | null
      ciudadId: number | null
    }> = [
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

      // Registro mínimo (solo teléfono)
      {
        nombre: null,
        docTipo: null,
        docNumero: null,
        telefono: '3040000008',
        email: null,
        ciudadId: null,
      },
    ]

    // 2) Generar extra hasta llegar a ~50 clientes (idempotente por teléfono)
    const N_TOTAL = 50
    const nombres = [
      'Ana',
      'Luis',
      'Carlos',
      'María',
      'Andrés',
      'Camila',
      'Sofía',
      'Julián',
      'Pedro',
      'Laura',
      'Paula',
      'Felipe',
      'Daniela',
      'Mateo',
      'Valentina',
    ] as const
    const apellidos = [
      'Gómez',
      'Pérez',
      'Rodríguez',
      'López',
      'Martínez',
      'Hernández',
      'Rojas',
      'Ruiz',
      'Castro',
      'Ortiz',
    ] as const

    const usedPhones = new Set(base.map((r) => r.telefono))
    const pick = <T>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]
    const phone = (): string => {
      // Evitar colisiones con los base
      let t = ''
      do {
        t = '3' + String(100000000 + Math.floor(Math.random() * 900000000))
      } while (usedPhones.has(t))
      usedPhones.add(t)
      return t
    }

    while (base.length < N_TOTAL) {
      const isEmpresa = Math.random() < 0.2 // 20% empresas
      if (isEmpresa) {
        const nit = String(900000000 + Math.floor(Math.random() * 99999))
        const tel = phone()
        base.push({
          nombre: `Empresa ${nit.slice(-4)}`,
          docTipo: 'NIT',
          docNumero: nit,
          telefono: tel,
          email: Math.random() < 0.5 ? `contacto${nit.slice(-3)}@empresa.com` : null,
          ciudadId: null,
        })
      } else {
        const nombre = `${pick(nombres)} ${pick(apellidos)}`
        const tel = phone()
        const docTipo: PersonaDoc = Math.random() < 0.85 ? 'CC' : Math.random() < 0.5 ? 'CE' : 'PAS'
        const docNumero =
          docTipo === 'CC'
            ? String(1000000000 + Math.floor(Math.random() * 900000000))
            : docTipo === 'CE'
              ? `E${100000 + Math.floor(Math.random() * 900000)}`
              : `P${1000000 + Math.floor(Math.random() * 9000000)}`
        base.push({
          nombre,
          docTipo,
          docNumero,
          telefono: tel,
          email:
            Math.random() < 0.4 ? `${nombre.toLowerCase().replace(/\s+/g, '.')}@mail.com` : null,
          ciudadId: null,
        })
      }
    }

    for (const row of base) {
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
