import { spawn } from "child_process";

export function transcribe() {
  return new Promise((resolve, reject) => {
    console.log("🎤 Listening for voice command...");

    const python = spawn(".venv\\Scripts\\python.exe", [
      "python/whisper/transcribe.py",
    ]);

    let output = "";
    let errors = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      const message = data.toString();

      process.stdout.write(message);

      errors += message;
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(errors));
      }

      try {
        const result = JSON.parse(output);

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    python.on("error", (error) => {
      reject(error);
    });
  });
}
