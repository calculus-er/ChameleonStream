import streamlit as st
import tempfile
import os
import requests
from huggingface_hub import InferenceClient
from moviepy import VideoFileClip, AudioFileClip
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
hf_token = os.getenv("HF_TOKEN")
eleven_api_key = os.getenv("ELEVENLABS_API_KEY")
default_voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # common default voice
default_tts_model = os.getenv("ELEVENLABS_TTS_MODEL", "eleven_multilingual_v2")

# Set page configuration
st.set_page_config(
    page_title="Chameleon Stream",
    page_icon="🦎",
    layout="wide"
)

LANGUAGE_OPTIONS = [
    ("English", "Hindi"),  # Initial focus; extend later
]

# Custom CSS for a "hackathon" vibe
st.markdown("""
<style>
    .main {
        background-color: #f0f2f6;
    }
    .stButton>button {
        width: 100%;
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
    }
    h1 {
        color: #2c3e50;
        text-align: center;
    }
    .step-label {
        font-weight: 600;
        color: #2c3e50;
    }
</style>
""", unsafe_allow_html=True)

st.title("🦎 Chameleon Stream: Audio Transcriber")
st.caption("Phase 1: Basic UI + transcription. Translation, TTS, lip-sync, and text overlays are scaffolded below.")
if "transcript" not in st.session_state:
    st.session_state.transcript = None
if "translation" not in st.session_state:
    st.session_state.translation = None
if "tts_audio" not in st.session_state:
    st.session_state.tts_audio = None
if "final_video" not in st.session_state:
    st.session_state.final_video = None

# Sidebar for controls
with st.sidebar:
    st.header("Video Processing")
    st.info("Using **Hugging Face API** (Free & Fast)")
    
    if hf_token:
        st.success("✅ HF Token Loaded from Env")
    else:
        st.error("❌ Missing HF_TOKEN in .env")

    st.markdown("---")
    st.subheader("Language")
    target_language = st.selectbox(
        "Target language (source assumed English for now)",
        [f"{src} → {tgt}" for src, tgt in LANGUAGE_OPTIONS],
        index=0
    )
    st.markdown("---")
    st.subheader("TTS Settings")
    voice_id_input = st.text_input("ElevenLabs voice_id", value=default_voice_id)
    tts_model_input = st.text_input("ElevenLabs model_id", value=default_tts_model)

    st.markdown("---")

def extract_audio(video_path):
    """Extracts audio from video and saves as MP3"""
    video = VideoFileClip(video_path)
    audio_path = video_path.replace(".mp4", ".mp3").replace(".mov", ".mp3")
    video.audio.write_audiofile(audio_path, logger=None)
    return audio_path

def transcribe_audio(file_path):
    """Transcribes audio using Hugging Face Inference API"""
    if not hf_token:
        raise ValueError("HF_TOKEN is missing from environment variables.")
        
    # Initialize client with explicit provider to avoid Sambanova routing error
    client = InferenceClient(
        model="openai/whisper-large-v3", 
        token=hf_token,
        provider="hf-inference"
    )
    
    # OLD CODE (Caused Error): passed a file object 'f'
    # with open(file_path, "rb") as f:
    #    response = client.automatic_speech_recognition(f)
    
    # NEW CODE: Pass the file path string directly
    response = client.automatic_speech_recognition(file_path)
    
    return response.text

def translate_text(text: str, source_lang: str = "en", target_lang: str = "hi") -> str:
    """Translate text using Hugging Face Inference API."""
    if not hf_token:
        raise ValueError("HF_TOKEN is missing; cannot translate.")
    client = InferenceClient(
        model="Helsinki-NLP/opus-mt-en-hi",
        token=hf_token,
        provider="hf-inference"
    )
    # InferenceClient.translation expects src_lang / tgt_lang
    resp = client.translation(text, src_lang=source_lang, tgt_lang=target_lang)
    # Normalize different response shapes into a plain string
    if isinstance(resp, dict):
        if "translation_text" in resp:
            return resp["translation_text"]
        if "generated_text" in resp:
            return resp["generated_text"]
    if isinstance(resp, list) and resp:
        # HF sometimes returns a list of dicts
        first = resp[0]
        if isinstance(first, dict):
            return first.get("translation_text") or first.get("generated_text") or str(first)
        return str(first)
    return str(resp)

def synthesize_speech(text: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM", model_id: str = "eleven_multilingual_v2") -> str:
    """Call ElevenLabs TTS, return path to temp wav file."""
    if not eleven_api_key:
        raise ValueError("ELEVENLABS_API_KEY is missing; cannot synthesize speech.")
    safe_text = text if isinstance(text, str) else str(text)
    safe_text = safe_text.strip()
    if not safe_text:
        raise ValueError("TTS text is empty after cleaning.")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": eleven_api_key,
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": safe_text,
        "model_id": model_id,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.7}
    }
    resp = requests.post(url, json=payload, headers=headers, stream=True, timeout=120)
    if resp.status_code >= 400:
        raise ValueError(f"TTS request failed ({resp.status_code}): {resp.text[:500]}")
    tfile = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    for chunk in resp.iter_content(chunk_size=8192):
        if chunk:
            tfile.write(chunk)
    tfile.close()
    return tfile.name

