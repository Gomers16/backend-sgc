import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Convenio from '#models/convenio'
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
  @column()
  declare placa: string | null

  @column()
  declare telefono: string | null

  @column()
  declare nombre: string | null

  // 📝 Observaciones
  @column()
  declare observaciones: string | null

  // 🧾 Estado documentos
  @column({ columnName: 'soat_vigente' })
  declare soatVigente: boolean | null

  @column.date({
    columnName: 'soat_vencimiento',
    serialize: (value?: DateTime | null) => (value ? value.toISODate() : null),
  })
  declare soatVencimiento: DateTime | null

  @column({ columnName: 'tecno_vigente' })
  declare tecnoVigente: boolean | null

  @column.date({
    columnName: 'tecno_vencimiento',
    serialize: (value?: DateTime | null) => (value ? value.toISODate() : null),
  })
  declare tecnoVencimiento: DateTime | null

  // 🔎 Trazabilidad mínima
  @column()
  declare origen: ProspectoOrigen

  @column({ columnName: 'creado_por' })
  declare creadoPor: number | null

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
    const hoy = DateTime.now().startOf('day')
    const fin = this.soatVencimiento.startOf('day')
    return Math.floor(fin.diff(hoy, 'days').days)
  }

  @computed()
  public get diasTecnoRestantes(): number | null {
    if (!this.tecnoVencimiento) return null
    const hoy = DateTime.now().startOf('day')
    const fin = this.tecnoVencimiento.startOf('day')
    return Math.floor(fin.diff(hoy, 'days').days)
  }
}
