import { scoreToSeverity, severityColorHex } from '../../data/areas.js';

export default function TimelineStrip({ history, labels, beforeIndex, afterIndex, onClick }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: 'var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: 16,
    }}>
      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 12,
        fontWeight: 500,
      }}>12-month timeline</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
        {labels.map((lbl, i) => {
          const score = history[i];
          const color = severityColorHex(scoreToSeverity(score));
          const isBefore = i === beforeIndex;
          const isAfter = i === afterIndex;
          const outline = isAfter ? '2px solid var(--accent)' : isBefore ? '2px solid var(--text-muted)' : 'none';
          return (
            <button
              key={lbl}
              onClick={() => onClick(i)}
              style={{
                flex: '1 1 0',
                minWidth: 0,
                padding: 0,
                background: 'transparent',
                textAlign: 'center',
              }}
            >
              <div style={{
                height: 32,
                background: color,
                borderRadius: 4,
                outline,
                outlineOffset: 1,
                marginBottom: 6,
              }} />
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{lbl}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
