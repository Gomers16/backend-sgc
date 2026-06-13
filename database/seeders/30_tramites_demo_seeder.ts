// database/seeders/30_tramites_demo_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import Tramite from '#models/tramite'
import FormularioRunt from '#models/formulario_runt'

const SEDE_ID        = 1
const FUNCIONARIO_ID = 759   // Tramitador Prueba (rol TRAMITADOR)
const SERVICIO_ID    = 5     // TRAMITES
const HOY = DateTime.local().setZone('America/Bogota').startOf('day')

// ── 4 registros → 3 turnos (turno 501 agrupa 2 trámites) ──────────────────
const DATOS = [

  // ╔══════════════════════════════════════════════════════════════════════╗
  // ║  TURNO 501 — NATALIA PAOLA DÍAZ HERRERA — trámite 1/2              ║
  // ║  TRASPASO, placa GRV119 — RUNT COMPLETO (mandatario vacío)         ║
  // ╚══════════════════════════════════════════════════════════════════════╝
  {
    tramite: {
      nombreCliente:      'NATALIA PAOLA DÍAZ HERRERA',
      cedula:             '1007890123',
      telefono:           '3145678901',
      email:              'ndiaz@hotmail.com',
      turnoNumero:        501,
      turnoCodigo:        'TRM-0501',
      tipoTramite:        'TRASPASO' as const,
      estado:             'completado' as const,
      horaIngreso:        '08:00',
      horaAtencion:       '08:05',
      horaFin:            '08:38',
      tiempoAtencion:     '33 min',
      observaciones:      'Traspaso por venta entre particulares — incluye compraventa y mandato',
      resultado:          'Trámite completado satisfactoriamente',
      placa:              'GRV119',
      incluyeCompraventa: true,
      destrate:           null,
    },
    runt: {
      // ── Vehículo ──────────────────────────────────────────────────────
      placa:            'GRV119',
      marca:            'Toyota',
      linea:            'Corolla XEI',
      modelo:           '2020',
      color:            'Blanco Perlado',
      claseVehiculo:    'automovil',
      combustible:      'gasolina',
      noMotor:          '2ZR2020GRV119A',
      noChasis:         'JTDBZ3EU2L3GRV119',
      noSerie:          'JTDBZ3EU2L3GRV119',
      noVin:            'JTDBZ3EU2L3GRV119',
      tipoServicio:     'particular',
      carroceriaCodigo: 'C01',
      carroceriaTipo:   'SEDAN',
      capacidadKg:      '480',
      blindaje:         false,
      potenciaHp:       '139',
      cilindrada:       '1798',
      puertas:          4,
      // ── Propietario (vendedor) ─────────────────────────────────────────
      propPrimerApellido:  'ROMERO',
      propSegundoApellido: 'CÁRDENAS',
      propNombres:         'PEDRO ANTONIO',
      propTipoDocumento:   'cc',
      propNoDocumento:     '79654321',
      propDireccion:       'Carrera 8 # 30-14 Barrio Ambalá',
      propCiudad:          'Ibagué',
      propTelefono:        '3123456780',
      propCorreo:          'paromero@gmail.com',
      // ── Comprador ─────────────────────────────────────────────────────
      compPrimerApellido:  'DÍAZ',
      compSegundoApellido: 'HERRERA',
      compNombres:         'NATALIA PAOLA',
      compTipoDocumento:   'cc',
      compNoDocumento:     '1007890123',
      compDireccion:       'Calle 37 # 5-22 San Simón',
      compCiudad:          'Ibagué',
      compTelefono:        '3145678901',
      compCorreo:          'ndiaz@hotmail.com',
      // ── Mandatario (vacío — para probar autocompletado) ───────────────
      mandatarioNombre:    null,
      mandatarioDocumento: null,
      // ── Alertas ───────────────────────────────────────────────────────
      alertaHurto:         false,
      alertaLimPropiedad:  false,
      alertaEmbargo:       false,
      alertaOtro:          null,
      observaciones:       'Traspaso por venta entre particulares — incluye compraventa y mandato',
    },
  },

  // ╔══════════════════════════════════════════════════════════════════════╗
  // ║  TURNO 501 — NATALIA PAOLA DÍAZ HERRERA — trámite 2/2              ║
  // ║  DUPLICADO_PLACAS, placa ABC456 — RUNT básico (sin comprador)      ║
  // ╚══════════════════════════════════════════════════════════════════════╝
  {
    tramite: {
      nombreCliente:      'NATALIA PAOLA DÍAZ HERRERA',
      cedula:             '1007890123',
      telefono:           '3145678901',
      email:              'ndiaz@hotmail.com',
      turnoNumero:        501,
      turnoCodigo:        'TRM-0501',
      tipoTramite:        'DUPLICADO_PLACAS' as const,
      estado:             'completado' as const,
      horaIngreso:        '08:40',
      horaAtencion:       '08:41',
      horaFin:            '08:55',
      tiempoAtencion:     '14 min',
      observaciones:      'Placa delantera deteriorada. Solicitud voluntaria de duplicado.',
      resultado:          'Trámite completado satisfactoriamente',
      placa:              'ABC456',
      incluyeCompraventa: false,
      destrate:           null,
    },
    runt: {
      // ── Vehículo ──────────────────────────────────────────────────────
      placa:            'ABC456',
      marca:            'Renault',
      linea:            'Logan Expression',
      modelo:           '2019',
      color:            'Blanco',
      claseVehiculo:    'automovil',
      combustible:      'gasolina',
      noMotor:          'K7MF701ABC456A',
      noChasis:         'VF1KSDJ000ABC456',
      noSerie:          'VF1KSDJ000ABC456',
      noVin:            'VF1KSDJ000ABC456',
      tipoServicio:     'particular',
      carroceriaCodigo: 'C01',
      carroceriaTipo:   'SEDAN',
      capacidadKg:      '480',
      blindaje:         false,
      potenciaHp:       '82',
      cilindrada:       '1400',
      puertas:          4,
      // ── Propietario ───────────────────────────────────────────────────
      propPrimerApellido:  'DÍAZ',
      propSegundoApellido: 'HERRERA',
      propNombres:         'NATALIA PAOLA',
      propTipoDocumento:   'cc',
      propNoDocumento:     '1007890123',
      propDireccion:       'Calle 37 # 5-22 San Simón',
      propCiudad:          'Ibagué',
      propTelefono:        '3145678901',
      propCorreo:          'ndiaz@hotmail.com',
      // ── Sin comprador ni mandatario ───────────────────────────────────
      alertaHurto:         false,
      alertaLimPropiedad:  false,
      alertaEmbargo:       false,
      alertaOtro:          null,
      observaciones:       'Placa delantera deteriorada. Solicitud voluntaria de duplicado.',
    },
  },

  // ╔══════════════════════════════════════════════════════════════════════╗
  // ║  TURNO 502 — OSWALDO HUMBERTO MENA CÁRDENAS — trámite 1/1         ║
  // ║  CAMBIO_COLOR, placa XYZ789 — RUNT muy básico                      ║
  // ╚══════════════════════════════════════════════════════════════════════╝
  {
    tramite: {
      nombreCliente:      'OSWALDO HUMBERTO MENA CÁRDENAS',
      cedula:             '19234567',
      telefono:           '3190123456',
      email:              null,
      turnoNumero:        502,
      turnoCodigo:        'TRM-0502',
      tipoTramite:        'CAMBIO_COLOR' as const,
      estado:             'completado' as const,
      horaIngreso:        '09:00',
      horaAtencion:       '09:04',
      horaFin:            '09:20',
      tiempoAtencion:     '16 min',
      observaciones:      'Cambio de color por pintura total tras siniestro',
      resultado:          'Trámite completado satisfactoriamente',
      placa:              'XYZ789',
      incluyeCompraventa: false,
      destrate:           null,
    },
    runt: {
      // ── Vehículo (solo campos mínimos) ────────────────────────────────
      placa:            'XYZ789',
      marca:            'Chevrolet',
      linea:            'Sail LT',
      modelo:           '2018',
      color:            'Rojo (antes: Gris Oscuro)',
      claseVehiculo:    null,
      combustible:      null,
      noMotor:          null,
      noChasis:         null,
      noSerie:          null,
      noVin:            null,
      tipoServicio:     null,
      carroceriaCodigo: null,
      carroceriaTipo:   null,
      capacidadKg:      null,
      blindaje:         false,
      potenciaHp:       null,
      cilindrada:       null,
      puertas:          null,
      // ── Propietario ───────────────────────────────────────────────────
      propPrimerApellido:  'MENA',
      propSegundoApellido: 'CÁRDENAS',
      propNombres:         'OSWALDO HUMBERTO',
      propTipoDocumento:   'cc',
      propNoDocumento:     '19234567',
      propDireccion:       'Calle 30 # 3-45 Boquerón',
      propCiudad:          'Ibagué',
      propTelefono:        '3190123456',
      propCorreo:          null,
      // ── Sin comprador ni mandatario ───────────────────────────────────
      alertaHurto:         false,
      alertaLimPropiedad:  false,
      alertaEmbargo:       false,
      alertaOtro:          null,
      observaciones:       'Cambio de color por pintura total tras siniestro',
    },
  },

  // ╔══════════════════════════════════════════════════════════════════════╗
  // ║  TURNO 503 — JUAN ESTEBAN VARGAS SALCEDO — trámite 1/1            ║
  // ║  TRASPASO, placa DEF321 — RUNT COMPLETO con comprador distinto     ║
  // ╚══════════════════════════════════════════════════════════════════════╝
  {
    tramite: {
      nombreCliente:      'JUAN ESTEBAN VARGAS SALCEDO',
      cedula:             '1010223344',
      telefono:           '3178901234',
      email:              'jvargas@gmail.com',
      turnoNumero:        503,
      turnoCodigo:        'TRM-0503',
      tipoTramite:        'TRASPASO' as const,
      estado:             'completado' as const,
      horaIngreso:        '10:00',
      horaAtencion:       '10:03',
      horaFin:            '10:40',
      tiempoAtencion:     '37 min',
      observaciones:      'Traspaso por venta directa — incluye compraventa y mandato',
      resultado:          'Trámite completado satisfactoriamente',
      placa:              'DEF321',
      incluyeCompraventa: true,
      destrate:           null,
    },
    runt: {
      // ── Vehículo ──────────────────────────────────────────────────────
      placa:            'DEF321',
      marca:            'Honda',
      linea:            'Civic EXL',
      modelo:           '2019',
      color:            'Gris Plata',
      claseVehiculo:    'automovil',
      combustible:      'gasolina',
      noMotor:          'R18A2019DEF321B',
      noChasis:         'JHMFC2F70K0DEF321',
      noSerie:          'JHMFC2F70K0DEF321',
      noVin:            'JHMFC2F70K0DEF321',
      tipoServicio:     'particular',
      carroceriaCodigo: 'C01',
      carroceriaTipo:   'SEDAN',
      capacidadKg:      '460',
      blindaje:         false,
      potenciaHp:       '141',
      cilindrada:       '1799',
      puertas:          4,
      // ── Propietario (vendedor) ─────────────────────────────────────────
      propPrimerApellido:  'VARGAS',
      propSegundoApellido: 'SALCEDO',
      propNombres:         'JUAN ESTEBAN',
      propTipoDocumento:   'cc',
      propNoDocumento:     '1010223344',
      propDireccion:       'Carrera 3 # 12-78 Centro',
      propCiudad:          'Ibagué',
      propTelefono:        '3178901234',
      propCorreo:          'jvargas@gmail.com',
      // ── Comprador ─────────────────────────────────────────────────────
      compPrimerApellido:  'GÓMEZ',
      compSegundoApellido: 'MARTÍNEZ',
      compNombres:         'ANA MARÍA',
      compTipoDocumento:   'cc',
      compNoDocumento:     '65432198',
      compDireccion:       'Calle 15 # 7-30 El Vergel',
      compCiudad:          'Ibagué',
      compTelefono:        '3167890123',
      compCorreo:          'amgomez@gmail.com',
      // ── Mandatario (vacío — para probar autocompletado) ───────────────
      mandatarioNombre:    null,
      mandatarioDocumento: null,
      // ── Alertas ───────────────────────────────────────────────────────
      alertaHurto:         false,
      alertaLimPropiedad:  false,
      alertaEmbargo:       false,
      alertaOtro:          null,
      observaciones:       'Traspaso por venta directa — incluye compraventa y mandato',
    },
  },

] as const

