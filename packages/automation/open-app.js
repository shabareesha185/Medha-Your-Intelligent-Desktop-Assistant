import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

export async function openApp(app) {
  const platform = os.platform();

  let script;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(__dirname, "../../");

  if (platform === "win32") {
    script = path.join(rootDir, "python/automation/windows/launcher.py");
  } else if (platform === "darwin") {
    script = path.join(rootDir, "python/automation/macos/launcher.py");
  } else {
    throw new Error("Unsupported platform");
  }

  const pythonCmd = platform === "win32" ? "python" : "python3";
  const parts = app.trim().split(/\s+/);
  const canonicalApp = parts[0].toLowerCase();
  const restOfArgs = parts.slice(1);
  spawn(pythonCmd, [script, canonicalApp, ...restOfArgs]);

  return {
    success: true,
    message: `${app} launched`,
  };
}
