import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  MessageSquare,
  Terminal as TermIcon,
  Grid,
  Cpu,
  Bookmark,
  Settings as SettingsIcon,
  Play,
  Chrome,
  Youtube,
  Code,
  Music,
  Maximize2,
  Minimize2,
  X,
  Radio,
  FileText,
  Workflow,
  Zap,
  HardDrive,
  Globe,
  Database,
  Lock,
  Share2,
  Compass,
  Monitor,
  Terminal,
  FolderOpen
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [transcription, setTranscription] = useState("");
  const [responseText, setResponseText] = useState("System online and listening");
  const [isFloat, setIsFloat] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [themeColor, setThemeColor] = useState("cyan"); // cyan, green, purple, amber

  const [liveFeed, setLiveFeed] = useState([
    { userSpeech: 'Open Safari', assistantReply: 'Opening Safari...', time: '10:21 AM' },
    { userSpeech: 'Play Interstellar theme', assistantReply: 'Playing on YouTube', time: '10:23 AM' },
    { userSpeech: 'Send hi to Rahul', assistantReply: 'Message sent on WhatsApp', time: '10:25 AM' },
    { userSpeech: 'Open VS Code', assistantReply: 'Launching VS Code', time: '10:26 AM' },
  ]);

  const [stats, setStats] = useState({
    cpu: 23,
    memory: 41,
    network: 18,
    aiEngine: 100
  });

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  // -------------------------------------------------------------
  // Theme Color Configurations (Hacker Neon styles)
  // -------------------------------------------------------------
  const getThemeStyles = () => {
    switch (themeColor) {
      case "green":
        return {
          primary: "#10b981", // Emerald Green
          accent: "#22c55e",
          glow: "rgba(16, 185, 129, 0.4)",
          bgGlow: "rgba(16, 185, 129, 0.15)",
          textGrad: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
          border: "rgba(16, 185, 129, 0.25)"
        };
      case "purple":
        return {
          primary: "#a855f7", // Violet/Purple
          accent: "#d946ef",
          glow: "rgba(168, 85, 247, 0.4)",
          bgGlow: "rgba(168, 85, 247, 0.15)",
          textGrad: "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
          border: "rgba(168, 85, 247, 0.25)"
        };
      case "amber":
        return {
          primary: "#f59e0b", // Amber/Gold
          accent: "#f97316",
          glow: "rgba(245, 158, 11, 0.4)",
          bgGlow: "rgba(245, 158, 11, 0.15)",
          textGrad: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          border: "rgba(245, 158, 11, 0.25)"
        };
      default: // cyan
        return {
          primary: "#06b6d4", // Cyber Cyan
          accent: "#3b82f6",
          glow: "rgba(6, 182, 212, 0.4)",
          bgGlow: "rgba(6, 182, 212, 0.15)",
          textGrad: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
          border: "rgba(6, 182, 212, 0.25)"
        };
    }
  };

  const theme = getThemeStyles();

  // -------------------------------------------------------------
  // Electron IPC Listeners
  // -------------------------------------------------------------
  useEffect(() => {
    if (!window.electronAPI) return;

    const removeStatus = window.electronAPI.receive("voice-status", (status) => {
      if (status === "float-active") {
        setIsFloat(true);
        setVoiceStatus("listening");
      } else if (status === "dashboard-active") {
        setIsFloat(false);
        setVoiceStatus("idle");
      } else {
        setVoiceStatus(status);
      }
    });

    const removeTrans = window.electronAPI.receive("transcription", (text) => {
      setTranscription(text);
    });

    const removeResp = window.electronAPI.receive("response-text", (text) => {
      setResponseText(text);
    });

    const removeFeed = window.electronAPI.receive("live-feed-update", (feed) => {
      setLiveFeed((prev) => [feed, ...prev.slice(0, 15)]);
    });

    const removeStats = window.electronAPI.receive("system-stats", (newStats) => {
      setStats(newStats);
    });

    return () => {
      removeStatus();
      removeTrans();
      removeResp();
      removeFeed();
      removeStats();
    };
  }, []);

  // -------------------------------------------------------------
  // Visualizer Animation rendering in Canvas
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      let waveCount = 3;
      let amplitude = 12;
      let frequency = 0.02;
      let speed = 0.08;

      if (voiceStatus === "listening") {
        amplitude = 22;
        frequency = 0.035;
        speed = 0.15;
      } else if (voiceStatus === "thinking") {
        amplitude = 8;
        frequency = 0.05;
        speed = 0.05;
        waveCount = 2;
      } else if (voiceStatus === "speaking") {
        amplitude = 35;
        frequency = 0.025;
        speed = 0.18;
        waveCount = 4;
      }

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = i === 0 ? 3 : 1.5;
        
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        if (voiceStatus === "thinking") {
          grad.addColorStop(0, "rgba(255,255,255,0.05)");
          grad.addColorStop(0.5, theme.primary);
          grad.addColorStop(1, "rgba(255,255,255,0.05)");
        } else if (voiceStatus === "speaking") {
          grad.addColorStop(0, "rgba(255,255,255,0.05)");
          grad.addColorStop(0.5, theme.accent);
          grad.addColorStop(1, "rgba(255,255,255,0.05)");
        } else {
          grad.addColorStop(0, "rgba(255,255,255,0.05)");
          grad.addColorStop(0.5, theme.primary);
          grad.addColorStop(1, "rgba(255,255,255,0.05)");
        }
        
        ctx.strokeStyle = grad;

        const currentPhase = phase + i * (Math.PI / 4);
        const currentAmp = amplitude * (1 - i * 0.25);

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * frequency + currentPhase) * currentAmp;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      phase += speed;
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [voiceStatus, themeColor]);

  // -------------------------------------------------------------
  // Action/Command Dispatchers
  // -------------------------------------------------------------
  const triggerVoiceMode = () => {
    if (window.electronAPI) {
      if (voiceStatus === "idle") {
        window.electronAPI.send("start-voice-mode");
      } else {
        window.electronAPI.send("stop-voice-mode");
      }
    } else {
      setVoiceStatus(voiceStatus === "idle" ? "listening" : "idle");
    }
  };

  const executeAction = (action, params) => {
    if (window.electronAPI) {
      window.electronAPI.send("execute-action", { action, params });
    } else {
      alert(`Activating command: ${action}`);
      setResponseText(`Executing manual action: ${action}`);
    }
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const query = commandInput.trim();
    setCommandInput("");

    if (window.electronAPI) {
      window.electronAPI.send("execute-command", query);
    } else {
      // Simulate input response
      setTranscription(query);
      setResponseText(`Analyzing: "${query}"`);
      setTimeout(() => {
        setResponseText(`Mock Execute completed for: "${query}"`);
        setLiveFeed((prev) => [
          { userSpeech: query, assistantReply: `Mock success response`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...prev
        ]);
      }, 1500);
    }
  };

  const toggleFloat = () => {
    if (window.electronAPI) {
      window.electronAPI.send("toggle-float-mode");
    } else {
      setIsFloat(!isFloat);
    }
  };

  const closeWindow = () => {
    if (window.electronAPI) window.electronAPI.send("close-window");
  };

  const minimizeWindow = () => {
    if (window.electronAPI) window.electronAPI.send("minimize-window");
  };

  // -------------------------------------------------------------
  // Floating Orb Render State
  // -------------------------------------------------------------
  if (isFloat) {
    return (
      <div
        style={{
          width: "320px",
          height: "320px",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          userSelect: "none"
        }}
      >
        <div className="scanline"></div>
        {/* Floating Bubble Circle */}
        <div
          onClick={triggerVoiceMode}
          className="float-bubble-core"
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 12, 28, 0.95) 0%, rgba(3, 5, 12, 0.98) 75%)",
            border: `2px solid ${theme.primary}`,
            boxShadow: `0 0 35px ${theme.glow}, inset 0 0 20px ${theme.glow}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: "pointer",
            animation: "float 4s ease-in-out infinite",
            WebkitAppRegion: "drag"
          }}
        >
          <canvas
            ref={canvasRef}
            width={160}
            height={80}
            style={{ width: "160px", height: "80px", position: "absolute", pointerEvents: "none" }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "18px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: theme.primary,
              textShadow: `0 0 8px ${theme.glow}`,
              pointerEvents: "none"
            }}
          >
            {voiceStatus}
          </div>
        </div>

        {/* Floating control switches */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "12px",
            background: "rgba(6, 10, 20, 0.85)",
            padding: "6px 16px",
            borderRadius: "20px",
            border: `1px solid ${theme.border}`,
            boxShadow: `0 0 10px ${theme.glow}`,
            backdropFilter: "blur(8px)",
            alignItems: "center",
            WebkitAppRegion: "no-drag"
          }}
        >
          <span style={{ fontSize: "10px", color: theme.primary, fontWeight: 700, letterSpacing: "1px" }}>MEDHA</span>
          <button
            onClick={toggleFloat}
            title="Restore Dashboard"
            style={{ background: "none", border: "none", color: theme.primary, cursor: "pointer", display: "flex", alignItems: "center", padding: "2px" }}
          >
            <Maximize2 size={13} />
          </button>
          <button
            onClick={closeWindow}
            title="Exit Medha"
            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px" }}
          >
            <X size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "1100px",
        height: "720px",
        background: "rgba(5, 8, 16, 0.98)",
        border: `1px solid ${theme.primary}`,
        boxShadow: `0 0 25px ${theme.glow}`,
        borderRadius: "16px",
        display: "flex",
        overflow: "hidden",
        position: "relative",
        backdropFilter: "blur(20px)"
      }}
    >
      {/* Visual cyber scanner lines overlay */}
      <div className="scanline"></div>

      {/* Top Drag Header Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: "1px solid rgba(255,255,255,0.02)",
          zIndex: 100,
          WebkitAppRegion: "drag"
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "2px", color: theme.primary, textShadow: `0 0 6px ${theme.glow}` }}>
          MEDHA_CORE_AGENT_PORTAL // SECURE_CHANNEL
        </span>
        <div style={{ display: "flex", gap: "12px", WebkitAppRegion: "no-drag" }}>
          <button onClick={toggleFloat} title="Float Mode" style={topActionBtnStyle}>
            <Minimize2 size={13} style={{ color: theme.primary }} />
          </button>
          <button onClick={minimizeWindow} style={topActionBtnStyle}>
            <span style={{ width: "8px", height: "1px", backgroundColor: "#94a3b8" }}></span>
          </button>
          <button onClick={closeWindow} style={topActionBtnStyle}>
            <X size={13} style={{ color: "#ef4444" }} />
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
      1. SIDEBAR PANEL
      ------------------------------------------------------------- */}
      <div
        style={{
          width: "240px",
          height: "100%",
          background: "rgba(4, 6, 12, 0.9)",
          borderRight: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "50px 20px 20px 20px",
          justifyContent: "space-between",
          zIndex: 10
        }}
      >
        <div>
          {/* Logo Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${theme.bgGlow} 0%, rgba(255,255,255,0.01) 100%)`,
                border: `1px solid ${theme.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 10px ${theme.glow}`
              }}
            >
              <Radio size={18} style={{ color: theme.primary }} />
            </div>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 900, letterSpacing: "1px", color: theme.primary, textShadow: `0 0 8px ${theme.glow}` }}>MEDHA</h2>
              <span style={{ fontSize: "9px", color: "#475569", fontWeight: 700 }}>VER_1.0_CYBERCORE</span>
            </div>
          </div>

          {/* Tab Selector buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <SidebarItem icon={Home} label="Home Console" active={activeTab === "Home"} onClick={() => setActiveTab("Home")} theme={theme} />
            <SidebarItem icon={MessageSquare} label="Cyber Terminal" active={activeTab === "Conversations"} onClick={() => setActiveTab("Conversations")} theme={theme} />
            <SidebarItem icon={TermIcon} label="Action Database" active={activeTab === "Commands"} onClick={() => setActiveTab("Commands")} theme={theme} />
            <SidebarItem icon={Grid} label="App Catalog" active={activeTab === "Apps"} onClick={() => setActiveTab("Apps")} theme={theme} />
            <SidebarItem icon={Workflow} label="System macros" active={activeTab === "Automations"} onClick={() => setActiveTab("Automations")} theme={theme} />
            <SidebarItem icon={Bookmark} label="Memory Cells" active={activeTab === "Memory"} onClick={() => setActiveTab("Memory")} theme={theme} />
            <SidebarItem icon={SettingsIcon} label="Matrix Setup" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} theme={theme} />
          </div>
        </div>

        {/* Sidebar Info Widgets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={sidebarCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "9px", color: "#64748b", fontWeight: 700 }}>PORTAL STATUS</span>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: theme.primary, boxShadow: `0 0 8px ${theme.primary}` }}></span>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#e2e8f0" }}>NODE OPERATIONAL</div>
          </div>

          <div style={{ ...sidebarCardStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "9px", color: "#64748b", fontWeight: 700, marginBottom: "2px" }}>JARVIS CORE</div>
              <div style={{ fontSize: "12px", fontWeight: 900, color: theme.primary }}>ACTIVE</div>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 900, color: "#f1f5f9" }}>100%</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
      2. CENTRAL CONTENT ROUTER (Tab Dependent)
      ------------------------------------------------------------- */}
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "50px 24px 20px 24px",
          zIndex: 10
        }}
      >
        {activeTab === "Home" && (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            {/* Header */}
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: 950,
                  letterSpacing: "5px",
                  color: theme.primary,
                  textShadow: `0 0 10px ${theme.glow}`,
                  margin: 0
                }}
              >
                MEDHA AI
              </h1>
              <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
                AN INTELLIGENT CYBERNETIC CO-PILOT
              </p>
            </div>

            {/* Orb Circle Container */}
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <div
                style={{
                  width: "250px",
                  height: "250px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div style={{ position: "absolute", width: "240px", height: "240px", borderRadius: "50%", border: `1px dashed ${theme.primary}`, opacity: 0.25, animation: "orbit 20s linear infinite" }} />
                <div style={{ position: "absolute", width: "210px", height: "210px", borderRadius: "50%", border: `1px solid ${theme.border}`, opacity: 0.4, animation: "pulse-ring 4s ease-in-out infinite" }} />

                <div
                  onClick={triggerVoiceMode}
                  style={{
                    position: "absolute",
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(6,10,24,0.95) 0%, rgba(3,5,10,0.99) 75%)",
                    border: `2px solid ${theme.primary}`,
                    boxShadow: `0 0 25px ${theme.glow}, inset 0 0 15px ${theme.glow}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    animation: "float 6s ease-in-out infinite",
                    zIndex: 10
                  }}
                >
                  <canvas ref={canvasRef} width={140} height={70} style={{ width: "140px", height: "70px", position: "absolute", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* Transcription Display */}
            <div
              style={{
                alignSelf: "center",
                width: "420px",
                background: "rgba(6, 10, 24, 0.8)",
                border: `1px solid ${theme.border}`,
                boxShadow: `0 0 10px ${theme.bgGlow}`,
                borderRadius: "8px",
                padding: "10px 16px",
                textAlign: "center",
                backdropFilter: "blur(12px)"
              }}
            >
              {transcription && (
                <div style={{ fontSize: "10px", color: theme.primary, fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                  TRANSCRIBED QUERY: "{transcription}"
                </div>
              )}
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>{responseText}</div>
            </div>

            {/* Hacker Input Console Prompter (Enter commands directly) */}
            <form onSubmit={handleCommandSubmit} style={{ marginTop: "15px", position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(4,6,12,0.9)",
                  border: `1px solid ${theme.primary}`,
                  boxShadow: `0 0 12px ${theme.bgGlow}`,
                  borderRadius: "6px",
                  padding: "8px 14px",
                  width: "100%"
                }}
              >
                <span className="terminal-prompt" style={{ marginRight: "10px", fontWeight: 700, color: theme.primary }}>
                  MEDHA_AGENT:/$
                </span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="enter automation instruction (e.g. open chrome, open spotify)..."
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "#f1f5f9",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    caretColor: theme.primary
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.primary,
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "1px"
                  }}
                >
                  EXECUTE
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "Conversations" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: theme.primary, marginBottom: "12px" }}>
              CYBER TERMINAL CHANNEL
            </h2>
            {/* Scrollable chat logs window */}
            <div
              style={{
                flex: 1,
                background: "rgba(4,6,12,0.85)",
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                padding: "16px",
                overflowY: "auto",
                fontFamily: "monospace",
                fontSize: "11px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "16px"
              }}
            >
              <div style={{ color: "#64748b" }}>[System Log: Link established securely. Waiting for cyber node instruction...]</div>
              {liveFeed.map((item, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div style={{ color: theme.primary, fontWeight: 700 }}>
                    &gt; YOU: {item.userSpeech}
                  </div>
                  <div style={{ color: "#e2e8f0", paddingLeft: "12px" }}>
                    🤖 AGENT_MEDHA: {item.assistantReply}
                  </div>
                </div>
              ))}
            </div>

            {/* Input prompt inside conversations tab */}
            <form onSubmit={handleCommandSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(4,6,12,0.9)",
                  border: `1px solid ${theme.primary}`,
                  borderRadius: "6px",
                  padding: "8px 12px"
                }}
              >
                <span className="terminal-prompt" style={{ marginRight: "8px", color: theme.primary }}>
                  TERM_CORE:/$
                </span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="type console instruction..."
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "#f1f5f9",
                    fontFamily: "monospace",
                    fontSize: "12px"
                  }}
                />
              </div>
            </form>
          </div>
        )}

        {activeTab === "Commands" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: theme.primary, marginBottom: "12px" }}>
              ACTION DATABASE (RUN CODE INSTANTLY)
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", flex: 1 }}>
              <CommandCard title="Open Google Chrome" description="Execute Chrome Browser instance" onClick={() => executeAction("open_app", { app: "chrome" })} theme={theme} />
              <CommandCard title="Open Brave Browser" description="Launch window isolated Brave session" onClick={() => executeAction("open_app", { app: "brave" })} theme={theme} />
              <CommandCard title="Open VS Code" description="Launch Visual Studio Code project editor" onClick={() => executeAction("open_app", { app: "vscode" })} theme={theme} />
              <CommandCard title="Open Spotify Desktop" description="Start Spotify player" onClick={() => executeAction("open_app", { app: "spotify" })} theme={theme} />
              <CommandCard title="Open Apple Music" description="Launch native Mac Music App" onClick={() => executeAction("open_app", { app: "apple_music" })} theme={theme} />
              <CommandCard title="Close Chrome" description="Force close Chrome browser executable" onClick={() => executeAction("close_app", { app: "chrome" })} theme={theme} />
              <CommandCard title="Close Brave" description="Close active Brave window via script" onClick={() => executeAction("close_app", { app: "brave" })} theme={theme} />
              <CommandCard title="Sleep Mode" description="Suspend system core runtime" onClick={() => executeAction("sleep_mode", {})} theme={theme} />
            </div>
          </div>
        )}

        {activeTab === "Apps" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: theme.primary, marginBottom: "12px" }}>
              APP CATALOG (FUNCTIONAL SHORTCUTS)
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", overflowY: "auto", flex: 1 }}>
              <AppIconCard icon={Chrome} name="Google Chrome" onClick={() => executeAction("open_app", { app: "chrome" })} theme={theme} />
              <AppIconCard icon={Code} name="VS Code" onClick={() => executeAction("open_app", { app: "vscode" })} theme={theme} />
              <AppIconCard icon={Music} name="Spotify" onClick={() => executeAction("open_app", { app: "spotify" })} theme={theme} />
              <AppIconCard icon={Radio} name="Apple Music" onClick={() => executeAction("open_app", { app: "apple_music" })} theme={theme} />
              <AppIconCard icon={MessageSquare} name="WhatsApp" onClick={() => executeAction("open_app", { app: "whatsapp" })} theme={theme} />
              <AppIconCard icon={Terminal} name="Terminal" onClick={() => executeAction("open_app", { app: "terminal" })} theme={theme} />
              <AppIconCard icon={Compass} name="Safari" onClick={() => executeAction("open_app", { app: "safari" })} theme={theme} />
              <AppIconCard icon={FolderOpen} name="Finder" onClick={() => executeAction("open_app", { app: "finder" })} theme={theme} />
              <AppIconCard icon={Globe} name="Google.com" onClick={() => executeAction("open_url", { url: "https://google.com" })} theme={theme} />
            </div>
          </div>
        )}

        {activeTab === "Automations" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: theme.primary, marginBottom: "12px" }}>
              SYSTEM MACROS (COMPLEX WORKFLOW RUNNER)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", flex: 1 }}>
              <MacroCard
                name="Work Dev Scenario"
                description="Launch Google Chrome and Visual Studio Code concurrently"
                onActivate={async () => {
                  executeAction("open_app", { app: "chrome" });
                  executeAction("open_app", { app: "vscode" });
                }}
                theme={theme}
              />
              <MacroCard
                name="Relax & Sound Mode"
                description="Open Spotify and Apple Music interfaces"
                onActivate={async () => {
                  executeAction("open_app", { app: "spotify" });
                  executeAction("open_app", { app: "apple_music" });
                }}
                theme={theme}
              />
              <MacroCard
                name="Focus Space"
                description="Close communication apps (WhatsApp)"
                onActivate={async () => {
                  executeAction("close_app", { app: "whatsapp" });
                }}
                theme={theme}
              />
            </div>
          </div>
        )}

        {activeTab === "Memory" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: theme.primary, marginBottom: "12px" }}>
              MEMORY CELLS (DUMP REGISTER VALUES)
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", overflowY: "auto", flex: 1, fontFamily: "monospace", fontSize: "11px" }}>
              <MemoryItem label="AGENT_PORTAL" value="active" theme={theme} />
              <MemoryItem label="CYBER_THEME" value={themeColor.toUpperCase()} theme={theme} />
              <MemoryItem label="JARVIS_CORE" value="ENABLED" theme={theme} />
              <MemoryItem label="PLATFORM_SYSTEM" value={window.electronAPI ? "ELECTRON_NATIVE" : "WEB_SIMULATION"} theme={theme} />
              <MemoryItem label="DB_CONNECTION" value="ONLINE" theme={theme} />
              <MemoryItem label="CPU_LOAD" value={`${stats.cpu}%`} theme={theme} />
            </div>
          </div>
        )}

        {activeTab === "Settings" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: theme.primary, marginBottom: "20px" }}>
              MATRIX SETUP CONFIGURATIONS
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Theme Customization */}
              <div>
                <h3 style={{ fontSize: "12px", color: "#CBD5E1", marginBottom: "10px", fontWeight: 700 }}>NEON SPECTRUM SELECTOR</h3>
                <div style={{ display: "flex", gap: "12px" }}>
                  <ColorThemeOption name="Cyber Cyan" color="#06b6d4" active={themeColor === "cyan"} onClick={() => setThemeColor("cyan")} />
                  <ColorThemeOption name="Matrix Green" color="#10b981" active={themeColor === "green"} onClick={() => setThemeColor("green")} />
                  <ColorThemeOption name="Synth Purple" color="#a855f7" active={themeColor === "purple"} onClick={() => setThemeColor("purple")} />
                  <ColorThemeOption name="Amber Tech" color="#f59e0b" active={themeColor === "amber"} onClick={() => setThemeColor("amber")} />
                </div>
              </div>

              {/* Safety Guard info */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", padding: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#CBD5E1", marginBottom: "4px" }}>PROACTIVE SAFETY SAFEGUARD</div>
                <div style={{ fontSize: "10px", color: "#64748b", lineHeight: "1.4" }}>
                  The application is guarded by an automated memory sentinel. In case memory usage exceeds 1.5 GB, it will force quit to protect your MacBook's RAM.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
      3. RIGHT DATA DASHBOARD PANEL
      ------------------------------------------------------------- */}
      <div
        style={{
          width: "320px",
          height: "100%",
          background: "rgba(4, 6, 12, 0.75)",
          borderLeft: `1px solid ${theme.border}`,
          padding: "50px 20px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
          zIndex: 10
        }}
      >
        {/* Today's Overview */}
        <div style={widgetCardStyle}>
          <h3 style={widgetTitleStyle}>OVERVIEW INDEX</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <OverviewItem label="Commands Executed" value="24" color={theme.primary} />
            <OverviewItem label="Tasks Completed" value="16" color="#22c55e" />
            <OverviewItem label="Saved Compute Time" value="2h 34m" color={theme.accent} />
          </div>
        </div>

        {/* Quick Actions (Shortcut Panel) */}
        <div style={widgetCardStyle}>
          <h3 style={widgetTitleStyle}>SHORTCUT PANEL</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <ActionButton icon={Chrome} label="Chrome" onClick={() => executeAction("open_app", { app: "chrome" })} theme={theme} />
            <ActionButton icon={Code} label="VS Code" onClick={() => executeAction("open_app", { app: "vscode" })} theme={theme} />
            <ActionButton icon={Music} label="Spotify" onClick={() => executeAction("open_app", { app: "spotify" })} theme={theme} />
            <ActionButton icon={Youtube} label="YouTube" onClick={() => executeAction("open_url", { url: "https://youtube.com" })} theme={theme} />
          </div>
        </div>

        {/* Live feed logs */}
        <div style={{ ...widgetCardStyle, flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={widgetTitleStyle}>LIVE FEED LOGS</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", flex: 1, paddingRight: "4px" }}>
            {liveFeed.map((item, index) => (
              <div key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "9px", color: theme.primary, fontWeight: 800 }}>USER_SHELL</span>
                  <span style={{ fontSize: "8px", color: "#475569" }}>{item.time}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#f1f5f9", marginTop: "2px" }}>"{item.userSpeech}"</div>
                <div style={{ fontSize: "10px", color: theme.accent, fontWeight: 700, marginTop: "2px" }}>🤖 {item.assistantReply}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostics charts */}
        <div style={widgetCardStyle}>
          <h3 style={widgetTitleStyle}>DIAGNOSTIC TELEMETRY</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <StatGaugeBar label="CPU Core" value={stats.cpu} theme={theme} />
            <StatGaugeBar label="System Memory" value={stats.memory} theme={theme} />
            <StatGaugeBar label="AI Engine Core" value={stats.aiEngine} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component Definitions (Modular Layouts)
// -------------------------------------------------------------

function SidebarItem({ icon: Icon, label, active, onClick, theme }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        background: active ? theme.bgGlow : "transparent",
        border: active ? `1px solid ${theme.primary}` : "1px solid transparent",
        color: active ? theme.primary : "#94a3b8",
        fontSize: "12px",
        fontWeight: active ? 800 : 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        textShadow: active ? `0 0 6px ${theme.glow}` : "none"
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function OverviewItem({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{label}</span>
      <span style={{ fontSize: "12px", fontWeight: 800, color }}>{value}</span>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, theme }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 10px",
        borderRadius: "6px",
        background: "rgba(255, 255, 255, 0.01)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        color: "#cbd5e1",
        fontSize: "10px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
        justifyContent: "center"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme.bgGlow;
        e.currentTarget.style.borderColor = theme.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.04)";
      }}
    >
      <Icon size={12} style={{ color: theme.primary }} />
      <span>{label}</span>
    </button>
  );
}

function StatGaugeBar({ label, value, theme }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#94a3b8", fontWeight: 700, marginBottom: "3px" }}>
        <span>{label.toUpperCase()}</span>
        <span>{value}%</span>
      </div>
      <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`, borderRadius: "2px", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function FooterItem({ text, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6px 12px",
        background: "rgba(255,255,255,0.01)",
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: "6px",
        width: "90px"
      }}
    >
      <span style={{ fontSize: "8px", color: "#475569", fontWeight: 800, letterSpacing: "0.5px" }}>{text}</span>
      <span style={{ fontSize: "9px", color, fontWeight: 800, marginTop: "2px" }}>{value}</span>
    </div>
  );
}

function CommandCard({ title, description, onClick, theme }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "rgba(6, 10, 24, 0.75)",
        border: `1px solid rgba(255,255,255,0.03)`,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "10px",
        transition: "border 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
      }}
    >
      <div>
        <h3 style={{ fontSize: "11px", color: "#f1f5f9", fontWeight: 700 }}>{title}</h3>
        <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>{description}</p>
      </div>
      <button
        onClick={onClick}
        style={{
          alignSelf: "flex-end",
          background: theme.bgGlow,
          border: `1px solid ${theme.primary}`,
          color: theme.primary,
          fontSize: "9px",
          padding: "3px 8px",
          borderRadius: "4px",
          fontWeight: 800,
          cursor: "pointer"
        }}
      >
        RUN
      </button>
    </div>
  );
}

