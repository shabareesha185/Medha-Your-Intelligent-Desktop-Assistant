import { MEDHA_SYSTEM_PROMPT } from "../persona.js";

/**
 * Google Gemini Provider
 * Uses Gemini 1.5 Flash via official REST API (ultra-low cost, high free tier limits).
 */
export class GeminiProvider {
  constructor(apiKey) {
    this.name = "Gemini 1.5 Flash";
    this.apiKey = apiKey;
    this.model = "gemini-1.5-flash";
    this.timeoutMs = 7000;
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  async generate(prompt) {
    if (!this.isConfigured()) {
      throw new Error("Gemini API key not configured");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: MEDHA_SYSTEM_PROMPT }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250
          }
        })
      });

      if (!res.ok) {
        const errorBody = await res.text().catch(() => "");
        throw new Error(`Gemini HTTP ${res.status}: ${errorBody.slice(0, 200)}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Gemini returned empty candidate response");
      }

      return text.trim();
    } finally {
      clearTimeout(timer);
    }
  }
}
