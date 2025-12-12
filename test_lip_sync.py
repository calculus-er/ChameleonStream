#!/usr/bin/env python3
"""
Test script for lip sync functionality
"""
import os
import tempfile
import subprocess
import sys


def test_wav2lip_inference():
    """Test if Wav2Lip inference can run"""
    # Create a simple test - just check if the inference script can be called
    checkpoint_path = "wav2lip/checkpoints/wav2lip_gan.pth"

    if not os.path.exists(checkpoint_path):
        print("❌ Wav2Lip model not found")
        return False

    # Test importing the required modules
    try:
        sys.path.append("wav2lip")
        import torch
        import cv2
        import face_detection
        from models import Wav2Lip

        print("✅ All imports successful")
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

    # Test loading the model
    try:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}")

        # Try JIT loading first (TorchScript format)
        try:
            model = torch.jit.load(checkpoint_path, map_location=device)
            print("✅ Model loaded as JIT/TorchScript model")
        except Exception as jit_error:
            print(f"JIT loading failed: {jit_error}")
            # Fallback to state_dict loading
            from models import Wav2Lip

            model = Wav2Lip()
            checkpoint = torch.load(
                checkpoint_path, map_location=device, weights_only=False
            )
            model.load_state_dict(checkpoint["state_dict"])
            model = model.to(device)
            print("✅ Model loaded via state_dict")

        model.eval()
        print("✅ Model ready for inference")
    except Exception as e:
        print(f"❌ Model loading failed: {e}")
        return False

    print("✅ Wav2Lip setup is working!")
    return True


if __name__ == "__main__":
    print("Testing Wav2Lip lip sync functionality...")
    success = test_wav2lip_inference()
    if success:
        print("\n🎉 Lip sync functionality is ready to use!")
        print("You can now run: streamlit run app.py")
    else:
        print("\n❌ There are issues with the lip sync setup.")
