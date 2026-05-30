import os from "os";
import { spawn } from "child_process";

export async function closeApp(app) {
  const platform = os.platform();

  let script;

  if (platform === "win32") {
    script = "python/automation/windows/close_app.py";
  } else if (platform === "darwin") {
    script = "python/automation/macos/close_app.py";
  } else {
    throw new Error("Unsupported platform");
  }

  spawn("python", [script, app]);

  return {
    success: true,
    message: `${app} closed`,
  };
}
