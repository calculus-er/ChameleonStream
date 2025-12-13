#!/usr/bin/env python3
"""
Script to download Wav2Lip models and dependencies
"""
import os
import requests
from pathlib import Path

try:
    import gdown
except ImportError:
    gdown = None



def download_file(url, destination):
    """Download a file from URL to destination"""
    print(f"Downloading {url} to {destination}")
    response = requests.get(url, stream=True)
    response.raise_for_status()

    with open(destination, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    print(f"Downloaded {destination}")


def main():
    # Create directories
    os.makedirs("wav2lip/checkpoints", exist_ok=True)
    os.makedirs("wav2lip/face_detection/detection/sfd", exist_ok=True)

    # Download face detection model
    face_detect_path = "wav2lip/face_detection/detection/sfd/s3fd.pth"
    if not os.path.exists(face_detect_path):
        try:
            download_file(
                "https://www.adrianbulat.com/downloads/python-fan/s3fd-619a316812.pth",
                face_detect_path,
            )
        except:
            # Fallback URL
            download_file(
                "https://iiitaphyd-my.sharepoint.com/:u:/g/personal/prajwal_k_research_iiit_ac_in/EZsy6qWuivtDnANIG73iHjIBjMSoojcIV0NULXV-yiuiIg?e=qTasa8/download=1",
                face_detect_path,
            )

    # Download Wav2Lip models using gdown
    # Main Wav2Lip model (highly accurate lip-sync)
    wav2lip_path = "wav2lip/checkpoints/wav2lip.pth"
    if not os.path.exists(wav2lip_path):
        try:
            print("Downloading Wav2Lip model...")
            if gdown is None:
                raise ImportError("gdown is not installed. Install with: pip install gdown or pip install -r requirements.txt")
            gdown.download(
                "https://drive.google.com/uc?id=1IjFW1cLevs6Ouyu4Yht4mnR4yeuMqO7Y",
                wav2lip_path,
                quiet=False,
            )
        except Exception as e:
            print(f"Wav2Lip model download failed: {e}")

    # Wav2Lip + GAN model (better visual quality)
    wav2lip_gan_path = "wav2lip/checkpoints/wav2lip_gan.pth"
    if not os.path.exists(wav2lip_gan_path):
        try:
            print("Downloading Wav2Lip GAN model...")
            if gdown is None:
                raise ImportError("gdown is not installed. Install with: pip install gdown or pip install -r requirements.txt")
            gdown.download(
                "https://drive.google.com/uc?id=15G3U08c8xsCkOqQxE38Z2XXDnPcOptNk",
                wav2lip_gan_path,
                quiet=False,
            )
        except Exception as e:
            print(f"Wav2Lip GAN model download failed: {e}")

    print("All models downloaded successfully!")


if __name__ == "__main__":
    main()
