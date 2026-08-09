const LAYERS = [
  { id: 'condition', label: 'Condition' },
  { id: 'complaints', label: 'Complaints' },
  { id: 'history', label: 'History 6mo' },
];

export default function MapStyleChips({ layer, setLayer }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        top: 64,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: 260,
      }}
    >
      {/* ROAD QUALITY Card matching reference screenshot */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 16,
          padding: '14px 16px',
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#52504c',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 10,
          }}
        >
          ROAD QUALITY
        </div>

        {/* 0-100 Gradient Scale */}
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: 'linear-gradient(90deg, #ef4444 0%, #f97316 35%, #eab308 60%, #22c55e 100%)',
            marginBottom: 6,
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            fontWeight: 600,
            color: '#8f8b85',
            marginBottom: 12,
          }}
        >
          <span>0 - Poor</span>
          <span>100 - Good</span>
        </div>

        {/* Reported Event Marker Legend item */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px solid #f0eee9' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#0a0a0a',
              boxShadow: '0 0 0 2px rgba(10, 10, 10, 0.2)',
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 500, color: '#52504c' }}>
            Reported event <span style={{ color: '#8f8b85' }}>(potholes & more)</span>
          </span>
        </div>
      </div>

      {/* Layer selector pills */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          borderRadius: 'var(--radius-pill)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          alignSelf: 'flex-start',
        }}
      >
        {LAYERS.map((l) => {
          const active = layer === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setLayer(l.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                background: active ? '#0a0a0a' : 'transparent',
                color: active ? '#ffffff' : '#52504c',
                transition: 'all var(--ease)',
              }}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
