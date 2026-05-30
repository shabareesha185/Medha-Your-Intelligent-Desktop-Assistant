import sys
import subprocess

APP_MAP = {
    "chrome": "Google Chrome"
}

app = APP_MAP.get(sys.argv[1])

if not app:
    raise Exception("Unknown app")

subprocess.run(
    ["pkill", "-f", app]
)

print(f"{app} closed")