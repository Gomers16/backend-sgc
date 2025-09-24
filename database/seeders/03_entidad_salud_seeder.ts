// database/seeders/entidad_salud_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import EntidadSalud from '#models/entidad_salud'

export const TIPO_DESCRIPCION: Record<'eps' | 'afp' | 'afc' | 'ccf' | 'arl', string> = {
  eps: 'ENTIDAD PRESTADORA DE SERVICIOS DE SALUD',
  afp: 'ADMINISTRADORA DE FONDO DE PENSIONES',
  afc: 'ADMINISTRADORA DE FONDO DE CESANTÍAS',
  ccf: 'CAJA DE COMPENSACIÓN FAMILIAR',
  arl: 'ADMINISTRADORA DE RIESGOS LABORALES',
}

export default class EntidadSaludSeeder extends BaseSeeder {
  public async run() {
    // Limpia si lo necesitas antes de sembrar:
    // await EntidadSalud.query().delete()

    await EntidadSalud.createMany([
      // =========================
      // EPS (solo NUEVA EPS mantiene el sufijo "EPS")
      // =========================
      { id: 1, nombre: 'COOSALUD', tipo: 'eps' },
      { id: 2, nombre: 'NUEVA EPS', tipo: 'eps' },
      { id: 3, nombre: 'MUTUAL SER', tipo: 'eps' },
      { id: 4, nombre: 'SALUD MIA', tipo: 'eps' },
      { id: 5, nombre: 'ALIANSALUD', tipo: 'eps' },
      { id: 6, nombre: 'SALUD TOTAL', tipo: 'eps' },
      { id: 7, nombre: 'SANITAS', tipo: 'eps' },
      { id: 8, nombre: 'SURA', tipo: 'eps' },
      { id: 9, nombre: 'FAMISANAR', tipo: 'eps' },
      { id: 10, nombre: 'SOS - SERVICIO OCCIDENTAL DE SALUD', tipo: 'eps' },
      { id: 11, nombre: 'COMFENALCO VALLE', tipo: 'eps' },
      { id: 12, nombre: 'COMPENSAR', tipo: 'eps' },
      { id: 13, nombre: 'EPM - EMPRESAS PUBLICAS DE MEDELLIN', tipo: 'eps' },
      {
        id: 14,
        nombre: 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES',
        tipo: 'eps',
      },
      { id: 15, nombre: 'EPS FAMILIAR DE COLOMBIA', tipo: 'eps' }, // "EPS" hace parte del nombre
      { id: 16, nombre: 'ASMET SALUD', tipo: 'eps' },
      { id: 17, nombre: 'EMSSANAR ESS', tipo: 'eps' },
      { id: 18, nombre: 'CAPITAL SALUD', tipo: 'eps' },
      { id: 19, nombre: 'SAVIA SALUD', tipo: 'eps' },
      { id: 20, nombre: 'DUSAKAWI EPSI', tipo: 'eps' },
      { id: 21, nombre: 'ASOCIACION INDIGENA DEL CAUCA', tipo: 'eps' },
      { id: 22, nombre: 'ANAS WAYU EPSI', tipo: 'eps' },
      { id: 23, nombre: 'MALLAMAS EPSI', tipo: 'eps' },
      { id: 24, nombre: 'PIJAOS SALUD', tipo: 'eps' },

      // =========================
      // AFP
      // =========================
      { id: 25, nombre: 'PORVENIR', tipo: 'afp' },
      { id: 26, nombre: 'PROTECCION', tipo: 'afp' },
      { id: 27, nombre: 'COLFONDOS', tipo: 'afp' },
      { id: 28, nombre: 'COLPENSIONES', tipo: 'afp' },
      { id: 29, nombre: 'OLD MUTUAL', tipo: 'afp' },

      // =========================
      // AFC
      // =========================
      { id: 30, nombre: 'PORVENIR', tipo: 'afc' },
      { id: 31, nombre: 'COLFONDOS', tipo: 'afc' },
      { id: 32, nombre: 'PROTECCION', tipo: 'afc' },
      { id: 33, nombre: 'SKANDIA (OLD MUTUAL)', tipo: 'afc' },
      { id: 34, nombre: 'FONDO NACIONAL DEL AHORRO', tipo: 'afc' },

      // =========================
      // CCF
      // =========================
      { id: 35, nombre: 'COLSUBSIDIO', tipo: 'ccf' },
      { id: 36, nombre: 'CAFAM', tipo: 'ccf' },
      { id: 37, nombre: 'COMPENSAR', tipo: 'ccf' },
      { id: 38, nombre: 'COMFACUNDI', tipo: 'ccf' },
      { id: 39, nombre: 'COMFENALCO', tipo: 'ccf' },
      { id: 40, nombre: 'COMFATOLIMA', tipo: 'ccf' },

      // =========================
      // ARL
      // =========================
      { id: 41, nombre: 'SURA ARL', tipo: 'arl' },
      { id: 42, nombre: 'POSITIVA ARL', tipo: 'arl' },
      { id: 43, nombre: 'AXA COLPATRIA ARL', tipo: 'arl' },
      { id: 44, nombre: 'COLMENA ARL', tipo: 'arl' },
      { id: 45, nombre: 'BOLIVAR ARL', tipo: 'arl' },
      { id: 46, nombre: 'LIBERTY ARL', tipo: 'arl' },
      { id: 47, nombre: 'LA EQUIDAD ARL', tipo: 'arl' },
    ])
  }
}
