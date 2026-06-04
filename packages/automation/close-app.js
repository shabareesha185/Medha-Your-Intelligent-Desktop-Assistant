import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

export async function closeApp(app) {
  const platform = os.platform();

  let script;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(__dirname, "../../");
 
  if (platform === "win32") {
    script = path.join(rootDir, "python/automation/windows/close_app.py");
  } else if (platform === "darwin") {
    script = path.join(rootDir, "python/automation/macos/close_app.py");
  } else {
    throw new Error("Unsupported platform");
  }

  const pythonCmd = platform === "win32" ? "python" : "python3";
  const canonicalApp = app.trim().toLowerCase();
  const child = spawn(pythonCmd, [script, canonicalApp]);
  child.on("error", (err) => {
    console.error("Failed to spawn close-app script:", err);
  });

  return {
    success: true,
    message: `${app} closed`,
  };
}
