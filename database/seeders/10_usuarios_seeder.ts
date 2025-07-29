import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Usuario from '#models/usuario'
import Sede from '#models/sede'
import Rol from '#models/rol'
import Cargo from '#models/cargo'

export default class UsuarioSeeder extends BaseSeeder {
  public async run() {
    // Es crucial que los seeders de Sede, Rol, Cargo y EntidadSalud se ejecuten *antes* que este.

    // Obtenemos los IDs de las sedes
    const bogotaSede = await Sede.findBy('nombre', 'Bogotá')
    const ibagueSede = await Sede.findBy('nombre', 'Ibagué')

    // Obtenemos los IDs de los roles
    // ✅ CORREGIDO: El nombre del rol debe coincidir exactamente con el seeder de Roles
    const adminRol = await Rol.findBy('nombre', 'ADMINISTRADOR CONTROL TOTAL')
    const contabilidadRol = await Rol.findBy('nombre', 'CONTABILIDAD')

    // Obtenemos los IDs de los cargos
    // ✅ CORREGIDO: El nombre del cargo debe coincidir exactamente con el seeder de Cargos
    const administradoraCargo = await Cargo.findBy('nombre', 'ADMINISTRAD@R')
    const contableSeniorCargo = await Cargo.findBy('nombre', 'AUX CONTABLE SENIOR')

    // Asegúrate de que los IDs existan antes de usarlos
    if (
      !bogotaSede ||
      !ibagueSede ||
      !adminRol ||
      !contabilidadRol ||
      !administradoraCargo ||
      !contableSeniorCargo
    ) {
      console.error(
        'ERROR: Faltan registros de Sede, Rol o Cargo para UsuarioSeeder. Asegúrate de que sus seeders se ejecuten primero y con los nombres correctos.'
      )
      return // Salimos si no encontramos las dependencias necesarias
    }

    await Usuario.createMany([
      {
        razonSocialId: 1, // Asegúrate de que este ID exista (seeder de razon_social)
        rolId: adminRol.id,
        cargoId: administradoraCargo.id, // Asigna el ID del cargo
        sedeId: bogotaSede.id,
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        correo: 'admin@empresa.com',
        password: 'admin123', // Contraseña en texto plano
        fotoPerfil: '',
        direccion: 'Calle 123 #45-67',
        celularPersonal: '3001234567',
        celularCorporativo: '3109876543',
        centroCosto: 'ADM-01',
        estado: 'activo',
        recomendaciones: true,
        epsId: 1, // Asegúrate de que estos IDs existan (seeder de entidades_salud)
        arlId: 11, // Ajustado para coincidir con tu EntidadSaludSeeder
        afpId: 17, // Ajustado para coincidir con tu EntidadSaludSeeder
        afcId: 22, // Ajustado para coincidir con tu EntidadSaludSeeder
        ccfId: 27, // Ajustado para coincidir con tu EntidadSaludSeeder
      },
      {
        razonSocialId: 2, // Asegúrate de que este ID exista
        rolId: contabilidadRol.id, // Asigna el rol de Contabilidad
        cargoId: contableSeniorCargo.id, // Asigna el cargo de Aux Contable Senior
        sedeId: ibagueSede.id,
        nombres: 'Laura',
        apellidos: 'González',
        correo: 'laura.gonzalez@empresa.com', // Correo distinto para el segundo usuario
        password: 'laura123', // Contraseña en texto plano
        fotoPerfil: '',
        direccion: 'Cra 9 #10-20',
        celularPersonal: '3012345678',
        celularCorporativo: '3112233445',
        centroCosto: 'CON-02',
        estado: 'activo',
        recomendaciones: false,
        epsId: 2, // Asegúrate de que estos IDs existan
        arlId: 12, // Ajustado para coincidir con tu EntidadSaludSeeder
        afpId: 18, // Ajustado para coincidir con tu EntidadSaludSeeder
        afcId: 23, // Ajustado para coincidir con tu EntidadSaludSeeder
        ccfId: 28, // Ajustado para coincidir con tu EntidadSaludSeeder
      },
      // Puedes agregar más usuarios aquí
    ])
  }
}
