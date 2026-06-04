import { spawn } from "child_process";
import { createServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function startDev() {
  // 1. Start the Vite dev server
  const server = await createServer({
    configFile: path.resolve(rootDir, "vite.config.js"),
    root: rootDir,
    server: {
      port: 5173,
    },
  });
  await server.listen();
  console.log("Vite server running at http://localhost:5173");

  // 2. Start Electron process pointing directly to main.js
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  let electronProcess = spawn(npxCmd, ["electron", "."], {
    cwd: rootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: "http://localhost:5173",
    },
  });

  electronProcess.on("close", () => {
    server.close();
    process.exit(0);
  });
}

startDev().catch((err) => {
  console.error("Error starting dev server:", err);
  process.exit(1);
});
