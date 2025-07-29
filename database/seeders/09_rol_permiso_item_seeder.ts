import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RolPermisoItem from '#models/rol_permiso_item'

export default class RolPermisoItemSeeder extends BaseSeeder {
  public async run() {
    await RolPermisoItem.createMany([
      // Admin: todos los permisos sobre todo
      { id: 1, rolId: 1, permisoItemId: 1 },
      { id: 2, rolId: 1, permisoItemId: 2 },
      { id: 3, rolId: 1, permisoItemId: 3 },
      { id: 4, rolId: 1, permisoItemId: 4 },
      { id: 5, rolId: 1, permisoItemId: 5 },
      { id: 6, rolId: 1, permisoItemId: 6 },
      { id: 7, rolId: 1, permisoItemId: 7 },
      { id: 8, rolId: 1, permisoItemId: 8 },
      { id: 9, rolId: 1, permisoItemId: 9 },
      { id: 10, rolId: 1, permisoItemId: 10 },
      { id: 11, rolId: 1, permisoItemId: 11 },
      { id: 12, rolId: 1, permisoItemId: 12 },

      // RRHH: Acceso a Gestión Documental, Contratos y Usuarios (sin eliminar)
      { id: 13, rolId: 2, permisoItemId: 1 },
      { id: 14, rolId: 2, permisoItemId: 2 },
      { id: 15, rolId: 2, permisoItemId: 3 },
      { id: 16, rolId: 2, permisoItemId: 4 },
      { id: 17, rolId: 2, permisoItemId: 5 },
      { id: 18, rolId: 2, permisoItemId: 6 },
      { id: 19, rolId: 2, permisoItemId: 7 },
      { id: 20, rolId: 2, permisoItemId: 8 },
      { id: 21, rolId: 2, permisoItemId: 9 },

      // Técnico: solo puede ver contratos
      { id: 22, rolId: 3, permisoItemId: 4 },

      // Operador: solo puede ver Gestión Documental
      { id: 23, rolId: 4, permisoItemId: 1 },
    ])
  }
}
