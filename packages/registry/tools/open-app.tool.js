import { openApp } from "../../automation/open-app.js";

export class OpenAppTool {
  async execute(params) {
    return openApp(params.app);
  }
}
