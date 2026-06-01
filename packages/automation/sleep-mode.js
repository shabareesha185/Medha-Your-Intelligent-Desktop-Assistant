import os from "os";
import { spawn } from "child_process";

export async function sleepMode() {
  const platform = os.platform();

  if (platform === "darwin") {
    // macOS native sleep command (pmset sleepnow)
    spawn("pmset", ["sleepnow"]);
  } else if (platform === "win32") {
    // Windows native sleep command via powrprof DLL suspend state call
    spawn("rundll32.exe", ["powrprof.dll,SetSuspendState", "0,1,0"]);
  } else {
    throw new Error("Unsupported platform");
  }

  return {
    success: true,
    message: "System put to sleep",
  };
}
