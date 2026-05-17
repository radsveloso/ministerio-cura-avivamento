// UI primitives: Toast system, Modal, useNav hook, helpers.

const { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } = React;

// ------- Toast bus (singleton)
const _toastListeners = new Set();
let _toastId = 0;
function toast(msg, opts = {}) {
  const id = ++_toastId;
  const t = { id, msg, kind: opts.kind || 'info', icon: opts.icon };
  _toastListeners.forEach(l => l({ add: t }));
  setTimeout(() => _toastListeners.forEach(l => l({ remove: id })), opts.duration || 3200);
}

function ToastStack() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const handler = (e) => {
      if (e.add) setItems(p => [...p, e.add]);
      if (e.remove) setItems(p => p.filter(x => x.id !== e.remove));
    };
    _toastListeners.add(handler);
    return () => _toastListeners.delete(handler);
  }, []);
  return (
    <div className="toast-stack">
      {items.map(t => (
        <div key={t.id} className="toast">
          <Icon name={t.icon || 'sparkle'} size={16} color="#FF5BA8" />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ------- Modal
function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div className="modal-stage" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        <div>{children}</div>
        {actions && <div className="modal-actions" style={{ marginTop: 22 }}>{actions}</div>}
      </div>
    </div>
  );
}

// ------- Navigation — hash-based simple router
function parseHash() {
  const h = window.location.hash.replace(/^#\/?/, '');
  const [path, query] = h.split('?');
  const parts = path.split('/').filter(Boolean);
  return { parts, query: query || '' };
}
function navigate(path) {
  window.location.hash = path;
}

function useRoute() {
  const [route, setRoute] = useState(parseHash());
  useEffect(() => {
    const h = () => setRoute(parseHash());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  return route;
}

// ------- Format helpers
function fmtDate(d, withTime = false) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return '—';
  const opts = { day: '2-digit', month: 'short', year: 'numeric' };
  if (withTime) { opts.hour = '2-digit'; opts.minute = '2-digit'; }
  return date.toLocaleDateString('pt-BR', opts);
}
function fmtDateShort(d) {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function timeAgo(d) {
  const ms = Date.now() - new Date(d).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const dd = Math.floor(h / 24);
  return `${dd}d`;
}
function uid(prefix = 'id') {
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}
function copyText(text) {
  navigator.clipboard?.writeText(text).then(() => toast('Copiado para a área de transferência', { icon: 'check' }));
}

// ------- Event status
function eventStatus(ev) {
  const now = new Date();
  const start = new Date(ev.startAt);
  const end = new Date(ev.endAt);
  if (now < start) return 'scheduled';
  if (now > end) return 'ended';
  return 'live';
}
function statusLabel(s) {
  return ({ scheduled: 'Agendado', live: 'Recebendo', ended: 'Encerrado', draft: 'Rascunho' })[s] || s;
}

// ------- Question types
const Q_TYPES = {
  text:    { label: 'Texto curto' },
  long:    { label: 'Texto longo' },
  date:    { label: 'Data' },
  number:  { label: 'Número' },
  email:   { label: 'E-mail' },
  phone:   { label: 'Telefone' },
  yesno:   { label: 'Sim / Não' },
  select:  { label: 'Múltipla escolha' },
  section: { label: '— Seção —' },
};

Object.assign(window, {
  toast, ToastStack, Modal, navigate, useRoute, parseHash,
  fmtDate, fmtDateShort, timeAgo, uid, copyText, eventStatus, statusLabel, Q_TYPES,
});
