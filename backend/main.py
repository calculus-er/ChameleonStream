import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.jobs import JobStore

STORAGE_DIR = os.path.join(os.path.dirname(__file__), "storage")
os.makedirs(STORAGE_DIR, exist_ok=True)

app = FastAPI(title="ChameleonStream Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

jobs = JobStore()


@app.post("/api/upload")
async def upload_video(
    file: UploadFile = File(...), src_lang: str = Form("en"), tgt_lang: str = Form("hi")
):
    # save file
    job = jobs.create_job(filename=file.filename, src_lang=src_lang, tgt_lang=tgt_lang)
    job_dir = os.path.join(STORAGE_DIR, job["id"]) 
    os.makedirs(job_dir, exist_ok=True)
    file_path = os.path.join(job_dir, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    jobs.update_job(job["id"], status="queued", artifacts={"raw_video": file_path})

    # Note: For now we leave the worker to be started separately. The UI will poll status.
    return {"jobId": job["id"], "statusUrl": f"/api/status/{job['id']}"}


@app.get("/api/status/{job_id}")
def get_status(job_id: str):
    job = jobs.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return job


@app.get("/api/result/{job_id}")
def get_result(job_id: str):
    job = jobs.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    artifacts = job.get("artifacts", {})
    result = artifacts.get("result_video")
    if not result or not os.path.exists(result):
        raise HTTPException(status_code=404, detail="result not ready")
    return FileResponse(result, media_type="video/mp4")


@app.get("/")
def root():
    return {"status": "ok", "service": "ChameleonStream Backend"}
