import sys
import os
import subprocess

url = sys.argv[1]

# Use Windows ShellExecute API via os.startfile for robust URL opening
try:
    os.startfile(url)
except Exception:
    subprocess.Popen(["cmd", "/c", "start", "", url], shell=True)

print(f"Opened {url}")