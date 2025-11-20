// database/seeders/vehiculos_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Vehiculo from '#models/vehiculo'
import ClaseVehiculo from '#models/clase_vehiculos'
import Cliente from '#models/cliente'

type ClaseCode = 'LIV_PART' | 'LIV_TAXI' | 'LIV_PUBLICO' | 'MOTO'

export default class VehiculosSeeder extends BaseSeeder {
  public async run() {
    // === 1) Catálogo de clases -> id (asegúrate de correr primero el seeder de clases) ===
    const clases = await ClaseVehiculo.query().select(['id', 'codigo'])
    const byCode = new Map<ClaseCode, number>()
    clases.forEach((c) => {
      const code = String(c.codigo) as ClaseCode
      if (['LIV_PART', 'LIV_TAXI', 'LIV_PUBLICO', 'MOTO'].includes(code)) {
        byCode.set(code, c.id)
      }
    })

    const required: ClaseCode[] = ['LIV_PART', 'LIV_TAXI', 'LIV_PUBLICO', 'MOTO']
    const missing = required.filter((k) => !byCode.has(k))
    if (missing.length) {
      console.warn(
        `⚠️  VehiculosSeeder: faltan clases en el catálogo: ${missing.join(
          ', '
        )}. No se crearán vehículos.`
      )
      return
    }

    // === 2) Utilidades ===
    const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
    const randInt = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1)) + min

    const genPlate = (): string => {
      const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ' // sin O/Q
      const L = () => letters[randInt(0, letters.length - 1)]
      const N = () => String(randInt(0, 9))
      return `${L()}${L()}${L()}${N()}${N()}${N()}`
    }

    // === 3) Catálogo marcas/líneas/colores ===
    const CAR_BRANDS = ['Chevrolet', 'Renault', 'Mazda', 'Kia', 'Toyota', 'Nissan'] as const
    const CAR_LINES = [
      'Spark GT',
      'Sail',
      'Sandero',
      'Logan',
      'Duster',
      'Mazda 3',
      'Picanto',
      'Rio',
      'Corolla',
      'Yaris',
      'March',
      'Versa',
    ] as const

    const MOTO_BRANDS = ['Bajaj', 'AKT', 'Yamaha', 'Honda', 'Suzuki', 'TVS'] as const
    const MOTO_LINES = ['Pulsar', 'NKD', 'FZ', 'XR', 'Gixxer', 'Sport'] as const

    const COLORS = [
      'Blanco',
      'Negro',
      'Gris',
      'Rojo',
      'Azul',
      'Plata',
      'Beige',
      'Verde',
      'Amarillo',
    ] as const

    // % de motos
    const MOTOS_RATIO = 0.35

    const pickClaseAndSpec = (): {
      claseCode: ClaseCode
      marca: string
      linea: string
      modelo: number
      color: string | null
    } => {
      const color = pick(COLORS)
      const isMoto = Math.random() < MOTOS_RATIO

      if (isMoto) {
        return {
          claseCode: 'MOTO',
          marca: pick(MOTO_BRANDS),
          linea: pick(MOTO_LINES),
          modelo: randInt(2012, 2024),
          color,
        }
      }

      // Carro: 75% particular, 15% taxi, 10% público
      const r = Math.random()
      const claseCode: ClaseCode = r < 0.75 ? 'LIV_PART' : r < 0.9 ? 'LIV_TAXI' : 'LIV_PUBLICO'
      return {
        claseCode,
        marca: pick(CAR_BRANDS),
        linea: pick(CAR_LINES),
        modelo: randInt(2010, 2024),
        color,
      }
    }

    // === 4) Clientes disponibles ===
    const clientes = await Cliente.query().select(['id'])
    const clienteIds = clientes.map((c) => c.id)
    const hasClientes = clienteIds.length > 0

    // === 5) Evitar colisiones de placa con lo que ya exista ===
    const existentes = await Vehiculo.query().select(['placa'])
    const usedPlates = new Set(existentes.map((v) => v.placa.toUpperCase()))
    const uniquePlate = (): string => {
      let p = genPlate()
      let guard = 0
      while (usedPlates.has(p) && guard < 5000) {
        p = genPlate()
        guard++
      }
      usedPlates.add(p)
      return p
    }

    // === 6) Volumen + reparto multi-vehículo ===
    const TOTAL_VEHICULOS = 50
    const CLIENTES_MULTI_RATIO = 0.4 // 40% de los clientes que toquemos tendrán 2–3 vehículos
    const VEH_POR_CLIENTE_MIN = 2
    const VEH_POR_CLIENTE_MAX = 3

    const shuffle = <T>(arr: T[]): T[] => {
      const a = [...arr]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }

    // === 7) Bloque de clientes con varios vehículos ===
    let creados = 0
    if (hasClientes) {
      const candidatos = shuffle(clienteIds).slice(
        0,
        Math.max(1, Math.floor(clienteIds.length * 0.5))
      )
      for (const cid of candidatos) {
        if (creados >= TOTAL_VEHICULOS) break
        const multi = Math.random() < CLIENTES_MULTI_RATIO
        const cuantos = multi ? randInt(VEH_POR_CLIENTE_MIN, VEH_POR_CLIENTE_MAX) : 1

        for (let k = 0; k < cuantos && creados < TOTAL_VEHICULOS; k++) {
          const { claseCode, marca, linea, modelo, color } = pickClaseAndSpec()
          const claseId = byCode.get(claseCode)!
          const placa = uniquePlate()

          await Vehiculo.updateOrCreate(
            { placa },
            {
              placa,
              claseVehiculoId: claseId,
              marca,
              linea,
              modelo,
              color,
              // Matrícula “fake” para dev: TP- + placa
              matricula: `TP-${placa}`,
              clienteId: cid,
            }
          )
          creados++
        }
      }
    }

    // === 8) Completar el resto (algunos sin cliente para tests) ===
    while (creados < TOTAL_VEHICULOS) {
      const { claseCode, marca, linea, modelo, color } = pickClaseAndSpec()
      const claseId = byCode.get(claseCode)!
      const placa = uniquePlate()
      const clienteId =
        hasClientes && Math.random() < 0.6 ? pick(clienteIds as unknown as number[]) : null

      await Vehiculo.updateOrCreate(
        { placa },
        {
          placa,
          claseVehiculoId: claseId,
          marca,
          linea,
          modelo,
          color,
          matricula: `TP-${placa}`,
          clienteId,
        }
      )
      creados++
    }

    // === 9) Garantía: todo cliente debe tener al menos 1 vehículo ===
    const clientesTodos = await Cliente.query().select(['id'])
    for (const c of clientesTodos) {
      const ya = await Vehiculo.query().where('cliente_id', c.id).first()
      if (!ya) {
        const { claseCode, marca, linea, modelo, color } = pickClaseAndSpec()
        const placa = uniquePlate()
        await Vehiculo.create({
          placa,
          claseVehiculoId: byCode.get(claseCode)!,
          marca,
          linea,
          modelo,
          color,
          matricula: `TP-${placa}`,
          clienteId: c.id,
        })
      }
    }

    console.log(
      `✅ VehiculosSeeder: creados/actualizados ${creados} vehículos (mín. 1 por cliente garantizado).`
    )
  }
}
