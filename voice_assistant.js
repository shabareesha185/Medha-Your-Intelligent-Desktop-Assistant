import { transcribe } from "./packages/automation/transcribe.js";
import { plan } from "./packages/planner/planner.js";
import { execute } from "./packages/executor/executor.js";
import { speak } from "./packages/automation/speak.js";

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

      // 1. Natural Language Planning
      let plannedAction;
      try {
        plannedAction = plan(text);
      } catch (err) {
        await speakAndPrint("Sorry, I could not recognize that command.");
        continue;
      }

      // 2. Generate a friendly spoken response based on the action
      let responseText = "";
      const { action, params } = plannedAction;

      if (action === "speak") {
        responseText = params.text;
      } else if (action === "open_app") {
        const parts = params.app.split(" ");
        const appName = parts[0];
        const songName = parts.slice(1).join(" ");
        
        const friendlyAppName = appName === "apple_music" ? "Apple Music" : appName.charAt(0).toUpperCase() + appName.slice(1);

        if (songName) {
          responseText = `Opening ${friendlyAppName} and playing ${songName}`;
        } else {
          responseText = `Opening ${friendlyAppName}`;
        }
      } else if (action === "close_app") {
        const friendlyAppName = params.app === "apple_music" ? "Apple Music" : params.app.charAt(0).toUpperCase() + params.app.slice(1);
        responseText = `Closing ${friendlyAppName}`;
      } else if (action === "open_url") {
        responseText = `Opening ${params.url}`;
      } else if (action === "google_search") {
        responseText = `Searching Google for ${params.query}`;
      } else if (action === "youtube_search") {
        responseText = `Searching YouTube for ${params.query}`;
      } else if (action === "play_youtube") {
        responseText = `Playing ${params.query} on YouTube`;
      }

      if (responseText) {
        await speakAndPrint(responseText);
      }

      // 3. Execute the planned tool
      if (action !== "speak") {
        await execute(action, params);
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
