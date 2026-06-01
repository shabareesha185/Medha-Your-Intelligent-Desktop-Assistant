import { openUrl } from "../../automation/open-url.js";

import { YoutubeSearchSchema } from "../../schemas/youtube-search.schema.js";

export class YoutubeSearchTool {
  schema = YoutubeSearchSchema;

  async execute(params) {
    const query = encodeURIComponent(params.query);
    const url = `https://www.youtube.com/results?search_query=${query}`;

    return openUrl(url);
  }
}
