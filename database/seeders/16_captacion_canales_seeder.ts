// database/seeders/captacion_canales_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CaptacionCanal from '#models/captacion_canal'

export default class CaptacionCanalesSeeder extends BaseSeeder {
  public async run() {
    // 1) Estado deseado (foto final de la tabla)
    const rows = [
      {
        codigo: 'FACHADA',
        nombre: 'Fachada',
        descripcion: 'Ingreso por puerta / mostrador',
        colorHex: '#F59E0B',
        orden: 1,
        activo: true,
      },
      {
        codigo: 'ASESOR_COMERCIAL',
        nombre: 'Asesor Comercial',
        descripcion: 'Captación hecha por un asesor comercial (interno)',
        colorHex: '#10B981',
        orden: 2,
        activo: true,
      },
      {
        codigo: 'ASESOR_CONVENIO',
        nombre: 'Asesor Convenio',
        descripcion: 'Captación hecha por asesor de convenio (externo/aliado)',
        colorHex: '#34D399',
        orden: 3,
        activo: true,
      },
      {
        codigo: 'TELEMERCADEO',
        nombre: 'Telemercadeo',
        descripcion: 'Llamadas / call center',
        colorHex: '#6366F1',
        orden: 4,
        activo: true,
      },
      {
        codigo: 'REDES',
        nombre: 'Redes Sociales',
        descripcion: 'Leads desde redes sociales',
        colorHex: '#8B5CF6',
        orden: 5,
        activo: true,
      },
    ] as const

    // 2) Crea/actualiza por clave única "codigo" (idempotente)
    await CaptacionCanal.updateOrCreateMany('codigo', rows as any)

    // 3) Limpieza de legado: si existe el canal antiguo "ASESOR", elimínalo.
    //    (Si no existe, no pasa nada — delete devuelve 0 filas y sigue).
    await CaptacionCanal.query().where('codigo', 'ASESOR').delete()
  }
}
