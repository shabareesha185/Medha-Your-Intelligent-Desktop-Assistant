import sys
import os

if len(sys.argv) < 2:
    sys.exit(0)

TEXT = sys.argv[1].strip()

def speak_native(text):
    if os.name == "nt":
        # Windows native PowerShell SAPI
        sanitized = text.replace("'", "''").replace('"', '`"')
        cmd = f'powershell -NoProfile -Command "Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.Speak(\'{sanitized}\')"'
        os.system(cmd)
    else:
        # macOS native speech command
        os.system(f'say "{text}"')

try:
    import asyncio
    import edge_tts
    import tempfile

    async def main():
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        await edge_tts.Communicate(TEXT, voice="en-US-AriaNeural").save(temp_file.name)
        if os.name == "nt":
            os.startfile(temp_file.name)
        else:
            os.system(f"afplay {temp_file.name}")

    asyncio.run(main())
except Exception:
    # Graceful fallback to zero-dependency OS speech
    speak_native(TEXT)
