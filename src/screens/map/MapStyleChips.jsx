const LAYERS = [
  { id: 'condition', label: 'Condition' },
  { id: 'complaints', label: 'Complaints' },
  { id: 'history', label: 'History 6mo' },
];

const LEGEND = [
  { label: 'Good', color: 'var(--good)' },
  { label: 'Minor', color: 'var(--minor)' },
  { label: 'Poor', color: 'var(--poor)' },
  { label: 'Severe', color: 'var(--severe)' },
];

export default function MapStyleChips({ layer, setLayer }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        bottom: 140,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 6,
          background: 'var(--surface)',
          padding: 4,
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-pop)',
          border: 'var(--border)',
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
                fontWeight: active ? 500 : 400,
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#fff' : 'var(--text-muted)',
                transition: 'all var(--ease)',
              }}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-float)',
          border: 'var(--border)',
          padding: '10px 12px',
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
          Road condition
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {LEGEND.map((r) => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
              <span style={{ fontSize: 11 }}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
