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
      // ===== 1) IDs de Telemercadeo (excluir de asignaciones) =====
      const teleRows = await AgenteCaptacion.query({ client: trx })
        .where('activo', true)
        .where('tipo', 'ASESOR_TELEMERCADEO')
        .select('id')
      const teleIds = teleRows.map((r) => r.id)

      // ===== 2) Asesores asignables: Comercial + Convenio (activos) =====
      const asignablesQuery = AgenteCaptacion.query({ client: trx })
        .where('activo', true)
        .whereIn('tipo', ['ASESOR_COMERCIAL', 'ASESOR_CONVENIO'] as const)
        .orderBy('id', 'asc')

      if (teleIds.length > 0) {
        asignablesQuery.whereNotIn('id', teleIds)
      }

      const asignables = await asignablesQuery

      // Si hay pocos, crear demos para asegurar reparto decente
      const MIN_ASIGNABLES = 4
      if (asignables.length < MIN_ASIGNABLES) {
        const faltan = MIN_ASIGNABLES - asignables.length
        for (let i = 0; i < faltan; i++) {
          const demo = await AgenteCaptacion.create(
            {
              tipo: 'ASESOR_COMERCIAL',
              nombre: `Asesor Comercial Demo ${i + 1}`,
              telefono: `30000000${i + 1}`,
              activo: true,
            } as any,
            { client: trx }
          )
          asignables.push(demo)
        }
      }

      if (asignables.length === 0) {
        console.warn('⚠️ No hay asesores asignables (comercial/convenio). Nada que repartir.')
        await trx.commit()
        return
      }

      const usuarioAsignador = await Usuario.query({ client: trx }).first()
      const pickRR = <T>(arr: T[], i: number) => arr[i % arr.length]

      // ===== 3) Reparto de CONVENIOS (solo crea si no hay activa vigente) =====
      const convenios = await Convenio.query({ client: trx }).orderBy('id', 'asc')
      let convCreadas = 0

      for (const [idx, conv] of convenios.entries()) {
        const yaActiva = await AsesorConvenioAsignacion.query({ client: trx })
          .where('convenio_id', conv.id)
          .where('activo', true)
          .whereNull('fecha_fin')
          .first()

        if (!yaActiva) {
          await AsesorConvenioAsignacion.create(
            {
              convenioId: conv.id,
              asesorId: pickRR(asignables, idx).id,
              asignadoPor: usuarioAsignador?.id ?? null,
              fechaAsignacion: DateTime.now(),
              fechaFin: null,
              motivoFin: null,
              activo: true,
            } as any,
            { client: trx }
          )
          convCreadas++
        }
      }

      // ===== 4) Reparto de PROSPECTOS (solo crea si no hay activa vigente) =====
      const prospectos = await Prospecto.query({ client: trx }).orderBy('id', 'asc')
      let prosCreadas = 0

      for (const [idx, pros] of prospectos.entries()) {
        const yaActiva = await AsesorProspectoAsignacion.query({ client: trx })
          .where('prospecto_id', pros.id)
          .where('activo', true)
          .whereNull('fecha_fin')
          .first()

        if (!yaActiva) {
          await AsesorProspectoAsignacion.create(
            {
              prospectoId: pros.id,
              asesorId: pickRR(asignables, idx).id,
              asignadoPor: usuarioAsignador?.id ?? null,
              fechaAsignacion: DateTime.now(),
              fechaFin: null,
              motivoFin: null,
              activo: true,
            } as any,
            { client: trx }
          )
          prosCreadas++
        }
      }

      await trx.commit()
      console.log(
        `✅ Asignaciones listas. Convenios creados: ${convCreadas}, Prospectos creados: ${prosCreadas}. ` +
          `Asesores usados: ${asignables.length}. Excluidos tele: ${teleIds.length}.`
      )
    } catch (err) {
      await trx.rollback()
      console.error('❌ Error en AsignacionesComercialesSeeder:', err)
      throw err
    }
  }
}
