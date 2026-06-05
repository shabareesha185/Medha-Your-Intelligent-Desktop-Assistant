# Shared application metadata configuration
# Centralizes process names and execution properties for macOS and Windows
# Supports 12 widely used system applications natively

APPS = {
    "chrome": {
        "macos": {
            "name": "Google Chrome",
            "process": "Google Chrome",
            "supports_new_window": True
        },
        "windows": {
            "exec": "chrome",
            "process": "chrome.exe",
            "supports_new_window": True
        }
    },
    "chrome-tab": {
        "macos": {
            "name": "Google Chrome",
            "process": "Google Chrome"
        },
        "windows": {
            "exec": "chrome",
            "process": "chrome.exe"
        }
    },
    "brave": {
        "macos": {
            "name": "Brave Browser",
            "process": "Brave Browser",
            "supports_new_window": True
        },
        "windows": {
            "exec": "brave",
            "process": "brave.exe",
            "paths": [
                "BraveSoftware\\Brave-Browser\\Application\\brave.exe"
            ],
            "supports_new_window": True
        }
    },
    "brave-tab": {
        "macos": {
            "name": "Brave Browser",
            "process": "Brave Browser"
        },
        "windows": {
            "exec": "brave",
            "process": "brave.exe"
        }
    },
    "spotify": {
        "macos": {
            "name": "Spotify",
            "process": "Spotify"
        },
        "windows": {
            "exec": "spotify",
            "uri": "spotify:",
            "process": "Spotify.exe"
        }
    },
    "apple_music": {
        "macos": {
            "name": "Music",
            "process": "Music"
        },
        "windows": {
            "exec": "apple-music",
            "uri": "apple-music:",
            "process": "AppleMusic.exe"
        }
    },
    "whatsapp": {
        "macos": {
            "name": "WhatsApp",
            "process": "WhatsApp"
        },
        "windows": {
            "uri": "whatsapp:",
            "process": "WhatsApp.exe"
        }
    },
    "vscode": {
        "macos": {
            "name": "Visual Studio Code",
            "process": "Visual Studio Code"
        },
        "windows": {
            "exec": "code",
            "process": "Code.exe"
        }
    },
    "slack": {
        "macos": {
            "name": "Slack",
            "process": "Slack"
        },
        "windows": {
            "exec": "slack",
            "uri": "slack:",
            "process": "Slack.exe"
        }
    },
    "discord": {
        "macos": {
            "name": "Discord",
            "process": "Discord"
        },
        "windows": {
            "exec": "discord",
            "uri": "discord:",
            "process": "Discord.exe"
        }
    },
    "zoom": {
        "macos": {
            "name": "zoom.us",
            "process": "zoom.us"
        },
        "windows": {
            "exec": "zoom",
            "process": "Zoom.exe"
        }
    },
    "safari": {
        "macos": {
            "name": "Safari",
            "process": "Safari"
        },
        "windows": {
            "exec": "msedge",
            "process": "msedge.exe"
        }
    },
    "finder": {
        "macos": {
            "name": "Finder",
            "process": "Finder"
        },
        "windows": {
            "exec": "explorer",
            "process": "explorer.exe"
        }
    },
    "terminal": {
        "macos": {
            "name": "Terminal",
            "process": "Terminal"
        },
        "windows": {
            "exec": "powershell",
            "process": "powershell.exe"
        }
    }
}