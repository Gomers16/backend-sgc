import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Usuario from '#models/usuario'

export default class FixPasswordsTemp extends BaseSeeder {
  async run() {
    const fixes = [
      { correo: 'yuliethr@cda.com',  password: 'Yulieth@869'  },
      { correo: 'nayshaw@cda.com',   password: 'Naysha@631'   },
      { correo: 'joseivank@cda.com', password: 'Joseivan@217' },
      { correo: 'camilom@cda.com',   password: 'Camilo@521'   },
    ]

    for (const fix of fixes) {
      const u = await Usuario.findByOrFail('correo', fix.correo)
      u.password = fix.password
      await u.save()
      console.log(`✅ ${fix.correo} actualizado`)
    }
  }
}
