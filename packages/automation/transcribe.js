import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function transcribe() {
  return new Promise((resolve, reject) => {
    console.log("🎤 Listening for voice command...");

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const rootDir = path.resolve(__dirname, "../../");

    const isWin = process.platform === "win32";
    let pythonPath = isWin 
      ? ".venv\\Scripts\\python.exe" 
      : "./.venv/bin/python";

    if (!fs.existsSync(pythonPath)) {
      pythonPath = isWin ? "python" : "python3";
    }

    const scriptPath = path.join(rootDir, "python/whisper/transcribe.py");
    const python = spawn(pythonPath, [
      scriptPath,
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
