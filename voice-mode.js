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

      //   console.log("\nRaw:", speech.text);
      console.log("You: ", text);

      if (!text) {
        console.log("No speech detected");
        continue;
      }

      if (text === "exit" || text === "stop voice mode") {
        // console.log("EXIT DETECTED");
        await speak("Voice mode stopped");
        process.exit(0);
      }

      const command = plan(speech.text);
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
