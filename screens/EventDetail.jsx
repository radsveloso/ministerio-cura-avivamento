// Event detail — link sharing, stats, response list, exports.

function EventDetailScreen({ data, actions, user, onLogout, eventId }) {
  const event = data.events.find(e => e.id === eventId);
  const responses = data.responses.filter(r => r.eventId === eventId);
  const [tab, setTab] = useState('overview');
  const [confirmDel, setConfirmDel] = useState(null);

  if (!event) {
    return (
      <div className="app shell">
        <Ambient/>
        <Sidebar active="events" user={user} onLogout={onLogout}/>
        <main className="main">
          <div className="empty">Evento não encontrado. <a href="#/dashboard" style={{ color: 'var(--magenta-2)' }}>Voltar</a></div>
        </main>
      </div>
    );
  }

  const status = eventStatus(event);
  const theme = THEMES.find(t => t.id === event.theme) || THEMES[0];
  const fill = event.expectedCount ? Math.min(100, Math.round(responses.length / event.expectedCount * 100)) : 0;
  const publicUrl = `${location.origin}${location.pathname}#/i/${event.slug || event.id}`;

  const last7 = responses.filter(r => Date.now() - new Date(r.submittedAt).getTime() < 7 * 86400000).length;
  const today = responses.filter(r => Date.now() - new Date(r.submittedAt).getTime() < 86400000).length;
  const avgAge = responses.length ? Math.round(responses.reduce((a, r) => a + Number(r.answers.idade || 0), 0) / responses.length) : 0;

  // Histogram of submissions by day for sparkline
  const days = 14;
  const dayBuckets = Array(days).fill(0);
  for (const r of responses) {
    const d = Math.floor((Date.now() - new Date(r.submittedAt).getTime()) / 86400000);
    if (d >= 0 && d < days) dayBuckets[days - 1 - d]++;
  }
  const maxBucket = Math.max(1, ...dayBuckets);

  return (
    <div className="app shell">
      <Ambient/>
      <Sidebar active="events" user={user} onLogout={onLogout}/>
      <main className="main">
        <div className="topbar">
          <div>
            <div className="eyebrow" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>← Eventos</div>
            <div className="row gap-md" style={{ marginTop: 4 }}>
              <h1>{event.name}</h1>
              <span className={`chip ${status}`}><span className="dot"></span>{statusLabel(status)}</span>
            </div>
            <div className="sub">{event.tagline} · {event.venue}</div>
          </div>
          <div className="row">
            <button className="btn" onClick={() => navigate('/i/' + (event.slug || event.id))}><Icon name="eye" size={14}/>Ver como participante</button>
            <button className="btn" onClick={() => navigate('/edit/' + event.id)}><Icon name="edit" size={14}/>Editar</button>
            <button className="btn primary" onClick={() => exportEventXLSX(event, responses)}>
              <Icon name="download" size={14}/>Exportar Excel
            </button>
          </div>
        </div>

        {/* Hero with link + stats ring */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, marginBottom: 22 }}>
          <div className="card glow" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: theme.grad, padding: '28px 28px 22px', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right, rgba(0,0,0,0.35), transparent 60%)' }}/>
              <div style={{ position: 'relative' }}>
                <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Link da ficha de saúde</div>
                <div className="link-box" style={{ marginTop: 10, background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                  <Icon name="link" size={14}/>
                  <span className="url" style={{ color: 'white' }}>{publicUrl}</span>
                  <button className="btn sm" onClick={() => copyText(publicUrl)} style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Icon name="copy" size={12}/>Copiar
                  </button>
                </div>
                <div className="row" style={{ marginTop: 12, gap: 10 }}>
                  <button className="btn sm" onClick={() => navigate('/i/' + (event.slug || event.id))} style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}>
                    <Icon name="eye" size={12}/>Abrir página
                  </button>
                  <button className="btn sm" onClick={() => { showQR(publicUrl, event.name); }} style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}>
                    <Icon name="qr" size={12}/>QR Code
                  </button>
                  <button className="btn sm" onClick={() => copyText(`Olá! A ficha de saúde do evento já está aberta: ${event.name}. Preencha aqui: ${publicUrl}`)} style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}>
                    <Icon name="sparkle" size={12}/>Texto pronto p/ WhatsApp
                  </button>
                </div>
              </div>
            </div>
            <div style={{ padding: 22, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div className="stat">
                <div className="label">Fichas preenchidas</div>
                <div className="value">{responses.length}</div>
                <div className="delta">+{today} hoje · +{last7} em 7 dias</div>
              </div>
              <div className="stat">
                <div className="label">Meta</div>
                <div className="value">{event.expectedCount || 0}</div>
                <div className="delta">{Math.max(0, (event.expectedCount || 0) - responses.length)} vagas restantes</div>
              </div>
              <div className="stat">
                <div className="label">Idade média</div>
                <div className="value">{avgAge || '—'}</div>
                <div className="delta">anos</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="ring" style={{ '--p': fill }}>
              <div className="ring-inner">
                <div className="pct">{fill}%</div>
                <div className="lbl">Preenchido</div>
              </div>
            </div>
            <div style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: 'var(--txt-2)' }}>
              {responses.length} de {event.expectedCount || 0} esperados
            </div>
          </div>
        </div>

        {/* Trend sparkline */}
        <div className="card" style={{ marginBottom: 22, padding: 22 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div className="eyebrow">Fichas · 14 dias</div>
              <div style={{ fontSize: 16, fontFamily: 'Cinzel, serif', marginTop: 4 }}>Onda de preenchimento</div>
            </div>
            <div className="row gap-sm">
              <span className="chip" style={{ color: 'var(--magenta-2)' }}><span className="dot"></span>Fichas por dia</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
            {dayBuckets.map((v, i) => (
              <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%',
                  height: (v / maxBucket * 100) + '%',
                  minHeight: v > 0 ? 4 : 0,
                  background: v > 0 ? 'var(--grad-prophet)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '4px 4px 0 0',
                  boxShadow: v === maxBucket ? '0 0 12px rgba(255,46,138,0.6)' : 'none',
                  transition: 'all .4s ease',
                }} title={`${v} ficha(s)`}></div>
                <div style={{ fontSize: 9, color: 'var(--txt-3)', fontFamily: 'JetBrains Mono, monospace' }}>{(days - 1 - i)}d</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="row" style={{ marginBottom: 14, justifyContent: 'space-between' }}>
          <div className="tabs">
            {[['overview', 'Visão geral'], ['responses', `Respostas · ${responses.length}`], ['form', 'Formulário'], ['settings', 'Detalhes']].map(([id, l]) => (
              <div key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{l}</div>
            ))}
          </div>
          {tab === 'responses' && (
            <button className="btn fire" onClick={() => exportEventXLSX(event, responses)} disabled={!responses.length}>
              <Icon name="excel" size={14}/>Exportar todas (Excel)
            </button>
          )}
        </div>

        {tab === 'overview' && (
          <OverviewTab event={event} responses={responses} />
        )}

        {tab === 'responses' && (
          <ResponsesTable event={event} responses={responses} onDelete={(id) => setConfirmDel(id)} />
        )}

        {tab === 'form' && (
          <div className="card" style={{ padding: 24 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div className="eyebrow">Formulário em vigor</div>
                <div style={{ fontSize: 16, fontFamily: 'Cinzel, serif', marginTop: 4 }}>{event.questions.filter(q => q.type !== 'section').length} perguntas</div>
              </div>
              <button className="btn" onClick={() => navigate('/edit/' + event.id)}><Icon name="edit" size={14}/>Editar perguntas</button>
            </div>
            <div className="col gap-sm">
              {event.questions.map(q => (
                <div key={q.id} className={`q-item ${q.type === 'section' ? 'section' : ''}`}>
                  <div className="q-label">{q.label}</div>
                  <span className="q-type">{Q_TYPES[q.type]?.label}</span>
                  {q.required && <span style={{ color: 'var(--magenta-2)', fontSize: 11 }}>obrigatória</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <KV label="Nome" value={event.name}/>
              <KV label="Tagline" value={event.tagline || '—'}/>
              <KV label="Local" value={event.venue || '—'}/>
              <KV label="Slug" value={event.slug || event.id}/>
              <KV label="Início" value={fmtDate(event.startAt, true)}/>
              <KV label="Fim" value={fmtDate(event.endAt, true)}/>
              <KV label="Previsão" value={event.expectedCount}/>
              <KV label="Criado" value={fmtDate(event.createdAt, true)}/>
            </div>
            {event.description && (
              <>
                <div className="divider"/>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Descrição</div>
                <div style={{ fontSize: 14, color: 'var(--txt-2)', lineHeight: 1.6 }}>{event.description}</div>
              </>
            )}
            <div className="divider"/>
            <div className="row" style={{ justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn danger" onClick={() => setConfirmDel('event')}>
                <Icon name="trash" size={14}/>Excluir evento
              </button>
            </div>
          </div>
        )}

        <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)}
          title={confirmDel === 'event' ? 'Excluir evento?' : 'Excluir ficha?'}
          actions={
            <>
              <button className="btn ghost" onClick={() => setConfirmDel(null)}>Cancelar</button>
              <button className="btn danger" onClick={() => {
                if (confirmDel === 'event') {
                  actions.deleteEvent(event.id);
                  toast('Evento excluído');
                  navigate('/dashboard');
                } else {
                  actions.deleteResponse(confirmDel);
                  toast('Ficha excluída');
                  setConfirmDel(null);
                }
              }}>Sim, excluir</button>
            </>
          }>
          <p>
            {confirmDel === 'event'
              ? 'Esta ação remove o evento e todas as fichas de saúde. Não há como desfazer.'
              : 'Esta ficha será removida permanentemente.'}
          </p>
        </Modal>
      </main>
      <ToastStack/>
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}

// QR display modal (lazy injects a simple SVG QR using a public lib via inline canvas — but we'll just use a remote service for simplicity)
function showQR(url, name) {
  const win = document.createElement('div');
  win.className = 'modal-stage';
  win.innerHTML = `
    <div class="modal" style="text-align:center;">
      <h3>QR Code · ${name}</h3>
      <p style="margin-bottom:16px;">Imprima e cole na sede. Cada scan abre o formulário da ficha de saúde.</p>
      <div style="background:white;padding:18px;border-radius:14px;display:inline-block;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(url)}&color=08081A&bgcolor=FFFFFF" width="260" height="260" />
      </div>
      <div class="font-mono" style="font-size:11px;color:var(--txt-3);margin-top:14px;">${url}</div>
      <div class="modal-actions" style="margin-top:22px;">
        <button class="btn ghost" id="qr-close">Fechar</button>
        <button class="btn primary" id="qr-copy">Copiar link</button>
      </div>
    </div>
  `;
  win.addEventListener('click', (e) => { if (e.target === win) win.remove(); });
  document.body.appendChild(win);
  win.querySelector('#qr-close').addEventListener('click', () => win.remove());
  win.querySelector('#qr-copy').addEventListener('click', () => {
    navigator.clipboard?.writeText(url);
    toast('Link copiado', { icon: 'check' });
  });
}

function OverviewTab({ event, responses }) {
  // Quick demographic breakdowns
  const cityCount = {};
  const ageRanges = { '15-19': 0, '20-29': 0, '30-39': 0, '40+': 0 };
  const flags = { alergias: 0, medic: 0, restricoes: 0, hipertensao: 0, diabetes: 0 };
  for (const r of responses) {
    const c = r.answers.cidade || '—';
    cityCount[c] = (cityCount[c] || 0) + 1;
    const age = Number(r.answers.idade || 0);
    if (age < 20) ageRanges['15-19']++;
    else if (age < 30) ageRanges['20-29']++;
    else if (age < 40) ageRanges['30-39']++;
    else ageRanges['40+']++;
    if (r.answers.alergia_b === 'Sim') flags.alergias++;
    if (r.answers.medic_b === 'Sim') flags.medic++;
    if (r.answers.rest_b === 'Sim') flags.restricoes++;
    if (r.answers.hipertensao === 'Sim') flags.hipertensao++;
    if (r.answers.diabetes === 'Sim') flags.diabetes++;
  }
  const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCity = Math.max(1, ...topCities.map(x => x[1]));
  const ageMax = Math.max(1, ...Object.values(ageRanges));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <div className="card" style={{ padding: 22 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Cidades</div>
        <div className="col gap-sm">
          {topCities.length === 0 && <div className="muted">Sem dados ainda.</div>}
          {topCities.map(([city, n]) => (
            <div key={city}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <span>{city}</span><span className="font-mono muted">{n}</span>
              </div>
              <div className="progress" style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: (n / maxCity * 100) + '%', height: '100%', background: 'var(--grad-prophet)', borderRadius: 999 }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Faixa etária</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 140 }}>
          {Object.entries(ageRanges).map(([k, n]) => (
            <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--txt-2)' }}>{n}</div>
              <div style={{
                width: '100%',
                height: (n / ageMax * 100) + '%',
                minHeight: n > 0 ? 4 : 0,
                background: 'var(--grad-fire)',
                borderRadius: '6px 6px 0 0',
              }}></div>
              <div style={{ fontSize: 11, color: 'var(--txt-3)', letterSpacing: '0.08em' }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22, gridColumn: '1 / -1' }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Alertas de saúde · para a equipe de cuidado</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            ['Alergias',     flags.alergias,     'var(--magenta)'],
            ['Medicação',    flags.medic,        'var(--orange)'],
            ['Restrições',   flags.restricoes,   'var(--purple)'],
            ['Hipertensão',  flags.hipertensao,  'var(--blue)'],
            ['Diabetes',     flags.diabetes,     'var(--magenta-2)'],
          ].map(([l, n, c]) => (
            <div key={l} style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)' }}>
              <div className="eyebrow">{l}</div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, marginTop: 6, color: c }}>{n}</div>
              <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>
                {responses.length ? Math.round(n / responses.length * 100) : 0}% dos inscritos
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResponsesTable({ event, responses, onDelete }) {
  const [search, setSearch] = useState('');
  const sorted = useMemo(() => [...responses].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)), [responses]);
  const filtered = sorted.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (r.answers.nome || '').toLowerCase().includes(s)
      || (r.answers.email || '').toLowerCase().includes(s)
      || (r.answers.cidade || '').toLowerCase().includes(s);
  });

  if (responses.length === 0) {
    return (
      <div className="empty">
        <div className="em-icon">📜</div>
        <div style={{ fontSize: 16, color: 'var(--txt-2)' }}>Ainda não há fichas preenchidas.</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Compartilhe o link acima — as fichas chegam em tempo real.</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="row" style={{ padding: '16px 18px', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
        <input className="input" placeholder="Buscar por nome, e-mail, cidade…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
        <div className="row gap-sm">
          <span className="muted" style={{ fontSize: 12 }}>{filtered.length} de {responses.length}</span>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Participante</th>
            <th>Idade</th>
            <th>Cidade</th>
            <th>Contato</th>
            <th>Enviado</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id} onClick={() => navigate('/response/' + r.id)}>
              <td>
                <div style={{ fontWeight: 600 }}>{r.answers.nome}</div>
                <div className="num">{r.answers.email}</div>
              </td>
              <td className="num">{r.answers.idade}</td>
              <td>{r.answers.cidade}</td>
              <td className="num">{r.answers.tel1}</td>
              <td>
                <div>{fmtDateShort(r.submittedAt)}</div>
                <div className="num" style={{ fontSize: 11 }}>{timeAgo(r.submittedAt)} atrás</div>
              </td>
              <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                <div className="row" style={{ justifyContent: 'flex-end', gap: 6 }}>
                  <button className="icon-btn" title="Ver" onClick={() => navigate('/response/' + r.id)}><Icon name="eye" size={14}/></button>
                  <button className="icon-btn" title="PDF" onClick={() => exportResponsePDF(event, r)}><Icon name="pdf" size={14}/></button>
                  <button className="icon-btn" title="Excluir" onClick={() => onDelete(r.id)}><Icon name="trash" size={14}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { EventDetailScreen });
