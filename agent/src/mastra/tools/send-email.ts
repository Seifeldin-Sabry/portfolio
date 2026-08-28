const CONTACT_EMAIL = "seif-dx@proton.me";

/**
 * Delivery path for the /contact API route (approved drafts from the
 * draftEmail flow and direct form submissions). Uses the shared Resend
 * onboarding sender (works without domain verification); reply_to is the
 * visitor so Seif can answer them directly from his inbox.
 */
export async function deliverContactEmail({
  name,
  email,
  message,
  subject,
}: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}): Promise<{ sent: boolean; detail: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      sent: false,
      detail: `Email sending is not configured right now. Email ${CONTACT_EMAIL} directly instead.`,
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
      subject: subject?.trim() || `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\nVia: portfolio AI assistant\n\n${message}`,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`deliverContactEmail failed: ${res.status} ${body}`);
    return {
      sent: false,
      detail: `Sending failed. Email ${CONTACT_EMAIL} directly instead.`,
    };
  }
  return {
    sent: true,
    detail: `Message delivered to Seif. He can reply directly to ${email}.`,
  };
}
