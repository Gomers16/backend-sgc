// Seeder temporal de pruebas — crea usuario tramitador@test.com
// Ejecutar: node ace db:seed --files "database/seeders/99_tramitador_test_seeder.ts"
// NOTA: withAuthFinder tiene @beforeSave que hashea automáticamente.
// Pasar el password en texto plano — NO pre-hashear con Hash.make().
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Usuario from '#models/usuario'

export default class TramitadorTestSeeder extends BaseSeeder {
  public async run() {
    await Usuario.updateOrCreate(
      { correo: 'tramitador@test.com' },
      {
        nombres: 'Tramitador',
        apellidos: 'Prueba',
        correo: 'tramitador@test.com',
        password: 'cda123',  // El hook @beforeSave lo hashea automáticamente
        rolId: 8,            // TRAMITADOR
        cargoId: 14,         // TRAMITADOR
        sedeId: 1,           // Ibagué
        estado: 'activo',
        recomendaciones: false,
      } as any
    )

    console.log('[TramitadorTestSeeder] Usuario tramitador@test.com creado/actualizado.')
    console.log('  Email:    tramitador@test.com')
    console.log('  Password: cda123')
    console.log('  Rol ID:   8 (TRAMITADOR)')
    console.log('  Sede ID:  1 (Ibagué)')
  }
}
