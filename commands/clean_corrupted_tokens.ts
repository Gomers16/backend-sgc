import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class CleanCorruptedTokens extends BaseCommand {
  static commandName = 'tokens:clean'
  static description = 'Limpia tokens corruptos y expirados de la base de datos'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔍 Iniciando limpieza de tokens...')

    try {
      // 1. Arreglar abilities vacíos o null
      const fixedAbilities = await db
        .from('auth_access_tokens')
        .whereNull('abilities')
        .orWhere('abilities', '')
        .orWhere('abilities', 'null')
        .update({ abilities: '{}' })

      this.logger.success(`✅ ${fixedAbilities} tokens con abilities corregidos`)

      // 2. Eliminar tokens expirados
      const deletedExpired = await db
        .from('auth_access_tokens')
        .where('expires_at', '<', new Date())
        .delete()

      this.logger.success(`🗑️  ${deletedExpired} tokens expirados eliminados`)

      // 3. Eliminar tokens sin uso por más de 60 días
      const sixtyDaysAgo = new Date()
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

      const deletedOld = await db
        .from('auth_access_tokens')
        .where('last_used_at', '<', sixtyDaysAgo)
        .orWhereNull('last_used_at')
        .where('created_at', '<', sixtyDaysAgo)
        .delete()

      this.logger.success(`🧹 ${deletedOld} tokens antiguos eliminados`)

      // 4. Mostrar resumen
      const remaining = await db.from('auth_access_tokens').count('* as total')
      this.logger.info(`📊 Tokens restantes: ${remaining[0].total}`)
    } catch (error) {
      this.logger.error('❌ Error limpiando tokens:')
      this.logger.error(error.message)
      this.exitCode = 1
    }
  }
}
