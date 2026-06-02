import { transcribe } from "./packages/automation/transcribe.js";
import { speak } from "./packages/automation/speak.js";
import { plan } from "./packages/planner/planner.js";
import { execute } from "./packages/executor/executor.js";
import { getResponse } from "./packages/automation/responses.js";

async function startVoiceMode() {
  console.log("\n🎤 Medha Voice Mode Started");
  console.log("Say 'exit' to stop voice mode.\n");

  while (true) {
    try {
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
        await speak("Voice mode stopped");
        process.exit(0);
      }

      if (!text.startsWith("medha")) {
        console.log("Wake word not detected");
        continue;
      }

      const commandText = text.replace(/^medha\s*/, "");
      const command = plan(commandText);
      console.log("\nCommand:", command);

      await speak(getResponse(command.action, command.params));

      const result = await execute(command.action, command.params);

      console.log("\nResult:", result);
    } catch (error) {
      console.error("\nError:", error.message);

      await speak("Sorry, I didn't understand.");
    }
  }
}

startVoiceMode();
