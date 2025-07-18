// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TurnosRtmController = () => import('#controllers/turnos_rtms_controller')
const AuthController = () => import('#controllers/auth_controller')
const UsuariosController = () => import('#controllers/usuarios_controller')

router.get('/', async () => {
  return { message: 'Bienvenido a la API de Turnos RTM' }
})

router.post('/login', [AuthController, 'login'])
router.post('/forgot-password', [AuthController, 'forgotPassword'])
router.post('/reset-password', [AuthController, 'resetPassword'])

router
  .group(() => {
    router.get('turnos-rtm', [TurnosRtmController, 'index'])
    router.get('turnos-rtm/siguiente-turno', [TurnosRtmController, 'siguienteTurno'])
    router.post('turnos-rtm', [TurnosRtmController, 'store'])
    router.get('turnos-rtm/:id', [TurnosRtmController, 'show'])
    router.put('turnos-rtm/:id', [TurnosRtmController, 'update'])
    router.put('turnos-rtm/:id/salida', [TurnosRtmController, 'registrarSalida'])
    router.patch('turnos-rtm/:id/activar', [TurnosRtmController, 'activar'])
    router.patch('turnos-rtm/:id/cancelar', [TurnosRtmController, 'cancelar'])
    router.patch('turnos-rtm/:id/inhabilitar', [TurnosRtmController, 'destroy'])
  })
  .prefix('/api')

router
  .group(() => {
    router.resource('usuarios', UsuariosController).apiOnly()
    router.put('usuarios/profile-picture-url', [
      UsuariosController,
      'updateProfilePictureUrlNoAuth',
    ])
  })
  .prefix('/api')
  .middleware(middleware.auth())
