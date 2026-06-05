const { contextBridge, ipcRenderer } = require("electron");

// Secure contextBridge exposure for React using native CommonJS cjs format
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => {
    const validChannels = [
      "start-voice-mode",
      "stop-voice-mode",
      "execute-action",
      "execute-command",
      "minimize-window",
      "close-window",
      "toggle-float-mode",
      "window-drag"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = [
      "voice-status",
      "transcription",
      "response-text",
      "waveform-data",
      "live-feed-update",
      "system-stats"
    ];
    if (validChannels.includes(channel)) {
      const subscription = (_event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  }
});
