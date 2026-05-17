import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'

import HomePage from './components/HomePage'
import FormularioPublico from './components/FormularioPublico'
import ConfirmacaoInscricao from './components/ConfirmacaoInscricao'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import InscricoesView from './components/InscricoesView'

const ADMIN_PASS = 'cura2025'
const LS_AUTH = 'mca_admin_auth'
const LS_EVENTOS = 'mca_eventos'
const LS_INSCRICOES = 'mca_inscricoes'

const DataContext = createContext(null)
export const useData = () => useContext(DataContext)

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function DataProvider({ children }) {
  const [eventos, setEventos] = useState(() => loadJSON(LS_EVENTOS, []))
  const [inscricoes, setInscricoes] = useState(() => loadJSON(LS_INSCRICOES, []))

  useEffect(() => localStorage.setItem(LS_EVENTOS, JSON.stringify(eventos)), [eventos])
  useEffect(() => localStorage.setItem(LS_INSCRICOES, JSON.stringify(inscricoes)), [inscricoes])

  const api = useMemo(
    () => ({
      eventos,
      inscricoes,
      eventosAtivos: () => eventos.filter((e) => e.ativo !== false),
      criarEvento: (dados) => {
        const novo = {
          id: crypto.randomUUID(),
          ...dados,
          ativo: true,
          criadoEm: new Date().toISOString(),
        }
        setEventos((prev) => [novo, ...prev])
        return novo
      },
      atualizarEvento: (id, dados) =>
        setEventos((prev) => prev.map((e) => (e.id === id ? { ...e, ...dados } : e))),
      removerEvento: (id) => {
        setEventos((prev) => prev.filter((e) => e.id !== id))
        setInscricoes((prev) => prev.filter((i) => i.eventoId !== id))
      },
      eventoPorId: (id) => eventos.find((e) => e.id === id) || null,
      criarInscricao: (eventoId, dados) => {
        const nova = {
          id: crypto.randomUUID(),
          eventoId,
          ...dados,
          inscritoEm: new Date().toISOString(),
        }
        setInscricoes((prev) => [nova, ...prev])
        return nova
      },
      inscricoesPorEvento: (eventoId) => inscricoes.filter((i) => i.eventoId === eventoId),
    }),
    [eventos, inscricoes]
  )

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>
}

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => localStorage.getItem(LS_AUTH) === '1')

  const api = useMemo(
    () => ({
      auth,
      login: (senha) => {
        if (senha === ADMIN_PASS) {
          localStorage.setItem(LS_AUTH, '1')
          setAuth(true)
          return true
        }
        return false
      },
      logout: () => {
        localStorage.removeItem(LS_AUTH)
        setAuth(false)
      },
    }),
    [auth]
  )

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

function RequireAuth({ children }) {
  const { auth } = useAuth()
  return auth ? children : <Navigate to="/admin" replace />
}

function Header() {
  const { auth, logout } = useAuth()
  const { pathname } = useLocation()
  const onAdmin = pathname.startsWith('/admin')

  return (
    <header className="relative z-10 border-b border-gold-700/20 bg-ink-950/60 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-2xl text-gold-grad font-display select-none" aria-hidden>✝</span>
          <span className="leading-tight">
            <span className="block font-display text-[10px] tracking-[0.32em] text-gold-500/80 uppercase">
              Ministério
            </span>
            <span className="block font-display text-base sm:text-lg text-gold-grad tracking-wider">
              Cura &amp; Avivamento
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-xs sm:text-sm">
          {!onAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full border border-gold-700/30 text-gold-200/80 hover:border-gold-500/60 hover:text-gold-200 transition"
            >
              Área restrita
            </Link>
          )}
          {auth && onAdmin && (
            <>
              <Link
                to="/admin"
                className="px-4 py-2 rounded-full border border-gold-700/30 text-gold-200/80 hover:border-gold-500/60 hover:text-gold-200 transition"
              >
                Painel
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full bg-gold-700/20 border border-gold-600/40 text-gold-100 hover:bg-gold-700/40 transition"
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold-700/15 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-10 text-center">
        <div className="divider-ornament mb-6">
          <span className="text-gold-500/70 text-xl font-display">✦</span>
        </div>
        <p className="font-serif text-gold-200/70 text-lg italic">
          “Pela sua pisaduras fomos sarados.” — Isaías 53:5
        </p>
        <p className="mt-4 text-xs tracking-widest uppercase text-gold-700/70 font-display">
          Apóstolo Ricardo Costa · Ministério Cura e Avivamento
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <main className="relative z-10 flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/evento/:id" element={<FormularioPublico />} />
              <Route path="/inscricao/sucesso" element={<ConfirmacaoInscricao />} />
              <Route path="/admin" element={<AdminEntry />} />
              <Route
                path="/admin/evento/:id/inscricoes"
                element={
                  <RequireAuth>
                    <InscricoesView />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

function AdminEntry() {
  const { auth } = useAuth()
  return auth ? <AdminDashboard /> : <AdminLogin />
}
