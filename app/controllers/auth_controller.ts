// app/Controllers/Http/AuthController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import hash from '@adonisjs/core/services/hash'
import PasswordReset from '#models/password_reset'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import crypto from 'node:crypto'

export default class AuthController {
  /**
   * Login del usuario: devuelve token + datos del usuario.
   */
  public async login({ request, response }: HttpContext) {
    const { correo, password } = request.only(['correo', 'password'])

    try {
      const user = await Usuario.query().where('correo', correo).preload('rol').firstOrFail()

      const cleanedPassword = typeof password === 'string' ? password.trim() : ''

      const isPasswordValid = await hash.verify(user.password, cleanedPassword)

      if (!isPasswordValid) {
        return response.unauthorized({ message: 'Correo o contraseña inválidos' })
      }

      const token = await Usuario.accessTokens.create(user, [])

      const userData = user.serialize()
      userData.profilePictureUrl = user.fotoPerfil

      return {
        type: 'bearer',
        token: token,
        user: userData,
      }
    } catch (error) {
      console.error('Error en login:', error)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.unauthorized({ message: 'Correo o contraseña inválidos' })
      }
      return response.internalServerError({ message: 'Error interno del servidor' })
    }
  }

  /**
   * Solicitud de restablecimiento de contraseña.
   */
  public async forgotPassword({ request, response }: HttpContext) {
    const correo = request.input('correo')

    const user = await Usuario.findBy('correo', correo)
    if (!user) {
      return response.badRequest({ message: 'El correo no está registrado.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    await PasswordReset.query().where('correo', correo).delete()

    await PasswordReset.create({
      correo: correo,
      token,
      expiresAt,
    })

    await mail.send((message) => {
      const enlace = `http://localhost:5173/new-password/${token}`

      message.to(correo).from('criferdel10@gmail.com', 'TuApp').subject('Restablece tu contraseña')
        .html(`
          <h2>Hola,</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${enlace}" style="display:inline-block; margin-top:1rem; padding:0.75rem 1.5rem; background:#4f46e5; color:#fff; text-decoration:none; border-radius:4px;">Restablecer contraseña</a>
          <p>Este enlace expirará el <strong>${expiresAt.toFormat('yyyy-MM-dd HH:mm')}</strong>.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <p style="margin-top:2rem; color:#777; font-size:0.875rem;">Gracias,<br/>El equipo de TuApp</p>
        `)
    })

    return response.ok({
      message: 'Correo enviado con instrucciones para restablecer la contraseña.',
    })
  }

  /**
   * Restablecimiento de contraseña: verifica token y actualiza contraseña.
   */
  public async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])

    const resetRecord = await PasswordReset.query()
      .where('token', token)
      .andWhere('expiresAt', '>', DateTime.now().toJSDate())
      .first()

    if (!resetRecord) {
      return response.badRequest({ message: 'El token es inválido o ha expirado.' })
    }

    const user = await Usuario.findBy('correo', resetRecord.correo)
    if (!user) {
      return response.badRequest({ message: 'Usuario no encontrado.' })
    }

    user.password = await hash.make(password)
    await user.save()

    await resetRecord.delete()

    return response.ok({ message: 'La contraseña se actualizó correctamente.' })
  }
}
