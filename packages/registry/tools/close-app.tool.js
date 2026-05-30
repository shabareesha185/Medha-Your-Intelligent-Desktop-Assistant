import { closeApp } from "../../automation/close-app.js";

export class CloseAppTool {
  async execute(params) {
    return closeApp(params.app);
  }
}
