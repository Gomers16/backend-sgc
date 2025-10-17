// database/seeders/21_convenios_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Convenio from '#models/convenio'

export default class ConveniosSeeder extends BaseSeeder {
  public async run() {
    // Convenios = mismos asesores de convenio (1:1), sin crear ninguno adicional
    const convenios = [
      {
        tipo: 'PERSONA' as const,
        nombre: 'Carolina Rojas',
        docTipo: 'CC',
        docNumero: '1010000001',
        telefono: '3013456781',
        whatsapp: '3123456781',
        email: 'carolina.rojas@empresa.com',
        ciudadId: null,
        direccion: null,
        notas: 'Asesor convenio (1:1)',
        activo: true,
      },
      {
        tipo: 'PERSONA' as const,
        nombre: 'Felipe Gutiérrez',
        docTipo: 'CC',
        docNumero: '1010000002',
        telefono: '3014567892',
        whatsapp: '3134567892',
        email: 'felipe.gutierrez@empresa.com',
        ciudadId: null,
        direccion: null,
        notas: 'Asesor convenio (1:1)',
        activo: true,
      },
      {
        tipo: 'PERSONA' as const,
        nombre: 'Natalia Jiménez',
        docTipo: 'CC',
        docNumero: '1010000003',
        telefono: '3015678903',
        whatsapp: '3145678903',
        email: 'natalia.jimenez@empresa.com',
        ciudadId: null,
        direccion: null,
        notas: 'Asesor convenio (1:1)',
        activo: true,
      },
      {
        tipo: 'PERSONA' as const,
        nombre: 'Ricardo Álvarez',
        docTipo: 'CC',
        docNumero: '1010000004',
        telefono: '3016789014',
        whatsapp: '3156789014',
        email: 'ricardo.alvarez@empresa.com',
        ciudadId: null,
        direccion: null,
        notas: 'Asesor convenio (1:1)',
        activo: true,
      },
    ]

    // Upsert por (docTipo, docNumero) — NO crea nada más
    for (const c of convenios) {
      await Convenio.updateOrCreate({ docTipo: c.docTipo, docNumero: c.docNumero }, c)
    }
  }
}
