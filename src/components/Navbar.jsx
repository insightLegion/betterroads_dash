import { useAppState } from '../context/AppState.jsx';
import { AREAS } from '../data/areas.js';

const linkStyle = (active) => ({
  fontSize: 13,
  fontWeight: active ? 600 : 500,
  color: active ? 'var(--accent)' : 'var(--text-muted)',
  padding: '6px 12px',
  borderRadius: 'var(--radius-pill)',
  background: active ? 'var(--accent-soft)' : 'transparent',
  transition: 'color var(--ease), background var(--ease)',
});

export default function Navbar({ variant = 'default' }) {
  const { activeScreen, navigateTo, selectedMonthIndex } = useAppState();

  const totalRoads = Object.values(AREAS).reduce((acc, a) => acc + a.roads.length, 0);
  const avgScore = Math.round(
    Object.values(AREAS).reduce((acc, a) => acc + (a.history[selectedMonthIndex] ?? a.score), 0) /
      Object.keys(AREAS).length
  );

  if (variant === 'floating') {
    return (
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e7e5e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Brand & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigateTo('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 800,
              color: '#0a0a0a',
              letterSpacing: '-0.03em',
            }}
          >
            betterroads<span style={{ color: 'var(--accent)' }}>.</span>
          </button>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#8f8b85',
              textTransform: 'uppercase',
              borderLeft: '1px solid #e7e5e2',
              paddingLeft: 12,
            }}
          >
            PUBLIC PANEL · INDIA
          </span>
        </div>

        {/* Telemetry Stats Bar matching screenshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-muted)',
          }}
        >
          <div>
            <span style={{ color: '#0a0a0a', fontWeight: 800 }}>0</span> km ridden
          </div>
          <div style={{ color: '#d6d3ce' }}>•</div>
          <div>
            <span style={{ color: '#0a0a0a', fontWeight: 800 }}>{totalRoads}</span> road segments
          </div>
          <div style={{ color: '#d6d3ce' }}>•</div>
          <div>
            <span style={{ color: '#0a0a0a', fontWeight: 800 }}>0</span> events found
          </div>
          <div style={{ color: '#d6d3ce' }}>•</div>
          <div>
            <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{avgScore}</span> avg RQI
          </div>
        </div>

        {/* Actions Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            style={linkStyle(activeScreen === 'map')}
            onClick={() => navigateTo('map')}
          >
            Home
          </button>
          <button
            style={linkStyle(activeScreen === 'complaint')}
            onClick={() => navigateTo('complaint')}
          >
            File complaint
          </button>
          <a
            href="#get-app"
            onClick={(e) => {
              e.preventDefault();
              alert('BetterRoads App is coming soon to iOS & Android!');
            }}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent-soft)',
              textDecoration: 'none',
            }}
          >
            Get the app <span style={{ fontSize: 14 }}>→</span>
          </a>
          <div
            title="User Account"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#0a0a0a',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            MK
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav
      style={{
        height: 56,
        background: 'var(--surface)',
        borderBottom: 'var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 500,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigateTo('map')}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 800,
            color: '#0a0a0a',
            letterSpacing: '-0.03em',
          }}
        >
          betterroads<span style={{ color: 'var(--accent)' }}>.</span>
        </button>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#8f8b85',
            textTransform: 'uppercase',
            borderLeft: '1px solid #e7e5e2',
            paddingLeft: 12,
          }}
        >
          PUBLIC PANEL · INDIA
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={linkStyle(activeScreen === 'map')} onClick={() => navigateTo('map')}>
          Map
        </button>
        <button style={linkStyle(activeScreen === 'complaint')} onClick={() => navigateTo('complaint')}>
          File complaint
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-muted)',
            fontSize: 12,
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 500,
          }}
        >
          Mumbai, Maharashtra
        </span>
        <button
          onClick={() => navigateTo('complaint')}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 12,
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          Report issue
        </button>
      </div>
    </nav>
  );
}
