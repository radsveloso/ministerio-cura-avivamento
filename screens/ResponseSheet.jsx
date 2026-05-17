// Response sheet — beautiful PDF-style view of one response. Print-friendly.

function ResponseSheetScreen({ data, actions, user, onLogout, responseId }) {
  const response = data.responses.find(r => r.id === responseId);
  const event = response ? data.events.find(e => e.id === response.eventId) : null;

  if (!response || !event) {
    return (
      <div className="app shell">
        <Ambient/>
        <Sidebar active="events" user={user} onLogout={onLogout}/>
        <main className="main">
          <div className="empty">Ficha de saúde não encontrada.</div>
        </main>
      </div>
    );
  }

  const sections = groupQuestionsBySections(event.questions);

  return (
    <div className="sheet-stage">
      <Ambient/>
      <div className="sheet-toolbar">
        <button className="btn" onClick={() => navigate('/event/' + event.id)}>
          <Icon name="arrowL" size={14}/>Voltar ao evento
        </button>
        <div className="row gap-sm">
          <button className="btn" onClick={() => window.print()}>
            <Icon name="download" size={14}/>Imprimir
          </button>
          <button className="btn primary" onClick={() => exportResponsePDF(event, response)}>
            <Icon name="pdf" size={14}/>Baixar PDF
          </button>
        </div>
      </div>

      <div className="sheet" id="response-sheet">
        <div className="sheet-header">
          <div className="row">
            <img src="assets/logo-lion.jpeg" alt="Ministério Cura e Avivamento"/>
            <div style={{ flex: 1 }}>
              <div className="script">Cura & Avivamento</div>
              <h1>MINISTÉRIO CURA E AVIVAMENTO</h1>
              <div className="sub">CURA · AVIVAMENTO · LIBERAÇÃO</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="sub" style={{ marginBottom: 4 }}>TERMO DE LIBERAÇÃO · FICHA DE SAÚDE</div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 700 }}>{event.name}</div>
              <div className="sub" style={{ marginTop: 6 }}>{fmtDateShort(event.startAt)} — {fmtDateShort(event.endAt)}</div>
              <div className="sub">{event.venue}</div>
            </div>
          </div>
        </div>

        <div className="sheet-body">
          <div className="sheet-title-row">
            <div className="who">{response.answers.nome || 'Participante'}</div>
            <div className="when">
              PROTOCOLO {response.id.toUpperCase()}<br/>
              {fmtDate(response.submittedAt, true).toUpperCase()}
            </div>
          </div>

          {sections.map((sec, si) => {
            const visible = sec.questions.filter(q => {
              if (q.dependsOn) {
                const parent = response.answers[q.dependsOn.id];
                if (parent !== q.dependsOn.eq) return false;
              }
              return response.answers[q.id] !== undefined && response.answers[q.id] !== '';
            });
            if (visible.length === 0) return null;
            return (
              <div key={si} className="sheet-section">
                <div className="sheet-section-title">
                  <span className="num">{String(si + 1).padStart(2, '0')}</span>
                  <span>{sec.label}</span>
                </div>
                <div className="sheet-grid">
                  {visible.map(q => (
                    <div key={q.id} className={`sheet-field ${q.full || q.type === 'long' ? 'full' : ''}`}>
                      <div className="k">{q.label}</div>
                      <div className="v">{response.answers[q.id]}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Declaration + signature */}
          <div className="sheet-section" style={{ marginTop: 28 }}>
            <div className="sheet-section-title">
              <span className="num">{String(sections.length + 1).padStart(2, '0')}</span>
              <span>Declaração de Veracidade</span>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.7, color: 'rgba(26,21,48,0.85)', padding: '4px 0 18px' }}>
              Eu, <strong>{response.answers.nome}</strong>, portador(a) do CPF <strong>{response.answers.cpf}</strong>,
              declaro que as informações de saúde aqui prestadas são <strong>verdadeiras e completas</strong>.
              Autorizo a equipe pastoral do <strong>{event.name}</strong> a utilizá-las exclusivamente para o cuidado e bem-estar
              durante a programação, e a tomar as providências necessárias em caso de emergência.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 18 }}>
              <div style={{ borderBottom: '1px solid rgba(26,21,48,0.4)', paddingBottom: 4 }}>
                <div style={{ fontFamily: 'Italianno, cursive', fontSize: 32, color: '#1A1530', lineHeight: 1 }}>
                  {response.answers._assinatura || response.answers.nome || '—'}
                </div>
              </div>
              <div style={{ borderBottom: '1px solid rgba(26,21,48,0.4)', paddingBottom: 4, display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
                  {fmtDate(response.answers._assinadoEm || response.submittedAt)}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 4 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(26,21,48,0.5)', textTransform: 'uppercase' }}>Assinatura do participante</div>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(26,21,48,0.5)', textTransform: 'uppercase' }}>Data</div>
            </div>

            <div style={{ marginTop: 22, padding: 12, background: 'rgba(139,61,217,0.08)', border: '1px solid rgba(139,61,217,0.25)', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(26,21,48,0.6)', letterSpacing: '0.12em', textAlign: 'center' }}>
              ASSINADO ELETRONICAMENTE · PROTOCOLO {response.id.toUpperCase()} · {fmtDate(response.answers._assinadoEm || response.submittedAt, true).toUpperCase()}
            </div>
          </div>

          <div className="sheet-footer">
            <div>MINISTÉRIO CURA E AVIVAMENTO · NINHO DAS ÁGUIAS</div>
            <div>{event.name.toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--txt-3)', fontSize: 12 }}>
        <span>Confidencial · uso interno da liderança</span>
        <button className="btn danger sm" onClick={() => {
          if (confirm('Excluir esta ficha de saúde?')) {
            actions.deleteResponse(response.id);
            navigate('/event/' + event.id);
          }
        }}>
          <Icon name="trash" size={12}/>Excluir ficha
        </button>
      </div>

      <ToastStack/>
    </div>
  );
}

window.ResponseSheetScreen = ResponseSheetScreen;
