import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const CONTACT_EMAIL = "seif-dx@proton.me";

/**
 * Sends the visitor's message to Seif via Resend. Uses the shared
 * onboarding sender (works without domain verification); reply_to is the
 * visitor so Seif can answer them directly from his inbox.
 */
export const sendEmail = createTool({
  id: "sendEmail",
  description:
    "Send an email to Seif on the visitor's behalf (project inquiries, job opportunities, questions). Requires the visitor's name, email and message. Ask for anything missing and confirm the message with the visitor before calling this tool — never invent their details.",
  inputSchema: z.object({
    name: z.string().min(1).describe("The visitor's full name, as they gave it"),
    email: z.string().email().describe("The visitor's email address, for replies"),
    message: z
      .string()
      .min(10)
      .describe("The message to send, confirmed by the visitor"),
  }),
  outputSchema: z.object({
    sent: z.boolean(),
    detail: z.string(),
  }),
  execute: async ({ name, email, message }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return {
        sent: false,
        detail: `Email sending is not configured right now. Ask the visitor to email ${CONTACT_EMAIL} directly instead.`,
      };
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Agent <onboarding@resend.dev>",
        to: [CONTACT_EMAIL],
        reply_to: [email],
        subject: `Portfolio contact from ${name}`,
        text: `From: ${name} <${email}>\nVia: portfolio AI assistant\n\n${message}`,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`sendEmail failed: ${res.status} ${body}`);
      return {
        sent: false,
        detail: `Sending failed. Ask the visitor to email ${CONTACT_EMAIL} directly instead.`,
      };
    }
    return {
      sent: true,
      detail: `Message delivered to Seif. He can reply directly to ${email}.`,
    };
  },
});
