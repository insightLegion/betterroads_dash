import { useEffect, useMemo } from 'react';
import { AREAS, scoreToSeverity } from '../data/areas.js';
import { useAppState } from '../context/AppState.jsx';
import SeverityBadge from '../components/SeverityBadge.jsx';
import SplitMap from './compare/SplitMap.jsx';
import MetricCards from './compare/MetricCards.jsx';
import EventComparisonTable from './compare/EventComparisonTable.jsx';
import InsightBox from './compare/InsightBox.jsx';
import TimelineStrip from './compare/TimelineStrip.jsx';

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LabeledSelect({ label, value, onChange, children, badgeSeverity }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500 }}>{label}</label>
        {badgeSeverity && <SeverityBadge severity={badgeSeverity} size="sm" />}
      </div>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={onChange}
          style={{ width: '100%', appearance: 'none', paddingRight: 32 }}
        >
          {children}
        </select>
        <Chevron />
      </div>
    </div>
  );
}

export default function CompareView() {
  const {
    selectedAreaId, setSelectedAreaId,
    compareBeforeIndex, setCompareBeforeIndex,
    compareAfterIndex, setCompareAfterIndex,
  } = useAppState();

  const areaId = selectedAreaId && AREAS[selectedAreaId] ? selectedAreaId : 'andheri-west';
  const area = AREAS[areaId];

  useEffect(() => {
    if (!selectedAreaId) setSelectedAreaId('andheri-west');
  }, [selectedAreaId, setSelectedAreaId]);

  useEffect(() => {
    if (compareAfterIndex <= compareBeforeIndex) {
      setCompareAfterIndex(Math.min(11, compareBeforeIndex + 1));
    }
  }, [compareBeforeIndex, compareAfterIndex, setCompareAfterIndex]);

  const beforeScore = area.history[compareBeforeIndex];
  const afterScore = area.history[compareAfterIndex];
  const beforeLabel = area.historyLabels[compareBeforeIndex];
  const afterLabel = area.historyLabels[compareAfterIndex];
  const beforeSeverity = scoreToSeverity(beforeScore);
  const afterSeverity = scoreToSeverity(afterScore);
  const delta = afterScore - beforeScore;
  const improved = delta >= 10;
  const regressed = delta <= -10;

  const currentPotholes = area.potholes;
  const beforePotholes = Math.max(0, Math.round(currentPotholes * (beforeScore ? (afterScore / beforeScore) : 1)));
  const afterPotholes = currentPotholes;

  const monthsBetween = compareAfterIndex - compareBeforeIndex;
  const daysBetween = monthsBetween * 30;

  const areaSeed = useMemo(() => {
    let s = 0;
    for (let i = 0; i < areaId.length; i++) s = (s * 31 + areaId.charCodeAt(i)) | 0;
    return Math.abs(s);
  }, [areaId]);

  const metrics = [
    { label: 'Quality score', before: `${beforeScore}/100`, after: `${afterScore}/100`, improved, regressed },
    { label: 'Potholes', before: beforePotholes, after: afterPotholes, improved: afterPotholes < beforePotholes, regressed: afterPotholes > beforePotholes },
    { label: 'Severity', before: beforeSeverity, after: afterSeverity, improved, regressed },
    { label: 'Days between', before: `${daysBetween} d`, after: `${daysBetween} d` },
  ];

  const authorityBefore = 'Not notified';
  const authorityAfter = area.authorityNotified ? `Notified ${area.authorityNotified}` : 'Not notified';

  const tableRows = [
    { event: 'Quality score', before: `${beforeScore}/100`, after: `${afterScore}/100`, afterColor: improved ? 'var(--good)' : regressed ? 'var(--severe)' : 'var(--text)' },
    { event: 'Pothole count', before: beforePotholes, after: afterPotholes, afterColor: afterPotholes > beforePotholes ? 'var(--severe)' : afterPotholes < beforePotholes ? 'var(--good)' : 'var(--text)' },
    { event: 'Severity', before: beforeSeverity, after: afterSeverity },
    { event: 'Authority status', before: authorityBefore, after: authorityAfter },
    { event: 'Complaints filed', before: Math.max(0, area.complaints - 10), after: area.complaints },
  ];

  const handleTimelineClick = (i) => {
    if (i < compareAfterIndex) setCompareBeforeIndex(i);
    else if (i > compareBeforeIndex) setCompareAfterIndex(i);
  };

  return (
    <div style={{ display: 'flex', gap: 24, padding: 24, background: 'var(--surface-2)', height: '100%', overflow: 'auto' }}>
      <aside style={{
        width: 360,
        minWidth: 360,
        background: 'var(--surface)',
        border: 'var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 20,
        alignSelf: 'flex-start',
      }}>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Compare periods</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
          Pick any two months to see how conditions changed.
        </div>

        <LabeledSelect label="Area" value={areaId} onChange={(e) => setSelectedAreaId(e.target.value)} badgeSeverity={area.severity}>
          {Object.entries(AREAS).map(([id, a]) => (
            <option key={id} value={id}>{a.name}</option>
          ))}
        </LabeledSelect>

        <LabeledSelect label="Before" value={compareBeforeIndex} onChange={(e) => setCompareBeforeIndex(Number(e.target.value))} badgeSeverity={beforeSeverity}>
          {area.historyLabels.map((lbl, i) => (
            <option key={i} value={i} disabled={i >= compareAfterIndex}>{lbl} · {area.history[i]}/100</option>
          ))}
        </LabeledSelect>

        <LabeledSelect label="After" value={compareAfterIndex} onChange={(e) => setCompareAfterIndex(Number(e.target.value))} badgeSeverity={afterSeverity}>
          {area.historyLabels.map((lbl, i) => (
            <option key={i} value={i} disabled={i <= compareBeforeIndex}>{lbl} · {area.history[i]}/100</option>
          ))}
        </LabeledSelect>

        <div style={{
          marginTop: 20,
          padding: 14,
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}>
          Drag the vertical handle on the road diagram to reveal the after-state. Click any bar in the timeline strip below to change the comparison window.
        </div>
      </aside>

      <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: 'var(--surface)',
          border: 'var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 16,
        }}>
          <SplitMap
            beforeScore={beforeScore}
            afterScore={afterScore}
            beforePotholes={beforePotholes}
            afterPotholes={afterPotholes}
            beforeLabel={beforeLabel}
            afterLabel={afterLabel}
            areaSeed={areaSeed}
          />
        </div>

        <MetricCards metrics={metrics} />

        <EventComparisonTable rows={tableRows} />

        <InsightBox
          area={area}
          beforeScore={beforeScore}
          afterScore={afterScore}
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
          months={monthsBetween}
        />

        <TimelineStrip
          history={area.history}
          labels={area.historyLabels}
          beforeIndex={compareBeforeIndex}
          afterIndex={compareAfterIndex}
          onClick={handleTimelineClick}
        />
      </section>
    </div>
  );
}
