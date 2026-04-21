import { useState, useMemo } from 'react';
import { AREAS } from '../../data/areas.js';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return Object.entries(AREAS).filter(([, a]) =>
      a.name.toLowerCase().includes(q) ||
      a.ward.toLowerCase().includes(q) ||
      a.roads.some(r => r.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 400,
      width: 320,
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-float)',
        border: 'var(--border)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search area, road or ward..."
          style={{
            border: 'none',
            background: 'transparent',
            flex: 1,
            fontSize: 13,
            padding: 0,
            outline: 'none',
          }}
        />
      </div>
      {open && results.length > 0 && (
        <div style={{
          marginTop: 8,
          background: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-float)',
          border: 'var(--border)',
          overflow: 'hidden',
        }}>
          {results.map(([id, a]) => (
            <button
              key={id}
              onMouseDown={(e) => { e.preventDefault(); onSelect(id); setQuery(''); setOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: 13,
                borderBottom: 'var(--border)',
                background: 'var(--surface)',
              }}
            >
              <div style={{ fontWeight: 500 }}>{a.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>{a.ward} · Score {a.score}/100</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
