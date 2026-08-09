import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAppState } from '../context/AppState.jsx';
import Navbar from '../components/Navbar.jsx';

gsap.registerPlugin(useGSAP);

const COMPLAINTS_DATA = [
  {
    id: 'BR-2026-84920',
    road: 'Veera Desai Road',
    ward: 'K/West Ward',
    issue: 'Multiple potholes & asphalt erosion',
    date: 'Feb 3, 2026',
    status: 'SLA Overdue',
    statusBg: '#fef2f2',
    statusColor: '#ef4444',
    days: '88 days overdue',
  },
  {
    id: 'BR-2026-72911',
    road: 'Swami Vivekanand Road',
    ward: 'K/West Ward',
    issue: 'Deep trench after pipe repair',
    date: 'Jan 14, 2026',
    status: 'Resolved',
    statusBg: '#f0fdf4',
    statusColor: '#22c55e',
    days: 'Resolved in 6 days',
  },
  {
    id: 'BR-2026-51004',
    road: 'Juhu Tara Road',
    ward: 'K/West Ward',
    issue: 'Waterlogging & asphalt disintegration',
    date: 'Dec 28, 2025',
    status: 'Under Inspection',
    statusBg: '#fefce8',
    statusColor: '#eab308',
    days: 'Inspected on Jan 2',
  },
];

export default function ProfileView() {
  const { navigateTo } = useAppState();
  const containerRef = useRef(null);

  // GSAP animation for smooth entrance of profile sections & stat cards
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.5 } });
      tl.fromTo('.profile-header', { opacity: 0, y: -20 }, { opacity: 1, y: 0 })
        .fromTo('.stat-card', { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, stagger: 0.08 }, '-=0.2')
        .fromTo('.profile-section', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1 }, '-=0.3');
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-2)',
        overflowY: 'auto',
      }}
    >
      <Navbar />

      <main
        style={{
          maxWidth: 960,
          width: '100%',
          margin: '0 auto',
          padding: '32px 24px 64px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* User Hero Header Card */}
        <section
          className="profile-header glass-panel"
          style={{
            padding: 28,
            borderRadius: 20,
            background: 'var(--surface)',
            border: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            boxShadow: '0 8px 24px -4px rgba(10, 10, 10, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Avatar Circle */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e0611c 0%, #f97316 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(224, 97, 28, 0.3)',
                flexShrink: 0,
              }}
            >
              MK
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1
                  className="font-display"
                  style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: 0 }}
                >
                  Manisha Kulkarni
                </h1>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    background: 'var(--accent-soft)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  ✓ Verified Citizen Auditor
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, margin: 0 }}>
                Bandra West / K-West Ward · Mumbai, Maharashtra
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <span className="badge-pill">🏆 Top 5% Reporter</span>
                <span className="badge-pill">⚡ SLA Enforcer</span>
                <span className="badge-pill">🛡️ 284 km Telemetry</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigateTo('login')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid #e7e5e2',
                background: '#ffffff',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
            <button
              onClick={() => navigateTo('complaint')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(224, 97, 28, 0.25)',
              }}
            >
              + File Complaint
            </button>
          </div>
        </section>

        {/* Telemetry & Impact Stats Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          <StatCard label="Total Filed" value="14" subtext="Complaints submitted" color="#0a0a0a" />
          <StatCard label="Verified Hazards" value="11" subtext="Confirmed by PWD" color="var(--accent)" />
          <StatCard label="Resolution Rate" value="89%" subtext="Average 62 days SLA" color="#22c55e" />
          <StatCard label="Distance Telemetry" value="284 km" subtext="Ridden on sensor app" color="#3b82f6" />
        </section>

        {/* My Activity & Complaints Feed */}
        <section
          className="profile-section glass-panel"
          style={{
            padding: 24,
            borderRadius: 20,
            background: 'var(--surface)',
            border: 'var(--border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: '1px solid #e7e5e2',
            }}
          >
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              Filed Complaints & Tracker
            </h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>3 Active Complaints</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {COMPLAINTS_DATA.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid #f0eee9',
                  background: '#faf9f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                      {item.id}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                      {item.road}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({item.ward})</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {item.issue} · Filed {item.date}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      background: item.statusBg,
                      color: item.statusColor,
                      display: 'inline-block',
                    }}
                  >
                    {item.status}
                  </span>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {item.days}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Telemetry Devices & Sensors Info */}
        <section
          className="profile-section glass-panel"
          style={{
            padding: 24,
            borderRadius: 20,
            background: 'var(--surface)',
            border: 'var(--border)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          <div>
            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              Connected Sensors & Telemetry
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Your rides automatically sample Z-axis accelerometer bumps and compute RQI scores in real-time.
            </p>
            <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: '#22c55e' }}>
              ✓ React Native Sensor Engine v2.4 (Active)
            </div>
          </div>

          <div>
            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              Vehicle Profile
            </h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <div>Primary Vehicle: <strong style={{ color: 'var(--text)' }}>Honda City Sedan</strong></div>
              <div style={{ marginTop: 4 }}>Suspension Baseline: <strong style={{ color: 'var(--text)' }}>1.2 m/s² threshold</strong></div>
              <div style={{ marginTop: 4 }}>GPS Quantization Interval: <strong style={{ color: 'var(--text)' }}>5 meters</strong></div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .badge-pill {
          font-size: 11px;
          font-weight: 600;
          color: #57534e;
          background: #f5f5f4;
          border: 1px solid #e7e5e2;
          padding: 3px 8px;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, subtext, color }) {
  return (
    <div
      className="stat-card glass-panel"
      style={{
        padding: 20,
        borderRadius: 16,
        background: 'var(--surface)',
        border: 'var(--border)',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div className="font-display mono" style={{ fontSize: 26, fontWeight: 800, color: color, marginTop: 6, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{subtext}</div>
    </div>
  );
}
