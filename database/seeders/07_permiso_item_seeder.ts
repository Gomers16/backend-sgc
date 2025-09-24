import { BaseSeeder } from '@adonisjs/lucid/seeders'
import PermisoItem from '#models/permiso_item'

export default class PermisoItemSeeder extends BaseSeeder {
  public async run() {
    await PermisoItem.createMany([
      // Gestión Documental (id: 1)
      { id: 1, itemId: 1, permisoId: 1 }, // ver
      { id: 2, itemId: 1, permisoId: 2 }, // crear
      { id: 3, itemId: 1, permisoId: 3 }, // editar

      // Contratos (id: 2)
      { id: 4, itemId: 2, permisoId: 1 },
      { id: 5, itemId: 2, permisoId: 2 },
      { id: 6, itemId: 2, permisoId: 3 },

      // Usuarios (id: 3)
      { id: 7, itemId: 3, permisoId: 1 },
      { id: 8, itemId: 3, permisoId: 2 },
      { id: 9, itemId: 3, permisoId: 3 },
      { id: 10, itemId: 3, permisoId: 4 },

      // Permisos (id: 4)
      { id: 11, itemId: 4, permisoId: 1 },
      { id: 12, itemId: 4, permisoId: 3 },
    ])
  }
}
