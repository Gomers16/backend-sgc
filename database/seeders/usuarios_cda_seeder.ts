// database/seeders/usuarios_cda_seeder.ts
//
// Seeder final — todos los campos completos.
// Ejecutar DESPUÉS de EntidadSaludSeeder (necesita los IDs de entidades).
//
// Uso:
//   node ace db:seed --files "database/seeders/usuarios_cda_seeder.ts"
//
// IDs de entidades usados (del EntidadSaludSeeder):
//   EPS → SALUD TOTAL:6 | SANITAS:7 | FAMISANAR:9 | NUEVA EPS:2
//   AFP → PORVENIR:25 | PROTECCION:26 | COLFONDOS:27 | COLPENSIONES:28
//   ARL → POSITIVA ARL:42  (placeholder — ajustar si difiere por empleado)
//   AFC → PORVENIR:30      (placeholder — ajustar si difiere por empleado)
//   CCF → COMFATOLIMA:40   (caja de Tolima — ajustar si difiere por empleado)
//
// PENDIENTES tras ejecutar:
//   • razonSocialId → se usa 1 como placeholder, ajustar al id real
//   • salario       → todos en 0, actualizar manualmente
//   • HERNANDEZ VARON DANIELA → fechaTerminacion faltante en el Excel

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Hash from '@adonisjs/core/services/hash'

import Usuario from '#models/usuario'
import Contrato from '#models/contrato'
import ContratoSalario from '#models/contrato_salario'
import ContratoHistorialEstado from '#models/contrato_historial_estado'
import Sede from '#models/sede'
import Cargo from '#models/cargo'
import Rol from '#models/rol'

// ─────────────────────────────────────────────────────────────────
// IDs fijos del EntidadSaludSeeder
// ─────────────────────────────────────────────────────────────────
const EPS = { SALUD_TOTAL: 6, SANITAS: 7, FAMISANAR: 9, NUEVA_EPS: 2 }
const AFP = { PORVENIR: 25, PROTECCION: 26, COLFONDOS: 27, COLPENSIONES: 28 }
const ARL_DEFAULT = 42 // POSITIVA ARL
const AFC_DEFAULT = 30 // PORVENIR AFC
const CCF_DEFAULT = 40 // COMFATOLIMA
const RAZON_SOCIAL_DEFAULT = 1 // ⚠️ placeholder — cambiar al id real

// ─────────────────────────────────────────────────────────────────
// Tipos locales
// ─────────────────────────────────────────────────────────────────
type TipoContrato = 'prestacion' | 'temporal' | 'laboral' | 'aprendizaje'
type TerminoContrato = 'fijo' | 'obra_o_labor_determinada' | 'indefinido'
type EstadoContrato = 'activo' | 'inactivo'

interface UsuarioDato {
  numeroDocumento: string // ✅ usado como `identificacion` en contratos
  apellidos: string
  nombres: string
  celularPersonal: string
  correo: string
  tipoSangre: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null
  fechaNacimiento: string | null
  direccion: string | undefined
  rolNombre: string
  cargoNombre: string
  epsId: number
  afpId: number
  arlId: number
  afcId: number
  ccfId: number
  tipoContrato: TipoContrato
  terminoContrato: TerminoContrato
  fechaIngreso: string
  fechaRetiro: string | null
  estadoContrato: EstadoContrato
  password: string
}

// ─────────────────────────────────────────────────────────────────
// Helper: mapear tipoVinculacion + tipoExcel → contrato
// ─────────────────────────────────────────────────────────────────
function mc(
  vinculacion: string,
  tipoExcel: string
): { tipoContrato: TipoContrato; terminoContrato: TerminoContrato } {
  const t = tipoExcel.toUpperCase().trim()
  const v = vinculacion.toUpperCase().trim()
  if (t === 'APRENDIZAJE') return { tipoContrato: 'aprendizaje', terminoContrato: 'fijo' }
  if (t === 'INDEFINIDO') return { tipoContrato: 'laboral', terminoContrato: 'indefinido' }
  if (v === 'CONTRATISTA') return { tipoContrato: 'prestacion', terminoContrato: 'fijo' }
  return { tipoContrato: 'laboral', terminoContrato: 'fijo' }
}

