import { transcribe } from "./packages/automation/transcribe.js";
import { speak } from "./packages/automation/speak.js";
import { plan } from "./packages/planner/planner.js";
import { execute } from "./packages/executor/executor.js";
import { getResponse } from "./packages/automation/responses.js";
import { voiceState } from "./packages/voice/voice-state.js";

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

      const command = plan(commandText);

      console.log("\nCommand:", command);

      voiceState.status = "speaking";

      await speak(getResponse(command.action, command.params));

      voiceState.status = "thinking";

      const result = await execute(command.action, command.params);

      console.log("\nResult:", result);

      voiceState.status = "idle";
    } catch (error) {
      console.error("\nError:", error.message);

      voiceState.status = "speaking";

      await speak("Sorry, I didn't understand.");

      voiceState.status = "idle";
    }
  }
}

startVoiceMode();
