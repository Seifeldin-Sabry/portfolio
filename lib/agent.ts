/** Base URL of the agent worker (chat, contact, evals). */
export const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "http://localhost:4111"

/** The worker's /contact limits; longer messages are trimmed client-side, not rejected. */
const MAX_MESSAGE = 2000

/**
 * Sends a message straight to Seif's inbox via the worker's /contact endpoint
 * (Resend). Visitor details never pass through the LLM.
 */
export async function sendToSeif(fields: {name: string; email: string; message: string}): Promise<boolean> {
    try {
        const res = await fetch(`${AGENT_URL}/contact`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({...fields, message: fields.message.slice(0, MAX_MESSAGE)}),
        })
        const data = await res.json().catch(() => null)
        return res.ok && data?.sent === true
    } catch {
        return false
    }
}
