import { useRef, useState, useEffect } from 'react';
import { severityColorHex, scoreToSeverity } from '../../data/areas.js';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function RoadSvg({ score, potholes, monthLabel, seedBase }) {
  const severity = scoreToSeverity(score);
  const stroke = severityColorHex(severity);
  const rand = seededRandom(seedBase);
  const rows = [50, 100, 150, 200, 250];
  const holes = [];
  for (let i = 0; i < potholes; i++) {
    const rowIdx = Math.floor(rand() * rows.length);
    const x = 60 + rand() * 580;
    holes.push({ x, y: rows[rowIdx] });
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 700 300" preserveAspectRatio="none"
      style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: 'var(--border)', display: 'block' }}>
      <rect width="700" height="300" fill="#f7f8f6" />
      {rows.map(y => (
        <line key={y} x1="50" y1={y} x2="650" y2={y} stroke={stroke} strokeWidth="14" strokeLinecap="round" />
      ))}
      {holes.map((h, i) => (
        <ellipse key={i} cx={h.x} cy={h.y} rx="8" ry="4" fill="#4a2c1a" opacity="0.85" />
      ))}
      <text x="690" y="285" fontSize="11" fill="#6b7280" textAnchor="end">
        {monthLabel} · {score}/100
      </text>
    </svg>
  );
}

export default function SplitMap({ beforeScore, afterScore, beforePotholes, afterPotholes, beforeLabel, afterLabel, areaSeed }) {
  const [split, setSplit] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
      setSplit(pct);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 700,
        height: 300,
        userSelect: 'none',
        '--split': `${split}%`,
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <RoadSvg score={beforeScore} potholes={beforePotholes} monthLabel={beforeLabel} seedBase={areaSeed + beforeScore * 7} />
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        clipPath: `inset(0 calc(100% - ${split}%) 0 0)`,
      }}>
        <RoadSvg score={afterScore} potholes={afterPotholes} monthLabel={afterLabel} seedBase={areaSeed + afterScore * 13} />
      </div>

      <span style={{
        position: 'absolute', top: 12, left: 12,
        background: 'rgba(255,255,255,0.95)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        fontSize: 11,
        fontWeight: 500,
        boxShadow: 'var(--shadow-float)',
      }}>Before · {beforeLabel}</span>
      <span style={{
        position: 'absolute', top: 12, right: 12,
        background: 'rgba(255,255,255,0.95)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        fontSize: 11,
        fontWeight: 500,
        boxShadow: 'var(--shadow-float)',
      }}>After · {afterLabel}</span>

      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: `${split}%`,
        width: 2,
        background: 'var(--accent)',
        transform: 'translateX(-1px)',
        pointerEvents: 'none',
      }} />
      <div
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture?.(e.pointerId); }}
        style={{
          position: 'absolute',
          top: '50%',
          left: `${split}%`,
          width: 32, height: 32,
          transform: 'translate(-50%, -50%)',
          background: 'var(--accent)',
          borderRadius: '50%',
          border: '2px solid #fff',
          boxShadow: 'var(--shadow-float)',
          cursor: 'ew-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
          <path d="M9 6 3 12l6 6" />
          <path d="m15 6 6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}
