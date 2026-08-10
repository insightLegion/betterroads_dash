import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAppState } from '../../context/AppState.jsx';

gsap.registerPlugin(useGSAP);

const NEARBY_INCIDENTS = [
  {
    id: 'inc-1',
    title: 'Pothole Cluster on SV Road',
    distance: '0.3 km away',
    time: '14 mins ago',
    severity: 'Severe',
    color: '#ef4444',
  },
  {
    id: 'inc-2',
    title: 'Waterlogging at Juhu Junction',
    distance: '0.8 km away',
    time: '1 hour ago',
    severity: 'Moderate',
    color: '#f97316',
  },
  {
    id: 'inc-3',
    title: 'Unpatched Trench on Link Road',
    distance: '1.4 km away',
    time: '3 hours ago',
    severity: 'Average',
    color: '#eab308',
  },
];

export default function RightContributionPanel() {
  const { navigateTo } = useAppState();
  const panelRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.4 } });
      tl.fromTo(panelRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0 })
        .fromTo('.ticker-card', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.06 }, '-=0.2')
        .fromTo('.stat-box', { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.05 }, '-=0.2');
    },
    { scope: panelRef }
  );

  return (
    <div
      ref={panelRef}
      className="glass-panel custom-scrollbar"
      style={{
        position: 'absolute',
        right: 16,
        top: 64,
        width: 330,
        maxHeight: 'calc(100vh - 225px)',
        overflowY: 'auto',
        borderRadius: 18,
        padding: 16,
        color: '#0a0a0a',
        zIndex: 500,
        boxShadow: '0 12px 32px -8px rgba(10, 10, 10, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header */}
      <div>
        <h2
          className="font-display"
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#0a0a0a',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          India Road Quality
        </h2>
        <p
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            margin: '3px 0 0',
            lineHeight: 1.3,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px #16a34a', flexShrink: 0 }} />
          9 visible roads · live sensor data
        </p>
      </div>

      {/* Live Activity Tickers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div
          className="ticker-card"
          style={{
            background: 'linear-gradient(135deg, #e0611c 0%, #f97316 100%)',
            borderRadius: 14,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 116,
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(224, 97, 28, 0.25)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M12 2v20M2 12h20" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.92)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                MAPPING LIVE
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
              Riya T.
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.3, fontWeight: 500 }}>
            mapped 6.8 km in Chennai
          </div>
        </div>

        <div
          className="ticker-card"
          style={{
            background: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
            borderRadius: 14,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 116,
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#ffffff' }}>₹</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.92)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                CONTRIBUTION
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
              Anika D.
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.3, fontWeight: 500 }}>
            contributed ₹2,500
          </div>
        </div>
      </div>

      {/* Expandable Link directly after Live Contribution & before Mobile Sensor Profile (as requested) */}
      <button
        onClick={() => navigateTo('contributors')}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: 10,
          background: 'var(--surface-2)',
          border: '1px solid #e7e5e2',
          color: 'var(--text)',
          fontSize: 11,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent-soft)';
          e.currentTarget.style.color = 'var(--accent)';
          e.currentTarget.style.borderColor = 'var(--accent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--surface-2)';
          e.currentTarget.style.color = 'var(--text)';
          e.currentTarget.style.borderColor = '#e7e5e2';
        }}
      >
        View Full Leaderboard &amp; Top Mappers →
      </button>

      {/* Mobile Sensor Profile Section (with fixed label/value spacing) */}
      <div style={{ borderTop: '1px solid #e7e5e2', paddingTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Mobile sensor profile
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <StatBox
            label="Km mapped"
            value="1,84,260"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
          />
          <StatBox
            label="Contributors"
            value="42,819"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            }
          />
          <StatBox
            label="Validated"
            value="13,244"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Recent Nearby Incidents Section */}
      <div style={{ borderTop: '1px solid #e7e5e2', paddingTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Recent Nearby Incidents
          </span>
          <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700 }}>Nearby 2 km</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEARBY_INCIDENTS.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--surface-2)',
                borderRadius: 10,
                padding: '10px 12px',
                border: '1px solid #e7e5e2',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0a0a0a' }}>
                  {item.title}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: `${item.color}15`,
                    color: item.color,
                    border: `1px solid ${item.color}33`,
                  }}
                >
                  {item.severity}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginTop: 2,
                }}
              >
                <span>{item.distance}</span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div
      className="stat-box"
      style={{
        background: 'var(--surface-2)',
        borderRadius: 8,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: '1px solid #e7e5e2',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        {icon}
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {label}
        </span>
      </div>
      <span className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#0a0a0a', flexShrink: 0, marginLeft: 'auto' }}>
        {value}
      </span>
    </div>
  );
}
