import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar.jsx';

gsap.registerPlugin(useGSAP);

const TOP_MAPPERS = [
  { rank: 1, name: 'Riya T.', city: 'Chennai', value: '1,420 km', roads: '84 roads', badge: '🥇 Top Mapper', avatar: 'RT', color: '#e0611c' },
  { rank: 2, name: 'Aarav Sharma', city: 'Mumbai', value: '1,180 km', roads: '62 roads', badge: '🥈 Master Sensor', avatar: 'AS', color: '#3b82f6' },
  { rank: 3, name: 'Ananya Gupta', city: 'Bengaluru', value: '940 km', roads: '49 roads', badge: '🥉 Route Tracker', avatar: 'AG', color: '#22c55e' },
  { rank: 4, name: 'Vikram Mehta', city: 'Mumbai', value: '820 km', roads: '41 roads', badge: 'Verified', avatar: 'VM', color: '#64748b' },
  { rank: 5, name: 'Siddharth Rao', city: 'Delhi NCR', value: '760 km', roads: '38 roads', badge: 'Verified', avatar: 'SR', color: '#64748b' },
  { rank: 6, name: 'Neha Patel', city: 'Ahmedabad', value: '690 km', roads: '31 roads', badge: 'Verified', avatar: 'NP', color: '#64748b' },
  { rank: 7, name: 'Pooja Nair', city: 'Kochi', value: '610 km', roads: '28 roads', badge: 'Verified', avatar: 'PN', color: '#64748b' },
  { rank: 8, name: 'Kabir Joshi', city: 'Pune', value: '540 km', roads: '24 roads', badge: 'Verified', avatar: 'KJ', color: '#64748b' },
];

const TOP_DONORS = [
  { rank: 1, name: 'Anika D.', city: 'Mumbai', value: '₹25,000', roads: 'Mobile Processing', badge: '👑 Sponsor', avatar: 'AD', color: '#e0611c' },
  { rank: 2, name: 'Rohan Verma', city: 'Bengaluru', value: '₹18,500', roads: 'Sensor Compute', badge: '💎 Patron', avatar: 'RV', color: '#3b82f6' },
  { rank: 3, name: 'Priya Sundaram', city: 'Chennai', value: '₹12,000', roads: 'API Mirroring', badge: '⭐ Benefactor', avatar: 'PS', color: '#22c55e' },
  { rank: 4, name: 'Karan Malhotra', city: 'Delhi NCR', value: '₹8,500', roads: 'Ward Analytics', badge: 'Donor', avatar: 'KM', color: '#64748b' },
  { rank: 5, name: 'Devendra Kulkarni', city: 'Mumbai', value: '₹6,000', roads: 'Data Hosting', badge: 'Donor', avatar: 'DK', color: '#64748b' },
];

const TOP_VALIDATORS = [
  { rank: 1, name: 'Manisha Kulkarni', city: 'Mumbai', value: '312 reports', roads: 'K-West Ward', badge: '🏆 Chief Auditor', avatar: 'MK', color: '#e0611c' },
  { rank: 2, name: 'Aditya Roy', city: 'Mumbai', value: '248 reports', roads: 'H-West Ward', badge: '🥈 SLA Tracker', avatar: 'AR', color: '#3b82f6' },
  { rank: 3, name: 'Divya Iyer', city: 'Bengaluru', value: '194 reports', roads: 'Indiranagar', badge: '🥉 Verifier', avatar: 'DI', color: '#22c55e' },
  { rank: 4, name: 'Tushar Saxena', city: 'Pune', value: '162 reports', roads: 'Kothrud Ward', badge: 'Verifier', avatar: 'TS', color: '#64748b' },
];

export default function ContributorsView() {
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' | 'lifetime'
  const [category, setCategory] = useState('mapping'); // 'mapping' | 'validating' | 'financial'
  const containerRef = useRef(null);

  const activeData = category === 'mapping' ? TOP_MAPPERS : category === 'validating' ? TOP_VALIDATORS : TOP_DONORS;
  const topThree = activeData.slice(0, 3);
  const remaining = activeData.slice(3);

  // GSAP animation for smooth tab changes & list stagger
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.4 } });
      tl.fromTo('.podium-card', { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, stagger: 0.1 })
        .fromTo('.leaderboard-row', { opacity: 0, x: -15 }, { opacity: 1, x: 0, stagger: 0.04 }, '-=0.2');
    },
    { dependencies: [category, timeframe], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100%',
        background: 'var(--surface-2)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Navbar />

      <main style={{ maxWidth: 1040, width: '100%', margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              background: 'var(--accent-soft)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            COMMUNITY &amp; IMPACT LEADERBOARD
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#0a0a0a',
              margin: '12px 0 6px',
              letterSpacing: '-0.03em',
            }}
          >
            BetterRoads Top Contributors
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
            Honoring citizen mappers, validators, and supporters mapping India's roads
          </p>
        </div>

        {/* Filters Header: Timeframe & Category Selector */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 28,
            background: 'var(--surface)',
            padding: 12,
            borderRadius: 16,
            border: 'var(--border)',
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'mapping', label: '🚗 Mapping (Km)' },
              { id: 'validating', label: '🛡️ Validating (Reports)' },
              { id: 'financial', label: '₹ Financial Contribution' },
            ].map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    background: active ? '#0a0a0a' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Timeframe Pill */}
          <div
            style={{
              display: 'flex',
              background: 'var(--surface-2)',
              padding: 3,
              borderRadius: 'var(--radius-pill)',
              border: 'var(--border)',
            }}
          >
            {[
              { id: 'monthly', label: 'Monthly' },
              { id: 'lifetime', label: 'Lifetime' },
            ].map((tf) => {
              const active = timeframe === tf.id;
              return (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    background: active ? 'var(--accent)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Podium Top 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {topThree.map((item) => (
            <div
              key={item.name}
              className="podium-card glass-panel"
              style={{
                borderRadius: 20,
                padding: 24,
                textAlign: 'center',
                background: 'var(--surface)',
                border: item.rank === 1 ? '2px solid var(--accent)' : 'var(--border)',
                boxShadow: item.rank === 1 ? '0 12px 32px rgba(224, 97, 28, 0.15)' : 'none',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: item.color,
                  color: '#ffffff',
                  fontSize: 20,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: `0 6px 16px ${item.color}44`,
                }}
              >
                {item.avatar}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>
                {item.badge}
              </div>
              <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                {item.name}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 10px' }}>{item.city}</p>
              <div
                className="mono font-display"
                style={{ fontSize: 24, fontWeight: 800, color: '#0a0a0a' }}
              >
                {item.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.roads}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table List */}
        <div
          className="glass-panel"
          style={{
            borderRadius: 20,
            background: 'var(--surface)',
            border: 'var(--border)',
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 16px 12px',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderBottom: '1px solid #e7e5e2',
            }}
          >
            <span>Rank &amp; Citizen</span>
            <span>City / Ward</span>
            <span style={{ textAlign: 'right' }}>Score / Contribution</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {remaining.map((item) => (
              <div
                key={item.name}
                className="leaderboard-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#faf9f6',
                  border: '1px solid #f0eee9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className="mono" style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', width: 24 }}>
                    #{item.rank}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#0a0a0a',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.badge}</div>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{item.city}</div>

                <div style={{ textAlign: 'right' }}>
                  <div className="mono font-display" style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.roads}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
