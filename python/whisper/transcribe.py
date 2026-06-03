import sys
import json
import sounddevice as sd

from scipy.io.wavfile import write
from faster_whisper import WhisperModel

import time

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

model_start = time.time()

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

print(
    f"Model load: {time.time() - model_start:.2f}s",
    file=sys.stderr
)

transcribe_start = time.time()

segments, info = model.transcribe(
    "recording.wav",
    language="en"
)

text = " ".join(
    segment.text
    for segment in segments
).strip()

print(
    f"Transcribe: {time.time() - transcribe_start:.2f}s",
    file=sys.stderr
)

print(
    json.dumps({
        "text": text
    })
)