import { useCallback, useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppState.jsx';
import { AREAS } from '../../data/areas.js';

const LABELS = AREAS['andheri-west'].historyLabels; // all areas share the same 12 labels
const LAST_INDEX = LABELS.length - 1;

export default function TemporalScrubber() {
  const { selectedMonthIndex, setSelectedMonthIndex } = useAppState();
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  const positionToIndex = useCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return selectedMonthIndex;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(ratio * LAST_INDEX);
  }, [selectedMonthIndex]);

  const handleDown = (e) => {
    draggingRef.current = true;
    setSelectedMonthIndex(positionToIndex(e.clientX));
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      setSelectedMonthIndex(positionToIndex(e.clientX));
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [positionToIndex, setSelectedMonthIndex]);

  const pct = (selectedMonthIndex / LAST_INDEX) * 100;
  const label = LABELS[selectedMonthIndex];
  const isLatest = selectedMonthIndex === LAST_INDEX;

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 20,
        width: 'min(720px, calc(100% - 200px))',
        borderRadius: 20,
        padding: '14px 20px 16px',
        zIndex: 500,
        boxShadow: '0 12px 32px -8px rgba(10, 10, 10, 0.15)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
            Historical view
          </span>
          <span
            className="mono"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text)',
              background: 'var(--accent-tint)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {label}
          </span>
        </div>
        {!isLatest && (
          <button
            onClick={() => setSelectedMonthIndex(LAST_INDEX)}
            style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}
          >
            Jump to current
          </button>
        )}
      </div>

      <div
        ref={trackRef}
        onPointerDown={handleDown}
        style={{
          position: 'relative',
          height: 28,
          cursor: 'pointer',
          touchAction: 'none',
        }}
      >
        {/* track */}
        <div
          style={{
            position: 'absolute',
            top: 13,
            left: 0,
            right: 0,
            height: 2,
            background: 'rgba(0,0,0,0.08)',
            borderRadius: 1,
          }}
        />
        {/* filled track */}
        <div
          style={{
            position: 'absolute',
            top: 13,
            left: 0,
            width: `${pct}%`,
            height: 2,
            background: 'var(--accent)',
            borderRadius: 1,
          }}
        />
        {/* ticks */}
        {LABELS.map((lbl, i) => {
          const p = (i / LAST_INDEX) * 100;
          const active = i === selectedMonthIndex;
          return (
            <div
              key={lbl}
              style={{
                position: 'absolute',
                top: 10,
                left: `${p}%`,
                transform: 'translateX(-50%)',
                width: active ? 3 : 1,
                height: 8,
                background: active ? 'var(--accent)' : 'rgba(0,0,0,0.25)',
                borderRadius: 1,
                pointerEvents: 'none',
              }}
            />
          );
        })}
        {/* handle */}
        <div
          style={{
            position: 'absolute',
            top: 7,
            left: `${pct}%`,
            transform: 'translate(-50%, 0)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#fff',
            border: '2px solid var(--accent)',
            boxShadow: 'var(--shadow-float)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          color: 'var(--text-muted)',
          marginTop: 4,
        }}
      >
        <span>{LABELS[0]}</span>
        <span>{LABELS[LAST_INDEX]}</span>
      </div>
    </div>
  );
}
