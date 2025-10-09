// database/seeders/23_asignaciones_comerciales_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import AgenteCaptacion from '#models/agente_captacion'
import Usuario from '#models/usuario'
import Convenio from '#models/convenio'
import Prospecto from '#models/prospecto'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'
import AsesorProspectoAsignacion from '#models/asesor_prospecto_asignacion'

export default class AsignacionesComercialesSeeder extends BaseSeeder {
  public async run() {
    const trx = await Database.transaction()
    try {
      // Buscar hasta 6 asesores comerciales activos
      let asesores = await AgenteCaptacion.query({ client: trx })
        .where('activo', true)
        .where('tipo', 'ASESOR_COMERCIAL')
        .orderBy('id', 'asc')
        .limit(6)

      const minNecesarios = 2
      if (asesores.length < minNecesarios) {
        const faltan = minNecesarios - asesores.length
        for (let i = 0; i < faltan; i++) {
          const a = await AgenteCaptacion.create(
            {
              tipo: 'ASESOR_COMERCIAL', // ✅ corregido
              nombre: `Asesor Comercial Demo ${i + 1}`,
              telefono: `30000000${i + 1}`,
              activo: true,
            },
            { client: trx }
          )
          asesores.push(a)
        }
      }

      const pick = (idx: number) => asesores[idx % asesores.length]
      const usuarioAsignador = await Usuario.query({ client: trx }).first()

      // ===== Convenios → asignación alternada si no hay vigente
      const convenios = await Convenio.query({ client: trx }).orderBy('id', 'asc')
      for (const [idx, conv] of convenios.entries()) {
        const ya = await AsesorConvenioAsignacion.query({ client: trx })
          .where('convenio_id', conv.id)
          .where('activo', true)
          .whereNull('fecha_fin')
          .first()

        if (!ya) {
          await AsesorConvenioAsignacion.create(
            {
              convenioId: conv.id,
              asesorId: pick(idx).id,
              asignadoPor: usuarioAsignador?.id ?? null,
              fechaAsignacion: DateTime.now(),
              fechaFin: null,
              motivoFin: null,
              activo: true,
            },
            { client: trx }
          )
        }
      }

      // ===== Prospectos → asignación alternada si no hay vigente
      const prospectos = await Prospecto.query({ client: trx }).orderBy('id', 'asc')
      for (const [idx, pros] of prospectos.entries()) {
        const activo = await AsesorProspectoAsignacion.query({ client: trx })
          .where('prospecto_id', pros.id)
          .where('activo', true)
          .whereNull('fecha_fin')
          .first()

        if (!activo) {
          await AsesorProspectoAsignacion.create(
            {
              prospectoId: pros.id,
              asesorId: pick(idx).id,
              asignadoPor: usuarioAsignador?.id ?? null,
              fechaAsignacion: DateTime.now(),
              fechaFin: null,
              motivoFin: null,
              activo: true,
            },
            { client: trx }
          )
        }
      }

      await trx.commit()
      console.log('✅ Asignaciones comerciales creadas correctamente.')
    } catch (err) {
      await trx.rollback()
      console.error('❌ Error ejecutando el seeder de asignaciones comerciales:', err)
      throw err
    }
  }
}
