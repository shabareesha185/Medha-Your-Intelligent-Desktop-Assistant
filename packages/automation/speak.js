import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Universal Native Text-To-Speech Engine
 * Prioritizes zero-latency native OS speech synthesis (macOS 'say', Windows SAPI),
 * with fallback to Python edge_tts when available.
 */
export function speak(text) {
  return new Promise((resolve) => {
    const cleanText = (text || "").replace(/[*_#`~[\]]/g, "").trim();
    if (!cleanText) {
      return resolve();
    }

    const platform = process.platform;

    // 1. macOS Native Speech (Zero dependency, instant, high-quality)
    if (platform === "darwin") {
      const sayProcess = spawn("say", [cleanText]);
      sayProcess.on("close", () => resolve());
      sayProcess.on("error", (err) => {
        console.warn("macOS say error, falling back:", err.message);
        fallbackPythonTTS(cleanText).then(resolve);
      });
      return;
    }

    // 2. Windows Native PowerShell Speech Synthesizer
    if (platform === "win32") {
      const sanitized = cleanText.replace(/'/g, "''").replace(/"/g, '`"');
      const psCommand = `Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.Speak('${sanitized}')`;
      const psProcess = spawn("powershell", ["-NoProfile", "-Command", psCommand], { shell: true });
      psProcess.on("close", () => resolve());
      psProcess.on("error", (err) => {
        console.warn("Windows SAPI error, falling back:", err.message);
        fallbackPythonTTS(cleanText).then(resolve);
      });
      return;
    }

    // 3. Linux / Other platforms: Fallback to Python TTS
    fallbackPythonTTS(cleanText).then(resolve);
  });
}

function fallbackPythonTTS(text) {
  return new Promise((resolve) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const rootDir = path.resolve(__dirname, "../../");

    const isWin = process.platform === "win32";
    let pythonPath = isWin ? ".venv\\Scripts\\python.exe" : "./.venv/bin/python";

    if (!fs.existsSync(pythonPath)) {
      pythonPath = isWin ? "python" : "python3";
    }

    const scriptPath = path.join(rootDir, "python/tts/speak.py");
    const python = spawn(pythonPath, [scriptPath, text]);

    python.on("close", () => resolve());
    python.on("error", (err) => {
      console.error("Python TTS failed:", err.message);
      resolve();
    });
  });
}
