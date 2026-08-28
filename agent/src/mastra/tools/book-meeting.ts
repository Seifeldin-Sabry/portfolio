import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const CALENDLY_URL = "https://calendly.com/seifeldin-sdx/45min";

/**
 * Booking is a prefilled Calendly link rather than a Calendly API call:
 * no secret to leak, no availability sync to maintain, and the visitor
 * still lands on a form with their details already filled in.
 */
export const bookMeeting = createTool({
  id: "bookMeeting",
  description:
    "Book a call with Seif. Requires the visitor's name and email; returns a Calendly link prefilled with their details. Ask for name and email before calling this tool — never guess them.",
  inputSchema: z.object({
    name: z.string().min(1).describe("The visitor's full name, as they gave it"),
    email: z.string().email().describe("The visitor's email address"),
    topic: z
      .string()
      .optional()
      .describe("Optional: what the visitor wants to discuss"),
  }),
  outputSchema: z.object({
    bookingUrl: z.string(),
    note: z.string(),
  }),
  execute: async ({ name, email, topic }) => {
    const url = new URL(CALENDLY_URL);
    url.searchParams.set("name", name);
    url.searchParams.set("email", email);
    if (topic) url.searchParams.set("a1", topic);
    return {
      bookingUrl: url.toString(),
      note: "Share this link with the visitor; their name and email are prefilled. They pick a time slot themselves.",
    };
  },
});
