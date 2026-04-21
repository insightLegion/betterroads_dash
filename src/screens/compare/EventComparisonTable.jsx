export default function EventComparisonTable({ rows }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: 'var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr',
        padding: '10px 16px',
        fontSize: 11,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        fontWeight: 500,
        borderBottom: 'var(--border)',
      }}>
        <div>Event</div>
        <div>Before</div>
        <div>After</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          padding: '12px 16px',
          fontSize: 13,
          background: i % 2 === 1 ? 'var(--surface-2)' : 'var(--surface)',
        }}>
          <div style={{ color: 'var(--text-muted)' }}>{r.event}</div>
          <div style={{ fontWeight: 500 }}>{r.before}</div>
          <div style={{ fontWeight: 500, color: r.afterColor || 'var(--text)' }}>{r.after}</div>
        </div>
      ))}
    </div>
  );
}
