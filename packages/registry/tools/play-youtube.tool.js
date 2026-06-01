import { playYoutube } from "../../automation/play-youtube.js";
import { PlayYoutubeSchema } from "../../schemas/play-youtube.schema.js";

export class PlayYoutubeTool {
  schema = PlayYoutubeSchema;

  async execute(params) {
    return playYoutube(params.query);
  }
}
