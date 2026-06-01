import sys
import subprocess

app_input = sys.argv[1]

new_window = False
if app_input.endswith("-new"):
    new_window = True
    app = app_input[:-4]
else:
    app = app_input

if app in ["chrome", "Google Chrome", "Chrome"]:
    if new_window:
        subprocess.Popen([
            "osascript", "-e",
            'tell application "Google Chrome" to make new window',
            "-e",
            'tell application "Google Chrome" to activate'
        ])
    else:
        subprocess.Popen([
            "osascript", "-e",
            'tell application "Google Chrome" to activate'
        ])
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
            headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'}
        )
        try:
            context = ssl._create_unverified_context()
            with urllib.request.urlopen(req, context=context) as response:
                html = response.read().decode('utf-8')
                matches = re.findall(r'open\.spotify\.com/track/([a-zA-Z0-9]+)', html)
                if matches:
                    track_uri = f"spotify:track:{matches[0]}"
                    # Play the track using AppleScript
                    subprocess.Popen([
                        "osascript", "-e",
                        f'tell application "Spotify" to play track "{track_uri}"'
                    ])
                    print(f"Playing '{song_name}' on Spotify")
                else:
                    search_uri = f"spotify:search:{urllib.parse.quote(song_name)}"
                    subprocess.Popen(["open", search_uri])
                    print(f"Could not find exact track, opening search for '{song_name}'")
        except Exception as e:
            search_uri = f"spotify:search:{urllib.parse.quote(song_name)}"
            subprocess.Popen(["open", search_uri])
            print(f"Error occurred playing Spotify track: {e}")
    else:
        subprocess.Popen(
            ["open", "-a", "Spotify"]
        )
elif app in ["apple_music", "appleMusic", "applemusic", "music", "launch_appleMusic", "luanch_appleMusic"]:
    if len(sys.argv) > 2:
        song_name = " ".join(sys.argv[2:])
        import urllib.request
        import urllib.parse
        import re
        import ssl
        
        query = f"site:music.apple.com/us/album {song_name}"
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'}
        )
        try:
            context = ssl._create_unverified_context()
            with urllib.request.urlopen(req, context=context) as response:
                html = response.read().decode('utf-8')
                decoded_html = urllib.parse.unquote(html)
                matches = re.findall(r'music\.apple\.com/[a-z]{2}/album/[a-zA-Z0-9\-]+/[0-9]+(?:\?i=[0-9]+)?', decoded_html)
                if matches:
                    track_uri = f"music://{matches[0]}"
                    subprocess.Popen(["open", track_uri])
                    print(f"Playing '{song_name}' on Apple Music")
                else:
                    # Fallback to search query which opens in native Music App search screen
                    search_url = f"music://music.apple.com/us/search?term={urllib.parse.quote(song_name)}"
                    subprocess.Popen(["open", search_url])
                    print(f"Could not find exact track, searching Apple Music for '{song_name}'")
        except Exception as e:
            subprocess.Popen(["open", "-a", "Music"])
            print(f"Error occurred playing Apple Music track: {e}")
    else:
        subprocess.Popen(
            ["open", "-a", "Music"]
        )
elif app in ["WhatsApp", "whatsapp"]:
    subprocess.Popen(
        ["open", "-a", "WhatsApp"]
    )
elif app in ["brave", "Brave", "Brave Browser"]:
    if new_window:
        subprocess.Popen([
            "osascript", "-e",
            'tell application "Brave Browser" to make new window',
            "-e",
            'tell application "Brave Browser" to activate'
        ])
    else:
        subprocess.Popen([
            "osascript", "-e",
            'tell application "Brave Browser" to activate'
        ])