import { closeApp } from "../../automation/close-app.js";
import { CloseAppSchema } from "../../schemas/close-app.schema.js";

export class CloseAppTool {
  schema = CloseAppSchema;

  async execute(params) {
    return closeApp(params.app);
  }
}
