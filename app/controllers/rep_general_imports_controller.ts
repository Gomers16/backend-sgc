import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import fs from 'node:fs'
import { DateTime } from 'luxon'
import ExcelJS from 'exceljs'

import Cliente from '#models/cliente'
import Vehiculo from '#models/vehiculo'
import Conductor from '#models/conductor'
import TurnoRtm from '#models/turno_rtm'

type TipoVehiculoDB = 'Liviano Particular' | 'Liviano Taxi' | 'Liviano Público' | 'Motocicleta'

/**
 * Controlador para importar archivos:
 * - RepGeneral (CSV): Solo empalma turnos existentes
 * - TECNOBASE (Excel): Crea turnos históricos nuevos
 *
 * 🔥 DETECCIÓN AUTOMÁTICA:
 * - Si es .csv → RepGeneral (empalme)
 * - Si es .xlsx Y se llama "TECNOBASE" → TECNOBASE (crear turnos)
 * - Si es .xlsx Y tiene pocas filas → RepGeneral (empalme)
 */
export default class RepGeneralImportController {
  // ==================== ÍNDICES DE COLUMNAS ====================

  // Vehículo
  private IDX_PLACA = 10 // Columna K
  private IDX_MARCA = 12 // Columna M
  private IDX_LINEA = 13 // Columna N
  private IDX_MODELO = 14 // Columna O
  private IDX_COLOR = 20 // Columna U
  private IDX_MATRICULA = 16 // Columna Q

  // Propietario (dueño)
  private IDX_DUENO_DOC_TIPO = 32 // Columna AG
  private IDX_DUENO_DOC_NUM = 33 // Columna AH
  private IDX_DUENO_NOMBRE = 34 // Columna AI
  private IDX_DUENO_TELEFONO = 38 // Columna AM
  private IDX_DUENO_EMAIL = 39 // Columna AN

  // Conductor
  private IDX_COND_DOC_TIPO = 40 // Columna AO
  private IDX_COND_DOC_NUM = 41 // Columna AP
  private IDX_COND_NOMBRE = 42 // Columna AQ
  private IDX_COND_TELEFONO = 46 // Columna AU

  // 🆕 TECNOBASE: Fecha y Servicio
  private IDX_FECHA = 2 // Columna C
  private IDX_TIPO_SERVICIO = 9 // Columna J

  // ==================== MÉTODO PRINCIPAL ====================

