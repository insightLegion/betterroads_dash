const steps = [
  { id: 1, label: 'Road' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Review' },
];

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function StepIndicator({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
      {steps.map((s, i) => {
        const active = step === s.id;
        const done = step > s.id;
        const circleStyle = {
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 500,
          transition: 'all var(--ease)',
          background: active ? 'var(--accent)' : 'var(--surface)',
          color: active ? '#fff' : done ? 'var(--accent)' : 'var(--text-muted)',
          border: done || active ? '0.5px solid var(--accent)' : '0.5px solid rgba(0,0,0,0.15)',
        };
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: i === steps.length - 1 ? '0 0 auto' : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={circleStyle}>
                {done ? <Check /> : s.id}
              </div>
              <span style={{ fontSize: 11, color: active ? 'var(--text)' : 'var(--text-muted)', fontWeight: active ? 500 : 400 }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: 1,
                background: done ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
                marginBottom: 20,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
