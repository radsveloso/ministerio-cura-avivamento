import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../App'
import EventoForm from './EventoForm'

function formatarData(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function linkPublico(id) {
  const base = `${window.location.origin}${import.meta.env.BASE_URL || '/'}`.replace(/\/+$/, '/')
  return `${base}evento/${id}`
}

export default function AdminDashboard() {
  const { eventos, inscricoes, criarEvento, atualizarEvento, removerEvento, inscricoesPorEvento } =
    useData()
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [copiado, setCopiado] = useState(null)

  const abrirNovo = () => {
    setEditando(null)
    setFormAberto(true)
  }
  const abrirEditar = (ev) => {
    setEditando(ev)
    setFormAberto(true)
  }

  const salvar = (dados) => {
    if (editando) atualizarEvento(editando.id, dados)
    else criarEvento(dados)
    setFormAberto(false)
    setEditando(null)
  }

  const remover = (ev) => {
    const total = inscricoesPorEvento(ev.id).length
    const aviso =
      total > 0
        ? `Excluir "${ev.nome}" e ${total} inscrição(ões)? Esta ação é permanente.`
        : `Excluir "${ev.nome}"? Esta ação é permanente.`
    if (window.confirm(aviso)) removerEvento(ev.id)
  }

  const copiarLink = async (id) => {
    const url = linkPublico(id)
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(id)
      setTimeout(() => setCopiado(null), 2000)
    } catch {
      window.prompt('Copie o link:', url)
    }
  }

  const totalInscritos = inscricoes.length

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="anim-fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
        <div>
          <span className="text-[10px] font-display tracking-[0.4em] uppercase text-gold-500/80">
            Painel Ministerial
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-gold-grad">
            Eventos &amp; Inscrições
          </h1>
        </div>
        <button
          onClick={abrirNovo}
          className="self-start sm:self-auto px-6 py-3 rounded-full bg-gold-gradient text-ink-950 text-xs font-semibold tracking-widest uppercase shadow-gold-soft hover:shadow-gold-glow transition"
        >
          + Novo Evento
        </button>
      </div>

      {/* KPIs */}
      <div className="anim-fade-up anim-delay-1 grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <Kpi label="Eventos" valor={eventos.length} />
        <Kpi label="Inscrições" valor={totalInscritos} />
        <Kpi
          label="Ativos"
          valor={eventos.filter((e) => e.ativo !== false).length}
          className="hidden sm:block"
        />
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gold-700/30 bg-ink-900/40">
          <span className="text-5xl text-gold-500/40 font-display">✦</span>
          <p className="mt-4 font-serif italic text-xl text-stone-300/80">
            Nenhum evento criado ainda.
          </p>
          <button
            onClick={abrirNovo}
            className="mt-6 px-6 py-3 rounded-full bg-gold-gradient text-ink-950 text-xs font-semibold tracking-widest uppercase"
          >
            Criar Primeiro Evento
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {eventos.map((ev) => {
            const total = inscricoesPorEvento(ev.id).length
            const url = linkPublico(ev.id)
            const isCopiado = copiado === ev.id
            return (
              <article
                key={ev.id}
                className="anim-fade-up rounded-2xl border border-gold-700/20 bg-ink-900/60 hover:border-gold-500/40 transition p-6 sm:p-7 shadow-gold-soft"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/80">
                        {formatarData(ev.data)}
                      </span>
                      {ev.ativo === false && (
                        <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-stone-700/40 text-stone-300">
                          Arquivado
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-xl sm:text-2xl text-gold-grad break-words">
                      {ev.nome}
                    </h3>
                    {ev.local && (
                      <p className="mt-1 font-serif italic text-gold-200/80">{ev.local}</p>
                    )}
                    {ev.descricao && (
                      <p className="mt-2 text-sm text-stone-300/70 line-clamp-2">{ev.descricao}</p>
                    )}

                    <div className="mt-4 flex items-center gap-4 text-xs text-stone-300/70 flex-wrap">
                      <span>
                        <span className="font-display text-gold-300 text-base">{total}</span>{' '}
                        inscrito{total === 1 ? '' : 's'}
                      </span>
                      {ev.vagas && (
                        <span>
                          de <span className="font-display text-gold-300">{ev.vagas}</span> vagas
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch lg:w-56 shrink-0">
                    <Link
                      to={`/admin/evento/${ev.id}/inscricoes`}
                      className="text-center px-4 py-2 rounded-full bg-gold-gradient text-ink-950 text-[11px] font-semibold tracking-widest uppercase shadow-gold-soft hover:shadow-gold-glow transition"
                    >
                      Ver Inscrições
                    </Link>
                    <button
                      onClick={() => copiarLink(ev.id)}
                      className="text-center px-4 py-2 rounded-full border border-gold-700/40 text-gold-200/90 hover:border-gold-500 hover:text-gold-100 text-[11px] tracking-widest uppercase transition"
                    >
                      {isCopiado ? '✓ Link copiado' : 'Copiar link'}
                    </button>
                    <button
                      onClick={() => abrirEditar(ev)}
                      className="text-center px-4 py-2 rounded-full border border-gold-700/30 text-gold-200/70 hover:text-gold-100 hover:border-gold-500 text-[11px] tracking-widest uppercase transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        atualizarEvento(ev.id, { ativo: ev.ativo === false ? true : false })
                      }
                      className="text-center px-4 py-2 rounded-full border border-gold-700/20 text-stone-300/80 hover:text-gold-100 hover:border-gold-500/50 text-[11px] tracking-widest uppercase transition"
                    >
                      {ev.ativo === false ? 'Reativar' : 'Arquivar'}
                    </button>
                    <button
                      onClick={() => remover(ev)}
                      className="text-center px-4 py-2 rounded-full border border-red-700/30 text-red-300/80 hover:bg-red-900/30 hover:text-red-200 text-[11px] tracking-widest uppercase transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gold-700/15 text-[11px] text-stone-400 break-all font-mono">
                  {url}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {formAberto && (
        <EventoForm
          inicial={editando}
          onSalvar={salvar}
          onCancelar={() => {
            setFormAberto(false)
            setEditando(null)
          }}
        />
      )}
    </div>
  )
}

function Kpi({ label, valor, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-gold-700/20 bg-ink-900/60 p-5 shadow-gold-soft ${className}`}
    >
      <div className="text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/80">
        {label}
      </div>
      <div className="mt-1 font-display text-3xl text-gold-grad">{valor}</div>
    </div>
  )
}
