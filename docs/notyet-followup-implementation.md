# NotYet Followup Email Implementation

**京都モデル v0.3.1 - タスクC: 30日後再診断メール（NotYet向け）の実装**

**実装日時**: 2025-12-18

---

## 概要

Fit Gateで`prep_bucket=notyet`（時期尚早）と判定されたユーザーに対して、30日後に再診断を促すメールを自動送信する機能を実装しました。これにより、「放置される leads」を減らし、将来の売上の種を育成します。

---

## 実装内容

### 1. データベーススキーマ

**テーブル名**: `notyetFollowup`

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | INT AUTO_INCREMENT PRIMARY KEY | 主キー |
| email | VARCHAR(320) NOT NULL | 送信先メールアドレス |
| fitGateResponseId | INT NOT NULL | 対応するFit Gate回答ID |
| sentAt | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | 送信日時 |

**作成方法**: 手動SQL実行（`webdev_execute_sql`）

```sql
CREATE TABLE IF NOT EXISTS notyetFollowup (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  fitGateResponseId INT NOT NULL,
  sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

### 2. データベース関数

**ファイル**: `server/db.ts`

#### 追加した関数

1. **insertNotyetFollowup(entry: InsertNotyetFollowup)**
   - NotYet followupメール送信記録を挿入

2. **getNotyetFollowupByFitGateResponseId(fitGateResponseId: number)**
   - 特定のFit Gate回答IDに対するfollowupメール送信履歴を取得

3. **getNotyetResponsesNeedingFollowup()**
   - 30日前に`prep_bucket=notyet`と判定され、まだfollowupメールを送信していないユーザーを取得

---

### 3. メールテンプレート

**ファイル**: `server/email-templates/notyet-followup.ts`

#### 提供する関数

1. **getNotyetFollowupEmailSubject()**
   - 件名: `【Exit OS】そろそろもう一度、世界線を見直してみませんか?`

2. **getNotyetFollowupEmailBody(fitGateUrl: string)**
   - プレーンテキスト本文

3. **getNotyetFollowupEmailHtml(fitGateUrl: string)**
   - HTML本文（レスポンシブデザイン）

#### メール本文の内容

- 30日前に「not yet」判定を受けたことを伝える
- この1か月の変化（年収・貯蓄・仕事・住まい・将来のイメージ）を確認
- 再診断を促すCTA（適合チェックに戻るリンク）
- メール返信での相談も受け付ける旨を記載

---

### 4. スケジューラー

**ファイル**: `server/schedulers/notyet-followup-scheduler.ts`

#### 提供する関数

1. **sendNotyetFollowupEmails()**
   - 30日前に`notyet`判定を受けたユーザーにfollowupメールを送信
   - 送信後、`notyetFollowup`テーブルに記録
   - 送信成功/失敗の件数を返す

2. **initNotyetFollowupScheduler()**
   - スケジューラーを初期化
   - cron式: `0 1 * * *`（毎日01:00 AM UTC = 10:00 AM JST）

#### 実装状況

- ✅ スケジューラーのロジックは実装済み
- ⚠️ **実際のメール送信サービスとの統合は未実装**（TODO）
- ⚠️ **実際のcronスケジューラーとの統合は未実装**（TODO）

---

## 未実装部分（TODO）

### 1. 実際のメール送信サービスとの統合

現在は`console.log`でメール内容をログ出力しているだけです。以下のいずれかのサービスと統合する必要があります：

- **SendGrid**: `@sendgrid/mail`を使用
- **AWS SES**: `aws-sdk`を使用
- **Manus側メール**: Manus提供のメール送信APIを使用

**統合例（SendGrid）**:

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: response.email,
  from: "noreply@exit-readiness-os.manus.space",
  subject,
  text: body,
  html,
});
```

### 2. 実際のcronスケジューラーとの統合

現在は`initNotyetFollowupScheduler()`を呼び出してもログ出力されるだけです。以下のいずれかの方法で統合する必要があります：

- **node-cron**: `node-cron`パッケージを使用
- **Manus scheduler**: Manus提供のスケジューラーAPIを使用

**統合例（node-cron）**:

```typescript
import cron from "node-cron";

export function initNotyetFollowupScheduler() {
  cron.schedule("0 1 * * *", async () => {
    await sendNotyetFollowupEmails();
  });
}
```

---

## テスト方法

### 1. 手動テスト（開発環境）

1. `fitGateResponses`テーブルに30日前の`notyet`レコードを挿入

```sql
INSERT INTO fitGateResponses (
  sessionId, email, q1DecisionDeadline, q2HousingStatus, q3PriceRange,
  q4IncomeRange, q5AssetRange, q6NumberInputTolerance, q7CareerChange,
  q8LifeEvent, q9CurrentQuestion, q10PreferredApproach, q11PrivacyConsent,
  q12BudgetSense, judgmentResult, prepBucket, createdAt
) VALUES (
  'test-session-123', 'test@example.com', '未定', '賃貸', '3000-5000万',
  '1000-1500万', '1000万未満', '入力したくない', 'なし', 'なし',
  'テスト質問', 'メールレター', TRUE, '3-5万', 'prep', 'notyet',
  DATE_SUB(NOW(), INTERVAL 30 DAY)
);
```

2. スケジューラーを手動実行

```typescript
import { sendNotyetFollowupEmails } from "./server/schedulers/notyet-followup-scheduler";

await sendNotyetFollowupEmails();
```

3. `notyetFollowup`テーブルに送信記録が追加されていることを確認

```sql
SELECT * FROM notyetFollowup WHERE email = 'test@example.com';
```

### 2. 本番環境テスト

1. メール送信サービスとcronスケジューラーを統合
2. テストユーザーで30日前の`notyet`レコードを作成
3. 翌日10:00 AM JSTにメールが送信されることを確認
4. メール内容、リンク、返信先が正しいことを確認

---

## Acceptance Criteria

- ✅ **notyetFollowupテーブルが作成されている**
- ✅ **server/db.tsにnotyetFollowup関連の関数が追加されている**
- ✅ **メールテンプレートが作成されている**（件名、本文、HTML）
- ✅ **30日後バッチ処理のスケジューラーが実装されている**
- ✅ **送信ログがnotyetFollowupテーブルに記録される**
- ⚠️ **実際のメール送信サービスとの統合**（未実装）
- ⚠️ **実際のcronスケジューラーとの統合**（未実装）

---

## 次のステップ

1. **メール送信サービスとの統合**: SendGrid / SES / Manus側メールのいずれかを選択し、実際のメール送信機能を実装
2. **cronスケジューラーとの統合**: node-cron / Manus schedulerのいずれかを選択し、毎日10:00 AM JSTに自動実行
3. **本番環境でのテスト**: 実際のユーザーデータでテストし、メール送信が正常に動作することを確認
4. **メール開封率・クリック率の計測**: Umamiまたは別の分析ツールでメールの効果を計測

---

## 結論

30日後再診断メール（NotYet向け）の基本実装が完了しました。メール送信サービスとcronスケジューラーとの統合が完了すれば、Acceptance Criteria 11/11項目が完全PASSとなります。
