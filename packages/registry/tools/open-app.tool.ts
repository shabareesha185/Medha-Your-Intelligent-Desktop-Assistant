import { Tool } from "../tool.interface.ts";

export class OpenAppTool implements Tool {
  name = "open_app";

  async execute(params: any) {
    console.log(`Opening ${params.app}`);

    return {
      success: true,
      message: `Opening ${params.app}`,
    };
  }
}
