/**
 * NotYet followup email template (30-day reminder for re-diagnosis)
 */

export function getNotyetFollowupEmailSubject(): string {
  return "【Exit OS】そろそろもう一度、世界線を見直してみませんか?";
}

export function getNotyetFollowupEmailBody(fitGateUrl: string): string {
  return `
こんにちは。Exit Readiness OS の適合チェックを受けていただいてから、30日が経ちました。

当時は「まだ少し早い（not yet）」という判定でしたが、この1か月の間に、年収・貯蓄・仕事・住まい・将来のイメージなどに変化はありましたか?

もし変化があれば、一度「適合チェック」を取り直してみてください。
数字と前提をアップデートすることで、「いまは Prep Mode か」「そろそろ 1on1 に進んでもよいか」の見直しができます。

▼ 適合チェックに戻る
${fitGateUrl}

このメールに返信いただいても構いません。今の状況で何から整理すべきか、簡単なコメントをお返しします。

---
Exit Readiness OS
高収入DINKs向け Exit OS β版
`.trim();
}

export function getNotyetFollowupEmailHtml(fitGateUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>【Exit OS】そろそろもう一度、世界線を見直してみませんか?</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px;">
    <h2 style="color: #1f2937; margin-top: 0;">そろそろもう一度、世界線を見直してみませんか?</h2>
    
    <p>こんにちは。Exit Readiness OS の適合チェックを受けていただいてから、30日が経ちました。</p>
    
    <p>当時は「まだ少し早い（not yet）」という判定でしたが、この1か月の間に、年収・貯蓄・仕事・住まい・将来のイメージなどに変化はありましたか?</p>
    
    <p>もし変化があれば、一度「適合チェック」を取り直してみてください。<br>
    数字と前提をアップデートすることで、「いまは Prep Mode か」「そろそろ 1on1 に進んでもよいか」の見直しができます。</p>
    
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
}
