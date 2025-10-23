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

    // Busca por nombre; si no existe, lanza error para que el orden de seeders se respete
    const getRazonSocialIdByNombre = async (table: string, nombre: string) => {
      const existing = await Database.from(table).select('id').where('nombre', nombre).first()
      if (!existing?.id) {
        throw new Error(
          `Falta razón social "${nombre}". Corre primero database/seeders/02_razon_social_seeder.ts`
        )
      }
      return Number(existing.id)
    }

    // ---------- dependencias (sedes, roles, cargos) ----------
    const bogotaSede = await Sede.findBy('nombre', 'Bogotá')
    const ibagueSede = await Sede.findBy('nombre', 'Ibagué')
    const cemotoSede = await Sede.findBy('nombre', 'Cemoto')
    const marketingSede = await Sede.findBy('nombre', 'Activa Marketing')

    const adminRol = await Rol.findBy('nombre', 'ADMINISTRADOR CONTROL TOTAL')
    const contabilidadRol = await Rol.findBy('nombre', 'CONTABILIDAD')
    const comercialRol = await Rol.findBy('nombre', 'COMERCIAL')
    const operacionesRol = await Rol.findBy('nombre', 'OPERACIONES')
    const talentoHumanoRol = await Rol.findBy('nombre', 'TALENTO_HUMANO')

    // Cargos (asegura que corrió 09_cargo_seeder.ts)
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
      !cemotoSede ||
      !marketingSede ||
      !adminRol ||
      !contabilidadRol ||
      !comercialRol ||
      !operacionesRol ||
      !talentoHumanoRol ||
      !direccionFinancieraCargo ||
      !contableSeniorCargo ||
      !asesorComercialCargo ||
      !asesorConvenioCargo
    ) {
      throw new Error('❌ Faltan Sede/Rol/Cargo para UsuarioSeeder. Verifica los seeders previos.')
    }

    // ---------- razones sociales (por nombre) ----------
    const rsTable = await pickExistingTable(['razon_socials', 'razones_sociales', 'razon_social'])
    const rsIdCdaCentro = await getRazonSocialIdByNombre(rsTable, 'CDA del Centro') // Ibagué
    const rsIdCdaActiva = await getRazonSocialIdByNombre(rsTable, 'CDA Activa') // Bogotá
    const rsIdJefCo = await getRazonSocialIdByNombre(rsTable, 'JEF & CO') // Cemoto
    const rsIdActivaMarketing = await getRazonSocialIdByNombre(rsTable, 'Activa Marketing')

    // Mapeo sede -> razón social
    const rsBySede: Record<number, number> = {
      [bogotaSede.id]: rsIdCdaActiva,
      [ibagueSede.id]: rsIdCdaCentro,
      [cemotoSede.id]: rsIdJefCo,
      [marketingSede.id]: rsIdActivaMarketing,
    }

    // Helper 1: armar usuario fijando razón social según sede
    const u = (
      params: Omit<Partial<InstanceType<typeof Usuario>>, 'razonSocialId'> & {
        sedeId: number
        rolId: number
        cargoId: number
        nombres: string
        apellidos: string
        correo: string
        password: string
      }
    ): Partial<InstanceType<typeof Usuario>> => {
      const razonSocialId = rsBySede[params.sedeId]
      return {
        razonSocialId,
        sedeId: params.sedeId,
        rolId: params.rolId,
        cargoId: params.cargoId,
        nombres: params.nombres,
        apellidos: params.apellidos,
        correo: params.correo,
        password: params.password,
        fotoPerfil: '',
        direccion: (params as any).direccion ?? '',
        celularPersonal: (params as any).celularPersonal ?? null,
        celularCorporativo: (params as any).celularCorporativo ?? null,
        centroCosto: (params as any).centroCosto ?? null,
        estado: 'activo' as const,
        recomendaciones: (params as any).recomendaciones ?? false,
        epsId: (params as any).epsId ?? 1,
        arlId: (params as any).arlId ?? 11,
        afpId: (params as any).afpId ?? 17,
        afcId: (params as any).afcId ?? 22,
        ccfId: (params as any).ccfId ?? 27,
      }
    }

    // ---------- Usuarios explícitos (1:1) ----------
    const usuarios: Partial<InstanceType<typeof Usuario>>[] = [
      // Admin / otras áreas (para tener variedad como la tuya)
      u({
        sedeId: bogotaSede.id,
        rolId: adminRol.id,
        cargoId: direccionFinancieraCargo.id,
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        correo: 'carlos.rodriguez@empresa.com',
        password: 'admin123',
        direccion: 'Calle 123 #45-67',
        celularPersonal: '3001234567',
        celularCorporativo: '3109876543',
        centroCosto: 'ADM-01',
        recomendaciones: true,
      }),
      u({
        sedeId: cemotoSede.id,
        rolId: adminRol.id,
        cargoId: direccionCalidadCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Jorge',
        apellidos: 'Mendoza',
        correo: 'jorge.mendoza@empresa.com',
        password: 'admin123',
        direccion: 'Av 68 #100-20',
        celularPersonal: '3003456789',
        celularCorporativo: '3129876543',
        centroCosto: 'ADM-02',
      }),
      u({
        sedeId: marketingSede.id,
        rolId: talentoHumanoRol?.id || adminRol.id,
        cargoId: talentoHumanoCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Andrea',
        apellidos: 'López',
        correo: 'andrea.lopez@empresa.com',
        password: 'talento123',
        direccion: 'Calle 72 #10-30',
        celularPersonal: '3004567890',
        celularCorporativo: '3139876543',
        centroCosto: 'TH-01',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: adminRol.id,
        cargoId: direccionAdminCargo?.id || direccionFinancieraCargo.id,
        nombres: 'María',
        apellidos: 'Sánchez',
        correo: 'maria.sanchez@empresa.com',
        password: 'admin123',
        direccion: 'Cra 5 #12-34',
        celularPersonal: '3002345678',
        celularCorporativo: '3119876543',
        centroCosto: 'ADM-01',
        recomendaciones: true,
      }),
      // Contabilidad (3)
      u({
        sedeId: ibagueSede.id,
        rolId: contabilidadRol.id,
        cargoId: contadorCargo?.id || contableSeniorCargo.id,
        nombres: 'Laura',
        apellidos: 'González',
        correo: 'laura.gonzalez@empresa.com',
        password: 'conta123',
        direccion: 'Cra 9 #10-20',
        celularPersonal: '3012345678',
        celularCorporativo: '3112233445',
        centroCosto: 'CON-01',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: contabilidadRol.id,
        cargoId: contableJuniorCargo?.id || contableSeniorCargo.id,
        nombres: 'Pedro',
        apellidos: 'Ramírez',
        correo: 'pedro.ramirez@empresa.com',
        password: 'conta123',
        direccion: 'Calle 45 #23-10',
        celularPersonal: '3015678901',
        celularCorporativo: '3143214567',
        centroCosto: 'CON-02',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: contabilidadRol.id,
        cargoId: contableSeniorCargo.id,
        nombres: 'Sofía',
        apellidos: 'Torres',
        correo: 'sofia.torres@empresa.com',
        password: 'conta123',
        direccion: 'Cra 3 #15-40',
        celularPersonal: '3016789012',
        celularCorporativo: '3154321098',
        centroCosto: 'CON-03',
      }),
      // Líder SAC
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: liderServicioCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Camila',
        apellidos: 'Vargas',
        correo: 'camila.vargas@empresa.com',
        password: 'lider123',
        direccion: 'Calle 100 #15-20',
        celularPersonal: '3017890123',
        celularCorporativo: '3165432109',
        centroCosto: 'SAC-01',
        recomendaciones: true,
      }),

      // ✅ ASESOR COMERCIAL (5 exactos — los únicos que podrán datear)
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorComercialCargo.id,
        nombres: 'Juan',
        apellidos: 'Morales',
        correo: 'juan.morales@empresa.com',
        password: 'comercial123',
        direccion: 'Calle 85 #30-40',
        celularPersonal: '3018901234',
        celularCorporativo: '3176543210',
        centroCosto: 'COM-01',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorComercialCargo.id,
        nombres: 'Diana',
        apellidos: 'Castro',
        correo: 'diana.castro@empresa.com',
        password: 'comercial123',
        direccion: 'Cra 4 #20-15',
        celularPersonal: '3019012345',
        celularCorporativo: '3187654321',
        centroCosto: 'COM-02',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorComercialCargo.id,
        nombres: 'Miguel',
        apellidos: 'Hernández',
        correo: 'miguel.hernandez@empresa.com',
        password: 'comercial123',
        direccion: 'Av 19 #120-30',
        celularPersonal: '3010123456',
        celularCorporativo: '3198765432',
        centroCosto: 'COM-03',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorComercialCargo.id,
        nombres: 'Valentina',
        apellidos: 'Pérez',
        correo: 'valentina.perez@empresa.com',
        password: 'comercial123',
        direccion: 'Calle 10 #5-25',
        celularPersonal: '3011234567',
        celularCorporativo: '3101234567',
        centroCosto: 'COM-04',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorComercialCargo.id,
        nombres: 'Andrés',
        apellidos: 'Martínez',
        correo: 'andres.martinez@empresa.com',
        password: 'comercial123',
        direccion: 'Calle 127 #50-10',
        celularPersonal: '3012345670',
        celularCorporativo: '3112345670',
        centroCosto: 'COM-05',
        recomendaciones: true,
      }),
      // ✅ ASESOR CONVENIO (20 exactos – mezcla talleres/parqueaderos/lavaderos/personas)
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Taller Rápido',
        apellidos: 'El Cambio',
        correo: 'taller.rapido@convenios.com',
        password: 'convenio123',
        direccion: 'Cra 20 #12-05',
        celularPersonal: '3011000001',
        celularCorporativo: '3121000001',
        centroCosto: 'CONV-01',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Parqueadero',
        apellidos: 'La 5ta',
        correo: 'parqueadero.5ta@convenios.com',
        password: 'convenio123',
        direccion: 'Calle 5 #8-20',
        celularPersonal: '3011000002',
        celularCorporativo: '3121000002',
        centroCosto: 'CONV-02',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Lavadero',
        apellidos: 'Espuma Total',
        correo: 'lavadero.espuma@convenios.com',
        password: 'convenio123',
        direccion: 'Av 60 #20-30',
        celularPersonal: '3011000003',
        celularCorporativo: '3121000003',
        centroCosto: 'CONV-03',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Taller',
        apellidos: 'El Éxito',
        correo: 'taller.exito@convenios.com',
        password: 'convenio123',
        direccion: 'Calle 80 #25-40',
        celularPersonal: '3011000004',
        celularCorporativo: '3121000004',
        centroCosto: 'CONV-04',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Parqueadero',
        apellidos: 'Central',
        correo: 'parqueadero.central@convenios.com',
        password: 'convenio123',
        direccion: 'Cra 4 #18-15',
        celularPersonal: '3011000005',
        celularCorporativo: '3121000005',
        centroCosto: 'CONV-05',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Taller',
        apellidos: 'Ruta 40',
        correo: 'taller.ruta40@convenios.com',
        password: 'convenio123',
        direccion: 'Ruta 40 Km 3',
        celularPersonal: '3011000006',
        celularCorporativo: '3121000006',
        centroCosto: 'CONV-06',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Lavadero',
        apellidos: 'TurboWash',
        correo: 'lavadero.turbowash@convenios.com',
        password: 'convenio123',
        direccion: 'Cra 6 #10-22',
        celularPersonal: '3011000007',
        celularCorporativo: '3121000007',
        centroCosto: 'CONV-07',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Parqueadero',
        apellidos: 'Mi Casa',
        correo: 'parqueadero.micasa@convenios.com',
        password: 'convenio123',
        direccion: 'Calle 12 #7-11',
        celularPersonal: '3011000008',
        celularCorporativo: '3121000008',
        centroCosto: 'CONV-08',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Taller',
        apellidos: 'El Pro',
        correo: 'taller.elpro@convenios.com',
        password: 'convenio123',
        direccion: 'Av Mirolindo 25-10',
        celularPersonal: '3011000009',
        celularCorporativo: '3121000009',
        centroCosto: 'CONV-09',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Carolina',
        apellidos: ' Rojas',
        correo: 'carolina.rojas@convenios.com',
        password: 'convenio123',
        direccion: 'Calle 92 #25-15',
        celularPersonal: '3011000010',
        celularCorporativo: '3121000010',
        centroCosto: 'CONV-10',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Felipe',
        apellidos: 'Gutiérrez',
        correo: 'felipe.gutierrez@convenios.com',
        password: 'convenio123',
        direccion: 'Cra 7 #18-30',
        celularPersonal: '3011000011',
        celularCorporativo: '3121000011',
        centroCosto: 'CONV-11',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Natalia',
        apellidos: 'Jiménez',
        correo: 'natalia.jimenez@convenios.com',
        password: 'convenio123',
        direccion: 'Av 68 #80-45',
        celularPersonal: '3011000012',
        celularCorporativo: '3121000012',
        centroCosto: 'CONV-12',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Ricardo',
        apellidos: 'Álvarez',
        correo: 'ricardo.alvarez@convenios.com',
        password: 'convenio123',
        direccion: 'Calle 22 #8-10',
        celularPersonal: '3011000013',
        celularCorporativo: '3121000013',
        centroCosto: 'CONV-13',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Taller',
        apellidos: 'Los Amigos',
        correo: 'taller.amigos@convenios.com',
        password: 'convenio123',
        direccion: 'Cra 1 #3-55',
        celularPersonal: '3011000014',
        celularCorporativo: '3121000014',
        centroCosto: 'CONV-14',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Parqueadero',
        apellidos: 'El Bosque',
        correo: 'parqueadero.bosque@convenios.com',
        password: 'convenio123',
        direccion: 'Calle 40 #7-25',
        celularPersonal: '3011000015',
        celularCorporativo: '3121000015',
        centroCosto: 'CONV-15',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Lavadero',
        apellidos: 'EcoClean',
        correo: 'lavadero.ecoclean@convenios.com',
        password: 'convenio123',
        direccion: 'Av 4ta #15-05',
        celularPersonal: '3011000016',
        celularCorporativo: '3121000016',
        centroCosto: 'CONV-16',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Taller',
        apellidos: 'TurboCar',
        correo: 'taller.turbocar@convenios.com',
        password: 'convenio123',
        direccion: 'Cra 12 #66-10',
        celularPersonal: '3011000017',
        celularCorporativo: '3121000017',
        centroCosto: 'CONV-17',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Parqueadero',
        apellidos: 'VIP Center',
        correo: 'parqueadero.vip@convenios.com',
        password: 'convenio123',
        direccion: 'Transv 10 #100-20',
        celularPersonal: '3011000018',
        celularCorporativo: '3121000018',
        centroCosto: 'CONV-18',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Lavadero',
        apellidos: 'BrillaAuto',
        correo: 'lavadero.brilla@convenios.com',
        password: 'convenio123',
        direccion: 'Diagonal 9 #4-33',
        celularPersonal: '3011000019',
        celularCorporativo: '3121000019',
        centroCosto: 'CONV-19',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Taller',
        apellidos: 'ProService',
        correo: 'taller.proservice@convenios.com',
        password: 'convenio123',
        direccion: 'Calle 100 #12-02',
        celularPersonal: '3011000020',
        celularCorporativo: '3121000020',
        centroCosto: 'CONV-20',
      }),

      // Operaciones / otros (si quieres mantenerlos como en tu ejemplo)
      u({
        sedeId: ibagueSede.id,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: asesorRegistroCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Esteban',
        apellidos: 'Silva',
        correo: 'esteban.silva@empresa.com',
        password: 'registro123',
        direccion: 'Calle 53 #12-22',
        celularPersonal: '3017890125',
        celularCorporativo: '3167890125',
        centroCosto: 'REG-01',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: asesorCajaCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Gabriela',
        apellidos: 'Ortiz',
        correo: 'gabriela.ortiz@empresa.com',
        password: 'caja123',
        direccion: 'Cra 5 #25-18',
        celularPersonal: '3018901236',
        celularCorporativo: '3178901236',
        centroCosto: 'CAJ-01',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: asesorPuertaCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Luis',
        apellidos: 'Romero',
        correo: 'luis.romero@empresa.com',
        password: 'puerta123',
        direccion: 'Calle 40 #18-30',
        celularPersonal: '3019012347',
        celularCorporativo: '3189012347',
        centroCosto: 'PTA-01',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol?.id || adminRol.id,
        cargoId: asesorTelemerCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Isabella',
        apellidos: 'Mejía',
        correo: 'isabella.mejia@empresa.com',
        password: 'telemer123',
        direccion: 'Cra 2 #30-12',
        celularPersonal: '3010123458',
        celularCorporativo: '3190123458',
        centroCosto: 'TEL-01',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: directorTecnicoCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Roberto',
        apellidos: 'Navarro',
        correo: 'roberto.navarro@empresa.com',
        password: 'tecnico123',
        direccion: 'Av 30 #45-20',
        celularPersonal: '3011234569',
        celularCorporativo: '3101234569',
        centroCosto: 'TEC-01',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: directorTecnicoSuplenteCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Paola',
        apellidos: 'Cárdenas',
        correo: 'paola.cardenas@empresa.com',
        password: 'tecnico123',
        direccion: 'Calle 15 #10-25',
        celularPersonal: '3012345671',
        celularCorporativo: '3112345671',
        centroCosto: 'TEC-02',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: operacionesRol?.id || adminRol.id,
        cargoId: inspectorCargo?.id || direccionFinancieraCargo.id,
        nombres: 'Daniel',
        apellidos: 'Parra',
        correo: 'daniel.parra@empresa.com',
        password: 'inspector123',
        direccion: 'Calle 60 #22-18',
        celularPersonal: '3013456782',
        celularCorporativo: '3123456782',
        centroCosto: 'INS-01',
        recomendaciones: true,
      }),
    ]

    // ---------- UPSERT por correo (1:1, sin duplicados) ----------
    for (const data of usuarios) {
      await Usuario.updateOrCreate({ correo: data.correo as string }, { ...data })
    }

    console.log('✅ Usuarios: creados/actualizados (1:1, sin automáticos).')
  }
}
