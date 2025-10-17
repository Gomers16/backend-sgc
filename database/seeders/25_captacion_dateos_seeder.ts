import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import CaptacionDateo, { type Canal } from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'
import Convenio from '#models/convenio'

/** Helpers */
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

function makePhone(): string {
  // 10 dígitos, empieza en 3
  return '3' + String(rand(100000000, 999999999))
}

function makePlateSet(total: number): string[] {
  // Placa AAA000–ZZZ999 (sin Ñ, ni caracteres raros)
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ' // sin O/Q/I para que se vean “más reales”
  const out: string[] = []
  const seen = new Set<string>()

  while (out.length < total) {
    const L = () =>
      letters[rand(0, letters.length - 1)] +
      letters[rand(0, letters.length - 1)] +
      letters[rand(0, letters.length - 1)]
    const N = () => String(rand(100, 999))
    const p = `${L()}${N()}`
    if (!seen.has(p)) {
      seen.add(p)
      out.push(p)
    }
  }
  return out
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default class CaptacionDateosSeeder extends BaseSeeder {
  public async run() {
    const trx = await db.transaction()

    try {
      const TOTAL = 50
      const hoy = DateTime.now().startOf('day')

      // ===== 1) Datos requeridos =====
      const conveniosActivos = await Convenio.query({ client: trx })
        .where('activo', true)
        .select(['id', 'nombre'])
      if (!conveniosActivos.length) {
        console.warn(
          '⚠️ No hay convenios activos: este seeder requiere convenios para canal asesor.'
        )
        await trx.commit()
        return
      }

      const asesoresCom = await AgenteCaptacion.query({ client: trx })
        .where('activo', true)
        .where('tipo', 'ASESOR_COMERCIAL')

      const asesoresConv = await AgenteCaptacion.query({ client: trx })
        .where('activo', true)
        .where('tipo', 'ASESOR_CONVENIO')

      const teles = await AgenteCaptacion.query({ client: trx })
        .where('activo', true)
        .where('tipo', 'ASESOR_TELEMERCADEO')

      // Canales (siempre asignaremos convenio cuando sea asesor)
      const canalesPool: Canal[] = [
        'ASESOR_COMERCIAL',
        'ASESOR_CONVENIO',
        'TELE',
        'FACHADA',
        'REDES',
      ]

      // ===== 2) Datos “reales” =====
      const placas = makePlateSet(TOTAL)
      const telefonos = Array.from({ length: TOTAL }, () => makePhone())

      // ===== 3) Crear dateos =====
      let created = 0
      for (let i = 0; i < TOTAL; i++) {
        const canal = pick(canalesPool)

        // agente / convenio (solo para canales asesor)
        let agenteId: number | null = null
        let convenioId: number | null = null

        if (canal === 'ASESOR_COMERCIAL') {
          if (!asesoresCom.length) continue // no hay asesores comerciales, omitir
          agenteId = pick(asesoresCom).id
          convenioId = pick(conveniosActivos).id
        } else if (canal === 'ASESOR_CONVENIO') {
          if (!asesoresConv.length) continue // no hay asesores de convenio, omitir
          agenteId = pick(asesoresConv).id
          convenioId = pick(conveniosActivos).id
        } else if (canal === 'TELE') {
          agenteId = teles.length ? pick(teles).id : null
          convenioId = null
        } else {
          // FACHADA / REDES
          agenteId = null
          convenioId = null
        }

        // Fecha de creación aleatoria últimos 45 días
        const createdAt = hoy.minus({ days: rand(0, 45), hours: rand(0, 23), minutes: rand(0, 59) })

        // Placa y teléfono
        const placa = placas[i]
        const telefono = telefonos[i]

        await CaptacionDateo.create(
          {
            canal,
            agenteId,
            convenioId, // <-- clave: convenio real para asesor
            placa,
            telefono,
            origen: 'UI',
            observacion: Math.random() < 0.2 ? 'Dateo de prueba' : null,
            resultado: 'PENDIENTE',
            createdAt,
            updatedAt: createdAt,
          } as any,
          { client: trx }
        )

        created++
      }

      await trx.commit()
      console.log(
        `✅ Captación: ${created} dateos creados con agente y convenio reales cuando aplica.`
      )
    } catch (err) {
      await trx.rollback()
      console.error('❌ Error seeding captacion_dateos:', err)
      throw err
    }
  }
}
