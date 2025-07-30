// app/Controllers/Http/UsuariosController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import Drive from '@adonisjs/drive/services/main'
import app from '@adonisjs/core/services/app'

import Rol from '#models/rol'
import RazonSocial from '#models/razon_social'
import Sede from '#models/sede'
import Cargo from '#models/cargo'
import EntidadSalud from '#models/entidad_salud'

export default class UsuariosController {
  /**
   * Obtener todos los usuarios o filtrados por razón social.
   */
  public async index({ request, response }: HttpContext) {
    try {
      const razonSocialId = request.input('razon_social_id')

      let query = Usuario.query()
        .preload('rol')
        .preload('razonSocial')
        .preload('sede')
        .preload('cargo')
        .preload('eps')
        .preload('arl')
        .preload('afp')
        .preload('afc')
        .preload('ccf')
        .preload('contratos') // 👈 Importante para la vista

      if (razonSocialId) {
        query.where('razon_social_id', razonSocialId)
      }

      const users = await query.orderBy('id', 'asc')

      return response.ok(users)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return response.internalServerError({
        message: 'Error al obtener usuarios',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un usuario por su ID.
   */
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
        .preload('contratos')
        .firstOrFail()

      return response.ok(usuario)
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuario no encontrado' })
      }
      return response.internalServerError({
        message: 'Error al obtener usuario',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo usuario.
   */
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
      if (!payload.sedeId) {
        return response.badRequest({ message: 'SedeId es requerida.' })
      }

      const user = await Usuario.create(payload)

      await user.load('rol')
      await user.load('razonSocial')
      await user.load('sede')
      await user.load('cargo')
      await user.load('eps')
      await user.load('arl')
      await user.load('afp')
      await user.load('afc')
      await user.load('ccf')

      return response.created(user)
    } catch (error) {
      console.error('Error al crear usuario:', error)
      if (error.code === 'ER_DUP_ENTRY') {
        return response.conflict({ message: 'El correo electrónico ya está registrado.' })
      }
      return response.internalServerError({
        message: 'Error al crear usuario',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un usuario existente.
   */
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

      user.merge(payload)
      await user.save()

      await user.load('rol')
      await user.load('razonSocial')
      await user.load('sede')
      await user.load('cargo')
      await user.load('eps')
      await user.load('arl')
      await user.load('afp')
      await user.load('afc')
      await user.load('ccf')

      return response.ok(user)
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuario a actualizar no encontrado.' })
      }
      return response.internalServerError({
        message: 'Error al actualizar usuario',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un usuario.
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await Usuario.findOrFail(params.id)

      if (user.fotoPerfil && user.fotoPerfil.startsWith('/uploads/')) {
        await Drive.use('fs').delete(user.fotoPerfil.replace('/uploads/', 'uploads/'))
      }

      await user.delete()
      return response.ok({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuario a eliminar no encontrado.' })
      }
      return response.internalServerError({
        message: 'Error al eliminar usuario',
        error: error.message,
      })
    }
  }

  /**
   * Listas auxiliares
   */
  public async getRoles({ response }: HttpContext) {
    try {
      const roles = await Rol.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(roles)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener roles' })
    }
  }

  public async getRazonesSociales({ response }: HttpContext) {
    try {
      const razones = await RazonSocial.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(razones)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener razones sociales' })
    }
  }

  public async getSedes({ response }: HttpContext) {
    try {
      const sedes = await Sede.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(sedes)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener sedes' })
    }
  }

  public async getCargos({ response }: HttpContext) {
    try {
      const cargos = await Cargo.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(cargos)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener cargos' })
    }
  }

  public async getEntidadesSalud({ response }: HttpContext) {
    try {
      const entidades = await EntidadSalud.query().select('id', 'nombre').orderBy('nombre', 'asc')
      return response.ok(entidades)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener entidades de salud' })
    }
  }

  /**
   * Subir foto de perfil
   */
  public async updateProfilePictureUrlNoAuth({ request, response, params }: HttpContext) {
    const userId = params.id
    const foto = request.file('foto', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!userId) {
      return response.badRequest({ message: 'Se requiere el ID del usuario.' })
    }

    if (!foto) {
      return response.badRequest({ message: 'No se ha adjuntado ninguna foto.' })
    }

    const user = await Usuario.find(userId)
    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado.' })
    }

    const uploadDir = 'uploads/profile_pictures'
    const fileName = `${user.id}_${Date.now()}.${foto.extname}`
    const filePathInPublic = `${uploadDir}/${fileName}`

    try {
      await foto.move(app.publicPath(filePathInPublic))
      const publicUrl = `/${filePathInPublic}`
      user.fotoPerfil = publicUrl
      await user.save()

      return response.ok({
        message: 'Foto de perfil actualizada con éxito',
        fotoPerfilUrl: user.fotoPerfil,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al subir la foto de perfil',
        error: error.message,
      })
    }
  }
}
