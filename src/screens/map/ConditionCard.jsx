import SeverityBadge from '../../components/SeverityBadge.jsx';

function Row({ label, value, danger }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      fontSize: 13,
      borderTop: 'var(--border)',
    }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: danger ? 'var(--severe)' : 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function ConditionCard({ area }) {
  return (
    <div style={{
      background: 'var(--surface-2)',
      borderRadius: 'var(--radius-md)',
      padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 48, fontWeight: 500, lineHeight: 1 }}>{area.score}</span>
        <span style={{ fontSize: 18, color: 'var(--text-muted)', paddingBottom: 6 }}>/100</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <SeverityBadge severity={area.severity} />
      </div>
      <Row label="Potholes detected" value={area.potholes} />
      <Row label="Days unaddressed" value={area.daysUnaddressed} danger={area.daysUnaddressed > 30} />
      <Row label="SLA overdue" value={`${area.slaBreach} days`} danger={area.slaBreach > 0} />
      {area.slaBreach > 0 && (
        <div style={{
          marginTop: 12,
          marginLeft: -16,
          marginRight: -16,
          marginBottom: -16,
          padding: '10px 16px',
          background: 'rgba(226, 75, 74, 0.1)',
          borderTop: '0.5px solid var(--severe)',
          color: 'var(--severe)',
          fontSize: 12,
          fontWeight: 500,
          borderBottomLeftRadius: 'var(--radius-md)',
          borderBottomRightRadius: 'var(--radius-md)',
        }}>
          BMC 14-day SLA exceeded by {area.slaBreach} days
        </div>
      )}
    </div>
  );
}
