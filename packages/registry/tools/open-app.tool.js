export class OpenAppTool {
  async execute(params) {
    const { app } = params;

    console.log(`Opening ${app}`);

    return {
      success: true,
      message: `Opening ${app}`,
    };
  }
}
