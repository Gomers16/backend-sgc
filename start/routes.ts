// start/routes.ts
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
      // Listado de entidades de salud (PLURAL)
      { path: 'entidades-saluds', controller: '#controllers/entidades_saluds_controller' },
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

    // === ENTIDADES DE SALUD: DETALLE (singular) ===
    router.get('/entidades-salud/:id', async (ctx) => {
      const { default: EntidadesSaludsController } = await import(
        '#controllers/entidades_saluds_controller'
      )
      return new EntidadesSaludsController().show(ctx)
    })

    // === CONTRATOS ===
    router.get('/contratos', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().index(ctx)
    })

    // (sin exigir auth)
    router.get('/usuarios/:usuarioId/contratos', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().getContratosUsuario(ctx)
    })

    router.post('/contratos', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().store(ctx)
    })

    // Dual mode: crear+anexar (legacy) o anexar a existente si llega contratoId
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

    router.patch('/contratos/:id/recomendacion-medica', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().updateRecomendacionMedica(ctx)
    })

    router.delete('/contratos/:id', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().destroy(ctx)
    })

    // Descarga de archivo del contrato
    router.get('/contratos/:id/archivo', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().descargarArchivo(ctx)
    })
    // Meta del archivo del contrato
    router.get('/contratos/:id/archivo/meta', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().getArchivoContratoMeta(ctx)
    })
    // Eliminar SOLO el archivo del contrato (no el contrato)
    router.delete('/contratos/:id/archivo', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().eliminarArchivoContrato(ctx)
    })

    // --- Recomendación médica por contrato (archivo) ---
    router.get('/contratos/:id/recomendacion/archivo', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().getRecomendacionMedicaMeta(ctx)
    })

    router.post('/contratos/:id/recomendacion/archivo', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().subirRecomendacionMedica(ctx)
    })

    router.delete('/contratos/:id/recomendacion/archivo', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().eliminarRecomendacionMedica(ctx)
    })

    router.get('/contratos/:id/recomendacion/descargar', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().descargarRecomendacionMedica(ctx)
    })

    // --- Archivos por afiliación (EPS/ARL/AFP/AFC/CCF) por CONTRATO ---
    router.get('/contratos/:id/afiliacion/:tipo/archivo', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().getAfiliacionArchivo(ctx)
    })
    router.post('/contratos/:id/afiliacion/:tipo/archivo', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().subirAfiliacionArchivo(ctx)
    })
    router.delete('/contratos/:id/afiliacion/:tipo/archivo', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().eliminarAfiliacionArchivo(ctx)
    })

    // === CONTRATO PASOS ===
    router
      .group(() => {
        // Listar pasos del contrato (admite ?fase=...)
        router.get('/', async (ctx) => {
          const { default: ContratoPasosController } = await import(
            '#controllers/contrato_pasos_controller'
          )
          return new ContratoPasosController().index(ctx)
        })

        // Crear paso (con archivo opcional en campo 'archivo')
        router.post('/', async (ctx) => {
          const { default: ContratoPasosController } = await import(
            '#controllers/contrato_pasos_controller'
          )
          return new ContratoPasosController().store(ctx)
        })

        // Obtener un paso puntual por ID
        router.get('/:id', async (ctx) => {
          const { default: ContratoPasosController } = await import(
            '#controllers/contrato_pasos_controller'
          )
          return new ContratoPasosController().show(ctx)
        })

        // Actualizar paso (reemplaza/borrar archivo con 'archivo' o 'clearArchivo=true')
        router.put('/:id', async (ctx) => {
          const { default: ContratoPasosController } = await import(
            '#controllers/contrato_pasos_controller'
          )
          return new ContratoPasosController().update(ctx)
        })

        // Eliminar paso (borra también el archivo si existe)
        router.delete('/:id', async (ctx) => {
          const { default: ContratoPasosController } = await import(
            '#controllers/contrato_pasos_controller'
          )
          return new ContratoPasosController().destroy(ctx)
        })

        // (Eliminada la ruta confusa de recomendación por paso)
      })
      .prefix('/contratos/:contratoId/pasos')

    // === CONTRATO EVENTOS ===
    router
      .group(() => {
        router.get('/', async (ctx) => {
          const { default: ContratoEventoController } = await import(
            '#controllers/contrato_evento_controller'
          )
          return new ContratoEventoController().index(ctx)
        })

        router.post('/', async (ctx) => {
          const { default: ContratoEventoController } = await import(
            '#controllers/contrato_evento_controller'
          )
          return new ContratoEventoController().store(ctx)
        })

        router.put('/:id', async (ctx) => {
          const { default: ContratoEventoController } = await import(
            '#controllers/contrato_evento_controller'
          )
          return new ContratoEventoController().update(ctx)
        })

        router.delete('/:id', async (ctx) => {
          const { default: ContratoEventoController } = await import(
            '#controllers/contrato_evento_controller'
          )
          return new ContratoEventoController().destroy(ctx)
        })
      })
      .prefix('/contratos/:contratoId/eventos')

    // === CONTRATO CAMBIOS ===
    router
      .group(() => {
        router.get('/', async (ctx) => {
          const { default: ContratoCambiosController } = await import(
            '#controllers/contrato_cambios_controller'
          )
          return new ContratoCambiosController().index(ctx)
        })

        router.post('/', async (ctx) => {
          const { default: ContratoCambiosController } = await import(
            '#controllers/contrato_cambios_controller'
          )
          return new ContratoCambiosController().store(ctx)
        })
      })
      .prefix('/contratos/:contratoId/cambios')

    // === CONTRATO SALARIOS ===
    router.post('/contratos/:contratoId/salarios', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().storeSalario(ctx)
    })
    // (opcional, por si quieres listar el histórico)
    router.get('/contratos/:contratoId/salarios', async (ctx) => {
      const { default: ContratosController } = await import('#controllers/contratos_controller')
      return new ContratosController().listSalarios(ctx)
    })
  })
  .prefix('/api')
