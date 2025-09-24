// database/seeders/agentes_captacion_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AgenteCaptacion from '#models/agente_captacion'

export default class AgentesCaptacionSeeder extends BaseSeeder {
  public async run() {
    const rows = [
      // Asesores internos
      {
        tipo: 'ASESOR_INTERNO',
        nombre: 'Ana Morales',
        telefono: '3101111111',
        docTipo: 'CC',
        docNumero: '1010010010',
        activo: true,
      },
      {
        tipo: 'ASESOR_INTERNO',
        nombre: 'Pedro Rojas',
        telefono: '3102222222',
        docTipo: 'CC',
        docNumero: '1010020020',
        activo: true,
      },
      {
        tipo: 'ASESOR_INTERNO',
        nombre: 'Luisa Fernández',
        telefono: '3103333333',
        docTipo: 'CC',
        docNumero: '1010030030',
        activo: true,
      },

      // Asesores externos (persona u empresa con NIT)
      {
        tipo: 'ASESOR_EXTERNO',
        nombre: 'Taller Los Andes SAS',
        telefono: '3114444444',
        docTipo: 'NIT',
        docNumero: '901234567',
        activo: true,
      },
      {
        tipo: 'ASESOR_EXTERNO',
        nombre: 'Taller La 45 SAS',
        telefono: '3115555555',
        docTipo: 'NIT',
        docNumero: '900456789',
        activo: true,
      },
      {
        tipo: 'ASESOR_EXTERNO',
        nombre: 'José Gómez',
        telefono: '3116666666',
        docTipo: 'CC',
        docNumero: '1020040040',
        activo: true,
      },

      // Telemercadeo
      {
        tipo: 'TELEMERCADEO',
        nombre: 'Camila Tele',
        telefono: '3127777777',
        docTipo: 'CC',
        docNumero: '1030050050',
        activo: true,
      },
      {
        tipo: 'TELEMERCADEO',
        nombre: 'Juan Tele',
        telefono: '3128888888',
        docTipo: 'CC',
        docNumero: '1030060060',
        activo: true,
      },
    ]

    for (const r of rows) {
      // Upsert por documento; si no hay documento, usa (nombre+tipo) como fallback
      if (r.docTipo && r.docNumero) {
        await AgenteCaptacion.updateOrCreate(
          { docTipo: r.docTipo, docNumero: r.docNumero },
          {
            tipo: r.tipo as any,
            nombre: r.nombre,
            telefono: r.telefono,
            docTipo: r.docTipo as any,
            docNumero: r.docNumero,
            activo: r.activo,
          }
        )
      } else {
        await AgenteCaptacion.updateOrCreate(
          { nombre: r.nombre, tipo: r.tipo as any },
          {
            tipo: r.tipo as any,
            nombre: r.nombre,
            telefono: r.telefono ?? null,
            docTipo: r.docTipo ?? null,
            docNumero: r.docNumero ?? null,
            activo: r.activo,
          }
        )
      }
    }
  }
}
