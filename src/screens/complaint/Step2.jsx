const PRIORITIES = [
  { id: 'urgent', label: 'Urgent', color: 'var(--severe)', hex: '#E24B4A' },
  { id: 'normal', label: 'Normal', color: 'var(--average)', hex: '#EF9F27' },
  { id: 'low', label: 'Low', color: 'var(--good)', hex: '#639922' },
];

const CHANNELS = [
  { id: 'email', label: 'Email', desc: 'Direct to ward officer' },
  { id: 'bmc', label: 'BMC portal', desc: 'mcgm.gov.in' },
  { id: 'rti', label: 'RTI filing', desc: 'Maharashtra RTI' },
  { id: 'social', label: 'X post / Socials tag', desc: 'Public tag @BMC & PWD' },
];

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

export default function Step2({ state, setState, onNext, onBack }) {
  const canProceed = state.name.trim() && state.address.trim() && /^\d{10}$/.test(state.mobile);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Your details</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        Required for the complaint letter and any follow-up from the ward office.
      </div>

      <Field label="Full name">
        <input
          value={state.name}
          onChange={(e) => setState(s => ({ ...s, name: e.target.value }))}
          style={{ width: '100%' }}
          placeholder="e.g. Anjali Desai"
        />
      </Field>

      <Field label="Address / locality">
        <input
          value={state.address}
          onChange={(e) => setState(s => ({ ...s, address: e.target.value }))}
          style={{ width: '100%' }}
          placeholder="Flat, building, street"
        />
      </Field>

      <Field label="Mobile (10 digits)">
        <input
          type="tel"
          value={state.mobile}
          onChange={(e) => setState(s => ({ ...s, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
          style={{ width: '100%' }}
          placeholder="9876543210"
        />
      </Field>

      <Field label="Priority">
        <div style={{ display: 'flex', gap: 8 }}>
          {PRIORITIES.map(p => {
            const sel = state.priority === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setState(s => ({ ...s, priority: p.id }))}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: sel ? p.hex : 'var(--surface)',
                  color: sel ? '#fff' : p.hex,
                  border: `0.5px solid ${p.hex}`,
                  fontWeight: 500,
                  fontSize: 13,
                  transition: 'all var(--ease)',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Send via">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CHANNELS.map(c => {
            const sel = state.channel === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setState(s => ({ ...s, channel: c.id }))}
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  background: sel ? 'var(--surface-2)' : 'var(--surface)',
                  border: sel ? '0.5px solid var(--accent)' : 'var(--border-strong)',
                  textAlign: 'left',
                  transition: 'all var(--ease)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{c.desc}</div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Additional details (optional)">
        <textarea
          value={state.notes}
          onChange={(e) => setState(s => ({ ...s, notes: e.target.value }))}
          rows={4}
          style={{ width: '100%', resize: 'vertical', lineHeight: 1.5 }}
          placeholder="Any specific landmarks, photos, or past incident references..."
        />
      </Field>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
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
        <button
          disabled={!canProceed}
          onClick={onNext}
          style={{
            background: canProceed ? 'var(--accent)' : 'rgba(0,0,0,0.08)',
            color: canProceed ? '#fff' : 'var(--text-muted)',
            padding: '10px 24px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 500,
            fontSize: 14,
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
