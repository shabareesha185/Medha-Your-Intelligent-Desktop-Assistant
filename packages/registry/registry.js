import { OpenAppTool } from "./tools/open-app.tool.js";
import { CloseAppTool } from "./tools/close-app.tool.js";
import { OpenUrlTool } from "./tools/open-url.tool.js";
import { GoogleSearchTool } from "./tools/google-search.tool.js";
import { YoutubeSearchTool } from "./tools/youtube-search.tool.js";
import { PlayYoutubeTool } from "./tools/play-youtube.tool.js";
import { SleepModeTool } from "./tools/sleep-mode.tool.js";

export const registry = {
  open_app: new OpenAppTool(),
  close_app: new CloseAppTool(),
  open_url: new OpenUrlTool(),
  google_search: new GoogleSearchTool(),
  youtube_search: new YoutubeSearchTool(),
  play_youtube: new PlayYoutubeTool(),
  sleep_mode: new SleepModeTool(),
};
