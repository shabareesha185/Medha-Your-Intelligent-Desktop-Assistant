import os from "os";

export function getPlatform() {
  const platform = os.platform();

  if (platform === "win32") return "windows";

  if (platform === "darwin") return "macos";

  throw new Error("Unsupported OS");
}
