// database/seeders/17_agentes_captacion_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AgenteCaptacion from '#models/agente_captacion'
import Usuario from '#models/usuario'
import Cargo from '#models/cargo'

export default class AgentesCaptacionSeeder extends BaseSeeder {
  public async run() {
    // Buscar cargos principales
    const cargoCom = await Cargo.findBy('nombre', 'ASESOR COMERCIAL')
    const cargoConv = await Cargo.findBy('nombre', 'ASESOR CONVENIO')
    const cargoTele = await Cargo.findBy('nombre', 'ASESOR - TELEMERCADEO')

    if (!cargoCom && !cargoConv && !cargoTele) {
      console.log('ℹ️ No hay cargos comerciales disponibles. Seeder sin cambios.')
      return
    }

    // 🟢 1) Usuarios con cargo ASESOR COMERCIAL
    if (cargoCom) {
      const comerciales = await Usuario.query().where('cargo_id', cargoCom.id)
      for (const u of comerciales) {
        const nombre = [u.nombres, u.apellidos].filter(Boolean).join(' ') || u.correo
        await AgenteCaptacion.updateOrCreate({ usuarioId: u.id }, {
          usuarioId: u.id,
          tipo: 'ASESOR_COMERCIAL',
          nombre,
          telefono: (u as any).celularCorporativo ?? (u as any).celularPersonal ?? null,
          docTipo: null,
          docNumero: null,
          activo: true,
        } as any)
      }
    }

    // 🟣 2) Usuarios con cargo ASESOR CONVENIO
    if (cargoConv) {
      const convenios = await Usuario.query().where('cargo_id', cargoConv.id)
      for (const u of convenios) {
        const nombre = [u.nombres, u.apellidos].filter(Boolean).join(' ') || u.correo
        await AgenteCaptacion.updateOrCreate({ usuarioId: u.id }, {
          usuarioId: u.id,
          tipo: 'ASESOR_CONVENIO',
          nombre,
          telefono: (u as any).celularCorporativo ?? (u as any).celularPersonal ?? null,
          docTipo: null,
          docNumero: null,
          activo: true,
        } as any)
      }
    }

    // 🔵 3) Usuarios con cargo ASESOR - TELEMERCADEO
    if (cargoTele) {
      const telemercadeo = await Usuario.query().where('cargo_id', cargoTele.id)
      for (const u of telemercadeo) {
        const nombre = [u.nombres, u.apellidos].filter(Boolean).join(' ') || u.correo
        await AgenteCaptacion.updateOrCreate({ usuarioId: u.id }, {
          usuarioId: u.id,
          tipo: 'ASESOR_TELEMERCADEO',
          nombre,
          telefono: (u as any).celularCorporativo ?? (u as any).celularPersonal ?? null,
          docTipo: null,
          docNumero: null,
          activo: true,
        } as any)
      }
    }

    console.log('✅ Agentes de captación sincronizados correctamente con los nuevos tipos.')
  }
}
