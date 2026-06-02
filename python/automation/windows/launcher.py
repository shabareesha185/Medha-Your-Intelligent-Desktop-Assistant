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

app_config = APPS.get(app_key, {}).get("windows")

if not app_config:
    # Fallback to general start command
    subprocess.Popen(["cmd", "/c", "start", sys.argv[1]], shell=True)
    sys.exit(0)

# if not app_config:  #non whitelisted app should not support
#     print("Unsupported app")
#     sys.exit(1)

# Handle launch by URI protocol
if "uri" in app_config:
    try:
        os.startfile(app_config["uri"])
    except Exception:
        subprocess.Popen(["cmd", "/c", "start", app_config["uri"]], shell=True)
    print(f"{app_key} launched via URI")
    sys.exit(0)

# Handle launch by file paths
exec_name = app_config.get("exec")
paths = app_config.get("paths", [])
found_path = None

for p in paths:
    if "BraveSoftware" in p:
        program_files = os.environ.get("ProgramFiles", "C:\\Program Files")
        program_files_x86 = os.environ.get("ProgramFiles(x86)", "C:\\Program Files (x86)")
        local_appdata = os.environ.get("LOCALAPPDATA", "")
        
        test_paths = [
            os.path.join(program_files, p),
            os.path.join(program_files_x86, p)
        ]
        if local_appdata:
            test_paths.append(os.path.join(local_appdata, p))
        for tp in test_paths:
            if os.path.exists(tp):
                found_path = tp
                break

if found_path:
    args = [found_path]
    if new_window and app_config.get("supports_new_window"):
        args.append("--new-window")
    subprocess.Popen(args)
else:
    cmd_args = ["cmd", "/c", "start", exec_name]
    if new_window and app_config.get("supports_new_window"):
        cmd_args.append("--new-window")
    subprocess.Popen(cmd_args, shell=True)

print(f"{app_key} launched")