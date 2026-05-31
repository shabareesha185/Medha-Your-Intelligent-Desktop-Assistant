import { openUrl } from "../../automation/open-url.js";
import { UrlSchema } from "../../schemas/url.schema.js";

export class OpenUrlTool {
  async execute(params) {
    // Validate input
    UrlSchema.parse(params);

    return openUrl(params.url);
  }
}
