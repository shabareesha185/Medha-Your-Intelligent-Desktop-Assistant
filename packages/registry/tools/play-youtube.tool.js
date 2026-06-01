import { playYoutube } from "../../automation/play-youtube.js";
import { PlayYoutubeSchema } from "../../schemas/play-youtube.schema.js";

export class PlayYoutubeTool {
  async execute(params) {
    PlayYoutubeSchema.parse(params);
    return playYoutube(params.query);
  }
}
