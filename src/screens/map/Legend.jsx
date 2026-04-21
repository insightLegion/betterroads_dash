const rows = [
  { label: 'Good', color: 'var(--good)' },
  { label: 'Minor', color: 'var(--minor)' },
  { label: 'Poor', color: 'var(--poor)' },
  { label: 'Severe', color: 'var(--severe)' },
];

export default function Legend() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      right: 16,
      zIndex: 400,
      background: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-float)',
      border: 'var(--border)',
      padding: '12px 14px',
      minWidth: 140,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        Road condition
      </div>
      {rows.map(r => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '3px 0' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.color }} />
          <span style={{ fontSize: 12 }}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}
