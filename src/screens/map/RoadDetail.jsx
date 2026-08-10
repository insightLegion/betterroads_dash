import { getRoadDetails, severityColorHex } from '../../data/areas.js';
import WardPill from '../../components/WardPill.jsx';
import { useAppState } from '../../context/AppState.jsx';

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 12.5,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 10,
        marginTop: 20,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 12,
        padding: '8px 0',
        fontSize: 14.5,
        borderTop: 'var(--border)',
      }}
    >
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span
        className={mono ? 'mono' : ''}
        style={{ color: 'var(--text)', fontWeight: 600, textAlign: 'right' }}
      >
        {value}
      </span>
    </div>
  );
}

function StatusPill({ status }) {
  const palette = {
    Active: { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
    'Late stage': { bg: 'var(--average-light)', fg: '#8a5a10' },
    Expired: { bg: 'var(--severe-light)', fg: '#8a5a10' },
  }[status] || { bg: 'var(--surface-2)', fg: 'var(--text-muted)' };
  return (
    <span
      style={{
        display: 'inline-block',
        background: palette.bg,
        color: palette.fg,
        fontSize: 12.5,
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: 'var(--radius-pill)',
      }}
    >
      {status}
    </span>
  );
}

export default function RoadDetail({ selection, onBack }) {
  const { navigateTo, selectedMonthIndex } = useAppState();
  const road = getRoadDetails(selection.areaId, selection.roadName, selectedMonthIndex);
  if (!road) return null;

  const color = severityColorHex(road.severity);

  return (
    <div style={{ padding: '12px 20px 24px', color: 'var(--text)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
              }}
            />
            {road.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <WardPill ward={road.ward} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{road.areaName}</span>
          </div>
        </div>
      </div>

      {/* Condition snapshot */}
      <div
        style={{
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          padding: 16,
          marginBottom: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 8 }}>
          <span
            className="mono"
            style={{ fontSize: 42, fontWeight: 400, lineHeight: 1, letterSpacing: -1 }}
          >
            {road.score}
          </span>
          <span className="mono" style={{ fontSize: 16, color: 'var(--text-muted)', paddingBottom: 4 }}>
            /100
          </span>
        </div>
        <span
          style={{
            display: 'inline-block',
            background: color,
            color: '#fff',
            fontSize: 11,
            fontWeight: 500,
            padding: '2px 10px',
            borderRadius: 'var(--radius-pill)',
            marginBottom: 8,
          }}
        >
          {road.severity}
        </span>
        <Row label="Potholes detected" value={road.potholes} />
        <Row label="SLA window" value={`${road.slaDays} days`} />
      </div>

      {/* Contract / tender info */}
      <SectionTitle>Contract &amp; tender</SectionTitle>
      <div
        style={{
          background: 'var(--surface)',
          border: 'var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500 }}>
              Awarded to
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{road.contractor}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {road.contractorReg}
            </div>
          </div>
          <StatusPill status={road.contractStatus} />
        </div>

        <div style={{ marginTop: 14 }}>
          <Row label="Tender ID" value={road.tenderId} mono />
          <Row label="Work type" value={road.workType} />
          <Row label="Tender amount" value={road.tenderAmount} mono />
          <Row label="Contract start" value={road.contractStart} />
          <Row label="Contract end" value={road.contractEnd} />
        </div>

        <div style={{ marginTop: 14 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              color: 'var(--text-muted)',
              marginBottom: 6,
            }}
          >
            <span>Contract progress</span>
            <span className="mono" style={{ color: 'var(--text)', fontWeight: 500 }}>{road.progressPct}%</span>
          </div>
          <div
            style={{
              height: 4,
              background: 'rgba(0,0,0,0.08)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${road.progressPct}%`,
                background: 'var(--accent)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Responsibility */}
      <SectionTitle>Accountable authority</SectionTitle>
      <div
        style={{
          background: 'var(--surface)',
          border: 'var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 16,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500 }}>{road.responsibleOfficer}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{road.responsibleRole}</div>
        <Row label="Email" value={road.officerEmail} mono />
        <Row label="Phone" value={road.officerPhone} mono />
        <Row label="Awarded by" value={road.awardedBy} />
        <Row label="Sanction authority" value={road.sanctionAuthority} />
      </div>

      {/* Resolution steps */}
      <SectionTitle>How to get this fixed</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {road.resolution.map((step, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              background: 'var(--surface)',
              border: 'var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--accent-tint)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{step.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.45 }}>
                {step.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigateTo('complaint', road.areaId)}
          style={{
            width: '100%',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 500,
            padding: 12,
            borderRadius: 'var(--radius-sm)',
            fontSize: 14,
          }}
        >
          File complaint for {road.name}
        </button>
      </div>
    </div>
  );
}
