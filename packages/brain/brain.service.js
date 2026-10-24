import { plan } from "../planner/planner.js";
import { getResponse } from "../automation/responses.js";
import { CircuitBreaker } from "./circuit-breaker.js";

/**
 * Medha Unified Intelligence Brain Service
 * Harmonizes instant local OS automation with multi-model conversational reasoning.
 */
export class BrainService {
  constructor(config = {}) {
    this.circuitBreaker = new CircuitBreaker(config);
  }

  getActiveProviderInfo() {
    return this.circuitBreaker.getActiveProviderInfo();
  }

  setApiKey(providerName, key) {
    this.circuitBreaker.setApiKey(providerName, key);
  }

  /**
   * Process any user input string from terminal, UI, or voice microphone.
   * @param {string} input - Raw user utterance or typed text.
   * @returns {Promise<{ type: "automation"|"conversation", action: string, params: object, verbalResponse: string, provider?: string }>}
   */
  async process(input) {
    const trimmed = (input || "").trim();
    if (!trimmed) {
      return {
        type: "conversation",
        action: "speak",
        params: { text: "Standing by. Let me know what to execute." },
        verbalResponse: "Standing by. Let me know what to execute.",
        provider: "Local Cyber Core"
      };
    }

    // Layer 1: Check for OS Automation Intent (Open app, close app, tabs, media, sleep)
    try {
      const command = plan(trimmed);
      if (command && command.action) {
        const verbal = getResponse(command.action, command.params);
        return {
          type: "automation",
          action: command.action,
          params: command.params,
          verbalResponse: verbal,
          provider: "OS Automation Core"
        };
      }
    } catch {
      // Not an OS automation intent -> route directly to AI Conversational Brain
    }

    // Layer 2: Generative Intelligence via Resilient Circuit Breaker
    const brainResult = await this.circuitBreaker.ask(trimmed);

    return {
      type: "conversation",
      action: "speak",
      params: { text: brainResult.text },
      verbalResponse: brainResult.text,
      provider: brainResult.provider
    };
  }
}

// Singleton export
export const brain = new BrainService();
