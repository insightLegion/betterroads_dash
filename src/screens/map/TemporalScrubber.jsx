import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAppState } from '../../context/AppState.jsx';
import { AREAS } from '../../data/areas.js';

gsap.registerPlugin(useGSAP);

const LABELS = AREAS['andheri-west'].historyLabels; // 12 labels (Apr 25 -> Apr 26)
const LAST_INDEX = LABELS.length - 1;

export default function TemporalScrubber() {
  const { selectedMonthIndex, setSelectedMonthIndex } = useAppState();
  const trackRef = useRef(null);
  const badgeRef = useRef(null);
  const draggingRef = useRef(false);

  // GSAP animation on month index change
  useGSAP(
    () => {
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { scale: 0.85, opacity: 0.6 },
          { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.7)' }
        );
      }
    },
    { dependencies: [selectedMonthIndex] }
  );

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
        width: 'min(680px, calc(100% - 160px))',
        borderRadius: 24,
        padding: '12px 24px 14px',
        zIndex: 500,
        boxShadow: '0 16px 36px -10px rgba(10, 10, 10, 0.16)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Scrubber Top Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent)',
            }}
          />
          <span
            className="font-display"
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#0a0a0a',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            HISTORICAL TIMELINE
          </span>
          <span
            ref={badgeRef}
            className="mono"
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#ffffff',
              background: '#0a0a0a',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              letterSpacing: '0.02em',
            }}
          >
            {label}
          </span>
        </div>

        {!isLatest ? (
          <button
            onClick={() => setSelectedMonthIndex(LAST_INDEX)}
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--accent)',
              background: 'var(--accent-soft)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 150ms ease',
            }}
          >
            Jump to current →
          </button>
        ) : (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Latest Data
          </span>
        )}
      </div>

      {/* Track & Slider */}
      <div
        ref={trackRef}
        onPointerDown={handleDown}
        style={{
          position: 'relative',
          height: 24,
          cursor: 'pointer',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Base Track */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 5,
            background: '#e7e5e2',
            borderRadius: 3,
          }}
        />

        {/* Active Fill Track */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: `${pct}%`,
            height: 5,
            background: 'linear-gradient(90deg, #e0611c 0%, #f97316 100%)',
            borderRadius: 3,
          }}
        />

        {/* Month Ticks */}
        {LABELS.map((lbl, i) => {
          const p = (i / LAST_INDEX) * 100;
          const active = i === selectedMonthIndex;
          return (
            <div
              key={lbl}
              style={{
                position: 'absolute',
                left: `${p}%`,
                transform: 'translateX(-50%)',
                width: active ? 4 : 2,
                height: active ? 10 : 6,
                background: active ? 'var(--accent)' : '#a8a29e',
                borderRadius: 1,
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Handle */}
        <div
          style={{
            position: 'absolute',
            left: `${pct}%`,
            transform: 'translate(-50%, 0)',
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#ffffff',
            border: '3px solid var(--accent)',
            boxShadow: '0 2px 10px rgba(224, 97, 28, 0.4)',
            pointerEvents: 'none',
            transition: 'transform 100ms ease',
          }}
        />
      </div>

      {/* Bottom Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-muted)',
          padding: '0 2px',
        }}
      >
        <span>{LABELS[0]}</span>
        <span>{LABELS[Math.floor(LAST_INDEX / 2)]}</span>
        <span>{LABELS[LAST_INDEX]}</span>
      </div>
    </div>
  );
}
