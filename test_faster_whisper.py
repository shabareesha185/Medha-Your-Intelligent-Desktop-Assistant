from faster_whisper import WhisperModel

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(
    "recording.wav",
    language="en"
)

for segment in segments:
    print(segment.text)