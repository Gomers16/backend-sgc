// app/controllers/usuarios_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'

// Modelos
import Usuario from '#models/usuario'
import Rol from '#models/rol'
import RazonSocial from '#models/razon_social'
import Sede from '#models/sede'
import Cargo from '#models/cargo'
import EntidadSalud from '#models/entidad_salud'

/** Campos a seleccionar cuando se precarga el usuario actor */
const USER_SELECT = ['id', 'nombres', 'apellidos', 'correo'] as const

/** Helper para precargar TODO lo necesario en Usuario (evita duplicar lógica) */
function preloadUsuarioCompleto(loader: ReturnType<typeof Usuario.prototype.load>) {
  loader
    .preload('rol')
    .preload('razonSocial')
    .preload('sede')
    .preload('cargo')
    .preload('eps')
    .preload('arl')
    .preload('afp')
    .preload('afc')
    .preload('ccf')
    .preload('contratos', (contractQuery) => {
      contractQuery
        .orderBy('fecha_inicio', 'desc')
        .preload('cargo')
        .preload('sede')
        .preload('eps')
        .preload('arl')
        .preload('afp')
        .preload('afc')
        .preload('ccf')
        // Eventos con su usuario (actor) y ordenados
        .preload('eventos', (ev) => {
          ev.preload('usuario', (u) => u.select(USER_SELECT))
          ev.orderBy('created_at', 'desc')
        })
        // PASOS: ahora también traen el usuario (actor)
        .preload('pasos', (p) => {
          // Si prefieres fase/orden: p.orderBy('fase').orderBy('orden', 'asc').orderBy('id', 'asc')
          p.orderBy('created_at', 'desc')
          p.preload('usuario', (u) => u.select(USER_SELECT))
        })
        .preload('historialEstados', (historialQuery) => {
          historialQuery.orderBy('fecha_cambio', 'desc').preload('usuario')
        })
        .preload('cambios', (c) => {
          c.preload('usuario').orderBy('created_at', 'desc')
        })
    })
}

