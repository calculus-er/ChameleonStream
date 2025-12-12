# ChameleonStream

Early Streamlit prototype for the Chameleon localization pipeline.

## Quick start
1) Create and activate a virtualenv
   - `python -m venv .venv`
   - Windows PowerShell: `.\.venv\Scripts\Activate.ps1`
2) Install deps: `pip install -r requirements.txt`
3) Copy `env.example` to `.env` and set:
   - `HF_TOKEN` (Hugging Face token with access to `openai/whisper-large-v3` or equivalent).
   - `ELEVENLABS_API_KEY` (for TTS; optional but required for speech synthesis).
4) Run the app: `streamlit run app.py`

## Current capabilities
- Upload a video/audio file, extract audio if needed, and transcribe via Hugging Face Inference Whisper.
- UI scaffold to translate transcript (EN→HI via HF), synthesize TTS (ElevenLabs), and replace audio in the uploaded video (requires API keys set).

## Notes
- Keep videos short during testing to avoid timeouts on free endpoints.