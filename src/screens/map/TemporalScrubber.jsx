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
          { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.5)' }
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
        width: 'min(620px, calc(100% - 160px))',
        height: 42,
        borderRadius: 24,
        padding: '0 16px',
        zIndex: 500,
        boxShadow: '0 12px 28px -6px rgba(10, 10, 10, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      {/* Left: Info Label & Active Month */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            color: '#8f8b85',
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
            fontSize: 12.5,
            fontWeight: 800,
            color: '#ffffff',
            background: '#e0611c',
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {label}
        </span>
      </div>

      {/* Center: Minimalist Slider */}
      <div
        ref={trackRef}
        onPointerDown={handleDown}
        style={{
          flex: 1,
          position: 'relative',
          height: '100%',
          cursor: 'pointer',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          minWidth: 120,
        }}
      >
        {/* Track Line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 3,
            background: '#e7e5e2',
            borderRadius: 1.5,
          }}
        />

        {/* Fill Line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: `${pct}%`,
            height: 3,
            background: '#e0611c',
            borderRadius: 1.5,
          }}
        />

        {/* Handle */}
        <div
          style={{
            position: 'absolute',
            left: `${pct}%`,
            transform: 'translateX(-50%)',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#ffffff',
            border: '2.5px solid #e0611c',
            boxShadow: '0 2px 6px rgba(224, 97, 28, 0.4)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Right: Reset Action / Status */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {!isLatest ? (
          <button
            onClick={() => setSelectedMonthIndex(LAST_INDEX)}
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#e0611c',
              background: 'var(--accent-soft)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Jump to current →
          </button>
        ) : (
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: '#a8a29e',
              textTransform: 'uppercase',
            }}
          >
            LATEST
          </span>
        )}
      </div>
    </div>
  );
}
