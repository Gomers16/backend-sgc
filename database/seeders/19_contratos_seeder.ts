// database/seeders/19_contratos_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ContratoSalario from '#models/contrato_salario'
import ContratoPaso from '#models/contrato_paso'
import Sede from '#models/sede'
import Usuario from '#models/usuario'
import RazonSocial from '#models/razon_social'
import Cargo from '#models/cargo'
import EntidadSalud from '#models/entidad_salud'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class ContratosSeeder extends BaseSeeder {
  public async run() {
    // Limpiar tablas relacionadas primero (orden seguro)
    await ContratoPaso.query().delete()
    await ContratoSalario.query().delete()
    await db.from('contratos').delete()

    const bogotaSede = await Sede.findBy('nombre', 'Bogotá')
    const razonSocialEjemplo = await RazonSocial.findBy('nombre', 'CDA del Centro')

    // ⚠️ usar un cargo que exista
    const cargoEjemplo = await Cargo.findBy('nombre', 'DIRECCION FINANCIERA')

    const epsEjemplo = await EntidadSalud.query().where('tipo', 'eps').first()
    const arlEjemplo = await EntidadSalud.query().where('tipo', 'arl').first()
    const afpEjemplo = await EntidadSalud.query().where('tipo', 'afp').first()
    const afcEjemplo = await EntidadSalud.query().where('tipo', 'afc').first()
    const ccfEjemplo = await EntidadSalud.query().where('tipo', 'ccf').first()

    // ⚠️ este sí existe en tu seeder 11
    const usuarioAdmin = await Usuario.findBy('correo', 'carlos.rodriguez@empresa.com')
    const usuarioContabilidad = await Usuario.findBy('correo', 'laura.gonzalez@empresa.com')

    if (
      !bogotaSede ||
      !razonSocialEjemplo ||
      !cargoEjemplo ||
      !epsEjemplo ||
      !arlEjemplo ||
      !afpEjemplo ||
      !ccfEjemplo ||
      !usuarioAdmin ||
      !usuarioContabilidad
    ) {
      console.error('❌ Faltan datos relacionados. Revisa los seeders previos.')
      return
    }

    const now = new Date()

    // ── Contrato 1 ──────────────────────────────────────────────────────────────
    await db.table('contratos').insert({
      usuario_id: usuarioAdmin.id,
      identificacion: '1020304050',
      razon_social_id: razonSocialEjemplo.id,
      sede_id: bogotaSede.id,
      cargo_id: cargoEjemplo.id,
      funciones_cargo: 'Desarrollo de software y gestión de proyectos.',
      fecha_inicio: '2024-01-10',
      fecha_terminacion: null,
      tipo_contrato: 'laboral',
      termino_contrato: 'indefinido',
      estado: 'activo',
      centro_costo: 'IT_DEP',
      eps_id: epsEjemplo.id,
      arl_id: arlEjemplo.id,
      afp_id: afpEjemplo.id,
      afc_id: afcEjemplo?.id || null,
      ccf_id: ccfEjemplo.id,
      tiene_recomendaciones_medicas: false,
      ruta_archivo_recomendacion_medica: null,
      salario: 2500000,
      created_at: now,
      updated_at: now,
    })

    const contrato1 = await db
      .from('contratos')
      .select('id')
      .where('identificacion', '1020304050')
      .first()

    if (!contrato1?.id) {
      console.error('❌ No se pudo obtener el ID del contrato 1.')
      return
    }

    await ContratoSalario.create({
      contratoId: contrato1.id,
      salarioBasico: 2500000,
      bonoSalarial: 0,
      auxilioTransporte: 162000,
      auxilioNoSalarial: 0,
      fechaEfectiva: DateTime.now(),
    })

    await ContratoPaso.createMany([
      {
        contratoId: contrato1.id,
        fase: 'inicio',
        nombrePaso: 'Firma contrato',
        fecha: DateTime.fromISO('2024-01-10'),
        observacion: 'Contrato firmado por ambas partes.',
        orden: 1,
        completado: true,
        archivoUrl: null,
      },
      {
        contratoId: contrato1.id,
        fase: 'desarrollo',
        nombrePaso: 'Evaluación mensual',
        fecha: DateTime.fromISO('2024-02-10'),
        observacion: 'Evaluación satisfactoria.',
        orden: 2,
        completado: true,
        archivoUrl: null,
      },
      {
        contratoId: contrato1.id,
        fase: 'fin',
        nombrePaso: 'Cierre de contrato',
        fecha: null,
        observacion: null,
        orden: 3,
        completado: false,
        archivoUrl: null,
      },
    ])

    // ── Contrato 2 ──────────────────────────────────────────────────────────────
    await db.table('contratos').insert({
      usuario_id: usuarioContabilidad.id,
      identificacion: '1098765432',
      razon_social_id: razonSocialEjemplo.id,
      sede_id: bogotaSede.id,
      cargo_id: cargoEjemplo.id,
      funciones_cargo: 'Gestión contable y financiera.',
      fecha_inicio: '2024-03-01',
      fecha_terminacion: '2024-12-31',
      tipo_contrato: 'prestacion',
      termino_contrato: null,
      estado: 'activo',
      centro_costo: 'CONTABILIDAD',
      eps_id: epsEjemplo.id,
      arl_id: arlEjemplo.id,
      afp_id: afpEjemplo.id,
      afc_id: null,
      ccf_id: ccfEjemplo.id,
      tiene_recomendaciones_medicas: true,
      ruta_archivo_recomendacion_medica:
        '/uploads/recomendaciones_medicas/ejemplo_recomendacion_medica.pdf',
      salario: 1800000,
      created_at: now,
      updated_at: now,
    })

    const contrato2 = await db
      .from('contratos')
      .select('id')
      .where('identificacion', '1098765432')
      .first()

    if (!contrato2?.id) {
      console.error('❌ No se pudo obtener el ID del contrato 2.')
      return
    }

    await ContratoSalario.create({
      contratoId: contrato2.id,
      salarioBasico: 1800000,
      bonoSalarial: 0,
      auxilioTransporte: 0,
      auxilioNoSalarial: 0,
      fechaEfectiva: DateTime.now(),
    })

    await ContratoPaso.createMany([
      {
        contratoId: contrato2.id,
        fase: 'inicio',
        nombrePaso: 'Firma contrato prestación',
        fecha: DateTime.fromISO('2024-03-01'),
        observacion: 'Contrato firmado.',
        orden: 1,
        completado: true,
        archivoUrl: null,
      },
      {
        contratoId: contrato2.id,
        fase: 'desarrollo',
        nombrePaso: 'Entrega mensual',
        fecha: DateTime.fromISO('2024-04-01'),
        observacion: 'Entrega realizada a tiempo.',
        orden: 2,
        completado: true,
        archivoUrl: null,
      },
      {
        contratoId: contrato2.id,
        fase: 'fin',
        nombrePaso: 'Liquidación contrato',
        fecha: null,
        observacion: null,
        orden: 3,
        completado: false,
        archivoUrl: null,
      },
    ])
  }
}
