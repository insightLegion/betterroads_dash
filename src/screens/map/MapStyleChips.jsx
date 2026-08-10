export default function MapStyleChips() {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 330,
        zIndex: 500,
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e7e5e2',
        background: 'rgba(255, 255, 255, 0.94)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: '#52504c',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        ROAD QUALITY
      </div>

      {/* 0-100 Gradient Scale */}
      <div
        style={{
          height: 7,
          borderRadius: 4,
          background: 'linear-gradient(90deg, #ef4444 0%, #f97316 35%, #eab308 60%, #22c55e 100%)',
        }}
      />

      

      {/* NEW: Severity Category Pills (Severe, Poor, Minor, Good) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, paddingTop: 4 }}>
        {[
          { label: 'Severe', bg: '#ef4444' },
          { label: 'Poor', bg: '#f97316' },
          { label: 'Minor', bg: '#eab308' },
          { label: 'Good', bg: '#22c55e' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '3px 0',
              borderRadius: 6,
              background: `${item.bg}15`,
              color: item.bg,
              border: `1px solid ${item.bg}33`,
              fontSize: 10,
              fontWeight: 800,
              textAlign: 'center',
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Reported Event Marker Legend item */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 6, borderTop: '1px solid #f0eee9' }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#0a0a0a',
            boxShadow: '0 0 0 2px rgba(10, 10, 10, 0.15)',
          }}
        />
        <span style={{ fontSize: 11, fontWeight: 500, color: '#52504c' }}>
          Reported event <span style={{ color: '#8f8b85' }}>(potholes &amp; more)</span>
        </span>
      </div>
    </div>
  );
}
