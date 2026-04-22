import { useAppState } from '../context/AppState.jsx';

const linkStyle = (active) => ({
  fontSize: 13,
  fontWeight: active ? 500 : 400,
  color: active ? 'var(--text)' : 'var(--text-muted)',
  padding: '6px 12px',
  borderRadius: 'var(--radius-pill)',
  background: active ? 'var(--accent-tint)' : 'transparent',
  transition: 'color var(--ease), background var(--ease)',
});

/**
 * Navbar supports two variants:
 *  - default: traditional full-width top bar (used by Complaint screen)
 *  - floating: a top-right pill group that floats over the map chrome
 */
export default function Navbar({ variant = 'default' }) {
  const { activeScreen, navigateTo } = useAppState();

  if (variant === 'floating') {
    return (
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--surface)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-pop)',
          padding: 4,
          zIndex: 600,
        }}
      >
        <button style={linkStyle(activeScreen === 'map')} onClick={() => navigateTo('map')}>Map</button>
        <button style={linkStyle(activeScreen === 'complaint')} onClick={() => navigateTo('complaint')}>File complaint</button>
        <div
          title="Account"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 500,
            marginLeft: 4,
            marginRight: 2,
          }}
        >
          MK
        </div>
      </div>
    );
  }

  return (
    <nav
      style={{
        height: 64,
        minHeight: 64,
        background: 'var(--surface)',
        borderBottom: 'var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 24,
        zIndex: 500,
      }}
    >
      <button
        onClick={() => navigateTo('map')}
        style={{
          color: 'var(--accent)',
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: -0.2,
        }}
      >
        Better Roads
      </button>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
        <button style={linkStyle(activeScreen === 'map')} onClick={() => navigateTo('map')}>Map</button>
        <button style={linkStyle(activeScreen === 'complaint')} onClick={() => navigateTo('complaint')}>File complaint</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-muted)',
            fontSize: 12,
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          Mumbai, Maharashtra
        </span>
        <button
          onClick={() => navigateTo('complaint')}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 500,
            fontSize: 13,
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          Report issue
        </button>
      </div>
    </nav>
  );
}
