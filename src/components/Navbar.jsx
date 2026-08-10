import { useState, useMemo } from 'react';
import { useAppState } from '../context/AppState.jsx';
import { AREAS } from '../data/areas.js';

const linkStyle = (active) => ({
  fontSize: 12,
  fontWeight: active ? 700 : 500,
  color: active ? 'var(--accent)' : 'var(--text-muted)',
  padding: '6px 12px',
  borderRadius: 'var(--radius-pill)',
  background: active ? 'var(--accent-soft)' : 'transparent',
  transition: 'color 150ms ease, background 150ms ease',
});

const CITIES = [
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, areaId: 'andheri-west' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, areaId: 'bandra-west' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, areaId: 'dadar-west' },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.209, areaId: 'borivali-west' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, areaId: 'vile-parle-west' },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673, areaId: 'kurla' },
];

export default function Navbar({ variant = 'default' }) {
  const { activeScreen, navigateTo, setSelectedAreaId, setSelectedRoad } = useAppState();
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return Object.entries(AREAS).filter(
      ([, a]) =>
        a.name.toLowerCase().includes(q) ||
        a.ward.toLowerCase().includes(q) ||
        a.roads.some((r) => r.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    const city = CITIES.find((c) => c.name === cityName);
    if (city) {
      setSelectedRoad(null);
      setSelectedAreaId(city.areaId);
      window.dispatchEvent(
        new CustomEvent('city-jump', { detail: { lat: city.lat, lng: city.lng, city: city.name } })
      );
    }
  };

  const handleSelectSearchResult = (id) => {
    setSelectedRoad(null);
    setSelectedAreaId(id);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  if (variant === 'floating') {
    return (
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e7e5e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Brand & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => navigateTo('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 800,
              color: '#0a0a0a',
              letterSpacing: '-0.03em',
            }}
          >
            betterroads<span style={{ color: 'var(--accent)' }}>.</span>
          </button>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#8f8b85',
              textTransform: 'uppercase',
              borderLeft: '1px solid #e7e5e2',
              paddingLeft: 10,
            }}
          >
            INDIA
          </span>
        </div>

        {/* WIDER MINIMALIST SEARCH BAR CONTAINER */}
        <div style={{ position: 'relative', width: 520, maxWidth: '42vw' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f4f4f5',
              borderRadius: 12,
              padding: '3px 6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              border: '1px solid #e4e4e7',
            }}
          >
            {/* City Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRight: '1px solid #e4e4e7', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e0611c" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0f172a',
                  fontSize: 12,
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  paddingRight: 4,
                }}
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name} style={{ background: '#ffffff', color: '#0f172a' }}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, contact or location..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  flex: 1,
                  fontSize: 13,
                  color: '#0f172a',
                  outline: 'none',
                  padding: 0,
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ fontSize: 14, color: '#71717a', cursor: 'pointer' }}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Search Dropdown Results */}
          {isSearchFocused && searchResults.length > 0 && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 42,
                left: 0,
                right: 0,
                maxHeight: 240,
                overflowY: 'auto',
                borderRadius: 12,
                padding: 6,
                background: '#ffffff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
                zIndex: 700,
              }}
            >
              {searchResults.map(([id, a]) => (
                <div
                  key={id}
                  onMouseDown={() => handleSelectSearchResult(id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                  }}
                  className="hover:bg-slate-100"
                >
                  <span style={{ fontWeight: 600, color: '#0a0a0a' }}>{a.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{a.ward}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Contributors in Current Viewport */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px #16a34a' }} />
              ACTIVE CONTRIBUTORS
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
              In current viewport
            </div>
          </div>

          {/* Overlapping Avatar Stack */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { text: 'E', bg: '#ec4899' },
              { text: 'M', bg: '#14b8a6' },
              { text: 'P', bg: '#e0611c' },
              { text: 'P', bg: '#8b5cf6' },
              { text: '+16', bg: '#334155' },
            ].map((av, idx) => (
              <div
                key={idx}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: av.bg,
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: idx === 0 ? 0 : -6,
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {av.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button style={linkStyle(activeScreen === 'map')} onClick={() => navigateTo('map')}>
            Home
          </button>
          <button style={linkStyle(activeScreen === 'complaint')} onClick={() => navigateTo('complaint')}>
            File complaint
          </button>
          <button
            onClick={() => navigateTo('login')}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#0a0a0a',
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Login <span style={{ fontSize: 13 }}>›</span>
          </button>
          <div
            title="User Profile (MK)"
            onClick={() => navigateTo('profile')}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e0611c 0%, #0a0a0a 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            MK
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav
      style={{
        height: 56,
        background: 'var(--surface)',
        borderBottom: 'var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 500,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigateTo('map')}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 800,
            color: '#0a0a0a',
            letterSpacing: '-0.03em',
          }}
        >
          betterroads<span style={{ color: 'var(--accent)' }}>.</span>
        </button>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#8f8b85',
            textTransform: 'uppercase',
            borderLeft: '1px solid #e7e5e2',
            paddingLeft: 12,
          }}
        >
          PUBLIC PANEL · INDIA
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={linkStyle(activeScreen === 'map')} onClick={() => navigateTo('map')}>
          Map
        </button>
        <button style={linkStyle(activeScreen === 'complaint')} onClick={() => navigateTo('complaint')}>
          File complaint
        </button>
        <button style={linkStyle(activeScreen === 'profile')} onClick={() => navigateTo('profile')}>
          Profile
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigateTo('login')}
          style={{
            background: 'transparent',
            color: 'var(--text)',
            fontSize: 12,
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid #e7e5e2',
            cursor: 'pointer',
          }}
        >
          Sign in
        </button>
        <span
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-muted)',
            fontSize: 12,
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 500,
          }}
        >
          Mumbai, Maharashtra
        </span>
        <button
          onClick={() => navigateTo('complaint')}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 12,
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
          }}
        >
          Report issue
        </button>
      </div>
    </nav>
  );
}
