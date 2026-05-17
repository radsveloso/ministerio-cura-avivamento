// Admin Dashboard — overview stats + event grid.

function Sidebar({ active, user, onLogout }) {
  const items = [
    { id: 'home',     icon: 'home',     label: 'Visão geral', go: '/dashboard' },
    { id: 'events',   icon: 'calendar', label: 'Eventos',     go: '/dashboard' },
    { id: 'stats',    icon: 'chart',    label: 'Analytics',   go: '/dashboard?tab=stats' },
    { id: 'settings', icon: 'settings', label: 'Configurações', go: '/dashboard?tab=settings' },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <LogoMark size={42} />
        <div>
          <div className="font-script" style={{ fontSize: 18, color: '#FF5BA8', lineHeight: 1, marginBottom: -2 }}>Cura & Avivamento</div>
          <div className="name">MINISTÉRIO CURA E AVIVAMENTO</div>
          <div className="sub" style={{ marginTop: 2 }}>Console v1.0</div>
        </div>
      </div>

      <div className="eyebrow" style={{ padding: '8px 14px 6px' }}>Menu</div>
      {items.map(it => (
        <div key={it.id} className={`nav-item ${it.id === active ? 'active' : ''}`} onClick={() => navigate(it.go)}>
          <Icon name={it.icon} size={16} />
          {it.label}
        </div>
      ))}

      <div className="divider" />
      <div className="eyebrow" style={{ padding: '4px 14px 6px' }}>Atalhos</div>
      <div className="nav-item" onClick={() => navigate('/new')}>
        <Icon name="plus" size={16} />
        Novo evento
      </div>
      <div className="nav-item" onClick={() => { if (confirm('Restaurar dados de exemplo?')) { resetStore(); toast('Dados restaurados'); }}}>
        <Icon name="sparkle" size={16} />
        Reiniciar dados
      </div>

      <div className="sidebar-user">
        <div className="avatar">{(user?.name || 'A').slice(0, 1)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--txt-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
        </div>
        <button className="icon-btn" title="Sair" onClick={onLogout}>
          <Icon name="logout" size={14} />
        </button>
      </div>
    </aside>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card">
      <div className="stat">
        <div className="label">{label}</div>
        <div className="value" style={accent ? { backgroundImage: accent, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : null}>{value}</div>
        {sub && <div className="delta">{sub}</div>}
      </div>
    </div>
  );
}

function EventCard({ event, responses, onClick }) {
  const status = eventStatus(event);
  const theme = THEMES.find(t => t.id === event.theme) || THEMES[0];
  const fill = event.expectedCount ? Math.min(100, Math.round(responses.length / event.expectedCount * 100)) : 0;
  return (
    <div className={`event-card theme-${event.theme}`} onClick={onClick}>
      <div className="banner" style={{ background: theme.grad }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right, rgba(0,0,0,0.5), transparent 60%)' }}></div>
        <div className="banner-content">
          <div>
            <div className="font-script" style={{ fontSize: 22, color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>{event.tagline || 'Ministério Cura e Avivamento'}</div>
            <h3 style={{ color: 'white' }}>{event.name}</h3>
          </div>
          <span className={`chip ${status}`}><span className="dot"></span>{statusLabel(status)}</span>
        </div>
      </div>
      <div className="body">
        <div className="meta">
          <span><Icon name="calendar" size={12} /> {fmtDateShort(event.startAt)} → {fmtDateShort(event.endAt)}</span>
        </div>
        <div className="meta" style={{ fontSize: 12, color: 'var(--txt-2)' }}>
          <Icon name="users" size={12} /> {responses.length} ficha{responses.length === 1 ? '' : 's'} de saúde {event.expectedCount ? `· meta ${event.expectedCount}` : ''}
        </div>
        {event.expectedCount > 0 && (
          <>
            <div className="progress"><div style={{ width: fill + '%' }}></div></div>
            <div className="progress-meta">
              <span>{fill}% preenchido</span>
              <span>{Math.max(0, event.expectedCount - responses.length)} vagas</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardScreen({ data, actions, user, onLogout }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = data.events.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== 'all' && eventStatus(e) !== filter) return false;
    return true;
  });

  const totalResp = data.responses.length;
  const liveCount = data.events.filter(e => eventStatus(e) === 'live').length;
  const last7 = data.responses.filter(r => Date.now() - new Date(r.submittedAt).getTime() < 7 * 86400000).length;
  const totalExpected = data.events.filter(e => eventStatus(e) !== 'ended').reduce((a, e) => a + (e.expectedCount || 0), 0);

  return (
    <div className="app shell">
      <Ambient />
      <Sidebar active="home" user={user} onLogout={onLogout} />

      <main className="main">
        <div className="topbar">
          <div>
            <div className="eyebrow">Painel</div>
            <h1>Bem-vinda, {user?.name?.split(' ').slice(-1)[0] || 'Profeta'}.</h1>
            <div className="sub">A casa está em movimento. Hoje é {fmtDate(new Date())}.</div>
          </div>
          <div className="row">
            <button className="btn" onClick={() => navigate('/new')}><Icon name="plus" size={14}/>Importar template</button>
            <button className="btn primary" onClick={() => navigate('/new')}><Icon name="sparkle" size={14}/>Criar evento</button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatCard label="Eventos ativos" value={liveCount} sub={`${data.events.length} no total`} />
          <StatCard label="Fichas de saúde" value={totalResp} sub={`+${last7} nos últimos 7 dias`} accent="var(--grad-prophet)" />
          <StatCard label="Previsão de público" value={totalExpected.toLocaleString('pt-BR')} sub="vagas abertas" />
          <StatCard label="Taxa média" value={totalExpected ? Math.round(totalResp / totalExpected * 100) + '%' : '—'} sub="preenchimento global" accent="var(--grad-fire)" />
        </div>

        {/* Filters */}
        <div className="topbar" style={{ marginBottom: 18 }}>
          <div className="row gap-md">
            <div className="tabs">
              {[['all','Todos'],['live','Recebendo'],['scheduled','Agendados'],['ended','Encerrados']].map(([id, l]) => (
                <div key={id} className={`tab ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>{l}</div>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <Icon name="search" size={14} color="var(--txt-3)" />
              <input
                className="input" placeholder="Buscar evento…" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 38, width: 240 }}
              />
              <div style={{ position: 'absolute', left: 14, top: 13, pointerEvents: 'none' }}>
                <Icon name="search" size={14} color="var(--txt-3)" />
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="em-icon">🦅</div>
            <div style={{ fontSize: 16, color: 'var(--txt-2)', marginBottom: 8 }}>Nenhum evento por aqui ainda.</div>
            <div style={{ fontSize: 13, marginBottom: 18 }}>Crie o primeiro formulário de liberação e gere o link para os participantes.</div>
            <button className="btn primary" onClick={() => navigate('/new')}><Icon name="plus" size={14}/>Criar primeiro evento</button>
          </div>
        ) : (
          <div className="event-grid">
            {filtered.map(ev => (
              <EventCard
                key={ev.id} event={ev}
                responses={data.responses.filter(r => r.eventId === ev.id)}
                onClick={() => navigate('/event/' + ev.id)}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: 40, padding: 24, borderRadius: 22, border: '1px solid var(--line)', background: 'linear-gradient(135deg, rgba(255,46,138,0.06), rgba(61,139,255,0.04))' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="eyebrow">Dica do dia</div>
              <div style={{ fontSize: 18, fontFamily: 'Cinzel, serif', marginTop: 6 }}>Compartilhe o link do evento como um QR Code impresso na sede.</div>
              <div style={{ fontSize: 13, color: 'var(--txt-2)', marginTop: 4 }}>Cada evento gera link único e QR pronto para impressão. Disponível na página do evento.</div>
            </div>
            <DNAStrand width={240} height={50} opacity={0.5} />
          </div>
        </div>
      </main>
      <ToastStack />
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
window.Sidebar = Sidebar;
