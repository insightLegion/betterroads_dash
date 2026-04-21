import { PWD_STATE } from '../../data/pwd.js';

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" style={{ transform: 'rotate(90deg)' }}>
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Card({ primary, children }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: 'var(--border)',
      borderLeft: primary ? '3px solid var(--severe)' : 'var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: 12,
      marginBottom: 8,
    }}>{children}</div>
  );
}

function StatTile({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--surface-2)',
      borderRadius: 'var(--radius-sm)',
      padding: 10,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: color || 'var(--text)' }}>{value}</div>
    </div>
  );
}

function Title({ children }) {
  return (
    <div style={{
      fontSize: 11,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      fontWeight: 500,
      marginBottom: 10,
      marginTop: 18,
    }}>{children}</div>
  );
}

export default function FilingPanel({ area }) {
  return (
    <aside style={{
      width: 320,
      minWidth: 320,
      background: 'var(--surface)',
      border: 'var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: 20,
      alignSelf: 'flex-start',
      position: 'sticky',
      top: 24,
    }}>
      <div style={{ fontSize: 16, fontWeight: 500 }}>Filing to</div>

      <Title>Primary recipient</Title>
      <Card primary>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{area.ward}</div>
        <div style={{ fontSize: 12, marginTop: 2 }}>{area.wardOfficer}</div>
        <a href={`mailto:${area.wardEmail}`} style={{ fontSize: 12 }}>{area.wardEmail}</a>
      </Card>

      <Title>CC — escalation</Title>
      <Card>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Additional Chief Secretary, PWD</div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{PWD_STATE.additionalCS}</div>
        <a href={`mailto:${PWD_STATE.additionalCSEmail}`} style={{ fontSize: 12 }}>{PWD_STATE.additionalCSEmail}</a>
      </Card>
      <Card>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Minister, PWD Maharashtra</div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{PWD_STATE.minister}</div>
        <a href={`mailto:${PWD_STATE.ministerEmail}`} style={{ fontSize: 12 }}>{PWD_STATE.ministerEmail}</a>
      </Card>

      <Title>Complaint stats for {area.name}</Title>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <StatTile label="Total filed" value={area.stats.total} />
        <StatTile label="Resolved" value={area.stats.resolved} color="var(--good)" />
        <StatTile label="Pending" value={area.stats.pending} color="var(--minor)" />
        <StatTile label="No response" value={area.stats.noResponse} color="var(--severe)" />
        <StatTile label="Avg days to resolve" value={`${area.stats.avgDays} d`} />
      </div>

      <Title>Escalation path</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {['Ward officer', 'AMC', 'PWD State', 'RTI / CM Portal'].map((step, i, arr) => (
          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{
              background: 'var(--surface-2)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              fontWeight: 500,
              width: '100%',
            }}>{step}</div>
            {i < arr.length - 1 && <div style={{ padding: '4px 0 4px 12px' }}><Arrow /></div>}
          </div>
        ))}
      </div>

      {area.slaBreach > 0 && (
        <div style={{
          marginTop: 18,
          background: 'rgba(226, 75, 74, 0.1)',
          borderLeft: '3px solid var(--severe)',
          color: 'var(--severe)',
          padding: 10,
          borderRadius: 'var(--radius-sm)',
          fontSize: 12,
          fontWeight: 500,
        }}>
          SLA overdue by {area.slaBreach} days
        </div>
      )}
    </aside>
  );
}
