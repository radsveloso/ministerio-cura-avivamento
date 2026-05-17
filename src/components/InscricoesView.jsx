import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useData } from '../App'

function fmtData(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function csvCell(v) {
  if (v === null || v === undefined) return ''
  const s = Array.isArray(v) ? v.join('; ') : String(v)
  if (/[",;\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function gerarCSV(inscricoes, evento) {
  const headers = [
    'Data inscrição',
    'Nome',
    'CPF',
    'Nascimento',
    'Sexo',
    'Endereço',
    'Cidade',
    'Estado',
    'CEP',
    'Telefone',
    'E-mail',
    'Emergência - Nome',
    'Emergência - Parentesco',
    'Emergência - Telefone',
    'Condições médicas',
    'Medicamentos',
    'Alergias',
    'Observações',
    'Autorização emergência',
  ]

  const linhas = inscricoes.map((i) => [
    fmtData(i.inscritoEm),
    i.nome,
    i.cpf,
    i.dataNascimento,
    i.sexo,
    i.endereco,
    i.cidade,
    i.estado,
    i.cep,
    i.telefone,
    i.email,
    i.emergenciaNome,
    i.emergenciaParentesco,
    i.emergenciaTelefone,
    i.condicoes,
    i.medicamentos,
    i.alergias,
    i.observacoes,
    i.autorizaEmergencia ? 'Sim' : 'Não',
  ])

  const rows = [headers, ...linhas].map((r) => r.map(csvCell).join(';'))
  return '﻿' + rows.join('\n') // BOM para Excel
}

function baixarArquivo(nome, conteudo, mime = 'text/csv;charset=utf-8;') {
  const blob = new Blob([conteudo], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function InscricoesView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { eventoPorId, inscricoesPorEvento } = useData()
  const evento = eventoPorId(id)
  const inscricoes = inscricoesPorEvento(id)

  const [busca, setBusca] = useState('')
  const [detalhe, setDetalhe] = useState(null)

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return inscricoes
    return inscricoes.filter((i) =>
      [i.nome, i.cpf, i.email, i.telefone, i.cidade].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    )
  }, [inscricoes, busca])

  if (!evento) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-serif italic text-xl text-stone-300">Evento não encontrado.</p>
        <button
          onClick={() => navigate('/admin')}
          className="mt-6 px-6 py-2.5 rounded-full border border-gold-500/40 text-gold-200 hover:bg-gold-500/10 text-xs tracking-widest uppercase"
        >
          Voltar ao Painel
        </button>
      </div>
    )
  }

  const exportar = () => {
    const csv = gerarCSV(filtradas, evento)
    const slug = (evento.nome || 'evento').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)
    baixarArquivo(`inscricoes-${slug}.csv`, csv)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="anim-fade-up mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold-500/80 hover:text-gold-300 font-display"
        >
          ← Voltar ao painel
        </Link>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl text-gold-grad">{evento.nome}</h1>
        <p className="mt-2 font-serif italic text-gold-200/80">
          {evento.local} {evento.data && '·'} {evento.data && new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="anim-fade-up anim-delay-1 grid sm:grid-cols-3 gap-4 mb-8">
        <Kpi label="Inscritos" valor={inscricoes.length} />
        <Kpi label="Vagas" valor={evento.vagas || '∞'} />
        <Kpi
          label="Restantes"
          valor={
            evento.vagas
              ? Math.max(0, Number(evento.vagas) - inscricoes.length)
              : '∞'
          }
        />
      </div>

      <div className="anim-fade-up anim-delay-2 flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, CPF, e-mail, cidade…"
          className="flex-1 px-4 py-2.5 rounded-full bg-ink-950/80 border border-gold-700/30 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 text-stone-100"
        />
        <button
          onClick={exportar}
          disabled={filtradas.length === 0}
          className="px-5 py-2.5 rounded-full bg-gold-gradient text-ink-950 text-xs font-semibold tracking-widest uppercase shadow-gold-soft hover:shadow-gold-glow disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ↓ Exportar CSV ({filtradas.length})
        </button>
      </div>

      {inscricoes.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gold-700/30 bg-ink-900/40">
          <span className="text-5xl text-gold-500/40 font-display">✦</span>
          <p className="mt-4 font-serif italic text-xl text-stone-300/80">
            Ainda não há inscrições.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gold-700/20 bg-ink-900/60 overflow-hidden shadow-gold-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-gold-500/80 font-display border-b border-gold-700/20">
                  <th className="px-5 py-3">Nome</th>
                  <th className="px-5 py-3">Cidade / UF</th>
                  <th className="px-5 py-3">Telefone</th>
                  <th className="px-5 py-3">Inscrito em</th>
                  <th className="px-5 py-3 text-right">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((i, idx) => (
                  <tr
                    key={i.id}
                    className={`border-b border-gold-700/10 hover:bg-gold-500/5 transition ${
                      idx % 2 ? 'bg-ink-950/30' : ''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-stone-100">{i.nome}</div>
                      <div className="text-xs text-stone-400">{i.cpf}</div>
                    </td>
                    <td className="px-5 py-3 text-stone-300">
                      {i.cidade}
                      {i.estado && <span className="text-stone-500"> / {i.estado}</span>}
                    </td>
                    <td className="px-5 py-3 text-stone-300">{i.telefone}</td>
                    <td className="px-5 py-3 text-stone-400 text-xs">{fmtData(i.inscritoEm)}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setDetalhe(i)}
                        className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-200"
                      >
                        Ver ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detalhe && <DetalheModal inscricao={detalhe} onFechar={() => setDetalhe(null)} />}
    </div>
  )
}

function Kpi({ label, valor }) {
  return (
    <div className="rounded-xl border border-gold-700/20 bg-ink-900/60 p-5 shadow-gold-soft">
      <div className="text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/80">
        {label}
      </div>
      <div className="mt-1 font-display text-3xl text-gold-grad">{valor}</div>
    </div>
  )
}

function Item({ label, valor }) {
  if (valor === null || valor === undefined || valor === '') return null
  const display = Array.isArray(valor) ? valor.join(', ') : valor === true ? 'Sim' : valor === false ? 'Não' : valor
  return (
    <div>
      <dt className="text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/80">{label}</dt>
      <dd className="mt-1 text-stone-100 text-sm break-words">{display}</dd>
    </div>
  )
}

function DetalheModal({ inscricao, onFechar }) {
  const i = inscricao
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-ink-950/85 backdrop-blur-sm"
      onClick={onFechar}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-gold-700/40 bg-ink-900 shadow-gold-glow overflow-hidden anim-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
        <div className="px-7 py-5 border-b border-gold-700/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/80">
              Ficha de inscrição
            </span>
            <h3 className="font-display text-xl text-gold-grad">{i.nome}</h3>
          </div>
          <button
            onClick={onFechar}
            className="text-gold-500/70 hover:text-gold-200 text-2xl leading-none px-2"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="px-7 py-6 max-h-[70vh] overflow-y-auto space-y-7">
          <Secao titulo="Dados Pessoais">
            <Item label="CPF" valor={i.cpf} />
            <Item label="Nascimento" valor={i.dataNascimento} />
            <Item label="Sexo" valor={i.sexo} />
            <Item label="Telefone" valor={i.telefone} />
            <Item label="E-mail" valor={i.email} />
            <Item label="Endereço" valor={i.endereco} />
            <Item label="Cidade" valor={i.cidade} />
            <Item label="Estado" valor={i.estado} />
            <Item label="CEP" valor={i.cep} />
          </Secao>

          <Secao titulo="Contato de Emergência">
            <Item label="Nome" valor={i.emergenciaNome} />
            <Item label="Parentesco" valor={i.emergenciaParentesco} />
            <Item label="Telefone" valor={i.emergenciaTelefone} />
          </Secao>

          <Secao titulo="Saúde">
            <Item label="Condições médicas" valor={i.condicoes} />
            <Item label="Medicamentos em uso" valor={i.medicamentos} />
            <Item label="Alergias" valor={i.alergias} />
            <Item label="Observações" valor={i.observacoes} />
            <Item label="Autoriza atendimento de emergência" valor={i.autorizaEmergencia} />
          </Secao>

          <div className="pt-4 border-t border-gold-700/15 text-xs text-stone-400">
            Inscrito em {fmtData(i.inscritoEm)}
          </div>
        </div>
      </div>
    </div>
  )
}

function Secao({ titulo, children }) {
  return (
    <div>
      <h4 className="font-display text-sm tracking-[0.3em] uppercase text-gold-grad mb-3">
        ✦ {titulo}
      </h4>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">{children}</dl>
    </div>
  )
}
