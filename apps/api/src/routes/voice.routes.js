import { Router } from "express";
import { transcribe } from "../../../../packages/automation/transcribe.js";
import { plan } from "../../../../packages/planner/planner.js";
import { execute } from "../../../../packages/executor/executor.js";
import { getResponse } from "../../../../packages/automation/responses.js";
import { speak } from "../../../../packages/automation/speak.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const speech = await transcribe();

    console.log("\n========== WHISPER OUTPUT ==========");
    console.log(JSON.stringify(speech, null, 2));

    const command = plan(speech.text);

    const assistant = getResponse(command.action, command.params);
    await speak(assistant); // voice output

    const result = await execute(command.action, command.params, speech.text);

    return res.json({
      user: speech.text,
      assistant,
      command,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      user: speech?.text || null,
      assistant: "Sorry, I couldn't process that command.",
      error: error.message,
    });
  }
});

export default router;
