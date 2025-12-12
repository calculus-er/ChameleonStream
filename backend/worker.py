import sys
import time
import os
from backend.jobs import JobStore

STORAGE_DIR = os.path.join(os.path.dirname(__file__), "storage")


def process_job(job_id: str):
    js = JobStore()
    job = js.get_job(job_id)
    if not job:
        print(f"Job {job_id} not found")
        return

    print(f"Processing job {job_id}")
    js.update_job(job_id, status="processing", progress=5)
    time.sleep(1)

    # placeholder step: copy raw to result
    artifacts = job.get("artifacts", {})
    raw = artifacts.get("raw_video")
    if not raw or not os.path.exists(raw):
        js.update_job(job_id, status="failed", message="raw video missing")
        return

    job_dir = os.path.dirname(raw)
    result = os.path.join(job_dir, "result.mp4")
    # In real pipeline we would perform ASR, MT, TTS, Wav2Lip, OCR etc.
    # For stub we simply copy file to result
    js.update_job(job_id, progress=40, message="processing: copying video")
    with open(raw, "rb") as src, open(result, "wb") as dst:
        dst.write(src.read())

    time.sleep(1)
    js.update_job(job_id, progress=90, message="finishing up")
    # set final artifact
    js.update_job(job_id, status="complete", progress=100, artifacts={"result_video": result})
    print(f"Completed job {job_id}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python worker.py <job_id>")
        sys.exit(1)
    process_job(sys.argv[1])

