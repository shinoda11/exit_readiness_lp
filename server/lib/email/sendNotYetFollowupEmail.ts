/**
 * SendGrid email service for NotYet followup emails
 */

import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('[SendGrid] SENDGRID_API_KEY not found in environment variables. Email sending will fail.');
}

export type NotYetFollowupPayload = {
  email: string;
  firstName?: string | null;
  fitGateCreatedAt: Date;
  fitGateResultId: string;
};

/**
 * Send NotYet followup email via SendGrid
 */
export async function sendNotYetFollowupEmail(
  payload: NotYetFollowupPayload,
): Promise<void> {
  const { email, firstName, fitGateCreatedAt } = payload;

  // Get the fit gate URL from environment variable or use default
  const fitGateUrl = `${process.env.VITE_APP_URL || 'https://exit-readiness-os.manus.space'}/fit-gate`;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'no-reply@exit-readiness-os.manus.space';

  const subject = '【Exit Readiness OS】そろそろもう一度、世界線を見直してみませんか?';

  const text = `
${firstName ?? ''} 様

先日は Exit Readiness OS の適合チェックを受けていただきありがとうございました。
あれから約30日が経ちましたが、年収・貯蓄・お仕事・住まい・将来のイメージなどに変化はありましたか?

もし変化があれば、一度「適合チェック」を取り直してみてください。
数字と前提をアップデートすることで、「今は Prep Mode か」「そろそろ 1on1 に進んでもよいか」を見直すことができます。

▼ 適合チェックに戻る
${fitGateUrl}

このメールに返信いただいても構いません。今の状況で何から整理すべきか、簡単なコメントをお返しします。

Exit Readiness OS
高収入DINKs向け Exit OS β版
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px;">
    <h2 style="color: #1f2937; margin-top: 0;">そろそろもう一度、世界線を見直してみませんか?</h2>
    
    <p>${firstName ?? ''} 様</p>
    
    <p>先日は Exit Readiness OS の適合チェックを受けていただきありがとうございました。<br>
    あれから約30日が経ちましたが、年収・貯蓄・お仕事・住まい・将来のイメージなどに変化はありましたか?</p>
    
    <p>もし変化があれば、一度「適合チェック」を取り直してみてください。<br>
    数字と前提をアップデートすることで、「今は Prep Mode か」「そろそろ 1on1 に進んでもよいか」を見直すことができます。</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${fitGateUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">適合チェックに戻る</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">このメールに返信いただいても構いません。今の状況で何から整理すべきか、簡単なコメントをお返しします。</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      Exit Readiness OS<br>
      高収入DINKs向け Exit OS β版
    </p>
  </div>
</body>
</html>
`.trim();

  try {
    await sgMail.send({
      to: email,
      from: fromEmail,
      subject,
      text,
      html,
    });

    console.log(`[SendGrid] NotYet followup email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[SendGrid] Failed to send NotYet followup email to ${email}:`, error);
    throw error;
  }
}
