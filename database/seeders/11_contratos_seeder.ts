import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Contrato from '#models/contrato'
import Sede from '#models/sede' // Importar el modelo Sede
import Usuario from '#models/usuario' // Importar el modelo Usuario
import { DateTime } from 'luxon' // Importar DateTime si se usa para las fechas

export default class ContratosSeeder extends BaseSeeder {
  public async run() {
    // Es crucial que el seeder de Sede y Usuario se ejecuten *antes* que este.

    // Obtenemos un ID de sede existente
    const bogotaSede = await Sede.findBy('nombre', 'Bogotá')
    if (!bogotaSede) {
      console.error('ERROR: No se encontró la sede "Bogotá" para el ContratosSeeder.')
      return
    }

    // Obtenemos los usuarios existentes que se necesitan para los contratos
    // ✅ MEJORA: Buscar usuarios por correo electrónico en lugar de ID fijo para mayor robustez
    const usuarioAdmin = await Usuario.findBy('correo', 'admin@empresa.com')
    const usuarioContabilidad = await Usuario.findBy('correo', 'laura.gonzalez@empresa.com')

    if (!usuarioAdmin || !usuarioContabilidad) {
      console.error(
        'ERROR: Faltan registros de usuarios (admin@empresa.com o laura.gonzalez@empresa.com) para el ContratosSeeder. Asegúrate que el UsuarioSeeder se ejecute primero y cree los usuarios esperados con estos correos.'
      )
      return
    }

    await Contrato.createMany([
      {
        // NO incluyas 'id' explícitamente a menos que tengas un motivo muy específico y manejes el auto-incremento.
        // La BD lo asignará automáticamente.
        usuarioId: usuarioAdmin.id, // Usar el ID del usuario existente
        sedeId: bogotaSede.id, // Asignar el ID de la sede
        tipoContrato: 'laboral', // Coincide con el ENUM en la migración
        estado: 'activo',
        fechaInicio: DateTime.fromISO('2024-01-10'), // Convertir string a DateTime
        fechaFin: undefined, // Usar undefined en lugar de null para fechas opcionales
      },
      {
        // NO incluyas 'id' explícitamente
        usuarioId: usuarioContabilidad.id, // Usar el ID del usuario existente (Laura González)
        sedeId: bogotaSede.id, // Asignar el ID de la sede
        tipoContrato: 'prestacion', // Coincide con el ENUM en la migración
        estado: 'activo',
        fechaInicio: DateTime.fromISO('2024-03-01'), // Convertir string a DateTime
        fechaFin: DateTime.fromISO('2024-12-31'), // Convertir string a DateTime
      },
      // Puedes agregar más contratos aquí, asegurándote de usar los IDs correctos de usuario y sede.
    ])
  }
}