export default class TramitesDemoSeeder extends BaseSeeder {
  public async run() {
    const trx = await db.transaction()
    try {
      for (let i = 0; i < DATOS.length; i++) {
        const { tramite: td, runt: r } = DATOS[i]

        const tramite = await Tramite.create(
          {
            sedeId:             SEDE_ID,
            funcionarioId:      FUNCIONARIO_ID,
            servicioId:         SERVICIO_ID,
            nombreCliente:      td.nombreCliente,
            cedula:             td.cedula,
            telefono:           td.telefono ?? null,
            email:              td.email ?? null,
            turnoNumero:        td.turnoNumero,
            turnoCodigo:        td.turnoCodigo,
            tipoTramite:        td.tipoTramite,
            estado:             td.estado,
            fecha:              HOY,
            horaIngreso:        td.horaIngreso,
            horaAtencion:       td.horaAtencion,
            horaFin:            td.horaFin,
            tiempoAtencion:     td.tiempoAtencion,
            observaciones:      td.observaciones,
            resultado:          td.resultado,
            placa:              td.placa,
            incluyeCompraventa: td.incluyeCompraventa,
            destrate:           td.destrate,
          } as any,
          { client: trx }
        )

        const ra = r as any
        await FormularioRunt.create(
          {
            tramiteId:           tramite.id,
            placa:               ra.placa,
            marca:               ra.marca,
            linea:               ra.linea,
            modelo:              ra.modelo,
            color:               ra.color,
            claseVehiculo:       ra.claseVehiculo    ?? null,
            combustible:         ra.combustible      ?? null,
            noMotor:             ra.noMotor          ?? null,
            noChasis:            ra.noChasis         ?? null,
            noSerie:             ra.noSerie          ?? null,
            noVin:               ra.noVin            ?? null,
            tipoServicio:        ra.tipoServicio     ?? null,
            carroceriaCodigo:    ra.carroceriaCodigo ?? null,
            carroceriaTipo:      ra.carroceriaTipo   ?? null,
            capacidadKg:         ra.capacidadKg      ?? null,
            blindaje:            ra.blindaje,
            potenciaHp:          ra.potenciaHp       ?? null,
            cilindrada:          ra.cilindrada       ?? null,
            puertas:             ra.puertas          ?? null,
            // Propietario
            propPrimerApellido:  ra.propPrimerApellido,
            propSegundoApellido: ra.propSegundoApellido,
            propNombres:         ra.propNombres,
            propTipoDocumento:   ra.propTipoDocumento,
            propNoDocumento:     ra.propNoDocumento,
            propDireccion:       ra.propDireccion,
            propCiudad:          ra.propCiudad,
            propTelefono:        ra.propTelefono,
            propCorreo:          ra.propCorreo       ?? null,
            // Comprador
            compPrimerApellido:  ra.compPrimerApellido  ?? null,
            compSegundoApellido: ra.compSegundoApellido ?? null,
            compNombres:         ra.compNombres         ?? null,
            compTipoDocumento:   ra.compTipoDocumento   ?? null,
            compNoDocumento:     ra.compNoDocumento      ?? null,
            compDireccion:       ra.compDireccion       ?? null,
            compCiudad:          ra.compCiudad          ?? null,
            compTelefono:        ra.compTelefono        ?? null,
            compCorreo:          ra.compCorreo          ?? null,
            // Mandatario
            mandatarioNombre:    ra.mandatarioNombre    ?? null,
            mandatarioDocumento: ra.mandatarioDocumento ?? null,
            // Alertas
            alertaHurto:         ra.alertaHurto,
            alertaLimPropiedad:  ra.alertaLimPropiedad,
            alertaEmbargo:       ra.alertaEmbargo,
            alertaOtro:          ra.alertaOtro          ?? null,
            observaciones:       ra.observaciones,
          } as any,
          { client: trx }
        )

        const turnoLabel =
          i < 2
            ? `T-501 [${i + 1}/2]`
            : `T-${501 + (i - 1)}`
        console.log(`  ${turnoLabel} ${td.tipoTramite} — ${td.placa}`)
      }

      await trx.commit()
      console.log('[TramitesDemoSeeder] 4 trámites (3 turnos) creados correctamente.')
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
