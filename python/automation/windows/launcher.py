import sys
import subprocess

app_input = sys.argv[1]

new_window = False
if app_input.endswith("-new"):
    new_window = True
    app = app_input[:-4]
else:
    app = app_input

if app in ["chrome", "Chrome"]:
    args = ["cmd", "/c", "start", "chrome"]
    if new_window:
        args.append("--new-window")
    subprocess.Popen(args, shell=True)
elif app in ["spotify", "Spotify"]:
    if len(sys.argv) > 2:
        song_name = " ".join(sys.argv[2:])
        import urllib.request
        import urllib.parse
        import re
        import ssl
        
        query = f"site:open.spotify.com/track {song_name}"
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'}
        )
        try:
            context = ssl._create_unverified_context()
            with urllib.request.urlopen(req, context=context) as response:
                html = response.read().decode('utf-8')
                matches = re.findall(r'open\.spotify\.com/track/([a-zA-Z0-9]+)', html)
                if matches:
                    track_uri = f"spotify:track:{matches[0]}"
                    import os
                    try:
                        os.startfile(track_uri)
                    except Exception:
                        subprocess.Popen(["cmd", "/c", "start", track_uri], shell=True)
                    print(f"Playing '{song_name}' on Spotify")
                else:
                    search_uri = f"spotify:search:{urllib.parse.quote(song_name)}"
                    import os
                    try:
                        os.startfile(search_uri)
                    except Exception:
                        subprocess.Popen(["cmd", "/c", "start", search_uri], shell=True)
                    print(f"Could not find exact track, opening search for '{song_name}'")
        except Exception as e:
            search_uri = f"spotify:search:{urllib.parse.quote(song_name)}"
            import os
            try:
                os.startfile(search_uri)
            except Exception:
                subprocess.Popen(["cmd", "/c", "start", search_uri], shell=True)
            print(f"Error occurred playing Spotify track: {e}")
    else:
        import os
        # Try using URI protocol (highly robust for Windows Store & Desktop versions)
        try:
            os.startfile("spotify:")
        except Exception:
            # Fallback to standard AppData installation path
            appdata = os.environ.get('APPDATA', '')
            spotify_path = os.path.join(appdata, 'Spotify', 'Spotify.exe')
            if os.path.exists(spotify_path):
                subprocess.Popen([spotify_path])
            else:
                # Fallback to general command start
                subprocess.Popen(["cmd", "/c", "start", "spotify"], shell=True)
elif app in ["whatsapp", "WhatsApp"]:
    import os
    # Try using URI protocol (highly robust for Microsoft Store & Desktop versions)
    try:
        os.startfile("whatsapp:")
    except Exception:
        # Fallback to general command start
        subprocess.Popen(["cmd", "/c", "start", "whatsapp"], shell=True)
elif app in ["brave", "Brave", "Brave Browser"]:
    import os
    program_files = os.environ.get("ProgramFiles", "C:\\Program Files")
    program_files_x86 = os.environ.get("ProgramFiles(x86)", "C:\\Program Files (x86)")
    local_appdata = os.environ.get("LOCALAPPDATA", "")
    
    paths = [
        os.path.join(program_files, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
        os.path.join(program_files_x86, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
    ]
    if local_appdata:
        paths.append(os.path.join(local_appdata, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"))
        
    brave_path = None
    for p in paths:
        if os.path.exists(p):
            brave_path = p
            break
            
    if brave_path:
        args = [brave_path]
        if new_window:
            args.append("--new-window")
        subprocess.Popen(args)
    else:
        cmd_args = ["cmd", "/c", "start", "brave"]
        if new_window:
            cmd_args.append("--new-window")
        subprocess.Popen(cmd_args, shell=True)