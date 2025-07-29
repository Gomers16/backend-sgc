import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Item from '#models/item'

export default class ItemSeeder extends BaseSeeder {
  public async run() {
    await Item.createMany([
      {
        id: 1,
        nombre: 'Gestión Documental',
        ruta: '/documental',
        descripcion: 'Módulo para registrar y consultar documentación del personal',
      },
      {
        id: 2,
        nombre: 'Contratos',
        ruta: '/contratos',
        descripcion: 'Visualización y seguimiento de contratos por usuario',
      },
      {
        id: 3,
        nombre: 'Usuarios',
        ruta: '/usuarios',
        descripcion: 'Administración de usuarios del sistema',
      },
      {
        id: 4,
        nombre: 'Permisos',
        ruta: '/permisos',
        descripcion: 'Configuración de roles, permisos y accesos',
      },
    ])
  }
}
