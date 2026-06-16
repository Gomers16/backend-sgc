import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import TramiteChecklist from '#models/tramite_checklist'

const CAMPOS_CHECKLIST = [
  'tarjetaPropiedad',
  'soat',
  'runtVendedor',
  'runtComprador',
  'antecedentesComprador',
  'antecedentesVendedor',
  'levantaPrendaOriginal',
  'inscribePrendaOriginal',
  'camaraComercio',
  'certificadoImpuestos',
  'declaracionExtrajuicio',
  'pazSalvoEmpresa',
  'cesionDerechoEmpresa',
  'observaciones',
] as const

const CHECKLIST_VACIO = {
  id: null,
  tarjetaPropiedad: false,
  soat: false,
  runtVendedor: false,
  runtComprador: false,
  antecedentesComprador: false,
  antecedentesVendedor: false,
  levantaPrendaOriginal: false,
  inscribePrendaOriginal: false,
  camaraComercio: false,
  certificadoImpuestos: false,
  declaracionExtrajuicio: false,
  pazSalvoEmpresa: false,
  cesionDerechoEmpresa: false,
  observaciones: null,
}

export default class TramiteChecklistsController {
  /** GET /tramites/checklist?sedeId=&fecha=&turnoNumero= */
  public async getByTurno({ request, response }: HttpContext) {
    try {
      const sedeId = Number(request.input('sedeId'))
      const fecha = request.input('fecha') as string
      const turnoNumero = Number(request.input('turnoNumero'))

      if (!sedeId || !fecha || !turnoNumero) {
        return response.badRequest({ message: 'sedeId, fecha y turnoNumero son requeridos' })
      }

      const checklist = await TramiteChecklist.query()
        .where('sede_id', sedeId)
        .where('fecha', fecha)
        .where('turno_numero', turnoNumero)
        .first()

      if (!checklist) {
        return response.ok({ ...CHECKLIST_VACIO, sedeId, fecha, turnoNumero })
      }

      return response.ok(checklist)
    } catch (error) {
      console.error('Error en getByTurno checklist:', error)
      return response.internalServerError({ message: 'Error al obtener el checklist' })
    }
  }

  /** PUT /tramites/checklist */
  public async upsert({ request, response }: HttpContext) {
    try {
      const sedeId = Number(request.input('sedeId'))
      const fecha = request.input('fecha') as string
      const turnoNumero = Number(request.input('turnoNumero'))

      if (!sedeId || !fecha || !turnoNumero) {
        return response.badRequest({ message: 'sedeId, fecha y turnoNumero son requeridos' })
      }

      const raw = request.only([...CAMPOS_CHECKLIST])
      const updates = Object.fromEntries(
        Object.entries(raw).filter(([, v]) => v !== undefined)
      )

      let checklist = await TramiteChecklist.query()
        .where('sede_id', sedeId)
        .where('fecha', fecha)
        .where('turno_numero', turnoNumero)
        .first()

      if (!checklist) {
        checklist = await TramiteChecklist.create({
          sedeId,
          fecha: DateTime.fromISO(fecha),
          turnoNumero,
          ...updates,
        })
      } else {
        checklist.merge(updates)
        await checklist.save()
      }

      return response.ok(checklist)
    } catch (error) {
      console.error('Error en upsert checklist:', error)
      return response.internalServerError({ message: 'Error al guardar el checklist' })
    }
  }
}
