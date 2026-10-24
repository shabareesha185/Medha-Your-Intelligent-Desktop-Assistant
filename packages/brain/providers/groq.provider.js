import { MEDHA_SYSTEM_PROMPT } from "../persona.js";

/**
 * Groq Cloud Provider
 * Delivers ultra-low latency inference (~300+ tokens/sec) with open-source models (Llama 3.3).
 */
export class GroqProvider {
  constructor(apiKey) {
    this.name = "Groq (Llama 3.3)";
    this.apiKey = apiKey;
    this.model = "llama-3.3-70b-versatile";
    this.fallbackModel = "llama-3.1-8b-instant";
    this.timeoutMs = 6000;
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  async generate(prompt) {
    if (!this.isConfigured()) {
      throw new Error("Groq API key not configured");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: MEDHA_SYSTEM_PROMPT },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 250
        })
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Groq HTTP ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("Groq returned empty choice content");
      }

      return text.trim();
    } finally {
      clearTimeout(timer);
    }
  }
}
