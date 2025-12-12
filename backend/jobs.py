import json
import os
import uuid
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True) if not os.path.exists(DATA_DIR) else None
JOBS_FILE = os.path.join(DATA_DIR, "jobs.json")


def _load_jobs():
    if not os.path.exists(JOBS_FILE):
        return {}
    with open(JOBS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_jobs(jobs):
    with open(JOBS_FILE, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2, default=str)


class JobStore:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        if not os.path.exists(JOBS_FILE):
            _save_jobs({})

    def create_job(self, filename, src_lang="en", tgt_lang="hi"):
        jobs = _load_jobs()
        job_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        jobs[job_id] = {
            "id": job_id,
            "filename": filename,
            "status": "queued",
            "progress": 0,
            "src_lang": src_lang,
            "tgt_lang": tgt_lang,
            "created_at": now,
            "updated_at": now,
            "artifacts": {},
        }
        _save_jobs(jobs)
        return jobs[job_id]

    def update_job(self, job_id, **kwargs):
        jobs = _load_jobs()
        if job_id not in jobs:
            return None
        jobs[job_id].update(kwargs)
        jobs[job_id]["updated_at"] = datetime.utcnow().isoformat()
        _save_jobs(jobs)
        return jobs[job_id]

    def get_job(self, job_id):
        jobs = _load_jobs()
        return jobs.get(job_id)

    def list_jobs(self):
        return _load_jobs()
