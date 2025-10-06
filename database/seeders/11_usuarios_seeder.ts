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
          // Si la tabla existe, este count no lanzará error
          await Database.from(t).count('* as c')
          return t
        } catch {}
      }
      // Por si acaso, devolvemos la primera (no debería ocurrir si no hay ninguna)
      return candidates[0]
    }

    const ensureRazonSocial = async (table: string, nombre: string, nit: string) => {
      // Busca por NIT
      const existing = await Database.from(table).select('id').where('nit', nit).first()
      if (existing?.id) return Number(existing.id)

      // Inserta y devuelve id (MySQL devuelve array con el insertId)
      const ids = await Database.table(table).insert({
        nombre,
        nit,
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      // knex/mysql suele devolver [insertId]
      const newId = Array.isArray(ids) ? ids[0] : ids
      return Number(newId)
    }

    // ---------- dependencias (sedes, roles, cargos) ----------
    const bogotaSede = await Sede.findBy('nombre', 'Bogotá')
    const ibagueSede = await Sede.findBy('nombre', 'Ibagué')

    const adminRol = await Rol.findBy('nombre', 'ADMINISTRADOR CONTROL TOTAL')
    const contabilidadRol = await Rol.findBy('nombre', 'CONTABILIDAD')

    const administradoraCargo = await Cargo.findBy('nombre', 'ADMINISTRAD@R')
    const contableSeniorCargo = await Cargo.findBy('nombre', 'AUX CONTABLE SENIOR')

    if (
      !bogotaSede ||
      !ibagueSede ||
      !adminRol ||
      !contabilidadRol ||
      !administradoraCargo ||
      !contableSeniorCargo
    ) {
      console.error(
        'Faltan Sede/Rol/Cargo para UsuarioSeeder. Asegúrate de correr esos seeders primero (10_sede, 04_roles, 09_cargo).'
      )
      return
    }

    // ---------- resolver tabla de razón social SIN tocar migraciones ----------
    const rsTable = await pickExistingTable(['razon_socials', 'razones_sociales', 'razon_social'])

    // Garantiza al menos 2 razones sociales (o reutiliza si existen)
    const rsId1 = await ensureRazonSocial(rsTable, 'Razón Social 1', 'NIT001')
    const rsId2 = await ensureRazonSocial(rsTable, 'Razón Social 2', 'NIT002')

    // ---------- crea usuarios (sin IDs mágicos) ----------
    await Usuario.createMany([
      {
        razonSocialId: rsId1,
        rolId: adminRol.id,
        cargoId: administradoraCargo.id,
        sedeId: bogotaSede.id,
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        correo: 'admin@empresa.com',
        password: 'admin123',
        fotoPerfil: '',
        direccion: 'Calle 123 #45-67',
        celularPersonal: '3001234567',
        celularCorporativo: '3109876543',
        centroCosto: 'ADM-01',
        estado: 'activo',
        recomendaciones: true,
        epsId: 1,
        arlId: 11,
        afpId: 17,
        afcId: 22,
        ccfId: 27,
      },
      {
        razonSocialId: rsId2,
        rolId: contabilidadRol.id,
        cargoId: contableSeniorCargo.id,
        sedeId: ibagueSede.id,
        nombres: 'Laura',
        apellidos: 'González',
        correo: 'laura.gonzalez@empresa.com',
        password: 'laura123',
        fotoPerfil: '',
        direccion: 'Cra 9 #10-20',
        celularPersonal: '3012345678',
        celularCorporativo: '3112233445',
        centroCosto: 'CON-02',
        estado: 'activo',
        recomendaciones: false,
        epsId: 2,
        arlId: 12,
        afpId: 18,
        afcId: 23,
        ccfId: 28,
      },
    ])
  }
}
