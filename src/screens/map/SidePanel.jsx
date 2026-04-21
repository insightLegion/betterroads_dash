import { AREAS } from '../../data/areas.js';
import WardPill from '../../components/WardPill.jsx';
import ConditionCard from './ConditionCard.jsx';
import HistoryChart from './HistoryChart.jsx';
import EventsTimeline from './EventsTimeline.jsx';
import AuthorityChain from './AuthorityChain.jsx';
import { useAppState } from '../../context/AppState.jsx';

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 11,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 10,
      marginTop: 20,
      fontWeight: 500,
    }}>
      {children}
    </div>
  );
}

export default function SidePanel({ areaId, onClose }) {
  const area = AREAS[areaId];
  const { navigateTo } = useAppState();
  if (!area) return null;

  return (
    <div
      key={areaId}
      className="panel-slide"
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 360,
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-float)',
        borderLeft: 'var(--border)',
        zIndex: 450,
        overflowY: 'auto',
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{area.name}</div>
          <div style={{ marginBottom: 6 }}><WardPill ward={area.ward} /></div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last surveyed 2 days ago</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <SectionTitle>Current condition</SectionTitle>
      <ConditionCard area={area} />

      <SectionTitle>12-month history</SectionTitle>
      <HistoryChart history={area.history} labels={area.historyLabels} />

      <SectionTitle>Events</SectionTitle>
      <EventsTimeline area={area} />

      <SectionTitle>Authority chain</SectionTitle>
      <AuthorityChain area={area} />

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
          File complaint
        </button>
        <button
          onClick={() => navigateTo('compare', areaId)}
          style={{
            width: '100%',
            background: 'var(--surface)',
            color: 'var(--accent)',
            fontWeight: 500,
            padding: 12,
            borderRadius: 'var(--radius-sm)',
            fontSize: 14,
            border: '0.5px solid var(--accent)',
          }}
        >
          Compare periods
        </button>
      </div>
    </div>
  );
}
