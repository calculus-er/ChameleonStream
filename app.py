import streamlit as st
import tempfile
import os
from huggingface_hub import InferenceClient
from moviepy import VideoFileClip
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
hf_token = os.getenv("HF_TOKEN")

# Set page configuration
st.set_page_config(
    page_title="Chameleon Stream",
    page_icon="🦎",
    layout="wide"
)

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
</style>
""", unsafe_allow_html=True)

st.title("🦎 Chameleon Stream: Audio Transcriber")

# Sidebar for controls
with st.sidebar:
    st.header("Video Processing")
    st.info("Using **Hugging Face API** (Free & Fast)")
    
    if hf_token:
        st.success("✅ HF Token Loaded from Env")
    else:
        st.error("❌ Missing HF_TOKEN in .env")
    
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
                    st.text_area("Extracted Speech:", value=text, height=300)
                    
                except Exception as e:
                    st.error(f"Error: {e}")
                    if "401" in str(e):
                        st.warning("Your Token might be invalid. Check .env file.")
    else:
        st.info("Upload a file on the left to begin.")
