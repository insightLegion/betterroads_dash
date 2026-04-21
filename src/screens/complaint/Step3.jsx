import { useMemo, useState } from 'react';
import { AREAS } from '../../data/areas.js';
import { buildLetter, buildSubject } from './buildLetter.js';

function formatToday() {
  const d = new Date();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function Step3({ state, reference, onSubmit, onBack }) {
  const [copied, setCopied] = useState(false);
  const area = AREAS[state.areaId];
  const dateStr = useMemo(() => formatToday(), []);

  const subject = buildSubject(area, state.road, state.issueType);
  const letter = buildLetter({
    area,
    road: state.road,
    issueType: state.issueType,
    name: state.name,
    address: state.address,
    mobile: state.mobile,
    evidence: state.evidence,
    reference,
    dateStr,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = letter;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Review and send</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        This is the exact letter that will be delivered to the ward office, with the state PWD in CC.
      </div>

      <div style={{
        background: 'var(--surface)',
        border: 'var(--border-strong)',
        borderRadius: 'var(--radius-sm)',
        padding: '14px 16px',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500, marginBottom: 4 }}>Subject</div>
        <div style={{ fontSize: 16, fontWeight: 500 }}>{subject}</div>
      </div>

      <textarea
        readOnly
        value={letter}
        style={{
          width: '100%',
          minHeight: 500,
          resize: 'vertical',
          background: 'var(--surface)',
          border: 'var(--border-strong)',
          borderRadius: 'var(--radius-sm)',
          padding: 20,
          fontSize: 14,
          lineHeight: 1.6,
          fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', sans-serif',
          color: 'var(--text)',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <button
          onClick={onBack}
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            padding: '10px 24px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 500,
            fontSize: 14,
            border: 'var(--border-strong)',
          }}
        >
          Back
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleCopy}
            style={{
              background: 'var(--surface)',
              color: 'var(--accent)',
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: 14,
              border: '0.5px solid var(--accent)',
              minWidth: 110,
            }}
          >
            {copied ? 'Copied!' : 'Copy letter'}
          </button>
          <button
            onClick={onSubmit}
            style={{
              background: 'var(--accent)',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Submit complaint
          </button>
        </div>
      </div>
    </div>
  );
}
