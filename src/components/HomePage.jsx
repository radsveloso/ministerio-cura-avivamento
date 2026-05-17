import { Link } from 'react-router-dom'
import { useData } from '../App'

function formatarData(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function EventoCard({ evento, idx }) {
  const totalInscritos = (useData().inscricoesPorEvento(evento.id) || []).length
  const vagasRestantes =
    evento.vagas && Number(evento.vagas) > 0
      ? Math.max(0, Number(evento.vagas) - totalInscritos)
      : null
  const esgotado = vagasRestantes === 0

  return (
    <article
      className={`anim-fade-up anim-delay-${Math.min(idx + 1, 4)} group relative overflow-hidden rounded-2xl bg-ink-900/70 border border-gold-700/20 shadow-gold-soft hover:shadow-gold-glow hover:border-gold-500/50 transition-all duration-500`}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="absolute top-4 right-4 text-gold-500/30 text-3xl font-display group-hover:text-gold-400/70 transition">
        ✦
      </div>

      <div className="p-7 sm:p-8">
        <div className="text-[10px] font-display tracking-[0.3em] text-gold-500/80 uppercase">
          {formatarData(evento.data)}
        </div>
        <h3 className="mt-3 font-display text-2xl sm:text-3xl text-gold-grad leading-tight">
          {evento.nome}
        </h3>
        {evento.local && (
          <p className="mt-2 font-serif text-gold-200/80 text-lg italic">{evento.local}</p>
        )}
        {evento.descricao && (
          <p className="mt-4 text-stone-300/80 text-sm leading-relaxed line-clamp-3">
            {evento.descricao}
          </p>
        )}

        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="text-xs">
            {vagasRestantes !== null ? (
              esgotado ? (
                <span className="text-red-300/80 font-display uppercase tracking-widest text-[10px]">
                  Vagas esgotadas
                </span>
              ) : (
                <span className="text-gold-300/80">
                  <span className="font-display text-lg">{vagasRestantes}</span>{' '}
                  <span className="text-[10px] uppercase tracking-widest">vagas restantes</span>
                </span>
              )
            ) : (
              <span className="text-gold-300/60 text-[10px] uppercase tracking-widest font-display">
                Vagas livres
              </span>
            )}
          </div>

          {!esgotado ? (
            <Link
              to={`/evento/${evento.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-gradient text-ink-950 text-xs font-semibold tracking-widest uppercase shadow-gold-soft hover:shadow-gold-glow transition"
            >
              Inscrever-se
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <span className="inline-flex items-center px-5 py-2.5 rounded-full border border-gold-700/30 text-gold-700 text-xs uppercase tracking-widest">
              Encerrado
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function HomePage() {
  const { eventosAtivos } = useData()
  const eventos = eventosAtivos()

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(212,165,72,0.18) 0%, transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <p className="anim-fade-up text-[10px] sm:text-xs font-display tracking-[0.5em] text-gold-500/80 uppercase">
            Apóstolo Ricardo Costa
          </p>
          <h1 className="anim-fade-up anim-delay-1 mt-6 font-display text-4xl sm:text-6xl md:text-7xl text-gold-grad leading-[1.05]">
            Cura &amp; Avivamento
          </h1>
          <div className="anim-fade-up anim-delay-2 mt-8 divider-ornament max-w-md mx-auto">
            <span className="text-gold-500/70 text-xl font-display">✦</span>
          </div>
          <p className="anim-fade-up anim-delay-3 mt-8 font-serif italic text-xl sm:text-2xl text-stone-200/90 max-w-2xl mx-auto leading-relaxed">
            Um lugar de encontro com a presença de Deus. Inscreva-se em nossos eventos,
            cultos e encontros — e venha receber.
          </p>
          <div className="anim-fade-up anim-delay-4 mt-10">
            <a
              href="#eventos"
              className="inline-flex items-center gap-3 px-7 py-3 rounded-full border border-gold-500/50 text-gold-200 hover:bg-gold-500/10 transition tracking-widest uppercase text-xs font-display"
            >
              Ver Próximos Eventos
              <span aria-hidden className="text-gold-400">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Eventos */}
      <section id="eventos" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-12 text-center">
          <span className="text-[10px] font-display tracking-[0.4em] text-gold-500/70 uppercase">
            Agenda Ministerial
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-gold-grad">
            Próximos Eventos
          </h2>
        </div>

        {eventos.length === 0 ? (
          <div className="mx-auto max-w-xl text-center p-12 rounded-2xl border border-dashed border-gold-700/30 bg-ink-900/40">
            <span className="text-5xl text-gold-500/40 font-display">✦</span>
            <p className="mt-6 font-serif italic text-xl text-stone-300/80">
              Em breve, novos eventos serão anunciados.
            </p>
            <p className="mt-2 text-sm text-stone-400">
              Aguarde — Deus está preparando algo poderoso.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventos.map((ev, i) => (
              <EventoCard key={ev.id} evento={ev} idx={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
