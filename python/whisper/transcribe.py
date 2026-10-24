import sys
import json
import time
import os

DURATION = 3
SAMPLE_RATE = 16000

def record_audio(filename="recording.wav"):
    try:
        import sounddevice as sd
        from scipy.io.wavfile import write

        print("Listening...", file=sys.stderr)
        audio = sd.rec(
            int(DURATION * SAMPLE_RATE),
            samplerate=SAMPLE_RATE,
            channels=1,
            dtype="int16"
        )
        sd.wait()
        write(filename, SAMPLE_RATE, audio)
        return True
    except Exception as e:
        print(f"Recording error: {e}", file=sys.stderr)
        return False

def transcribe_audio(filename="recording.wav"):
    text = ""
    # 1. Try faster_whisper first if available
    try:
        from faster_whisper import WhisperModel
        print("Using faster_whisper...", file=sys.stderr)
        model = WhisperModel("tiny", device="cpu", compute_type="int8")
        segments, _ = model.transcribe(filename, language="en")
        text = " ".join(s.text for s in segments).strip()
        return text
    except ImportError:
        pass
    except Exception as e:
        print(f"faster_whisper error: {e}", file=sys.stderr)

    # 2. Fallback to standard openai-whisper
    try:
        import whisper
        print("Using openai-whisper...", file=sys.stderr)
        # Check if local cache has tiny.pt
        model_name = "tiny"
        model = whisper.load_model(model_name)
        result = model.transcribe(filename, language="en", fp16=False)
        text = result.get("text", "").strip()
        return text
    except Exception as e:
        print(f"whisper error: {e}", file=sys.stderr)

    return text

if __name__ == "__main__":
    recorded = record_audio("recording.wav")
    text = ""
    if recorded and os.path.exists("recording.wav"):
        text = transcribe_audio("recording.wav")

    print(json.dumps({"text": text}))
