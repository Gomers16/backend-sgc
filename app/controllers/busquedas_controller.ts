// app/Controllers/Http/busquedas_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Vehiculo from '#models/vehiculo'
import Cliente from '#models/cliente'
import CaptacionDateo from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'
import Prospecto from '#models/prospecto'
import Convenio from '#models/convenio'
import AsesorConvenioAsignacion from '#models/asesor_convenio_asignacion'

type Canal = 'FACHADA' | 'ASESOR' | 'TELE' | 'REDES'

// Tipos de instancia (para evitar '{}' y problemas con 'in')
type VehiculoInstance = InstanceType<typeof Vehiculo>
type ClienteInstance = InstanceType<typeof Cliente>
type CaptacionDateoInstance = InstanceType<typeof CaptacionDateo>
type AgenteInstance = InstanceType<typeof AgenteCaptacion>

function normalizePlaca(v?: string | null) {
  return v ? v.replace(/[\s-]/g, '').toUpperCase() : null
}
function normalizePhone(v?: string | null) {
  return v ? v.replace(/\D/g, '') : null
}

function ttlSinConsumir(): number {
  return Number(process.env.TTL_SIN_CONSUMIR_DIAS ?? 7)
}
function ttlPostConsumo(): number {
  return Number(process.env.TTL_POST_CONSUMO_DIAS ?? 365)
}

function buildReserva(d: CaptacionDateoInstance) {
  const now = new Date()
  let vigente = false
  let bloqueaHasta: Date | null = null

  if (d.consumidoTurnoId && d.consumidoAt) {
    const hasta = new Date(d.consumidoAt.toJSDate().getTime())
    hasta.setDate(hasta.getDate() + ttlPostConsumo())
    vigente = now < hasta
    bloqueaHasta = hasta
  } else if (d.createdAt) {
    const created = d.createdAt.toJSDate()
    const hasta = new Date(created.getTime())
    hasta.setDate(hasta.getDate() + ttlSinConsumir())
    vigente = now < hasta
    bloqueaHasta = hasta
  }

  return {
    vigente,
    bloqueaHasta: bloqueaHasta ? bloqueaHasta.toISOString() : null,
  }
}

/** Asesor activo asignado a un convenio (si existe) */
async function getAsesorActivoDeConvenio(convenioId: number) {
  const asignacion = await AsesorConvenioAsignacion.query()
    .where('convenio_id', convenioId)
    .where('activo', true)
    .whereNull('fecha_fin')
    .orderBy('fecha_asignacion', 'desc')
    .first()

  if (!asignacion) return null
  const asesor = await AgenteCaptacion.find(asignacion.asesorId)
  if (!asesor) return null
  return { asignacion, asesor }
}

/** Serializa vehículo de forma segura para TS */
function serializeVehiculo(vehiculo: VehiculoInstance | null) {
  if (!vehiculo) return null
  const clase = (vehiculo as any).$preloaded?.clase
    ? {
        id: (vehiculo as any).$preloaded.clase.id,
        codigo: (vehiculo as any).$preloaded.clase.codigo,
        nombre: (vehiculo as any).$preloaded.clase.nombre,
      }
    : null

  return {
    id: vehiculo.id,
    placa: vehiculo.placa,
    clase,
    marca: vehiculo.marca,
    linea: vehiculo.linea,
    modelo: vehiculo.modelo,
  }
}

/** Serializa cliente de forma segura para TS */
function serializeCliente(cliente: ClienteInstance | null) {
  if (!cliente) return null

  const cliAny = cliente as any
  const vehiculosArr = Array.isArray(cliAny.vehiculos)
    ? cliAny.vehiculos.map((v: any) => ({
        id: v.id,
        placa: v.placa,
        clase: v.clase ? { id: v.clase.id, codigo: v.clase.codigo, nombre: v.clase.nombre } : null,
        marca: v.marca,
        linea: v.linea,
        modelo: v.modelo,
      }))
    : undefined

  return {
    id: cliente.id,
    nombre: cliAny.nombre,
    doc_tipo: cliAny.docTipo ?? cliAny['doc_tipo'],
    doc_numero: cliAny.docNumero ?? cliAny['doc_numero'],
    telefono: cliAny.telefono,
    email: cliAny.email,
    vehiculos: vehiculosArr,
  }
}

