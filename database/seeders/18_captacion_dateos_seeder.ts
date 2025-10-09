// database/seeders/18_captacion_dateos_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CaptacionDateo from '#models/captacion_dateo'
import AgenteCaptacion from '#models/agente_captacion'
import Usuario from '#models/usuario'
import Convenio from '#models/convenio'

const BASE_URL =
  process.env.APP_URL?.replace(/\/$/, '') || `http://127.0.0.1:${process.env.PORT || 3333}`

function normalizePhone(p?: string | null) {
  return (p ?? '').replace(/\D+/g, '')
}

// Buscar convenio por teléfono del ASESOR_CONVENIO (sin crear nada)
async function findConvenioIdByAgenteConvenio(agenteId?: number | null) {
  if (!agenteId) return null
  const ag = await AgenteCaptacion.find(agenteId)
  if (!ag || ag.tipo !== 'ASESOR_CONVENIO') return null

  // primero usa el teléfono del propio agente
  const telAgente = normalizePhone((ag as any).telefono)
  if (telAgente) {
    const convByAgent = await Convenio.query()
      .whereRaw('REGEXP_REPLACE(telefono, "[^0-9]", "") = ?', [telAgente])
      .orWhereRaw('REGEXP_REPLACE(whatsapp, "[^0-9]", "") = ?', [telAgente])
      .first()
    if (convByAgent?.id) return convByAgent.id
  }

  // fallback: si el agente está ligado a un usuario, usa su teléfono
  if (ag.usuarioId) {
    const u = await Usuario.find(ag.usuarioId)
    const telUser =
      normalizePhone((u as any)?.celularCorporativo) || normalizePhone((u as any)?.celularPersonal)
    if (telUser) {
      const convByUser = await Convenio.query()
        .whereRaw('REGEXP_REPLACE(telefono, "[^0-9]", "") = ?', [telUser])
        .orWhereRaw('REGEXP_REPLACE(whatsapp, "[^0-9]", "") = ?', [telUser])
        .first()
      if (convByUser?.id) return convByUser.id
    }
  }

  return null
}

export default class CaptacionDateosSeeder extends BaseSeeder {
  public async run() {
    // Opcionales por nombre (si existen)
    const ana = await AgenteCaptacion.findBy('nombre', 'Ana Morales') // comercial
    const pedro = await AgenteCaptacion.findBy('nombre', 'Pedro Rojas') // comercial
    const tallerAndes = await AgenteCaptacion.findBy('nombre', 'Taller Los Andes SAS') // convenio

    // Comerciales (quienes REGISTRAN el dateo)
    const comercialA =
      ana ?? (await AgenteCaptacion.query().where('tipo', 'ASESOR_COMERCIAL').first())
    const comercialB =
      pedro ??
      (await AgenteCaptacion.query()
        .where('tipo', 'ASESOR_COMERCIAL')
        .whereNot('id', comercialA?.id ?? 0)
        .first()) ??
      comercialA

    // Convenios (quienes REFIEREN el lead, opcionales)
    const convenioA =
      tallerAndes ?? (await AgenteCaptacion.query().where('tipo', 'ASESOR_CONVENIO').first())
    const convenioB =
      (await AgenteCaptacion.query()
        .where('tipo', 'ASESOR_CONVENIO')
        .whereNot('id', convenioA?.id ?? 0)
        .first()) ?? convenioA

    // Helper: siempre usar un comercial para "hechoPor"
    const hechoPor = (fallback?: AgenteCaptacion | null) =>
      fallback && fallback.tipo === 'ASESOR_COMERCIAL' ? fallback : comercialA

    // hechoPor = asesor comercial (obligatorio), referidoPor = asesor convenio (opcional)
    const rows = [
      {
        hechoPor: hechoPor(comercialA),
        referidoPor: null,
        placa: 'ZXC321',
        tel: '3001112233',
        origen: 'UI',
        obs: 'Referido por asesor comercial',
        img: `${BASE_URL}/uploads/dateos/ZXC321.jpg`,
      },
      {
        hechoPor: hechoPor(comercialA),
        referidoPor: convenioA,
        placa: 'MKL456',
        tel: null,
        origen: 'WHATSAPP',
        obs: 'Convenio envía el contacto',
        img: null,
      },
      {
        hechoPor: hechoPor(comercialB),
        referidoPor: null,
        placa: 'NOP741',
        tel: '3012223344',
        origen: 'UI',
        obs: 'Cliente frecuente del asesor comercial',
        img: null,
      },
      {
        hechoPor: hechoPor(comercialB),
        referidoPor: convenioB,
        placa: 'HJK852',
        tel: null,
        origen: 'IMPORT',
        obs: 'Carga masiva desde convenio',
        img: `${BASE_URL}/uploads/dateos/HJK852.jpg`,
      },
      {
        hechoPor: hechoPor(comercialA),
        referidoPor: null,
        placa: 'WER963',
        tel: '3023334455',
        origen: 'UI',
        obs: 'Pedido de cita coordinado',
        img: null,
      },
      {
        hechoPor: hechoPor(comercialA),
        referidoPor: convenioA,
        placa: 'TTY159',
        tel: null,
        origen: 'WHATSAPP',
        obs: 'Canal convenio (taller aliado)',
        img: null,
      },
      {
        hechoPor: hechoPor(comercialB),
        referidoPor: null,
        placa: 'UIO357',
        tel: '3034445566',
        origen: 'UI',
        obs: 'Cliente nuevo recomendado',
        img: `${BASE_URL}/uploads/dateos/UIO357.jpg`,
      },
      {
        hechoPor: hechoPor(comercialB),
        referidoPor: convenioB,
        placa: 'RTY468',
        tel: null,
        origen: 'IMPORT',
        obs: 'Campaña conjunta con aliado',
        img: null,
      },
      {
        hechoPor: hechoPor(comercialA),
        referidoPor: null,
        placa: 'FGH579',
        tel: '3045556677',
        origen: 'UI',
        obs: 'Agendado por asesor comercial',
        img: null,
      },
      {
        hechoPor: hechoPor(comercialA),
        referidoPor: convenioA,
        placa: 'CVB680',
        tel: null,
        origen: 'WHATSAPP',
        obs: 'Convenio envía placa y contacto',
        img: `${BASE_URL}/uploads/dateos/CVB680.jpg`,
      },
    ] as const

    for (const r of rows) {
      const placa = r.placa.toUpperCase()
      const convenioId = await findConvenioIdByAgenteConvenio(r.referidoPor?.id ?? null)

      await CaptacionDateo.updateOrCreate(
        { placa },
        {
          placa,
          canal: 'ASESOR_COMERCIAL', // siempre lo registra un asesor comercial
          agenteId: r.hechoPor?.id ?? null, // comercial que hizo el dateo
          convenioId, // si vino por convenio, enlazamos aquí
          telefono: r.tel ?? null,
          origen: r.origen as 'UI' | 'WHATSAPP' | 'IMPORT',
          observacion: r.obs,
          imagenUrl: r.img,
        }
      )
    }
  }
}
