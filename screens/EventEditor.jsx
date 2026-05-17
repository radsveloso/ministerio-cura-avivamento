// Create / edit event — name, dates, theme, expected count, customizable questions.

function EventEditorScreen({ data, actions, user, onLogout, editId }) {
  const existing = editId ? data.events.find(e => e.id === editId) : null;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => existing || ({
    name: '',
    tagline: '',
    venue: '',
    description: '',
    startAt: '',
    endAt: '',
    expectedCount: 100,
    theme: 'prophet',
    slug: '',
    questions: DEFAULT_QUESTIONS,
  }));

  const upd = (patch) => setForm(f => ({ ...f, ...patch }));

  const canSave = form.name && form.startAt && form.endAt;
  const slugAuto = useMemo(() => form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), [form.name, form.slug]);

  const save = () => {
    if (!canSave) { toast('Preencha nome e datas'); return; }
    const payload = { ...form, slug: slugAuto };
    if (editId) {
      actions.updateEvent(editId, payload);
      toast('Evento atualizado');
      navigate('/event/' + editId);
    } else {
      const ev = actions.createEvent(payload);
      toast('Evento criado · link pronto', { icon: 'check' });
      navigate('/event/' + ev.id);
    }
  };

  return (
    <div className="app shell">
      <Ambient />
      <Sidebar active="events" user={user} onLogout={onLogout} />
      <main className="main">
        <div className="topbar">
          <div>
            <div className="eyebrow" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>← Eventos</div>
            <h1>{editId ? 'Editar evento' : 'Criar novo evento'}</h1>
            <div className="sub">Configure as perguntas de saúde, datas e visual. Gere o link único para o participante preencher e assinar.</div>
          </div>
          <div className="row">
            <button className="btn ghost" onClick={() => navigate('/dashboard')}>Cancelar</button>
            <button className="btn primary" onClick={save} disabled={!canSave}>
              <Icon name="check" size={14}/>{editId ? 'Salvar alterações' : 'Criar evento'}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="row" style={{ marginBottom: 22, gap: 8 }}>
          {[
            [1, 'Identidade'],
            [2, 'Datas & público'],
            [3, 'Formulário'],
            [4, 'Visual'],
          ].map(([n, l]) => (
            <div key={n} onClick={() => setStep(n)} style={{
              cursor: 'pointer',
              padding: '10px 16px', borderRadius: 999, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
              border: '1px solid ' + (step === n ? 'transparent' : 'var(--line)'),
              background: step === n ? 'var(--grad-prophet)' : 'transparent',
              color: step === n ? 'white' : 'var(--txt-2)',
              fontWeight: step === n ? 600 : 400,
            }}>
              <span style={{ opacity: 0.6, marginRight: 8 }}>0{n}</span>{l}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* LEFT: form */}
          <div className="card solid" style={{ padding: 28 }}>
            {step === 1 && (
              <div className="col gap-md">
                <div className="field">
                  <label>Nome do evento</label>
                  <input className="input lg" placeholder="Ex.: Escola do Avivamento 2026" value={form.name} onChange={e => upd({ name: e.target.value })} />
                </div>
                <div className="field">
                  <label>Frase de impacto (tagline)</label>
                  <input className="input" placeholder="Ex.: A Geração que Profetiza" value={form.tagline} onChange={e => upd({ tagline: e.target.value })} />
                </div>
                <div className="field">
                  <label>Local</label>
                  <input className="input" placeholder="Sede Ministério Cura e Avivamento — Goiânia/GO" value={form.venue} onChange={e => upd({ venue: e.target.value })} />
                </div>
                <div className="field">
                  <label>Descrição (aparece para o participante)</label>
                  <textarea className="textarea" rows={4} placeholder="Sete dias de imersão profética…" value={form.description} onChange={e => upd({ description: e.target.value })} />
                </div>
                <div className="field">
                  <label>URL personalizada</label>
                  <div className="row" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line-2)', borderRadius: 12, padding: '4px 4px 4px 14px' }}>
                    <span className="font-mono" style={{ color: 'var(--txt-3)', fontSize: 12 }}>cura-avivamento.com/i/</span>
                    <input className="input" style={{ background: 'transparent', border: 'none', padding: '12px 8px' }} value={form.slug || slugAuto} onChange={e => upd({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="col gap-md">
                <div className="row gap-md">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Abertura para preenchimento</label>
                    <input className="input lg" type="datetime-local" value={form.startAt.slice(0,16)} onChange={e => upd({ startAt: new Date(e.target.value).toISOString() })} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Encerramento</label>
                    <input className="input lg" type="datetime-local" value={form.endAt.slice(0,16)} onChange={e => upd({ endAt: new Date(e.target.value).toISOString() })} />
                  </div>
                </div>
                <div className="field">
                  <label>Previsão de participantes</label>
                  <div className="row gap-md">
                    <input className="input lg" type="number" min="0" value={form.expectedCount} onChange={e => upd({ expectedCount: Number(e.target.value) || 0 })} style={{ width: 160 }} />
                    <span style={{ color: 'var(--txt-3)', fontSize: 13 }}>Usado para calcular a % de preenchimento e vagas restantes.</span>
                  </div>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: 'rgba(61,139,255,0.06)', border: '1px solid rgba(61,139,255,0.18)' }}>
                  <div className="eyebrow" style={{ color: 'var(--blue-2)' }}><Icon name="clock" size={12}/> Janela de preenchimento</div>
                  <div style={{ fontSize: 14, marginTop: 6 }}>
                    {form.startAt && form.endAt ?
                      `${fmtDate(form.startAt, true)} → ${fmtDate(form.endAt, true)}`
                      : 'Defina início e fim para abrir o preenchimento.'}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <QuestionEditor questions={form.questions} onChange={qs => upd({ questions: qs })} />
            )}

            {step === 4 && (
              <ThemePicker theme={form.theme} onChange={t => upd({ theme: t })} />
            )}

            <div className="divider" />
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <button className="btn" disabled={step === 1} onClick={() => setStep(step - 1)}><Icon name="arrowL" size={14}/>Voltar</button>
              {step < 4 ? (
                <button className="btn primary" onClick={() => setStep(step + 1)}>Próximo<Icon name="arrow" size={14}/></button>
              ) : (
                <button className="btn primary" onClick={save} disabled={!canSave}><Icon name="check" size={14}/>{editId ? 'Salvar' : 'Criar evento'}</button>
              )}
            </div>
          </div>

          {/* RIGHT: live preview */}
          <div style={{ position: 'sticky', top: 36 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Pré-visualização</div>
            <EventPreview event={{ ...form, slug: slugAuto }} />
          </div>
        </div>
      </main>
      <ToastStack />
    </div>
  );
}

function EventPreview({ event }) {
  const theme = THEMES.find(t => t.id === event.theme) || THEMES[0];
  return (
    <div style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid var(--line-2)', background: 'var(--ink-2)' }}>
      <div style={{ background: theme.grad, padding: 28, position: 'relative', minHeight: 200 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.25), transparent 60%)' }}></div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div className="font-script" style={{ fontSize: 34, color: 'rgba(255,255,255,0.95)', lineHeight: 1 }}>{event.tagline || 'Cura & Avivamento'}</div>
          <div className="font-display" style={{ fontSize: 20, color: 'white', letterSpacing: '0.06em', fontWeight: 700, marginTop: 10, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
            {event.name || 'Nome do evento'}
          </div>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>CURA · AVIVAMENTO · LIBERAÇÃO</div>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div className="row gap-md" style={{ marginBottom: 10 }}>
          <Icon name="calendar" size={14} color="var(--magenta-2)"/>
          <span style={{ fontSize: 13 }}>
            {event.startAt ? fmtDateShort(event.startAt) : '—'} → {event.endAt ? fmtDateShort(event.endAt) : '—'}
          </span>
        </div>
        <div className="row gap-md" style={{ marginBottom: 10 }}>
          <Icon name="home" size={14} color="var(--purple-2)"/>
          <span style={{ fontSize: 13 }}>{event.venue || '—'}</span>
        </div>
        <div className="row gap-md">
          <Icon name="users" size={14} color="var(--blue-2)"/>
          <span style={{ fontSize: 13 }}>Previsão: {event.expectedCount || 0} participantes</span>
        </div>
        {event.description && (
          <div style={{ marginTop: 14, fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.6, padding: 14, background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
            {event.description}
          </div>
        )}
        <div className="divider" />
        <div className="eyebrow" style={{ marginBottom: 8 }}>Link gerado</div>
        <div className="link-box" style={{ fontSize: 11 }}>
          <Icon name="link" size={14} color="var(--blue-2)"/>
          <span className="url">cura-avivamento.com/i/{event.slug || 'meu-evento'}</span>
        </div>
        <div className="eyebrow" style={{ marginTop: 14, marginBottom: 8 }}>Perguntas</div>
        <div style={{ fontSize: 13, color: 'var(--txt-2)' }}>
          {event.questions.filter(q => q.type !== 'section').length} campos · {event.questions.filter(q => q.type === 'section').length} seções
        </div>
      </div>
    </div>
  );
}

// ----- Question editor -----
function QuestionEditor({ questions, onChange }) {
  const [draftType, setDraftType] = useState('text');
  const [draftLabel, setDraftLabel] = useState('');

  const move = (idx, dir) => {
    const newQ = [...questions];
    const swap = idx + dir;
    if (swap < 0 || swap >= newQ.length) return;
    [newQ[idx], newQ[swap]] = [newQ[swap], newQ[idx]];
    onChange(newQ);
  };
  const remove = (id) => onChange(questions.filter(q => q.id !== id));
  const toggleReq = (id) => onChange(questions.map(q => q.id === id ? { ...q, required: !q.required } : q));
  const add = () => {
    if (!draftLabel.trim()) return;
    onChange([...questions, { id: uid('q'), type: draftType, label: draftLabel, required: false }]);
    setDraftLabel('');
  };

  return (
    <div className="col gap-md">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 600 }}>Perguntas do formulário</div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>{questions.length} itens · arraste para reordenar</div>
        </div>
        <button className="btn sm" onClick={() => { if (confirm('Restaurar perguntas padrão?')) onChange(DEFAULT_QUESTIONS); }}>
          <Icon name="sparkle" size={12}/>Restaurar padrão
        </button>
      </div>

      <div className="col gap-sm" style={{ maxHeight: 480, overflowY: 'auto', paddingRight: 6 }}>
        {questions.map((q, i) => (
          <div key={q.id} className={`q-item ${q.type === 'section' ? 'section' : ''}`}>
            <Icon name="grip" size={14} color="var(--txt-3)" />
            <div className="q-label">{q.label}</div>
            <span className="q-type">{Q_TYPES[q.type]?.label || q.type}</span>
            {q.type !== 'section' && (
              <span title="Obrigatória" onClick={() => toggleReq(q.id)} style={{
                fontSize: 10, padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                background: q.required ? 'rgba(255,46,138,0.15)' : 'transparent',
                color: q.required ? 'var(--magenta-2)' : 'var(--txt-3)',
                border: '1px solid ' + (q.required ? 'rgba(255,46,138,0.3)' : 'var(--line)'),
                letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
              }}>{q.required ? 'Obrigatória' : 'Opcional'}</span>
            )}
            <button className="icon-btn" onClick={() => move(i, -1)} title="Subir"><Icon name="arrowL" size={12} /></button>
            <button className="icon-btn" onClick={() => move(i, 1)}  title="Descer" style={{ transform: 'rotate(180deg)' }}><Icon name="arrowL" size={12} /></button>
            <button className="icon-btn" onClick={() => remove(q.id)} title="Remover"><Icon name="trash" size={12} /></button>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 18, borderStyle: 'dashed' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Adicionar pergunta</div>
        <div className="row gap-sm">
          <select className="select" value={draftType} onChange={e => setDraftType(e.target.value)} style={{ width: 200 }}>
            {Object.entries(Q_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input className="input" placeholder="Pergunta…" value={draftLabel} onChange={e => setDraftLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} style={{ flex: 1 }} />
          <button className="btn primary" onClick={add}><Icon name="plus" size={14}/>Adicionar</button>
        </div>
      </div>
    </div>
  );
}

// ----- Theme picker -----
function ThemePicker({ theme, onChange }) {
  return (
    <div className="col gap-md">
      <div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 600 }}>Visual do evento</div>
        <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>Escolha a paleta que dá o tom da página de ficha e do termo em PDF.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {THEMES.map(t => (
          <div key={t.id} onClick={() => onChange(t.id)} style={{
            cursor: 'pointer', borderRadius: 14, overflow: 'hidden',
            border: '2px solid ' + (theme === t.id ? 'var(--magenta)' : 'var(--line)'),
            transition: 'all .15s',
          }}>
            <div style={{ height: 110, background: t.grad, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="font-display" style={{ color: 'white', letterSpacing: '0.18em', fontSize: 13, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                MINISTÉRIO CURA E AVIVAMENTO
              </div>
            </div>
            <div style={{ padding: 12, background: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
              {theme === t.id && <Icon name="check" size={14} color="var(--magenta)" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { EventEditorScreen, EventPreview, QuestionEditor, ThemePicker });
