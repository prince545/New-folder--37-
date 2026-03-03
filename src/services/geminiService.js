/**
 * EnhancedGeminiService
 *
 * Centralised Gemini API wrapper used across the app.
 * Replaces both the old axios-based geminiService.js and
 * the inline GeminiService class that lived inside Workspace.jsx.
 */
export class EnhancedGeminiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    }

    // ── Low-level helpers ──────────────────────────────────────────────────

    async _post(body) {
        if (!this.apiKey) {
            throw new Error("Gemini API Key is missing! Please enter your key.");
        }

        const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`Gemini API Error: ${data.error.message}`);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }

    /**
     * Generate a response from a simple text prompt (with retry).
     */
    async generate(prompt, options = {}) {
        const { temperature = 0.2, maxRetries = 3 } = options;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this._post({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature },
                });
            } catch (error) {
                if (attempt === maxRetries) throw error;
                await new Promise((r) => setTimeout(r, 1000 * attempt));
            }
        }
    }

    /**
     * Generate a response with a pre-built `contents` array
     * (used for multi-turn chat where caller builds conversation history).
     */
    async generateWithContents(contents, options = {}) {
        const { temperature = 0.7, maxRetries = 3 } = options;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this._post({
                    contents,
                    generationConfig: { temperature },
                });
            } catch (error) {
                if (attempt === maxRetries) throw error;
                await new Promise((r) => setTimeout(r, 1000 * attempt));
            }
        }
    }

    // ── Specific AI features ───────────────────────────────────────────────

    async generateSteps(code, problemTitle, approach, complexity) {
        const prompt = `You are an expert algorithm teacher. Create a step-by-step visualization for:
Problem: ${problemTitle}
Approach: ${approach} (${complexity} complexity)
Code: ${code}

Generate EXACTLY 5-8 visualization steps that teach a beginner:
1. Each step MUST have a clear "desc" explaining WHAT and WHY
2. Include "formula" showing the mathematical operation
3. Show "data" array state (max 8 elements)
4. Track relevant "scalars" (counters, sums, etc.)
5. Use "pointers" to show indices being processed

Return ONLY valid JSON array. Format:
[{
  "desc": "Step explanation with learning moment",
  "formula": "math expression = result",
  "data": [numbers],
  "scalars": {"sum": 0, "max": 5},
  "pointers": {"i": 0, "j": 1}
}]`;

        const response = await this.generate(prompt, { temperature: 0.3 });
        return this._parseJSONResponse(response);
    }

    async getHint(code, problemTitle) {
        const prompt = `As a coding tutor, give me a HINT for ${problemTitle}.
My current code: ${code}

Provide a progressive hint system:
1. First, what's the key insight needed?
2. What data structure might help?
3. What's the time complexity goal?
4. A small nudge towards the solution (not the full code)

Keep it encouraging and educational. Use bullet points.`;

        return this.generate(prompt, { temperature: 0.7 });
    }

    async explainCode(code, problemTitle) {
        const prompt = `Explain this ${problemTitle} solution like I'm 5 years old, then like I'm a CS student:

Code: ${code}

Format:
🎯 **For Beginners**: (simple analogies)
🔧 **How it Works**: (step-by-step)
⚡ **Time & Space**: (complexity analysis)
💡 **Key Takeaways**: (learning points)`;

        return this.generate(prompt, { temperature: 0.5 });
    }

    async debugCode(code, problemTitle) {
        const prompt = `Debug this ${problemTitle} solution with TEACHING in mind:

${code}

Analyze:
🐛 **Syntax Errors**: (if any)
🧠 **Logic Errors**: (explain WHY it's wrong)
⚠️ **Edge Cases**: (what's missing)
✅ **Fixed Version**: (show corrected code with comments explaining fixes)

Focus on teaching, not just fixing.`;

        return this.generate(prompt, { temperature: 0.4 });
    }

    // ── Internal helpers ───────────────────────────────────────────────────

    _parseJSONResponse(text) {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("No valid JSON array found in response");

        try {
            return JSON.parse(jsonMatch[0]);
        } catch {
            const cleaned = jsonMatch[0]
                .replace(/(['"'])?([a-zA-Z0-9_]+)(['"'])?:/g, '"$2":')
                .replace(/,\s*}/g, "}")
                .replace(/,\s*\]/g, "]");
            return JSON.parse(cleaned);
        }
    }
}

// ── Legacy export (kept for backward compatibility) ───────────────────────
export { EnhancedGeminiService as GeminiService };
