#!/usr/bin/env bash
# Deploy script — Ministério Cura e Avivamento
# Uso: bash deploy.sh

set -e

cd "/Volumes/T5 EVO/IA/CLAUDE/Rafael/Projetos/ministerio-cura-avivamento"

echo "==> 1/5 Limpando arquivos temporários..."
rm -f .git/index.lock .git/_old_lock 2>/dev/null || true
find . -maxdepth 3 -name "*.bak*" -not -path "./_backup_vite/*" -delete 2>/dev/null || true
find . -name "._*" -delete 2>/dev/null || true
rm -rf _backup_vite 2>/dev/null || true

echo "==> 2/5 Configurando git..."
git config user.email "radsveloso@gmail.com"
git config user.name "Rafael Veloso"

echo "==> 3/5 Adicionando alterações..."
git add -A
# Não commitar uploads do user
git restore --staged "Form Cura Avivamento.zip" 2>/dev/null || true
git restore --staged "WhatsApp Image 2026-05-17 at 15.51.45.jpeg" 2>/dev/null || true
git restore --staged "WhatsApp Image 2026-05-17 at 15.52.31.jpeg" 2>/dev/null || true

echo "==> 4/5 Criando commit..."
git commit -m "feat: reconstrói plataforma com handoff design (single-file babel-standalone)

- Substitui Vite+Router (que travou em CSP/eval no GH Pages) por
  single-file HTML + babel-standalone do handoff do Designer
- Tema completo: aurora, leão circular, sidebar admin, public form,
  sheet PDF-style cream paper, exports PDF/XLSX
- Rebrand: Casa de Profetas -> Ministério Cura e Avivamento (Ap. Ricardo Costa)
- Senha admin: cura2025
- DEFAULT_QUESTIONS preservadas do Documento.docx
- Hash routing (sem BrowserRouter)
- netlify.toml + public/_headers para deploy estático no Netlify" || echo "(sem mudanças para commitar)"

echo "==> 5/5 Fazendo push..."
git push origin main

echo ""
echo "✓ Push concluído. Netlify deve fazer build automático em ~1 min."
echo "  Acompanhe em: https://app.netlify.com/teams/radsveloso/sites"
echo ""
echo "Para testar localmente: python3 -m http.server 5173 && abrir http://localhost:5173"
