import { useEffect, useMemo, useState } from 'react';

type StepKey =
  | 'upload'
  | 'transcribe'
  | 'translate'
  | 'tts'
  | 'lipsync'
  | 'text'
  | 'render';

type StepState = 'pending' | 'active' | 'done' | 'error';

type Step = {
  key: StepKey;
  title: string;
  description: string;
  state: StepState;
};

const PIPELINE_STEPS: Omit<Step, 'state'>[] = [
  { key: 'upload', title: 'Upload', description: 'Send video to storage/backend' },
  { key: 'transcribe', title: 'Transcribe', description: 'Whisper speech-to-text' },
  { key: 'translate', title: 'Translate', description: 'English → Hindi' },
  { key: 'tts', title: 'Voice', description: 'Hindi TTS voice generation' },
  { key: 'lipsync', title: 'Lip Sync', description: 'Wav2Lip alignment' },
  { key: 'text', title: 'Text Swap', description: 'Detect + overlay translations' },
  { key: 'render', title: 'Render', description: 'Mux audio + overlays' },
];

function buildStepList(): Step[] {
  return PIPELINE_STEPS.map((step) => ({ ...step, state: 'pending' }));
}

const JOB_STATUSES: StepKey[] = [
  'upload',
  'transcribe',
  'translate',
  'tts',
  'lipsync',
  'text',
  'render',
];

function stepBadge(state: StepState) {
  if (state === 'done') return <span className="badge badge-ready">Done</span>;
  if (state === 'active') return <span className="badge badge-active">In progress</span>;
  if (state === 'error') return <span className="badge badge-pending">Needs attention</span>;
  return <span className="badge badge-pending">Pending</span>;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState('hi');
  const [jobId, setJobId] = useState('');
  const [steps, setSteps] = useState<Step[]>(() => buildStepList());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    return () => {
      if (resultUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  const statusMessage = useMemo(() => {
    const active = steps.find((s) => s.state === 'active');
    if (error) return error;
    if (active) return `${active.title} in progress...`;
    if (steps.every((s) => s.state === 'pending')) return 'Ready to start';
    if (steps.every((s) => s.state === 'done')) return 'All steps completed';
    return 'Queued';
  }, [steps, error]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setResultUrl(null);
    setError(null);
  };

  const markStep = (key: StepKey, state: StepState) => {
    setSteps((prev) => prev.map((step) => (step.key === key ? { ...step, state } : step)));
  };

  const resetSteps = () => {
    setSteps(buildStepList());
  };

  const simulateProgress = async () => {
    resetSteps();
    setIsSubmitting(true);
    setError(null);
    const localJobId = crypto.randomUUID();
    setJobId(localJobId);

    for (const key of JOB_STATUSES) {
      markStep(key, 'active');
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 650));
      markStep(key, 'done');
    }
    setIsSubmitting(false);
    if (file) {
      const preview = URL.createObjectURL(file);
      setResultUrl(preview);
    }
  };

  const startJob = async () => {
    if (!file) {
      setError('Please pick a video to start.');
      return;
    }
    setError(null);
    if (!apiBase) {
      await simulateProgress();
      return;
    }

    try {
      resetSteps();
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLang', targetLang);

      const response = await fetch(`${apiBase}/jobs`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      const data = await response.json();
      setJobId(data.id ?? data.jobId ?? 'pending');
      // Polling to be added once backend is wired
      await simulateProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start job');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <h1 className="title">ChameleonStream</h1>
          <p className="subtitle">
            Upload a short clip and preview the English → Hindi localization pipeline.
          </p>
        </div>
        <span className="pill">
          🧪 Hackathon build • Backend: FastAPI + pipeline • UI: Vite + React
        </span>
      </header>

      <section className="card">
        <div className="form-grid">
          <div className="field full-row">
            <label htmlFor="video">Video (max ~90s, single speaker)</label>
            <input
              id="video"
              type="file"
              accept="video/*"
              className="input"
              onChange={handleFileChange}
            />
            <p className="muted" style={{ marginTop: 6 }}>
              We&apos;ll limit resolution to 720p and duration to keep processing fast.
            </p>
          </div>

          <div className="field">
            <label htmlFor="sourceLang">Source language</label>
            <select
              id="sourceLang"
              className="select"
              value="en"
              onChange={() => undefined}
              disabled
            >
              <option value="en">English (fixed for v1)</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="targetLang">Target language</label>
            <select
              id="targetLang"
              className="select"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="hi">Hindi (v1)</option>
              <option value="en" disabled>
                More languages soon
              </option>
            </select>
          </div>

          <div className="field full-row" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="button" onClick={startJob} disabled={!file || isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Start localization'}
            </button>
            {jobId && (
              <span className="pill">
                Job ID: <strong>{jobId}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="results">
          <p className="muted">Status: {statusMessage}</p>
          {error && <p style={{ color: '#b91c1c', marginTop: 8 }}>{error}</p>}

          <div className="steps">
            {steps.map((step) => (
              <div key={step.key} className="step-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <h3 className="step-title">{step.title}</h3>
                  {stepBadge(step.state)}
                </div>
                <p className="step-desc">{step.description}</p>
              </div>
            ))}
          </div>

          {resultUrl && (
            <div style={{ marginTop: 16 }}>
              <p className="muted">Preview (original for now — will show localized result)</p>
              <video className="video-preview" controls src={resultUrl} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;

