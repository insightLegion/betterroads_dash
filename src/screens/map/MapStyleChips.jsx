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
        gap: 12,
      }}
    >
      {/* Header Title & Metric */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 800,
            color: '#52504c',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          ROAD QUALITY
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>
          0 to 100 RQI
        </span>
      </div>

      {/* 0-100 Color Scale Bar (height 10px, exact 330px width card) */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            height: 10,
            borderRadius: 6,
            background: 'linear-gradient(90deg, #ef4444 0%, #f97316 33%, #eab308 66%, #22c55e 100%)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
          }}
        />
        {/* Scale Range Markers correctly spaced with justifyContent */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11.5,
            fontWeight: 700,
            color: '#8f8b85',
            marginTop: 4,
            padding: '0 2px',
          }}
        >
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Severity Category Pills (Severe, Poor, Average, Good) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, paddingTop: 2 }}>
        {[
          { label: 'Severe', range: '0-25', bg: '#ef4444' },
          { label: 'Poor', range: '25-50', bg: '#f97316' },
          { label: 'Average', range: '50-75', bg: '#eab308' },
          { label: 'Good', range: '75-100', bg: '#22c55e' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '6px 0',
              borderRadius: 8,
              background: `${item.bg}15`,
              color: item.bg,
              border: `1px solid ${item.bg}33`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1.2,
            }}
          >
            <span style={{ fontSize: 11.5, fontWeight: 800 }}>{item.label}</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.85, marginTop: 1 }}>{item.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
