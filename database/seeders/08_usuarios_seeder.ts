import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Usuario from '#models/usuario'

export default class UsuarioSeeder extends BaseSeeder {
  public async run() {
    await Usuario.createMany([
      {
        id: 1,
        razonSocialId: 1,
        rolId: 1,
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        correo: 'admin@empresa.com',
        password: 'admin123', // ✅ Contraseña incluida
        fotoPerfil: '',
        sede: 'Bogotá',
        direccion: 'Calle 123 #45-67',
        celularPersonal: '3001234567',
        celularCorporativo: '3109876543',
        area: 'Administración',
        centroCosto: 'ADM-01',
        estado: 'activo',
        recomendaciones: true,
        epsId: 1,
        arlId: 3,
        afpId: 5,
        afcId: 7,
        ccfId: 9,
      },
      {
        id: 2,
        razonSocialId: 2,
        rolId: 2,
        nombres: 'Laura',
        apellidos: 'González',
        correo: 'rrhh@empresa.com',
        password: 'rrhh123', // ✅ Contraseña incluida
        fotoPerfil: '',
        sede: 'Ibagué',
        direccion: 'Cra 9 #10-20',
        celularPersonal: '3012345678',
        celularCorporativo: '3112233445',
        area: 'Recursos Humanos',
        centroCosto: 'RRHH-02',
        estado: 'activo',
        recomendaciones: false,
        epsId: 2,
        arlId: 4,
        afpId: 6,
        afcId: 8,
        ccfId: 10,
      },
    ])
  }
}
