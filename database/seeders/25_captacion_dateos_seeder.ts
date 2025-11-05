// database/seeders/25_captacion_dateos_seeder.ts
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
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ' // sin O/Q/I
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

      // ===== Ventana para crear "recientes" =====
      const TTL_SIN_CONSUMIR = Number(process.env.TTL_SIN_CONSUMIR_DIAS ?? 7) // ej. 7
      const MAX_DIAS_ATRAS = Number(process.env.DATEOS_MAX_DIAS_ATRAS ?? 5) // ej. 5
      // Nunca generes más atrás que el TTL-1, para que salgan vigentes.
      // Forzamos que la ventana máxima sea 1 día (hoy o ayer) para el tema de vencimiento.
      const WINDOW_DAYS = Math.min(1, Math.max(0, Math.min(MAX_DIAS_ATRAS, TTL_SIN_CONSUMIR - 1)))

      // ===== 1) Datos requeridos =====
      const conveniosActivos = await Convenio.query({ client: trx })
        .where('activo', true)
        .select(['id', 'nombre'])

      if (!conveniosActivos.length) {
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
      for (let i = 0; i < TOTAL; i++) {
        const canal = pick(canalesPool)

        // agente / convenio (solo para canales asesor)
        let agenteId: number | null = null
        let convenioId: number | null = null

        if (canal === 'ASESOR_COMERCIAL') {
          if (!asesoresCom.length) continue
          agenteId = pick(asesoresCom).id
          convenioId = pick(conveniosActivos).id
        } else if (canal === 'ASESOR_CONVENIO') {
          if (!asesoresConv.length) continue
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

        // ⏱️ Fecha de creación **reciente** (dentro de la ventana calculada: hoy o 1 día atrás)
        const createdAt = hoy.minus({
          days: rand(0, WINDOW_DAYS),
          hours: rand(0, 23),
          minutes: rand(0, 59),
        })

        await CaptacionDateo.create(
          {
            canal,
            agenteId,
            convenioId,
            placa: placas[i],
            telefono: telefonos[i],
            origen: 'UI',
            observacion: Math.random() < 0.2 ? 'Dateo de prueba' : null,
            resultado: 'PENDIENTE',
            createdAt,
            updatedAt: createdAt,
          } as any,
          { client: trx }
        )
      }

      await trx.commit()
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }
}
