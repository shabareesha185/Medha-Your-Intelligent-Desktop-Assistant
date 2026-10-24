import { Router } from "express";
import { brain } from "../../../../packages/brain/brain.service.js";
import { execute } from "../../../../packages/executor/executor.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const outcome = await brain.process(req.body.text);

    let executionResult = null;
    if (outcome.type === "automation") {
      executionResult = await execute(outcome.action, outcome.params);
    }

    return res.json({
      success: true,
      type: outcome.type,
      response: outcome.verbalResponse,
      provider: outcome.provider,
      action: outcome.action,
      params: outcome.params,
      result: executionResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
