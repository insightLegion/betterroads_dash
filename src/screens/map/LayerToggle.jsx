const layers = [
  { id: 'condition', label: 'Condition' },
  { id: 'complaints', label: 'Complaints' },
  { id: 'history', label: 'History 6mo' },
];

export default function LayerToggle({ layer, setLayer }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: 16,
      zIndex: 400,
      display: 'flex',
      gap: 6,
      background: 'var(--surface)',
      padding: 4,
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-float)',
      border: 'var(--border)',
    }}>
      {layers.map(l => {
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
  );
}
