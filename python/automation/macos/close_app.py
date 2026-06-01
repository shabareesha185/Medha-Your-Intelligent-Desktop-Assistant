import sys
import subprocess

APP_MAP = {
    "chrome": "Google Chrome",
    "spotify": "Spotify",
    "Spotify": "Spotify",
    "apple_music": "Music",
    "appleMusic": "Music",
    "applemusic": "Music",
    "music": "Music",
    "launch_appleMusic": "Music",
    "luanch_appleMusic": "Music",
    "whatsapp": "WhatsApp",
    "WhatsApp": "WhatsApp",
    "brave": "Brave Browser",
    "Brave": "Brave Browser"
}

app_key = sys.argv[1]
app = APP_MAP.get(app_key)

if not app:
    raise Exception("Unknown app")

if app_key in ["brave", "Brave", "chrome", "Google Chrome"]:
    # Close only the front window using AppleScript to preserve other open windows
    app_name = "Brave Browser" if "brave" in app_key.lower() else "Google Chrome"
    subprocess.run([
        "osascript", "-e",
        f'tell application "{app_name}" to if (count of windows) > 0 then close front window'
    ])
    print(f"{app} window closed")
else:
    subprocess.run(
        ["pkill", "-f", app]
    )
    print(f"{app} closed")