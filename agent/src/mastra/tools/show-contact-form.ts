import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Renders an inline contact form in the chat UI (the frontend watches for
 * this tool call). The visitor's name/email/message go straight from the
 * form to the /contact endpoint — personal details never pass through the
 * LLM, so PII guardrails never conflict with contact capture.
 */
export const showContactForm = createTool({
  id: "showContactForm",
  description:
    "Show the visitor an inline contact form to send Seif a message. Call this when the visitor wants to reach Seif, leave their contact details, discuss salary/availability, or asks something only Seif can answer. Do NOT ask the visitor to type their email or personal details into the chat.",
  inputSchema: z.object({
    reason: z
      .string()
      .describe("Short reason the form is being shown, e.g. 'salary question'"),
  }),
  outputSchema: z.object({
    shown: z.boolean(),
    detail: z.string(),
  }),
  execute: async () => ({
    shown: true,
    detail:
      "Contact form displayed. Tell the visitor to drop their details in the form below — it goes straight to Seif's inbox and he'll reply directly.",
  }),
});
