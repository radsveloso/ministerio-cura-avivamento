import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../App'

const SECOES = [
  {
    titulo: 'Dados Pessoais',
    icone: '👤',
    campos: [
      { id: 'nome', label: 'Nome completo', type: 'text', required: true, full: true },
      { id: 'dataNascimento', label: 'Data de nascimento', type: 'date', required: true },
      { id: 'idade', label: 'Idade', type: 'number', required: false },
      { id: 'cpf', label: 'CPF', type: 'text', placeholder: '000.000.000-00', required: true },
      { id: 'rg', label: 'RG', type: 'text', required: false },
      { id: 'telefone', label: 'Telefone principal', type: 'tel', required: true },
      { id: 'telefoneSec', label: 'Telefone secundário', type: 'tel', required: false },
      { id: 'email', label: 'E-mail', type: 'email', required: true },
      { id: 'endereco', label: 'Endereço completo', type: 'text', required: true, full: true },
      { id: 'cidade', label: 'Cidade', type: 'text', required: true },
      { id: 'estado', label: 'Estado', type: 'text', required: true },
    ],
  },
  {
    titulo: 'Contato de Emergência',
    icone: '🚨',
    campos: [
      { id: 'emergenciaNome', label: 'Nome completo do contato de emergência', type: 'text', required: true, full: true },
      { id: 'emergenciaParentesco', label: 'Grau de parentesco', type: 'text', required: true },
      { id: 'emergenciaTelefone', label: 'Telefone do contato de emergência', type: 'tel', required: true },
      { id: '_temSegundoContato', label: 'Existe outra pessoa para contato em caso de emergência?', type: 'yesno', required: false, full: true },
      { id: 'emergencia2Nome', label: 'Nome do segundo contato', type: 'text', required: false, conditional: '_temSegundoContato' },
      { id: 'emergencia2Telefone', label: 'Telefone do segundo contato', type: 'tel', required: false, conditional: '_temSegundoContato' },
      { id: 'emergencia2Parentesco', label: 'Parentesco do segundo contato', type: 'text', required: false, conditional: '_temSegundoContato' },
    ],
  },
  {
    titulo: 'Informações de Saúde',
    icone: '❤️',
    campos: [
      { id: '_temAlergia', label: 'Possui alguma alergia?', type: 'yesno', required: false, full: true },
      { id: 'alergias', label: 'Se sim, qual alergia?', type: 'text', required: false, conditional: '_temAlergia', full: true },
      { id: '_temRestricao', label: 'Possui restrição alimentar?', type: 'yesno', required: false, full: true },
      { id: 'restricaoAlimentar', label: 'Se sim, qual restrição alimentar / alimento?', type: 'text', required: false, conditional: '_temRestricao', full: true },
      { id: '_temMedicacao', label: 'Faz uso de medicação contínua?', type: 'yesno', required: false, full: true },
      { id: 'medicamentos', label: 'Se sim, qual medicamento e horários?', type: 'textarea', required: false, conditional: '_temMedicacao', full: true },
      { id: '_hipertensao', label: 'Possui hipertensão (pressão alta)?', type: 'yesno', required: false, full: true },
      { id: '_diabetes', label: 'Possui diabetes?', type: 'yesno', required: false, full: true },
      { id: '_temCardio', label: 'Possui problema cardíaco?', type: 'yesno', required: false, full: true },
      { id: 'problemaCardiaco', label: 'Se sim, qual problema cardíaco?', type: 'text', required: false, conditional: '_temCardio', full: true },
      { id: '_convulsao', label: 'Já teve crises convulsivas ou epilepsia?', type: 'yesno', required: false, full: true },
      { id: '_temDeficiencia', label: 'Possui alguma deficiência ou limitação física?', type: 'yesno', required: false, full: true },
      { id: 'deficiencia', label: 'Se sim, qual?', type: 'text', required: false, conditional: '_temDeficiencia', full: true },
      { id: '_temAcompanhamento', label: 'Possui acompanhamento médico por alguma condição específica?', type: 'yesno', required: false, full: true },
      { id: 'condicoes', label: 'Se sim, qual condição?', type: 'text', required: false, conditional: '_temAcompanhamento', full: true },
    ],
  },
]

const ESTILO_INPUT =
  'w-full px-4 py-3 rounded-lg bg-ink-950/80 border border-gold-700/30 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 text-stone-100 placeholder:text-stone-500 transition'

function YesNo({ value, onChange }) {
  return (
    <div className="flex gap-3">
      <button type="button" onClick={() => onChange(value === true ? null : true)}
        className={`flex-1 py-2.5 rounded-lg border text-xs font-display tracking-widest uppercase transition ${value === true ? 'border-emerald-500/60 bg-emerald-900/30 text-emerald-300' : 'border-gold-700/30 text-stone-400 hover:border-gold-500/40 hover:text-stone-200'}`}>
        ✓ Sim
      </button>
      <button type="button" onClick={() => onChange(value === false ? null : false)}
        className={`flex-1 py-2.5 rounded-lg border text-xs font-display tracking-widest uppercase transition ${value === false ? 'border-stone-500/60 bg-stone-800/40 text-stone-300' : 'border-gold-700/30 text-stone-400 hover:border-gold-500/40 hover:text-stone-200'}`}>
        ✗ Não
      </button>
    </div>
  )
}

