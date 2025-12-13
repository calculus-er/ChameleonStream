<#
Windows setup helper for ChameleonStream

This script will:
- create a virtual environment at `.venv` if missing
- set PowerShell execution policy for the current process
- activate the virtualenv
- upgrade pip and install `requirements.txt`
- initialize git submodules (wav2lip)
- run `download_models.py` to fetch model files

Run this from the project root in PowerShell:

# From project root
# .\scripts\setup_env.ps1
# Or run with bypass for execution policy:
# powershell -ExecutionPolicy Bypass -File .\scripts\setup_env.ps1
#>

set -e

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "[ERROR] $msg" -ForegroundColor Red }

Write-Info "Running Windows setup script for ChameleonStream"

# Ensure running from project root (has app.py)
if (-not (Test-Path -Path "app.py")) {
    Write-Warn "app.py not found in current directory. Change to project root and re-run."
    exit 1
}

# Create venv if necessary
if (-not (Test-Path -Path ".venv")) {
    Write-Info "Creating virtual environment at .\.venv"
    python -m venv .venv
} else {
    Write-Info "Virtual environment already exists"
}

# Allow script execution for this process so Activate.ps1 can be sourced
try {
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null
    Write-Info "Execution policy set to Bypass for this process"
} catch {
    Write-Warn "Could not change execution policy; you may be prompted to allow activation manually"
}

# Activate venv in the current process
Write-Info "Activating virtual environment"
. .\.venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
Write-Info "Upgrading pip and installing dependencies from requirements.txt"
python -m pip install --upgrade pip
pip install -r requirements.txt

# Initialize git submodules (wav2lip)
if (Test-Path -Path ".gitmodules") {
    Write-Info "Initializing git submodules"
    git submodule update --init --recursive
} else {
    Write-Warn ".gitmodules not found; skipping submodule init"
}

# Run the model downloader
Write-Info "Downloading Wav2Lip models (this may take a while)"
python download_models.py

Write-Info "Setup complete. To run the app: 'streamlit run app.py'"