def replace_audio_track(video_path: str, audio_path: str) -> str:
    """Replace audio track of video with provided audio; returns path to new video."""
    video = VideoFileClip(video_path)
    new_audio = AudioFileClip(audio_path)
    out_path = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4").name
    video.set_audio(new_audio).write_videofile(out_path, codec="libx264", audio_codec="aac", logger=None)
    return out_path

# Main Content Area
col1, col2 = st.columns(2)

uploaded_file = None

with col1:
    st.subheader("1. Input Video 📹")
    uploaded_file = st.file_uploader("Upload Video or Audio", type=["mp4", "mov", "avi", "mp3", "wav"])
    
    if uploaded_file is not None:
        # Save uploaded file to temp
        tfile = tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.name.split('.')[-1]}")
        tfile.write(uploaded_file.read())
        file_path = tfile.name

        if file_path.endswith(('.mp4', '.mov', '.avi')):
            st.video(file_path)
        else:
            st.audio(file_path)

with col2:
    st.subheader("2. Transcribed Output 📜")
    
    if uploaded_file is not None:
        if st.button("📝 Extract Text", type="primary"):
            with st.status("Processing...", expanded=True) as status:
                try:
                    # 1. Check if we need to extract audio
                    process_path = file_path
                    if file_path.endswith(('.mp4', '.mov', '.avi')):
                        st.write("Creating Audio file (MP3)...")
                        process_path = extract_audio(file_path)
                    
                    # 2. Transcribe
                    st.write("Sending to Hugging Face API...")
                    text = transcribe_audio(process_path)
                    
                    status.update(label="Done!", state="complete", expanded=False)
                    
                    st.success("Transcription Complete!")
                    st.session_state.transcript = text
                    st.text_area("Extracted Speech:", value=text, height=300)
                    
                except Exception as e:
                    st.error(f"Error: {e}")
                    if "401" in str(e):
                        st.warning("Your Token might be invalid. Check .env file.")
    else:
        st.info("Upload a file on the left to begin.")

st.markdown("---")
st.subheader("3. Upcoming pipeline steps (scaffold)")
col3, col4 = st.columns(2)
with col3:
    st.markdown("**Translation (EN → target)**")
    if st.session_state.transcript:
        if st.button("🌐 Translate Transcript"):
            with st.status("Translating...", expanded=True) as status:
                try:
                    st.write("Calling translation model...")
                    translated = translate_text(st.session_state.transcript)
                    st.session_state.translation = translated
                    status.update(label="Translation done", state="complete", expanded=False)
                    st.success("Translation ready")
                    st.text_area("Translated Speech:", value=translated, height=200)
                except Exception as e:
                    st.error(f"Translation failed: {e}")
    else:
        st.info("Transcription required before translation.")
    st.markdown("**TTS for translated audio**")
    if st.session_state.translation:
        if st.button("🔊 Synthesize TTS"):
            with st.status("Synthesizing speech...", expanded=True) as status:
                try:
                    st.write("Calling ElevenLabs TTS...")
                    tts_path = synthesize_speech(
                        st.session_state.translation,
                        voice_id=voice_id_input,
                        model_id=tts_model_input
                    )
                    st.session_state.tts_audio = tts_path
                    status.update(label="TTS done", state="complete", expanded=False)
                    st.success("TTS ready")
                    st.audio(tts_path)
                except Exception as e:
                    st.error(f"TTS failed: {e}")
    else:
        st.info("Translate text to enable TTS.")
with col4:
    st.markdown("**Lip-sync video generation**")
    st.info("Placeholder: will drive Wav2Lip/Sync Labs with translated audio.")
    st.markdown("**On-frame text replacement**")
    st.info("Placeholder: detect + overlay translated text; later inpaint & style match.")
    st.markdown("**Replace audio track with synthesized speech**")
    if uploaded_file and st.session_state.tts_audio:
        if st.button("🎞️ Replace audio in video"):
            with st.status("Muxing video with new audio...", expanded=True) as status:
                try:
                    st.write("Combining video + synthesized audio...")
                    output_video = replace_audio_track(file_path, st.session_state.tts_audio)
                    st.session_state.final_video = output_video
                    status.update(label="Mux complete", state="complete", expanded=False)
                    st.success("New video ready")
                    st.video(output_video)
                except Exception as e:
                    st.error(f"Mux failed: {e}")
    else:
        st.info("Upload + TTS needed to replace audio.")
