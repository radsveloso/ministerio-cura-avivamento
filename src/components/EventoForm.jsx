import { useEffect, useState } from 'react'

const VAZIO = { nome: '', data: '', local: '', descricao: '', vagas: '' }

export default function EventoForm({ inicial, onSalvar, onCancelar }) {
  const [form, setForm] = useState(VAZIO)

  useEffect(() => {
    setForm(inicial ? { ...VAZIO, ...inicial, vagas: inicial.vagas ?? '' } : VAZIO)
  }, [inicial])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    onSalvar({
      ...form,
      vagas: form.vagas === '' ? null : Number(form.vagas),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-ink-950/85 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="relative w-full max-w-2xl rounded-2xl border border-gold-700/40 bg-ink-900 shadow-gold-glow overflow-hidden anim-fade-up"
      >
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

        <div className="px-7 py-6 border-b border-gold-700/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/80">
              {inicial?.id ? 'Editar' : 'Novo'}
            </span>
            <h2 className="font-display text-2xl text-gold-grad">
              {inicial?.id ? 'Editar Evento' : 'Novo Evento'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="text-gold-500/70 hover:text-gold-200 text-2xl leading-none px-2"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="px-7 py-6 grid gap-5 max-h-[70vh] overflow-y-auto">
          <Campo label="Nome do evento" required>
            <input
              type="text"
              value={form.nome}
              onChange={set('nome')}
              required
              maxLength={120}
              className={ESTILO_INPUT}
              placeholder="Encontro de Cura e Libertação"
            />
          </Campo>

          <div className="grid sm:grid-cols-2 gap-5">
            <Campo label="Data" required>
              <input
                type="date"
                value={form.data}
                onChange={set('data')}
                required
                className={ESTILO_INPUT}
              />
            </Campo>
            <Campo label="Vagas (opcional)">
              <input
                type="number"
                min="1"
                value={form.vagas}
                onChange={set('vagas')}
                className={ESTILO_INPUT}
                placeholder="Deixe vazio = livre"
              />
            </Campo>
          </div>

          <Campo label="Local">
            <input
              type="text"
              value={form.local}
              onChange={set('local')}
              className={ESTILO_INPUT}
              placeholder="Templo Sede — Rua das Águas, 123"
            />
          </Campo>

          <Campo label="Descrição">
            <textarea
              value={form.descricao}
              onChange={set('descricao')}
              rows={4}
              className={ESTILO_INPUT + ' resize-y'}
              placeholder="Uma noite poderosa de adoração, palavra e ministração."
            />
          </Campo>
        </div>

        <div className="px-7 py-5 border-t border-gold-700/20 flex items-center justify-end gap-3 bg-ink-950/60">
          <button
            type="button"
            onClick={onCancelar}
            className="px-5 py-2.5 rounded-full border border-gold-700/40 text-gold-200/80 hover:border-gold-500 hover:text-gold-100 transition text-xs tracking-widest uppercase font-display"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-gold-gradient text-ink-950 text-xs font-semibold tracking-widest uppercase shadow-gold-soft hover:shadow-gold-glow transition"
          >
            {inicial?.id ? 'Salvar Alterações' : 'Criar Evento'}
          </button>
        </div>
      </form>
    </div>
  )
}

const ESTILO_INPUT =
  'w-full px-4 py-3 rounded-lg bg-ink-950/80 border border-gold-700/30 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 text-stone-100 placeholder:text-stone-500'

function Campo({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/80 mb-2">
        {label}
        {required && <span className="text-gold-400 ml-1">*</span>}
      </span>
      {children}
    </label>
  )
}
