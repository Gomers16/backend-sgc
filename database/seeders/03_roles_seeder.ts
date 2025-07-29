import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Rol from '#models/rol' // Importación correcta usando alias

export default class RolSeeder extends BaseSeeder {
  async run() {
    const roles = [
      // Roles esenciales basados en áreas funcionales clave
      { nombre: 'ADMINISTRADOR CONTROL TOTAL' }, // Para acceso total al sistema
      { nombre: 'CONTABILIDAD' }, // Usuarios del área de contabilidad
      { nombre: 'TALENTO_HUMANO' }, // Usuarios del área de talento humano
      { nombre: 'OPERACIONES' }, // Usuarios del área de operaciones
      { nombre: 'COMERCIAL' }, // Usuarios del área comercial
      // Puedes añadir otros roles si son necesarios, pero que sean consistentes con lo que buscas
    ]

    // Filtra para roles únicos por nombre antes de crearlos, para evitar duplicados
    const uniqueRoles = Array.from(new Set(roles.map((r) => r.nombre))).map((nombre) => ({
      nombre,
    }))

    await Rol.createMany(uniqueRoles)
  }
}
