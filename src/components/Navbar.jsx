import { useAppState } from '../context/AppState.jsx';

const linkStyle = (active) => ({
  fontSize: 14,
  fontWeight: active ? 500 : 400,
  color: active ? 'var(--text)' : 'var(--text-muted)',
  padding: '8px 12px',
  transition: 'color var(--ease)',
});

export default function Navbar() {
  const { activeScreen, navigateTo } = useAppState();

  return (
    <nav style={{
      height: 64,
      minHeight: 64,
      background: 'var(--surface)',
      borderBottom: 'var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 24,
      zIndex: 500,
    }}>
      <div style={{
        color: 'var(--accent)',
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: -0.2,
      }}>
        BetterRoads
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
        <button style={linkStyle(activeScreen === 'map')} onClick={() => navigateTo('map')}>Map</button>
        <button style={linkStyle(activeScreen === 'compare')} onClick={() => navigateTo('compare')}>Compare</button>
        <button style={linkStyle(activeScreen === 'complaint')} onClick={() => navigateTo('complaint')}>File Complaint</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          background: 'var(--surface-2)',
          color: 'var(--text-muted)',
          fontSize: 12,
          padding: '6px 12px',
          borderRadius: 'var(--radius-pill)',
        }}>
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
