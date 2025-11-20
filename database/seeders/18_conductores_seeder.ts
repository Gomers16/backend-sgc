// database/seeders/18_conductores_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Conductor from '#models/conductor'
import Vehiculo from '#models/vehiculo'
import Cliente from '#models/cliente'

export default class ConductoresSeeder extends BaseSeeder {
  public async run() {
    // 1) Traer vehículos con su cliente (si tiene)
    const vehiculos = await Vehiculo.query().preload('cliente')

    if (!vehiculos.length) {
      console.log('⚠️ ConductoresSeeder: no hay vehículos, no se crean conductores.')
      return
    }

    let creados = 0

    for (const v of vehiculos) {
      const cli = v.$preloaded?.cliente as Cliente | undefined

      // Nombre base para el conductor
      const nombreConductor = (cli?.nombre && `${cli.nombre} (Conductor)`) || `Conductor ${v.placa}`

      // Documento / teléfono si el cliente los tiene
      const docTipo = (cli as any)?.docTipo ?? 'CC'
      const docNumero = (cli as any)?.docNumero ?? null
      const telefono = cli?.telefono ?? null

      // 2) Evitar duplicar conductores:
      //    - Si hay docNumero, lo usamos como clave principal.
      //    - Si no, usamos nombre como referencia.
      let yaExiste: Conductor | null = null

      if (docNumero) {
        yaExiste = await Conductor.query().where('docNumero', docNumero).first()
      } else {
        yaExiste = await Conductor.query().where('nombre', nombreConductor).first()
      }

      if (yaExiste) {
        continue
      }

      // 3) Crear conductor SOLO con los campos que existen en el modelo
      await Conductor.create({
        nombre: nombreConductor,
        docTipo,
        docNumero,
        telefono,
      } as any)

      creados++
    }

    console.log(
      `✅ ConductoresSeeder: creados ${creados} conductores asociados a clientes/vehículos.`
    )
  }
}
