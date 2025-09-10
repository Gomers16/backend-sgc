import { defineConfig } from '@adonisjs/cors'

/**
 * Configuración de CORS dependiente del entorno
 *
 * - development → solo localhost
 * - test        → permite todo (origin: true)
 * - production  → solo tu dominio real
 */
const corsConfig = defineConfig({
  enabled: true,

  origin: (() => {
    switch (process.env.NODE_ENV) {
      case 'development':
        return ['http://localhost:5173'] // solo front local

      case 'test':
        return true // acepta cualquier origen (ideal para Cloudflare túnel)

      case 'production':
        return [
          'https://mi-dominio.com', // cámbialo por el dominio real del front
        ]

      default:
        return ['http://localhost:5173']
    }
  })(),

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: ['content-type', 'content-disposition'],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
