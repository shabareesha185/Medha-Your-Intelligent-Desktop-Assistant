import { Router } from "express";
import { speak } from "../../../../packages/automation/speak.js";

const router = Router();

router.post("/", async (req, res) => {
  const { text } = req.body;

  await speak(text);

  return res.json({
    success: true,
  });
});

export default router;
