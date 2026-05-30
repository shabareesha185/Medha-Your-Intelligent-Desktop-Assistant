import { OpenAppTool } from "./tools/open-app.tool.js";
import { CloseAppTool } from "./tools/close-app.tool.js";

export const registry = {
  open_app: new OpenAppTool(),
  close_app: new CloseAppTool(),
};
