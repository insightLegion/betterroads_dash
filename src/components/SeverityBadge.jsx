import { severityColorHex } from '../data/areas.js';

export default function SeverityBadge({ severity, size = 'md' }) {
  const color = severityColorHex(severity);
  const padding = size === 'sm' ? '3px 8px' : '4px 10px';
  const fontSize = size === 'sm' ? 10 : 11;
  return (
    <span style={{
      display: 'inline-block',
      background: color,
      color: '#fff',
      padding,
      borderRadius: 'var(--radius-pill)',
      fontSize,
      fontWeight: 500,
      letterSpacing: 0.2,
      textTransform: 'uppercase',
    }}>
      {severity}
    </span>
  );
}
