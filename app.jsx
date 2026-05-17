// Main app — routing + auth shell.

function App() {
  const [data, actions] = useStore();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('mca_auth') === '1');
  const route = useRoute();

  // First-time route default
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = authed ? '/dashboard' : '/login';
    }
  }, []);

  const onLogin = () => {
    sessionStorage.setItem('mca_auth', '1');
    setAuthed(true);
    navigate('/dashboard');
  };
  const onLogout = () => {
    sessionStorage.removeItem('mca_auth');
    setAuthed(false);
    navigate('/login');
  };

  const parts = route.parts;
  const first = parts[0] || (authed ? 'dashboard' : 'login');

  // Public route — accessible without auth
  if (first === 'i' && parts[1]) {
    return <PublicFormScreen data={data} actions={actions} slug={parts[1]} />;
  }

  if (!authed) {
    return <LoginScreen onLogin={onLogin} />;
  }

  // Authed routes
  if (first === 'dashboard') {
    return <DashboardScreen data={data} actions={actions} user={data.user} onLogout={onLogout} />;
  }
  if (first === 'new') {
    return <EventEditorScreen data={data} actions={actions} user={data.user} onLogout={onLogout} editId={null} />;
  }
  if (first === 'edit' && parts[1]) {
    return <EventEditorScreen data={data} actions={actions} user={data.user} onLogout={onLogout} editId={parts[1]} />;
  }
  if (first === 'event' && parts[1]) {
    return <EventDetailScreen data={data} actions={actions} user={data.user} onLogout={onLogout} eventId={parts[1]} />;
  }
  if (first === 'response' && parts[1]) {
    return <ResponseSheetScreen data={data} actions={actions} user={data.user} onLogout={onLogout} responseId={parts[1]} />;
  }

  // Fallback
  return <DashboardScreen data={data} actions={actions} user={data.user} onLogout={onLogout} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
