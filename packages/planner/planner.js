export function plan(text) {
  const input = text.toLowerCase().trim();

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

  // Open Apps
  if (input.includes("open chrome")) {
    return {
      action: "open_app",
      params: {
        app: "chrome",
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
