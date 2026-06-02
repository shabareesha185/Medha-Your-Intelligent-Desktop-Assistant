import sys
import asyncio
import edge_tts
import tempfile
import os

TEXT = sys.argv[1]

async def main():

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".mp3"
    )

    await edge_tts.Communicate(
        TEXT,
        voice="en-US-AriaNeural"
    ).save(temp_file.name)

    if os.name == "nt":
        os.startfile(temp_file.name)
    else:
        os.system(
            f"afplay {temp_file.name}"
        )

asyncio.run(main())