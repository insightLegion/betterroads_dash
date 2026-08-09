import { useMemo, useState } from 'react';
import { AREAS, severityColorHex } from '../../data/areas.js';
import { useAppState } from '../../context/AppState.jsx';
import LocationDetail from './LocationDetail.jsx';
import RoadDetail from './RoadDetail.jsx';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 20px',
        textAlign: 'left',
        borderBottom: 'var(--border)',
        background: 'var(--surface)',
        transition: 'background var(--ease)',
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{area.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {area.ward} · {area.severity}
        </div>
      </div>
      <span
        className="mono"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text)',
          fontVariantNumeric: 'tabular-nums',
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

  const entries = useMemo(() => Object.entries(AREAS), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(([, a]) =>
      a.name.toLowerCase().includes(q) ||
      a.ward.toLowerCase().includes(q) ||
      a.roads.some((r) => r.toLowerCase().includes(q))
    );
  }, [entries, query]);

  const handleSelect = (id) => {
    setQuery('');
    setSelectedRoad(null);
    onPickArea(id);
  };

  const showRoadDetail = Boolean(selectedRoad);
  const showLocationDetail = !showRoadDetail && Boolean(selectedAreaId);
  const showList = !showRoadDetail && !showLocationDetail;

  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        height: '100%',
        paddingTop: 48,
        background: 'var(--surface)',
        borderRight: 'var(--border)',
        boxShadow: 'var(--shadow-pop)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 500,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          borderBottom: 'var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
            }}
          >
            BR
          </div>
          <div>
            <div
              className="font-display"
              style={{ fontSize: 16, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em' }}
            >
              betterroads<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-caption)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Mumbai · BMC Wards
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 14px',
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
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                padding: '14px 20px 6px',
                fontWeight: 500,
              }}
            >
              {query ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}` : 'All monitored areas'}
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
