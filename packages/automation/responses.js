export function getResponse(action, params = {}) {
  switch (action) {
    case "open_app":
      return `Sure. Opening ${params.app}`;

    case "close_app":
      return `Closing ${params.app}`;

    case "open_url":
      return "Opening that website";

    case "google_search":
      return `Searching Google for ${params.query}`;

    case "youtube_search":
      return `Searching YouTube for ${params.query}`;

    case "play_youtube":
      return `Playing ${params.query}`;

    default:
      return "Working on it";
  }
}
