import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Cargo from '#models/cargo'

export default class CargoSeeder extends BaseSeeder {
  async run() {
    const cargos = [
      // 🏢 Direcciones
      { nombre: 'DIRECCION DE CALIDAD Y AUDITORÍA' },
      { nombre: 'DIRECCION ADMINISTRATIVA Y COMERCIAL' },

      // 👥 Áreas administrativas y gerenciales
      { nombre: 'GERENCIA' }, // ✅ NUEVO
      { nombre: 'TALENTO HUMANO' },
      { nombre: 'CONTADOR' },

      // 🎯 Líderes
      { nombre: 'LIDER DE SEDE' }, // ✅ NUEVO
      { nombre: 'LIDER DE INFORMES' }, // ✅ NUEVO

      // 🤝 Comercial
      { nombre: 'ASESOR COMERCIAL' },
      { nombre: 'ASESOR CONVENIO' },

      // 👨‍💼 Servicio al cliente
      { nombre: 'ASESOR SERVICIO AL CLIENTE' }, // ✅ NUEVO (reemplaza a registro, caja, puerta, telemercadeo)

      // 🔧 Técnico
      { nombre: 'INGENIERO' }, // ✅ NUEVO
      { nombre: 'INSPECTOR' },
    ]

    // Filtra para cargos únicos por nombre antes de crearlos
    const uniqueCargos = Array.from(new Set(cargos.map((c) => c.nombre))).map((nombre) => ({
      nombre,
    }))

    await Cargo.createMany(uniqueCargos)
  }
}
