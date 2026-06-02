import { spawn } from "child_process";

export function speak(text) {
  return new Promise((resolve, reject) => {
    const python = spawn(".venv\\Scripts\\python.exe", [
      "python/tts/speak.py",
      text,
    ]);

    python.on("close", resolve);

    python.on("error", reject);
  });
}
