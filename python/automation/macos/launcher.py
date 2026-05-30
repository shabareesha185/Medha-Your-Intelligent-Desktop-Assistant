import sys
import subprocess

app = sys.argv[1]

if app == "chrome":
    subprocess.Popen(
        ["open", "-a", "Google Chrome"]
    )