// Export helpers — PDF (per-response, styled), XLSX (all responses)

function exportResponsePDF(event, response) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // ===== HEADER BAND =====
  doc.setFillColor(15, 15, 38);
  doc.rect(0, 0, W, 130, 'F');

  // Decorative gradient-ish overlays (jsPDF has no native gradients, fake with circles)
  doc.setFillColor(255, 46, 138);
  doc.setGState(new doc.GState({ opacity: 0.45 }));
  doc.circle(W - 40, -20, 90, 'F');
  doc.setFillColor(61, 139, 255);
  doc.setGState(new doc.GState({ opacity: 0.35 }));
  doc.circle(W - 130, 60, 70, 'F');
  doc.setFillColor(139, 61, 217);
  doc.setGState(new doc.GState({ opacity: 0.4 }));
  doc.circle(W - 200, 0, 80, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  // Logo image (use the lion JPEG)
  try {
    const img = document.querySelector('img[src*="logo-lion"]');
    if (img) doc.addImage(img, 'JPEG', 40, 32, 64, 64, undefined, 'FAST');
  } catch (e) {}

  // Header text
  doc.setTextColor(255, 91, 168);
  doc.setFont('times', 'italic');
  doc.setFontSize(20);
  doc.text('Cura & Avivamento', 122, 56);

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.text('MINISTÉRIO CURA E AVIVAMENTO', 122, 78);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 220);
  doc.text('CURA  •  AVIVAMENTO  •  LIBERAÇÃO', 122, 92);

  // Event meta — right side header
  doc.setFontSize(8);
  doc.setTextColor(220, 220, 255);
  doc.text('TERMO DE LIBERAÇÃO · FICHA DE SAÚDE', W - 40, 36, { align: 'right' });
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(event.name, W - 40, 52, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 220);
  doc.text(`${fmtDateShort(event.startAt)} — ${fmtDateShort(event.endAt)}`, W - 40, 66, { align: 'right' });
  doc.text(event.venue || '', W - 40, 78, { align: 'right' });

  // ===== TITLE ROW =====
  const name = response.answers.nome || 'Participante';
  doc.setTextColor(26, 21, 48);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text(name, 40, 175);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 110, 150);
  doc.text(`PROTOCOLO ${response.id.toUpperCase()}   •   ${fmtDate(response.submittedAt, true).toUpperCase()}`, 40, 192);

  // Underline accent
  doc.setDrawColor(255, 46, 138);
  doc.setLineWidth(2);
  doc.line(40, 202, W - 40, 202);

  // ===== SECTIONS =====
  let y = 228;
  const sections = groupQuestionsBySections(event.questions);

  for (const sec of sections) {
    if (y > H - 100) { doc.addPage(); y = 60; }

    // Section header
    doc.setTextColor(139, 61, 217);
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text(sec.label.toUpperCase(), 40, y);
    doc.setDrawColor(220, 200, 245);
    doc.setLineWidth(0.6);
    doc.line(40, y + 4, W - 40, y + 4);
    y += 18;

    for (const q of sec.questions) {
      if (q.type === 'section') continue;
      // hide dependent questions whose conditions aren't met
      if (q.dependsOn) {
        const parent = response.answers[q.dependsOn.id];
        if (parent !== q.dependsOn.eq) continue;
      }
      const value = response.answers[q.id];
      if (value === undefined || value === null || value === '') continue;

      if (y > H - 80) { doc.addPage(); y = 60; }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(130, 120, 160);
      doc.text(q.label.toUpperCase(), 40, y);

      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(26, 21, 48);
      const str = String(value);
      const split = doc.splitTextToSize(str, W - 80);
      doc.text(split, 40, y + 14);
      const lines = split.length;
      y += 14 + lines * 13 + 6;
      // Dotted underline
      doc.setDrawColor(200, 195, 215);
      doc.setLineDashPattern([1, 2], 0);
      doc.setLineWidth(0.4);
      doc.line(40, y, W - 40, y);
      doc.setLineDashPattern([], 0);
      y += 8;
    }
    y += 6;
  }

  // ===== DECLARATION & SIGNATURE =====
  if (y > H - 220) { doc.addPage(); y = 60; }

  // Declaration title
  doc.setTextColor(139, 61, 217);
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text('DECLARAÇÃO DE VERACIDADE', 40, y);
  doc.setDrawColor(220, 200, 245);
  doc.setLineWidth(0.6);
  doc.line(40, y + 4, W - 40, y + 4);
  y += 22;

  // Declaration paragraph
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 35, 70);
  const decl = `Eu, ${response.answers.nome || '_____________________'}, portador(a) do CPF ${response.answers.cpf || '___.___.___-__'}, declaro que as informações de saúde aqui prestadas são verdadeiras e completas. Autorizo a equipe pastoral do ${event.name} a utilizá-las exclusivamente para o cuidado e bem-estar durante a programação, e a tomar as providências necessárias em caso de emergência. Isento a organização de responsabilidade por omissão ou imprecisão das informações que aqui prestei.`;
  const declLines = doc.splitTextToSize(decl, W - 80);
  doc.text(declLines, 40, y);
  y += declLines.length * 13 + 22;

  // Signature lines
  const sigName = response.answers._assinatura || response.answers.nome || '';
  const sigDate = response.answers._assinadoEm || response.submittedAt;

  // Signature (italic, like handwriting)
  doc.setFont('times', 'italic');
  doc.setFontSize(22);
  doc.setTextColor(26, 21, 48);
  doc.text(sigName, 40, y);

  // Date
  doc.setFont('courier', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(26, 21, 48);
  doc.text(fmtDate(sigDate), W - 200, y);

  y += 6;
  // Underlines
  doc.setDrawColor(60, 50, 90);
  doc.setLineWidth(0.6);
  doc.line(40, y, 40 + (W - 280), y);
  doc.line(W - 220, y, W - 40, y);
  y += 12;

  // Labels under lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(130, 120, 160);
  doc.text('ASSINATURA DO PARTICIPANTE', 40, y);
  doc.text('DATA', W - 220, y);

  y += 20;

  // Electronic-signature stamp
  doc.setFillColor(139, 61, 217);
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.roundedRect(40, y - 12, W - 80, 26, 4, 4, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));
  doc.setDrawColor(139, 61, 217);
  doc.setLineWidth(0.6);
  doc.roundedRect(40, y - 12, W - 80, 26, 4, 4);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(139, 61, 217);
  doc.text(
    `ASSINADO ELETRONICAMENTE  ·  PROTOCOLO ${response.id.toUpperCase()}  ·  ${fmtDate(sigDate, true).toUpperCase()}`,
    W / 2, y + 4, { align: 'center' }
  );

  // ===== FOOTER =====
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(255, 46, 138);
    doc.setLineWidth(2);
    doc.line(40, H - 50, W - 40, H - 50);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 140, 180);
    doc.text(`MINISTÉRIO CURA E AVIVAMENTO  •  ${event.name.toUpperCase()}`, 40, H - 32);
    doc.text(`PÁGINA ${p} / ${pages}`, W - 40, H - 32, { align: 'right' });
    doc.setFontSize(6);
    doc.text('GERADO EM ' + new Date().toLocaleString('pt-BR').toUpperCase(), W / 2, H - 32, { align: 'center' });
  }

  const safe = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  doc.save(`${event.slug || 'evento'}-${safe}.pdf`);
}

