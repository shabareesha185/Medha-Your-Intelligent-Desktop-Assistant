import sys
import json
import whisper
import sounddevice as sd

from scipy.io.wavfile import write

DURATION = 5
SAMPLE_RATE = 16000

print("Listening...", file=sys.stderr)

audio = sd.rec(
    int(DURATION * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=1
)

sd.wait()

write(
    "recording.wav",
    SAMPLE_RATE,
    audio
)

print("Transcribing...", file=sys.stderr)

model = whisper.load_model("tiny")

result = model.transcribe(
    "recording.wav",
    language="en",
    fp16=False
)

print(
    json.dumps({
        "text": result["text"].strip()
    })
)