export default class BusquedasController {
  /**
   * GET /api/buscar?placa=ABC123 | /api/buscar?telefono=3XXXXXXXXX
   * Devuelve estructura original + extras:
   *  - fuente: 'DATEO'|'CONVENIO'|'FACHADA'
   *  - dateoId, convenio, asesorAsignado, detectadoPorConvenio
   */
  public async unificada({ request, response }: HttpContext) {
    const placa = normalizePlaca(request.input('placa'))
    const telefono = normalizePhone(request.input('telefono'))

    if (!placa && !telefono) {
      return response.badRequest({ message: 'Debe enviar placa o telefono' })
    }

    // 1) Contexto base
    let vehiculo: VehiculoInstance | null = null
    let cliente: ClienteInstance | null = null

    if (placa) {
      vehiculo = await Vehiculo.query()
        .where('placa', placa)
        .preload('clase')
        .preload('cliente')
        .first()
      if (vehiculo?.clienteId) {
        // @ts-ignore (Lucid preloaded)
        cliente = (vehiculo as any).$preloaded?.cliente ?? null
      }
    } else if (telefono) {
      cliente = await Cliente.query()
        .where('telefono', telefono)
        .preload('vehiculos', (q) => q.preload('clase'))
        .first()
    }

    // 2) Último dateo por placa/teléfono
    let dateo: CaptacionDateoInstance | null = await CaptacionDateo.query()
      .where((qb) => {
        if (placa) qb.where('placa', placa)
        if (telefono) qb.orWhere('telefono', telefono!)
      })
      .preload('agente')
      .preload('convenio')
      .preload('prospecto')
      .orderBy('created_at', 'desc')
      .first()

    let reserva: { vigente: boolean; bloqueaHasta: string | null } | null = null

    if (dateo) {
      const r = buildReserva(dateo)
      reserva = r
      if (r.vigente) {
        return response.ok({
          fuente: 'DATEO',
          dateoId: dateo.id,
          vehiculo: serializeVehiculo(vehiculo),
          cliente: serializeCliente(cliente),
          dateoReciente: {
            id: dateo.id,
            canal: dateo.canal,
            agente: (dateo as any).agente
              ? {
                  id: (dateo as any).agente.id,
                  nombre: (dateo as any).agente.nombre,
                  tipo: (dateo as any).agente.tipo,
                }
              : null,
            placa: dateo.placa,
            telefono: dateo.telefono,
            origen: dateo.origen,
            observacion: (dateo as any).observacion ?? null,
            imagen_url: (dateo as any).imagenUrl ?? null,
            created_at: dateo.createdAt ? dateo.createdAt.toISO() : null,
            consumido_turno_id: dateo.consumidoTurnoId ?? null,
            consumido_at: dateo.consumidoAt ? dateo.consumidoAt.toISO() : null,
          },
          reserva,
          captacionSugerida: {
            canal: dateo.canal as Canal,
            agente: (dateo as any).agente
              ? {
                  id: (dateo as any).agente.id,
                  nombre: (dateo as any).agente.nombre,
                  tipo: (dateo as any).agente.tipo,
                }
              : null,
          },
          convenio: (dateo as any).convenio ?? null,
          asesorAsignado: (dateo as any).agente
            ? {
                id: (dateo as any).agente.id,
                nombre: (dateo as any).agente.nombre,
                tipo: (dateo as any).agente.tipo,
              }
            : null,
          origenBusqueda: placa ? 'placa' : 'telefono',
          // Si tu modelo YA tiene la columna:
          detectadoPorConvenio: (dateo as any).detectadoPorConvenio ?? false,
        })
      }
    }

    // 3) Sin dateo vigente → Detectar por prospecto/convenio y crear dateo automático
    const prospecto = await Prospecto.query()
      .where((q) => {
        if (placa) q.orWhere('placa', placa)
        if (telefono) q.orWhere('telefono', telefono!)
      })
      .orderByRaw('convenio_id IS NULL') // prioriza los que TENGAN convenio
      .orderBy('updated_at', 'desc')
      .first()

    if (prospecto?.convenioId) {
      const convenio = await Convenio.find(prospecto.convenioId)

      // Asesor activo del convenio (si hay)
      let asesorAsignado: AgenteInstance | null = null
      const info = await getAsesorActivoDeConvenio(prospecto.convenioId)
      if (info?.asesor) asesorAsignado = info.asesor

      // Crear dateo automático.
      // NOTA: Asegúrate de tener en el MODELO:
      // @column({ columnName: 'detectado_por_convenio' }) declare detectadoPorConvenio: boolean
      dateo = await CaptacionDateo.create({
        canal: 'ASESOR',
        agenteId: asesorAsignado ? asesorAsignado.id : null,
        convenioId: convenio?.id ?? null,
        prospectoId: prospecto.id,
        vehiculoId: vehiculo?.id ?? null,
        clienteId: cliente?.id ?? null,
        placa: placa ?? null,
        telefono: telefono ?? null,
        origen: 'UI',
        observacion: 'Captación automática por base de convenio',
        // Si tu modelo aún no tiene la columna, comenta la línea de abajo temporalmente:
        detectadoPorConvenio: true as any,
        resultado: 'PENDIENTE',
      } as Partial<any>) // <- cast defensivo por si tu tipo del modelo aún no incluye la columna

      await dateo.load('agente')
      await dateo.load('convenio')

      const r = buildReserva(dateo)

      return response.ok({
        fuente: 'CONVENIO',
        dateoId: dateo.id,
        vehiculo: serializeVehiculo(vehiculo),
        cliente: serializeCliente(cliente),
        dateoReciente: {
          id: dateo.id,
          canal: dateo.canal,
          agente: (dateo as any).agente
            ? {
                id: (dateo as any).agente.id,
                nombre: (dateo as any).agente.nombre,
                tipo: (dateo as any).agente.tipo,
              }
            : null,
          placa: dateo.placa,
          telefono: dateo.telefono,
          origen: dateo.origen,
          observacion: (dateo as any).observacion ?? null,
          imagen_url: (dateo as any).imagenUrl ?? null,
          created_at: dateo.createdAt ? dateo.createdAt.toISO() : null,
          consumido_turno_id: dateo.consumidoTurnoId ?? null,
          consumido_at: dateo.consumidoAt ? dateo.consumidoAt.toISO() : null,
        },
        reserva: r,
        captacionSugerida: {
          canal: 'ASESOR',
          agente: asesorAsignado
            ? { id: asesorAsignado.id, nombre: asesorAsignado.nombre, tipo: asesorAsignado.tipo }
            : null,
        },
        convenio: (dateo as any).convenio ?? null,
        asesorAsignado: asesorAsignado
          ? { id: asesorAsignado.id, nombre: asesorAsignado.nombre, tipo: asesorAsignado.tipo }
          : null,
        origenBusqueda: placa ? 'placa' : 'telefono',
        detectadoPorConvenio: true,
      })
    }

    // 4) Sin dateo ni convenio → fallback por teléfono a un agente
    let sugerenciaPorTelefono: {
      canal: Canal
      agente: { id: number; nombre: string; tipo: string } | null
    } | null = null

    if (telefono && /^\d{10}$/.test(telefono)) {
      try {
        const agente = await AgenteCaptacion.query()
          .where('activo', true)
          .andWhere('telefono', telefono)
          .first()

        if (agente) {
          let canal: Canal = 'ASESOR'
          if ((agente as any).tipo === 'TELEMERCADEO') canal = 'TELE'
          sugerenciaPorTelefono = {
            canal,
            agente: { id: agente.id, nombre: (agente as any).nombre, tipo: (agente as any).tipo },
          }
        }
      } catch (e) {
        console.error('Lookup de agente por teléfono falló:', e)
      }
    }

    // 5) FACHADA
    return response.ok({
      fuente: 'FACHADA',
      dateoId: null,
      vehiculo: serializeVehiculo(vehiculo),
      cliente: serializeCliente(cliente),
      dateoReciente: null,
      reserva: null,
      captacionSugerida: sugerenciaPorTelefono || { canal: 'FACHADA', agente: null },
      convenio: null,
      asesorAsignado: sugerenciaPorTelefono?.agente ?? null,
      origenBusqueda: placa ? 'placa' : 'telefono',
      detectadoPorConvenio: false,
    })
  }
}
