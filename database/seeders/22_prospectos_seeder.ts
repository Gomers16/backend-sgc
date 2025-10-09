import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Prospecto from '#models/prospecto'
import Usuario from '#models/usuario'
import AgenteCaptacion from '#models/agente_captacion'
import Convenio from '#models/convenio'
import type { ProspectoOrigen } from '#models/prospecto'

export default class ProspectosSeeder extends BaseSeeder {
  public async run() {
    const hoy = DateTime.now().startOf('day')

    // 🧠 Buscar agentes comerciales y de convenio reales
    const comercial = await AgenteCaptacion.query().where('tipo', 'ASESOR_COMERCIAL').first()
    const convenioAgente = await AgenteCaptacion.query().where('tipo', 'ASESOR_CONVENIO').first()

    const usuarioComercial = comercial?.usuarioId
      ? await Usuario.find(comercial.usuarioId)
      : await Usuario.findBy('correo', 'carlos.rodriguez@empresa.com')

    const usuarioConvenio = convenioAgente?.usuarioId
      ? await Usuario.find(convenioAgente.usuarioId)
      : await Usuario.findBy('correo', 'maria.sanchez@empresa.com')

    // 🧠 Convenios reales
    const motorPlus = await Convenio.findBy('nombre', 'MotorPlus Taller')
    const llantasFrenos = await Convenio.findBy('nombre', 'Llantas & Frenos SAS')
    const lauraPerez = await Convenio.findBy('nombre', 'Laura Pérez')

    const prospectos = [
      { placa: 'AAA101', nombre: 'Juan Ramírez', telefono: '3000000010', convenioId: null },
      { placa: 'BBB202', nombre: 'Sofía Morales', telefono: '3000000011', convenioId: null },
      { placa: 'CCC303', nombre: 'Andrés Pérez', telefono: '3000000012', convenioId: null },
      { placa: 'DDD404', nombre: 'Valentina Torres', telefono: '3000000013', convenioId: null },
      { placa: 'EEE505', nombre: 'Felipe Gutiérrez', telefono: '3000000014', convenioId: null },
      { placa: 'FFF606', nombre: 'Camila Rojas', telefono: '3000000015', convenioId: null },
      { placa: 'GGG707', nombre: 'Esteban Díaz', telefono: '3000000016', convenioId: null },
      { placa: 'HHH808', nombre: 'Laura Castillo', telefono: '3000000017', convenioId: null },
      { placa: 'III909', nombre: 'Sebastián Romero', telefono: '3000000018', convenioId: null },
      { placa: 'JJJ010', nombre: 'Mariana Sánchez', telefono: '3000000019', convenioId: null },

      // Convenio: MotorPlus
      { placa: 'KAA111', nombre: 'Luis Pardo', telefono: '3000000020', convenioId: motorPlus?.id },
      {
        placa: 'LBB222',
        nombre: 'Natalia Vargas',
        telefono: '3000000021',
        convenioId: motorPlus?.id,
      },
      {
        placa: 'MCC333',
        nombre: 'Carlos Jiménez',
        telefono: '3000000022',
        convenioId: motorPlus?.id,
      },

      // Convenio: Llantas & Frenos
      {
        placa: 'NDD444',
        nombre: 'Sara Medina',
        telefono: '3000000023',
        convenioId: llantasFrenos?.id,
      },
      { placa: 'OEE555', nombre: 'Mateo Torres', telefono: '3000000024', convenioId: llantasFrenos?.id },
      { placa: 'PFF666', nombre: 'Juliana López', telefono: '3000000025', convenioId: llantasFrenos?.id },

      // Convenio: Laura Pérez
      { placa: 'QGG777', nombre: 'Miguel Ángel', telefono: '3000000026', convenioId: lauraPerez?.id },
      { placa: 'RHH888', nombre: 'Diana Herrera', telefono: '3000000027', convenioId: lauraPerez?.id },
      { placa: 'SII999', nombre: 'Andrés Cuéllar', telefono: '3000000028', convenioId: lauraPerez?.id },
    ]

    const payload = prospectos.map((p, index) => {
      // 📅 Fechas realistas con mezcla de vigentes y vencidos
      const createdAt = hoy.minus({ days: Math.floor(Math.random() * 90) })

      // SOAT y RTM duran 1 año
      const soatVenc = index % 2 === 0 ? hoy.plus({ months: 10 }) : hoy.minus({ months: 3 })
      const tecnoVenc = index % 3 === 0 ? hoy.plus({ months: 11 }) : hoy.minus({ months: 5 })

      // Preventiva dura 2 meses
      const preventivaVenc = index % 4 === 0 ? hoy.plus({ months: 1 }) : hoy.minus({ months: 3 })

      // Peritaje: última fecha de revisión técnica (sin vigencia)
      const peritajeUltima = hoy.minus({ days: Math.floor(Math.random() * 180) })

      return {
        convenioId: p.convenioId ?? null,
        placa: p.placa,
        telefono: p.telefono,
        nombre: p.nombre,
        observaciones: 'Prospecto generado automáticamente',
        soatVigente: soatVenc >= hoy,
        soatVencimiento: soatVenc,
        tecnoVigente: tecnoVenc >= hoy,
        tecnoVencimiento: tecnoVenc,
        preventivaVigente: preventivaVenc >= hoy,
        preventivaVencimiento: preventivaVenc,
        peritajeUltimaFecha: peritajeUltima,
        origen: 'IMPORT' as ProspectoOrigen,
        creadoPor: p.convenioId ? (usuarioConvenio?.id ?? null) : (usuarioComercial?.id ?? null),
        createdAt,
        updatedAt: createdAt,
      }
    })

    await Prospecto.updateOrCreateMany('placa', payload)

    console.log('✅ 20 prospectos creados correctamente con los 4 servicios, vigentes y vencidos.')
  }
}
