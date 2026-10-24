import { transcribe } from "./packages/automation/transcribe.js";
import { execute } from "./packages/executor/executor.js";
import { speak } from "./packages/automation/speak.js";
import { brain } from "./packages/brain/brain.service.js";

async function speakAndPrint(message) {
  console.log(`🤖 Medha AI: "${message}"`);
  await speak(message);
}

async function voiceLoop() {
  await speakAndPrint("Hello Yashwanth, I am Medha AI. How can I help you today?");

  while (true) {
    try {
      const result = await transcribe();
      const text = result.text.trim();

      if (!text) {
        console.log("🤫 No speech detected. Please speak louder.");
        continue;
      }

      console.log(`🗣️ You said: "${text}"`);

      const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim().toLowerCase();
      if (cleanText === "exit" || cleanText === "stop" || cleanText === "quit" || cleanText === "bye") {
        await speakAndPrint("Goodbye!");
        break;
      }

      // 1. Process via Unified Multi-Model Brain (Automation + LLM Conversation)
      const outcome = await brain.process(text);
      console.log(`🤖 [${outcome.provider}] Response: "${outcome.verbalResponse}"`);

      await speakAndPrint(outcome.verbalResponse);

      // 2. Execute the planned tool if it is an OS automation action
      if (outcome.type === "automation") {
        await execute(outcome.action, outcome.params);
      }

      // Wait a moment before listening again so TTS finishes speaking
      await new Promise((resolve) => setTimeout(resolve, 3000));

    } catch (error) {
      console.error("❌ An error occurred in the voice loop:", error);
      await speakAndPrint("Sorry, an error occurred while processing your command.");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

voiceLoop().catch(console.error);
