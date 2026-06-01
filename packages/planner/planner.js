// which converts:
// Open Chrome

// into:

// {
//   "action":"open_app",
//   "params":{
//      "app":"chrome"
//   }
// }

export function plan(text) {
  const input = text.toLowerCase().trim();

  if (input.includes("open chrome")) {
    return {
      action: "open_app",
      params: {
        app: "chrome",
      },
    };
  }

  if (input.includes("open vscode")) {
    return {
      action: "open_app",
      params: {
        app: "vscode",
      },
    };
  }

  if (input.includes("open spotify")) {
    return {
      action: "open_app",
      params: {
        app: "spotify",
      },
    };
  }

  throw new Error("Command not recognized");
}
