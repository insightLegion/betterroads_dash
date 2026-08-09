import { useMemo, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AREAS, severityColorHex } from '../../data/areas.js';
import { useAppState } from '../../context/AppState.jsx';
import LocationDetail from './LocationDetail.jsx';
import RoadDetail from './RoadDetail.jsx';

gsap.registerPlugin(useGSAP);

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

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

  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  const entries = useMemo(() => Object.entries(AREAS), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      ([, a]) =>
        a.name.toLowerCase().includes(q) ||
        a.ward.toLowerCase().includes(q) ||
        a.roads.some((r) => r.toLowerCase().includes(q))
    );
  }, [entries, query]);

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
    { dependencies: [filtered.length, showRoadDetail, showLocationDetail], scope: containerRef }
  );

  const handleSelect = (id) => {
    setQuery('');
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

      {/* Search Input Area */}
      <div style={{ padding: '12px 16px', borderBottom: 'var(--border)' }}>
        <div
          style={{
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: 'var(--border)',
          }}
        >
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search area, road or ward"
            style={{
              border: 'none',
              background: 'transparent',
              flex: 1,
              fontSize: 13,
              padding: 0,
              outline: 'none',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear"
              style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1 }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Area Lists / Details */}
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
              {query
                ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}`
                : 'All monitored areas'}
            </div>
            {filtered.map(([id, area]) => (
              <AreaRow
                key={id}
                id={id}
                area={area}
                onSelect={handleSelect}
                monthIndex={selectedMonthIndex}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                No matches for “{query}”.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
