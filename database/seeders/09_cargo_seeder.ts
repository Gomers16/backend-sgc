import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Cargo from '#models/cargo' // Importación usando alias

export default class CargoSeeder extends BaseSeeder {
  async run() {
    const cargos = [
      { nombre: 'DIRECCION FINANCIERA' },
      { nombre: 'DIRECCION DE CALIDAD Y AUDITORÍA' },
      { nombre: 'DIRECCION ADMINSITRATIVA Y COMERCIAL' },
      { nombre: 'TALENTO HUMANO' },
      { nombre: 'CONTADOR' },
      { nombre: 'AUXILIAR CONTABLE JUNIOR' },
      { nombre: 'AUXILIAR CONTABLE SENIOR' },
      { nombre: 'LIDER DE SERVICIO AL CLIENTE' },
      { nombre: 'ASESOR COMERCIAL' }, // <- actualizado
      { nombre: 'ASESOR CONVENIO' }, // <- agregado
      { nombre: 'ASESOR - REGISTRO' },
      { nombre: 'ASESOR - CAJA' },
      { nombre: 'ASESOR - PUERTA' },
      { nombre: 'ASESOR - TELEMERCADEO' },
      { nombre: 'DIRECTOR TECNICO' },
      { nombre: 'DIRECTOR TECNICO SUPLENTE' },
      { nombre: 'INSPECTOR' },
    ]

    // Filtra para cargos únicos por nombre antes de crearlos
    const uniqueCargos = Array.from(new Set(cargos.map((c) => c.nombre))).map((nombre) => ({
      nombre,
    }))

    await Cargo.createMany(uniqueCargos)
  }
}
