import type { MastraDBMessage } from "@mastra/core/agent";
import type { Processor } from "@mastra/core/processors";

/**
 * Prompt-injection guard backed by Llama Prompt Guard 2 (86M), a classifier
 * built for exactly this job. It has its own free-tier bucket on Groq
 * (500K tokens/day), separate from the chat and judge models.
 *
 * Fails CLOSED: if the classifier errors, times out or returns something we
 * can't parse, the message is blocked. Mastra's LLM-based detector fails open
 * ("Detection agent failed, allowing content"), which silently disabled the
 * guard whenever the shared Groq quota ran out.
 */
const GUARD_MODEL = "meta-llama/llama-prompt-guard-2-86m";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
/** Prompt Guard returns P(malicious); above this we block. */
const BLOCK_THRESHOLD = 0.8;
/** The model's context is 512 tokens; long messages are checked head and tail. */
const WINDOW_CHARS = 1500;
const TIMEOUT_MS = 8000;

export const BLOCKED_MESSAGE =
  "I can only help with questions about Seif and his work. If you'd like to reach him directly, ask me to show the contact form.";

export const GUARD_UNAVAILABLE_MESSAGE =
  "My safety check is briefly unavailable, so I can't answer right now. Please try again in a minute, or email seif-dx@proton.me.";

function lastUserText(messages: MastraDBMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return "";
  const content: any = last.content;
  if (typeof content === "string") return content;
  const parts: any[] = content?.parts ?? [];
  const text = parts.filter((p) => p?.type === "text").map((p) => p.text).join("\n");
  return text || (typeof content?.content === "string" ? content.content : "");
}

/** Splits long input into the windows the 512-token model can actually see. */
export function windows(text: string): string[] {
  if (text.length <= WINDOW_CHARS) return [text];
  return [text.slice(0, WINDOW_CHARS), text.slice(-WINDOW_CHARS)];
}

/**
 * Parses Prompt Guard's reply: a probability like "0.9993", or a label
 * (BENIGN / MALICIOUS / JAILBREAK / INJECTION). NaN means unparseable.
 */
export function parseScore(reply: unknown): number {
  if (typeof reply !== "string") return NaN;
  if (/\b(malicious|jailbreak|injection)\b/i.test(reply)) return 1;
  if (/\bbenign\b/i.test(reply)) return 0;
  const match = reply.match(/\d*\.?\d+(e-?\d+)?/i);
  const score = match ? Number(match[0]) : NaN;
  return score >= 0 && score <= 1 ? score : NaN;
}

async function score(text: string, apiKey: string): Promise<number> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: GUARD_MODEL, messages: [{ role: "user", content: text }] }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`prompt guard HTTP ${res.status}`);
  const body: any = await res.json();
  return parseScore(body?.choices?.[0]?.message?.content);
}

export class PromptGuard implements Processor<"prompt-guard"> {
  readonly id = "prompt-guard";
  readonly name = "Prompt Guard (fail-closed)";

  async processInput({
    messages,
    abort,
  }: {
    messages: MastraDBMessage[];
    abort: (reason?: string) => never;
  }): Promise<MastraDBMessage[]> {
    const text = lastUserText(messages).trim();
    if (!text) return messages;

    let scores: number[];
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error("GROQ_API_KEY missing");
      scores = await Promise.all(windows(text).map((w) => score(w, apiKey)));
    } catch (err) {
      console.error("[prompt-guard] classifier unavailable, blocking (fail-closed):", err);
      return abort(GUARD_UNAVAILABLE_MESSAGE);
    }
    if (scores.some((s) => Number.isNaN(s))) {
      console.error("[prompt-guard] unparseable classifier reply, blocking (fail-closed)");
      return abort(GUARD_UNAVAILABLE_MESSAGE);
    }
    if (scores.some((s) => s >= BLOCK_THRESHOLD)) abort(BLOCKED_MESSAGE);
    return messages;
  }
}