function normalizarRol(raw: string): string {
  return raw.trim().replace(/['"]/g, '').toUpperCase()
}

// ─────────────────────────────────────────────────────────────────
// DATA — 19 usuarios
// ─────────────────────────────────────────────────────────────────
const USUARIOS_DATA: UsuarioDato[] = [
  {
    numeroDocumento: '1005780912',
    apellidos: 'BELTRAN MURCIA',
    nombres: 'LEONELA',
    celularPersonal: '3233959979',
    correo: 'leonelabeltranmurcia@gmail.com',
    tipoSangre: 'A+',
    fechaNacimiento: '2001-11-06',
    direccion: 'CALLE 24 # 9 - 24, KENNEDY, COMUNA 12',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'ASESOR SERVICIO AL CLIENTE',
    epsId: EPS.SALUD_TOTAL,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2025-09-05',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1006116919',
    apellidos: 'GARCIA FORERO',
    nombres: 'BRAYAN MAURICIO',
    celularPersonal: '3138402798',
    correo: 'abuele1102@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '2000-03-31',
    direccion: 'CARRERA 12 N° 2 - 28, SANTA BARBARA, COMUNA 2',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'ASESOR SERVICIO AL CLIENTE',
    epsId: EPS.FAMISANAR,
    afpId: AFP.PROTECCION,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2024-09-26',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1234643677',
    apellidos: 'GOMEZ CASTILLO',
    nombres: 'LAURA MILENA',
    celularPersonal: '3172177877',
    correo: 'lauragomez9903@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1999-03-20',
    direccion: 'CALLE 28 N° 3 - 28, CLARET, COMUNA 10',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'ASESOR SERVICIO AL CLIENTE',
    epsId: EPS.SALUD_TOTAL,
    afpId: AFP.COLPENSIONES,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2021-12-14',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1110563140',
    apellidos: 'GOMEZ RODRIGUEZ',
    nombres: 'DIEGO MAURICIO',
    celularPersonal: '3246683011',
    correo: 'ggyt12830@gmail.com',
    tipoSangre: 'A+',
    fechaNacimiento: '1995-09-14',
    direccion: 'CALLE 10 N° 8 - 67, BELEN, COMUNA 2',
    rolNombre: 'SUPER_ADMIN',
    cargoNombre: 'COORDINADOR DESARROLLO DE SOFTWARE',
    epsId: EPS.SALUD_TOTAL,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('CONTRATISTA', 'FIJO'),
    fechaIngreso: '2026-01-13',
    fechaRetiro: '2026-04-12',
    estadoContrato: 'inactivo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1110553295',
    apellidos: 'HERNANDEZ ENCISO',
    nombres: 'MANUEL ALBERTO',
    celularPersonal: '3155552708',
    correo: 'manu.hernandez0@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1994-11-03',
    direccion: 'MANZANA M CASA 9, LA CIMA, COMUNA 8',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'INSPECTOR',
    epsId: EPS.SALUD_TOTAL,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2025-11-01',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1006120164',
    apellidos: 'HERNANDEZ VARON',
    nombres: 'DANIELA',
    celularPersonal: '3229418564',
    correo: 'danielahervaron@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '2000-09-14',
    direccion: 'CARRERA 3 # 22 - 42, LA ESTACION, COMUNA 1',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'ASESOR SERVICIO AL CLIENTE',
    epsId: EPS.NUEVA_EPS,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('CONTRATISTA', 'FIJO'),
    fechaIngreso: '2025-09-23',
    fechaRetiro: null, // ⚠️ completar fechaTerminacion manualmente
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1083872472',
    apellidos: 'MENESES CONTRERAS',
    nombres: 'CATHERIN GISSELL',
    celularPersonal: '3208807642',
    correo: 'menesescontrerask@gmail.com',
    tipoSangre: 'B+',
    fechaNacimiento: '2005-08-06',
    direccion: 'MZ A CASA 26, VILLAMARIN, COMUNA 7',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'ASESOR SERVICIO AL CLIENTE',
    epsId: EPS.SALUD_TOTAL,
    afpId: AFP.COLPENSIONES,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2025-09-05',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1234642604',
    apellidos: 'MORA FORERO',
    nombres: 'JUAN SEBASTIAN',
    celularPersonal: '3134419000',
    correo: 'sebasmorafcb@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1998-12-07',
    direccion: 'MANZANA A CASA 9, PARRALES, COMUNA 5',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'INSPECTOR',
    epsId: EPS.SANITAS,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2024-08-10',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1006005812',
    apellidos: 'OLAYA MOGOLLON',
    nombres: 'JONATHAN JAVIER',
    celularPersonal: '3114871481',
    correo: 'jonathanolaya9818@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1998-07-18',
    direccion: 'MANZANA 6 CASA 17, TERRAZAS DEL TEJAR, COMUNA 12',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'INGENIERO',
    epsId: EPS.SALUD_TOTAL,
    afpId: AFP.COLPENSIONES,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2023-06-01',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1234640988',
    apellidos: 'OSORIO HERRERA',
    nombres: 'DIEGO ALEJANDRO',
    celularPersonal: '3213393880',
    correo: 'osoriodiego0498@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1998-04-03',
    direccion: 'MULTIFAMILIARES DEL JORDAN BLOQUE 14, EL JORDAN, COMUNA 5',
    rolNombre: 'CONTABILIDAD',
    cargoNombre: 'CONTADOR',
    epsId: EPS.SANITAS,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2020-10-01',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1110551977',
    apellidos: 'PAEZ BONILLA',
    nombres: 'ANDRES FELIPE',
    celularPersonal: '3177903748',
    correo: 'andrespaezbonilla@gmail.com',
    tipoSangre: 'AB+',
    fechaNacimiento: '1994-10-11',
    direccion: 'CALLE 130 # 5 - 127 CIUDAD TORREON T8 APT 501, EL ALMENDRO, COMUNA 9',
    rolNombre: 'GERENCIA', // normalizado desde "GERENCIA'" del Excel
    cargoNombre: 'LIDER DE SEDE',
    epsId: EPS.SALUD_TOTAL,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2023-05-05',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '93154298',
    apellidos: 'PARRA LOZANO',
    nombres: 'JOSE DAVID',
    celularPersonal: '3233631598',
    correo: 'davidparraloza80@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1981-02-25',
    direccion: 'MANZANA 5 CASA 8 ETAPA 1, PRADERAS DE SANTA RITA, COMUNA 9',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'INSPECTOR',
    epsId: EPS.SANITAS,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2025-06-03',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
    // fechaExpedicion original en el Excel era "7/12/0199" → corregida a 1990-07-12
  },
  {
    numeroDocumento: '1106396445',
    apellidos: 'PARRA ROJAS',
    nombres: 'JORGE LEONARDO',
    celularPersonal: '3103029301',
    correo: 'leonardoparra0520@hotmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1992-05-20',
    direccion: 'CALLE 23 B # 10 S 26, KENNEDY, COMUNA 12',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'INGENIERO',
    epsId: EPS.SANITAS,
    afpId: AFP.COLPENSIONES,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2022-07-01',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1006127274',
    apellidos: 'PINEDA URREA',
    nombres: 'LAURA DANIELA',
    celularPersonal: '3170410620',
    correo: 'lauradaniela.pinedau@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '2003-06-15',
    direccion: 'CARRERA 14 N° 16 - 51, ANCON',
    rolNombre: 'CONTABILIDAD',
    cargoNombre: 'CONTADOR',
    epsId: EPS.NUEVA_EPS,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2025-03-11',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1110596086',
    apellidos: 'QUIROGA LANCHEROS',
    nombres: 'JUAN SEBASTIAN',
    celularPersonal: '3132716121',
    correo: 'sebastianq52@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1999-01-11',
    direccion: 'CARRERA 12 A N° 3 - 25, SANTA BARBARA, COMUNA 2',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'INGENIERO',
    epsId: EPS.SANITAS,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2025-10-06',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1104707823',
    apellidos: 'SANCHEZ MOLINA',
    nombres: 'SERGIO ANDRES',
    celularPersonal: '3124763744',
    correo: 'sasm.123194@gmail.com',
    tipoSangre: 'A+',
    fechaNacimiento: '1994-12-31',
    direccion: 'FORTEZZA 1 TORRE B APART. 6, FORTEZZA PARQUE RESIDENCIAL, COMUNA 9',
    rolNombre: 'GERENCIA',
    cargoNombre: 'TALENTO HUMANO',
    epsId: EPS.NUEVA_EPS,
    afpId: AFP.COLFONDOS,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'APRENDIZAJE'),
    fechaIngreso: '2026-01-01',
    fechaRetiro: '2026-06-30',
    estadoContrato: 'inactivo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1109496137',
    apellidos: 'USECHE GONZALEZ',
    nombres: 'ERIKA PAOLA',
    celularPersonal: '3176409061',
    correo: 'erikpanlin41@gmail.com',
    tipoSangre: 'O+',
    fechaNacimiento: '1998-07-17',
    direccion: 'MANZANA A CASA 9B, URBANIZACION BARLOVENTO, COMUNA 8',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'ASESOR SERVICIO AL CLIENTE',
    epsId: EPS.SANITAS,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2024-09-26',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1110565023',
    apellidos: 'VALDES ROMERO',
    nombres: 'BRAYAN ANDRES',
    celularPersonal: '3116352993',
    correo: 'valdesbrayan1943@gmail.com',
    tipoSangre: 'A+',
    fechaNacimiento: '1995-11-16',
    direccion: 'Carrera 9 # 104-106 CONJUNTO BOSQUES DE FONDERELLA, LAS PIRAMIDES, COMUNA 4',
    rolNombre: 'OPERATIVO_TURNOS',
    cargoNombre: 'INSPECTOR',
    epsId: EPS.FAMISANAR,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2021-06-01',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
  {
    numeroDocumento: '1030630935',
    apellidos: 'VARON GARCIA',
    nombres: 'XIOMY DANIELA',
    celularPersonal: '3003629154',
    correo: 'xiomydaniela.varon@gmail.com',
    tipoSangre: 'A+',
    fechaNacimiento: '1993-09-22',
    direccion: 'CALLE 17 A N° 2 A - 37 SUR, YULDAIMA, COMUNA 12',
    rolNombre: 'GERENCIA',
    cargoNombre: 'TALENTO HUMANO',
    epsId: EPS.SALUD_TOTAL,
    afpId: AFP.PORVENIR,
    arlId: ARL_DEFAULT,
    afcId: AFC_DEFAULT,
    ccfId: CCF_DEFAULT,
    ...mc('DIRECTA', 'INDEFINIDO'),
    fechaIngreso: '2024-05-15',
    fechaRetiro: null,
    estadoContrato: 'activo',
    password: 'cda123',
  },
]

// ─────────────────────────────────────────────────────────────────
// SEEDER
// ─────────────────────────────────────────────────────────────────
export default class UsuariosExcelSeeder extends BaseSeeder {
  async run() {
    console.log('\n🌱 UsuariosExcelSeeder — iniciando...\n')

    // ── Hash de contraseña (una vez para todos) ───────────────────────────────
    const passwordHash = await Hash.use('scrypt').make('cda123')
    console.log('🔐 Password hasheado\n')

    // ── Sede ──────────────────────────────────────────────────────────────────
    console.log('📍 Sede...')
    const sede = await Sede.firstOrCreate({ nombre: 'IBAGUE' }, { nombre: 'IBAGUE' })
    console.log(`   IBAGUE → id ${sede.id}`)

    // ── Roles ─────────────────────────────────────────────────────────────────
    console.log('🎭 Roles...')
    const rolesNombres = [...new Set(USUARIOS_DATA.map((u) => normalizarRol(u.rolNombre)))]
    const rolesMap: Record<string, number> = {}
    for (const nombre of rolesNombres) {
      const rol = await Rol.firstOrCreate({ nombre }, { nombre })
      rolesMap[nombre] = rol.id
      console.log(`   ${nombre} → id ${rol.id}`)
    }

    // ── Cargos ────────────────────────────────────────────────────────────────
    console.log('💼 Cargos...')
    const cargosNombres = [...new Set(USUARIOS_DATA.map((u) => u.cargoNombre.trim()))]
    const cargosMap: Record<string, number> = {}
    for (const nombre of cargosNombres) {
      const cargo = await Cargo.firstOrCreate({ nombre }, { nombre })
      cargosMap[nombre] = cargo.id
      console.log(`   ${nombre} → id ${cargo.id}`)
    }

    // ── Usuarios + Contratos ──────────────────────────────────────────────────
    console.log('\n👤 Usuarios y contratos...\n')

    for (const dato of USUARIOS_DATA) {
      const trx = await db.transaction()
      try {
        const rolId = rolesMap[normalizarRol(dato.rolNombre)] ?? null
        const cargoId = cargosMap[dato.cargoNombre.trim()] ?? null

        const usuario = await Usuario.firstOrCreate(
          { correo: dato.correo },
          {
            nombres: dato.nombres,
            apellidos: dato.apellidos,
            correo: dato.correo,
            correoPersonal: dato.correo,
            password: passwordHash,
            rolId,
            razonSocialId: RAZON_SOCIAL_DEFAULT,
            sedeId: sede.id,
            cargoId,
            epsId: dato.epsId,
            arlId: dato.arlId,
            afpId: dato.afpId,
            afcId: dato.afcId,
            ccfId: dato.ccfId,
            celularPersonal: dato.celularPersonal,
            direccion: dato.direccion ?? undefined,
            tipoSangre: dato.tipoSangre,
            recomendaciones: false,
            estado: dato.estadoContrato === 'activo' ? 'activo' : 'inactivo',
          }
        )

        console.log(`  ✅ ${dato.apellidos} ${dato.nombres}`)
        console.log(`     Rol: ${normalizarRol(dato.rolNombre)} | Cargo: ${dato.cargoNombre}`)

        // ── Contrato ──────────────────────────────────────────────────────────
        const fechaInicio = DateTime.fromISO(dato.fechaIngreso).startOf('day')
        const fechaTerminacion = dato.fechaRetiro
          ? DateTime.fromISO(dato.fechaRetiro).startOf('day')
          : null

        const existeContrato = await Contrato.query({ client: trx })
          .where('usuario_id', usuario.id)
          .whereRaw('DATE(fecha_inicio) = ?', [fechaInicio.toISODate()!])
          .first()

        if (!existeContrato) {
          const contrato = await Contrato.create(
            {
              // ✅ FIX: campo requerido NOT NULL en la tabla contratos
              identificacion: dato.numeroDocumento,
              usuarioId: usuario.id,
              razonSocialId: RAZON_SOCIAL_DEFAULT,
              sedeId: sede.id,
              cargoId,
              epsId: dato.epsId,
              arlId: dato.arlId,
              afpId: dato.afpId,
              afcId: dato.afcId,
              ccfId: dato.ccfId,
              tipoContrato: dato.tipoContrato,
              terminoContrato: dato.terminoContrato,
              fechaInicio,
              fechaTerminacion: fechaTerminacion || null,
              estado: dato.estadoContrato,
              salario: 0, // ⚠️ actualizar manualmente
              motivoFinalizacion:
                dato.estadoContrato === 'inactivo' ? 'Registrado desde nómina histórica' : null,
            },
            { client: trx }
          )

          await ContratoSalario.create(
            {
              contratoId: contrato.id,
              salarioBasico: 0, // ⚠️ actualizar manualmente
              bonoSalarial: 0,
              auxilioTransporte: 0,
              auxilioNoSalarial: 0,
              fechaEfectiva: fechaInicio,
            },
            { client: trx }
          )

          await ContratoHistorialEstado.create(
            {
              contratoId: contrato.id,
              usuarioId: null,
              oldEstado: 'inactivo',
              newEstado: dato.estadoContrato,
              fechaCambio: DateTime.now(),
              fechaInicioContrato: fechaInicio,
              motivo: 'Migración inicial — seeder Excel',
            },
            { client: trx }
          )

          const hasta = dato.fechaRetiro ? ` → ${dato.fechaRetiro}` : ''
          console.log(
            `     📄 ${dato.tipoContrato}/${dato.terminoContrato} ${dato.fechaIngreso}${hasta} [${dato.estadoContrato}]`
          )
        } else {
          console.log(`     ⏩ Contrato ya existía, omitido.`)
        }

        await trx.commit()
      } catch (err: any) {
        await trx.rollback()
        console.error(`  ❌ Error con ${dato.apellidos} ${dato.nombres}: ${err.message}`)
      }
    }

    console.log('\n✅ Seeder completado.')
    console.log('─────────────────────────────────────────────────────────────')
    console.log('⚠️  PENDIENTES:')
    console.log(`   • razonSocialId → actualmente ${RAZON_SOCIAL_DEFAULT}, cambiar al id real`)
    console.log('   • salario → todos en 0, actualizar manualmente')
    console.log('   • HERNANDEZ VARON DANIELA → fechaTerminacion faltante (prestacion/fijo)')
    console.log('─────────────────────────────────────────────────────────────\n')
  }
}
