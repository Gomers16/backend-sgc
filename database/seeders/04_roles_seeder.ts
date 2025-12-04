import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Rol from '#models/rol'

export default class RolSeeder extends BaseSeeder {
  async run() {
    // 🔥 Limpiamos para desarrollo
    await Rol.query().delete()

    const roles = [
      { nombre: 'SUPER_ADMIN' }, // Tú
      { nombre: 'GERENCIA' }, // Gerente, Jefe Sede, Directora Comercial
      { nombre: 'COMERCIAL' }, // 👈 Asesores Comerciales + Convenios
      { nombre: 'CONTABILIDAD' }, // Contador, Auxiliares
      { nombre: 'TALENTO_HUMANO' }, // RRHH
      { nombre: 'OPERATIVO_TURNOS' }, // Puerta, Caja, Ingeniero, Inspector
    ]

    await Rol.createMany(roles)
    console.log('✅ 6 roles creados')
  }
}
