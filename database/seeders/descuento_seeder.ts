// database/seeders/descuento_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Descuento from '#models/descuento'

export default class extends BaseSeeder {
  async run() {
    await Descuento.createMany([
      {
        codigo: 'INFORMATIVO',
        nombre: 'Informativo',
        valorCarro: 50000.0,
        valorMoto: 30000.0,
        descripcion: 'Descuento para reportes informativos',
        activo: true,
      },
      {
        codigo: 'AVANCE',
        nombre: 'Avance',
        valorCarro: 75000.0,
        valorMoto: 45000.0,
        descripcion: 'Descuento por avance de proyecto',
        activo: true,
      },
      {
        codigo: 'INFORMATIVO_EMPLEADO',
        nombre: 'Informativo Empleado',
        valorCarro: 60000.0,
        valorMoto: 35000.0,
        descripcion: 'Descuento informativo para empleados',
        activo: true,
      },
      {
        codigo: 'INFORMATIVO_POLICIA',
        nombre: 'Informativo Policía',
        valorCarro: 100000.0,
        valorMoto: 60000.0,
        descripcion: 'Descuento informativo para policías',
        activo: true,
      },
      {
        codigo: 'AVANCE_PROPIETARIO',
        nombre: 'Avance Propietario',
        valorCarro: 90000.0,
        valorMoto: 55000.0,
        descripcion: 'Descuento por avance para propietarios',
        activo: true,
      },
    ])
  }
}
