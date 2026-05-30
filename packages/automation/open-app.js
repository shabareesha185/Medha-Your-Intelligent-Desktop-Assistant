import os from "os";
import { spawn } from "child_process";

export async function openApp(app) {
  const platform = os.platform();

  let script;

  if (platform === "win32") {
    script = "python/automation/windows/launcher.py";
  } else if (platform === "darwin") {
    script = "python/automation/macos/launcher.py";
  } else {
    throw new Error("Unsupported platform");
  }

  spawn("python", [script, app]);

  return {
    success: true,
    message: `${app} launched`,
  };
}
