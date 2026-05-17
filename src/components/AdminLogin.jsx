import { useState } from 'react'
import { useAuth } from '../App'

export default function AdminLogin() {
  const { login } = useAuth()
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [mostrar, setMostrar] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setErro('')
    if (!login(senha)) {
      setErro('Senha incorreta. Verifique e tente novamente.')
      setSenha('')
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="anim-fade-up text-center mb-10">
        <span className="text-4xl text-gold-grad font-display">✦</span>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl text-gold-grad">Área Restrita</h1>
        <p className="mt-3 font-serif italic text-stone-300/80 text-lg">
          Acesso reservado à liderança ministerial
        </p>
      </div>

      <form
        onSubmit={submit}
        className="anim-fade-up anim-delay-1 relative rounded-2xl border border-gold-700/30 bg-ink-900/70 shadow-gold-soft p-7 sm:p-8"
      >
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

        <label className="block">
          <span className="block text-[10px] font-display tracking-[0.3em] uppercase text-gold-500/90">
            Senha de Acesso
          </span>
          <div className="mt-3 relative">
            <input
              type={mostrar ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoFocus
              required
              className="w-full px-4 py-3 pr-12 rounded-lg bg-ink-950/80 border border-gold-700/40 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 text-gold-100 font-mono tracking-widest"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setMostrar((m) => !m)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500/70 hover:text-gold-300 text-xs uppercase tracking-widest"
            >
              {mostrar ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </label>

        {erro && (
          <p className="mt-4 text-sm text-red-300 bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 w-full py-3 rounded-full bg-gold-gradient text-ink-950 font-semibold tracking-widest uppercase text-xs shadow-gold-soft hover:shadow-gold-glow transition"
        >
          Entrar no Painel
        </button>
      </form>
    </div>
  )
}
