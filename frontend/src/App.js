import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
const PIPELINE_STEPS = [
    { key: 'upload', title: 'Upload', description: 'Send video to storage/backend' },
    { key: 'transcribe', title: 'Transcribe', description: 'Whisper speech-to-text' },
    { key: 'translate', title: 'Translate', description: 'English → Hindi' },
    { key: 'tts', title: 'Voice', description: 'Hindi TTS voice generation' },
    { key: 'lipsync', title: 'Lip Sync', description: 'Wav2Lip alignment' },
    { key: 'text', title: 'Text Swap', description: 'Detect + overlay translations' },
    { key: 'render', title: 'Render', description: 'Mux audio + overlays' },
];
function buildStepList() {
    return PIPELINE_STEPS.map((step) => ({ ...step, state: 'pending' }));
}
const JOB_STATUSES = [
    'upload',
    'transcribe',
    'translate',
    'tts',
    'lipsync',
    'text',
    'render',
];
function stepBadge(state) {
    if (state === 'done')
        return _jsx("span", { className: "badge badge-ready", children: "Done" });
    if (state === 'active')
        return _jsx("span", { className: "badge badge-active", children: "In progress" });
    if (state === 'error')
        return _jsx("span", { className: "badge badge-pending", children: "Needs attention" });
    return _jsx("span", { className: "badge badge-pending", children: "Pending" });
}
function App() {
    const [file, setFile] = useState(null);
    const [targetLang, setTargetLang] = useState('hi');
    const [jobId, setJobId] = useState('');
    const [steps, setSteps] = useState(() => buildStepList());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resultUrl, setResultUrl] = useState(null);
    const [error, setError] = useState(null);
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
        if (error)
            return error;
        if (active)
            return `${active.title} in progress...`;
        if (steps.every((s) => s.state === 'pending'))
            return 'Ready to start';
        if (steps.every((s) => s.state === 'done'))
            return 'All steps completed';
        return 'Queued';
    }, [steps, error]);
    const handleFileChange = (event) => {
        const picked = event.target.files?.[0];
        if (!picked)
            return;
        setFile(picked);
        setResultUrl(null);
        setError(null);
    };
    const markStep = (key, state) => {
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start job');
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "header", children: [_jsxs("div", { children: [_jsx("h1", { className: "title", children: "ChameleonStream" }), _jsx("p", { className: "subtitle", children: "Upload a short clip and preview the English \u2192 Hindi localization pipeline." })] }), _jsx("span", { className: "pill", children: "\uD83E\uDDEA Hackathon build \u2022 Backend: FastAPI + pipeline \u2022 UI: Vite + React" })] }), _jsxs("section", { className: "card", children: [_jsxs("div", { className: "form-grid", children: [_jsxs("div", { className: "field full-row", children: [_jsx("label", { htmlFor: "video", children: "Video (max ~90s, single speaker)" }), _jsx("input", { id: "video", type: "file", accept: "video/*", className: "input", onChange: handleFileChange }), _jsx("p", { className: "muted", style: { marginTop: 6 }, children: "We'll limit resolution to 720p and duration to keep processing fast." })] }), _jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "sourceLang", children: "Source language" }), _jsx("select", { id: "sourceLang", className: "select", value: "en", onChange: () => undefined, disabled: true, children: _jsx("option", { value: "en", children: "English (fixed for v1)" }) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "targetLang", children: "Target language" }), _jsxs("select", { id: "targetLang", className: "select", value: targetLang, onChange: (e) => setTargetLang(e.target.value), children: [_jsx("option", { value: "hi", children: "Hindi (v1)" }), _jsx("option", { value: "en", disabled: true, children: "More languages soon" })] })] }), _jsxs("div", { className: "field full-row", style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsx("button", { className: "button", onClick: startJob, disabled: !file || isSubmitting, children: isSubmitting ? 'Processing...' : 'Start localization' }), jobId && (_jsxs("span", { className: "pill", children: ["Job ID: ", _jsx("strong", { children: jobId })] }))] })] }), _jsxs("div", { className: "results", children: [_jsxs("p", { className: "muted", children: ["Status: ", statusMessage] }), error && _jsx("p", { style: { color: '#b91c1c', marginTop: 8 }, children: error }), _jsx("div", { className: "steps", children: steps.map((step) => (_jsxs("div", { className: "step-card", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', gap: 8 }, children: [_jsx("h3", { className: "step-title", children: step.title }), stepBadge(step.state)] }), _jsx("p", { className: "step-desc", children: step.description })] }, step.key))) }), resultUrl && (_jsxs("div", { style: { marginTop: 16 }, children: [_jsx("p", { className: "muted", children: "Preview (original for now \u2014 will show localized result)" }), _jsx("video", { className: "video-preview", controls: true, src: resultUrl })] }))] })] })] }));
}
export default App;
