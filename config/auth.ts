// config/auth.ts

import { defineConfig } from '@adonisjs/auth'
// Asegúrate de que estas importaciones sean correctas para tu versión
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'
import type { InferAuthenticators, InferAuthEvents } from '@adonisjs/auth/types'

// ⛔️ Esto se importa FUERA del declare module
import type { Authenticators } from '@adonisjs/auth/types'

// ✅ Configuración principal del auth
const authConfig = defineConfig({
  default: 'api',
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        model: () => import('#models/usuario'), // O #models/usuarios, según tu modelo real
        // *** ¡CAMBIO CLAVE AQUÍ! ***
        // Cambia 'auth_access_tokens' a 'accessTokens' para que coincida con tu modelo
        tokens: 'accessTokens',
      }),
    }),
  },
})

export default authConfig

// ✅ Aquí solo augmentas tipos, sin importar nada adentro
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}

declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}

// *** IMPORTANTE: Si tienes el 'autoConfig' de tu otro proyecto aquí,
// asegúrate de que no esté en conflicto o duplique la configuración.
// Si lo tienes, y no lo estás usando activamente, considera eliminarlo o comentarlo para evitar confusiones.
// Por ahora, nos enfocamos en el 'authConfig' principal.
/*
const autoConfig = {
  guard: 'api',
  guards: {
    api: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'login',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => import('../app/models/usuarios.js'),
      },
    },
  },
}
autoConfig // Si no lo exportas, asegúrate de que no cause problemas.
*/
