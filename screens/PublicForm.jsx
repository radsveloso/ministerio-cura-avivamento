// Public form — what the participant sees. Step-based, cinematic.

function PublicFormScreen({ data, actions, slug }) {
  const event = data.events.find(e => e.slug === slug || e.id === slug);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [consent, setConsent] = useState(false);
  const [signature, setSignature] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [respId, setRespId] = useState(null);

  if (!event) {
    return (
      <div className="public-stage">
        <Ambient/>
        <div className="public-wrap" style={{ textAlign: 'center', paddingTop: 80 }}>
          <BrandLockup size="lg"/>
          <div style={{ marginTop: 40, fontSize: 18, color: 'var(--txt-2)' }}>Este link não está mais ativo.</div>
        </div>
      </div>
    );
  }

  const status = eventStatus(event);
  const theme = THEMES.find(t => t.id === event.theme) || THEMES[0];

  // Group questions into sections
  const sections = useMemo(() => groupQuestionsBySections(event.questions), [event]);

  // Build steps: hero + each section + review
  const totalSteps = sections.length + 2; // 0 = hero, 1..N = sections, N+1 = review

  const visibleQuestions = (sec) => sec.questions.filter(q => {
    if (q.dependsOn) {
      const parent = answers[q.dependsOn.id];
      if (parent !== q.dependsOn.eq) return false;
    }
    return true;
  });

  const validateSection = (sec) => {
    const errors = [];
    for (const q of visibleQuestions(sec)) {
      if (q.required && !answers[q.id]) errors.push(q.label);
    }
    return errors;
  };

  const next = () => {
    if (step >= 1 && step <= sections.length) {
      const sec = sections[step - 1];
      const errors = validateSection(sec);
      if (errors.length) {
        toast(`Preencha: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1})` : ''}`);
        return;
      }
    }
    setStep(Math.min(totalSteps - 1, step + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => { setStep(Math.max(0, step - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = () => {
    const payload = {
      ...answers,
      _declarado: 'Sim',
      _assinatura: signature.trim(),
      _assinadoEm: new Date().toISOString(),
    };
    const resp = actions.addResponse(event.id, payload);
    setRespId(resp.id);
    setSubmitted(true);
  };

  if (submitted) {
    return <ConfirmationScreen event={event} theme={theme} respId={respId} answers={answers} />;
  }

  // Hero / closed states
  if (status === 'ended') {
    return (
      <div className="public-stage">
        <Ambient/>
        <div className="public-wrap" style={{ paddingTop: 60 }}>
          <div className="public-hero">
            <div className="script">{event.tagline || 'Cura & Avivamento'}</div>
            <h1>{event.name}</h1>
            <div className="tagline">CURA · AVIVAMENTO · LIBERAÇÃO</div>
          </div>
          <div className="card" style={{ padding: 36, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🦅</div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, marginBottom: 10 }}>O prazo de preenchimento foi encerrado.</div>
            <div style={{ color: 'var(--txt-2)', fontSize: 14 }}>O período para envio da ficha de saúde já passou. Procure a liderança do evento.</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'scheduled') {
    return (
      <div className="public-stage">
        <Ambient/>
        <div className="public-wrap" style={{ paddingTop: 60 }}>
          <div className="public-hero">
            <div className="script">{event.tagline || 'Cura & Avivamento'}</div>
            <h1>{event.name}</h1>
            <div className="tagline">CURA · AVIVAMENTO · LIBERAÇÃO</div>
          </div>
          <div className="card" style={{ padding: 36, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>⏳</div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, marginBottom: 10 }}>A ficha de saúde abrirá em breve.</div>
            <div style={{ color: 'var(--txt-2)', fontSize: 14, marginBottom: 14 }}>
              Início: <strong>{fmtDate(event.startAt, true)}</strong>
            </div>
            <Countdown to={event.startAt} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-stage">
      <Ambient dna/>
      <div className="public-wrap">

        {/* HERO – only on step 0 */}
        {step === 0 && (
          <>
            <div className="public-hero" style={{ background: `linear-gradient(180deg, rgba(20,20,45,0.55), rgba(10,10,26,0.78)), ${theme.grad}` }}>
              <div style={{ marginBottom: 18 }}>
                <LogoMark size={80}/>
              </div>
              <div className="script">{event.tagline || 'Cura & Avivamento'}</div>
              <h1>{event.name}</h1>
              <div className="tagline">CURA · AVIVAMENTO · LIBERAÇÃO</div>
              <div style={{ marginTop: 22, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)', fontSize: 12 }}>
                <span className="chip live" style={{ padding: 0, border: 'none', background: 'transparent' }}><span className="dot"></span></span>
                Preenchimento aberto até {fmtDate(event.endAt)}
              </div>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div className="row gap-md" style={{ marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <div className="eyebrow">Local</div>
                  <div style={{ marginTop: 4, fontSize: 14 }}>{event.venue || 'A definir'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="eyebrow">Quando</div>
                  <div style={{ marginTop: 4, fontSize: 14 }}>{fmtDateShort(event.startAt)} → {fmtDateShort(event.endAt)}</div>
                </div>
              </div>
              {event.description && (
                <div style={{ padding: 18, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)', color: 'var(--txt-2)', lineHeight: 1.7, fontSize: 14 }}>
                  {event.description}
                </div>
              )}
              <div className="divider"/>
              <div style={{ textAlign: 'center' }}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>São {event.questions.filter(q => q.type !== 'section').length} perguntas em {sections.length} etapas · cerca de 4 min</div>
                <button className="btn primary lg" onClick={() => setStep(1)}>
                  Preencher ficha de saúde
                  <Icon name="arrow" size={16}/>
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEPS – one section per step */}
        {step >= 1 && step <= sections.length && (
          <>
            <div className="row" style={{ marginBottom: 16, gap: 14 }}>
              <button className="icon-btn" onClick={prev}><Icon name="arrowL" size={14}/></button>
              <div style={{ flex: 1 }}>
                <div className="eyebrow">Etapa {step} de {sections.length}</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 18, marginTop: 2 }}>{event.name}</div>
              </div>
              <BrandLockup/>
            </div>

            <div className="step-progress">
              {sections.map((_, i) => (
                <div key={i} className={i < step ? (i === step - 1 ? 'active' : 'done') : ''}></div>
              ))}
            </div>

            <SectionForm
              section={sections[step - 1]}
              answers={answers}
              onChange={(id, val) => setAnswers(a => ({ ...a, [id]: val }))}
            />

            <div className="row" style={{ marginTop: 22, justifyContent: 'space-between' }}>
              <button className="btn" onClick={prev}><Icon name="arrowL" size={14}/>Voltar</button>
              <button className="btn primary lg" onClick={next}>
                {step === sections.length ? 'Revisar ficha' : 'Continuar'}
                <Icon name="arrow" size={14}/>
              </button>
            </div>
          </>
        )}

        {/* REVIEW */}
        {step === totalSteps - 1 && (
          <>
            <div className="row" style={{ marginBottom: 16, gap: 14 }}>
              <button className="icon-btn" onClick={prev}><Icon name="arrowL" size={14}/></button>
              <div style={{ flex: 1 }}>
                <div className="eyebrow">Revisão final</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, marginTop: 2 }}>Confirme antes de enviar</div>
              </div>
            </div>

            <div className="step-progress">{sections.map((_, i) => <div key={i} className="done"></div>)}</div>

            <div className="card step-card">
              {sections.map((sec, si) => (
                <div key={si} className="sheet-section" style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>
                    <span className="font-mono" style={{ color: 'var(--magenta-2)', fontSize: 11 }}>{String(si + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.16em', fontSize: 13, color: 'var(--purple-2)' }}>{sec.label.toUpperCase()}</span>
                    <div className="spacer"/>
                    <button className="btn sm ghost" onClick={() => setStep(si + 1)}><Icon name="edit" size={12}/>Editar</button>
                  </div>
                  <div className="sheet-grid" style={{ color: 'var(--txt)' }}>
                    {visibleQuestions(sec).map(q => (
                      <div key={q.id} className={`sheet-field ${q.full ? 'full' : ''}`} style={{ borderColor: 'var(--line)' }}>
                        <div className="k" style={{ color: 'var(--txt-3)' }}>{q.label}</div>
                        <div className={`v ${!answers[q.id] ? 'empty' : ''}`} style={{ color: answers[q.id] ? 'var(--txt)' : 'var(--txt-3)' }}>
                          {answers[q.id] || '— não respondido —'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="card step-card" style={{ marginTop: 18, borderColor: 'rgba(255,46,138,0.3)' }}>
              <div className="row" style={{ gap: 10, marginBottom: 6 }}>
                <Icon name="sparkle" size={18} color="#FF5BA8"/>
                <h2>Declaração & Assinatura</h2>
              </div>
              <div className="step-sub">Esta ficha é um documento de liberação para o evento. Sua assinatura confirma a veracidade das respostas.</div>

              <div style={{ padding: 18, background: 'rgba(0,0,0,0.25)', border: '1px solid var(--line)', borderRadius: 12, fontSize: 13.5, lineHeight: 1.7, color: 'var(--txt-2)', marginBottom: 18 }}>
                Eu, <strong style={{ color: 'var(--hi)' }}>{answers.nome || '________________'}</strong>,
                portador(a) do CPF <strong style={{ color: 'var(--hi)' }}>{answers.cpf || '___.___.___-__'}</strong>,
                declaro que as informações de saúde acima são <strong>verdadeiras e completas</strong>. Estou ciente de que devo informar
                imediatamente a equipe pastoral do <strong style={{ color: 'var(--hi)' }}>{event.name}</strong> sobre qualquer mudança no meu quadro clínico até a data do evento.
                Autorizo a equipe de cuidado a utilizar estes dados <em>exclusivamente</em> para o atendimento e bem-estar durante a programação,
                e a tomar as providências necessárias em caso de emergência. Isento a organização de responsabilidade por
                omissão ou imprecisão das informações que aqui prestei.
              </div>

              <div className={`checkbox ${consent ? 'selected' : ''}`} onClick={() => setConsent(!consent)} style={{ marginBottom: 18, padding: '14px 16px' }}>
                <input type="checkbox" checked={consent} readOnly />
                <span style={{ color: consent ? 'var(--hi)' : 'var(--txt-2)' }}>
                  Li, compreendi e <strong>concordo</strong> com a declaração acima.
                </span>
              </div>

              <div className="form-grid">
                <div className="field full">
                  <label>Assinatura eletrônica · digite seu nome completo</label>
                  <input
                    className="input lg"
                    placeholder="Assine digitando seu nome igual ao informado acima"
                    value={signature}
                    onChange={e => setSignature(e.target.value)}
                    style={{ fontFamily: 'Italianno, cursive', fontSize: 28 }}
                  />
                </div>
                <div className="field">
                  <label>Data</label>
                  <input className="input" value={fmtDate(new Date())} readOnly style={{ background: 'rgba(255,255,255,0.02)' }}/>
                </div>
                <div className="field">
                  <label>Hora</label>
                  <input className="input" value={new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} readOnly style={{ background: 'rgba(255,255,255,0.02)' }}/>
                </div>
              </div>

              {signature && answers.nome && signature.trim().toLowerCase() !== answers.nome.trim().toLowerCase() && (
                <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: 'rgba(255,176,104,0.08)', border: '1px solid rgba(255,176,104,0.3)', fontSize: 12, color: 'var(--orange-2)' }}>
                  <Icon name="sparkle" size={12}/> A assinatura difere do nome informado. Confirme se está correto antes de enviar.
                </div>
              )}
            </div>

            <div className="row" style={{ marginTop: 22, justifyContent: 'space-between' }}>
              <button className="btn" onClick={prev}><Icon name="arrowL" size={14}/>Voltar</button>
              <button
                className="btn primary lg"
                onClick={() => {
                  if (!consent) { toast('Marque a declaração para continuar'); return; }
                  if (!signature.trim()) { toast('Assine digitando seu nome'); return; }
                  submit();
                }}
                style={{ opacity: consent && signature.trim() ? 1 : 0.45 }}
              >
                <Icon name="check" size={16}/>Assinar e enviar ficha
              </button>
            </div>
          </>
        )}

        <div style={{ marginTop: 40, textAlign: 'center', fontSize: 11, color: 'var(--txt-3)', letterSpacing: '0.18em' }}>
          MINISTÉRIO CURA E AVIVAMENTO · NINHO DAS ÁGUIAS · {new Date().getFullYear()}
        </div>
      </div>
      <ToastStack/>
    </div>
  );
}

function SectionForm({ section, answers, onChange }) {
  const visible = section.questions.filter(q => {
    if (q.dependsOn) {
      const parent = answers[q.dependsOn.id];
      return parent === q.dependsOn.eq;
    }
    return true;
  });
  return (
    <div className="card step-card">
      <div className="row" style={{ gap: 10, marginBottom: 4 }}>
        <Icon name="sparkle" size={18} color="#FF5BA8"/>
        <h2>{section.label}</h2>
      </div>
      <div className="step-sub">Os dados são confidenciais e usados apenas para o cuidado pastoral durante o evento.</div>

      <div className="form-grid">
        {visible.map(q => (
          <FormField key={q.id} q={q} value={answers[q.id]} onChange={(v) => onChange(q.id, v)} />
        ))}
      </div>
    </div>
  );
}

function FormField({ q, value, onChange }) {
  const full = q.full || q.type === 'long' || q.type === 'yesno';
  const baseProps = {
    className: 'input',
    value: value || '',
    onChange: (e) => onChange(e.target.value),
  };
  let control;
  switch (q.type) {
    case 'long':
      control = <textarea {...baseProps} className="textarea" rows={3} />;
      break;
    case 'date':
      control = <input {...baseProps} type="date" />;
      break;
    case 'number':
      control = <input {...baseProps} type="number" min="0" />;
      break;
    case 'email':
      control = <input {...baseProps} type="email" placeholder="seu@email.com" />;
      break;
    case 'phone':
      control = <input {...baseProps} type="tel" placeholder="(00) 00000-0000" />;
      break;
    case 'yesno':
      control = (
        <div className="row gap-sm">
          {['Sim', 'Não'].map(opt => (
            <div key={opt} className={`radio ${value === opt ? 'selected' : ''}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => onChange(opt)}>
              <input type="radio" checked={value === opt} readOnly />
              {opt}
            </div>
          ))}
        </div>
      );
      break;
    case 'select':
      control = (
        <select {...baseProps} className="select">
          <option value="">Selecione…</option>
          {(q.options || []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
      break;
    default:
      control = <input {...baseProps} type="text" />;
  }
  return (
    <div className={`field ${full ? 'full' : ''}`}>
      <label>{q.label}{q.required && <span style={{ color: 'var(--magenta)', marginLeft: 4 }}>*</span>}</label>
      {control}
    </div>
  );
}

function ConfirmationScreen({ event, theme, respId, answers }) {
  return (
    <div className="public-stage">
      <Ambient/>
      <div className="public-wrap" style={{ paddingTop: 40, maxWidth: 640 }}>
        <div className="public-hero" style={{ background: `linear-gradient(180deg, rgba(20,20,45,0.55), rgba(10,10,26,0.78)), ${theme.grad}`, padding: '52px 36px' }}>
          <div style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.4)' }}>
            <Icon name="check" size={36} color="#6CFFB0" stroke={2.2}/>
          </div>
          <div className="script" style={{ fontSize: 38 }}>Você está liberado(a) a participar</div>
          <h1 style={{ fontSize: 24, marginTop: 2 }}>{event.name}</h1>
          <div className="tagline">CONFIRMAÇÃO · Nº {respId.toUpperCase().slice(-6)}</div>
        </div>

        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'rgba(108,255,176,0.08)', border: '1px solid rgba(108,255,176,0.3)', color: '#6CFFB0', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
            <Icon name="check" size={12}/>Termo assinado · ficha aprovada
          </div>
          <div className="font-script" style={{ fontSize: 30, color: 'var(--magenta-2)', lineHeight: 1 }}>{(answers.nome || '').split(' ')[0]}, prepare seu coração.</div>
          <div style={{ marginTop: 14, color: 'var(--txt-2)', fontSize: 14, lineHeight: 1.7 }}>
            Sua ficha de saúde foi recebida e <strong style={{ color: 'var(--hi)' }}>você está liberado(a) a participar</strong> do <strong style={{ color: 'var(--hi)' }}>{event.name}</strong>.
            A equipe pastoral já tem acesso às informações necessárias para o cuidado durante o evento.
            Caso algo mude no seu quadro clínico antes da data, procure a liderança.
          </div>

          <div className="divider"/>

          <div className="row" style={{ justifyContent: 'space-around', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div className="eyebrow">Quando</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{fmtDateShort(event.startAt)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="eyebrow">Onde</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{event.venue}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="eyebrow">Protocolo</div>
              <div style={{ fontSize: 13, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{respId.slice(-8).toUpperCase()}</div>
            </div>
          </div>

          <div className="divider"/>

          <div className="font-script" style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
            "Subirão com asas como águias, correrão e não se cansarão."
          </div>
          <div className="eyebrow" style={{ marginTop: 8 }}>ISAÍAS 40 : 31</div>
        </div>
      </div>
    </div>
  );
}

function Countdown({ to }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const ms = Math.max(0, new Date(to).getTime() - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);

  return (
    <div className="row" style={{ justifyContent: 'center', gap: 14, marginTop: 16 }}>
      {[['DIAS', days], ['HORAS', hours], ['MIN', mins], ['SEG', secs]].map(([l, v]) => (
        <div key={l} style={{ minWidth: 70, padding: '14px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 32, fontWeight: 700, backgroundImage: 'var(--grad-prophet)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{String(v).padStart(2, '0')}</div>
          <div className="eyebrow" style={{ fontSize: 10 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { PublicFormScreen });
