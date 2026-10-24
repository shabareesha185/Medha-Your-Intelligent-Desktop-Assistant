import { transcribe } from "./packages/automation/transcribe.js";
import { speak } from "./packages/automation/speak.js";
import { execute } from "./packages/executor/executor.js";
import { voiceState } from "./packages/voice/voice-state.js";
import { brain } from "./packages/brain/brain.service.js";

async function startVoiceMode() {
  voiceState.enabled = true;
  voiceState.status = "idle";

  console.log("\n🎤 Medha Voice Mode Started");
  console.log("Say 'exit' to stop voice mode.\n");

  while (true) {
    try {
      voiceState.status = "listening";

      const speech = await transcribe();

      const text = speech.text
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "");

      console.log("\nYou:", speech.text);

      if (!text) {
        continue;
      }

      if (text === "exit" || text === "stop voice mode") {
        voiceState.status = "speaking";

        await speak("Voice mode stopped");

        voiceState.enabled = false;
        voiceState.status = "idle";

        process.exit(0);
      }

      // Wake word (enable later)
      // if (!text.startsWith("medha")) {
      //   console.log("Wake word not detected");
      //   continue;
      // }

      const commandText = text.replace(/^medha\s*/, "");

      voiceState.status = "thinking";

      const outcome = await brain.process(commandText);
      console.log(`\nBrain (${outcome.provider}):`, outcome.verbalResponse);

      voiceState.status = "speaking";
      await speak(outcome.verbalResponse);

      if (outcome.type === "automation") {
        voiceState.status = "thinking";
        const result = await execute(outcome.action, outcome.params);
        console.log("\nResult:", result);
      }

      voiceState.status = "idle";
    } catch (error) {
      console.error("\nError:", error.message);

      voiceState.status = "speaking";
      await speak("Sorry, I encountered an internal error.");
      voiceState.status = "idle";
    }
  }
}

startVoiceMode();