  public async import({ request, response }: HttpContext) {
    try {
      const file = request.file('file', {
        size: '50mb',
        extnames: ['csv', 'xlsx'],
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

      logger.info(
        {
          fileName: file.clientName,
          fileExt: file.extname,
          fileSize: file.size,
        },
        '🚀 Iniciando importación'
      )

      let rows: string[][] = []

      // 📊 Parsear archivo según extensión
      if (file.extname === 'xlsx') {
        logger.info('📊 Parseando archivo Excel...')
        rows = await this.parseExcelToArrays(file.tmpPath)
      } else {
        logger.info('📄 Parseando archivo CSV...')
        const raw = fs.readFileSync(file.tmpPath, 'utf-8')
        rows = this.parseCsvToArrays(raw)
      }

      if (!rows.length) {
        return response.badRequest({
          ok: false,
          message: 'El archivo no contiene datos (0 filas).',
        })
      }

      // 🔥 DETECCIÓN AUTOMÁTICA: ¿Es TECNOBASE o RepGeneral?
      const esTECNOBASE = this.detectarTipoArchivo(
        file.clientName ?? null,
        file.extname ?? '',
        rows.length
      )

      logger.info(
        {
          totalFilas: rows.length,
          tipoArchivo: esTECNOBASE ? 'TECNOBASE (crear turnos)' : 'RepGeneral (empalme)',
        },
        '✅ Archivo parseado correctamente'
      )

      // 📈 Contadores
      let clientesCreados = 0
      let clientesActualizados = 0
      let vehiculosCreados = 0
      let vehiculosActualizados = 0
      let conductoresCreados = 0
      let conductoresActualizados = 0
      let turnosActualizados = 0
      let turnosCreados = 0
      let errores = 0

      // 🔄 Procesar cada fila
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        // Log de progreso cada 1000 registros
        if (i > 0 && i % 1000 === 0) {
          logger.info({ progreso: `${i}/${rows.length}` }, '⏳ Procesando...')
        }

        try {
          // 1️⃣ Cliente (dueño)
          const { cliente, creado: cliCreado } = await this.upsertClienteDesdeFila(row)
          if (cliCreado) clientesCreados++
          else if (cliente) clientesActualizados++

          // 2️⃣ Vehículo
          const { vehiculo, creado: vehCreado } = await this.upsertVehiculoDesdeFila(
            row,
            cliente ?? null
          )
          if (vehCreado) vehiculosCreados++
          else if (vehiculo) vehiculosActualizados++

          // 3️⃣ Conductor
          let { conductor, creado: condCreado } = await this.upsertConductorDesdeFila(row)

          // FALLBACK: Si no hay conductor en el archivo, usar datos del cliente
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
                telefono: cliente.telefono || '0000000000', // 👈 Valor por defecto si es NULL
              } as any)
              condCreado = true
            }
          }

          if (condCreado) conductoresCreados++
          else if (conductor) conductoresActualizados++

          // 4️⃣ LÓGICA AUTOMÁTICA: TECNOBASE vs RepGeneral
          if (esTECNOBASE) {
            // 🆕 Modo TECNOBASE: Crear turnos históricos
            const resultTurno = await this.crearTurnoHistorico(
              row,
              cliente ?? null,
              vehiculo ?? null,
              conductor ?? null
            )
            turnosCreados += resultTurno.creados
            turnosActualizados += resultTurno.actualizados
          } else {
            // ✅ Modo RepGeneral: Solo empalmar turnos existentes
            const turnosEmpalmados = await this.empalmarTurnosDesdeFila(
              row,
              cliente ?? null,
              vehiculo ?? null,
              conductor ?? null
            )
            turnosActualizados += turnosEmpalmados
          }
        } catch (filaError) {
          errores++
          logger.warn(
            { filaError, fila: i + 1 },
            'Error procesando una fila (se continúa con las demás)'
          )
        }
      }

      const mensaje = esTECNOBASE
        ? 'Importación TECNOBASE (turnos históricos) finalizada.'
        : 'Importación RepGeneral (empalme) finalizada.'

      logger.info(
        {
          clientesCreados,
          vehiculosCreados,
          conductoresCreados,
          turnosCreados,
          turnosActualizados,
          errores,
        },
        '🎉 Importación finalizada'
      )

      return response.ok({
        ok: true,
        message: mensaje,
        resumen: {
          clientesCreados,
          clientesActualizados,
          vehiculosCreados,
          vehiculosActualizados,
          conductoresCreados,
          conductoresActualizados,
          turnosCreados,
          turnosActualizados,
          errores,
        },
      })
    } catch (error) {
      logger.error(error, 'Error importando archivo')

      return response.status(500).send({
        ok: false,
        message: 'Ocurrió un error al procesar el archivo.',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  // ==================== MÉTODOS DE DETECCIÓN ====================

  /**
   * 🔥 Detectar automáticamente si es TECNOBASE o RepGeneral
   */
  private detectarTipoArchivo(
    nombreArchivo: string | null,
    extension: string | null,
    totalFilas: number
  ): boolean {
    // 1️⃣ Si el nombre contiene "TECNOBASE" → Es TECNOBASE
    if (nombreArchivo?.toUpperCase().includes('TECNOBASE')) {
      logger.info('✅ Detectado por nombre: TECNOBASE')
      return true
    }

    // 2️⃣ Si es Excel Y tiene más de 1000 filas → Es TECNOBASE
    if (extension === 'xlsx' && totalFilas > 1000) {
      logger.info('✅ Detectado por extensión y tamaño: TECNOBASE')
      return true
    }

    // 3️⃣ En cualquier otro caso → Es RepGeneral
    logger.info('✅ Detectado como RepGeneral (empalme)')
    return false
  }

  /**
   * 🔍 Detectar servicio_id desde la columna J (TECNOBASE)
   */
  private detectarServicioId(row: string[]): {
    servicioId: number | null
    observacion: string | null
  } {
    const tipoServicio = this.normText(row[this.IDX_TIPO_SERVICIO])?.toUpperCase() || ''

    // 🔍 Buscar si tiene texto entre paréntesis (ej: "ORDINARIO ( AUDITORIA )")
    const match = tipoServicio.match(/\(\s*([^)]+)\s*\)/)
    const textoParentesis = match ? match[1].trim() : null

    // 🔥 PREVENTIVA → servicio_id: 2
    if (tipoServicio.includes('PREVENTIVA') || tipoServicio.includes('PREVENTIVO')) {
      return { servicioId: 2, observacion: textoParentesis ? `(${textoParentesis})` : null }
    }

    // 🔥 ORDINARIO, AUDITORIA, TAXI, PÚBLICO, etc. → servicio_id: 1 (RTM)
    if (
      tipoServicio.includes('ORDINARIO') ||
      tipoServicio.includes('TAXI') ||
      tipoServicio.includes('PUBLICO') ||
      tipoServicio.includes('APRENDIZAJE') ||
      tipoServicio.includes('LEY 769')
    ) {
      return { servicioId: 1, observacion: textoParentesis ? `(${textoParentesis})` : null }
    }

    // 🔥 Si no reconocemos el servicio → Guardar el texto completo en observaciones
    logger.warn({ tipoServicio }, '⚠️ Tipo de servicio no reconocido')
    return { servicioId: 1, observacion: `(${tipoServicio})` }
  }

  /**
   * 🔥 Detectar tipo de vehículo desde la columna J (TECNOBASE)
   */
  private detectarTipoVehiculo(row: string[]): TipoVehiculoDB {
    const tipoServicio = this.normText(row[this.IDX_TIPO_SERVICIO])?.toUpperCase() || ''

    // MOTO → Motocicleta
    if (tipoServicio.includes('MOTO')) {
      return 'Motocicleta'
    }

    // TAXI → Liviano Taxi
    if (tipoServicio.includes('TAXIMETRO') || tipoServicio.includes('TAXI')) {
      return 'Liviano Taxi'
    }

    // PÚBLICO → Liviano Público
    if (tipoServicio.includes('PUBLICO') || tipoServicio.includes('SERVICIO PUBLICO')) {
      return 'Liviano Público'
    }

    // TODO LO DEMÁS → Liviano Particular (por defecto)
    return 'Liviano Particular'
  }

  // ==================== MÉTODOS DE PARSEO ====================

  /**
   * Parsear Excel a arrays de strings
   */
  private async parseExcelToArrays(filePath: string): Promise<string[][]> {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(filePath)

    const worksheet = workbook.worksheets[0]
    const rows: string[][] = []

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return // Saltar encabezados

      const values: string[] = []
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        // Si es una fecha de Excel, convertirla a formato legible
        if (cell.type === ExcelJS.ValueType.Date && cell.value instanceof Date) {
          const dt = DateTime.fromJSDate(cell.value, { zone: 'America/Bogota' })
          values[colNumber - 1] = dt.toFormat('dd/MM/yyyy HH:mm:ss')
        } else {
          values[colNumber - 1] = cell.value ? String(cell.value) : ''
        }
      })
      rows.push(values)
    })

    return rows
  }

  /**
   * Parsear CSV a arrays de strings
   */
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

  /**
   * 🆕 Parsear fecha desde múltiples formatos
   */
  private parsearFecha(valor: string): DateTime | null {
    if (!valor) return null

    // Intentar diferentes formatos
    let fecha = DateTime.fromFormat(valor, 'dd/MM/yyyy HH:mm:ss', { zone: 'America/Bogota' })
    if (fecha.isValid) return fecha

    fecha = DateTime.fromFormat(valor, 'dd/MM/yyyy', { zone: 'America/Bogota' })
    if (fecha.isValid) return fecha

    fecha = DateTime.fromFormat(valor, 'yyyy-MM-dd HH:mm:ss', { zone: 'America/Bogota' })
    if (fecha.isValid) return fecha

    fecha = DateTime.fromFormat(valor, 'yyyy-MM-dd', { zone: 'America/Bogota' })
    if (fecha.isValid) return fecha

    fecha = DateTime.fromISO(valor, { zone: 'America/Bogota' })
    if (fecha.isValid) return fecha

    return null
  }

  // ==================== MÉTODOS DE NORMALIZACIÓN ====================

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

  private truncateText(value: string | null, maxLength: number): string | null {
    if (!value) return null
    return value.length > maxLength ? value.substring(0, maxLength) : value
  }

  // ==================== MÉTODOS DE UPSERT ====================

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
        telefono: telefono || '0000000000', // 👈 Valor por defecto si es NULL
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
    const color = this.truncateText(this.normText(row[this.IDX_COLOR]), 50) // 👈 Truncar a 50 chars
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

    const docTipo = this.normText(docTipoRaw)
    const docNumero = this.normText(docRaw)
    const nombre = this.normText(nombreRaw)
    const telefono = this.normalizeTelefono(telRaw)

    if (!docNumero && !nombre && !telefono) {
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
        telefono: telefono || '0000000000', // 👈 Valor por defecto si es NULL
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

  // ==================== MÉTODOS DE TURNOS ====================

  /**
   * 🆕 CREAR TURNO HISTÓRICO (modo TECNOBASE)
   */
  private async crearTurnoHistorico(
    row: string[],
    cliente: Cliente | null,
    vehiculo: Vehiculo | null,
    conductor: Conductor | null
  ): Promise<{ creados: number; actualizados: number }> {
    if (!vehiculo) {
      return { creados: 0, actualizados: 0 }
    }

    const placa = vehiculo.placa
    if (!placa) {
      return { creados: 0, actualizados: 0 }
    }

    // 📅 Extraer fecha de columna C
    const fechaRaw = this.normText(row[this.IDX_FECHA])
    const fecha = fechaRaw ? this.parsearFecha(fechaRaw) : null

    if (!fecha || !fecha.isValid) {
      logger.warn({ placa, fechaRaw }, '⚠️ Fecha inválida, omitiendo fila')
      return { creados: 0, actualizados: 0 }
    }

    const fechaISO = fecha.toISODate()
    if (!fechaISO) {
      return { creados: 0, actualizados: 0 }
    }

    // 🔍 Detectar servicio desde columna J
    const { servicioId, observacion } = this.detectarServicioId(row)

    // 🔍 Detectar tipo de vehículo desde columna J
    const tipoVehiculo = this.detectarTipoVehiculo(row)

    // 🔎 Buscar si ya existe un turno con esa placa y fecha
    const turnoExistente = await TurnoRtm.query()
      .where('placa', placa)
      .where('fecha', fechaISO)
      .first()

    const clienteIdParaEmpalme = cliente?.id ?? vehiculo.clienteId ?? null
    const claseVehiculoIdParaEmpalme = (vehiculo as any).claseVehiculoId ?? 1
    const conductorIdParaEmpalme = conductor?.id ?? null

    if (turnoExistente) {
      // ✏️ Actualizar turno existente
      let changed = false

      if (!turnoExistente.vehiculoId && vehiculo.id) {
        turnoExistente.vehiculoId = vehiculo.id
        changed = true
      }

      if (!turnoExistente.clienteId && clienteIdParaEmpalme) {
        turnoExistente.clienteId = clienteIdParaEmpalme
        changed = true
      }

      if (!turnoExistente.conductorId && conductorIdParaEmpalme) {
        turnoExistente.conductorId = conductorIdParaEmpalme
        changed = true
      }

      if (!turnoExistente.claseVehiculoId && claseVehiculoIdParaEmpalme) {
        ;(turnoExistente as any).claseVehiculoId = claseVehiculoIdParaEmpalme
        changed = true
      }

      if (!turnoExistente.servicioId && servicioId) {
        turnoExistente.servicioId = servicioId
        changed = true
      }

      if (changed) {
        await turnoExistente.save()
        return { creados: 0, actualizados: 1 }
      }

      return { creados: 0, actualizados: 0 }
    }

    // 🔢 Calcular turno_numero (consecutivo por sede y fecha)
    const maxTurnoNumero = await TurnoRtm.query()
      .where('sede_id', 1)
      .where('fecha', fechaISO)
      .max('turno_numero as max')
      .pojo<{ max: number }>()
      .first()

    const turnoNumero = (maxTurnoNumero?.max ?? 0) + 1

    // 🔢 Calcular turno_numero_servicio (consecutivo por sede, fecha y servicio)
    const maxTurnoServicio = await TurnoRtm.query()
      .where('sede_id', 1)
      .where('fecha', fechaISO)
      .where('servicio_id', servicioId ?? 1)
      .max('turno_numero_servicio as max')
      .pojo<{ max: number }>()
      .first()

    const turnoNumeroServicio = (maxTurnoServicio?.max ?? 0) + 1

    // 🔤 Generar turno_codigo (formato: YYYYMMDD-SEDE-NUMERO)
    const fechaPart = fecha.toFormat('yyyyMMdd')
    const turnoCodigo = `${fechaPart}-1-${turnoNumero}`

    // ✨ Crear nuevo turno histórico
    const observacionesFinal = ['Importado desde TECNOBASE', observacion].filter(Boolean).join(' ')

    await TurnoRtm.create({
      fecha: fechaISO,
      horaIngreso: '08:00:00',
      horaSalida: '09:00:00',
      turnoNumero: turnoNumero,
      turnoNumeroServicio: turnoNumeroServicio,
      turnoCodigo: turnoCodigo,
      placa,
      tipoVehiculo: tipoVehiculo,
      estado: 'finalizado',
      vehiculoId: vehiculo.id,
      clienteId: clienteIdParaEmpalme,
      conductorId: conductorIdParaEmpalme,
      claseVehiculoId: claseVehiculoIdParaEmpalme,
      funcionarioId: 1, // Usuario por defecto
      sedeId: 1, // Sede por defecto
      servicioId: servicioId,
      observaciones: observacionesFinal,
      canalAtribucion: 'FACHADA',
    } as any)

    return { creados: 1, actualizados: 0 }
  }

  /**
   * ✅ EMPALMAR TURNOS (modo RepGeneral)
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

    const turnos = await TurnoRtm.query()
      .where('placa', placa)
      .whereIn('estado', ['activo', 'finalizado'])

    if (!turnos.length) {
      return 0
    }

    const clienteIdParaEmpalme = cliente?.id ?? vehiculo.clienteId ?? null
    const claseVehiculoIdParaEmpalme = (vehiculo as any).claseVehiculoId ?? null
    const conductorIdParaEmpalme = conductor?.id ?? null

    let turnosActualizados = 0

    for (const t of turnos) {
      let changed = false

      if (!t.vehiculoId && vehiculo.id) {
        t.vehiculoId = vehiculo.id
        changed = true
      }

      if (!t.clienteId && clienteIdParaEmpalme) {
        t.clienteId = clienteIdParaEmpalme
        changed = true
      }

      if (!t.claseVehiculoId && claseVehiculoIdParaEmpalme) {
        ;(t as any).claseVehiculoId = claseVehiculoIdParaEmpalme
        changed = true
      }

      if (!t.conductorId && conductorIdParaEmpalme) {
        t.conductorId = conductorIdParaEmpalme
        changed = true
      }

      if (changed) {
        await t.save()
        turnosActualizados++
      }
    }

    return turnosActualizados
  }
}
