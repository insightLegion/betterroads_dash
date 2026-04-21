import { PWD_STATE } from '../../data/pwd.js';

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function SuccessState({ area, reference, onFileAnother, onTrack }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      minHeight: 400,
    }}>
      <div style={{
        width: 80, height: 80,
        borderRadius: '50%',
        background: 'var(--good)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <CheckIcon />
      </div>

      <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Complaint filed</div>

      <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4, maxWidth: 520, lineHeight: 1.6 }}>
        Sent to <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{area.wardEmail}</strong>.
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, maxWidth: 520, lineHeight: 1.6 }}>
        CC to {PWD_STATE.additionalCSEmail}, {PWD_STATE.ministerEmail}.
      </div>

      <div style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 22,
        background: 'var(--surface-2)',
        padding: '12px 24px',
        borderRadius: 'var(--radius-sm)',
        letterSpacing: 1,
        fontWeight: 500,
        marginBottom: 32,
      }}>
        {reference}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onFileAnother}
          style={{
            background: 'var(--surface)',
            color: 'var(--accent)',
            padding: '12px 24px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 500,
            fontSize: 14,
            border: '0.5px solid var(--accent)',
          }}
        >
          File another
        </button>
        <button
          onClick={onTrack}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Track status
        </button>
      </div>
    </div>
  );
}
