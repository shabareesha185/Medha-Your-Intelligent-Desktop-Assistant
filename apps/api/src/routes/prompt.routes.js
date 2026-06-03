import { Router } from "express";
import { plan } from "../../../../packages/planner/planner.js";
import { execute } from "../../../../packages/executor/executor.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const command = plan(req.body.text);
    const result = await execute(command.action, command.params);

    return res.json({
      command,
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
