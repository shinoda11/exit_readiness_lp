/**
 * SendGrid provider
 * 
 * Uses SendGrid API for sending emails.
 * This is the fallback provider when Manus mail is unavailable.
 */

import sgMail from "@sendgrid/mail";

export interface SendGridMailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  category?: string;
  idempotencyKey?: string;
}

export interface SendGridMailResponse {
  provider: "sendgrid";
  messageId?: string;
  success: boolean;
  error?: string;
}

/**
 * Send email via SendGrid
 * 
 * @param payload Email payload
 * @returns Response with messageId if successful
 */
export async function sendSendGridEmail(
  payload: SendGridMailPayload
): Promise<SendGridMailResponse> {
  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@manus.space";

    if (!SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not set");
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: payload.to,
      from: SENDGRID_FROM_EMAIL,
      subject: payload.subject,
      text: payload.text || "",
      html: payload.html,
      ...(payload.category && { categories: [payload.category] }),
      ...(payload.idempotencyKey && {
        customArgs: { idempotency_key: payload.idempotencyKey },
      }),
    };

    const [response] = await sgMail.send(msg);

    return {
      provider: "sendgrid",
      messageId: response.headers["x-message-id"] as string | undefined,
      success: true,
    };
  } catch (error) {
    console.error("[SendGrid] Send error:", error);
    return {
      provider: "sendgrid",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
