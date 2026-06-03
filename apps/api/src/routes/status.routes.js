import { Router } from "express";
import { voiceState } from "../../../../packages/voice/voice-state.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    return res.json({
      success: true,
      app: "Medha",
      version: "1.0.0-alpha",
      platform: process.platform,
      api: "online",
      voiceMode: voiceState.enabled,
      voiceStatus: voiceState.status,
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
