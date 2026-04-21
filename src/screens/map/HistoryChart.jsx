import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { scoreToSeverity, severityColorHex } from '../../data/areas.js';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { month, score } = payload[0].payload;
  const sev = scoreToSeverity(score);
  return (
    <div style={{
      background: 'var(--surface)',
      border: 'var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '8px 10px',
      fontSize: 12,
      boxShadow: 'var(--shadow-float)',
    }}>
      <div style={{ fontWeight: 500 }}>{month}</div>
      <div style={{ color: 'var(--text-muted)' }}>Score {score}/100</div>
      <div style={{ color: severityColorHex(sev), fontWeight: 500 }}>{sev}</div>
    </div>
  );
}

export default function HistoryChart({ history, labels }) {
  const data = labels.map((month, i) => ({ month, score: history[i] }));

  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 9, fill: '#6b7280' }}
            axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={severityColorHex(scoreToSeverity(entry.score))} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
