// Admin login screen — cinematic, com o leão e a aurora.

const ADMIN_PASS = 'cura2025';

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('admin@cura-avivamento.com.br');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const submit = (e) => {
    e?.preventDefault();
    setErro('');
    if (!email || !pwd) { toast('Preencha e-mail e senha'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pwd === ADMIN_PASS) {
        onLogin();
      } else {
        setErro('Senha inválida. Acesso restrito à liderança.');
        toast('Senha inválida', { kind: 'error' });
      }
    }, 600);
  };

  return (
    <div className="login-stage">
      <Ambient dna />

      {/* DNA decoration top */}
      <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
        <DNAStrand width={420} height={50} opacity={0.18} />
      </div>

      <div className="login-card">
        <div className="login-logo-ring">
          <img src="assets/logo-lion.jpeg" alt="Ministério Cura e Avivamento" />
        </div>

        <div className="font-script" style={{ fontSize: 38, color: '#FF5BA8', lineHeight: 1, marginBottom: -4 }}>Cura &amp; Avivamento</div>
        <div className="font-display" style={{ fontSize: 14, letterSpacing: '0.22em', fontWeight: 600, marginBottom: 8 }}>MINISTÉRIO CURA E AVIVAMENTO</div>
        <div className="eyebrow" style={{ marginBottom: 28 }}>CURA · AVIVAMENTO · LIBERAÇÃO</div>

        <form onSubmit={submit} style={{ textAlign: 'left' }}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>E-mail do administrador</label>
            <input className="input lg" type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Senha</label>
            <input className="input lg" type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Senha de acesso" />
          </div>
          {erro && (
            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(255,46,138,0.10)', border: '1px solid rgba(255,46,138,0.35)', color: '#FF5BA8', fontSize: 12, letterSpacing: '0.04em' }}>
              {erro}
            </div>
          )}
          <button type="submit" className="btn primary lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar na Plataforma'}
            <Icon name="arrow" size={16} />
          </button>
        </form>

        <div style={{ marginTop: 22, fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>
          Acesso restrito · Liderança · v1.0
        </div>
      </div>

      {/* Footer scripture-like accent */}
      <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center', zIndex: 2 }}>
        <div className="font-script" style={{ fontSize: 22, color: 'rgba(255,255,255,0.35)' }}>
          "Pelas suas pisaduras fomos sarados."
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.32em', color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>ISAÍAS 53 : 5</div>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
