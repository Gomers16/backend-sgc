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
    const ibagueSede = await Sede.findBy('nombre', 'Ibagué')
    const bogotaSede = await Sede.findBy('nombre', 'Bogotá')

    // 🆕 6 ROLES
    const superAdminRol = await Rol.findBy('nombre', 'SUPER_ADMIN')
    const gerenciaRol = await Rol.findBy('nombre', 'GERENCIA')
    const comercialRol = await Rol.findBy('nombre', 'COMERCIAL')
    const contabilidadRol = await Rol.findBy('nombre', 'CONTABILIDAD')
    const talentoHumanoRol = await Rol.findBy('nombre', 'TALENTO_HUMANO')
    const operativoRol = await Rol.findBy('nombre', 'OPERATIVO_TURNOS')

    // 🆕 CARGOS ACTUALIZADOS
    const direccionAdminCargo = await Cargo.findBy('nombre', 'DIRECCION ADMINISTRATIVA Y COMERCIAL')
    const gerenciaCargo = await Cargo.findBy('nombre', 'GERENCIA')
    const liderSedeCargo = await Cargo.findBy('nombre', 'LIDER DE SEDE')
    const liderInformesCargo = await Cargo.findBy('nombre', 'LIDER DE INFORMES')
    const contadorCargo = await Cargo.findBy('nombre', 'CONTADOR')
    const talentoHumanoCargo = await Cargo.findBy('nombre', 'TALENTO HUMANO')
    const asesorServicioCargo = await Cargo.findBy('nombre', 'ASESOR SERVICIO AL CLIENTE')
    const ingenieroCargo = await Cargo.findBy('nombre', 'INGENIERO')
    const inspectorCargo = await Cargo.findBy('nombre', 'INSPECTOR')
    const asesorComercialCargo = await Cargo.findBy('nombre', 'ASESOR COMERCIAL')
    const asesorConvenioCargo = await Cargo.findBy('nombre', 'ASESOR CONVENIO')

    if (
      !ibagueSede ||
      !superAdminRol ||
      !gerenciaRol ||
      !comercialRol ||
      !contabilidadRol ||
      !talentoHumanoRol ||
      !operativoRol ||
      !asesorComercialCargo ||
      !asesorConvenioCargo
    ) {
      throw new Error('❌ Faltan Sede/Rol/Cargo para UsuarioSeeder. Verifica los seeders previos.')
    }

    // ---------- razones sociales (por nombre) ----------
    const rsTable = await pickExistingTable(['razon_socials', 'razones_sociales', 'razon_social'])
    const rsIdCdaCentro = await getRazonSocialIdByNombre(rsTable, 'CDA del Centro') // Ibagué
    const rsIdCdaActiva = bogotaSede
      ? await getRazonSocialIdByNombre(rsTable, 'CDA Activa')
      : rsIdCdaCentro

    // Helper: armar usuario fijando razón social según sede
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
      const razonSocialId = params.sedeId === ibagueSede.id ? rsIdCdaCentro : rsIdCdaActiva
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

    // ---------- Usuarios ----------
    const usuarios: Partial<InstanceType<typeof Usuario>>[] = [
      // 🟦 SUPER_ADMIN (1 usuario - tú)
      u({
        sedeId: ibagueSede.id,
        rolId: superAdminRol.id,
        cargoId: direccionAdminCargo?.id || asesorComercialCargo.id,
        nombres: 'Admin',
        apellidos: 'Sistema',
        correo: 'admin@cda.com',
        password: 'admin123',
        direccion: 'Calle 123 #45-67',
        celularPersonal: '3001111111',
        celularCorporativo: '3109999999',
        centroCosto: 'ADM-00',
        recomendaciones: true,
      }),

      // 🟦 GERENCIA (4 usuarios: 1 gerente, 1 líder sede, 1 líder informes, 1 director comercial)
      u({
        sedeId: ibagueSede.id,
        rolId: gerenciaRol.id,
        cargoId: gerenciaCargo?.id || direccionAdminCargo?.id || asesorComercialCargo.id,
        nombres: 'María',
        apellidos: 'Sánchez',
        correo: 'maria.sanchez@cda.com',
        password: 'gerencia123',
        direccion: 'Cra 5 #12-34',
        celularPersonal: '3002222222',
        celularCorporativo: '3118888888',
        centroCosto: 'GER-01',
        recomendaciones: true,
      }),
      u({
        sedeId: bogotaSede?.id || ibagueSede.id,
        rolId: gerenciaRol.id,
        cargoId: liderSedeCargo?.id || direccionAdminCargo?.id || asesorComercialCargo.id,
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        correo: 'carlos.rodriguez@cda.com',
        password: 'gerencia123',
        direccion: 'Calle 80 #10-20',
        celularPersonal: '3003333333',
        celularCorporativo: '3127777777',
        centroCosto: 'GER-02',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: gerenciaRol.id,
        cargoId: liderInformesCargo?.id || direccionAdminCargo?.id || asesorComercialCargo.id,
        nombres: 'Sandra',
        apellidos: 'Martínez',
        correo: 'sandra.martinez@cda.com',
        password: 'gerencia123',
        direccion: 'Cra 10 #15-25',
        celularPersonal: '3004444444',
        celularCorporativo: '3136666666',
        centroCosto: 'GER-03',
        recomendaciones: true,
      }),

      // 🟩 CONTABILIDAD (2 usuarios)
      u({
        sedeId: ibagueSede.id,
        rolId: contabilidadRol.id,
        cargoId: contadorCargo?.id || asesorComercialCargo.id,
        nombres: 'Laura',
        apellidos: 'González',
        correo: 'laura.gonzalez@cda.com',
        password: 'conta123',
        direccion: 'Cra 9 #10-20',
        celularPersonal: '3005555555',
        celularCorporativo: '3145555555',
        centroCosto: 'CON-01',
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: contabilidadRol.id,
        cargoId: contadorCargo?.id || asesorComercialCargo.id,
        nombres: 'Pedro',
        apellidos: 'Ramírez',
        correo: 'pedro.ramirez@cda.com',
        password: 'conta123',
        direccion: 'Calle 45 #23-10',
        celularPersonal: '3006666666',
        celularCorporativo: '3154444444',
        centroCosto: 'CON-02',
        recomendaciones: true,
      }),

      // 🟨 TALENTO_HUMANO (1 usuario)
      u({
        sedeId: ibagueSede.id,
        rolId: talentoHumanoRol.id,
        cargoId: talentoHumanoCargo?.id || asesorComercialCargo.id,
        nombres: 'Andrea',
        apellidos: 'López',
        correo: 'andrea.lopez@cda.com',
        password: 'talento123',
        direccion: 'Calle 72 #10-30',
        celularPersonal: '3007777777',
        celularCorporativo: '3163333333',
        centroCosto: 'TH-01',
        recomendaciones: true,
      }),

      // 🟧 OPERATIVO_TURNOS (4 usuarios: asesor servicio, asesor servicio 2, ingeniero, inspector)
      u({
        sedeId: ibagueSede.id,
        rolId: operativoRol.id,
        cargoId: asesorServicioCargo?.id || asesorComercialCargo.id,
        nombres: 'Luis',
        apellidos: 'Romero',
        correo: 'luis.romero@cda.com',
        password: 'operativo123',
        direccion: 'Calle 40 #18-30',
        celularPersonal: '3008888888',
        celularCorporativo: '3172222222',
        centroCosto: 'OPE-01',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: operativoRol.id,
        cargoId: asesorServicioCargo?.id || asesorComercialCargo.id,
        nombres: 'Gabriela',
        apellidos: 'Ortiz',
        correo: 'gabriela.ortiz@cda.com',
        password: 'operativo123',
        direccion: 'Cra 5 #25-18',
        celularPersonal: '3009999999',
        celularCorporativo: '3181111111',
        centroCosto: 'OPE-02',
      }),
      // 🟧 OPERATIVO_TURNOS - INGENIERO
      u({
        sedeId: ibagueSede.id, // 👈 ✅ YA TIENE SEDE ASIGNADA
        rolId: operativoRol.id,
        cargoId: ingenieroCargo?.id || asesorComercialCargo.id,
        nombres: 'Roberto',
        apellidos: 'Navarro',
        correo: 'roberto.navarro@cda.com',
        password: 'operativo123',
        direccion: 'Av 30 #45-20',
        celularPersonal: '3010000000',
        celularCorporativo: '3190000000',
        centroCosto: 'ING-01',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: operativoRol.id,
        cargoId: inspectorCargo?.id || asesorComercialCargo.id,
        nombres: 'Miguel',
        apellidos: 'Torres',
        correo: 'miguel.torres@cda.com',
        password: 'operativo123',
        direccion: 'Calle 50 #22-10',
        celularPersonal: '3010000001',
        celularCorporativo: '3190000001',
        centroCosto: 'INS-01',
      }),

      // 🟪 ASESOR COMERCIAL (2 usuarios - rol COMERCIAL)
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorComercialCargo.id,
        nombres: 'Juan',
        apellidos: 'Morales',
        correo: 'juan.morales@cda.com',
        password: 'comercial123',
        direccion: 'Calle 85 #30-40',
        celularPersonal: '3010000002',
        celularCorporativo: '3190000002',
        centroCosto: 'COM-01',
        recomendaciones: true,
      }),
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorComercialCargo.id,
        nombres: 'Diana',
        apellidos: 'Castro',
        correo: 'diana.castro@cda.com',
        password: 'comercial123',
        direccion: 'Cra 4 #20-15',
        celularPersonal: '3010000003',
        celularCorporativo: '3190000003',
        centroCosto: 'COM-02',
      }),

      // 🟪 ASESOR CONVENIO (5 usuarios - rol COMERCIAL)
      u({
        sedeId: ibagueSede.id,
        rolId: comercialRol.id,
        cargoId: asesorConvenioCargo.id,
        nombres: 'Taller',
        apellidos: 'El Cambio',
        correo: 'taller.cambio@convenios.com',
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
        apellidos: 'Central',
        correo: 'parqueadero.central@convenios.com',
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
        apellidos: 'TurboWash',
        correo: 'lavadero.turbowash@convenios.com',
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
        nombres: 'Carolina',
        apellidos: 'Rojas',
        correo: 'carolina.rojas@convenios.com',
        password: 'convenio123',
        direccion: 'Calle 92 #25-15',
        celularPersonal: '3011000004',
        celularCorporativo: '3121000004',
        centroCosto: 'CONV-04',
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
        celularPersonal: '3011000005',
        celularCorporativo: '3121000005',
        centroCosto: 'CONV-05',
      }),
    ]

    // ---------- UPSERT por correo (1:1, sin duplicados) ----------
    for (const data of usuarios) {
      await Usuario.updateOrCreate({ correo: data.correo as string }, { ...data })
    }

    console.log('✅ Usuarios creados/actualizados:')
    console.log('   - 1 SUPER_ADMIN')
    console.log('   - 4 GERENCIA (1 gerente, 1 líder sede, 1 líder informes, 1 director comercial)')
    console.log('   - 2 CONTABILIDAD')
    console.log('   - 1 TALENTO_HUMANO')
    console.log('   - 4 OPERATIVO_TURNOS (2 asesores servicio, 1 ingeniero, 1 inspector)')
    console.log('   - 2 ASESOR COMERCIAL (rol COMERCIAL)')
    console.log('   - 5 ASESOR CONVENIO (rol COMERCIAL)')
    console.log('   📊 TOTAL: 19 usuarios')
  }
}
