import { app, BrowserWindow, ipcMain, screen } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { transcribe } from "../../../../packages/automation/transcribe.js";
import { speak } from "../../../../packages/automation/speak.js";
import { plan } from "../../../../packages/planner/planner.js";
import { execute } from "../../../../packages/executor/executor.js";
import { getResponse } from "../../../../packages/automation/responses.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow = null;
let isFloatMode = false;
let voiceLoopActive = false;
let statsInterval = null;

// Memory usage safeguard
let memoryMonitorInterval = null;
const MEMORY_LIMIT_MB = 1500; // 1.5 GB safety limit

function startMemoryMonitor() {
  if (memoryMonitorInterval) clearInterval(memoryMonitorInterval);
  memoryMonitorInterval = setInterval(() => {
    try {
      const metrics = app.getAppMetrics();
      let totalMemoryKB = 0;
      for (const m of metrics) {
        if (m.memory && m.memory.workingSetSize) {
          totalMemoryKB += m.memory.workingSetSize;
        }
      }
      const totalMemoryMB = totalMemoryKB / 1024;
      if (totalMemoryMB > MEMORY_LIMIT_MB) {
        console.error(`[MEMORY GUARD] App consumed ${totalMemoryMB.toFixed(2)} MB (Limit: ${MEMORY_LIMIT_MB} MB). Force quitting to protect system.`);
        app.exit(1); // Force terminate immediately
      }
    } catch (e) {
      console.error("Error checking memory metrics:", e);
    }
  }, 3000);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    frame: false,
    transparent: true,
    hasShadow: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }

  // Redirect renderer console logs to main process stdout
  mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
    console.log(`[RENDERER] ${message} (at ${sourceId}:${line})`);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    stopVoiceLoop();
    if (statsInterval) clearInterval(statsInterval);
    if (memoryMonitorInterval) clearInterval(memoryMonitorInterval);
  });

  startSystemStatsStream();
}

function startSystemStatsStream() {
  if (statsInterval) clearInterval(statsInterval);
  statsInterval = setInterval(() => {
    if (mainWindow && !isFloatMode) {
      const cpu = Math.floor(15 + Math.random() * 15);
      const memory = Math.floor(40 + Math.random() * 5);
      const network = Math.floor(5 + Math.random() * 20);
      const aiEngine = 100;

      mainWindow.webContents.send("system-stats", { cpu, memory, network, aiEngine });
    }
  }, 3000);
}

// -------------------------------------------------------------
// Voice Mode Automation Loop
// -------------------------------------------------------------
async function runVoiceLoop() {
  voiceLoopActive = true;
  console.log("Electron Voice Mode Loop Activated");

  while (voiceLoopActive) {
    try {
      if (!mainWindow) break;

      mainWindow.webContents.send("voice-status", "listening");
      console.log("Status: Listening...");

      const speech = await transcribe();
      const text = speech.text ? speech.text.trim() : "";

      if (!text) {
        console.log("No speech detected this round.");
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      console.log("Spoken:", text);
      mainWindow.webContents.send("transcription", text);

      mainWindow.webContents.send("voice-status", "thinking");
      
      let command;
      try {
        command = plan(text);
      } catch (err) {
        mainWindow.webContents.send("voice-status", "speaking");
        mainWindow.webContents.send("response-text", "Sorry, I did not recognize that command.");
        await speak("Sorry, I did not recognize that command.");
        continue;
      }

      const verbalResponse = getResponse(command.action, command.params);
      console.log("Responding:", verbalResponse);

      mainWindow.webContents.send("voice-status", "speaking");
      mainWindow.webContents.send("response-text", verbalResponse);
      
      mainWindow.webContents.send("live-feed-update", {
        userSpeech: speech.text,
        assistantReply: verbalResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      await speak(verbalResponse);

      console.log("Executing Action:", command.action, command.params);
      await execute(command.action, command.params);

    } catch (error) {
      console.error("Error in Voice Loop:", error.message);
      if (mainWindow && voiceLoopActive) {
        mainWindow.webContents.send("voice-status", "idle");
        mainWindow.webContents.send("response-text", "Error occurred in processing.");
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (mainWindow) {
    mainWindow.webContents.send("voice-status", "idle");
  }
}

function stopVoiceLoop() {
  voiceLoopActive = false;
  console.log("Electron Voice Mode Loop Deactivated");
}

// -------------------------------------------------------------
// IPC Listeners & Actions
// -------------------------------------------------------------
ipcMain.on("start-voice-mode", () => {
  if (!voiceLoopActive) {
    runVoiceLoop();
  }
});

ipcMain.on("stop-voice-mode", () => {
  stopVoiceLoop();
});

ipcMain.on("minimize-window", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("close-window", () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on("toggle-float-mode", () => {
  if (!mainWindow) return;

  isFloatMode = !isFloatMode;

  if (isFloatMode) {
    mainWindow.setAlwaysOnTop(true, "screen-saver");
    mainWindow.setSize(340, 340);
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.bounds;
    mainWindow.setPosition(width - 360, height - 380);
    mainWindow.webContents.send("voice-status", "float-active");
  } else {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setSize(1100, 720);
    mainWindow.center();
    mainWindow.webContents.send("voice-status", "dashboard-active");
  }
});

ipcMain.on("execute-action", async (_, { action, params }) => {
  try {
    const verbalResponse = getResponse(action, params);
    if (mainWindow) {
      mainWindow.webContents.send("voice-status", "speaking");
      mainWindow.webContents.send("response-text", verbalResponse);
      mainWindow.webContents.send("live-feed-update", {
        userSpeech: `Clicked action: ${action}`,
        assistantReply: verbalResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    await speak(verbalResponse);
    await execute(action, params);
    if (mainWindow) {
      mainWindow.webContents.send("voice-status", "idle");
    }
  } catch (error) {
    console.error("Manual action error:", error.message);
  }
});

ipcMain.on("execute-command", async (_, text) => {
  try {
    if (!mainWindow) return;
    
    // 1. Log query input
    mainWindow.webContents.send("transcription", text);
    mainWindow.webContents.send("voice-status", "thinking");
    mainWindow.webContents.send("response-text", "Analyzing cyber core...");

    // 2. Parse instruction using planner.js
    const command = plan(text);
    const verbalResponse = getResponse(command.action, command.params);

    // 3. Render and speak response
    mainWindow.webContents.send("voice-status", "speaking");
    mainWindow.webContents.send("response-text", verbalResponse);
    mainWindow.webContents.send("live-feed-update", {
      userSpeech: text,
      assistantReply: verbalResponse,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    await speak(verbalResponse);

    // 4. Run native automation script
    await execute(command.action, command.params);

    mainWindow.webContents.send("voice-status", "idle");
    mainWindow.webContents.send("response-text", "Action completed");
  } catch (error) {
    console.error("Execute command error:", error.message);
    if (mainWindow) {
      mainWindow.webContents.send("voice-status", "idle");
      mainWindow.webContents.send("response-text", `Error: ${error.message}`);
    }
  }
});

app.whenReady().then(() => {
  startMemoryMonitor();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
