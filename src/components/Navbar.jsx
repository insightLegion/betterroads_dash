import { useState, useMemo } from 'react';
import { AREAS } from '../data/areas.js';
import { useAppState } from '../context/AppState.jsx';

const linkStyle = (active) => ({
  fontSize: 15.5,
  fontWeight: active ? 700 : 500,
  color: active ? 'var(--accent)' : 'var(--text-muted)',
  padding: '7px 14px',
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
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

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
    setIsCityDropdownOpen(false);
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
          height: 56,
          flexShrink: 0,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e7e5e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          gap: 16,
          zIndex: 600,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        {/* BRAND & SUBTITLE WITH AMPLE RIGHT PADDING */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, paddingRight: 16 }}>
          <button
            onClick={() => navigateTo('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 800,
              color: '#0a0a0a',
              letterSpacing: '-0.03em',
            }}
          >
            betterroads<span style={{ color: 'var(--accent)' }}>.</span>
          </button>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#8f8b85',
              textTransform: 'uppercase',
              borderLeft: '1px solid #e7e5e2',
              paddingLeft: 12,
            }}
          >
            PUBLIC PANEL · INDIA
          </span>
        </div>

        {/* WIDER RIGHT-EXPANDED SEARCH BAR CONTAINER (HEIGHT 40PX) */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            maxWidth: isSearchFocused || searchQuery ? 760 : 680,
            minWidth: 240,
            marginLeft: 24,
            marginRight: 24,
            transition: 'max-width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f4f4f5',
              borderRadius: 99,
              padding: '2px 6px',
              height: 40,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              border: '1px solid #e4e4e7',
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
              borderColor: isSearchFocused || isCityDropdownOpen ? 'var(--accent)' : '#e4e4e7',
              boxShadow: isSearchFocused || isCityDropdownOpen ? '0 0 0 3px var(--accent-soft)' : '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {/* Custom Modern Rounded City Dropdown Trigger */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRight: '1px solid #e4e4e7',
                  background: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderBottom: 'none',
                  color: '#0f172a',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: '99px 0 0 99px',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e0611c" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{selectedCity}</span>
                <span style={{ fontSize: 12, color: '#71717a', transform: isCityDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }}>
                  ▾
                </span>
              </button>

              {/* Custom Floating City Menu with Modern Rounded Corners */}
              {isCityDropdownOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 44,
                    left: 0,
                    minWidth: 160,
                    borderRadius: 14,
                    padding: 8,
                    background: '#ffffff',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
                    border: '1px solid #e4e4e7',
                    zIndex: 750,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  {CITIES.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleCityChange(c.name)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: selectedCity === c.name ? 800 : 500,
                        color: selectedCity === c.name ? 'var(--accent)' : '#0f172a',
                        background: selectedCity === c.name ? 'var(--accent-soft)' : 'transparent',
                        textAlign: 'left',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 120ms ease',
                      }}
                      className="hover:bg-slate-100"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '2px 12px', minWidth: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.2" style={{ flexShrink: 0 }}>
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
                  minWidth: 0,
                  fontSize: 15.5,
                  color: '#0f172a',
                  outline: 'none',
                  padding: 0,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ fontSize: 16, color: '#71717a', cursor: 'pointer', flexShrink: 0 }}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Search Dropdown Results with Rounded Corners */}
          {isSearchFocused && searchResults.length > 0 && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 44,
                left: 0,
                right: 0,
                maxHeight: 260,
                overflowY: 'auto',
                borderRadius: 16,
                padding: 8,
                background: '#ffffff',
                boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
                border: '1px solid #e4e4e7',
                zIndex: 700,
              }}
            >
              {searchResults.map(([id, a]) => (
                <div
                  key={id}
                  onMouseDown={() => handleSelectSearchResult(id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  className="hover:bg-slate-100"
                >
                  <span style={{ fontWeight: 600, color: '#0a0a0a' }}>{a.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.ward}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FLUSHED RIGHTMOST ACTION CLUSTER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: 'auto', flexShrink: 0 }}>
          {/* Active Contributors Badge & Avatar Stack */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px #16a34a' }} />
              ACTIVE CONTRIBUTORS
            </div>

            {/* Overlapping Avatar Stack */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[
                { text: 'E', bg: '#ec4899' },
                { text: 'M', bg: '#14b8a6' },
                { text: 'P', bg: '#e0611c' },
                { text: '#8b5cf6', bg: '#8b5cf6' },
                { text: '+16', bg: '#334155' },
              ].map((av, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: av.bg,
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: idx === 0 ? 0 : -8,
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {av.text}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={linkStyle(activeScreen === 'map')} onClick={() => navigateTo('map')}>
              Home
            </button>
            <button style={linkStyle(activeScreen === 'complaint')} onClick={() => navigateTo('complaint')}>
              File complaint
            </button>
            <button
              onClick={() => navigateTo('login')}
              style={{
                fontSize: 15,
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
              Login <span style={{ fontSize: 14 }}>›</span>
            </button>
            <div
              title="User Profile (MK)"
              onClick={() => navigateTo('profile')}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: 13.5,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(224, 97, 28, 0.3)',
              }}
            >
              MK
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav
      style={{
        height: 62,
        flexShrink: 0,
        background: 'var(--surface)',
        borderBottom: 'var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 500,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => navigateTo('map')}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 800,
            color: '#0a0a0a',
            letterSpacing: '-0.03em',
          }}
        >
          betterroads<span style={{ color: 'var(--accent)' }}>.</span>
        </button>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#8f8b85',
            textTransform: 'uppercase',
            borderLeft: '1px solid #e7e5e2',
            paddingLeft: 14,
          }}
        >
          PUBLIC PANEL · INDIA
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => navigateTo('login')}
          style={{
            background: '#ffffff',
            color: '#0a0a0a',
            fontSize: 15,
            fontWeight: 700,
            padding: '7px 16px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid #cbd5e1',
            cursor: 'pointer',
          }}
        >
          Sign in
        </button>
        <span
          style={{
            background: 'var(--surface-2)',
            color: '#71717a',
            fontSize: 13.5,
            padding: '7px 14px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
          }}
        >
          Mumbai, Maharashtra
        </span>
        <button
          onClick={() => navigateTo('complaint')}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            padding: '9px 18px',
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(224, 97, 28, 0.25)',
          }}
        >
          Report issue
        </button>
        <div
          title="User Profile (MK)"
          onClick={() => navigateTo('profile')}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#ffffff',
            fontSize: 13.5,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(224, 97, 28, 0.3)',
          }}
        >
          MK
        </div>
      </div>
    </nav>
  );
}
