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
    const superAdminRol = await Rol.findBy('nombre', 'SUPER_ADMIN')
    const direccionAdminCargo = await Cargo.findBy('nombre', 'DIRECCION ADMINISTRATIVA Y COMERCIAL')

    if (!ibagueSede || !superAdminRol || !direccionAdminCargo) {
      throw new Error('❌ Faltan Sede/Rol/Cargo para UsuarioSeeder. Verifica los seeders previos.')
    }

    // ---------- razón social ----------
    const rsTable = await pickExistingTable(['razon_socials', 'razones_sociales', 'razon_social'])
    const rsIdCdaCentro = await getRazonSocialIdByNombre(rsTable, 'CDA del Centro')

    // ---------- CREAR USUARIO SUPER ADMIN ----------
    await Usuario.updateOrCreate(
      { correo: 'admin@cda.com' },
      {
        razonSocialId: rsIdCdaCentro,
        sedeId: ibagueSede.id,
        rolId: superAdminRol.id,
        cargoId: direccionAdminCargo.id,
        nombres: 'Admin',
        apellidos: 'Sistema',
        correo: 'admin@cda.com',
        password: 'admin123',
        fotoPerfil: '',
        direccion: 'Calle 123 #45-67',
        celularPersonal: '3001111111',
        celularCorporativo: '3109999999',
        centroCosto: 'ADM-00',
        estado: 'activo',
        recomendaciones: true,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
        // ✅ NUEVOS CAMPOS
        correoPersonal: 'admin.personal@gmail.com',
        tipoSangre: 'O+',
        contactoEmergenciaNombre: 'María García',
        contactoEmergenciaTelefono: '3112223344',
      }
    )

    console.log('✅ Usuario Super Admin creado:')
    console.log('   Email: admin@cda.com')
    console.log('   Password: admin123')
    console.log('   Tipo de sangre: O+')
    console.log('   Contacto emergencia: María García (3112223344)')
    console.log('   📊 TOTAL: 1 usuario')
  }
}
