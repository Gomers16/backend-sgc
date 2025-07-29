// start/routes.ts

import router from '@adonisjs/core/services/router'
// Ya no necesitamos importar 'middleware' si no lo vamos a usar en este archivo para el grupo principal
// import { middleware } from '#start/kernel'

// Ruta raíz
router.get('/', async () => {
  return { message: 'Bienvenido a la API de Turnos RTM' }
})

// --- RUTAS DE AUTENTICACIÓN ---
// Estas rutas NO deben llevar el middleware de autenticación, ¡son para autenticarse!
router.post('/api/login', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().login(ctx)
})

router.post('/api/forgot-password', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().forgotPassword(ctx)
})

router.post('/api/reset-password', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().resetPassword(ctx)
})

// --- RUTAS API (AHORA SIN PROTECCIÓN POR AUTENTICACIÓN A NIVEL DE GRUPO) ---
// Hemos removido el .middleware(middleware.auth()) de este grupo.
router
  .group(() => {
    // === TURNOS RTM ===
    router.get('/turnos-rtm', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().index(ctx)
    })

    router.get('/turnos-rtm/siguiente-turno', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().siguienteTurno(ctx)
    })

    router.post('/turnos-rtm', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().store(ctx)
    })

    router.get('/turnos-rtm/:id', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().show(ctx)
    })

    router.put('/turnos-rtm/:id', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().update(ctx)
    })

    router.put('/turnos-rtm/:id/salida', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().registrarSalida(ctx)
    })

    router.patch('/turnos-rtm/:id/activar', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().activar(ctx)
    })

    router.patch('/turnos-rtm/:id/cancelar', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().cancelar(ctx)
    })

    router.patch('/turnos-rtm/:id/inhabilitar', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().destroy(ctx)
    })

    router.get('/turnos-rtm/reporte/excel', async (ctx) => {
      const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
      return new TurnosRtmController().exportExcel(ctx)
    })

    // === USUARIOS ===
    router.get('/usuarios', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().index(ctx)
    })

    router.post('/usuarios', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().store(ctx)
    })

    router.get('/usuarios/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().show(ctx)
    })

    router.put('/usuarios/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().update(ctx)
    })

    router.delete('/usuarios/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().destroy(ctx)
    })

    // LA RUTA CORREGIDA PARA LA FOTO DE PERFIL
    router.put('/usuarios/:id/profile-picture', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().updateProfilePictureUrlNoAuth(ctx)
    })

    // === SELECTORES ===
    const selectors = [
      { path: 'roles', controller: '#controllers/roles_controller' },
      { path: 'razones-sociales', controller: '#controllers/razones_sociales_controller' },
      { path: 'sedes', controller: '#controllers/sedes_controller' },
      { path: 'cargos', controller: '#controllers/cargos_controller' },
      { path: 'entidades-salud', controller: '#controllers/entidades_saluds_controller' },
    ]

    for (const { path, controller } of selectors) {
      router.get(`/${path}`, async (ctx) => {
        const { default: Ctrl } = await import(controller)
        return new Ctrl().index(ctx)
      })
    }
  })
  .prefix('/api')
// .middleware(middleware.auth()) // <-- ¡ESTA LÍNEA SE HA REMOVIDO!
