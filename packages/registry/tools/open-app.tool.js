import { openApp } from "../../automation/open-app.js";
import { OpenAppSchema } from "../../schemas/open-app.schema.js";

export class OpenAppTool {
  schema = OpenAppSchema;

  async execute(params) {
    return openApp(params.app);
  }
}
