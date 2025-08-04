// app/Controllers/Http/UsuariosController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'
import path from 'node:path'

import Rol from '#models/rol'
import RazonSocial from '#models/razon_social'
import Sede from '#models/sede'
import Cargo from '#models/cargo'
import EntidadSalud from '#models/entidad_salud'

export default class UsuariosController {
  updateProfilePictureUrlNoAuth(): any {
    throw new Error('Method not implemented.')
  }
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
        .preload('contratos', (query) => { // ✅ Asegura que precargas los contratos
          query.preload('eventos') // ✅ Y aquí precargas los eventos dentro de cada contrato
          query.preload('pasos') // Si también necesitas los pasos, precárgalos aquí
        })

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
        .preload('contratos', (query) => { // ✅ Precarga los contratos
          query.preload('eventos') // ✅ Y precarga los eventos dentro de cada contrato
          query.preload('pasos') // También precarga los pasos si los necesitas
        })
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

      // ✅ Asegúrate de precargar todas las relaciones relevantes después de guardar
      await user.load((loader) => {
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
          .preload('contratos', (query) => { // ✅ Precarga los contratos
            query.preload('eventos') // ✅ Y precarga los eventos dentro de cada contrato
            query.preload('pasos') // Si también necesitas los pasos, precárgalos aquí
          })
      })

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

      if (user.fotoPerfil) {
        const oldPhotoRelativePath = user.fotoPerfil.replace(/^\//, '')
        const oldPhotoFullPath = path.join(app.publicPath(), oldPhotoRelativePath)

        try {
          await fs.unlink(oldPhotoFullPath)
        } catch (unlinkError) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo de perfil:', unlinkError)
          }
        }
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
   * Subir foto de perfil.
   */
  public async uploadProfilePicture({ request, response, params }: HttpContext) {
    const userId = params.id

    if (!userId) {
      return response.badRequest({ message: 'Se requiere el ID del usuario.' })
    }

    const user = await Usuario.findOrFail(userId)
    const foto = request.file('foto', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!foto || !foto.isValid) {
      const error = foto?.errors[0]
      return response.badRequest({
        message: error?.message || 'No se ha adjuntado ninguna foto o el archivo es inválido.',
      })
    }

    const uploadDir = 'uploads/profile_pictures'
    const fileName = `${user.id}_${cuid()}.${foto.extname}`

    try {
      // ✅ SOLUCIÓN FINAL: Usamos fs/promises para manejar las rutas absolutas
      // Elimina la foto de perfil anterior si existe
      if (user.fotoPerfil) {
        const oldPhotoRelativePath = user.fotoPerfil.replace(/^\//, '')
        const oldPhotoFullPath = path.join(app.publicPath(), oldPhotoRelativePath)

        try {
          // Intentamos borrar el archivo. Si no existe (ENOENT), no hacemos nada.
          await fs.unlink(oldPhotoFullPath)
        } catch (unlinkError) {
          if (unlinkError.code !== 'ENOENT') {
            console.error('Error al eliminar archivo de perfil anterior:', unlinkError)
          }
        }
      }

      // Crea la carpeta de destino si no existe
      const destinationDir = path.join(app.publicPath(), uploadDir)
      await fs.mkdir(destinationDir, { recursive: true })

      // Mueve el archivo del directorio temporal al destino final
      const newPhotoFullPath = path.join(destinationDir, fileName)
      await fs.copyFile(foto.tmpPath, newPhotoFullPath)

      // Construye la URL pública para el frontend
      const publicUrl = `/${uploadDir}/${fileName}`

      // Actualiza la propiedad `fotoPerfil` del usuario con la nueva URL
      user.fotoPerfil = publicUrl
      await user.save()

      // Precarga todas las relaciones antes de devolver el usuario
      await user.load((loader) => {
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
          .preload('contratos', (query) => { // ✅ Precarga los contratos
            query.preload('eventos') // ✅ Y precarga los eventos dentro de cada contrato
            query.preload('pasos') // Si también necesitas los pasos, precárgalos aquí
          })
      })

      // Devuelve el objeto de usuario completo para que el frontend lo use
      return response.ok(user)
    } catch (error) {
      console.error('Error al subir la foto de perfil:', error)
      return response.internalServerError({
        message: 'Error al subir la foto de perfil',
        error: error.message,
      })
    }
  }
}
