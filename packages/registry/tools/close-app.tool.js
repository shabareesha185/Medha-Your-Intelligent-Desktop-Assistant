import { closeApp } from "../../automation/close-app.js";
import { CloseAppSchema } from "../../schemas/close-app.schema.js";

export class CloseAppTool {
  async execute(params) {
    CloseAppSchema.parse(params);
    return closeApp(params.app);
  }
}