function Campo({ campo, value, onChange, form }) {
  if (campo.conditional && form[campo.conditional] !== true) return null
  const label = (
    <span className="block text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/80 mb-2">
      {campo.label}{campo.required && <span className="text-gold-400 ml-1">*</span>}
    </span>
  )
  if (campo.type === 'yesno') return (
    <div className={campo.full ? 'col-span-2' : ''}>{label}<YesNo value={value ?? null} onChange={(v) => onChange(campo.id, v)} /></div>
  )
  if (campo.type === 'textarea') return (
    <div className={campo.full ? 'col-span-2' : ''}>
      <label>{label}<textarea className={ESTILO_INPUT + ' resize-y'} rows={3} placeholder={campo.placeholder || ''} value={value || ''} onChange={(e) => onChange(campo.id, e.target.value)} /></label>
    </div>
  )
  return (
    <div className={campo.full ? 'col-span-2' : ''}>
      <label>{label}<input type={campo.type} className={ESTILO_INPUT} placeholder={campo.placeholder || ''} value={value || ''} onChange={(e) => onChange(campo.id, e.target.value)} required={campo.required} /></label>
    </div>
  )
}

export default function FormularioPublico() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { eventoPorId, criarInscricao, inscricoesPorEvento } = useData()
  const evento = eventoPorId(id)
  const [form, setForm] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  if (!evento) return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <span className="text-5xl text-gold-500/40 font-display">✦</span>
      <p className="mt-6 font-serif italic text-xl text-stone-300">Evento não encontrado.</p>
      <button onClick={() => navigate('/')} className="mt-6 px-6 py-2.5 rounded-full border border-gold-500/40 text-gold-200 hover:bg-gold-500/10 text-xs tracking-widest uppercase">Voltar</button>
    </div>
  )

  const inscritos = inscricoesPorEvento(id).length
  const esgotado = evento.vagas && Number(evento.vagas) > 0 && inscritos >= Number(evento.vagas)

  if (evento.ativo === false || esgotado) return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <span className="text-5xl text-gold-500/40 font-display">✦</span>
      <p className="mt-6 font-serif italic text-xl text-stone-300">{esgotado ? 'As vagas para este evento estão esgotadas.' : 'Este evento está encerrado.'}</p>
      <button onClick={() => navigate('/')} className="mt-6 px-6 py-2.5 rounded-full border border-gold-500/40 text-gold-200 hover:bg-gold-500/10 text-xs tracking-widest uppercase">Ver outros eventos</button>
    </div>
  )

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const todosCampos = SECOES.flatMap((s) => s.campos)
  const totalVisiveis = todosCampos.filter((c) => c.type !== 'yesno' && (!c.conditional || form[c.conditional] === true)).length
  const preenchidos = todosCampos.filter((c) => c.type !== 'yesno' && (!c.conditional || form[c.conditional] === true) && form[c.id]).length
  const progresso = totalVisiveis > 0 ? Math.round((preenchidos / totalVisiveis) * 100) : 0

  const enviar = (e) => {
    e.preventDefault()
    setErro('')
    const obrigatorios = todosCampos.filter((c) => c.required && c.type !== 'yesno' && (!c.conditional || form[c.conditional] === true))
    const faltando = obrigatorios.filter((c) => !form[c.id])
    if (faltando.length > 0) {
      setErro(`Preencha os campos obrigatórios: ${faltando.map((c) => c.label).join(', ')}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setEnviando(true)
    setTimeout(() => { criarInscricao(id, { ...form }); navigate('/inscricao/sucesso', { state: { eventoNome: evento.nome } }) }, 600)
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="anim-fade-up text-center mb-10">
        <span className="text-[10px] font-display tracking-[0.4em] uppercase text-gold-500/80">Apóstolo Ricardo Costa</span>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl text-gold-grad">{evento.nome}</h1>
        {evento.local && <p className="mt-2 font-serif italic text-gold-200/80">{evento.local}</p>}
        <p className="mt-4 font-serif italic text-stone-300/80">Preencha sua ficha de inscrição abaixo.</p>
      </div>
      <div className="anim-fade-up anim-delay-1 mb-8">
        <div className="flex items-center justify-between text-[10px] font-display tracking-widest uppercase text-gold-500/70 mb-2">
          <span>Preenchimento</span><span>{progresso}%</span>
        </div>
        <div className="h-1 rounded-full bg-gold-900/40 overflow-hidden">
          <div className="h-full rounded-full bg-gold-gradient transition-all duration-500" style={{ width: `${progresso}%` }} />
        </div>
      </div>
      {erro && <div className="mb-6 rounded-xl border border-red-700/40 bg-red-950/40 px-5 py-4 text-sm text-red-300">{erro}</div>}
      <form onSubmit={enviar} className="space-y-8">
        {SECOES.map((secao) => (
          <section key={secao.titulo} className="anim-fade-up rounded-2xl border border-gold-700/20 bg-ink-900/60 overflow-hidden shadow-gold-soft">
            <div className="px-7 py-5 border-b border-gold-700/15 flex items-center gap-3">
              <span className="text-xl">{secao.icone}</span>
              <h2 className="font-display text-lg text-gold-grad">{secao.titulo}</h2>
            </div>
            <div className="px-7 py-6 grid grid-cols-2 gap-5">
              {secao.campos.map((campo) => (
                <Campo key={campo.id} campo={campo} value={form[campo.id]} onChange={set} form={form} />
              ))}
            </div>
          </section>
        ))}
        <div className="pt-4 text-center">
          <p className="text-xs text-stone-400 mb-6">Campos com <span className="text-gold-400">*</span> são obrigatórios.</p>
          <button type="submit" disabled={enviando} className="px-10 py-4 rounded-full bg-gold-gradient text-ink-950 font-display text-sm tracking-widest uppercase shadow-gold-glow hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed transition">
            {enviando ? 'Enviando…' : '✝ Confirmar Inscrição'}
          </button>
        </div>
      </form>
    </div>
  )
}
