export default function InsightBox({ area, beforeScore, afterScore, beforeLabel, afterLabel, months }) {
  const delta = afterScore - beforeScore;
  let text;
  if (delta <= -25) {
    text = `Severe deterioration in ${area.name}. Conditions collapsed from ${beforeScore} to ${afterScore} over ${months} months, with ${area.slaBreach} days of unaddressed SLA breach.`;
  } else if (delta >= 20) {
    text = `Significant recovery in ${area.name}. Score improved ${delta} points between ${beforeLabel} and ${afterLabel}.`;
  } else {
    text = `Mixed signals in ${area.name}. Conditions shifted from ${beforeScore} to ${afterScore} — neither clearly recovering nor collapsing.`;
  }
  return (
    <div style={{
      background: 'var(--surface-2)',
      borderRadius: 'var(--radius-md)',
      borderLeft: '3px solid var(--accent)',
      padding: 16,
      fontSize: 14,
      lineHeight: 1.55,
    }}>
      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 6,
        fontWeight: 500,
      }}>Insight</div>
      {text}
    </div>
  );
}
