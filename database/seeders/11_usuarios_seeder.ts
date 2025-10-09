// database/seeders/11_usuarios_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'
import Usuario from '#models/usuario'
import Sede from '#models/sede'
import Rol from '#models/rol'
import Cargo from '#models/cargo'

export default class UsuarioSeeder extends BaseSeeder {
  public async run() {
    // ---------- helpers ----------
    const pickExistingTable = async (candidates: string[]) => {
      for (const t of candidates) {
        try {
          await Database.from(t).count('* as c')
          return t
        } catch {}
      }
      return candidates[0]
    }

    // ⚠️ Ahora SOLO busca por nombre; si no existe, lanza error (no inserta para evitar duplicados)
    const getRazonSocialIdByNombre = async (table: string, nombre: string) => {
      const existing = await Database.from(table).select('id').where('nombre', nombre).first()
      if (!existing?.id) {
        throw new Error(
          `Falta razón social "${nombre}". Corre primero database/seeders/razon_social_seeder.ts`
        )
      }
      return Number(existing.id)
    }

    // ---------- dependencias (sedes, roles, cargos) ----------
    const bogotaSede = await Sede.findBy('nombre', 'Bogotá')
    const ibagueSede = await Sede.findBy('nombre', 'Ibagué')

    const adminRol = await Rol.findBy('nombre', 'ADMINISTRADOR CONTROL TOTAL')
    const contabilidadRol = await Rol.findBy('nombre', 'CONTABILIDAD')
    const comercialRol = await Rol.findBy('nombre', 'COMERCIAL')
    const operacionesRol = await Rol.findBy('nombre', 'OPERACIONES')
    const talentoHumanoRol = await Rol.findBy('nombre', 'TALENTO_HUMANO')

    // Cargos
    const direccionFinancieraCargo = await Cargo.findBy('nombre', 'DIRECCION FINANCIERA')
    const direccionCalidadCargo = await Cargo.findBy('nombre', 'DIRECCION DE CALIDAD Y AUDITORÍA')
    const direccionAdminCargo = await Cargo.findBy('nombre', 'DIRECCION ADMINSITRATIVA Y COMERCIAL')
    const talentoHumanoCargo = await Cargo.findBy('nombre', 'TALENTO HUMANO')
    const contadorCargo = await Cargo.findBy('nombre', 'CONTADOR')
    const contableJuniorCargo = await Cargo.findBy('nombre', 'AUXILIAR CONTABLE JUNIOR')
    const contableSeniorCargo = await Cargo.findBy('nombre', 'AUXILIAR CONTABLE SENIOR')
    const liderServicioCargo = await Cargo.findBy('nombre', 'LIDER DE SERVICIO AL CLIENTE')
    const asesorComercialCargo = await Cargo.findBy('nombre', 'ASESOR COMERCIAL')
    const asesorConvenioCargo = await Cargo.findBy('nombre', 'ASESOR CONVENIO')
    const asesorRegistroCargo = await Cargo.findBy('nombre', 'ASESOR - REGISTRO')
    const asesorCajaCargo = await Cargo.findBy('nombre', 'ASESOR - CAJA')
    const asesorPuertaCargo = await Cargo.findBy('nombre', 'ASESOR - PUERTA')
    const asesorTelemerCargo = await Cargo.findBy('nombre', 'ASESOR - TELEMERCADEO')
    const directorTecnicoCargo = await Cargo.findBy('nombre', 'DIRECTOR TECNICO')
    const directorTecnicoSuplenteCargo = await Cargo.findBy('nombre', 'DIRECTOR TECNICO SUPLENTE')
    const inspectorCargo = await Cargo.findBy('nombre', 'INSPECTOR')

    if (
      !bogotaSede ||
      !ibagueSede ||
      !adminRol ||
      !contabilidadRol ||
      !comercialRol ||
      !direccionFinancieraCargo ||
      !contableSeniorCargo ||
      !asesorComercialCargo ||
      !asesorConvenioCargo
    ) {
      console.error('❌ Faltan Sede/Rol/Cargo para UsuarioSeeder. Verifica los seeders previos.')
      return
    }

    // ---------- usar razones sociales ya sembradas (IDs fijos) ----------
    const rsTable = await pickExistingTable(['razon_socials', 'razones_sociales', 'razon_social'])

    // Busca por nombre (coinciden con tu razon_social_seeder)
    const rsId1 = await getRazonSocialIdByNombre(rsTable, 'CDA del Centro') // id = 1 según tu seeder
    const rsId2 = await getRazonSocialIdByNombre(rsTable, 'CDA Activa') // id = 2 según tu seeder

    // ---------- crea usuarios ----------
    await Usuario.createMany([
      // DIRECCIÓN Y ADMINISTRACIÓN
      {
        razonSocialId: rsId1,
        rolId: adminRol.id,
        cargoId: direccionFinancieraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        correo: 'carlos.rodriguez@empresa.com',
        password: 'admin123',
        fotoPerfil: '',
        direccion: 'Calle 123 #45-67',
        celularPersonal: '3001234567',
        celularCorporativo: '3109876543',
        centroCosto: 'ADM-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },
      {
        razonSocialId: rsId2,
        rolId: adminRol.id,
        cargoId: direccionCalidadCargo?.id || direccionFinancieraCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'María',
        apellidos: 'Sánchez',
        correo: 'maria.sanchez@empresa.com',
        password: 'admin123',
        fotoPerfil: '',
        direccion: 'Cra 5 #12-34',
        celularPersonal: '3002345678',
        celularCorporativo: '3119876543',
        centroCosto: 'CAL-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },
      {
        razonSocialId: rsId1,
        rolId: adminRol.id,
        cargoId: direccionAdminCargo?.id || direccionFinancieraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Jorge',
        apellidos: 'Mendoza',
        correo: 'jorge.mendoza@empresa.com',
        password: 'admin123',
        fotoPerfil: '',
        direccion: 'Av 68 #100-20',
        celularPersonal: '3003456789',
        celularCorporativo: '3129876543',
        centroCosto: 'ADM-02',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 3,
        arlId: 13,
        afpId: 19,
        afcId: 24,
        ccfId: 29,
      },

      // TALENTO HUMANO
      {
        razonSocialId: rsId1,
        rolId: talentoHumanoRol?.id || adminRol.id,
        cargoId: talentoHumanoCargo?.id || direccionFinancieraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Andrea',
        apellidos: 'López',
        correo: 'andrea.lopez@empresa.com',
        password: 'talento123',
        fotoPerfil: '',
        direccion: 'Calle 72 #10-30',
        celularPersonal: '3004567890',
        celularCorporativo: '3139876543',
        centroCosto: 'TH-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },

      // CONTABILIDAD
      {
        razonSocialId: rsId2,
        rolId: contabilidadRol.id,
        cargoId: contadorCargo?.id || contableSeniorCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Laura',
        apellidos: 'González',
        correo: 'laura.gonzalez@empresa.com',
        password: 'conta123',
        fotoPerfil: '',
        direccion: 'Cra 9 #10-20',
        celularPersonal: '3012345678',
        celularCorporativo: '3112233445',
        centroCosto: 'CON-01',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },
      {
        razonSocialId: rsId1,
        rolId: contabilidadRol.id,
        cargoId: contableJuniorCargo?.id || contableSeniorCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Pedro',
        apellidos: 'Ramírez',
        correo: 'pedro.ramirez@empresa.com',
        password: 'conta123',
        fotoPerfil: '',
        direccion: 'Calle 45 #23-10',
        celularPersonal: '3015678901',
        celularCorporativo: '3143214567',
        centroCosto: 'CON-02',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 3,
        arlId: 13,
        afpId: 19,
        afcId: 24,
        ccfId: 29,
      },
      {
        razonSocialId: rsId2,
        rolId: contabilidadRol.id,
        cargoId: contableSeniorCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Sofía',
        apellidos: 'Torres',
        correo: 'sofia.torres@empresa.com',
        password: 'conta123',
        fotoPerfil: '',
        direccion: 'Cra 3 #15-40',
        celularPersonal: '3016789012',
        celularCorporativo: '3154321098',
        centroCosto: 'CON-03',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },

      // LÍDER DE SERVICIO AL CLIENTE
      {
        razonSocialId: rsId1,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: liderServicioCargo?.id || direccionFinancieraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Camila',
        apellidos: 'Vargas',
        correo: 'camila.vargas@empresa.com',
        password: 'lider123',
        fotoPerfil: '',
        direccion: 'Calle 100 #15-20',
        celularPersonal: '3017890123',
        celularCorporativo: '3165432109',
        centroCosto: 'SAC-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },

      // ASESORES COMERCIALES (5)
      {
        razonSocialId: rsId1,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorComercialCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Juan',
        apellidos: 'Morales',
        correo: 'juan.morales@empresa.com',
        password: 'comercial123',
        fotoPerfil: '',
        direccion: 'Calle 85 #30-40',
        celularPersonal: '3018901234',
        celularCorporativo: '3176543210',
        centroCosto: 'COM-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 3,
        arlId: 13,
        afpId: 19,
        afcId: 24,
        ccfId: 29,
      },
      {
        razonSocialId: rsId2,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorComercialCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Diana',
        apellidos: 'Castro',
        correo: 'diana.castro@empresa.com',
        password: 'comercial123',
        fotoPerfil: '',
        direccion: 'Cra 4 #20-15',
        celularPersonal: '3019012345',
        celularCorporativo: '3187654321',
        centroCosto: 'COM-02',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },
      {
        razonSocialId: rsId1,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorComercialCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Miguel',
        apellidos: 'Hernández',
        correo: 'miguel.hernandez@empresa.com',
        password: 'comercial123',
        fotoPerfil: '',
        direccion: 'Av 19 #120-30',
        celularPersonal: '3010123456',
        celularCorporativo: '3198765432',
        centroCosto: 'COM-03',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },
      {
        razonSocialId: rsId2,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorComercialCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Valentina',
        apellidos: 'Pérez',
        correo: 'valentina.perez@empresa.com',
        password: 'comercial123',
        fotoPerfil: '',
        direccion: 'Calle 10 #5-25',
        celularPersonal: '3011234567',
        celularCorporativo: '3101234567',
        centroCosto: 'COM-04',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 3,
        arlId: 13,
        afpId: 19,
        afcId: 24,
        ccfId: 29,
      },
      {
        razonSocialId: rsId1,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorComercialCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Andrés',
        apellidos: 'Martínez',
        correo: 'andres.martinez@empresa.com',
        password: 'comercial123',
        fotoPerfil: '',
        direccion: 'Calle 127 #50-10',
        celularPersonal: '3012345670',
        celularCorporativo: '3112345670',
        centroCosto: 'COM-05',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },

      // ASESORES CONVENIO (4)
      {
        razonSocialId: rsId1,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorConvenioCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Carolina',
        apellidos: 'Rojas',
        correo: 'carolina.rojas@empresa.com',
        password: 'convenio123',
        fotoPerfil: '',
        direccion: 'Calle 92 #25-15',
        celularPersonal: '3013456781',
        celularCorporativo: '3123456781',
        centroCosto: 'CONV-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },
      {
        razonSocialId: rsId2,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorConvenioCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Felipe',
        apellidos: 'Gutiérrez',
        correo: 'felipe.gutierrez@empresa.com',
        password: 'convenio123',
        fotoPerfil: '',
        direccion: 'Cra 7 #18-30',
        celularPersonal: '3014567892',
        celularCorporativo: '3134567892',
        centroCosto: 'CONV-02',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 3,
        arlId: 13,
        afpId: 19,
        afcId: 24,
        ccfId: 29,
      },
      {
        razonSocialId: rsId1,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorConvenioCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Natalia',
        apellidos: 'Jiménez',
        correo: 'natalia.jimenez@empresa.com',
        password: 'convenio123',
        fotoPerfil: '',
        direccion: 'Av 68 #80-45',
        celularPersonal: '3015678903',
        celularCorporativo: '3145678903',
        centroCosto: 'CONV-03',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },
      {
        razonSocialId: rsId2,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorConvenioCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Ricardo',
        apellidos: 'Álvarez',
        correo: 'ricardo.alvarez@empresa.com',
        password: 'convenio123',
        fotoPerfil: '',
        direccion: 'Calle 22 #8-10',
        celularPersonal: '3016789014',
        celularCorporativo: '3156789014',
        centroCosto: 'CONV-04',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },

      // OTROS CARGOS (uno de cada uno)
      {
        razonSocialId: rsId1,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: asesorRegistroCargo?.id || direccionFinancieraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Esteban',
        apellidos: 'Silva',
        correo: 'esteban.silva@empresa.com',
        password: 'registro123',
        fotoPerfil: '',
        direccion: 'Calle 53 #12-22',
        celularPersonal: '3017890125',
        celularCorporativo: '3167890125',
        centroCosto: 'REG-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 3,
        arlId: 13,
        afpId: 19,
        afcId: 24,
        ccfId: 29,
      },
      {
        razonSocialId: rsId2,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: asesorCajaCargo?.id || direccionFinancieraCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Gabriela',
        apellidos: 'Ortiz',
        correo: 'gabriela.ortiz@empresa.com',
        password: 'caja123',
        fotoPerfil: '',
        direccion: 'Cra 5 #25-18',
        celularPersonal: '3018901236',
        celularCorporativo: '3178901236',
        centroCosto: 'CAJ-01',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },
      {
        razonSocialId: rsId1,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: asesorPuertaCargo?.id || direccionFinancieraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Luis',
        apellidos: 'Romero',
        correo: 'luis.romero@empresa.com',
        password: 'puerta123',
        fotoPerfil: '',
        direccion: 'Calle 40 #18-30',
        celularPersonal: '3019012347',
        celularCorporativo: '3189012347',
        centroCosto: 'PTA-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },
      {
        razonSocialId: rsId2,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorTelemerCargo?.id || direccionFinancieraCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Isabella',
        apellidos: 'Mejía',
        correo: 'isabella.mejia@empresa.com',
        password: 'telemer123',
        fotoPerfil: '',
        direccion: 'Cra 2 #30-12',
        celularPersonal: '3010123458',
        celularCorporativo: '3190123458',
        centroCosto: 'TEL-01',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 3,
        arlId: 13,
        afpId: 19,
        afcId: 24,
        ccfId: 29,
      },
      {
        razonSocialId: rsId1,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: directorTecnicoCargo?.id || direccionFinancieraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Roberto',
        apellidos: 'Navarro',
        correo: 'roberto.navarro@empresa.com',
        password: 'tecnico123',
        fotoPerfil: '',
        direccion: 'Av 30 #45-20',
        celularPersonal: '3011234569',
        celularCorporativo: '3101234569',
        centroCosto: 'TEC-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },
      {
        razonSocialId: rsId2,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: directorTecnicoSuplenteCargo?.id || direccionFinancieraCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Paola',
        apellidos: 'Cárdenas',
        correo: 'paola.cardenas@empresa.com',
        password: 'tecnico123',
        fotoPerfil: '',
        direccion: 'Calle 15 #10-25',
        celularPersonal: '3012345671',
        celularCorporativo: '3112345671',
        centroCosto: 'TEC-02',
        estado: 'activo' as const,
        recomendaciones: false,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },
      {
        razonSocialId: rsId1,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: inspectorCargo?.id || direccionFinancieraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Daniel',
        apellidos: 'Parra',
        correo: 'daniel.parra@empresa.com',
        password: 'inspector123',
        fotoPerfil: '',
        direccion: 'Calle 60 #22-18',
        celularPersonal: '3013456782',
        celularCorporativo: '3123456782',
        centroCosto: 'INS-01',
        estado: 'activo' as const,
        recomendaciones: true,
        epsId: 3,
        arlId: 13,
        afpId: 19,
        afcId: 24,
        ccfId: 29,
      },
    ])

    console.log('✅ 24 usuarios creados correctamente')
  }
}
