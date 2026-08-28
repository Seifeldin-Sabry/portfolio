import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Renders an inline booking form in the chat UI (the frontend watches for
 * this tool call). The visitor fills in name/email there and the frontend
 * opens a prefilled Calendly link (30 min) — personal details never pass
 * through the LLM, so PII guardrails never conflict with booking.
 */
export const bookMeeting = createTool({
  id: "bookMeeting",
  description:
    "Show the visitor an inline booking form to schedule a 30-minute call with Seif. Call this when the visitor wants to book a call, talk, or meet. Do NOT ask the visitor to type their name or email into the chat — the form collects them.",
  inputSchema: z.object({
    reason: z
      .string()
      .optional()
      .describe("Optional: short reason the call is being booked"),
  }),
  outputSchema: z.object({
    shown: z.boolean(),
    detail: z.string(),
  }),
  execute: async () => ({
    shown: true,
    detail:
      "Booking form displayed. Tell the visitor to drop their details in the form below — it opens a prefilled Calendly page where they pick a 30-minute slot.",
  }),
});
