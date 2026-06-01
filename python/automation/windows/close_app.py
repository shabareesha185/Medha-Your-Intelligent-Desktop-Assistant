import sys
import os
import subprocess

# Add the parent 'python' root directory to sys.path to allow relative automation imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from automation.common.apps import APPS

if len(sys.argv) < 2:
    print("Error: No app specified")
    sys.exit(1)

app_key = sys.argv[1].lower().strip()
app_config = APPS.get(app_key, {}).get("windows")

if not app_config:
    # Fallback to direct process name kill
    process_name = sys.argv[1]
    if not process_name.lower().endswith(".exe"):
        process_name += ".exe"
else:
    process_name = app_config["process"]

subprocess.run(
    ["taskkill", "/F", "/IM", process_name],
    capture_output=True,
    text=True
)

print(f"{process_name} closed")