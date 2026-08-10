import { useState, useRef, useEffect } from 'react';
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
    icon: '⚠️',
  },
  {
    id: 'inc-2',
    title: 'Waterlogging at Juhu Junction',
    distance: '0.8 km away',
    time: '1 hour ago',
    severity: 'Moderate',
    color: '#f97316',
    icon: '🌧️',
  },
  {
    id: 'inc-3',
    title: 'Unpatched Trench on Link Road',
    distance: '1.4 km away',
    time: '3 hours ago',
    severity: 'Minor',
    color: '#eab308',
    icon: '🚧',
  },
];

const PAST_RESOLVED_REPORTS = [
  {
    ref: 'BR-2026-92810',
    title: 'Deep Pothole on JP Road',
    status: 'Resolved by BMC',
    date: '2 days ago',
    officer: 'Parag Masurkar (K/West)',
  },
  {
    ref: 'BR-2026-84102',
    title: 'Asphalt Erosion at Versova Jetty',
    status: 'Patched & Closed',
    date: '5 days ago',
    officer: 'PWD Executive Eng.',
  },
  {
    ref: 'BR-2026-78229',
    title: 'Drainage Overflow on Ceaser Rd',
    status: 'SLA Met in 48h',
    date: '1 week ago',
    officer: 'Sub Engineer PWD',
  },
];

export default function RightContributionPanel() {
  const { navigateTo } = useAppState();
  const panelRef = useRef(null);
  const [locationStatus, setLocationStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [coords, setCoords] = useState(null);

  // Request browser geolocation permission
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      setLocationStatus('requesting');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStatus('granted');
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn('Geolocation permission denied or unavailable', err);
          setLocationStatus('denied');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocationStatus('denied');
    }
  };

  useEffect(() => {
    // Auto-prompt location on panel mount
    requestLocation();
  }, []);

  // GSAP animations for ticker pulse & entrance
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.5 } });
      tl.fromTo(panelRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0 })
        .fromTo('.ticker-card', { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, stagger: 0.08 }, '-=0.2')
        .fromTo('.stat-box', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.06 }, '-=0.3')
        .fromTo('.incident-card', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.05 }, '-=0.2');
    },
    { scope: panelRef }
  );

  return (
    <div
      ref={panelRef}
      className="custom-scrollbar"
      style={{
        position: 'absolute',
        right: 16,
        top: 64,
        width: 330,
        maxHeight: 'calc(100vh - 160px)',
        overflowY: 'auto',
        background: 'rgba(10, 10, 10, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 18,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '16px',
        color: '#ffffff',
        zIndex: 500,
        boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Geolocation Status Banner */}
      <div
        style={{
          background:
            locationStatus === 'granted'
              ? 'rgba(34, 197, 94, 0.15)'
              : locationStatus === 'requesting'
              ? 'rgba(234, 179, 8, 0.15)'
              : 'rgba(255, 255, 255, 0.08)',
          border:
            locationStatus === 'granted'
              ? '1px solid rgba(34, 197, 94, 0.3)'
              : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 12,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background:
                locationStatus === 'granted'
                  ? '#22c55e'
                  : locationStatus === 'requesting'
                  ? '#eab308'
                  : '#a8a29e',
              boxShadow:
                locationStatus === 'granted' ? '0 0 8px #22c55e' : 'none',
            }}
          />
          <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {locationStatus === 'granted'
              ? `Live GPS Active (${coords ? `${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}` : 'Andheri West'})`
              : locationStatus === 'requesting'
              ? 'Requesting GPS permission...'
              : 'Live Location: Default Mumbai'}
          </span>
        </div>
        <button
          onClick={requestLocation}
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#38bdf8',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: 4,
          }}
        >
          {locationStatus === 'granted' ? 'Refreshed' : 'Enable'}
        </button>
      </div>

      {/* Header */}
      <div>
        <h2
          className="font-display"
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          India road quality
        </h2>
        <p
          style={{
            fontSize: 11,
            color: 'rgba(255, 255, 255, 0.65)',
            margin: '3px 0 0',
            lineHeight: 1.3,
          }}
        >
          9 visible roads from approved mobile sensor data
        </p>
      </div>

      {/* Live Activity Tickers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Teal Card: Live Road Mapping */}
        <div
          className="ticker-card"
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
            borderRadius: 14,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            minHeight: 120,
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
                <path d="M12 2v20M2 12h20" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.9)',
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
          <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.3, fontWeight: 500 }}>
            mapped 6.8 km in Chennai
          </div>
        </div>

        {/* Magenta/Orange Card: BetterRoads Contribution */}
        <div
          className="ticker-card"
          style={{
            background: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #e0611c 100%)',
            borderRadius: 14,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            minHeight: 120,
            boxShadow: '0 4px 14px rgba(224, 97, 28, 0.3)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#ffffff' }}>₹</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.9)',
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
          <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.3, fontWeight: 500 }}>
            contributed ₹2,500
          </div>
        </div>
      </div>

      {/* Mobile Sensor Profile Section */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 8 }}>
          Mobile sensor profile
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <StatBox
            label="Km mapped"
            value="1,84,260"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
          />
          <StatBox
            label="Contributors"
            value="42,819"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            }
          />
          <StatBox
            label="Validated"
            value="13,244"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* NEW: Recent Nearby Reports & Incidents */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)' }}>
            Recent Nearby Incidents
          </span>
          <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 600 }}>Nearby 2 km</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEARBY_INCIDENTS.map((item) => (
            <div
              key={item.id}
              className="incident-card"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                padding: '10px 12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
                  {item.icon} {item.title}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: `${item.color}22`,
                    color: item.color,
                    border: `1px solid ${item.color}44`,
                  }}
                >
                  {item.severity}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  fontSize: 10,
                  color: 'rgba(255, 255, 255, 0.55)',
                  marginTop: 6,
                }}
              >
                <span>📍 {item.distance}</span>
                <span>⏱️ {item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Past Reports History & Resolution Log */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255, 255, 255, 0.85)', marginBottom: 8 }}>
          Past Resolved History
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PAST_RESOLVED_REPORTS.map((rep) => (
            <div
              key={rep.ref}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 12,
                padding: '10px 12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
                  {rep.ref}
                </span>
                <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>
                  ✓ {rep.status}
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginTop: 4 }}>
                {rep.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  fontSize: 10,
                  color: 'rgba(255, 255, 255, 0.45)',
                  marginTop: 4,
                }}
              >
                <span>{rep.officer}</span>
                <span>{rep.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Link to Detailed Leaderboard Page */}
      <button
        onClick={() => navigateTo('contributors')}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'all 150ms ease',
          marginTop: 4,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent)';
          e.currentTarget.style.borderColor = 'var(--accent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        View Full Leaderboard &amp; Top Mappers →
      </button>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div
      className="stat-box"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <span className="mono" style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
        {value}
      </span>
    </div>
  );
}
