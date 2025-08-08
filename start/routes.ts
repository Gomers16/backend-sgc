import router from '@adonisjs/core/services/router'

// Ruta raíz
router.get('/', async () => {
  return { message: 'Bienvenido a la API de Turnos RTM' }
})

// --- RUTAS DE AUTENTICACIÓN ---
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

// --- RUTAS API ---
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

    router.post('/usuarios/:id/upload-photo', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().uploadProfilePicture(ctx)
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

    router.get('/razones-sociales/:id/usuarios', async (ctx) => {
      const { default: Ctrl } = await import('#controllers/razones_sociales_controller')
      return new Ctrl().usuarios(ctx)
    })

    // === CONTRATOS ===
    router.get('/contratos', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().index(ctx)
    })

    // RUTA CORREGIDA: Ya no se exige autenticación para esta ruta
    router.get('/usuarios/:usuarioId/contratos', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().getContratosUsuario(ctx)
    })

    router.post('/contratos', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().store(ctx)
    })

    router.post('/contratos/anexar-fisico', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().anexarFisico(ctx)
    })

    router.get('/contratos/:id', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().show(ctx)
    })

    router.patch('/contratos/:id', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().update(ctx)
    })

    router.delete('/contratos/:id', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().destroy(ctx)
    })

    // === CONTRATO PASOS (tus rutas existentes) ===
    router.group(() => {
      router.get('/', async (ctx) => {
        const { default: ContratoPasosController } = await import('#controllers/contrato_pasos_controller')
        return new ContratoPasosController().index(ctx)
      })

      router.post('/', async (ctx) => {
        const { default: ContratoPasosController } = await import('#controllers/contrato_pasos_controller')
        return new ContratoPasosController().store(ctx)
      })

      router.put('/:id', async (ctx) => {
        const { default: ContratoPasosController } = await import('#controllers/contrato_pasos_controller')
        return new ContratoPasosController().update(ctx)
      })

      router.delete('/:id', async (ctx) => {
        const { default: ContratoPasosController } = await import('#controllers/contrato_pasos_controller')
        return new ContratoPasosController().destroy(ctx)
      })
    }).prefix('/contratos/:contratoId/pasos')

    // === CONTRATO EVENTOS (NUEVAS RUTAS) ===
    router.group(() => {
      router.get('/', async (ctx) => {
        const { default: ContratoEventoController } = await import('#controllers/contrato_evento_controller')
        return new ContratoEventoController().index(ctx)
      })

      router.post('/', async (ctx) => {
        const { default: ContratoEventoController } = await import('#controllers/contrato_evento_controller')
        return new ContratoEventoController().store(ctx)
      })

      router.put('/:id', async (ctx) => {
        const { default: ContratoEventoController } = await import('#controllers/contrato_evento_controller')
        return new ContratoEventoController().update(ctx)
      })

      router.delete('/:id', async (ctx) => {
        const { default: ContratoEventoController } = await import('#controllers/contrato_evento_controller')
        return new ContratoEventoController().destroy(ctx)
      })
    }).prefix('/contratos/:contratoId/eventos')
  })
  .prefix('/api')