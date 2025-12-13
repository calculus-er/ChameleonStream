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

Optional: Initialize submodules (Wav2Lip code) if not cloned automatically:

- For existing clones: `git submodule update --init --recursive`
- For fresh clones (or to fetch submodule later): `git submodule update --init --recursive`

Make sure you're running commands from the project root directory (the folder containing `app.py`). Example:

- Change to the project directory:

```
cd D:\OneDrive\Desktop\chameleonStream
```

- Install Python dependencies (ensure your virtualenv is activated):

```
pip install -r requirements.txt
```

- Initialize submodules (populate the `wav2lip` directory):

```
git submodule update --init --recursive
```

- Download the Wav2Lip models:

```
python download_models.py
```

You can also run the helper setup script on Windows to automatically create and activate a virtualenv, install dependencies, initialize submodules, and download models:

```
# From PowerShell (project root)
.\scripts\setup_env.ps1
# Or run with execution policy bypass if needed
powershell -ExecutionPolicy Bypass -File .\scripts\setup_env.ps1
```

If `git submodule` is not desired, clone Wav2Lip into the `wav2lip` path manually:

```
# Run from project root
git clone https://github.com/Rudrabha/Wav2Lip.git wav2lip
```


## Current capabilities
- Upload a video/audio file, extract audio if needed, and transcribe via Hugging Face Inference Whisper.
- Translate transcript (EN→HI) using LibreTranslate (free), or Groq LLM if `GROQ_API_KEY` is set.
- Synthesize TTS via ElevenLabs API.
- Replace audio track in video with translated TTS.

## Notes
- Keep videos short during testing to avoid timeouts on free endpoints.