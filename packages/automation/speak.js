import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function speak(text) {
  return new Promise((resolve, reject) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const rootDir = path.resolve(__dirname, "../../");

    const isWin = process.platform === "win32";
    let pythonPath = isWin 
      ? ".venv\\Scripts\\python.exe" 
      : "./.venv/bin/python";

    if (!fs.existsSync(pythonPath)) {
      pythonPath = isWin ? "python" : "python3";
    }

    const scriptPath = path.join(rootDir, "python/tts/speak.py");
    const python = spawn(pythonPath, [
      scriptPath,
      text,
    ]);

    python.on("close", resolve);

    python.on("error", reject);
  });
}
