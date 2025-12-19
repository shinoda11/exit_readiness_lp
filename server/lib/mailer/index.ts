/**
 * Mailer adapter
 * 
 * Provides a unified interface for sending emails via different providers.
 * Supports Manus mail (default) and SendGrid (fallback).
 */

import { sendManusEmail, type ManusMailPayload } from "./providers/manus";
import { sendSendGridEmail, type SendGridMailPayload } from "./providers/sendgrid";

export interface MailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  category?: string;
  idempotencyKey?: string;
}

export interface MailResponse {
  provider: string;
  messageId?: string;
  success: boolean;
  error?: string;
}

/**
 * Send email via configured provider
 * 
 * Environment variables:
 * - MAIL_PROVIDER: "manus" (default) or "sendgrid"
 * - MAIL_DRY_RUN: "true" to skip actual sending (for testing)
 * 
 * @param payload Email payload
 * @returns Response with provider name and messageId if successful
 */
export async function sendMail(payload: MailPayload): Promise<MailResponse> {
  const provider = process.env.MAIL_PROVIDER || "manus";
  const dryRun = process.env.MAIL_DRY_RUN === "true";

  // DRY_RUN mode: log and return success without sending
  if (dryRun) {
    console.log("[Mailer] DRY_RUN mode: Email not sent", {
      provider,
      to: payload.to,
      subject: payload.subject,
      category: payload.category,
    });
    return {
      provider: `${provider}-dry-run`,
      messageId: `dry-run-${Date.now()}`,
      success: true,
    };
  }

  // Send via configured provider
  if (provider === "sendgrid") {
    const response = await sendSendGridEmail(payload as SendGridMailPayload);
    return response;
  }

  // Default: Manus mail
  const response = await sendManusEmail(payload as ManusMailPayload);
  return response;
}

/**
 * Send NotYet followup email (30-day re-diagnosis reminder)
 * 
 * @param to Recipient email address
 * @param fitGateUrl URL to Fit Gate for re-diagnosis
 * @returns Response with provider name and messageId if successful
 */
export async function sendNotYetFollowupEmail(
  to: string,
  fitGateUrl: string
): Promise<MailResponse> {
  const subject = "【Exit OS】そろそろもう一度、世界線を見直してみませんか？";
  
  const text = `こんにちは。Exit Readiness OS の適合チェックを受けていただいてから、30日が経ちました。

当時は「まだ少し早い（not yet）」という判定でしたが、この1か月の間に、年収・貯蓄・仕事・住まい・将来のイメージなどに変化はありましたか？

もし変化があれば、一度「適合チェック」を取り直してみてください。
数字と前提をアップデートすることで、「いまは Prep Mode か」「そろそろ 1on1 に進んでもよいか」の見直しができます。

▼ 適合チェックに戻る
${fitGateUrl}

このメールに返信いただいても構いません。今の状況で何から整理すべきか、簡単なコメントをお返しします。

---
Exit Readiness OS
https://exit-readiness.manus.space
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>こんにちは。Exit Readiness OS の適合チェックを受けていただいてから、30日が経ちました。</p>
  
  <p>当時は「まだ少し早い（not yet）」という判定でしたが、この1か月の間に、年収・貯蓄・仕事・住まい・将来のイメージなどに変化はありましたか？</p>
  
  <p>もし変化があれば、一度「適合チェック」を取り直してみてください。<br>
  数字と前提をアップデートすることで、「いまは Prep Mode か」「そろそろ 1on1 に進んでもよいか」の見直しができます。</p>
  
  <p style="text-align: center; margin: 30px 0;">
    <a href="${fitGateUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">適合チェックに戻る</a>
  </p>
  
  <p style="font-size: 14px; color: #666;">このメールに返信いただいても構いません。今の状況で何から整理すべきか、簡単なコメントをお返しします。</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #999;">
    Exit Readiness OS<br>
    <a href="https://exit-readiness.manus.space" style="color: #999;">https://exit-readiness.manus.space</a>
  </p>
</body>
</html>
`;

  return sendMail({
    to,
    subject,
    text,
    html,
    category: "notyet_followup_30d",
    idempotencyKey: `notyet-${to}-30d-${Date.now()}`,
  });
}
