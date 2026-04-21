function Card({ label, before, after, improved, regressed }) {
  const afterColor = improved ? 'var(--good)' : regressed ? 'var(--severe)' : 'var(--text)';
  return (
    <div style={{
      flex: 1,
      background: 'var(--surface)',
      border: 'var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: 16,
      minWidth: 0,
    }}>
      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 10,
        fontWeight: 500,
      }}>{label}</div>
      <div style={{
        fontSize: 13,
        color: 'var(--text-muted)',
        textDecoration: 'line-through',
        marginBottom: 4,
      }}>{before}</div>
      <div style={{ fontSize: 24, fontWeight: 500, color: afterColor }}>{after}</div>
    </div>
  );
}

export default function MetricCards({ metrics }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {metrics.map((m, i) => <Card key={i} {...m} />)}
    </div>
  );
}
