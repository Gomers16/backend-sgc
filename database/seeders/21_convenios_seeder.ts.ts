import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Convenio from '#models/convenio'

export default class ConveniosSeeder extends BaseSeeder {
  public async run() {
    const convenios = [
      {
        tipo: 'TALLER' as const,
        nombre: 'MotorPlus Taller',
        docTipo: 'NIT',
        docNumero: '901234567',
        telefono: '6011234567',
        whatsapp: '3001112233',
        email: 'contacto@motorplus.com',
        ciudadId: null,
        direccion: 'Cra 10 # 20-30',
        notas: 'Taller aliado especializado en frenos',
        activo: true,
      },
      {
        tipo: 'TALLER' as const,
        nombre: 'Llantas & Frenos SAS',
        docTipo: 'NIT',
        docNumero: '900765432',
        telefono: '6017654321',
        whatsapp: '3004445566',
        email: 'ventas@lyf.com',
        ciudadId: null,
        direccion: 'Av 68 # 50-25',
        notas: 'Alto volumen mensual',
        activo: true,
      },
      {
        tipo: 'PERSONA' as const,
        nombre: 'Laura Pérez',
        docTipo: 'CC',
        docNumero: '1020304050',
        telefono: '3160001122',
        whatsapp: '3160001122',
        email: 'laura.perez@example.com',
        ciudadId: null,
        direccion: null,
        notas: 'Referidos frecuentes de su conjunto',
        activo: true,
      },
    ]

    for (const c of convenios) {
      await Convenio.updateOrCreate({ docTipo: c.docTipo, docNumero: c.docNumero }, c)
    }
  }
}
