// Store — localStorage-backed data layer with seed data.

const STORE_KEY = 'mca_v2';

// Default question set extracted from the user's docx (Portuguese, Ministério Cura e Avivamento form).
const DEFAULT_QUESTIONS = [
  { id: 'sec1', type: 'section', label: 'Dados Pessoais' },
  { id: 'nome',       type: 'text',   label: 'Nome completo',         required: true },
  { id: 'nascimento', type: 'date',   label: 'Data de nascimento',    required: true },
  { id: 'idade',      type: 'number', label: 'Idade',                 required: true },
  { id: 'cpf',        type: 'text',   label: 'CPF',                   required: true, mask: 'cpf' },
  { id: 'rg',         type: 'text',   label: 'RG',                    required: false },
  { id: 'tel1',       type: 'phone',  label: 'Telefone principal',    required: true },
  { id: 'tel2',       type: 'phone',  label: 'Telefone secundário',   required: false },
  { id: 'email',      type: 'email',  label: 'E-mail',                required: true },
  { id: 'endereco',   type: 'long',   label: 'Endereço completo',     required: true, full: true },
  { id: 'cidade',     type: 'text',   label: 'Cidade',                required: true },
  { id: 'estado',     type: 'text',   label: 'Estado',                required: true },

  { id: 'sec2', type: 'section', label: 'Contatos de Emergência' },
  { id: 'emer_nome',     type: 'text',  label: 'Nome completo do contato de emergência', required: true },
  { id: 'emer_grau',     type: 'text',  label: 'Grau de parentesco',                     required: true },
  { id: 'emer_tel',      type: 'phone', label: 'Telefone do contato de emergência',     required: true },
  { id: 'emer2_existe',  type: 'yesno', label: 'Existe outra pessoa para contato em caso de emergência?' },
  { id: 'emer2_nome',    type: 'text',  label: 'Nome do segundo contato', dependsOn: { id: 'emer2_existe', eq: 'Sim' } },
  { id: 'emer2_tel',     type: 'phone', label: 'Telefone do segundo contato', dependsOn: { id: 'emer2_existe', eq: 'Sim' } },
  { id: 'emer2_grau',    type: 'text',  label: 'Parentesco do segundo contato', dependsOn: { id: 'emer2_existe', eq: 'Sim' } },

  { id: 'sec3', type: 'section', label: 'Saúde' },
  { id: 'alergia_b',   type: 'yesno', label: 'Possui alguma alergia?' },
  { id: 'alergia_q',   type: 'long',  label: 'Se sim, qual alergia?', dependsOn: { id: 'alergia_b', eq: 'Sim' }, full: true },
  { id: 'rest_b',      type: 'yesno', label: 'Possui restrição alimentar?' },
  { id: 'rest_q',      type: 'long',  label: 'Se sim, qual restrição alimentar?', dependsOn: { id: 'rest_b', eq: 'Sim' }, full: true },
  { id: 'rest_alim',   type: 'text',  label: 'Qual alimento', dependsOn: { id: 'rest_b', eq: 'Sim' } },
  { id: 'medic_b',     type: 'yesno', label: 'Faz uso de medicação contínua?' },
  { id: 'medic_q',     type: 'long',  label: 'Se sim, qual medicamento e horários', dependsOn: { id: 'medic_b', eq: 'Sim' }, full: true },
  { id: 'hipertensao', type: 'yesno', label: 'Possui hipertensão (pressão alta)?' },
  { id: 'diabetes',    type: 'yesno', label: 'Possui diabetes?' },
  { id: 'cardiaco_b',  type: 'yesno', label: 'Possui problema cardíaco?' },
  { id: 'cardiaco_q',  type: 'long',  label: 'Se sim, qual problema cardíaco?', dependsOn: { id: 'cardiaco_b', eq: 'Sim' }, full: true },
  { id: 'convul',      type: 'yesno', label: 'Já teve crises convulsivas ou epilepsia?' },
  { id: 'defic_b',     type: 'yesno', label: 'Possui alguma deficiência ou limitação física?' },
  { id: 'defic_q',     type: 'long',  label: 'Se sim, qual?', dependsOn: { id: 'defic_b', eq: 'Sim' }, full: true },
  { id: 'acomp_b',     type: 'yesno', label: 'Possui acompanhamento médico por alguma condição específica?' },
  { id: 'acomp_q',     type: 'long',  label: 'Se sim, qual condição?', dependsOn: { id: 'acomp_b', eq: 'Sim' }, full: true },
];

