# ChameleonStream
    Back  ''    End       Bros      '''''  
Early Streamlit prototype for the Chameleon localization pipeline.

## Quick start
1) Create and activate a virtualenv
   - `python -m venv .venv`
   - Windows PowerShell: `.\.venv\Scripts\Activate.ps1`
2) Install deps: `pip install -r requirements.txt`
3) Copy `env.example` to `.env` and set:
   - `HF_TOKEN` (Hugging Face token for Whisper transcription; required for ASR).
   - `ELEVENLABS_API_KEY` (for TTS; required for speech synthesis).
   - `GROQ_API_KEY` (optional; enables Groq Whisper ASR and Groq LLM translation without HF token).
   - `LIBRETRANSLATE_API_KEY` (optional; for higher translation rate limits; translation works free without it).
   - Optional: `USE_LOCAL_ASR=true` to use local Faster-Whisper (no HF token). Configure `WHISPER_MODEL_SIZE`, `WHISPER_DEVICE`, `WHISPER_COMPUTE_TYPE` as needed.
4) Run the app: `streamlit run app.py`

## Current capabilities
- Upload a video/audio file, extract audio if needed, and transcribe via Hugging Face Inference Whisper.
- Translate transcript (EN→HI) using LibreTranslate (free), or Groq LLM if `GROQ_API_KEY` is set.
- Synthesize TTS via ElevenLabs API.
- Replace audio track in video with translated TTS.

## Notes
- Keep videos short during testing to avoid timeouts on free endpoints.