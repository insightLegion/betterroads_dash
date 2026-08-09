import { AREAS } from '../../data/areas.js';

const ISSUE_TYPES = [
  'Multiple potholes',
  'Surface damage',
  'Large crater',
  'Waterlogging + damage',
  'Failed patch repair',
];

const EVIDENCE = [
  { id: 'history', label: 'Road score history', desc: 'Last 12 months' },
  { id: 'gps', label: 'GPS pothole map', desc: 'Location data' },
  { id: 'timeline', label: 'Deterioration timeline', desc: 'Event log' },
  { id: 'sla', label: 'Authority SLA record', desc: 'Breach data' },
  { id: 'photo', label: 'Photo evidence', desc: 'Attach later' },
  { id: 'prev', label: 'Previous complaint ref', desc: 'Cross-reference' },
];

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

export default function Step1({ state, setState, onNext }) {
  const area = AREAS[state.areaId];

  const toggleEvidence = (id) => {
    setState(s => ({
      ...s,
      evidence: s.evidence.includes(id) ? s.evidence.filter(e => e !== id) : [...s.evidence, id]
    }));
  };

  const canProceed = state.areaId && state.road && state.issueType;

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Select road and issue</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        Tell us where the problem is and what kind of damage you're reporting.
      </div>

      <Field label="Area">
        <div style={{ position: 'relative' }}>
          <select
            value={state.areaId}
            onChange={(e) => setState(s => ({ ...s, areaId: e.target.value, road: AREAS[e.target.value].roads[0] }))}
            style={{ width: '100%', appearance: 'none', paddingRight: 32 }}
          >
            {Object.entries(AREAS).map(([id, a]) => (
              <option key={id} value={id}>{a.name} — {a.ward}</option>
            ))}
          </select>
          <Chevron />
        </div>
      </Field>

      <Field label="Road">
        <div style={{ position: 'relative' }}>
          <select
            value={state.road}
            onChange={(e) => setState(s => ({ ...s, road: e.target.value }))}
            style={{ width: '100%', appearance: 'none', paddingRight: 32 }}
          >
            {area.roads.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <Chevron />
        </div>
      </Field>

      <Field label="Issue type">
        <div style={{ position: 'relative' }}>
          <select
            value={state.issueType}
            onChange={(e) => setState(s => ({ ...s, issueType: e.target.value }))}
            style={{ width: '100%', appearance: 'none', paddingRight: 32 }}
          >
            {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Chevron />
        </div>
      </Field>

      <div style={{
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        padding: 16,
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 500, marginBottom: 10 }}>Condition snapshot</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <Stat label="Score" value={`${area.score}/100`} />
          <Stat label="Potholes" value={area.potholes} />
          <Stat label="Days unaddressed" value={area.daysUnaddressed} />
          <Stat label="SLA overdue" value={`${area.slaBreach} d`} danger={area.slaBreach > 0} />
          <Stat label="Last action" value={area.authorityNotified} small />
        </div>
      </div>

      <Field label="Evidence to attach">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {EVIDENCE.map(ev => {
            const sel = state.evidence.includes(ev.id);
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => toggleEvidence(ev.id)}
                style={{
                  position: 'relative',
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: sel ? '1px solid var(--accent)' : 'var(--border-strong)',
                  background: sel ? 'var(--accent-soft)' : 'var(--surface)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--ease)',
                }}
              >
                {sel && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check />
                  </span>
                )}
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{ev.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ev.desc}</div>
              </button>
            );
          })}
        </div>
      </Field>

      {state.evidence.includes('photo') && (
        <div
          style={{
            marginTop: 14,
            padding: 16,
            borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--accent)',
            background: 'var(--accent-tint)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            Upload Photo Evidence <span style={{ color: 'var(--accent)' }}>(Optional but recommended)</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
            Attach photos of potholes, cracked road surfaces, or waterlogging
          </div>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📷 Choose Photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []).map((f) => f.name);
                setState((s) => ({ ...s, photoFiles: files }));
              }}
              style={{ display: 'none' }}
            />
          </label>
          {state.photoFiles && state.photoFiles.length > 0 && (
            <div style={{ marginTop: 10, fontSize: 11, color: '#22c55e', fontWeight: 600 }}>
              ✓ {state.photoFiles.length} photo(s) selected: {state.photoFiles.join(', ')}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
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

function Stat({ label, value, danger, small }) {
  return (
    <div style={{ gridColumn: small ? 'span 3' : 'span 1' }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: small ? 13 : 15, fontWeight: 500, color: danger ? 'var(--severe)' : 'var(--text)' }}>{value}</div>
    </div>
  );
}
