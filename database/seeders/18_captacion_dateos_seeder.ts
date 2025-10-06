import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CaptacionDateo from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'

const BASE_URL =
  process.env.APP_URL?.replace(/\/$/, '') || `http://127.0.0.1:${process.env.PORT || 3333}`

export default class CaptacionDateosSeeder extends BaseSeeder {
  public async run() {
    const ana = await AgenteCaptacion.findBy('nombre', 'Ana Morales')
    const pedro = await AgenteCaptacion.findBy('nombre', 'Pedro Rojas')
    const tallerAndes = await AgenteCaptacion.findBy('nombre', 'Taller Los Andes SAS')

    const internoA = ana ?? (await AgenteCaptacion.query().where('tipo', 'ASESOR_INTERNO').first())
    const internoB =
      pedro ??
      (await AgenteCaptacion.query()
        .where('tipo', 'ASESOR_INTERNO')
        .whereNot('id', internoA?.id ?? 0)
        .first()) ??
      internoA

    const externoA =
      tallerAndes ?? (await AgenteCaptacion.query().where('tipo', 'ASESOR_EXTERNO').first())
    const externoB =
      (await AgenteCaptacion.query()
        .where('tipo', 'ASESOR_EXTERNO')
        .whereNot('id', externoA?.id ?? 0)
        .first()) ?? externoA

    const rows = [
      {
        canal: 'ASESOR',
        agenteId: internoA?.id ?? null,
        placa: 'ZXC321',
        telefono: '3001112233',
        origen: 'UI',
        observacion: 'Referido por asesor interno',
        imagenUrl: `${BASE_URL}/uploads/dateos/ZXC321.jpg`,
      },
      {
        canal: 'ASESOR',
        agenteId: externoA?.id ?? null,
        placa: 'MKL456',
        telefono: null,
        origen: 'WHATSAPP',
        observacion: 'Taller aliado remitió cliente',
        imagenUrl: null,
      },
      {
        canal: 'ASESOR',
        agenteId: internoB?.id ?? null,
        placa: 'NOP741',
        telefono: '3012223344',
        origen: 'UI',
        observacion: 'Cliente frecuente del asesor',
        imagenUrl: null,
      },
      {
        canal: 'ASESOR',
        agenteId: externoB?.id ?? null,
        placa: 'HJK852',
        telefono: null,
        origen: 'IMPORT',
        observacion: 'Carga masiva desde convenio',
        imagenUrl: `${BASE_URL}/uploads/dateos/HJK852.jpg`,
      },
      {
        canal: 'ASESOR',
        agenteId: internoA?.id ?? null,
        placa: 'WER963',
        telefono: '3023334455',
        origen: 'UI',
        observacion: 'Pedido de cita coordinado',
        imagenUrl: null,
      },
      {
        canal: 'ASESOR',
        agenteId: externoA?.id ?? null,
        placa: 'TTY159',
        telefono: null,
        origen: 'WHATSAPP',
        observacion: 'Canal taller externo',
        imagenUrl: null,
      },
      {
        canal: 'ASESOR',
        agenteId: internoB?.id ?? null,
        placa: 'UIO357',
        telefono: '3034445566',
        origen: 'UI',
        observacion: 'Cliente nuevo recomendado',
        imagenUrl: `${BASE_URL}/uploads/dateos/UIO357.jpg`,
      },
      {
        canal: 'ASESOR',
        agenteId: externoB?.id ?? null,
        placa: 'RTY468',
        telefono: null,
        origen: 'IMPORT',
        observacion: 'Campaña conjunta con aliado',
        imagenUrl: null,
      },
      {
        canal: 'ASESOR',
        agenteId: internoA?.id ?? null,
        placa: 'FGH579',
        telefono: '3045556677',
        origen: 'UI',
        observacion: 'Agendado por asesor interno',
        imagenUrl: null,
      },
      {
        canal: 'ASESOR',
        agenteId: externoA?.id ?? null,
        placa: 'CVB680',
        telefono: null,
        origen: 'WHATSAPP',
        observacion: 'Envía contacto y placa el taller',
        imagenUrl: `${BASE_URL}/uploads/dateos/CVB680.jpg`,
      },
    ] as const

    for (const r of rows) {
      await CaptacionDateo.updateOrCreate(
        { placa: r.placa },
        { ...r, placa: r.placa.toUpperCase() }
      )
    }
  }
}
