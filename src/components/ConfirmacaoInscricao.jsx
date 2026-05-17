import { useLocation, useNavigate } from 'react-router-dom'

export default function ConfirmacaoInscricao() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const eventoNome = state?.eventoNome || 'evento'

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="anim-fade-up">
        <div className="mx-auto mb-8 w-24 h-24 rounded-full border-2 border-emerald-500/60 bg-emerald-900/20 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(52,211,153,0.15)]">
          🙏
        </div>
        <span className="text-[10px] font-display tracking-[0.4em] uppercase text-gold-500/80">Ministério Cura e Avivamento</span>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl text-gold-grad">Inscrição Realizada!</h1>
        <div className="mt-8 divider-ornament max-w-xs mx-auto">
          <span className="text-gold-500/70 text-xl font-display">✦</span>
        </div>
        <p className="mt-6 font-serif italic text-xl text-stone-200/90 leading-relaxed">Que Deus te abençoe imensamente!</p>
        <p className="mt-3 text-stone-300/80 leading-relaxed">
          Sua inscrição para <span className="text-gold-300 font-medium">{eventoNome}</span> foi registrada com sucesso. Aguarde mais informações.
        </p>
        <p className="mt-6 font-serif italic text-stone-400 text-sm">
          "Vinde a mim, todos os que estais cansados e oprimidos,<br />e eu vos aliviarei." — Mateus 11:28
        </p>
        <div className="mt-10">
          <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full border border-gold-500/40 text-gold-200 hover:bg-gold-500/10 text-xs tracking-widest uppercase font-display transition">
            ← Ver outros eventos
          </button>
        </div>
      </div>
    </div>
  )
}