function AppIconCard({ icon: Icon, name, onClick, theme }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 10px",
        background: "rgba(6, 10, 24, 0.75)",
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        gap: "10px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.primary;
        e.currentTarget.style.boxShadow = `0 0 10px ${theme.bgGlow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Icon size={24} style={{ color: theme.primary }} />
      <span style={{ fontSize: "10px", color: "#cbd5e1", fontWeight: 700 }}>{name}</span>
    </div>
  );
}

function MacroCard({ name, description, onActivate, theme }) {
  const [active, setActive] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        background: "rgba(6,10,24,0.75)",
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: "8px"
      }}
    >
      <div>
        <h3 style={{ fontSize: "11px", color: "#f1f5f9", fontWeight: 700 }}>{name.toUpperCase()}</h3>
        <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>{description}</p>
      </div>
      <button
        onClick={() => {
          onActivate();
          setActive(true);
          setTimeout(() => setActive(false), 2000);
        }}
        style={{
          background: active ? "#22c55e" : theme.bgGlow,
          border: `1px solid ${active ? "#22c55e" : theme.primary}`,
          color: active ? "#fff" : theme.primary,
          fontSize: "10px",
          fontWeight: 800,
          padding: "5px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        {active ? "TRIGGERED" : "RUN MACRO"}
      </button>
    </div>
  );
}

function MemoryItem({ label, value, theme }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: "rgba(6,10,24,0.75)",
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <span style={{ color: "#64748b", fontWeight: 700 }}>{label}</span>
      <span style={{ color: theme.primary, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function ColorThemeOption({ name, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        background: active ? "rgba(255,255,255,0.04)" : "transparent",
        border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
        borderRadius: "20px",
        color: active ? "#f1f5f9" : "#94a3b8",
        fontSize: "10px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s"
      }}
    >
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: color }} />
      <span>{name}</span>
    </button>
  );
}

const topActionBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  transition: "background 0.2s"
};

const sidebarCardStyle = {
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "8px",
  padding: "10px 12px",
};

const widgetCardStyle = {
  background: "rgba(13, 20, 38, 0.35)",
  border: "1px solid rgba(255, 255, 255, 0.02)",
  borderRadius: "10px",
  padding: "12px 14px",
};

const widgetTitleStyle = {
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "1px",
  color: "#64748b",
  marginBottom: "10px",
  borderBottom: "1px solid rgba(255,255,255,0.03)",
  paddingBottom: "4px"
};
