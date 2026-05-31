import os from "os";
import { spawn } from "child_process";

export async function openUrl(url) {
  const platform = os.platform();

  let script;

  if (platform === "win32") {
    script = "python/automation/windows/open_url.py";
  } else if (platform === "darwin") {
    script = "python/automation/macos/open_url.py";
  } else {
    throw new Error("Unsupported platform");
  }

  spawn("python", [script, url]);

  return {
    success: true,
    message: `Opened ${url}`,
  };
}
