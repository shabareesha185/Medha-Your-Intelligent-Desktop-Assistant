import sys
import os
import subprocess

# Add the parent 'python' root directory to sys.path to allow relative automation imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from automation.common.apps import APPS

if len(sys.argv) < 2:
    print("Error: No app specified")
    sys.exit(1)

app_input = sys.argv[1].lower().strip()

# Check for new-window request
new_window = False
if app_input.endswith("-new"):
    new_window = True
    app_key = app_input[:-4]
else:
    app_key = app_input

app_config = APPS.get(app_key, {}).get("macos")

if not app_config:
    # If the app isn't explicitly configured, try to launch it directly by name as fallback
    subprocess.Popen(["open", "-a", sys.argv[1]])
    sys.exit(0)

app_name = app_config["name"]

# Handle new window request via AppleScript if supported
if new_window and app_config.get("supports_new_window"):
    subprocess.Popen([
        "osascript", "-e", f'tell application "{app_name}" to make new window',
        "-e", f'tell application "{app_name}" to activate'
    ])
else:
    subprocess.Popen(["open", "-a", app_name])

print(f"{app_name} launched")