# Ministério Cura e Avivamento — Plataforma de Inscrição

Sistema de fichas de saúde / inscrição para eventos do **Ministério Cura e Avivamento** (Apóstolo Ricardo Costa).

## Stack

- **Frontend**: HTML + React 18 (via UMD) + Babel Standalone — sem build pipeline
- **Estilo**: CSS puro (design system Casa de Profetas adaptado)
- **Routing**: Hash-based (window.location.hash)
- **Persistência**: localStorage do navegador (chave `mca_v2`)
- **Exports**: jsPDF + SheetJS via CDN
- **Deploy**: Netlify (estático, sem build)

## Estrutura

```
.
├── index.html              # Entry point, carrega React + babel + scripts
├── styles.css              # Design system completo (aurora, paleta, tipografia)
├── app.jsx                 # Roteador principal hash-based
├── components/
│   ├── Brand.jsx           # Logo, lockup, ícones SVG, DNA, Ambient
│   ├── UI.jsx              # Toast, Modal, helpers, hooks
│   ├── store.jsx           # Store localStorage + DEFAULT_QUESTIONS + seed
│   └── exports.jsx         # PDF (jsPDF) e XLSX (SheetJS)
├── screens/
│   ├── Login.jsx           # Senha: cura2025
│   ├── Dashboard.jsx       # Lista de eventos + stats + ring chart
│   ├── EventEditor.jsx     # Criar/editar evento + perguntas
│   ├── EventDetail.jsx     # Inscrições do evento + filtros + exports
│   ├── PublicForm.jsx      # Form público step-by-step com countdown
│   └── ResponseSheet.jsx   # Ficha PDF-style cream paper
├── assets/
│   ├── logo-lion.jpeg
│   └── cover-eagle.jpeg
├── netlify.toml            # Config Netlify (publish=raiz, SPA redirect)
├── public/_headers         # CSP permissivo + segurança
└── deploy.sh               # Script de commit+push
```

## Rotas (hash-based)

- `/#/login` — tela de admin (senha `cura2025`)
- `/#/dashboard` — painel após login
- `/#/new` — criar evento
- `/#/edit/{id}` — editar evento
- `/#/event/{id}` — detalhe do evento + inscritos
- `/#/response/{id}` — ficha de saúde individual (PDF-style)
- `/#/i/{slug}` — formulário público (link compartilhável)

## Rodar local

```bash
cd "/Volumes/T5 EVO/IA/CLAUDE/Rafael/Projetos/ministerio-cura-avivamento"
python3 -m http.server 5173
# abrir http://localhost:5173
```

## Deploy

Site estático no Netlify. Basta `git push` para a `main` que o Netlify rebuilda automaticamente.

```bash
bash deploy.sh
```

## Credenciais admin

- **Senha**: `cura2025`
- Definida em `screens/Login.jsx` na constante `ADMIN_PASS`