const THEMES = [
  { id: 'prophet', name: 'Profeta',    grad: 'linear-gradient(135deg, #FF2E8A 0%, #8B3DD9 50%, #3D8BFF 100%)' },
  { id: 'fire',    name: 'Fogo',       grad: 'linear-gradient(135deg, #FF7A2E 0%, #FF2E8A 60%, #8B3DD9 100%)' },
  { id: 'deep',    name: 'Profundeza', grad: 'linear-gradient(135deg, #3D8BFF 0%, #8B3DD9 50%, #08081A 100%)' },
  { id: 'flame',   name: 'Chama Viva', grad: 'linear-gradient(135deg, #FF7A2E 0%, #FF2E8A 50%, #3D8BFF 100%)' },
];

// ----- Seed data -----
function seedData() {
  const now = new Date();
  const future = new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000); // +18 days
  const past   = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // -30 days
  const eventLive = {
    id: 'evt_avivamento',
    slug: 'avivamento-2026',
    name: 'Escola do Avivamento 2026',
    tagline: 'A Geração que Profetiza',
    venue: 'Sede Ministério Cura e Avivamento — Goiânia/GO',
    startAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    endAt:   future.toISOString(),
    expectedCount: 180,
    theme: 'prophet',
    description: 'Sete dias de imersão para cura interior, avivamento e liberação. Ministrações com o Apóstolo Ricardo Costa.',
    questions: DEFAULT_QUESTIONS,
    createdAt: past.toISOString(),
  };
  const eventPast = {
    id: 'evt_imersao',
    slug: 'retiro-cura',
    name: 'Retiro de Cura — Verão',
    tagline: 'Restaura. Cura. Liberta.',
    venue: 'Chácara Ebenezer — Caldas Novas/GO',
    startAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endAt:   new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    expectedCount: 80,
    theme: 'fire',
    description: 'Retiro de 4 dias com foco em cura interior, libertação e formação de líderes.',
    questions: DEFAULT_QUESTIONS,
    createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  };
  const eventScheduled = {
    id: 'evt_dna',
    slug: 'dna-encontro',
    name: 'Encontro Cura & Avivamento',
    tagline: 'Cura. Avivamento. Liberação.',
    venue: 'Auditório Central — São Paulo/SP',
    startAt: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    endAt:   new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    expectedCount: 250,
    theme: 'deep',
    description: 'Conferência nacional de cura, avivamento e liberação. Apóstolo Ricardo Costa e convidados.',
    questions: DEFAULT_QUESTIONS,
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // Sample participant responses for the live event
  const sampleNames = [
    ['Ana Beatriz Soares', 'F', 28], ['Daniel Rocha Vieira', 'M', 34], ['Júlia Mendes Cardoso', 'F', 22],
    ['Pedro Henrique Lima', 'M', 31], ['Camila Andrade Costa', 'F', 26], ['Rafael Oliveira Santos', 'M', 40],
    ['Letícia Ferreira Souza', 'F', 19], ['Lucas Martins Pereira', 'M', 29], ['Marina Albuquerque', 'F', 35],
    ['Felipe Carvalho Reis', 'M', 24], ['Beatriz Nogueira Pires', 'F', 27], ['Gabriel Tavares Lopes', 'M', 33],
    ['Sara Cristina Moura', 'F', 30], ['Tiago Barbosa Alves', 'M', 38], ['Larissa Pinto Ramos', 'F', 23],
    ['Vinícius Araújo Dias', 'M', 26], ['Mariana Gomes Faria', 'F', 32], ['Bruno Sampaio Cunha', 'M', 41],
    ['Helena Castro Brito', 'F', 25], ['Igor Nascimento Melo', 'M', 28], ['Isabela Freitas Rangel', 'F', 21],
    ['Caio Monteiro Duarte', 'M', 36], ['Yasmin Borges Teixeira', 'F', 29], ['Otávio Pacheco Cordeiro', 'M', 27],
  ];
  const cidades = ['Goiânia', 'Anápolis', 'Brasília', 'Aparecida de Goiânia', 'Trindade', 'Senador Canedo'];
  const responses = sampleNames.map((row, i) => {
    const [nome, , idade] = row;
    const submittedAt = new Date(now.getTime() - (i * 4 + 2) * 60 * 60 * 1000).toISOString();
    const hasAlergia = i % 5 === 0;
    const hasMedic = i % 7 === 0;
    return {
      id: uid('resp'),
      eventId: 'evt_avivamento',
      submittedAt,
      answers: {
        nome,
        nascimento: `19${90 + (i % 8)}-0${1 + (i % 8)}-1${i % 9}`,
        idade,
        cpf: `${100 + i}.${200 + i}.${300 + i}-${10 + (i % 80)}`,
        rg: `${10000000 + i * 17}`,
        tel1: `(62) 9${1000 + i * 11}-${4000 + i * 7}`,
        tel2: i % 3 === 0 ? `(62) 3${200 + i}-${1100 + i}` : '',
        email: nome.split(' ')[0].toLowerCase() + '.' + nome.split(' ').slice(-1)[0].toLowerCase() + '@email.com',
        endereco: `Rua das Acácias, ${100 + i * 7}, Setor Bueno`,
        cidade: cidades[i % cidades.length],
        estado: 'GO',
        emer_nome: 'Maria ' + nome.split(' ').slice(-1)[0],
        emer_grau: i % 2 === 0 ? 'Mãe' : 'Cônjuge',
        emer_tel: `(62) 9${2000 + i * 13}-${5000 + i * 3}`,
        emer2_existe: i % 4 === 0 ? 'Sim' : 'Não',
        emer2_nome: i % 4 === 0 ? 'José ' + nome.split(' ').slice(-1)[0] : '',
        emer2_tel:  i % 4 === 0 ? `(62) 9${3000 + i}-${6000 + i}` : '',
        emer2_grau: i % 4 === 0 ? 'Pai' : '',
        alergia_b:  hasAlergia ? 'Sim' : 'Não',
        alergia_q:  hasAlergia ? 'Alergia a frutos do mar e amendoim.' : '',
        rest_b:     i % 6 === 0 ? 'Sim' : 'Não',
        rest_q:     i % 6 === 0 ? 'Intolerância à lactose.' : '',
        rest_alim:  i % 6 === 0 ? 'Leite e derivados' : '',
        medic_b:    hasMedic ? 'Sim' : 'Não',
        medic_q:    hasMedic ? 'Losartana 50mg — 8h da manhã' : '',
        hipertensao: i % 9 === 0 ? 'Sim' : 'Não',
        diabetes:    i % 11 === 0 ? 'Sim' : 'Não',
        cardiaco_b:  'Não',
        cardiaco_q:  '',
        convul:      'Não',
        defic_b:     'Não',
        defic_q:     '',
        acomp_b:     i % 8 === 0 ? 'Sim' : 'Não',
        acomp_q:     i % 8 === 0 ? 'Acompanhamento psicológico mensal.' : '',
        _declarado: 'Sim',
        _assinatura: nome,
        _assinadoEm: submittedAt,
      },
    };
  });

  return {
    events: [eventLive, eventScheduled, eventPast],
    responses,
    user: { name: 'Pra. Helena', email: 'helena@cura-avivamento.com.br' },
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const seeded = seedData();
      localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (e) {
    const seeded = seedData();
    localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function saveStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
  _storeListeners.forEach(l => l(data));
}

function resetStore() {
  localStorage.removeItem(STORE_KEY);
  const seeded = seedData();
  localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
  _storeListeners.forEach(l => l(seeded));
  return seeded;
}

const _storeListeners = new Set();
function useStore() {
  const [data, setData] = useState(loadStore);
  useEffect(() => {
    const h = (d) => setData(d);
    _storeListeners.add(h);
    return () => _storeListeners.delete(h);
  }, []);

  const actions = useMemo(() => ({
    createEvent: (ev) => {
      const cur = loadStore();
      const event = { id: uid('evt'), createdAt: new Date().toISOString(), questions: DEFAULT_QUESTIONS, ...ev };
      cur.events.unshift(event);
      saveStore(cur);
      return event;
    },
    updateEvent: (id, patch) => {
      const cur = loadStore();
      cur.events = cur.events.map(e => e.id === id ? { ...e, ...patch } : e);
      saveStore(cur);
    },
    deleteEvent: (id) => {
      const cur = loadStore();
      cur.events = cur.events.filter(e => e.id !== id);
      cur.responses = cur.responses.filter(r => r.eventId !== id);
      saveStore(cur);
    },
    addResponse: (eventId, answers) => {
      const cur = loadStore();
      const resp = { id: uid('resp'), eventId, submittedAt: new Date().toISOString(), answers };
      cur.responses.push(resp);
      saveStore(cur);
      return resp;
    },
    deleteResponse: (id) => {
      const cur = loadStore();
      cur.responses = cur.responses.filter(r => r.id !== id);
      saveStore(cur);
    },
  }), []);

  return [data, actions];
}

Object.assign(window, { useStore, loadStore, saveStore, resetStore, DEFAULT_QUESTIONS, THEMES });
