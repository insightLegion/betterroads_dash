export default function WardPill({ ward }) {
  return (
    <span style={{
      display: 'inline-block',
      background: 'var(--accent)',
      color: '#fff',
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 11,
      fontWeight: 500,
    }}>
      {ward}
    </span>
  );
}
