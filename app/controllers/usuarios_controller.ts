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

// ===== utilidades para anexos por afiliación =====
const TIPOS_AFILIACION = ['eps', 'arl', 'afp', 'afc', 'ccf'] as const
type TipoAfi = (typeof TIPOS_AFILIACION)[number]

function camposDe(tipo: TipoAfi) {
  return {
    path: `${tipo}DocPath` as const,
    nombre: `${tipo}DocNombre` as const,
    mime: `${tipo}DocMime` as const,
    size: `${tipo}DocSize` as const,
    dir: `uploads/afiliaciones/${tipo}`, // directorio público
    downloadName: `${tipo}_soporte`,     // base del nombre físico
  }
}

const ALLOWED_MIMES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

function noCache(res: HttpContext['response']) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.header('Pragma', 'no-cache')
  res.header('Expires', '0')
  res.header('Surrogate-Control', 'no-store')
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
            .preload('eventos')
            .preload('pasos')
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
            .preload('eventos')
            .preload('pasos')
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
              .preload('eventos')
              .preload('pasos')
              .preload('historialEstados', (historialQuery) => {
                historialQuery.orderBy('fecha_cambio', 'desc').preload('usuario')
              })
              .preload('cambios', (c) => {
                c.preload('usuario').orderBy('created_at', 'desc')
              })
          })
      })

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

      if (user.fotoPerfil) {
        const oldPhotoRelativePath = user.fotoPerfil.replace(/^\//, '')
        const oldPhotoFullPath = path.join(app.publicPath(), oldPhotoRelativePath)
        try {
          await fs.unlink(oldPhotoFullPath)
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.error('Error al eliminar foto perfil:', e)
        }
      }

      const delIf = async (relPath?: string | null) => {
        if (!relPath) return
        try {
          await fs.unlink(path.join(app.publicPath(), relPath.replace(/^\//, '')))
        } catch {}
      }
      await delIf(user.epsDocPath)
      await delIf(user.arlDocPath)
      await delIf(user.afpDocPath)
      await delIf(user.afcDocPath)
      await delIf(user.ccfDocPath)
      await delIf(user.recoMedDocPath)

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
              .preload('eventos')
              .preload('pasos')
              .preload('historialEstados', (historialQuery) => {
                historialQuery.orderBy('fecha_cambio', 'desc').preload('usuario')
              })
              .preload('cambios', (c) => {
                c.preload('usuario').orderBy('created_at', 'desc')
              })
          })
      })

      return response.ok(user)
    } catch (error: any) {
      console.error('Error al subir la foto de perfil:', error)
      return response.internalServerError({
        message: 'Error al subir la foto de perfil',
        error: error.message,
      })
    }
  }

  // ================== ANEXOS POR AFILIACIÓN ==================

  /** POST /usuarios/:id/afiliacion/:tipo/archivo */
  public async uploadAfiliacionFile({ params, request, response }: HttpContext) {
    const userId = Number(params.id)
    const tipo = String(params.tipo || '').toLowerCase() as TipoAfi
    if (!TIPOS_AFILIACION.includes(tipo))
      return response.badRequest({ message: 'Tipo de afiliación inválido.' })

    const file = request.file('archivo')
    if (!file || !file.isValid || !file.tmpPath || !file.clientName) {
      return response.badRequest({ message: 'Archivo inválido o no enviado.' })
    }
    const mime =
      file.type && file.subtype
        ? `${file.type}/${file.subtype}`
        : (file.headers?.['content-type'] as string) || ''
    if (!ALLOWED_MIMES.includes(mime))
      return response.badRequest({ message: 'Tipo de archivo no permitido.' })

    const user = await Usuario.findOrFail(userId)
    const c = camposDe(tipo)

    // directorio destino: /public/uploads/afiliaciones/:tipo/:userId
    const dir = path.join(app.publicPath(), c.dir, String(userId))
    await fs.mkdir(dir, { recursive: true })

    // eliminar archivo anterior si existe
    const prev = (user as any)[c.path] as string | null
    if (prev) {
      try {
        await fs.unlink(path.join(app.publicPath(), prev.replace(/^\//, '')))
      } catch {}
    }

    const ext = file.extname ? `.${file.extname}` : ''
    const fileName = `${userId}_${c.downloadName}_${cuid()}${ext}`
    const rel = `${c.dir}/${userId}/${fileName}`
    await fs.copyFile(file.tmpPath!, path.join(app.publicPath(), rel))
    const stat = await fs.stat(path.join(app.publicPath(), rel))

    ;(user as any)[c.path] = `/${rel}`
    ;(user as any)[c.nombre] = file.clientName
    ;(user as any)[c.mime] = mime
    ;(user as any)[c.size] = Number(stat.size)
    await user.save()

    noCache(response)

    // respuesta unificada con GET
    return response.created({
      userId,
      tipo,
      tieneArchivo: true,
      data: {
        url: (user as any)[c.path],
        nombreOriginal: (user as any)[c.nombre],
        mime: (user as any)[c.mime],
        size: (user as any)[c.size],
      },
    })
  }

  /** GET /usuarios/:id/afiliacion/:tipo/archivo */
  public async getAfiliacionFile({ params, response }: HttpContext) {
    try {
      const userId = Number(params.id)
      const tipo = String(params.tipo || '').toLowerCase() as TipoAfi
      if (!TIPOS_AFILIACION.includes(tipo))
        return response.badRequest({ message: 'Tipo de afiliación inválido.' })

      const user = await Usuario.findOrFail(userId)
      const c = camposDe(tipo)
      const pathRel = (user as any)[c.path] as string | null

      noCache(response)

      // si hay ruta en DB, verifica que el archivo exista aún
      let existe = false
      if (pathRel) {
        try {
          const abs = path.join(app.publicPath(), pathRel.replace(/^\//, ''))
          const st = await fs.stat(abs)
          existe = !!st?.isFile()
        } catch {
          existe = false
        }
      }

      return response.ok({
        userId,
        tipo,
        tieneArchivo: !!pathRel && existe,
        data: !!pathRel && existe
          ? {
              url: (user as any)[c.path],
              nombreOriginal: (user as any)[c.nombre],
              mime: (user as any)[c.mime],
              size: (user as any)[c.size],
            }
          : null,
      })
    } catch (error: any) {
      console.error('Error al obtener meta de afiliación:', error)
      // entregamos una forma segura (sin tirar 500 al front del modal)
      noCache(response)
      return response.ok({ userId: Number(params.id), tipo: String(params.tipo || ''), tieneArchivo: false, data: null })
    }
  }

  /** DELETE /usuarios/:id/afiliacion/:tipo/archivo */
  public async deleteAfiliacionFile({ params, response }: HttpContext) {
    const userId = Number(params.id)
    const tipo = String(params.tipo || '').toLowerCase() as TipoAfi
    if (!TIPOS_AFILIACION.includes(tipo))
      return response.badRequest({ message: 'Tipo de afiliación inválido.' })

    const user = await Usuario.findOrFail(userId)
    const c = camposDe(tipo)
    const pathRel = (user as any)[c.path] as string | null

    if (pathRel) {
      try {
        await fs.unlink(path.join(app.publicPath(), pathRel.replace(/^\//, '')))
      } catch {}
    }

    ;(user as any)[c.path] = null
    ;(user as any)[c.nombre] = null
    ;(user as any)[c.mime] = null
    ;(user as any)[c.size] = null
    await user.save()

    noCache(response)

    return response.ok({ message: `Archivo de ${tipo.toUpperCase()} eliminado.` })
  }

  // ================== RECOMENDACIÓN MÉDICA ==================

  /** PUT /usuarios/:id/recomendacion-medica  (texto) */
  public async upsertRecomendacionMedica({ params, request, response }: HttpContext) {
    const user = await Usuario.findOrFail(params.id)
    const texto = request.input('recomendacionMedica')
    user.recomendacionMedica = texto ?? null
    await user.save()
    return response.ok({
      message: 'Recomendación médica actualizada.',
      recomendacionMedica: user.recomendacionMedica,
    })
  }

  /** POST /usuarios/:id/recomendacion-medica/archivo */
  public async uploadRecomendacionMedicaFile({ params, request, response }: HttpContext) {
    const user = await Usuario.findOrFail(params.id)
    const file = request.file('archivo')
    if (!file || !file.isValid || !file.tmpPath || !file.clientName) {
      return response.badRequest({ message: 'Archivo inválido o no enviado.' })
    }
    const mime =
      file.type && file.subtype
        ? `${file.type}/${file.subtype}`
        : (file.headers?.['content-type'] as string) || ''
    if (!ALLOWED_MIMES.includes(mime)) {
      return response.badRequest({ message: 'Tipo de archivo no permitido.' })
    }

    const dir = path.join(app.publicPath(), 'uploads/recomendaciones_medicas', String(user.id))
    await fs.mkdir(dir, { recursive: true })

    if (user.recoMedDocPath) {
      try {
        await fs.unlink(path.join(app.publicPath(), user.recoMedDocPath.replace(/^\//, '')))
      } catch {}
    }

    const ext = file.extname ? `.${file.extname}` : ''
    const fileName = `${user.id}_reco_med_${cuid()}${ext}`
    const rel = `uploads/recomendaciones_medicas/${user.id}/${fileName}`
    await fs.copyFile(file.tmpPath!, path.join(app.publicPath(), rel))
    const stat = await fs.stat(path.join(app.publicPath(), rel))

    user.recoMedDocPath = `/${rel}`
    user.recoMedDocNombre = file.clientName
    user.recoMedDocMime = mime
    user.recoMedDocSize = Number(stat.size)
    await user.save()

    noCache(response)

    return response.created({
      message: 'Archivo de recomendación médica cargado.',
      url: user.recoMedDocPath,
    })
  }

  /** DELETE /usuarios/:id/recomendacion-medica/archivo */
  public async deleteRecomendacionMedicaFile({ params, response }: HttpContext) {
    const user = await Usuario.findOrFail(params.id)
    if (user.recoMedDocPath) {
      try {
        await fs.unlink(path.join(app.publicPath(), user.recoMedDocPath.replace(/^\//, '')))
      } catch {}
    }
    user.recoMedDocPath = null
    user.recoMedDocNombre = null
    user.recoMedDocMime = null
    user.recoMedDocSize = null
    await user.save()

    noCache(response)

    return response.ok({ message: 'Archivo de recomendación médica eliminado.' })
  }
}
