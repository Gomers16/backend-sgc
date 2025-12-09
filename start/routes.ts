// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Salud
router.get('/', async () => {
  return { message: 'Bienvenido a la API de Turnos RTM' }
})

// --- API ---
router
  .group(() => {
    /* ========================== AUTENTICACIÓN ========================== */
    router.post('/login', async (ctx) => {
      const { default: AuthController } = await import('#controllers/auth_controller')
      return new AuthController().login(ctx)
    })
    router.post('/forgot-password', async (ctx) => {
      const { default: AuthController } = await import('#controllers/auth_controller')
      return new AuthController().forgotPassword(ctx)
    })
    router.post('/reset-password', async (ctx) => {
      const { default: AuthController } = await import('#controllers/auth_controller')
      return new AuthController().resetPassword(ctx)
    })
    router
      .get('/auth/me', async (ctx) => {
        const { default: AuthController } = await import('#controllers/auth_controller')
        return new AuthController().me(ctx)
      })
      .use(middleware.auth())

    /* ======================== BÚSQUEDA UNIFICADA ======================= */
    router.get('/buscar', async (ctx) => {
      const { default: BusquedasController } = await import('#controllers/busquedas_controller')
      return new BusquedasController().unificada(ctx)
    })

    /* ============================== TURNOS ============================= */
router
  .get('/turnos-rtm', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().index(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .get('/turnos-rtm/siguiente-turno', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().siguienteTurno(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .get('/turnos-rtm/export-excel', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().exportExcel(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .post('/turnos-rtm', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .post('/turnos-rtm/:id/cerrar', async (ctx) => {
    const { default: TurnosCierreController } = await import(
      '../app/controllers/turnos_cierre_controller.js'
    )
    return new TurnosCierreController().cerrar(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .get('/turnos-rtm/:id', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().show(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .put('/turnos-rtm/:id', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().update(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .put('/turnos-rtm/:id/salida', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().registrarSalida(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .patch('/turnos-rtm/:id/activar', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().activar(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .patch('/turnos-rtm/:id/cancelar', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().cancelar(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

router
  .patch('/turnos-rtm/:id/inhabilitar', async (ctx) => {
    const { default: TurnosRtmController } = await import('#controllers/turnos_rtms_controller')
    return new TurnosRtmController().destroy(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

/* =========================== REP GENERAL RTM ======================= */
router
  .post('/rtm/rep-general/import', async (ctx) => {
    const { default: RepGeneralImportController } = await import(
      '#controllers/rep_general_imports_controller'
    )
    return new RepGeneralImportController().import(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'] })
  ])

  /* ============================== USUARIOS =========================== */
router
  .get('/usuarios', async (ctx) => {
    const { default: UsuariosController } = await import('#controllers/usuarios_controller')
    return new UsuariosController().index(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .post('/usuarios', async (ctx) => {
    const { default: UsuariosController } = await import('#controllers/usuarios_controller')
    return new UsuariosController().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/usuarios/:id', async (ctx) => {
    const { default: UsuariosController } = await import('#controllers/usuarios_controller')
    return new UsuariosController().show(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .put('/usuarios/:id', async (ctx) => {
    const { default: UsuariosController } = await import('#controllers/usuarios_controller')
    return new UsuariosController().update(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .delete('/usuarios/:id', async (ctx) => {
    const { default: UsuariosController } = await import('#controllers/usuarios_controller')
    return new UsuariosController().destroy(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] }) // Solo admin y gerencia pueden eliminar
  ])

router
  .post('/usuarios/:id/upload-photo', async (ctx) => {
    const { default: UsuariosController } = await import('#controllers/usuarios_controller')
    return new UsuariosController().uploadProfilePicture(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])
    /* ============================== SELECTORES ========================= */
    const selectors = [
      { path: 'roles', controller: '#controllers/roles_controller' },
      { path: 'razones-sociales', controller: '#controllers/razones_sociales_controller' },
      { path: 'sedes', controller: '#controllers/sedes_controller' },
      { path: 'entidades-saluds', controller: '#controllers/entidades_saluds_controller' },
      { path: 'servicios', controller: '#controllers/servicios_controller' },
      { path: 'ciudades', controller: '#controllers/ciudades_controller' },
      { path: 'cargos', controller: '#controllers/cargos_controller' },
    ] as const

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

    /* ============================ ENTIDADES SALUD ====================== */
    router.get('/entidades-salud/:id', async (ctx) => {
      const { default: EntidadesSaludsController } = await import(
        '#controllers/entidades_saluds_controller'
      )
      return new EntidadesSaludsController().show(ctx)
    })

   /* =============================== CONTRATOS ========================= */
router
  .get('/contratos', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().index(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/usuarios/:usuarioId/contratos', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().getContratosUsuario(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .post('/contratos', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .post('/contratos/anexar-fisico', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().anexarFisico(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/contratos/:id', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().show(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .patch('/contratos/:id', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().update(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .delete('/contratos/:id', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().destroy(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/contratos/:id/archivo', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().descargarArchivo(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/contratos/:id/archivo/meta', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().getArchivoContratoMeta(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .delete('/contratos/:id/archivo', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().eliminarArchivoContrato(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/contratos/:id/recomendacion/archivo', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().getRecomendacionMedicaMeta(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .post('/contratos/:id/recomendacion/archivo', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().subirRecomendacionMedica(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .delete('/contratos/:id/recomendacion/archivo', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().eliminarRecomendacionMedica(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/contratos/:id/recomendacion/descargar', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().descargarRecomendacionMedica(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/contratos/:id/afiliacion/:tipo/archivo', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().getAfiliacionArchivo(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .post('/contratos/:id/afiliacion/:tipo/archivo', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().subirAfiliacionArchivo(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .delete('/contratos/:id/afiliacion/:tipo/archivo', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().eliminarAfiliacionArchivo(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .group(() => {
    router.get('/', async (ctx) => {
      const { default: ContratoPasosController } = await import(
        '#controllers/contrato_pasos_controller'
      )
      return new ContratoPasosController().index(ctx)
    })
    router.post('/', async (ctx) => {
      const { default: ContratoPasosController } = await import(
        '#controllers/contrato_pasos_controller'
      )
      return new ContratoPasosController().store(ctx)
    })
    router.get('/:id', async (ctx) => {
      const { default: ContratoPasosController } = await import(
        '#controllers/contrato_pasos_controller'
      )
      return new ContratoPasosController().show(ctx)
    })
    router.put('/:id', async (ctx) => {
      const { default: ContratoPasosController } = await import(
        '#controllers/contrato_pasos_controller'
      )
      return new ContratoPasosController().update(ctx)
    })
    router.delete('/:id', async (ctx) => {
      const { default: ContratoPasosController } = await import(
        '#controllers/contrato_pasos_controller'
      )
      return new ContratoPasosController().destroy(ctx)
    })
  })
  .prefix('/contratos/:contratoId/pasos')
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

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
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

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
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .post('/contratos/:contratoId/salarios', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().storeSalario(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])

router
  .get('/contratos/:contratoId/salarios', async (ctx) => {
    const { default: ContratosController } = await import('#controllers/contratos_controller')
    return new ContratosController().listSalarios(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'TALENTO_HUMANO'] })
  ])
    /* =============================== CIUDADES ========================== */
    router.get('/ciudades/:id', async (ctx) => {
      const { default: CiudadesController } = await import('#controllers/ciudades_controller')
      return new CiudadesController().show(ctx)
    })

    /* ========================= CLASES DE VEHÍCULO ====================== */
    router.get('/clases-vehiculo', async (ctx) => {
      const { default: ClasesVehiculosController } = await import(
        '#controllers/clases_vehiculos_controller'
      )
      return new ClasesVehiculosController().index(ctx)
    })
    router.get('/clases-vehiculo/:id', async (ctx) => {
      const { default: ClasesVehiculosController } = await import(
        '#controllers/clases_vehiculos_controller'
      )
      return new ClasesVehiculosController().show(ctx)
    })
    router.post('/clases-vehiculo', async (ctx) => {
      const { default: ClasesVehiculosController } = await import(
        '#controllers/clases_vehiculos_controller'
      )
      return new ClasesVehiculosController().store(ctx)
    })
    router.put('/clases-vehiculo/:id', async (ctx) => {
      const { default: ClasesVehiculosController } = await import(
        '#controllers/clases_vehiculos_controller'
      )
      return new ClasesVehiculosController().update(ctx)
    })
    router.delete('/clases-vehiculo/:id', async (ctx) => {
      const { default: ClasesVehiculosController } = await import(
        '#controllers/clases_vehiculos_controller'
      )
      return new ClasesVehiculosController().destroy(ctx)
    })

    /* ================================ CLIENTES ========================= */
    router.get('/clientes', async (ctx) => {
      const { default: ClientesController } = await import('#controllers/clientes_controller')
      return new ClientesController().index(ctx)
    })
    router.get('/clientes/:id', async (ctx) => {
      const { default: ClientesController } = await import('#controllers/clientes_controller')
      return new ClientesController().show(ctx)
    })
    router.post('/clientes', async (ctx) => {
      const { default: ClientesController } = await import('#controllers/clientes_controller')
      return new ClientesController().store(ctx)
    })
    router.put('/clientes/:id', async (ctx) => {
      const { default: ClientesController } = await import('#controllers/clientes_controller')
      return new ClientesController().update(ctx)
    })
    router.delete('/clientes/:id', async (ctx) => {
      const { default: ClientesController } = await import('#controllers/clientes_controller')
      return new ClientesController().destroy(ctx)
    })

    router.get('/clientes/:id/detalle', async (ctx) => {
      const { default: ClientesController } = await import('#controllers/clientes_controller')
      return new ClientesController().detalle(ctx)
    })
    router.get('/clientes/:id/historial', async (ctx) => {
      const { default: ClientesController } = await import('#controllers/clientes_controller')
      return new ClientesController().historial(ctx)
    })

    /* ================================ VEHÍCULOS ======================== */
    router.get('/vehiculos', async (ctx) => {
      const { default: VehiculosController } = await import('#controllers/vehiculos_controller')
      return new VehiculosController().index(ctx)
    })
    router.get('/vehiculos/:id', async (ctx) => {
      const { default: VehiculosController } = await import('#controllers/vehiculos_controller')
      return new VehiculosController().show(ctx)
    })
    router.post('/vehiculos', async (ctx) => {
      const { default: VehiculosController } = await import('#controllers/vehiculos_controller')
      return new VehiculosController().store(ctx)
    })
    router.put('/vehiculos/:id', async (ctx) => {
      const { default: VehiculosController } = await import('#controllers/vehiculos_controller')
      return new VehiculosController().update(ctx)
    })
    router.delete('/vehiculos/:id', async (ctx) => {
      const { default: VehiculosController } = await import('#controllers/vehiculos_controller')
      return new VehiculosController().destroy(ctx)
    })
/* ========================= AGENTES CAPTACIÓN ======================= */

router
  .get('/agentes-captacion', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().index(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] })
  ])

router
  .get('/agentes-captacion/light', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().light(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

// ❌ CONTABILIDAD NO puede ver /me (no tiene agente asignado)
router
  .get('/agentes-captacion/me', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().me(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'COMERCIAL'] }),
  ])

// ✅ CONTABILIDAD SÍ puede ver fichas individuales de asesores
router
  .get('/agentes-captacion/:id', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().show(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .post('/agentes-captacion', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })
  ])

router
  .put('/agentes-captacion/:id', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().update(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })
  ])

router
  .delete('/agentes-captacion/:id', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().destroy(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })
  ])

// ✅ CONTABILIDAD SÍ puede ver resumen de asesor
router
  .get('/agentes-captacion/:id/resumen', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().resumen(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

// ✅ CONTABILIDAD SÍ puede ver prospectos de asesor
router
  .get('/agentes-captacion/:id/prospectos', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().prospectos(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .get('/agentes-captacion/by-user/:userId', async (ctx) => {
    const { default: AgentesCaptacionController } = await import(
      '#controllers/agentes_captacion_controller'
    )
    return new AgentesCaptacionController().byUser(ctx)
  })
  .where('userId', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

// ✅ CONTABILIDAD SÍ puede ver convenios de asesor
router
  .get('/agentes-captacion/:id/convenios', async (ctx) => {
    const { default: AgentesConveniosController } = await import(
      '#controllers/agentes_convenios_controller'
    )
    return new AgentesConveniosController().listByAsesor(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])
/* ============================== DATEOS ============================= */

router
  .get('/captacion-dateos', async (ctx) => {
    const { default: CaptacionDateosController } = await import(
      '#controllers/captacion_dateos_controller'
    )
    return new CaptacionDateosController().index(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .get('/captacion-dateos/:id', async (ctx) => {
    const { default: CaptacionDateosController } = await import(
      '#controllers/captacion_dateos_controller'
    )
    return new CaptacionDateosController().show(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] })
  ])

// ❌ CONTABILIDAD NO puede crear dateos
router
  .post('/captacion-dateos', async (ctx) => {
    const { default: CaptacionDateosController } = await import(
      '#controllers/captacion_dateos_controller'
    )
    return new CaptacionDateosController().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'COMERCIAL'] }),
  ])

// ❌ CONTABILIDAD NO puede verificar vencidos
router
  .post('/captacion-dateos/verificar-vencidos', async (ctx) => {
    const { default: CaptacionDateosController } = await import(
      '#controllers/captacion_dateos_controller'
    )
    return new CaptacionDateosController().verificarVencidos(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'COMERCIAL'] }),
  ])

router
  .put('/captacion-dateos/:id', async (ctx) => {
    const { default: CaptacionDateosController } = await import(
      '#controllers/captacion_dateos_controller'
    )
    return new CaptacionDateosController().update(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })
  ])

router
  .delete('/captacion-dateos/:id', async (ctx) => {
    const { default: CaptacionDateosController } = await import(
      '#controllers/captacion_dateos_controller'
    )
    return new CaptacionDateosController().destroy(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })
  ])

router
  .post('/captacion-dateos/auto-convenio', async (ctx) => {
    const { default: CaptacionUtilController } = await import(
      '#controllers/captacion_util_controller'
    )
    return new CaptacionUtilController().crearAutoPorConvenio(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })
  ])
  /* =============================== PROSPECTOS ======================== */

router
  .get('/prospectos', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().index(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .post('/prospectos', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .get('/prospectos/:id', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().show(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .put('/prospectos/:id', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().update(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

router
  .patch('/prospectos/:id', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().update(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

router
  .post('/prospectos/:id/asignar', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().asignar(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

router
  .post('/prospectos/:id/retirar', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().retirar(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

router
  .post('/prospectos/:id/datear', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().datear(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .get('/asesores/:id/resumen', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().resumenByAsesor(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .get('/prospectos/by-placa', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().findByPlaca(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

router
  .get('/prospectos/asesor/:id/list', async (ctx) => {
    const { default: ProspectosController } = await import('#controllers/prospectos_controller')
    return new ProspectosController().listByAsesor(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])
    /* =============================== CONVENIOS ========================= */

router
  .get('/convenios/buscar-por-nombre', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().buscarPorNombre(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'],
    }),
  ])

router
  .get('/convenios/asignados', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().asignadosPorAsesor(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'] }),
  ])

router
  .get('/convenios/light', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().light(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] }),
  ])

router
  .get('/convenios', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().index(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] }),
  ])

router
  .post('/convenios', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

router
  .get('/convenios/:id', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().show(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] }),
  ])

router
  .patch('/convenios/:id', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().update(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

router
  .get('/convenios/:id/asesor-activo', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().asesorActivo(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'],
    }),
  ])

router
  .post('/convenios/:id/asignar', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().asignarAsesor(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])

router
  .post('/convenios/:id/retirar', async (ctx) => {
    const { default: ConveniosController } = await import('#controllers/convenios_controller')
    return new ConveniosController().retirarAsesor(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] })
  ])
    /* =============================== COMISIONES ======================== */

    router
      .get('/comisiones/config', async (ctx) => {
        const { default: ComisionesController } = await import('#controllers/comisiones_controller')
        return new ComisionesController().configsIndex(ctx)
      })
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

    router
      .post('/comisiones/config', async (ctx) => {
        const { default: ComisionesController } = await import('#controllers/comisiones_controller')
        return new ComisionesController().configsUpsert(ctx)
      })
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

    router
      .patch('/comisiones/config/:id', async (ctx) => {
        const { default: ComisionesController } = await import('#controllers/comisiones_controller')
        return new ComisionesController().configsUpdate(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

    router
      .delete('/comisiones/config/:id', async (ctx) => {
        const { default: ComisionesController } = await import('#controllers/comisiones_controller')
        return new ComisionesController().configsDestroy(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

    router
      .get('/comisiones', async (ctx) => {
        const { default: ComisionesController } = await import('#controllers/comisiones_controller')
        return new ComisionesController().index(ctx)
      })
      .use([
        middleware.auth(),
        middleware.checkRole({
          roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'],
        }),
      ])

    router
      .get('/comisiones/metas-mensuales', async (ctx) => {
        const { default: ComisionesController } = await import('#controllers/comisiones_controller')
        return new ComisionesController().metasMensuales(ctx)
      })
      .use([
        middleware.auth(),
        middleware.checkRole({
          roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'COMERCIAL'],
        }),
      ])

    router
      .get('/comisiones/metas', async (ctx) => {
        const { default: ComisionesController } = await import('#controllers/comisiones_controller')
        return new ComisionesController().metasIndex(ctx)
      })
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

    router
      .post('/comisiones/metas', async (ctx) => {
        const { default: ComisionesController } = await import(
          '#controllers/comisiones_controller'
        )
        return new ComisionesController().metasUpsert(ctx)
      })
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

    router
      .patch('/comisiones/metas/:id', async (ctx) => {
        const { default: ComisionesController } = await import(
          '#controllers/comisiones_controller'
        )
        return new ComisionesController().metasUpdate(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

    router
      .delete('/comisiones/metas/:id', async (ctx) => {
        const { default: ComisionesController } = await import(
          '#controllers/comisiones_controller'
        )
        return new ComisionesController().metasDestroy(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

    router
      .get('/comisiones/:id', async (ctx) => {
        const { default: ComisionesController } = await import(
          '#controllers/comisiones_controller'
        )
        return new ComisionesController().show(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([
        middleware.auth(),
        middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] }),
      ])

    router
      .patch('/comisiones/:id/valores', async (ctx) => {
        const { default: ComisionesController } = await import(
          '#controllers/comisiones_controller'
        )
        return new ComisionesController().actualizarValores(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([
        middleware.auth(),
        middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] }),
      ])

    router
      .post('/comisiones/:id/aprobar', async (ctx) => {
        const { default: ComisionesController } = await import(
          '#controllers/comisiones_controller'
        )
        return new ComisionesController().aprobar(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([
        middleware.auth(),
        middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] }),
      ])

    router
      .post('/comisiones/:id/pagar', async (ctx) => {
        const { default: ComisionesController } = await import(
          '#controllers/comisiones_controller'
        )
        return new ComisionesController().pagar(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([
        middleware.auth(),
        middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD'] }),
      ])

    router
      .post('/comisiones/:id/anular', async (ctx) => {
        const { default: ComisionesController } = await import(
          '#controllers/comisiones_controller'
        )
        return new ComisionesController().anular(ctx)
      })
      .where('id', /^[0-9]+$/)
      .use([middleware.auth(), middleware.checkRole({ roles: ['SUPER_ADMIN', 'GERENCIA'] })])

/* ============================ FACTURACIÓN ========================== */

router
  .get('/facturacion/tickets', async (ctx) => {
    const { default: Facturacion } = await import(
      '#controllers/facturacion_tickets_controller'
    )
    return new Facturacion().index(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'OPERATIVO_TURNOS'],
    })
  ])

router
  .get('/facturacion/tickets/:id', async (ctx) => {
    const { default: Facturacion } = await import(
      '#controllers/facturacion_tickets_controller'
    )
    return new Facturacion().show(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'OPERATIVO_TURNOS'],
    })
  ])

router
  .get('/facturacion/tickets/hash-exists/:hash', async (ctx) => {
    const { default: Facturacion } = await import(
      '#controllers/facturacion_tickets_controller'
    )
    return new Facturacion().hashExists(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'OPERATIVO_TURNOS'],
    })
  ])

router
  .get('/facturacion/tickets/duplicados', async (ctx) => {
    const { default: Facturacion } = await import(
      '#controllers/facturacion_tickets_controller'
    )
    return new Facturacion().checkDuplicados(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'OPERATIVO_TURNOS'],
    })
  ])

router
  .post('/facturacion/tickets', async (ctx) => {
    const { default: Facturacion } = await import(
      '#controllers/facturacion_tickets_controller'
    )
    return new Facturacion().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS'],
    })
  ])

router
  .post('/facturacion/tickets/:id/reocr', async (ctx) => {
    const { default: Facturacion } = await import(
      '#controllers/facturacion_tickets_controller'
    )
    return new Facturacion().reocr(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'OPERATIVO_TURNOS'],
    })
  ])

router
  .patch('/facturacion/tickets/:id', async (ctx) => {
    const { default: Facturacion } = await import('#controllers/facturacion_tickets_controller')
    return new Facturacion().update(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'OPERATIVO_TURNOS'],
    })
  ])

router
  .post('/facturacion/tickets/:id/confirmar', async (ctx) => {
    const { default: Facturacion } = await import('#controllers/facturacion_tickets_controller')
    return new Facturacion().confirmar(ctx)
  })
  .where('id', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'CONTABILIDAD', 'OPERATIVO_TURNOS'],
    })
  ])

/* ============================ CERTIFICACIONES ====================== */

router
  .post('/certificaciones', async (ctx) => {
    const { default: CertificacionesController } = await import(
      '#controllers/certificaciones_controller'
    )
    return new CertificacionesController().store(ctx)
  })
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS']
    })
  ])

router
  .get('/certificaciones/turno/:turnoId', async (ctx) => {
    const { default: CertificacionesController } = await import(
      '#controllers/certificaciones_controller'
    )
    return new CertificacionesController().showByTurno(ctx)
  })
  .where('turnoId', /^[0-9]+$/)
  .use([
    middleware.auth(),
    middleware.checkRole({
      roles: ['SUPER_ADMIN', 'GERENCIA', 'OPERATIVO_TURNOS']
    })
  ])

    /* =============================== OCR (BACKEND) ===================== */

    router.post('/ocr/parse-ticket', async (ctx) => {
      const { default: OcrController } = await import('#controllers/ocr_controller')
      return new OcrController().parseTicket(ctx)
    })

    /* ================================ UPLOADS ========================== */

    router.post('/uploads/images', async (ctx) => {
      const { default: UploadsController } = await import('#controllers/uploads_controller')
      return new UploadsController().uploadImage(ctx)
    })
    router.get('/uploads/*', async (ctx) => {
      const { default: UploadsController } = await import('#controllers/uploads_controller')
      return new UploadsController().serve(ctx)
    })
    router.delete('/uploads/*', async (ctx) => {
      const { default: UploadsController } = await import('#controllers/uploads_controller')
      return new UploadsController().remove(ctx)
    })
  })
  .prefix('/api')
