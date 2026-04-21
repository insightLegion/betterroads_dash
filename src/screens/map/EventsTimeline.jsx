export default function EventsTimeline({ area }) {
  const events = [
    { label: 'Road last good', value: area.lastGood, missing: false },
    { label: 'Deterioration started', value: area.deteriorationStart, missing: false },
    { label: 'Authority notified', value: area.authorityNotified, missing: false },
    { label: 'Repair started', value: area.repairStarted || 'Not yet', missing: !area.repairStarted },
  ];

  return (
    <div style={{ position: 'relative', paddingLeft: 18 }}>
      <div style={{
        position: 'absolute',
        left: 5,
        top: 8,
        bottom: 8,
        width: 0,
        borderLeft: '1px dashed var(--text-muted)',
      }} />
      {events.map((e, i) => (
        <div key={i} style={{ position: 'relative', paddingBottom: i === events.length - 1 ? 0 : 14 }}>
          <span style={{
            position: 'absolute',
            left: -18,
            top: 4,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: e.missing ? 'var(--severe)' : 'var(--accent)',
            border: '2px solid var(--surface)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
          }} />
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.label}</div>
          <div style={{
            fontSize: 13,
            fontWeight: 500,
            color: e.missing ? 'var(--severe)' : 'var(--text)',
            marginTop: 1,
          }}>{e.value}</div>
        </div>
      ))}
    </div>
  );
}
