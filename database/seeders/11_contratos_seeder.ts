import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Contrato from '#models/contrato'
import ContratoSalario from '#models/contrato_salario'
import ContratoPaso from '#models/contrato_paso'
import Sede from '#models/sede'
import Usuario from '#models/usuario'
import RazonSocial from '#models/razon_social'
import Cargo from '#models/cargo'
import EntidadSalud from '#models/entidad_salud'
import { DateTime } from 'luxon'

export default class ContratosSeeder extends BaseSeeder {
  public async run() {
    // Limpiar tablas relacionadas primero
    await ContratoSalario.query().delete()
    await ContratoPaso.query().delete()
    await Contrato.query().delete()

    const bogotaSede = await Sede.findBy('nombre', 'Bogotá')
    const razonSocialEjemplo = await RazonSocial.findBy('nombre', 'CDA del Centro')
    const cargoEjemplo = await Cargo.findBy('nombre', 'ADMINISTRAD@R')
    const epsEjemplo = await EntidadSalud.query().where('tipo', 'eps').first()
    const arlEjemplo = await EntidadSalud.query().where('tipo', 'arl').first()
    const afpEjemplo = await EntidadSalud.query().where('tipo', 'afp').first()
    const afcEjemplo = await EntidadSalud.query().where('tipo', 'afc').first()
    const ccfEjemplo = await EntidadSalud.query().where('tipo', 'ccf').first()
    const usuarioAdmin = await Usuario.findBy('correo', 'admin@empresa.com')
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

    const contrato1 = await Contrato.create({
      usuarioId: usuarioAdmin.id,
      identificacion: '1020304050',
      razonSocialId: razonSocialEjemplo.id,
      sedeId: bogotaSede.id,
      cargoId: cargoEjemplo.id,
      funcionesCargo: 'Desarrollo de software y gestión de proyectos.',
      fechaInicio: DateTime.fromISO('2024-01-10'),
      fechaTerminacion: null, // ✅ Renombrado de fechaFin a fechaTerminacion
      tipoContrato: 'laboral',
      terminoContrato: 'indefinido',
      estado: 'activo',
      centroCosto: 'IT_DEP',
      epsId: epsEjemplo.id,
      arlId: arlEjemplo.id,
      afpId: afpEjemplo.id,
      afcId: afcEjemplo?.id || null,
      ccfId: ccfEjemplo.id,
      tieneRecomendacionesMedicas: false, // ✅ Añadido
      rutaArchivoRecomendacionMedica: null, // ✅ Añadido
    })

    await ContratoSalario.create({
      contratoId: contrato1.id,
      salarioBasico: 2500000,
      bonoSalarial: 0,
      auxilioTransporte: 162000,
      auxilioNoSalarial: 0,
      fechaEfectiva: DateTime.now(),
    })

    // 👉 PASOS del contrato 1
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

    const contrato2 = await Contrato.create({
      usuarioId: usuarioContabilidad.id,
      identificacion: '1098765432',
      razonSocialId: razonSocialEjemplo.id,
      sedeId: bogotaSede.id,
      cargoId: cargoEjemplo.id,
      funcionesCargo: 'Gestión contable y financiera.',
      fechaInicio: DateTime.fromISO('2024-03-01'),
      fechaTerminacion: DateTime.fromISO('2024-12-31'), // ✅ Renombrado de fechaFin a fechaTerminacion
      tipoContrato: 'prestacion',
      terminoContrato: null,
      estado: 'activo',
      centroCosto: 'CONTABILIDAD',
      epsId: epsEjemplo.id,
      arlId: arlEjemplo.id,
      afpId: afpEjemplo.id,
      afcId: null,
      ccfId: ccfEjemplo.id,
      tieneRecomendacionesMedicas: true, // ✅ Añadido
      // Ejemplo de ruta de archivo para fines de seeder. En un entorno real, esto sería una URL válida.
      rutaArchivoRecomendacionMedica:
        '/uploads/recomendaciones_medicas/ejemplo_recomendacion_medica.pdf', // ✅ Añadido
    })

    await ContratoSalario.create({
      contratoId: contrato2.id,
      salarioBasico: 1800000,
      bonoSalarial: 0,
      auxilioTransporte: 0,
      auxilioNoSalarial: 0,
      fechaEfectiva: DateTime.now(),
    })

    // 👉 PASOS del contrato 2
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
