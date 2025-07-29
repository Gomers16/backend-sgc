import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Cargo from '#models/cargo' // Importación usando alias

export default class CargoSeeder extends BaseSeeder {
  async run() {
    const cargos = [
      { nombre: 'ADMINISTRAD@R' },
      { nombre: 'COORDINADOR TALENTO HUMANO' },
      { nombre: 'CONTADOR' },
      { nombre: 'AUX CONTABLE SENIOR' },
      { nombre: 'AUX CONTABLE JUNIOR' },
      { nombre: 'DIR. TECNICO' },
      { nombre: 'DIR. TECNICO SUPLENTE' },
      { nombre: 'INSPECTOR' },
      { nombre: 'LIDER DE AREA' },
      { nombre: 'ASESOR DE SERVICIO AL CLIENTE Y VENTAS' }, // Primera aparición
      { nombre: 'RECEPCIONISTA MOVILIZADOR' },
      { nombre: 'GERENCIA' },
      { nombre: 'GERENCIA FINANCIERA' },
      { nombre: 'DIR CALIDAD Y LIDER SEDE IBG ENCARGADA' },
      { nombre: 'LIDER OPERATIVO' },
      { nombre: 'DIR. ADMINISTRATIVA Y COMERCIAL' },
      { nombre: 'LIDER SEDE BOGOTA' },
      { nombre: 'AUXILIAR ADMINISTRATIVA' },
      // La segunda aparición de 'ASESOR DE SERVICIO AL CLIENTE Y VENTAS' ha sido eliminada
    ]

    // Filtra para cargos únicos por nombre antes de crearlos
    const uniqueCargos = Array.from(new Set(cargos.map((c) => c.nombre))).map((nombre) => ({
      nombre,
    }))

    await Cargo.createMany(uniqueCargos)
  }
}
