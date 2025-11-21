import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import fs from 'node:fs'
import { DateTime } from 'luxon'

import Cliente from '#models/cliente'
import Vehiculo from '#models/vehiculo'
import Conductor from '#models/conductor'
import TurnoRtm from '#models/turno_rtm'

/**
 * Controlador para importar el archivo RepGeneral (CSV)
 * ÍNDICES 100% CONFIRMADOS CON EL USUARIO
 */
export default class RepGeneralImportController {
  // Vehículo
  private IDX_PLACA = 10
  private IDX_MARCA = 12
  private IDX_LINEA = 13
  private IDX_MODELO = 14
  private IDX_COLOR = 20
  private IDX_MATRICULA = 16

  // Propietario (dueño)
  private IDX_DUENO_DOC_TIPO = 32
  private IDX_DUENO_DOC_NUM = 33
  private IDX_DUENO_NOMBRE = 34
  private IDX_DUENO_TELEFONO = 38
  private IDX_DUENO_EMAIL = 39

  // Conductor
  private IDX_COND_DOC_TIPO = 40
  private IDX_COND_DOC_NUM = 41
  private IDX_COND_NOMBRE = 42
  private IDX_COND_TELEFONO = 46

  public async import({ request, response }: HttpContext) {
    try {
      const file = request.file('file', {
        size: '20mb',
        extnames: ['csv'],
      })

      if (!file) {
        return response.badRequest({
          ok: false,
          message: 'No se recibió ningún archivo. Envíe el archivo en el campo "file".',
        })
      }

      if (!file.isValid) {
        return response.badRequest({
          ok: false,
          message: 'El archivo enviado no es válido.',
          errors: file.errors,
        })
      }

      if (!file.tmpPath) {
        return response.status(500).send({
          ok: false,
          message: 'No se pudo acceder al archivo temporal en el servidor.',
        })
      }

      const tmpPath = file.tmpPath
      const raw = fs.readFileSync(tmpPath, 'utf-8')
      const rows = this.parseCsvToArrays(raw)

      if (!rows.length) {
        return response.badRequest({
          ok: false,
          message: 'El archivo no contiene datos (0 filas).',
        })
      }

      let clientesCreados = 0
      let clientesActualizados = 0
      let vehiculosCreados = 0
      let vehiculosActualizados = 0
      let conductoresCreados = 0
      let conductoresActualizados = 0
      let turnosActualizados = 0
      let errores = 0

      for (const row of rows) {
        try {
          // Cliente (dueño)
          const { cliente, creado: cliCreado } = await this.upsertClienteDesdeFila(row)
          if (cliCreado) clientesCreados++
          else if (cliente) clientesActualizados++

          // Vehículo
          const { vehiculo, creado: vehCreado } = await this.upsertVehiculoDesdeFila(
            row,
            cliente ?? null
          )
          if (vehCreado) vehiculosCreados++
          else if (vehiculo) vehiculosActualizados++

          // Conductor
          let { conductor, creado: condCreado } = await this.upsertConductorDesdeFila(row)

          // 🔥 FALLBACK: Si no hay conductor en el CSV, usar datos del cliente
          if (!conductor && cliente) {
            conductor = await Conductor.query()
              .where('doc_numero', cliente.docNumero ?? '')
              .orWhere('telefono', cliente.telefono ?? '')
              .first()

            if (!conductor) {
              conductor = await Conductor.create({
                nombre: cliente.nombre,
                docTipo: cliente.docTipo,
                docNumero: cliente.docNumero,
                telefono: cliente.telefono,
              } as any)
              condCreado = true
            }
          }

          if (condCreado) conductoresCreados++
          else if (conductor) conductoresActualizados++

          // 🔥 EMPALME AUTOMÁTICO: Actualiza TODOS los turnos con esa placa
          const turnosEmpalmados = await this.empalmarTurnosDesdeFila(
            row,
            cliente ?? null,
            vehiculo ?? null,
            conductor ?? null
          )
          turnosActualizados += turnosEmpalmados
        } catch (filaError) {
          errores++
          logger.warn(
            { filaError },
            'Error procesando una fila del RepGeneral (se continúa con las demás)'
          )
        }
      }

      return response.ok({
        ok: true,
        message: 'Importación de RepGeneral finalizada.',
        resumen: {
          clientesCreados,
          clientesActualizados,
          vehiculosCreados,
          vehiculosActualizados,
          conductoresCreados,
          conductoresActualizados,
          turnosActualizados,
          errores,
        },
      })
    } catch (error) {
      logger.error(error, 'Error importando RepGeneral')

      return response.status(500).send({
        ok: false,
        message: 'Ocurrió un error al procesar el archivo RepGeneral.',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private parseCsvToArrays(raw: string): string[][] {
    const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== '')
    if (!lines.length) return []

    const firstLine = lines[0]
    const semiCount = (firstLine.match(/;/g) || []).length
    const commaCount = (firstLine.match(/,/g) || []).length
    const sep = semiCount >= commaCount ? ';' : ','

    const rows: string[][] = []

    for (const line of lines) {
      if (!line.trim()) continue
      const parts = line.split(sep)
      if (parts.length && parts[0].charCodeAt(0) === 0xfeff) {
        parts[0] = parts[0].replace(/^\uFEFF/, '')
      }
      rows.push(parts)
    }

    return rows
  }

  private normalizePlaca(value: string | undefined | null): string | null {
    if (!value) return null
    return (
      value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .trim() || null
    )
  }

  private normalizeTelefono(value: string | undefined | null): string | null {
    if (!value) return null
    const digits = value.replace(/\D/g, '')
    return digits || null
  }

  private normText(value: string | undefined | null): string | null {
    if (!value) return null
    const t = value.trim()
    return t || null
  }

  private async upsertClienteDesdeFila(
    row: string[]
  ): Promise<{ cliente: Cliente | null; creado: boolean }> {
    const docTipoRaw = row[this.IDX_DUENO_DOC_TIPO]
    const docNumeroRaw = row[this.IDX_DUENO_DOC_NUM]
    const nombreRaw = row[this.IDX_DUENO_NOMBRE]
    const telRaw = row[this.IDX_DUENO_TELEFONO]
    const emailRaw = row[this.IDX_DUENO_EMAIL]

    const docTipo = this.normText(docTipoRaw)
    const docNumero = this.normText(docNumeroRaw)
    const nombre = this.normText(nombreRaw)
    const telefono = this.normalizeTelefono(telRaw)
    const email = this.normText(emailRaw)

    if (!docNumero && !nombre && !telefono && !email) {
      return { cliente: null, creado: false }
    }

    let cliente: Cliente | null = null
    let creado = false

    if (docNumero) {
      cliente = await Cliente.query().where('doc_numero', docNumero).first()
    }

    if (!cliente && telefono) {
      cliente = await Cliente.query().where('telefono', telefono).first()
    }

    if (!cliente) {
      cliente = await Cliente.create({
        docTipo: docTipo || (docNumero ? 'CC' : null),
        docNumero,
        nombre,
        telefono,
        email,
      } as any)
      creado = true
      return { cliente, creado }
    }

    let debeGuardar = false

    if (!cliente.docNumero && docNumero) {
      cliente.docNumero = docNumero
      cliente.docTipo = docTipo || 'CC'
      debeGuardar = true
    }

    if (!cliente.nombre && nombre) {
      cliente.nombre = nombre
      debeGuardar = true
    }

    if (!cliente.telefono && telefono) {
      cliente.telefono = telefono
      debeGuardar = true
    }

    if (!cliente.email && email) {
      cliente.email = email
      debeGuardar = true
    }

    if (debeGuardar) {
      await cliente.save()
    }

    return { cliente, creado: false }
  }

  private async upsertVehiculoDesdeFila(
    row: string[],
    cliente: Cliente | null
  ): Promise<{ vehiculo: Vehiculo | null; creado: boolean }> {
    const placaRaw = row[this.IDX_PLACA]
    const placa = this.normalizePlaca(placaRaw)

    if (!placa) {
      return { vehiculo: null, creado: false }
    }

    const marca = this.normText(row[this.IDX_MARCA])
    const linea = this.normText(row[this.IDX_LINEA])
    const modeloRaw = this.normText(row[this.IDX_MODELO])
    const color = this.normText(row[this.IDX_COLOR])
    const matricula = this.normText(row[this.IDX_MATRICULA])

    let modelo: number | null = null
    if (modeloRaw) {
      const n = Number(modeloRaw)
      modelo = Number.isFinite(n) ? n : null
    }

    let vehiculo = await Vehiculo.query().whereRaw('UPPER(placa) = ?', [placa]).first()
    let creado = false

    if (!vehiculo) {
      vehiculo = await Vehiculo.create({
        placa,
        marca,
        linea,
        modelo,
        color,
        matricula,
        clienteId: cliente?.id ?? null,
        claseVehiculoId: 1,
      } as any)
      creado = true
      return { vehiculo, creado }
    }

    let debeGuardar = false

    if (!vehiculo.marca && marca) {
      vehiculo.marca = marca
      debeGuardar = true
    }

    if (!vehiculo.linea && linea) {
      vehiculo.linea = linea
      debeGuardar = true
    }

    if (!vehiculo.modelo && modelo) {
      vehiculo.modelo = modelo
      debeGuardar = true
    }

    if (!vehiculo.color && color) {
      vehiculo.color = color
      debeGuardar = true
    }

    if (!vehiculo.matricula && matricula) {
      vehiculo.matricula = matricula
      debeGuardar = true
    }

    if (!vehiculo.clienteId && cliente?.id) {
      vehiculo.clienteId = cliente.id
      debeGuardar = true
    }

    if (debeGuardar) {
      await vehiculo.save()
    }

    return { vehiculo, creado: false }
  }

  private async upsertConductorDesdeFila(
    row: string[]
  ): Promise<{ conductor: Conductor | null; creado: boolean }> {
    const docTipoRaw = row[this.IDX_COND_DOC_TIPO]
    const docRaw = row[this.IDX_COND_DOC_NUM]
    const nombreRaw = row[this.IDX_COND_NOMBRE]
    const telRaw = row[this.IDX_COND_TELEFONO]

    // 🔍 DEBUG: Ver qué trae el conductor
    logger.info(
      {
        placa: row[this.IDX_PLACA],
        conductor_doc_tipo: docTipoRaw,
        conductor_doc_num: docRaw,
        conductor_nombre: nombreRaw,
        conductor_tel: telRaw,
      },
      '🔍 DEBUG: Datos del conductor en la fila'
    )

    const docTipo = this.normText(docTipoRaw)
    const docNumero = this.normText(docRaw)
    const nombre = this.normText(nombreRaw)
    const telefono = this.normalizeTelefono(telRaw)

    if (!docNumero && !nombre && !telefono) {
      logger.warn({ placa: row[this.IDX_PLACA] }, '⚠️ Fila sin datos de conductor')
      return { conductor: null, creado: false }
    }

    let conductor: Conductor | null = null
    let creado = false

    if (docNumero) {
      conductor = await Conductor.query().where('doc_numero', docNumero).first()
    }

    if (!conductor && telefono) {
      conductor = await Conductor.query().where('telefono', telefono).first()
    }

    if (!conductor) {
      conductor = await Conductor.create({
        nombre,
        docTipo: docTipo || (docNumero ? 'CC' : null),
        docNumero,
        telefono,
      } as any)
      creado = true
      return { conductor, creado }
    }

    let debeGuardar = false

    if (!conductor.docNumero && docNumero) {
      conductor.docNumero = docNumero
      conductor.docTipo = docTipo || 'CC'
      debeGuardar = true
    }

    if (!conductor.nombre && nombre) {
      conductor.nombre = nombre
      debeGuardar = true
    }

    if (!conductor.telefono && telefono) {
      conductor.telefono = telefono
      debeGuardar = true
    }

    if (debeGuardar) {
      await conductor.save()
    }

    return { conductor, creado: false }
  }

  /**
   * 🔥 MÉTODO MEJORADO: Empalma turnos SOLO por placa
   * Actualiza TODOS los turnos con esa placa, sin importar la fecha
   */
  private async empalmarTurnosDesdeFila(
    _row: string[],
    cliente: Cliente | null,
    vehiculo: Vehiculo | null,
    conductor: Conductor | null
  ): Promise<number> {
    if (!vehiculo) return 0

    const placa = vehiculo.placa
    if (!placa) return 0

    // 🔥 Buscar TODOS los turnos con esa placa (sin filtro de fecha)
    const turnos = await TurnoRtm.query()
      .where('placa', placa)
      .whereIn('estado', ['activo', 'finalizado']) // Solo turnos válidos

    if (!turnos.length) {
      logger.info({ placa }, '⚠️ No se encontraron turnos para esta placa')
      return 0
    }

    logger.info({ placa, cantidad: turnos.length }, '✅ Turnos encontrados para empalmar')

    const clienteIdParaEmpalme = cliente?.id ?? vehiculo.clienteId ?? null
    const claseVehiculoIdParaEmpalme = (vehiculo as any).claseVehiculoId ?? null
    const conductorIdParaEmpalme = conductor?.id ?? null

    let turnosActualizados = 0

    for (const t of turnos) {
      let changed = false
      const cambios: string[] = []

      // 🔥 Actualizar vehículo si está vacío
      if (!t.vehiculoId && vehiculo.id) {
        t.vehiculoId = vehiculo.id
        changed = true
        cambios.push('vehiculo')
      }

      // 🔥 Actualizar cliente si está vacío
      if (!t.clienteId && clienteIdParaEmpalme) {
        t.clienteId = clienteIdParaEmpalme
        changed = true
        cambios.push('cliente')
      }

      // 🔥 Actualizar clase de vehículo si está vacía
      if (!t.claseVehiculoId && claseVehiculoIdParaEmpalme) {
        ;(t as any).claseVehiculoId = claseVehiculoIdParaEmpalme
        changed = true
        cambios.push('clase_vehiculo')
      }

      // 🔥 Actualizar conductor si está vacío
      if (!t.conductorId && conductorIdParaEmpalme) {
        t.conductorId = conductorIdParaEmpalme
        changed = true
        cambios.push('conductor')
      }

      if (changed) {
        await t.save()
        turnosActualizados++
        logger.info(
          {
            turnoId: t.id,
            placa: t.placa,
            cambios: cambios.join(', '),
            conductorId: t.conductorId,
          },
          '✅ Turno actualizado'
        )
      }
    }

    return turnosActualizados
  }
}
