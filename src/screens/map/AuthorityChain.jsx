import { PWD_STATE } from '../../data/pwd.js';

function Row({ children, primary }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: 'var(--border)',
      borderLeft: primary ? '3px solid var(--severe)' : 'var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: 12,
      marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

export default function AuthorityChain({ area }) {
  return (
    <div>
      <Row>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>
          State PWD
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{PWD_STATE.minister}</div>
        <a href={`mailto:${PWD_STATE.ministerEmail}`} style={{ fontSize: 12 }}>{PWD_STATE.ministerEmail}</a>
        <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{PWD_STATE.additionalCS}</div>
        <a href={`mailto:${PWD_STATE.additionalCSEmail}`} style={{ fontSize: 12 }}>{PWD_STATE.additionalCSEmail}</a>
      </Row>

      <Row primary>
        <div style={{ fontSize: 11, color: 'var(--severe)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6, fontWeight: 500 }}>
          Ward office · primary
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{area.ward}</div>
        <div style={{ fontSize: 13, marginTop: 2 }}>{area.wardOfficer}</div>
        <a href={`mailto:${area.wardEmail}`} style={{ fontSize: 12 }}>{area.wardEmail}</a>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{area.wardPhone}</div>
      </Row>

      <Row>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>
          Office address
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.5 }}>{area.wardAddress}</div>
      </Row>
    </div>
  );
}
