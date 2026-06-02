import sys
import json
import sounddevice as sd

from scipy.io.wavfile import write
from faster_whisper import WhisperModel

DURATION = 3
SAMPLE_RATE = 16000

print("Listening...", file=sys.stderr)

audio = sd.rec(
    int(DURATION * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="int16"
)

sd.wait()

write(
    "recording.wav",
    SAMPLE_RATE,
    audio
)

print("Transcribing...", file=sys.stderr)

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(
    "recording.wav",
    language="en"
)

text = " ".join(
    segment.text
    for segment in segments
).strip()

print(
    json.dumps({
        "text": text
    })
)