import { Router } from "express";
import { CommandHistory } from "../../../../packages/memory/models/command-history.model.js";
import { getResponse } from "../../../../packages/automation/responses.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const history = await CommandHistory.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const conversations = history.map((item) => ({
      id: item._id,
      user: item.commandText || `${item.action}`,
      assistant: item.result,
      status: item.status,
      createdAt: item.createdAt,
    }));

    return res.json({
      success: true,
      count: conversations.length,
      history: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
