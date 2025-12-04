// app/middleware/check_role_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckRoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: string[] }) {
    const { auth, response } = ctx

    // 1. Asegurarnos de que está autenticado
    try {
      await auth.check()
    } catch {
      console.error('❌ CheckRole: usuario no autenticado')
      return response.unauthorized({
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso',
      })
    }

    const usuario = auth.user
    if (!usuario) {
      console.error('❌ CheckRole: auth.user vacío')
      return response.unauthorized({
        error: 'No autenticado',
        message: 'Debes iniciar sesión',
      })
    }

    // 2. Cargar el rol desde la relación
    await usuario.load('rol')

    const rolUsuarioRaw = usuario.rol?.nombre || ''
    const rolUsuario = rolUsuarioRaw.toUpperCase().trim()

    const rolesPermitidos = (options.roles || []).map((r) => r.toUpperCase().trim())

    // 🔍 Logs de depuración (déjalos mientras probamos)
    console.log('[CheckRole] rolUsuarioRaw  =', rolUsuarioRaw)
    console.log('[CheckRole] rolUsuarioNorm =', rolUsuario)
    console.log('[CheckRole] rolesPermitidos=', rolesPermitidos)

    if (!rolesPermitidos.includes(rolUsuario)) {
      console.error('❌ CheckRole: acceso denegado')
      return response.forbidden({
        error: 'Acceso denegado',
        message: 'No tienes permisos para acceder a este recurso.',
        detalles: {
          rolOriginal: rolUsuarioRaw,
          rolNormalizado: rolUsuario,
          rolesPermitidos,
        },
      })
    }

    // 3. Si todo bien, continuar
    await next()
  }
}
