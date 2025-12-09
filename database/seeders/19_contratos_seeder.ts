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

    // ========== DEPENDENCIAS ==========
    const ibagueSede = await Sede.findBy('nombre', 'Ibagué')
    const razonSocialCdaCentro = await RazonSocial.findBy('nombre', 'CDA del Centro')

    // Cargos que existen en tu seeder
    // 🚩 CORRECCIÓN APLICADA AQUÍ: Usamos 'GERENCIA' que es el nombre correcto del Cargo.
    const cargoGerencia = await Cargo.findBy('nombre', 'GERENCIA')
    const cargoContador = await Cargo.findBy('nombre', 'CONTADOR')
    const cargoTalentoHumano = await Cargo.findBy('nombre', 'TALENTO HUMANO')

    // Entidades de salud
    const epsEjemplo = await EntidadSalud.query().where('tipo', 'eps').first()
    const arlEjemplo = await EntidadSalud.query().where('tipo', 'arl').first()
    const afpEjemplo = await EntidadSalud.query().where('tipo', 'afp').first()
    const afcEjemplo = await EntidadSalud.query().where('tipo', 'afc').first()
    const ccfEjemplo = await EntidadSalud.query().where('tipo', 'ccf').first()

    // 👉 USUARIOS ACTUALIZADOS (correos @cda.com)
    const usuarioGerencia = await Usuario.findBy('correo', 'carlos.rodriguez@cda.com')
    const usuarioContabilidad = await Usuario.findBy('correo', 'laura.gonzalez@cda.com')
    const usuarioTalentoHumano = await Usuario.findBy('correo', 'andrea.lopez@cda.com')

    // ========== VALIDACIONES ==========
    if (
      !ibagueSede ||
      !razonSocialCdaCentro ||
      !cargoGerencia || // ¡Ahora debería ser TRUE!
      !cargoContador ||
      !cargoTalentoHumano ||
      !epsEjemplo ||
      !arlEjemplo ||
      !afpEjemplo ||
      !ccfEjemplo ||
      !usuarioGerencia ||
      !usuarioContabilidad ||
      !usuarioTalentoHumano
    ) {
      console.error('❌ Faltan datos relacionados. Revisa los seeders previos.')
      console.error('Detalles:')
      console.error('  - Sede Ibagué:', !!ibagueSede)
      console.error('  - Razón Social:', !!razonSocialCdaCentro)
      console.error('  - Cargo Gerencia:', !!cargoGerencia)
      console.error('  - Cargo Contador:', !!cargoContador)
      console.error('  - Cargo RRHH:', !!cargoTalentoHumano)
      console.error('  - EPS:', !!epsEjemplo)
      console.error('  - Usuario Gerencia:', !!usuarioGerencia)
      console.error('  - Usuario Contabilidad:', !!usuarioContabilidad)
      console.error('  - Usuario RRHH:', !!usuarioTalentoHumano)
      return
    }

    const now = new Date()

    // ══════════════════════════════════════════════════════════════════════
    // CONTRATO 1: Carlos Rodríguez (Gerencia) - Indefinido
    // ══════════════════════════════════════════════════════════════════════
    await db.table('contratos').insert({
      usuario_id: usuarioGerencia.id,
      identificacion: '1020304050',
      razon_social_id: razonSocialCdaCentro.id,
      sede_id: ibagueSede.id,
      cargo_id: cargoGerencia.id,
      funciones_cargo: 'Dirección administrativa, comercial y gestión de proyectos estratégicos.',
      fecha_inicio: '2024-01-10',
      fecha_terminacion: null,
      tipo_contrato: 'laboral',
      termino_contrato: 'indefinido',
      estado: 'activo',
      centro_costo: 'GER-ADM',
      eps_id: epsEjemplo.id,
      arl_id: arlEjemplo.id,
      afp_id: afpEjemplo.id,
      afc_id: afcEjemplo?.id || null,
      ccf_id: ccfEjemplo.id,
      tiene_recomendaciones_medicas: false,
      ruta_archivo_recomendacion_medica: null,
      salario: 4500000,
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
      salarioBasico: 4500000,
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
        nombrePaso: 'Evaluación trimestral',
        fecha: DateTime.fromISO('2024-04-10'),
        observacion: 'Evaluación satisfactoria del desempeño.',
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

    // ══════════════════════════════════════════════════════════════════════
    // CONTRATO 2: Laura González (Contabilidad) - Término fijo
    // ══════════════════════════════════════════════════════════════════════
    await db.table('contratos').insert({
      usuario_id: usuarioContabilidad.id,
      identificacion: '1098765432',
      razon_social_id: razonSocialCdaCentro.id,
      sede_id: ibagueSede.id,
      cargo_id: cargoContador.id,
      funciones_cargo: 'Gestión contable, financiera y análisis de estados financieros.',
      fecha_inicio: '2024-03-01',
      fecha_terminacion: '2025-02-28',
      tipo_contrato: 'laboral',
      termino_contrato: 'termino_fijo',
      estado: 'activo',
      centro_costo: 'CONTABILIDAD',
      eps_id: epsEjemplo.id,
      arl_id: arlEjemplo.id,
      afp_id: afpEjemplo.id,
      afc_id: afcEjemplo?.id || null,
      ccf_id: ccfEjemplo.id,
      tiene_recomendaciones_medicas: false,
      ruta_archivo_recomendacion_medica: null,
      salario: 3200000,
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
      salarioBasico: 3200000,
      bonoSalarial: 0,
      auxilioTransporte: 162000,
      auxilioNoSalarial: 0,
      fechaEfectiva: DateTime.now(),
    })

    await ContratoPaso.createMany([
      {
        contratoId: contrato2.id,
        fase: 'inicio',
        nombrePaso: 'Firma contrato término fijo',
        fecha: DateTime.fromISO('2024-03-01'),
        observacion: 'Contrato firmado por un año.',
        orden: 1,
        completado: true,
        archivoUrl: null,
      },
      {
        contratoId: contrato2.id,
        fase: 'desarrollo',
        nombrePaso: 'Revisión semestral',
        fecha: DateTime.fromISO('2024-09-01'),
        observacion: 'Desempeño destacado.',
        orden: 2,
        completado: true,
        archivoUrl: null,
      },
      {
        contratoId: contrato2.id,
        fase: 'fin',
        nombrePaso: 'Renovación o liquidación',
        fecha: null,
        observacion: null,
        orden: 3,
        completado: false,
        archivoUrl: null,
      },
    ])

    // ══════════════════════════════════════════════════════════════════════
    // CONTRATO 3: Andrea López (Talento Humano) - Prestación de servicios
    // ══════════════════════════════════════════════════════════════════════
    await db.table('contratos').insert({
      usuario_id: usuarioTalentoHumano.id,
      identificacion: '1123456789',
      razon_social_id: razonSocialCdaCentro.id,
      sede_id: ibagueSede.id,
      cargo_id: cargoTalentoHumano.id,
      funciones_cargo: 'Gestión de recursos humanos, nómina y bienestar laboral.',
      fecha_inicio: '2024-06-01',
      fecha_terminacion: '2024-12-31',
      tipo_contrato: 'prestacion',
      termino_contrato: null,
      estado: 'activo',
      centro_costo: 'TH-01',
      eps_id: epsEjemplo.id,
      arl_id: arlEjemplo.id,
      afp_id: afpEjemplo.id,
      afc_id: null,
      ccf_id: ccfEjemplo.id,
      tiene_recomendaciones_medicas: true,
      ruta_archivo_recomendacion_medica:
        '/uploads/recomendaciones_medicas/andrea_lopez_recomendacion.pdf',
      salario: 2500000,
      created_at: now,
      updated_at: now,
    })

    const contrato3 = await db
      .from('contratos')
      .select('id')
      .where('identificacion', '1123456789')
      .first()

    if (!contrato3?.id) {
      console.error('❌ No se pudo obtener el ID del contrato 3.')
      return
    }

    await ContratoSalario.create({
      contratoId: contrato3.id,
      salarioBasico: 2500000,
      bonoSalarial: 0,
      auxilioTransporte: 0, // Prestación de servicios no tiene auxilio
      auxilioNoSalarial: 0,
      fechaEfectiva: DateTime.now(),
    })

    await ContratoPaso.createMany([
      {
        contratoId: contrato3.id,
        fase: 'inicio',
        nombrePaso: 'Firma contrato prestación',
        fecha: DateTime.fromISO('2024-06-01'),
        observacion: 'Contrato firmado por 6 meses.',
        orden: 1,
        completado: true,
        archivoUrl: null,
      },
      {
        contratoId: contrato3.id,
        fase: 'desarrollo',
        nombrePaso: 'Entrega mensual de informes',
        fecha: DateTime.fromISO('2024-07-01'),
        observacion: 'Informes entregados a tiempo.',
        orden: 2,
        completado: true,
        archivoUrl: null,
      },
      {
        contratoId: contrato3.id,
        fase: 'fin',
        nombrePaso: 'Liquidación contrato',
        fecha: null,
        observacion: null,
        orden: 3,
        completado: false,
        archivoUrl: null,
      },
    ])

    console.log('✅ Contratos creados exitosamente:')
    console.log('  - Contrato 1: Carlos Rodríguez (Gerencia) - Indefinido')
    console.log(' - Contrato 2: Laura González (Contabilidad) - Término fijo')
    console.log(' - Contrato 3: Andrea López (RRHH) - Prestación de servicios')
    console.log(' 📊 TOTAL: 3 contratos con salarios y pasos')
  }
}
