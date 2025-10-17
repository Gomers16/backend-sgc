// database/seeders/17_agentes_captacion_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'
import AgenteCaptacion from '#models/agente_captacion'
import Cargo from '#models/cargo'
import Usuario from '#models/usuario'

export default class AgentesCaptacionSeeder extends BaseSeeder {
  public async run() {
    // 1) Encontrar cargo ASESOR CONVENIO
    const cargoConvenio = await Cargo.findBy('nombre', 'ASESOR CONVENIO')
    if (!cargoConvenio) {
      console.error('❌ Falta el cargo "ASESOR CONVENIO"')
      return
    }

    // 2) Usuarios base (exactamente los que tienen ese cargo)
    const usuariosConvenio = await Usuario.query().where('cargo_id', cargoConvenio.id)

    const agentes = usuariosConvenio.map((u) => ({
      usuarioId: u.id,
      tipo: 'ASESOR_CONVENIO' as const,
      nombre: `${u.nombres} ${u.apellidos}`.trim(),
      activo: true,
    }))

    const usuarioIdsBase = agentes.map((a) => a.usuarioId)

    // 3) Limpieza estricta
    // 3.1) Borra cualquier agente que NO sea de tipo ASESOR_CONVENIO
    await Database.from('agentes_captacions').whereNot('tipo', 'ASESOR_CONVENIO').delete()

    // 3.2) Borra agentes de tipo ASESOR_CONVENIO cuyo usuario NO esté en la lista base
    await Database.from('agentes_captacions')
      .where('tipo', 'ASESOR_CONVENIO')
      .whereNotIn('usuario_id', usuarioIdsBase.length ? usuarioIdsBase : [-1])
      .delete()

    // 4) Upsert 1:1 por usuarioId para los que sí deben existir
    for (const a of agentes) {
      await AgenteCaptacion.updateOrCreate(
        { usuarioId: a.usuarioId }, // clave lógica 1:1
        {
          usuarioId: a.usuarioId,
          tipo: a.tipo,
          nombre: a.nombre,
          activo: a.activo,
        }
      )
    }

    console.log(`✅ Agentes de captación (SOLO CONVENIOS) listos: CONV=${agentes.length}`)
  }
}
