import { openApp } from "../../automation/open-app.js";
import { OpenAppSchema } from "../../schemas/open-app.schema.js";

export class OpenAppTool {
  async execute(params) {
    OpenAppSchema.parse(params);
    return openApp(params.app);
  }
}
