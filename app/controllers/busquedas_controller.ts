// app/Controllers/Http/busquedas_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Vehiculo from '#models/vehiculo'
import Cliente from '#models/cliente'
import CaptacionDateo from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'

function normalizePlaca(v?: string) {
  return v ? v.replace(/[\s-]/g, '').toUpperCase() : v
}
function normalizePhone(v?: string) {
  return v ? v.replace(/\D/g, '') : v
}

function ttlSinConsumir(): number {
  return Number(process.env.TTL_SIN_CONSUMIR_DIAS ?? 7)
}
function ttlPostConsumo(): number {
  return Number(process.env.TTL_POST_CONSUMO_DIAS ?? 365)
}

function buildReserva(d: CaptacionDateo) {
  const now = new Date()
  let vigente = false
  let bloqueaHasta: Date | null = null

  if (d.consumidoTurnoId && d.consumidoAt) {
    const hasta = new Date(d.consumidoAt.toJSDate().getTime())
    hasta.setDate(hasta.getDate() + ttlPostConsumo())
    vigente = now < hasta
    bloqueaHasta = hasta
  } else {
    const created = d.createdAt?.toJSDate()
    if (created) {
      const hasta = new Date(created.getTime())
      hasta.setDate(hasta.getDate() + ttlSinConsumir())
      vigente = now < hasta
      bloqueaHasta = hasta
    }
  }

  return {
    vigente,
    bloqueaHasta: bloqueaHasta ? bloqueaHasta.toISOString() : null,
  }
}

export default class BusquedasController {
  /**
   * GET /api/buscar?placa=ABC123  |  /api/buscar?telefono=3XXXXXXXXX
   * Devuelve: { vehiculo?, cliente?, dateoReciente?, reserva?, captacionSugerida, origenBusqueda }
   */
  public async unificada({ request, response }: HttpContext) {
    const placaRaw = request.input('placa')
    const telRaw = request.input('telefono')

    const placa = normalizePlaca(placaRaw)
    const telefono = normalizePhone(telRaw)

    if (!placa && !telefono) {
      return response.badRequest({ message: 'Debe enviar placa o telefono' })
    }

    // 1) Principal (vehículo / cliente)
    let vehiculo = null as Awaited<ReturnType<typeof Vehiculo.query>>[number] | null
    let cliente = null as Awaited<ReturnType<typeof Cliente.query>>[number] | null

    if (placa) {
      vehiculo = await Vehiculo.query()
        .where('placa', placa)
        .preload('clase')
        .preload('cliente')
        .first()
      if (vehiculo?.clienteId) cliente = vehiculo.$preloaded?.cliente ?? null
    } else if (telefono) {
      cliente = await Cliente.query()
        .where('telefono', telefono)
        .preload('vehiculos', (q) => q.preload('clase'))
        .first()
    }

    // 2) Último dateo por placa/teléfono
    const dateo = await CaptacionDateo.query()
      .where((qb) => {
        if (placa) qb.where('placa', placa)
        if (telefono) qb.orWhere('telefono', telefono!)
      })
      .preload('agente')
      .orderBy('created_at', 'desc')
      .first()

    // 3) Reserva + captación sugerida inicial
    let reserva: { vigente: boolean; bloqueaHasta: string | null } | null = null
    let captacionSugerida: {
      canal: 'FACHADA' | 'ASESOR' | 'TELE' | 'REDES'
      agente: { id: number; nombre: string; tipo: string } | null
    } | null = { canal: 'FACHADA', agente: null }

    if (dateo) {
      const r = buildReserva(dateo)
      reserva = r
      if (r.vigente) {
        captacionSugerida = {
          canal: dateo.canal as any,
          agente: dateo.agente
            ? { id: dateo.agente.id, nombre: dateo.agente.nombre, tipo: dateo.agente.tipo }
            : null,
        }
      }
    }

    // 3.bis) Fallback por TELÉFONO (si NO hay dateo vigente): buscar agente por teléfono (según tu migración)
    if ((!dateo || (reserva && !reserva.vigente)) && telefono) {
      const telValido = /^\d{10}$/.test(telefono) // CO: 10 dígitos exactos
      if (telValido) {
        try {
          const agente = await AgenteCaptacion.query()
            .where('activo', true)
            .andWhere('telefono', telefono) // solo columna real
            .first()

          if (agente) {
            // Tipos de tu enum: ASESOR_INTERNO, ASESOR_EXTERNO, TELEMERCADEO
            let canal: 'ASESOR' | 'TELE' | 'REDES' = 'ASESOR'
            if (agente.tipo === 'TELEMERCADEO') canal = 'TELE'
            // (si manejas 'REDES' en otra parte, mapea aquí; tu enum actual no la trae)

            captacionSugerida = {
              canal,
              agente: { id: agente.id, nombre: agente.nombre, tipo: agente.tipo },
            }
          }
        } catch (e) {
          console.error('Lookup de agente por teléfono falló:', e)
        }
      }
    }

    // 4) Respuesta
    return {
      vehiculo: vehiculo
        ? {
            id: vehiculo.id,
            placa: vehiculo.placa,
            clase: vehiculo.$preloaded?.clase
              ? {
                  id: vehiculo.$preloaded.clase.id,
                  codigo: (vehiculo.$preloaded.clase as any).codigo,
                  nombre: (vehiculo.$preloaded.clase as any).nombre,
                }
              : null,
            marca: vehiculo.marca,
            linea: vehiculo.linea,
            modelo: vehiculo.modelo,
          }
        : null,
      cliente: cliente
        ? {
            id: cliente.id,
            nombre: (cliente as any).nombre,
            doc_tipo: (cliente as any).docTipo ?? (cliente as any)['doc_tipo'],
            doc_numero: (cliente as any).docNumero ?? (cliente as any)['doc_numero'],
            telefono: (cliente as any).telefono,
            email: (cliente as any).email,
            vehiculos:
              'vehiculos' in cliente
                ? (cliente as any).vehiculos.map((v: any) => ({
                    id: v.id,
                    placa: v.placa,
                    clase: v.clase
                      ? { id: v.clase.id, codigo: v.clase.codigo, nombre: v.clase.nombre }
                      : null,
                    marca: v.marca,
                    linea: v.linea,
                    modelo: v.modelo,
                  }))
                : undefined,
          }
        : null,
      dateoReciente: dateo
        ? {
            id: dateo.id,
            canal: dateo.canal,
            agente: dateo.agente
              ? { id: dateo.agente.id, nombre: dateo.agente.nombre, tipo: dateo.agente.tipo }
              : null,
            placa: dateo.placa,
            telefono: dateo.telefono,
            origen: dateo.origen,
            observacion: dateo.observacion,
            imagen_url: dateo.imagenUrl,
            created_at: dateo.createdAt.toISO(),
            consumido_turno_id: dateo.consumidoTurnoId,
            consumido_at: dateo.consumidoAt ? dateo.consumidoAt.toISO() : null,
          }
        : null,
      reserva,
      captacionSugerida,
      origenBusqueda: placa ? 'placa' : 'telefono',
    }
  }
}
