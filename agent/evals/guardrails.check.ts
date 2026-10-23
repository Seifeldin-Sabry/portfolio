/**
 * Self-check for the input guardrails (no network): `tsx evals/guardrails.check.ts`.
 * Proves the injection guard fails CLOSED and the PII regexes redact what they should.
 */
import assert from "node:assert/strict";

import { PII_RULES } from "../src/mastra/agents/portfolio-agent";
import {
  BLOCKED_MESSAGE,
  CLASSIFIERS,
  GUARD_UNAVAILABLE_MESSAGE,
  parseScore,
  PromptGuard,
  windows,
} from "../src/mastra/processors/prompt-guard";

assert.equal(parseScore("0.9993"), 0.9993);
assert.equal(parseScore("BENIGN"), 0);
assert.equal(parseScore("MALICIOUS"), 1);
assert.ok(Number.isNaN(parseScore("")));
assert.ok(Number.isNaN(parseScore("7")), "out-of-range is unparseable, not allowed");
assert.equal(windows("x".repeat(100)).length, 1);
assert.equal(windows("x".repeat(5000)).length, 2);

const msg = (text: string) => [{ role: "user", content: { format: 2, parts: [{ type: "text", text }] } }] as any;
const aborted = (reason?: string): never => {
  throw new Error(`ABORT:${reason}`);
};
const reply = (content: string, status = 200) => async () =>
  new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status });

async function verdict(fetchImpl: () => Promise<Response>): Promise<string> {
  globalThis.fetch = fetchImpl as any;
  try {
    await new PromptGuard().processInput({ messages: msg("hello"), abort: aborted });
    return "allowed";
  } catch (err: any) {
    return String(err.message).replace("ABORT:", "");
  }
}

process.env.GROQ_API_KEY = "test";
assert.equal(await verdict(reply("0.01")), "allowed");
assert.equal(await verdict(reply("BENIGN")), "allowed");
assert.equal(await verdict(reply("0.99")), BLOCKED_MESSAGE);
assert.equal(await verdict(reply("¯\\_(ツ)_/¯")), GUARD_UNAVAILABLE_MESSAGE, "garbage reply must block");
assert.equal(await verdict(reply("", 429)), GUARD_UNAVAILABLE_MESSAGE, "rate limit must block, not allow");
assert.equal(await verdict(async () => { throw new Error("network down"); }), GUARD_UNAVAILABLE_MESSAGE);
// Fallback chain: a broken or rate-limited classifier hands over to the next one.
const sequence = (...responses: (() => Promise<Response>)[]) => {
  let call = 0;
  return () => responses[Math.min(call++, responses.length - 1)]();
};
assert.ok(CLASSIFIERS.length >= 2, "guard needs more than one quota bucket");
assert.equal(await verdict(sequence(reply("", 500), reply("0.02"))), "allowed", "falls through a 500");
assert.equal(await verdict(sequence(reply("", 429), reply("¯\\_(ツ)_/¯"), reply("0.97"))), BLOCKED_MESSAGE, "last classifier still decides");
assert.equal(await verdict(sequence(reply("", 429), reply("", 429), reply("", 429))), GUARD_UNAVAILABLE_MESSAGE, "all down blocks");
delete process.env.GROQ_API_KEY;
assert.equal(await verdict(reply("0.01")), GUARD_UNAVAILABLE_MESSAGE, "missing key must block");

const redact = (text: string) =>
  PII_RULES.reduce((t, r) => t.replace(new RegExp(r.pattern.source, r.pattern.flags), r.replacement), text);
assert.equal(redact("card 4111 1111 1111 1111 ok"), "card [card] ok");
assert.equal(redact("call +32 468 29 52 40"), "call [phone]");
assert.equal(redact("IBAN BE71 0961 2345 6769"), "IBAN [iban]");
assert.equal(redact("ssn 123-45-6789"), "ssn [ssn]");
assert.equal(redact("mail jane@example.com"), "mail jane@example.com", "emails pass through for booking");
assert.equal(redact("I worked there from 2021 to 2024"), "I worked there from 2021 to 2024", "years are not phones");
assert.equal(redact("version 1.4.0 shipped"), "version 1.4.0 shipped");

console.log("guardrails ok");
