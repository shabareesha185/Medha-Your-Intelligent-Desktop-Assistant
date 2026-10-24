import { GeminiProvider } from "./providers/gemini.provider.js";
import { GroqProvider } from "./providers/groq.provider.js";
import { LocalProvider } from "./providers/local.provider.js";

/**
 * Multi-Model Resilient Circuit Breaker
 * Dynamically balances and cascades between high-speed LLMs and local offline intelligence.
 * Guarantees zero dropped requests even when rate limits or network hiccups occur.
 */
export class CircuitBreaker {
  constructor(config = {}) {
    this.providers = [
      new GroqProvider(config.groqApiKey || process.env.GROQ_API_KEY),
      new GeminiProvider(config.geminiApiKey || process.env.GEMINI_API_KEY),
      new LocalProvider()
    ];
    this.lastSuccessfulProvider = null;
  }

  setApiKey(providerName, key) {
    if (providerName.toLowerCase().includes("gemini")) {
      process.env.GEMINI_API_KEY = key;
      const p = this.providers.find(x => x instanceof GeminiProvider);
      if (p) p.apiKey = key;
    } else if (providerName.toLowerCase().includes("groq")) {
      process.env.GROQ_API_KEY = key;
      const p = this.providers.find(x => x instanceof GroqProvider);
      if (p) p.apiKey = key;
    }
  }

  getActiveProviderInfo() {
    for (const p of this.providers) {
      if (p.isConfigured()) {
        return { name: p.name, type: "cloud", configured: true };
      }
    }
    return { name: "Local Cyber Core", type: "local", configured: true };
  }

  async ask(prompt) {
    let lastError = null;

    for (const provider of this.providers) {
      if (!provider.isConfigured()) {
        continue;
      }

      try {
        const response = await provider.generate(prompt);
        if (response && response.length > 0) {
          this.lastSuccessfulProvider = provider.name;
          return {
            text: response,
            provider: provider.name
          };
        }
      } catch (err) {
        lastError = err;
        console.warn(`[BRAIN] Provider "${provider.name}" failed: ${err.message}. Cascading to next provider...`);
      }
    }

    // Absolute fallback: ensure LocalProvider executes if not reached
    const local = new LocalProvider();
    const fallbackText = await local.generate(prompt);
    return {
      text: fallbackText,
      provider: local.name,
      fallbackWarning: lastError ? lastError.message : undefined
    };
  }
}
