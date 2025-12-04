import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

const corsConfig = defineConfig({
  enabled: true,

  origin: (requestOrigin) => {
    // 🔥 IMPORTANTE: requestOrigin puede ser undefined
    if (!requestOrigin) {
      console.log('⚠️ CORS - Sin origen (probablemente petición desde mismo servidor)')
      return true // O false según tu caso
    }

    // 1️⃣ Leer orígenes desde variable de entorno
    const envOrigins = env.get('CORS_ORIGIN', '')

    if (envOrigins) {
      const allowedOrigins = envOrigins.split(',').map((o) => o.trim())

      // Log para debugging
      console.log('🔐 CORS - Origen de petición:', requestOrigin)
      console.log('🔐 CORS - Orígenes permitidos:', allowedOrigins)

      // Verificar si el origen está en la lista
      if (allowedOrigins.includes(requestOrigin)) {
        console.log('✅ CORS - Origen permitido')
        return true
      }

      // Verificar si es un túnel de Cloudflare (*.trycloudflare.com)
      if (requestOrigin.match(/https:\/\/.*\.trycloudflare\.com$/)) {
        console.log('✅ CORS - Túnel de Cloudflare aceptado')
        return true
      }

      console.log('❌ CORS - Origen bloqueado')
      return false
    }

    // 2️⃣ Si no hay variable de entorno, usar configuración por defecto
    switch (process.env.NODE_ENV) {
      case 'development':
        if (
          requestOrigin.startsWith('http://localhost') ||
          requestOrigin.match(/https:\/\/.*\.trycloudflare\.com$/)
        ) {
          console.log('✅ CORS - Desarrollo: origen aceptado')
          return true
        }
        console.log('❌ CORS - Desarrollo: origen rechazado')
        return false

      case 'test':
        return true

      case 'production':
        const prodOrigins = ['https://mi-dominio.com', 'https://www.mi-dominio.com']
        return prodOrigins.includes(requestOrigin)

      default:
        return requestOrigin.startsWith('http://localhost')
    }
  },

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: ['content-type', 'content-disposition', 'content-length', 'authorization'],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
