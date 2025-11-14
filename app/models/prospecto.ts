import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Convenio from '#models/convenio'
import Usuario from '#models/usuario' // ⬅️ si tu “asesor creador” es otro modelo, cámbialo aquí
import AsesorProspectoAsignacion from '#models/asesor_prospecto_asignacion'
import CaptacionDateo from '#models/captacion_dateo'

export type ProspectoOrigen = 'IMPORT' | 'CAMPO' | 'EVENTO' | 'OTRO'

export default class Prospecto extends BaseModel {
  public static table = 'prospectos'

  @column({ isPrimary: true })
  declare id: number

  // 🔗 Convenio propietario (opcional)
  @column({ columnName: 'convenio_id' })
  declare convenioId: number | null

  @belongsTo(() => Convenio, { foreignKey: 'convenioId' })
  declare convenio: BelongsTo<typeof Convenio>

  // 📇 Datos base
  @column() declare placa: string | null
  @column() declare telefono: string | null
  @column() declare nombre: string | null

  // 📝 Observaciones
  @column() declare observaciones: string | null

  // 🧾 Estado documentos principales
  @column({ columnName: 'soat_vigente' })
  declare soatVigente: boolean | null

  @column.date({ columnName: 'soat_vencimiento', serialize: (v) => v?.toISODate() ?? null })
  declare soatVencimiento: DateTime | null

  @column({ columnName: 'tecno_vigente' })
  declare tecnoVigente: boolean | null

  @column.date({ columnName: 'tecno_vencimiento', serialize: (v) => v?.toISODate() ?? null })
  declare tecnoVencimiento: DateTime | null

  // 🧪 Servicios adicionales
  @column({ columnName: 'preventiva_vigente' })
  declare preventivaVigente: boolean | null

  @column.date({ columnName: 'preventiva_vencimiento', serialize: (v) => v?.toISODate() ?? null })
  declare preventivaVencimiento: DateTime | null

  @column.date({ columnName: 'peritaje_ultima_fecha', serialize: (v) => v?.toISODate() ?? null })
  declare peritajeUltimaFecha: DateTime | null

  // 🔎 Trazabilidad mínima
  @column() declare origen: ProspectoOrigen

  @column({ columnName: 'creado_por' })
  declare creadoPor: number | null

  // 👤 Creador (Usuario/Asesor que lo creó)
  @belongsTo(() => Usuario, { foreignKey: 'creadoPor' })
  declare creador: BelongsTo<typeof Usuario>

  // 📦 Archivado (cuando ya se convirtió en dateo y no debe salir en la tabla)
  @column()
  declare archivado: boolean

  // ⏱️ Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // 🤝 Relaciones
  @hasMany(() => AsesorProspectoAsignacion, { foreignKey: 'prospectoId' })
  declare asignaciones: HasMany<typeof AsesorProspectoAsignacion>

  @hasMany(() => CaptacionDateo, { foreignKey: 'prospectoId' })
  declare dateos: HasMany<typeof CaptacionDateo>

  // 🧮 Computados: días restantes (negativo si vencido)
  @computed()
  public get diasSoatRestantes(): number | null {
    if (!this.soatVencimiento) return null
    return Math.floor(this.soatVencimiento.startOf('day').diffNow('days').days)
  }

  @computed()
  public get diasTecnoRestantes(): number | null {
    if (!this.tecnoVencimiento) return null
    return Math.floor(this.tecnoVencimiento.startOf('day').diffNow('days').days)
  }

  @computed()
  public get diasPreventivaRestantes(): number | null {
    if (!this.preventivaVencimiento) return null
    return Math.floor(this.preventivaVencimiento.startOf('day').diffNow('days').days)
  }
}
