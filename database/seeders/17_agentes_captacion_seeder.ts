import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AgenteCaptacion from '#models/agente_captacion'
import Usuario from '#models/usuario'
import Cargo from '#models/cargo'

export default class AgentesCaptacionSeeder extends BaseSeeder {
  public async run() {
    // 1) Convertir TODOS los usuarios con el cargo de “asesor …” en ASESOR_INTERNO
    const cargoAsesor = await Cargo.findBy('nombre', 'ASESOR DE SERVICIO AL CLIENTE Y VENTAS')
    if (cargoAsesor) {
      const usuariosAsesores = await Usuario.query().where('cargo_id', cargoAsesor.id)
      for (const u of usuariosAsesores) {
        const nombre = [u.nombres, u.apellidos].filter(Boolean).join(' ') || u.correo
        await AgenteCaptacion.updateOrCreate({ usuarioId: u.id }, {
          usuarioId: u.id,
          tipo: 'ASESOR_INTERNO',
          nombre,
          telefono: (u as any).celularCorporativo ?? (u as any).celularPersonal ?? null,
          docTipo: null,
          docNumero: null,
          activo: true,
        } as any)
      }
    }

    // 2) Asegurar Carlos y Laura como internos (por si su cargo no coincide)
    for (const correo of ['admin@empresa.com', 'laura.gonzalez@empresa.com']) {
      const u = await Usuario.findBy('correo', correo)
      if (!u) continue
      const nombre = [u.nombres, u.apellidos].filter(Boolean).join(' ') || u.correo
      await AgenteCaptacion.updateOrCreate({ usuarioId: u.id }, {
        usuarioId: u.id,
        tipo: 'ASESOR_INTERNO',
        nombre,
        telefono: (u as any).celularCorporativo ?? (u as any).celularPersonal ?? null,
        docTipo: null,
        docNumero: null,
        activo: true,
      } as any)
    }

    // 3) +6 agentes EXTERNOS
    const externos = [
      {
        nombre: 'Taller El Progreso SAS',
        docTipo: 'NIT',
        docNumero: '901111111',
        telefono: '3117000001',
      },
      {
        nombre: 'Taller Torque & Más',
        docTipo: 'NIT',
        docNumero: '901111112',
        telefono: '3117000002',
      },
      { nombre: 'Aliado Ruta 90', docTipo: 'NIT', docNumero: '901111113', telefono: '3117000003' },
      { nombre: 'Mario Sánchez', docTipo: 'CC', docNumero: '1020304001', telefono: '3117000004' },
      { nombre: 'Lina Duarte', docTipo: 'CC', docNumero: '1020304002', telefono: '3117000005' },
      {
        nombre: 'AutoClub Express',
        docTipo: 'NIT',
        docNumero: '901111114',
        telefono: '3117000006',
      },
    ] as const

    for (const r of externos) {
      await AgenteCaptacion.updateOrCreate({ docTipo: r.docTipo as any, docNumero: r.docNumero }, {
        tipo: 'ASESOR_EXTERNO',
        nombre: r.nombre,
        telefono: r.telefono,
        docTipo: r.docTipo as any,
        docNumero: r.docNumero,
        activo: true,
        usuarioId: null,
      } as any)
    }
  }
}