function groupQuestionsBySections(questions) {
  const out = [];
  let cur = null;
  for (const q of questions) {
    if (q.type === 'section') {
      cur = { label: q.label, questions: [] };
      out.push(cur);
    } else {
      if (!cur) { cur = { label: 'Dados', questions: [] }; out.push(cur); }
      cur.questions.push(q);
    }
  }
  return out;
}

function exportEventXLSX(event, responses) {
  const cols = event.questions.filter(q => q.type !== 'section');
  const header = ['ID', 'Enviado em', ...cols.map(q => q.label), 'Assinatura', 'Assinado em', 'Termo aceito'];
  const rows = responses.map(r => [
    r.id,
    new Date(r.submittedAt).toLocaleString('pt-BR'),
    ...cols.map(q => r.answers[q.id] ?? ''),
    r.answers._assinatura ?? '',
    r.answers._assinadoEm ? new Date(r.answers._assinadoEm).toLocaleString('pt-BR') : '',
    r.answers._declarado ?? 'Sim',
  ]);
  const aoa = [header, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Column widths
  ws['!cols'] = header.map((h, i) => ({ wch: i === 0 ? 14 : i === 1 ? 18 : Math.min(40, Math.max(14, h.length + 2)) }));

  const wb = XLSX.utils.book_new();
  const sheetName = (event.name || 'Respostas').slice(0, 28);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Summary sheet
  const stats = [
    ['Evento', event.name],
    ['Tagline', event.tagline || ''],
    ['Local', event.venue || ''],
    ['Início', fmtDate(event.startAt, true)],
    ['Fim', fmtDate(event.endAt, true)],
    ['Previsto', event.expectedCount || 0],
    ['Fichas preenchidas', responses.length],
    ['Preenchimento', event.expectedCount ? Math.round(responses.length / event.expectedCount * 100) + '%' : '—'],
    ['Exportado em', new Date().toLocaleString('pt-BR')],
  ];
  const wsSum = XLSX.utils.aoa_to_sheet(stats);
  wsSum['!cols'] = [{ wch: 18 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsSum, 'Resumo');

  XLSX.writeFile(wb, `${event.slug || 'evento'}-respostas.xlsx`);
}

Object.assign(window, { exportResponsePDF, exportEventXLSX, groupQuestionsBySections });
