import { useMap } from 'react-leaflet';

const BTN = {
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--surface)',
  color: 'var(--text)',
};

export default function ZoomControl() {
  const map = useMap();

  return (
    <div
      style={{
        position: 'absolute',
        right: 16,
        bottom: 140,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-pop)',
        overflow: 'hidden',
        border: 'var(--border)',
      }}
    >
      <button
        aria-label="Zoom in"
        onClick={() => map.zoomIn()}
        style={{ ...BTN, borderBottom: 'var(--border)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <button
        aria-label="Zoom out"
        onClick={() => map.zoomOut()}
        style={{ ...BTN, borderBottom: 'var(--border)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      </button>
      <button
        aria-label="Reset view"
        onClick={() => map.setView([19.076, 72.8777], 11, { animate: true })}
        style={BTN}
        title="Reset to Mumbai overview"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
  );
}
