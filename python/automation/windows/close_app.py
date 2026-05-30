import sys
import subprocess

app = sys.argv[1]

PROCESS_MAP = {
    "chrome": "chrome.exe"
}

process = PROCESS_MAP.get(app)

if not process:
    raise Exception(f"Unknown app: {app}")

subprocess.run(
    ["taskkill", "/F", "/IM", process],
    capture_output=True,
    text=True
)

print(f"{app} closed")