import "server-only";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  sent: boolean;
  reason?: string;
}

// Minimal Resend integration via fetch — no SDK dependency needed for a
// single transactional email. Without RESEND_API_KEY (not configured for
// this project yet — see technical report) this safely no-ops instead of
// throwing, so the surrounding inquiry submission still succeeds; the
// inquiry itself is always saved to the database regardless of email
// delivery, which is the actual source of truth for admins.
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("[email] RESEND_API_KEY/RESEND_FROM_EMAIL not configured — skipping email send.");
    return { sent: false, reason: "not_configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!response.ok) {
      console.error("[email] Resend request failed", response.status, await response.text());
      return { sent: false, reason: "provider_error" };
    }

    return { sent: true };
  } catch (error) {
    console.error("[email] Failed to send email", error);
    return { sent: false, reason: "network_error" };
  }
}
