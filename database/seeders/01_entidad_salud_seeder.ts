import { BaseSeeder } from '@adonisjs/lucid/seeders'
import EntidadSalud from '#models/entidad_salud'

export default class EntidadSaludSeeder extends BaseSeeder {
  public async run() {
    // Asegúrate de que la tabla esté vacía antes de insertar nuevos datos si es necesario
    // await EntidadSalud.query().truncate() // Descomentar si quieres truncar la tabla antes de cada ejecución

    await EntidadSalud.createMany([
      // EPS (Entidades Promotoras de Salud) - 10 más usadas/conocidas
      { id: 1, nombre: 'Sura ', tipo: 'eps' },
      { id: 2, nombre: 'Nueva ', tipo: 'eps' },
      { id: 3, nombre: 'Salud Total ', tipo: 'eps' },
      { id: 4, nombre: 'Famisanar', tipo: 'eps' },
      { id: 5, nombre: 'Sanitas', tipo: 'eps' },
      { id: 6, nombre: 'Compensar ', tipo: 'eps' },
      { id: 7, nombre: 'Mutual Ser', tipo: 'eps' },
      { id: 8, nombre: 'Aliansalud ', tipo: 'eps' },
      { id: 9, nombre: 'Capital Salud ', tipo: 'eps' },
      { id: 10, nombre: 'Emssanar ', tipo: 'eps' },

      // ARL (Administradoras de Riesgos Laborales) - 6 más usadas/conocidas (son menos que las EPS)
      { id: 11, nombre: 'Positiva', tipo: 'arl' },
      { id: 12, nombre: 'ARL Sura', tipo: 'arl' },
      { id: 13, nombre: 'ARL Axa Colpatria', tipo: 'arl' },
      { id: 14, nombre: 'ARL Colmena Seguros', tipo: 'arl' },
      { id: 15, nombre: 'ARL Bolívar', tipo: 'arl' },
      { id: 16, nombre: 'ARL La Equidad', tipo: 'arl' },

      // AFP (Administradoras de Fondos de Pensiones) - 5 más usadas/conocidas
      { id: 17, nombre: 'Protección', tipo: 'afp' },
      { id: 18, nombre: 'Porvenir', tipo: 'afp' },
      { id: 19, nombre: 'Colfondos', tipo: 'afp' },
      { id: 20, nombre: 'Colpensiones', tipo: 'afp' }, // Régimen público, pero relevante en el contexto de pensiones
      { id: 21, nombre: 'Skandia', tipo: 'afp' },

      // AFC (Ahorro para el Fomento de la Construcción) - 5 más usadas/conocidas (son productos bancarios)
      { id: 22, nombre: 'Bancolombia ', tipo: 'afc' },
      { id: 23, nombre: 'BBVA ', tipo: 'afc' },
      { id: 24, nombre: 'Scotiabank Colpatria ', tipo: 'afc' },
      { id: 25, nombre: 'Banco de Bogotá ', tipo: 'afc' },
      { id: 26, nombre: 'Banco Caja Social ', tipo: 'afc' },

      // CCF (Cajas de Compensación Familiar) - 10 más usadas/conocidas
      { id: 27, nombre: 'Compensar ', tipo: 'ccf' },
      { id: 28, nombre: 'Colsubsidio ', tipo: 'ccf' },
      { id: 29, nombre: 'Cafam ', tipo: 'ccf' },
      { id: 30, nombre: 'Comfama ', tipo: 'ccf' },
      { id: 31, nombre: 'Cajacopi ', tipo: 'ccf' },
      { id: 32, nombre: 'Comfandi ', tipo: 'ccf' },
      { id: 33, nombre: 'Comfamiliar ', tipo: 'ccf' },
      { id: 34, nombre: 'Comfenalco ', tipo: 'ccf' },
      { id: 35, nombre: 'Comfacauca ', tipo: 'ccf' },
      { id: 36, nombre: 'Comfacesar ', tipo: 'ccf' },
    ])
  }
}
