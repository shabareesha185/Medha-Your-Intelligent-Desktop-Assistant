import os from "os";

/**
 * Local Offline Intelligence Provider
 * Zero-dependency heuristic knowledge engine, math processor, and conversational brain.
 * Guarantees Medha NEVER crashes and always responds articulately even with no internet or API keys.
 */
export class LocalProvider {
  constructor() {
    this.name = "Local Cyber Core";
  }

  isConfigured() {
    return true; // Always available
  }

  async generate(prompt) {
    const clean = prompt.toLowerCase().trim();

    // 1. Math Calculation Intent
    const mathAnswer = this.evaluateMath(clean);
    if (mathAnswer !== null) {
      return mathAnswer;
    }

    // 2. Time & Date
    if (clean.includes("time") && (clean.includes("what") || clean.includes("current") || clean.includes("tell"))) {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return `The current local time is ${timeStr}.`;
    }

    if ((clean.includes("date") || clean.includes("day")) && (clean.includes("what") || clean.includes("today"))) {
      const dateStr = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      return `Today is ${dateStr}.`;
    }

    // 3. Identity & Creator
    if (clean.includes("who are you") || clean.includes("what are you") || clean.includes("introduce yourself")) {
      return "I am Medha, your elite cyberpunk desktop intelligence assistant. Core systems optimal, ready for your commands.";
    }

    if (clean.includes("who made you") || clean.includes("who created you") || clean.includes("your developer")) {
      return "I was created as an intelligent desktop operating assistant by Yashwanth and the engineering team.";
    }

    if (clean.includes("what can you do") || clean.includes("help") || clean.includes("commands") || clean.includes("features")) {
      return "I can launch and close desktop apps, open browser tabs, search YouTube and Google, stream media, calculate values, and manage your desktop environment natively.";
    }

    // 4. Greetings
    if (clean === "hi" || clean === "hello" || clean === "hey" || clean.startsWith("hello ") || clean.startsWith("hi ") || clean === "yo") {
      const greetings = [
        "Greetings! Medha system link active. How can I assist you?",
        "System online and listening. What command shall we execute?",
        "Hello! Cyber core ready. What is your objective today?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // 5. Well-being
    if (clean.includes("how are you") || clean.includes("how do you do") || clean.includes("how are things")) {
      return "All core telemetry metrics are optimal. CPU load stable and neural threads primed. How can I help you?";
    }

    // 6. Gratitude
    if (clean.includes("thank you") || clean.includes("thanks") || clean.includes("good job") || clean.includes("great work")) {
      return "Always at your service. Standing by for your next instruction.";
    }

    // 7. Entertainment / Quotes / Jokes
    if (clean.includes("joke") || clean.includes("funny")) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "There are 10 types of people in the world: those who understand binary, and those who do not.",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (clean.includes("quote") || clean.includes("motivate") || clean.includes("motivation")) {
      const quotes = [
        "The best way to predict the future is to invent it.",
        "First, solve the problem. Then, write the code.",
        "Simplicity is the soul of efficiency."
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    }

    // 8. System Status Query
    if (clean.includes("status") || clean.includes("health") || clean.includes("system stats")) {
      const platform = os.platform();
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
      return `Medha node active on ${platform}. System memory: ${freeMem} GB free out of ${totalMem} GB total. All automation hooks operational.`;
    }

    // 9. Intelligent Conversational Fallback
    return `Received: "${prompt}". Core memory logged. To trigger native system actions, you can also ask me to open apps, search videos, or control browser tabs.`;
  }

  evaluateMath(input) {
    // Matches expressions like: 25 * 4, calculate 100 / 5, what is 50 + 20, 15 % 4
    const sanitized = input
      .replace(/calculate|what is|compute|solve|\?/gi, "")
      .trim();

    if (/^[\d\s+\-*/().^%]+$/.test(sanitized) && /[+\-*/%]/.test(sanitized)) {
      try {
        // Safe evaluation of basic mathematical expressions using Function constructor without global scope
        const sanitizedExpr = sanitized.replace(/[^0-9+\-*/().%]/g, "");
        const result = new Function(`return (${sanitizedExpr})`)();
        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return `The result is ${result}.`;
        }
      } catch {
        return null;
      }
    }
    return null;
  }
}