export default class UsuariosController {
  /** Lista de usuarios (opcionalmente filtrados por razón social) */
  public async index({ request, response }: HttpContext) {
    try {
      const razonSocialId = request.input('razon_social_id')

      const query = Usuario.query()
        .preload('rol')
        .preload('razonSocial')
        .preload('sede')
        .preload('cargo')
        .preload('eps')
        .preload('arl')
        .preload('afp')
        .preload('afc')
        .preload('ccf')
        .preload('contratos', (contractQuery) => {
          contractQuery
            .orderBy('fecha_inicio', 'desc')
            .preload('cargo')
            .preload('sede')
            .preload('eps')
            .preload('arl')
            .preload('afp')
            .preload('afc')
            .preload('ccf')
            // 👇 eventos con usuario
            .preload('eventos', (ev) => {
              ev.preload('usuario', (u) => u.select(USER_SELECT))
              ev.orderBy('created_at', 'desc')
            })
            // 👇 pasos con usuario (actor)
            .preload('pasos', (p) => {
              // Si prefieres fase/orden: p.orderBy('fase').orderBy('orden', 'asc').orderBy('id', 'asc')
              p.orderBy('created_at', 'desc')
              p.preload('usuario', (u) => u.select(USER_SELECT))
            })
            .preload('historialEstados', (historialQuery) => {
              historialQuery.orderBy('fecha_cambio', 'desc').preload('usuario')
            })
            .preload('cambios', (c) => {
              c.preload('usuario').orderBy('created_at', 'desc')
            })
        })

      if (razonSocialId) query.where('razon_social_id', razonSocialId)

      const users = await query.orderBy('id', 'asc')
      return response.ok(users)
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error)
      return response.internalServerError({
        message: 'Error al obtener usuarios',
        error: error.message,
      })
    }
  }

  /** Usuario por ID (con contratos y relaciones completas) */
  public async show({ params, response }: HttpContext) {
    try {
      const usuario = await Usuario.query()
        .where('id', params.id)
        .preload('rol')
        .preload('razonSocial')
        .preload('sede')
        .preload('cargo')
        .preload('eps')
        .preload('arl')
        .preload('afp')
        .preload('afc')
        .preload('ccf')
        .preload('contratos', (contractQuery) => {
          contractQuery
            .orderBy('fecha_inicio', 'desc')
            .preload('cargo')
            .preload('sede')
            .preload('eps')
            .preload('arl')
            .preload('afp')
            .preload('afc')
            .preload('ccf')
            // 👇 eventos con su usuario
            .preload('eventos', (ev) => {
              ev.preload('usuario', (u) => u.select(USER_SELECT))
              ev.orderBy('created_at', 'desc')
            })
            // 👇 pasos con usuario (actor)
            .preload('pasos', (p) => {
              // Si prefieres fase/orden: p.orderBy('fase').orderBy('orden', 'asc').orderBy('id', 'asc')
              p.orderBy('created_at', 'desc')
              p.preload('usuario', (u) => u.select(USER_SELECT))
            })
            .preload('historialEstados', (historialQuery) => {
              historialQuery.orderBy('fecha_cambio', 'desc').preload('usuario')
            })
            .preload('cambios', (c) => {
              c.preload('usuario').orderBy('created_at', 'desc')
            })
        })
        .firstOrFail()

      return response.ok(usuario)
    } catch (error: any) {
      console.error('Error al obtener usuario por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND')
        return response.notFound({ message: 'Usuario no encontrado' })
      return response.internalServerError({
        message: 'Error al obtener usuario',
        error: error.message,
      })
    }
  }

  /** Crear usuario */
  public async store({ request, response }: HttpContext) {
    const payload = request.only([
      'nombres',
      'apellidos',
      'correo',
      'password',
      'rolId',
      'razonSocialId',
      'sedeId',
      'cargoId',
      'fotoPerfil',
      'direccion',
      'celularPersonal',
      'celularCorporativo',
      'centroCosto',
      'estado',
      'recomendaciones',
      'epsId',
      'arlId',
      'afpId',
      'afcId',
      'ccfId',
    ])

    try {
      const user = await Usuario.create({
        ...payload,
        sedeId: payload.sedeId ?? null,
        cargoId: payload.cargoId ?? null,
        epsId: payload.epsId ?? null,
        arlId: payload.arlId ?? null,
        afpId: payload.afpId ?? null,
        afcId: payload.afcId ?? null,
        ccfId: payload.ccfId ?? null,
      })

      await user.load((loader) => preloadUsuarioCompleto(loader))

      return response.created(user)
    } catch (error: any) {
      console.error('Error al crear usuario:', error)
      if (error.code === 'ER_DUP_ENTRY')
        return response.conflict({ message: 'El correo electrónico ya está registrado.' })
      return response.internalServerError({
        message: 'Error al crear usuario',
        error: error.message,
      })
    }
  }

  /** Actualizar usuario */
  public async update({ params, request, response }: HttpContext) {
    try {
      const user = await Usuario.findOrFail(params.id)

      const payload = request.only([
        'nombres',
        'apellidos',
        'correo',
        'password',
        'rolId',
        'razonSocialId',
        'sedeId',
        'cargoId',
        'fotoPerfil',
        'direccion',
        'celularPersonal',
        'celularCorporativo',
        'centroCosto',
        'estado',
        'recomendaciones',
        'epsId',
        'arlId',
        'afpId',
        'afcId',
        'ccfId',
      ])

      user.merge({
        ...payload,
        sedeId: payload.sedeId ?? null,
        cargoId: payload.cargoId ?? null,
        epsId: payload.epsId ?? null,
        arlId: payload.arlId ?? null,
        afpId: payload.afpId ?? null,
        afcId: payload.afcId ?? null,
        ccfId: payload.ccfId ?? null,
      })
      await user.save()

      await user.load((loader) => preloadUsuarioCompleto(loader))

      return response.ok(user)
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error)
      if (error.code === 'E_ROW_NOT_FOUND')
        return response.notFound({ message: 'Usuario a actualizar no encontrado.' })
      return response.internalServerError({
        message: 'Error al actualizar usuario',
        error: error.message,
      })
    }
  }

  /** Eliminar usuario */
  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await Usuario.findOrFail(params.id)

      // Eliminar solo foto de perfil
      if (user.fotoPerfil) {
        const oldPhotoRelativePath = user.fotoPerfil.replace(/^\//, '')
        const oldPhotoFullPath = path.join(app.publicPath(), oldPhotoRelativePath)
        try {
          await fs.unlink(oldPhotoFullPath)
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('Error al eliminar foto perfil:', e)
        }
      }

      await user.delete()
      return response.ok({ message: 'Usuario eliminado correctamente' })
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error)
      if (error.code === 'E_ROW_NOT_FOUND')
        return response.notFound({ message: 'Usuario a eliminar no encontrado.' })
      return response.internalServerError({
        message: 'Error al eliminar usuario',
        error: error.message,
      })
    }
  }

  /* ============ SELECTORES ============ */
  public async getRoles({ response }: HttpContext) {
    try {
      const roles = await Rol.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(roles)
    } catch {
      return response.internalServerError({ message: 'Error al obtener roles' })
    }
  }

  public async getRazonesSociales({ response }: HttpContext) {
    try {
      const razones = await RazonSocial.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(razones)
    } catch {
      return response.internalServerError({ message: 'Error al obtener razones sociales' })
    }
  }

  public async getSedes({ response }: HttpContext) {
    try {
      const sedes = await Sede.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(sedes)
    } catch {
      return response.internalServerError({ message: 'Error al obtener sedes' })
    }
  }

  public async getCargos({ response }: HttpContext) {
    try {
      const cargos = await Cargo.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(cargos)
    } catch {
      return response.internalServerError({ message: 'Error al obtener cargos' })
    }
  }

  public async getEntidadesSalud({ response }: HttpContext) {
    try {
      const entidades = await EntidadSalud.query()
        .select('id', 'nombre', 'tipo')
        .orderBy('nombre', 'asc')
      return response.ok(entidades)
    } catch {
      return response.internalServerError({ message: 'Error al obtener entidades de salud' })
    }
  }

  /** Subir foto de perfil */
  public async uploadProfilePicture({ request, response, params }: HttpContext) {
    const userId = params.id
    if (!userId) return response.badRequest({ message: 'Se requiere el ID del usuario.' })

    const user = await Usuario.findOrFail(userId)
    const foto = request.file('foto', { size: '2mb', extnames: ['jpg', 'png', 'jpeg'] })

    if (!foto || !foto.isValid) {
      const error = foto?.errors[0]
      return response.badRequest({
        message: error?.message || 'No se adjuntó foto o el archivo es inválido.',
      })
    }
    if (!foto.tmpPath) {
      return response.internalServerError({ message: 'No se pudo leer la ruta temporal del archivo.' })
    }

    const uploadDir = 'uploads/profile_pictures'
    const fileName = `${user.id}_${cuid()}.${foto.extname}`

    try {
      if (user.fotoPerfil) {
        const oldRel = user.fotoPerfil.replace(/^\//, '')
        const oldFull = path.join(app.publicPath(), oldRel)
        try {
          await fs.unlink(oldFull)
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('Error al eliminar foto anterior:', e)
        }
      }

      const destinationDir = path.join(app.publicPath(), uploadDir)
      await fs.mkdir(destinationDir, { recursive: true })
      const newPhotoFullPath = path.join(destinationDir, fileName)
      await fs.copyFile(foto.tmpPath, newPhotoFullPath)

      user.fotoPerfil = `/${uploadDir}/${fileName}`
      await user.save()

      await user.load((loader) => preloadUsuarioCompleto(loader))

      return response.ok(user)
    } catch (error: any) {
      console.error('Error al subir la foto de perfil:', error)
      return response.internalServerError({
        message: 'Error al subir la foto de perfil',
        error: error.message,
      })
    }
  }
}
