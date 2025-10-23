// database/seeders/21_convenios_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Usuario from '#models/usuario'
import Cargo from '#models/cargo'
import Convenio from '#models/convenio'

type TipoConvenio = 'PERSONA' | 'TALLER' | 'PARQUEADERO' | 'LAVADERO'

/** Alterna tipo en orden fijo para dar variedad controlada */
function tipoPorIndice(i: number): TipoConvenio {
  const order: TipoConvenio[] = ['PERSONA', 'TALLER', 'PARQUEADERO', 'LAVADERO']
  return order[i % order.length]
}

/** Documento estable derivado del id (evita duplicados entre corridas) */
function docPara(tipo: TipoConvenio, id: number): { docTipo: 'CC' | 'NIT'; docNumero: string } {
  if (tipo === 'PERSONA') {
    // CC 1010xxxxxx (10 dígitos)
    return { docTipo: 'CC', docNumero: String(1_010_000_000 + id).slice(0, 10) }
  }
  // NIT 9000xxxxx (solo número, sin dígito de verificación)
  return { docTipo: 'NIT', docNumero: String(900_000_000 + id) }
}

export default class ConveniosSeeder extends BaseSeeder {
  public async run() {
    // 1) Validar que exista el cargo
    const cargoConvenio = await Cargo.findBy('nombre', 'ASESOR CONVENIO')
    if (!cargoConvenio) {
      throw new Error('❌ Falta el cargo "ASESOR CONVENIO". Corre CargoSeeder antes.')
    }

    // 2) Traer TODOS los usuarios con ese cargo (1:1)
    const usuariosConvenio = await Usuario.query()
      .where('cargo_id', cargoConvenio.id)
      .orderBy('id', 'asc')

    if (!usuariosConvenio.length) {
      console.warn('⚠️ No hay usuarios con cargo ASESOR CONVENIO. Nada que crear.')
      return
    }

    // 3) Crear/actualizar convenio por cada usuario (clave: docTipo + docNumero)
    let creadosOActualizados = 0

    for (const [i, u] of usuariosConvenio.entries()) {
      const tipo = tipoPorIndice(i)
      const { docTipo, docNumero } = docPara(tipo, u.id)

      await Convenio.updateOrCreate(
        { docTipo, docNumero },
        {
          nombre: `${u.nombres} ${u.apellidos}`.trim(),
          docTipo,
          docNumero,
          telefono: u.celularPersonal ?? null,
          whatsapp: u.celularCorporativo ?? u.celularPersonal ?? null,
          email: u.correo,
          ciudadId: null,
          direccion: (u as any).direccion ?? null,
          notas: 'Convenio creado 1:1 desde usuario ASESOR CONVENIO',
          activo: true,
        }
      )

      creadosOActualizados++
    }

    console.log(`✅ Convenios 1:1 creados/actualizados: ${creadosOActualizados}`)
  }
}
