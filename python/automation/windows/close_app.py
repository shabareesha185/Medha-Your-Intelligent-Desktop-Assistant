import sys
import subprocess

app = sys.argv[1]

if app in ["brave", "Brave", "chrome", "Chrome"]:
    # Close only the frontmost browser window using PowerShell, leaving other windows open
    app_title = "Brave" if "brave" in app.lower() else "Chrome"
    ps_cmd = (
        '[void][System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms"); '
        '$wshell = New-Object -ComObject wscript.shell; '
        f'if ($wshell.AppActivate("{app_title}")) {{ Start-Sleep -Milliseconds 500; $wshell.SendKeys("%{{F4}}") }}'
    )
    subprocess.run(["powershell", "-Command", ps_cmd])
    print(f"{app} window closed")
    sys.exit(0)

PROCESS_MAP = {
    "chrome": "chrome.exe",
    "spotify": "Spotify.exe",
    "Spotify": "Spotify.exe",
    "whatsapp": "WhatsApp.exe",
    "WhatsApp": "WhatsApp.exe"
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