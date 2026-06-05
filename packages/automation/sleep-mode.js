import os from "os";
import { spawn } from "child_process";

export async function sleepMode() {
  const platform = os.platform();

  if (platform === "darwin") {
    // macOS native sleep command (pmset sleepnow)
    const child = spawn("pmset", ["sleepnow"]);
    child.on("error", (err) => console.error("Sleep command error:", err));
  } else if (platform === "win32") {
    // Windows native sleep command via powrprof DLL suspend state call
    const child = spawn("rundll32.exe", ["powrprof.dll,SetSuspendState", "0,1,0"]);
    child.on("error", (err) => console.error("Sleep command error:", err));
  } else {
    throw new Error("Unsupported platform");
  }

  return {
    success: true,
    message: "System put to sleep",
  };
}
