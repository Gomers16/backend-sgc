// database/seeders/22_prospectos_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import Prospecto, { type ProspectoOrigen } from '#models/prospecto'
import AgenteCaptacion from '#models/agente_captacion'

const ORIGENES: ProspectoOrigen[] = ['IMPORT', 'CAMPO', 'EVENTO', 'OTRO']

/* ---------- helpers ---------- */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function nombre(): string {
  const n1 = [
    'Ana',
    'Luis',
    'Carlos',
    'María',
    'Andrés',
    'Camila',
    'Sofía',
    'Julián',
    'Pedro',
    'Laura',
  ]
  const n2 = ['Gómez', 'Pérez', 'Rodríguez', 'López', 'Martínez', 'Hernández']
  return `${pick(n1)} ${pick(n2)}`
}
function phone(): string {
  return '3' + String(randInt(100000000, 999999999))
}

/** Genera una placa colombiana AAA123 (sin O/Q), única frente a BD + set local */
function makePlateFactory(existing: Set<string>) {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ' // sin O / Q
  const L = () => letters[randInt(0, letters.length - 1)]
  const N = () => String(randInt(0, 9))
  return () => {
    let p = ''
    let guard = 0
    do {
      p = `${L()}${L()}${L()}${N()}${N()}${N()}`
      guard++
    } while (existing.has(p) && guard < 10000)
    existing.add(p)
    return p
  }
}

/** 60% vigentes, 40% vencidos, con ventanas razonables */
function genVigencia(hoy: DateTime): { vigente: boolean; vencimiento: DateTime | null } {
  const vigente = Math.random() < 0.6
  if (vigente) return { vigente, vencimiento: hoy.plus({ days: randInt(10, 320) }) }
  return { vigente, vencimiento: hoy.minus({ days: randInt(5, 180) }) }
}

export default class ProspectosSeeder extends BaseSeeder {
  public async run() {
    const trx = await db.transaction()
    try {
      const tz = 'America/Bogota'
      const hoy = DateTime.local().setZone(tz).startOf('day')

      // 1) Preparamos asesoría disponible
      const agentes = await AgenteCaptacion.query({ client: trx }).whereIn('tipo', [
        'ASESOR_COMERCIAL',
        'ASESOR_CONVENIO',
      ] as const)

      // 2) Evitar colisiones de placa con lo que ya existe en prospectos
      const ya = await trx.from('prospectos').select('placa').whereNotNull('placa')
      const used = new Set<string>(ya.map((r: any) => String(r.placa).toUpperCase()))
      const uniquePlate = makePlateFactory(used)

      // 3) Generamos
      const TOTAL = 50
      for (let i = 0; i < TOTAL; i++) {
        const createdAt = hoy.minus({ days: randInt(0, 45) })
        const tel = phone()
        const agente = agentes.length ? pick(agentes) : null
        const creadoPor = agente?.usuarioId ?? null

        const soat = genVigencia(hoy)
        const tecno = genVigencia(hoy)
        const prev = genVigencia(hoy)
        const peritajeUltima = Math.random() < 0.7 ? hoy.minus({ days: randInt(10, 400) }) : null

        // 🔒 Siempre con PLACA (única)
        const placa = uniquePlate()

        await Prospecto.updateOrCreate(
          { telefono: tel }, // idempotencia por teléfono
          {
            telefono: tel,
            nombre: nombre(),
            placa, // <-- nunca null
            observaciones: Math.random() < 0.3 ? 'Prospecto demo' : null,
            origen: pick(ORIGENES),

            // documentos / servicios
            soatVigente: soat.vigente,
            soatVencimiento: soat.vencimiento,
            tecnoVigente: tecno.vigente,
            tecnoVencimiento: tecno.vencimiento,
            preventivaVigente: prev.vigente,
            preventivaVencimiento: prev.vencimiento ?? null,
            peritajeUltimaFecha: peritajeUltima,

            // meta
            creadoPor,
            createdAt,
            updatedAt: createdAt,
          } as any,
          { client: trx }
        )
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
