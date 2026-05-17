// Brand atoms: logo lockup, marks, decorative motifs.

function LogoMark({ size = 44, ring = true }) {
  const ringStyle = ring ? {
    padding: '3px',
    background: 'conic-gradient(from 90deg, #FF2E8A, #8B3DD9, #3D8BFF, #FF7A2E, #FF2E8A)',
    borderRadius: '50%',
  } : { borderRadius: '50%' };
  return (
    <div style={{ width: size, height: size, ...ringStyle, flexShrink: 0 }}>
      <img src="assets/logo-lion.jpeg" alt="Ministério Cura e Avivamento"
        style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block', background: '#08081A' }} />
    </div>
  );
}

function BrandLockup({ size = 'md' }) {
  const big = size === 'lg';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <LogoMark size={big ? 64 : 44} />
      <div style={{ lineHeight: 1.1 }}>
        <div className="font-script" style={{ fontSize: big ? 28 : 20, color: '#FF5BA8', marginBottom: -4 }}>Cura & Avivamento</div>
        <div className="font-display" style={{ fontSize: big ? 14 : 11, letterSpacing: '0.18em', fontWeight: 600 }}>MINISTÉRIO CURA E AVIVAMENTO</div>
        {big && <div style={{ fontSize: 9, letterSpacing: '0.32em', color: 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase' }}>Apóstolo Ricardo Costa</div>}
      </div>
    </div>
  );
}

// SVG icon set — minimal stroke icons
function Icon({ name, size = 18, color = 'currentColor', stroke = 1.6 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:      <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
    calendar:  <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
    chart:     <><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></>,
    settings:  <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    plus:      <><path d="M12 5v14M5 12h14" /></>,
    link:      <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>,
    copy:      <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    download:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></>,
    eye:       <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
    edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    trash:     <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>,
    arrow:     <><path d="M5 12h14M13 5l7 7-7 7" /></>,
    arrowL:    <><path d="M19 12H5M11 19l-7-7 7-7" /></>,
    check:     <path d="M20 6L9 17l-5-5" />,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>,
    pdf:       <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></>,
    excel:     <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9l6 6M15 9l-6 6" /></>,
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
    sparkle:   <><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" /></>,
    qr:        <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1" /></>,
    search:    <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
    clock:     <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    grip:      <><circle cx="9" cy="5" r="1" fill={color}/><circle cx="9" cy="12" r="1" fill={color}/><circle cx="9" cy="19" r="1" fill={color}/><circle cx="15" cy="5" r="1" fill={color}/><circle cx="15" cy="12" r="1" fill={color}/><circle cx="15" cy="19" r="1" fill={color}/></>,
    x:         <><path d="M18 6L6 18M6 6l12 12" /></>,
  };
  return <svg {...props}>{paths[name] || null}</svg>;
}

// DNA helix decorative element — used as background flourish
function DNAStrand({ width = 200, height = 60, opacity = 0.3 }) {
  const points = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const yA = height / 2 + Math.sin(i / steps * Math.PI * 4) * (height / 2 - 8);
    const yB = height / 2 - Math.sin(i / steps * Math.PI * 4) * (height / 2 - 8);
    points.push({ x, yA, yB });
  }
  const pathA = points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.yA}`).join(' ');
  const pathB = points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.yB}`).join(' ');
  return (
    <svg width={width} height={height} style={{ opacity }}>
      <defs>
        <linearGradient id="dna1" x1="0" x2="1">
          <stop offset="0%" stopColor="#FF2E8A" />
          <stop offset="50%" stopColor="#8B3DD9" />
          <stop offset="100%" stopColor="#3D8BFF" />
        </linearGradient>
      </defs>
      <path d={pathA} stroke="url(#dna1)" strokeWidth="2" fill="none" />
      <path d={pathB} stroke="url(#dna1)" strokeWidth="2" fill="none" />
      {points.filter((_, i) => i % 2 === 0).map((p, i) => (
        <line key={i} x1={p.x} y1={p.yA} x2={p.x} y2={p.yB} stroke="url(#dna1)" strokeWidth="1" opacity="0.5" />
      ))}
    </svg>
  );
}

// Decorative background ambience
function Ambient({ dna = false }) {
  return (
    <>
      <div className="aurora"><div className="blob3"></div></div>
      {dna && <div className="dna-bg"></div>}
    </>
  );
}

Object.assign(window, { LogoMark, BrandLockup, Icon, DNAStrand, Ambient });
