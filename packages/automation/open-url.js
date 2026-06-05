import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

export async function openUrl(url) {
  const platform = os.platform();

  let script;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(__dirname, "../../");
 
  if (platform === "win32") {
    script = path.join(rootDir, "python/automation/windows/open_url.py");
  } else if (platform === "darwin") {
    script = path.join(rootDir, "python/automation/macos/open_url.py");
  } else {
    throw new Error("Unsupported platform");
  }

  const pythonCmd = platform === "win32" ? "python" : "python3";
  const child = spawn(pythonCmd, [script, url]);
  child.on("error", (err) => {
    console.error("Failed to spawn open-url script:", err);
  });

  return {
    success: true,
    message: `Opened ${url}`,
  };
}
