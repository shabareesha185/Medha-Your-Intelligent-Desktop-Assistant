import { Router } from "express";
import { ZodError } from "zod";
import { execute } from "../../../../packages/executor/executor.js";
import { CommandSchema } from "../../../../packages/schemas/command.schema.js";
import { speak } from "../../../../packages/automation/speak.js";
import { getResponse } from "../../../../packages/automation/responses.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const command = CommandSchema.parse(req.body);

    const assistant = getResponse(command.action, command.params);
    await speak(assistant);

    const result = await execute(
      command.action,
      command.params,
      req.body.commandText || "",
    );

    return res.json({
      user: req.body.text || command.action,
      assistant,
      command,
      result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        user: req.body || null,
        assistant: "Sorry, I couldn't understand that command.",
        error: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      user: req.body || null,
      assistant: "Sorry, I couldn't process that command.",
      error: error.message,
    });
  }
});

export default router;
