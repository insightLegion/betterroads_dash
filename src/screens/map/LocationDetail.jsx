import { AREAS, scoreToSeverity, severityColorHex } from '../../data/areas.js';
import WardPill from '../../components/WardPill.jsx';
import ConditionCard from './ConditionCard.jsx';
import HistoryChart from './HistoryChart.jsx';
import EventsTimeline from './EventsTimeline.jsx';
import AuthorityChain from './AuthorityChain.jsx';
import { useAppState } from '../../context/AppState.jsx';

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 10,
        marginTop: 20,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

export default function LocationDetail({ areaId, onBack }) {
  const area = AREAS[areaId];
  const { navigateTo, selectedMonthIndex } = useAppState();
  if (!area) return null;

  const monthScore = area.history[selectedMonthIndex] ?? area.score;
  const monthSeverity = scoreToSeverity(monthScore);
  const monthLabel = area.historyLabels[selectedMonthIndex] ?? '';
  const viewingHistory = selectedMonthIndex !== area.history.length - 1;

  // Derive a month-specific area snapshot for ConditionCard so the big score
  // reflects the temporal scrubber, while keeping the static field values.
  const monthArea = {
    ...area,
    score: monthScore,
    severity: monthSeverity,
  };

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
          <div style={{ fontSize: 16, fontWeight: 500 }}>{area.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <WardPill ward={area.ward} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Last surveyed 2 days ago
            </span>
          </div>
        </div>
      </div>

      {viewingHistory && (
        <div
          style={{
            background: 'var(--accent-tint)',
            color: 'var(--accent)',
            fontSize: 11,
            padding: '6px 10px',
            borderRadius: 'var(--radius-pill)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 4,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: severityColorHex(monthSeverity),
            }}
          />
          Viewing {monthLabel}
        </div>
      )}

      <SectionTitle>Current condition</SectionTitle>
      <ConditionCard area={monthArea} />

      <SectionTitle>12-month history</SectionTitle>
      <HistoryChart history={area.history} labels={area.historyLabels} />

      <SectionTitle>Events</SectionTitle>
      <EventsTimeline area={area} />

      <SectionTitle>Authority chain</SectionTitle>
      <AuthorityChain area={area} />

      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => navigateTo('complaint', areaId)}
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
          File complaint for this road
        </button>
      </div>
    </div>
  );
}
