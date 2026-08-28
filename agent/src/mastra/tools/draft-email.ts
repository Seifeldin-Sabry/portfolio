import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Human-in-the-loop email drafting. The agent composes the email from the
 * conversation; the frontend renders the draft with name/email inputs and
 * an approve step. On approval the draft goes to the /contact endpoint —
 * the visitor's personal details never pass through the LLM.
 */
export const draftEmail = createTool({
  id: "draftEmail",
  description:
    "Draft an email to Seif on the visitor's behalf and show it for approval. Compose the subject and body yourself from what the visitor asked for. The visitor sees the draft with an approve button and name/email fields — do NOT ask them to type their name or email into the chat. If they request changes, call this tool again with the revised draft.",
  inputSchema: z.object({
    subject: z
      .string()
      .min(3)
      .describe("Subject line for the email to Seif"),
    body: z
      .string()
      .min(10)
      .describe(
        "The email body, written on the visitor's behalf. Plain text, short and professional. Do not include name/email placeholders — the form collects those.",
      ),
  }),
  outputSchema: z.object({
    shown: z.boolean(),
    detail: z.string(),
  }),
  execute: async () => ({
    shown: true,
    detail:
      "Draft displayed with an approve step. Tell the visitor to review it below — they can approve to send it, or ask you to change it.",
  }),
});
