import { openUrl } from "../../automation/open-url.js";
import { GoogleSearchSchema } from "../../schemas/google-search.schema.js";

export class GoogleSearchTool {
  schema = GoogleSearchSchema;
  async execute(params) {
    const query = encodeURIComponent(params.query);
    const url = `https://www.google.com/search?q=${query}`;

    return openUrl(url);
  }
}
