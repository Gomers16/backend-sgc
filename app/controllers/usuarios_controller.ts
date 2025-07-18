import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'

export default class UsuariosController {
  public async index({ response }: HttpContext) {
    try {
      const users = await Usuario.query().preload('rol').preload('razonSocial').orderBy('id', 'asc')
      return response.ok(users)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener usuarios',
        error: error.message,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const usuario = await Usuario.query()
        .where('id', params.id)
        .preload('rol')
        .preload('razonSocial')
        .firstOrFail()

      return response.ok(usuario)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuario no encontrado' })
      }
      return response.internalServerError({
        message: 'Error al obtener usuario',
        error: error.message,
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    const payload = request.only([
      'nombres',
      'apellidos',
      'correo',
      'password',
      'rolId',
      'razonSocialId',
      'sede',
      'estado',
    ])

    try {
      const user = await Usuario.create(payload)
      await user.load('rol')
      await user.load('razonSocial')

      return response.created(user)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al crear usuario',
        error: error.message,
      })
    }
  }

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
        'sede',
        'estado',
      ])
      user.merge(payload)
      await user.save()
      await user.load('rol')
      await user.load('razonSocial')

      return response.ok(user)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al actualizar usuario',
        error: error.message,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await Usuario.findOrFail(params.id)
      await user.delete()
      return response.ok({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al eliminar usuario',
        error: error.message,
      })
    }
  }

  public async updateProfilePictureUrlNoAuth({ request, response }: HttpContext) {
    const { userId, url } = request.only(['userId', 'url'])

    if (!userId || !url) {
      return response.badRequest({ message: 'Se requiere userId y url' })
    }

    const user = await Usuario.find(userId)

    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }

    user.fotoPerfil = url
    await user.save()

    return response.ok({
      message: 'Foto de perfil actualizada con éxito',
      fotoPerfil: user.fotoPerfil,
    })
  }
}
