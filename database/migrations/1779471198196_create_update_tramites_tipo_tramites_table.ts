// database/migrations/XXXX_update_tramites_tipo_tramite.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateTramitesTipoTramite extends BaseSchema {
  protected tableName = 'tramites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('tipo_tramite')
    })
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enu('tipo_tramite', [
          'MATRICULA_REGISTRO',
          'TRASPASO',
          'TRASLADO_MATRICULA_REGISTRO',
          'RADICADO_MATRICULA_REGISTRO',
          'CAMBIO_COLOR',
          'CAMBIO_SERVICIO',
          'REGRABAR_MOTOR',
          'REGRABAR_CHASIS',
          'TRANSFORMACION',
          'DUPLICADO_LICENCIA_TRANSITO',
          'INSCRIPCION_PRENDA',
          'LEVANTA_PRENDA',
          'CANCELACION_MATRICULA_REGISTRO',
          'CAMBIO_PLACAS',
          'DUPLICADO_PLACAS',
          'REMATRICULA',
          'CAMBIO_CARROCERIA',
          'OTROS',
        ])
        .nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('tipo_tramite')
    })
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enu('tipo_tramite', [
          'LICENCIA_CONDUCCION',
          'DUPLICADO_LICENCIA',
          'TRASLADO_CUENTA',
          'CAMBIO_PROPIETARIO',
          'MATRICULA',
          'DESENGAJE',
          'REVISION_DOCUMENTAL',
          'OTRO',
        ])
        .nullable()
    })
  }
}
