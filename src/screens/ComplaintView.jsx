import { useMemo, useState, useEffect } from 'react';
import { AREAS } from '../data/areas.js';
import { useAppState } from '../context/AppState.jsx';
import StepIndicator from './complaint/StepIndicator.jsx';
import Step1 from './complaint/Step1.jsx';
import Step2 from './complaint/Step2.jsx';
import Step3 from './complaint/Step3.jsx';
import SuccessState from './complaint/SuccessState.jsx';
import FilingPanel from './complaint/FilingPanel.jsx';

function generateRef() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `BR-2026-${n}`;
}

function initialState(areaId) {
  const id = areaId && AREAS[areaId] ? areaId : 'andheri-west';
  return {
    areaId: id,
    road: AREAS[id].roads[0],
    issueType: 'Multiple potholes',
    evidence: ['history', 'gps', 'timeline', 'sla'],
    name: '',
    address: '',
    mobile: '',
    priority: 'urgent',
    channel: 'email',
    notes: '',
  };
}

export default function ComplaintView() {
  const { selectedAreaId } = useAppState();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState(() => initialState(selectedAreaId));
  const [reference, setReference] = useState(null);

  useEffect(() => {
    if (selectedAreaId && AREAS[selectedAreaId] && state.areaId !== selectedAreaId) {
      setState(s => ({ ...s, areaId: selectedAreaId, road: AREAS[selectedAreaId].roads[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAreaId]);

  useEffect(() => {
    if (step === 3 && !reference) setReference(generateRef());
  }, [step, reference]);

  const area = AREAS[state.areaId];

  const resetWizard = () => {
    setStep(1);
    setSubmitted(false);
    setReference(null);
    setState(initialState(state.areaId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 24, padding: 24, background: 'var(--surface-2)', height: '100%', overflow: 'auto' }}>
      <section style={{
        flex: 1,
        minWidth: 0,
        order: 1,
        background: 'var(--surface)',
        border: 'var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 24,
      }}>
        {!submitted && <StepIndicator step={step} />}

        {submitted ? (
          <SuccessState
            area={area}
            reference={reference}
            onFileAnother={resetWizard}
            onTrack={() => console.log('Track status clicked', reference)}
          />
        ) : step === 1 ? (
          <Step1 state={state} setState={setState} onNext={() => setStep(2)} />
        ) : step === 2 ? (
          <Step2 state={state} setState={setState} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        ) : (
          <Step3
            state={state}
            reference={reference || ''}
            onSubmit={() => setSubmitted(true)}
            onBack={() => setStep(2)}
          />
        )}
      </section>

      <FilingPanel area={area} />
    </div>
  );
}
