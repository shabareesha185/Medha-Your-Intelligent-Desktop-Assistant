export function plan(text) {
  const input = text.toLowerCase().trim();

  // Sleep Mode
  if (
    input.includes("sleep") ||
    input.includes("suspend") ||
    input.includes("hibernate")
  ) {
    return {
      action: "sleep_mode",
      params: {},
    };
  }

  // Play Youtube
  if (input.startsWith("play ")) {
    const query = input.replace("play", "").trim();

    return {
      action: "play_youtube",
      params: {
        query,
      },
    };
  }

  // close Apps
  if (input.includes("close chrome")) {
    return {
      action: "close_app",
      params: {
        app: "chrome",
      },
    };
  }

  // Open Apps
  if (
    input.includes("open chrome tab") ||
    input.includes("new tab chrome") ||
    input.includes("chrome new tab") ||
    input.includes("chrome tab")
  ) {
    return {
      action: "open_app",
      params: {
        app: "chrome-tab",
      },
    };
  }

  if (
    input.includes("open brave tab") ||
    input.includes("new tab brave") ||
    input.includes("brave new tab") ||
    input.includes("brave tab")
  ) {
    return {
      action: "open_app",
      params: {
        app: "brave-tab",
      },
    };
  }

  if (input.includes("open chrome")) {
    return {
      action: "open_app",
      params: {
        app: input.includes("-new") ? "chrome-new" : "chrome",
      },
    };
  }

  if (input.includes("open vscode") || input.includes("open vs code")) {
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

  if (
    input.includes("open apple music") ||
    input.includes("open music") ||
    input.includes("open applemusic")
  ) {
    return {
      action: "open_app",
      params: {
        app: "apple_music",
      },
    };
  }

  if (input.includes("open whatsapp")) {
    return {
      action: "open_app",
      params: {
        app: "whatsapp",
      },
    };
  }

  if (input.includes("open brave")) {
    return {
      action: "open_app",
      params: {
        app: input.includes("-new") ? "brave-new" : "brave",
      },
    };
  }

  if (input.includes("open slack")) {
    return {
      action: "open_app",
      params: {
        app: "slack",
      },
    };
  }

  if (input.includes("open discord")) {
    return {
      action: "open_app",
      params: {
        app: "discord",
      },
    };
  }

  if (input.includes("open zoom")) {
    return {
      action: "open_app",
      params: {
        app: "zoom",
      },
    };
  }

  if (input.includes("open safari")) {
    return {
      action: "open_app",
      params: {
        app: "safari",
      },
    };
  }

  if (input.includes("open finder")) {
    return {
      action: "open_app",
      params: {
        app: "finder",
      },
    };
  }

  if (input.includes("open terminal")) {
    return {
      action: "open_app",
      params: {
        app: "terminal",
      },
    };
  }

  // Close Apps
  if (
    input.startsWith("close ") ||
    input.startsWith("exit ") ||
    input.startsWith("quit ")
  ) {
    const appToClose = input.replace(/^(close|exit|quit)\s+/, "").trim();
    const validApps = [
      "chrome",
      "brave",
      "spotify",
      "apple_music",
      "music",
      "applemusic",
      "whatsapp",
      "vscode",
      "vs code",
      "slack",
      "discord",
      "zoom",
      "safari",
      "finder",
      "terminal",
    ];
    if (validApps.includes(appToClose)) {
      let canonicalApp = appToClose;
      if (appToClose === "vs code" || appToClose === "vscode") {
        canonicalApp = "vscode";
      } else if (
        appToClose === "music" ||
        appToClose === "applemusic" ||
        appToClose === "apple_music"
      ) {
        canonicalApp = "apple_music";
      }
      return {
        action: "close_app",
        params: {
          app: canonicalApp,
        },
      };
    }
  }

  // Open Websites
  if (input.includes("open google")) {
    return {
      action: "open_url",
      params: {
        url: "https://google.com",
      },
    };
  }

  if (input.includes("open youtube")) {
    return {
      action: "open_url",
      params: {
        url: "https://youtube.com",
      },
    };
  }

  // Search YouTube
  if (input.includes("youtube") && input.includes("search")) {
    const query = input
      .replace("search", "")
      .replace("on youtube", "")
      .replace("youtube", "")
      .trim();

    return {
      action: "youtube_search",
      params: {
        query,
      },
    };
  }

  // Google Search
  if (input.startsWith("search ")) {
    const query = input.replace("search", "").trim();

    return {
      action: "google_search",
      params: {
        query,
      },
    };
  }

  throw new Error("Command not recognized");
}
