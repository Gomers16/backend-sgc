import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permiso from '#models/permiso'

export default class PermisoSeeder extends BaseSeeder {
  public async run() {
    await Permiso.createMany([
      {
        id: 1,
        nombre: 'ver',
        descripcion: 'Permite visualizar registros',
      },
      {
        id: 2,
        nombre: 'crear',
        descripcion: 'Permite crear nuevos registros',
      },
      {
        id: 3,
        nombre: 'editar',
        descripcion: 'Permite modificar registros existentes',
      },
      {
        id: 4,
        nombre: 'eliminar',
        descripcion: 'Permite borrar registros',
      },
    ])
  }
}
