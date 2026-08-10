import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AREAS, severityColorHex } from '../../data/areas.js';
import { useAppState } from '../../context/AppState.jsx';
import LocationDetail from './LocationDetail.jsx';
import RoadDetail from './RoadDetail.jsx';

gsap.registerPlugin(useGSAP);

function AreaRow({ id, area, onSelect, monthIndex }) {
  const score = area.history[monthIndex] ?? area.score;
  const color = severityColorHex(area.severity);
  return (
    <button
      onClick={() => onSelect(id)}
      className="area-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 20px',
        textAlign: 'left',
        borderBottom: 'var(--border)',
        background: 'transparent',
        transition: 'background 150ms ease',
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          boxShadow: `0 0 6px ${color}88`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{area.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {area.ward} · {area.severity}
        </div>
      </div>
      <span
        className="mono"
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--text)',
        }}
      >
        {score}
      </span>
    </button>
  );
}

export default function LeftSidebar({ onPickArea }) {
  const {
    selectedAreaId,
    setSelectedAreaId,
    selectedRoad,
    setSelectedRoad,
    selectedMonthIndex,
  } = useAppState();

  const containerRef = useRef(null);
  const entries = useMemo(() => Object.entries(AREAS), []);

  const showRoadDetail = Boolean(selectedRoad);
  const showLocationDetail = !showRoadDetail && Boolean(selectedAreaId);

  // GSAP animation for smooth stagger loading of area rows
  useGSAP(
    () => {
      gsap.fromTo(
        '.area-row',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' }
      );
    },
    { dependencies: [entries.length, showRoadDetail, showLocationDetail], scope: containerRef }
  );

  const handleSelect = (id) => {
    setSelectedRoad(null);
    onPickArea(id);
  };

  return (
    <aside
      ref={containerRef}
      className="glass-panel"
      style={{
        position: 'absolute',
        left: 16,
        top: 64,
        bottom: 16,
        width: 360,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
        overflow: 'hidden',
        boxShadow: '0 12px 32px -8px rgba(10, 10, 10, 0.12)',
      }}
    >
      {/* Sidebar Top Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e7e5e2',
        }}
      >
        <div
          className="font-display"
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#0a0a0a',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Mumbai · BMC Wards
        </div>
      </div>

      {/* Area Lists / Details (Search moved to top Navbar) */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {showRoadDetail ? (
          <RoadDetail
            selection={selectedRoad}
            onBack={() => setSelectedRoad(null)}
          />
        ) : showLocationDetail ? (
          <LocationDetail
            areaId={selectedAreaId}
            onBack={() => setSelectedAreaId(null)}
          />
        ) : (
          <div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--text-caption)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '14px 20px 6px',
                fontWeight: 700,
              }}
            >
              All monitored areas
            </div>
            {entries.map(([id, area]) => (
              <AreaRow
                key={id}
                id={id}
                area={area}
                onSelect={handleSelect}
                monthIndex={selectedMonthIndex}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
