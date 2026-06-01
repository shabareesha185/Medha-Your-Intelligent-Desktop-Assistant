import { openUrl } from "../../automation/open-url.js";
import { UrlSchema } from "../../schemas/url.schema.js";

export class OpenUrlTool {
  schema = UrlSchema;
  async execute(params) {
    return openUrl(params.url);
  }
}
