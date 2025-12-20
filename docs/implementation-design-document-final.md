# Exit Readiness OS LP 実装設計書 v0.4.0

**作成日**: 2024年12月19日  
**バージョン**: 0.4.0  
**ステータス**: RC完了（公開ワンパス提供中）  
**友人紹介LP**: 実装一部あり、ただし未提供（Parked - Appendix参照）

---

## 1. プロジェクト概要

Exit Readiness OSは、高収入DINK/プレDINK層（世帯年収1,000〜2,000万円クラス）を対象とした住宅購入意思決定支援サービスです。本プロジェクトは、公開ランディングページ（LP）、適合チェック（Fit Gate）、Pass購入フロー、30日後再診断メールなど、複数のモジュールから構成されています。

### プロダクトの核心

世界線比較による意思決定支援を提供します。FPツールや住宅サイトのように売りたい商品が決まっているわけではなく、フラットなOSとして、家・仕事・暮らす場所・イベントを横断して「どの世界線を選んでもよい状態」を作ることが目的です。

### ターゲット

都内6,000万〜8,000万円クラスのマンション検討中で、世帯年収1,000〜2,000万円のDINK/プレDINK層を対象としています。計算しても変数が多すぎて決めきれない状態にある方々に、意思決定の枠組みを提供します。

### 提供中のプロダクト構成（公開ワンパス）

公開ワンパス（公開LP→Fit Gate→Ready→Pass→Onboarding→App）の一本線を安定させることを最優先しています。

1. **公開LP**: 世界線比較の概念を伝え、適合チェックへ誘導
2. **Fit Gate（12問）**: 準備状態を判定し、Ready/Prep Near/Prep NotYetに分類
3. **Pass（29,800円/90日）**: Vercel版アプリでシナリオ比較・意思決定メモ生成
4. **Session（50,000円/1回）**: 1on1 Decision Session（Upgrade申請経由のみ、招待トークン有効時のみunlocked）

Sessionは「推奨」ではなく、招待トークン有効時のみunlockedされる特別な選択肢です。それ以外の場合は、Fit Gate判定結果としてReadyを返します。

### 方針：やることを増やさない

計測の純度と運用品質を守るため、友人紹介LP導線は当面ローンチしません。公開ワンパスが「勝手に回っている」状態を数値で確認してから、友人導線を別ファネルとしてローンチします。京都モデルの勝ち筋は、ここで"やることを増やさない"ことです。

---

## 2. アーキテクチャ概要

### 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | React 19, TypeScript, Vite, TailwindCSS 4, Wouter, react-helmet-async |
| バックエンド | Node.js, Express 4, tRPC 11, Drizzle ORM |
| データベース | MySQL (TiDB) |
| 決済 | Stripe Checkout, Webhook |
| メール | Manus mail（推奨）/ SendGrid（代替） |
| 分析 | Umami Analytics |
| デプロイ | Vercel（サーバレス） |

### 環境変数

| 変数名 | 用途 | 設定例 |
|-------|------|--------|
| `DATABASE_URL` | MySQL接続文字列 | システム自動設定 |
| `JWT_SECRET` | セッションCookie署名 | システム自動設定 |
| `STRIPE_SECRET_KEY` | Stripe決済（サーバー側） | システム自動設定 |
| `STRIPE_WEBHOOK_SECRET` | Webhook検証 | システム自動設定 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe決済（クライアント側） | システム自動設定 |
| `MAIL_PROVIDER` | メール送信プロバイダ（manus/sendgrid） | `manus` |
| `MAIL_DRY_RUN` | DRY_RUNモード（true/false） | `false` |
| `JOB_AUTH_TOKEN` | /api/jobs/notyet-followup認証用 | 任意の強力なトークン |
| `FRIEND_INVITE_ENABLED` | **友人紹介LP導線の有効化（本番では必ずfalse）** | `false` |
| `INVITE_TOKEN_BYPASS_VALIDATION` | レビュー用トークンバイパス（開発環境のみtrue） | `false` |

---

## 3. データベース設計

### 3.1 テーブル一覧

| テーブル名 | 用途 |
|-----------|------|
| `users` | Manus OAuth認証ユーザー |
| `testSessions` | 1on1テストセッション申込（旧仕様、現在は未使用） |
| `fitGateResponses` | Fit Gate 12問の回答と判定結果 |
| `prepModeSubscribers` | Prep Modeメール登録 |
| `invitationTokens` | Session招待トークン（旧仕様、現在は未使用） |
| `inviteTokens` | Pass友人紹介トークン（Parked、本番では無効化 - Appendix参照） |
| `passSubscriptions` | Pass購入履歴とログイン情報 |
| `passOnboarding` | Pass Onboarding 3タスク進捗 |
| `upgradeRequests` | Pass→Session Upgrade申請 |
| `sessionCheckouts` | Session Private Checkout（48時間期限） |
| `notyetFollowup` | 30日後再診断メール送信履歴 |
| `unsubscribe` | メール配信停止（opt_out） |
| `jobLocks` | バッチ処理の同時実行ロック |

### 3.2 主要テーブル詳細

#### fitGateResponses

Fit Gate 12問の回答と判定結果を記録します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | INT AUTO_INCREMENT | 主キー |
| `sessionId` | VARCHAR(64) | セッションID（fg_{timestamp}_{random}） |
| `email` | VARCHAR(320) | メールアドレス（必須） |
| `q1DecisionDeadline` | VARCHAR(64) | Q1: 意思決定期限 |
| `q2HousingStatus` | VARCHAR(64) | Q2: 現在の住居形態 |
| `q3PriceRange` | VARCHAR(64) | Q3: 検討中の価格帯 |
| `q4IncomeRange` | VARCHAR(64) | Q4: 世帯年収レンジ |
| `q5AssetRange` | VARCHAR(64) | Q5: 金融資産レンジ |
| `q6NumberInputTolerance` | VARCHAR(128) | Q6: 数字入力の許容度 |
| `q7CareerChange` | VARCHAR(128) | Q7: キャリアチェンジ可能性 |
| `q8LifeEvent` | VARCHAR(128) | Q8: ライフイベント |
| `q9CurrentQuestion` | VARCHAR(255) | Q9: 現在の疑問 |
| `q10PreferredApproach` | VARCHAR(128) | Q10: 好みのアプローチ |
| `q11PrivacyConsent` | BOOLEAN | Q11: プライバシー同意（必須） |
| `q12BudgetSense` | VARCHAR(64) | Q12: 予算感 |
| `invitationToken` | VARCHAR(64) | 招待トークン（Parked、本番では無視 - Appendix参照） |
| `judgmentResult` | ENUM('prep', 'ready', 'session') | 判定結果 |
| `prepBucket` | ENUM('near', 'notyet') | Prep分類（near/notyet） |
| `sessionDone` | BOOLEAN | 1on1セッション完了フラグ |
| `createdAt` | TIMESTAMP | 作成日時 |

**判定ロジック**:
- `ready`: 6項目すべてが「準備できている」→ Pass購入可能
- `prep_near`: 4〜5項目が「準備できている」→ Prep Mode（近い）
- `prep_notyet`: 3項目以下が「準備できている」→ Prep Mode（まだ早い）
- `session`: 招待トークン有効時のみunlocked（それ以外はreadyを返す）

#### passSubscriptions

Pass購入履歴とVercel版アプリのログイン情報を記録します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | INT AUTO_INCREMENT | 主キー |
| `userId` | INT | ユーザーID（Manus OAuth） |
| `email` | VARCHAR(320) | 購入者メールアドレス |
| `stripeCustomerId` | VARCHAR(255) | Stripe顧客ID |
| `stripePaymentIntentId` | VARCHAR(255) | Stripe PaymentIntent ID |
| `stripeSessionId` | VARCHAR(255) UNIQUE | Stripe Session ID（冪等性キー） |
| `loginId` | VARCHAR(320) | Vercel版アプリログインID（メールアドレス形式） |
| `loginPassword` | VARCHAR(64) | Vercel版アプリログインパスワード（16桁ランダム） |
| `purchaseDate` | TIMESTAMP | 購入日時 |
| `expiryDate` | TIMESTAMP | 有効期限（購入日+90日） |
| `price` | INT | 価格（29,800円） |
| `status` | ENUM('active', 'expired', 'cancelled') | ステータス |
| `createdAt` | TIMESTAMP | 作成日時 |

**冪等性保証**: `stripeSessionId`にUNIQUE制約を設定し、Webhook二重送信時に二重発行を防止します。

#### passOnboarding

Pass購入後のOnboarding 3タスク進捗を記録します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | INT AUTO_INCREMENT | 主キー |
| `userId` | INT | ユーザーID |
| `email` | VARCHAR(320) UNIQUE | メールアドレス |
| `task1AppOpened` | BOOLEAN | タスク1: アプリを開いた |
| `task2CompareViewed` | BOOLEAN | タスク2: シナリオ比較を1回見た |
| `task3MemoGenerated` | BOOLEAN | タスク3: 意思決定メモを1回生成した |
| `completedAt` | TIMESTAMP | 3タスク完了日時 |
| `createdAt` | TIMESTAMP | 作成日時 |

**Upgrade封印**: 3タスクすべて完了するまで、Upgrade申請ボタンを非表示にし、サーバー側でもブロックします。

#### notyetFollowup

30日後再診断メール送信履歴を記録します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | INT AUTO_INCREMENT | 主キー |
| `email` | VARCHAR(320) | 送信先メールアドレス |
| `fitGateResponseId` | INT | Fit Gate回答ID |
| `followupType` | VARCHAR(32) | フォローアップタイプ（"30d"） |
| `status` | ENUM('pending', 'sending', 'sent', 'failed') | 送信ステータス |
| `sentAt` | TIMESTAMP | 送信日時 |
| `lastError` | TEXT | エラーメッセージ |
| `providerMessageId` | VARCHAR(255) | プロバイダメッセージID |
| `createdAt` | TIMESTAMP | 作成日時 |

**ユニーク制約**: `fitGateResponseId + followupType`でユニーク制約を設定し、同一ユーザーに対して同じフォローアップメールを二重送信しないようにします。

#### unsubscribe

メール配信停止（opt_out）を記録します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | INT AUTO_INCREMENT | 主キー |
| `email` | VARCHAR(320) UNIQUE | メールアドレス |
| `optOut` | BOOLEAN | 配信停止フラグ |
| `unsubscribedAt` | TIMESTAMP | 配信停止日時 |

**配信停止処理**: `unsubscribe`テーブルに登録されたメールアドレスは、30日後再診断メールの送信対象から除外されます。

---

## 4. ページ構成とルーティング

### 4.1 公開ページ（提供中）

| パス | コンポーネント | 用途 |
|-----|--------------|------|
| `/` | `Home.tsx` | 公開LP（世界線比較の概念を伝える） |
| `/fit-gate` | `FitGate.tsx` | Fit Gate 12問適合チェック |
| `/fit-result` | `FitResult.tsx` | Fit Gate判定結果（Ready/Prep Near/Prep NotYet） |
| `/prep-mode` | `PrepMode.tsx` | Prep Modeメール登録 |

### 4.2 Pass購入後ページ（提供中）

| パス | コンポーネント | 用途 |
|-----|--------------|------|
| `/pass/onboarding` | `PassOnboarding.tsx` | Pass Onboarding 3タスク |
| `/pass/resend-login` | `PassResendLogin.tsx` | ログイン情報再送 |
| `/pass/upgrade` | `PassUpgrade.tsx` | Upgrade申請（Pass→Session） |

### 4.3 その他

| パス | コンポーネント | 用途 |
|-----|--------------|------|
| `/404` | `NotFound.tsx` | 404エラーページ |
| `/showcase` | `ComponentShowcase.tsx` | コンポーネントショーケース（開発用） |

---

## 5. 主要フロー

### 5.1 公開LP → Pass購入フロー（提供中）

公開ワンパスの一本線です。この流れが「勝手に回っている」状態を数値で確認することが最優先です。

```
1. 公開LP（/）
   ↓ 「適合チェックに進む」ボタンクリック
2. Fit Gate 12問（/fit-gate）
   ↓ 回答送信
3. Fit Gate判定結果（/fit-result）
   ├─ Ready判定 → Pass購入ボタン表示
   ├─ Prep Near判定 → Prep Modeメール登録 + 再診断リンク
   └─ Prep NotYet判定 → Prep Modeメール登録 + 30日後再診断メール
4. Stripe Checkout
   ↓ 決済完了
5. Webhook処理（loginId/loginPassword生成）
   ↓
6. Pass Onboarding（/pass/onboarding）
   ├─ ログインID/パスワード表示
   ├─ Vercel版アプリへのリンク
   └─ 3タスク完了までUpgrade申請ボタン非表示
```

### 5.2 Pass → Session Upgradeフロー（提供中）

Pass購入後、Onboarding 3タスクを完了したユーザーのみがUpgrade申請できます。

```
1. Pass Onboarding 3タスク完了
   ↓
2. Upgrade申請ボタン表示（/pass/upgrade）
   ↓ Upgrade申請送信
3. 運営側で承認処理（手動）
   ↓ Private Checkout URL発行（48時間期限）
4. メールでPrivate Checkout URL送信
   ↓
5. Stripe Checkout（Session: 50,000円）
   ↓ 決済完了
6. 1on1 Decision Session実施
```

### 5.3 30日後再診断メールフロー（提供中）

Prep NotYet判定されたユーザーに対して、30日後に再診断を促すメールを送信します。

```
1. Fit Gate判定結果がPrep NotYet
   ↓
2. notyetFollowupテーブルにレコード挿入（status: pending）
   ↓
3. 30日後、Manus schedulerが/api/jobs/notyet-followupを実行
   ↓
4. dueなfollowupをバッチ取得（pending、opt_outではない）
   ↓
5. status: sending → メール送信 → status: sent
   ↓
6. 再診断リンク（/fit-gate）をクリック
   ↓
7. Fit Gate 12問再実施
```

---

## 6. API設計

### 6.1 tRPCルーター構成

| ルーター | 用途 |
|---------|------|
| `fitGate` | Fit Gate 12問の送信と判定 |
| `prepMode` | Prep Modeメール登録 |
| `pass` | Pass購入、Onboarding進捗、ログイン情報再送 |
| `upgrade` | Upgrade申請、Private Checkout URL発行 |
| `system` | システム通知、Owner通知 |

### 6.2 主要エンドポイント

#### fitGate.submit

Fit Gate 12問の回答を送信し、判定結果を返します。

**入力**:
```typescript
{
  email: string;
  q1DecisionDeadline: string;
  q2HousingStatus: string;
  q3PriceRange: string;
  q4IncomeRange: string;
  q5AssetRange: string;
  q6NumberInputTolerance: string;
  q7CareerChange: string;
  q8LifeEvent: string;
  q9CurrentQuestion: string;
  q10PreferredApproach: string;
  q11PrivacyConsent: boolean;
  q12BudgetSense: string;
  invitationToken?: string; // Parked、本番では無視 - Appendix参照
}
```

**出力**:
```typescript
{
  result: 'prep' | 'ready' | 'session';
  prepBucket?: 'near' | 'notyet';
  sessionId: string;
}
```

**注意**: `session`は招待トークン有効時のみunlockedされます。それ以外の場合は`ready`を返します。

#### pass.createCheckoutSession

Pass購入用のStripe Checkout Sessionを作成します。

**入力**:
```typescript
{
  email: string;
}
```

**出力**:
```typescript
{
  sessionId: string;
  url: string;
}
```

#### pass.getOnboarding

Pass Onboarding 3タスクの進捗を取得します。

**入力**:
```typescript
{
  email: string;
}
```

**出力**:
```typescript
{
  task1AppOpened: boolean;
  task2CompareViewed: boolean;
  task3MemoGenerated: boolean;
  completedAt: Date | null;
}
```

#### pass.updateOnboarding

Pass Onboarding 3タスクの進捗を更新します。

**入力**:
```typescript
{
  email: string;
  task1AppOpened?: boolean;
  task2CompareViewed?: boolean;
  task3MemoGenerated?: boolean;
}
```

**出力**:
```typescript
{
  success: boolean;
}
```

#### pass.resendLoginInfo

ログイン情報を再送します。

**入力**:
```typescript
{
  email: string;
}
```

**出力**:
```typescript
{
  loginId: string;
  loginPassword: string;
  expiryDate: Date;
}
```

#### upgrade.requestUpgrade

Pass→Session Upgrade申請を送信します。

**入力**:
```typescript
{
  email: string;
  notes?: string;
}
```

**出力**:
```typescript
{
  success: boolean;
  requestId: number;
}
```

### 6.3 Webhook

#### POST /api/stripe/webhook

Stripe Webhookを受信し、Pass購入完了時にログインID/パスワードを生成します。

**イベント**:
- `checkout.session.completed`: Pass購入完了
- `charge.refunded`: 返金時にPass無効化
- `charge.dispute.created`: チャージバック時にPass無効化

**冪等性**: `stripeSessionId`にUNIQUE制約を設定し、二重送信時に二重発行を防止します。

### 6.4 バッチ処理

#### POST /api/jobs/notyet-followup

30日後再診断メールを送信します（Manus scheduler経由）。

**認証**: `Authorization: Bearer <JOB_AUTH_TOKEN>`必須

**処理フロー**:
1. `jobLocks`テーブルで同時実行ロックを取得
2. dueなfollowupをバッチ取得（pending、opt_outではない）
3. status: sending → メール送信 → status: sent
4. 送信失敗時はstatus: failed、last_errorに記録
5. ロックを解放

**DRY_RUNモード**: 環境変数`MAIL_DRY_RUN=true`の場合、メール送信をスキップし、ログだけ出力します。

---

## 7. メール送信設計

### 7.1 mailer adapter

`server/lib/mailer/index.ts`で、Manus mailとSendGridの分岐を実装しています。

**環境変数**:
- `MAIL_PROVIDER`: `manus`（推奨）または`sendgrid`
- `MAIL_DRY_RUN`: `true`（DRY_RUNモード）または`false`（実送信）

**DRY_RUNモード**: `MAIL_DRY_RUN=true`の場合、プロバイダへの送信を行わず、成功相当の戻り値を返します。

### 7.2 メールテンプレート

#### 30日後再診断メール

**件名**: 「【Exit OS】そろそろもう一度、世界線を見直してみませんか?」

**本文**:
```
こんにちは。

30日前に Exit Readiness OS の適合チェックを受けていただきました。
あのときは「まだ少し早い」という判定でしたが、そろそろ状況が変わっているかもしれません。

もし以下のような変化があれば、もう一度適合チェックを受けてみてください：
- 物件の価格帯や意思決定期限が具体化してきた
- 世帯年収や金融資産の状況が変わった
- キャリアチェンジやライフイベントの見通しが立った

再診断はこちらから：
https://exit-readiness-os.manus.space/fit-gate

もし「まだもう少し先」という場合は、このメールは無視していただいて構いません。
また30日後にお声がけします。

何かご質問があれば、このメールに返信してください。

---
Exit Readiness OS チーム

配信停止はこちら：
https://exit-readiness-os.manus.space/unsubscribe?email={email}
```

---

## 8. 分析イベント設計

### 8.1 Umamiイベント一覧（提供中）

公開ワンパスの2枚のダッシュボードで使用するイベントのみを定義しています。

| イベント名 | 発火タイミング | 用途 |
|-----------|--------------|------|
| `lp_hero_cta_clicked` | Hero「適合チェックに進む」ボタンクリック | Acquisition Funnel |
| `fitgate_started` | Fit Gateページ表示 | Acquisition Funnel |
| `fitgate_submitted` | Fit Gate回答送信 | Acquisition Funnel |
| `fitgate_result_ready` | Ready判定結果表示 | Revenue and Activation Funnel |
| `pass_checkout_opened` | Pass購入ボタンクリック | Revenue and Activation Funnel |
| `pass_payment_success` | Pass決済完了 | Revenue and Activation Funnel |
| `onboarding_completed` | Pass Onboarding 3タスク完了 | Revenue and Activation Funnel |

### 8.2 Umamiダッシュボード構成（2枚固定）

ダッシュボードは2枚だけです。これが無い状態で改善を始めると、全員の脳内でストーリーが増殖して終わります。

#### Dashboard A: Acquisition Funnel

**目的**: 公開LPからFit Gate完了までのファネルを可視化

**ウィジェット**:
1. LPユニークビジター数（Unique Visitors）
2. Hero CTAクリック率（lp_hero_cta_clicked / Unique Visitors）
3. Fit Gate開始率（fitgate_started / lp_hero_cta_clicked）
4. Fit Gate完了率（fitgate_submitted / fitgate_started）

#### Dashboard B: Revenue and Activation Funnel

**目的**: Fit Gate判定結果からPass購入、Onboarding完了までのファネルを可視化

**ウィジェット**:
1. Ready判定数（fitgate_result_ready）
2. Pass購入ボタンクリック率（pass_checkout_opened / fitgate_result_ready）
3. Pass決済完了率（pass_payment_success / pass_checkout_opened）
4. Onboarding完了率（onboarding_completed / pass_payment_success）

**運用ルール**:
- 友人導線イベントは作らない、置かない、見ない（Parkedなら存在しないのと同義）
- 2枚が毎日更新される状態を作る。見ないダッシュボードは存在しないのと同じ

---

## 9. 実装完了状況

### 9.1 P0修正（優先度最高）

| タスク | ステータス |
|-------|----------|
| P0-1: Onboarding 3タスク必須化とUpgrade封印 | ✅ 完了 |
| P0-2: Evidence Packをヒーロー直下へ移動しFAQ 5問と比較ビジュアルを追加 | ✅ 完了 |
| P0-3: Fit Gateメール実質必須化 | ✅ 完了 |

### 9.2 P1修正（次の優先度）

| タスク | ステータス |
|-------|----------|
| P1-1: Webhook冪等性とログイン情報再送 | ✅ 完了 |
| P1-1: prep_bucket分類（near/notyet） | ✅ 完了 |
| P1-1: 30日後再診断メール（データ設計、mailer adapter、エンドポイント） | ✅ 完了 |

### 9.3 友人導線の無効化（Parked）

| タスク | ステータス |
|-------|----------|
| Feature Flag導入（FRIEND_INVITE_ENABLED=false） | ✅ 完了 |
| /invite/pass/:tokenルーティング制御（本番で/へリダイレクト） | ✅ 完了 |
| INVITE_TOKEN_BYPASS_VALIDATIONを本番でfalse固定 | ✅ 完了 |
| Umamiダッシュボードを2枚だけ固定 | ✅ 完了 |

### 9.4 運用固定フェーズ

| タスク | ステータス |
|-------|----------|
| 本番設定の最終確認チェックリスト作成 | ✅ 完了 |
| Umamiダッシュボード運用開始ガイド作成 | ✅ 完了 |

### 9.5 未実装機能

| タスク | 理由 |
|-------|------|
| unsubscribe API + 配信停止ページ実装 | データ設計完了、実装は後回し |
| 二重送信テスト3ケース実施 | テスト設計完了、実施は後回し |
| Manus scheduler設定 | ユーザーが実施 |
| Umamiダッシュボード作成 | ユーザーが実施 |

---

## 10. Acceptance Criteria（12/12項目達成）

| 項目 | ステータス |
|-----|----------|
| 1. Public LPにSession申込フォームが存在しない | ✅ PASS |
| 2. Public LPに決済リンクが存在しない | ✅ PASS |
| 3. Fit GateでEmailが必須 | ✅ PASS |
| 4. Ready結果ページでSessionが表示されない | ✅ PASS |
| 5. Sessionは招待トークン有効時のみ購入導線が出る | ✅ PASS |
| 6. Pass購入後にOnboarding 3タスクが必須で、完了までUpgrade申請が封印される | ✅ PASS |
| 7. Evidence PackがLP上部にあり、比較ビジュアルとFAQが存在する | ✅ PASS |
| 8. Stripe決済からログイン発行までのE2Eが正常 | ✅ PASS |
| 9. Webhook冪等性とログイン情報再送が実装されている | ✅ PASS |
| 10. Prep Mode分類（near/notyet）が実装されている | ✅ PASS |
| 11. 30日後再診断メール（NotYet向け）が実装されている | ✅ PASS |
| 12. 友人導線が本番で無効化されている（/inviteが到達不可） | ✅ PASS |

---

## 11. 次のステップ

### 11.1 本番設定の最終確認

運用で壊れない状態を証明し、設定漏れで崩れないようにします。

1. **環境変数チェック**（`docs/production-settings-checklist.md`参照）
   - `FRIEND_INVITE_ENABLED=false`（本番・Preview）
   - `INVITE_TOKEN_BYPASS_VALIDATION=false`（本番・Preview）
   - `MAIL_DRY_RUN=false`（本番）
   - `MAIL_PROVIDER=manus`（本番）
   - `JOB_AUTH_TOKEN`がセット済み（本番）

2. **Acceptance確認**（`docs/production-settings-checklist.md`参照）
   - 本番で`/invite/pass/:token`にアクセスしても`/`に戻る
   - 本番で`inviteToken`や`src=friend_invite`を付けても挙動が変わらない
   - bypassが`false`の状態で、どんなtokenでもinvite経由の閲覧が成立しない

### 11.2 Umamiダッシュボード運用開始

「イベント追加済み」ではなく、ダッシュボード2枚が固定されて初めて意思決定できる状態を作ります。

1. **Dashboard AとDashboard Bを作成**（`docs/umami-dashboard-operations-guide.md`参照）
   - Dashboard A: Acquisition Funnel
   - Dashboard B: Revenue and Activation Funnel

2. **毎日数字を確認**
   - 今日の数字が2枚に出る
   - 7日分の推移が見える（週次で判断できる）

3. **週次レポートを開始**（毎週月曜日）
   - ボトルネック特定
   - 仮説立案
   - 施策実施

### 11.3 改善フェーズの開始条件と、改善の範囲固定

20〜30件のFit Gateログが溜まったタイミングで改善施策を検討します。

**最適化の目的（固定）**:
- Ready→Pass購入率を上げる
- Pass購入→Onboarding完了率を上げる
- Ready割合を上げるのは目的ではありません（Readyを増やして購入率が落ちたら、改善ではなく事故です）

**改善の対象範囲（最初の20〜30件はここだけ）**:
- やる: Ready結果ページの販売ブロック、Evidence Packの見せ方、Onboardingの摩擦、Fit Gateの質問文言の明確化
- やらない: 質問数の増加、新機能追加、価格変更、友人導線の再開

**理由**: 要因を1つに絞らないと、改善の効果が観測できなくなります。

---

## 12. 技術的な注意点

### 12.1 Webhook冪等性

`passSubscriptions`テーブルの`stripeSessionId`にUNIQUE制約を設定し、Webhook二重送信時に二重発行を防止します。

**実装**:
```typescript
// server/routes/stripe/webhook.ts
const existingSubscription = await getPassSubscriptionByStripeSessionId(session.id);
if (existingSubscription) {
  console.log(`[Webhook] Session ${session.id} already processed, skipping.`);
  return res.status(200).json({ received: true });
}
```

### 12.2 30日後再診断メールの同時実行ロック

`jobLocks`テーブルで同時実行ロックを実装し、並列実行されたら即returnします。

**実装**:
```typescript
// server/routes/jobs/notyet-followup.ts
const lock = await acquireJobLock('notyet-followup');
if (!lock) {
  console.log('[NotYet Followup] Job is already running, skipping.');
  return res.status(200).json({ message: 'Job is already running' });
}
```

### 12.3 友人導線の無効化

本番環境では`FRIEND_INVITE_ENABLED=false`に設定し、友人紹介LP導線を完全に無効化します。

**実装**:
```typescript
// shared/const.ts
export const FRIEND_INVITE_ENABLED = process.env.FRIEND_INVITE_ENABLED === 'true';

// client/src/App.tsx
<Route path={"/invite/pass/:token"}>
  {FRIEND_INVITE_ENABLED ? <InvitePass /> : <Redirect to="/" />}
</Route>

// server/db.ts
export async function isInviteTokenValid(token: string): Promise<boolean> {
  const friendInviteEnabled = process.env.FRIEND_INVITE_ENABLED === 'true';
  if (!friendInviteEnabled) {
    console.log('[InviteToken] Friend invite feature is disabled');
    return false;
  }
  // ...
}
```

### 12.4 node-cronは禁止

Vercelのサーバレス環境ではnode-cronの動作保証が弱いため、Manus schedulerを使用します。

### 12.5 AWS SESは現時点では過剰に重い

SPF/DKIM/DMARC整備が必要なため、Manus mail（推奨）またはSendGrid（代替）を使用します。

---

## 13. 参考ドキュメント

| ドキュメント名 | パス |
|--------------|------|
| 本番設定の最終確認チェックリスト | `docs/production-settings-checklist.md` |
| Umamiダッシュボード運用開始ガイド | `docs/umami-dashboard-operations-guide.md` |
| Acceptance Criteria Checklist | `docs/acceptance-criteria-checklist.md` |
| Alpha Launch Readiness Summary | `docs/alpha-launch-readiness-summary.md` |
| Analytics | `docs/analytics.md` |
| Evidence Pack Operation Rules | `docs/evidence-pack-operation-rules.md` |
| Fit Gate Log Design | `docs/fitgate-log-design.md` |
| Fit Gate Log Visualization Prep | `docs/fitgate-log-visualization-prep.md` |
| NotYet Followup Implementation | `docs/notyet-followup-implementation.md` |
| Pass Product Understanding | `docs/pass-product-understanding.md` |
| Session Confirmation Email Template | `docs/session-confirmation-email-template.md` |
| Session Execution Flow | `docs/session-execution-flow.md` |
| Session Worldline Memo Template | `docs/session-worldline-memo-template.md` |
| Webhook Idempotency Test Results | `docs/webhook-idempotency-test-results.md` |

---

## Appendix: 友人紹介LP導線（Parked）

**ステータス**: 実装一部あり、ただし未提供（本番では無効化）

**方針**: 計測の純度と運用品質を守るため、友人紹介LP導線は当面ローンチしません。公開LP→Fit Gate→Ready→Pass→Onboarding→Appの一本線を安定させることを最優先します。一本線が「勝手に回っている」状態を数値で確認してから、友人導線を別ファネルとしてローンチします。

### なぜ今は友人導線を出さないのか

**計測が壊れる**: 友人導線はコンバージョンが高く出やすい一方、母集団が別物です。公開導線の改善判断が歪みます。いま必要なのは「公開導線のボトルネック特定」で、友人導線の上振れはノイズです。

**例外運用が常態化する**: 友人は善意で拡散します。裏口が正面玄関になり、ゲート設計の意味が薄れます。京都モデルの設計思想と反します。

**誤購入が増える**: 友人は信用で買うので、適合していなくても買いがちです。買ってから詰まり、有人サポートが増える。無人化が遠のきます。

### 実装済みの内容（Parked）

#### inviteTokensテーブル

Pass友人紹介トークンを記録します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | INT AUTO_INCREMENT | 主キー |
| `token` | VARCHAR(64) UNIQUE | トークン文字列 |
| `type` | ENUM('PASS') | トークンタイプ（現在はPASSのみ） |
| `expiresAt` | TIMESTAMP | 有効期限（発行日+14日） |
| `isUsed` | BOOLEAN | 使用済みフラグ |
| `usedAt` | TIMESTAMP | 使用日時 |
| `revokedAt` | TIMESTAMP | 無効化日時 |
| `createdAt` | TIMESTAMP | 作成日時 |

#### /invite/pass/:tokenページ（Parked）

友人紹介LP（`InvitePass.tsx`）が実装されていますが、本番では`FRIEND_INVITE_ENABLED=false`により`/`へリダイレクトされます。

#### 友人導線イベント（Parked）

以下のイベントは実装されていますが、ダッシュボードには含めません：

- `fitgate_result_prep_near`: Prep Near判定結果表示
- `fitgate_result_prep_notyet`: Prep NotYet判定結果表示
- `prep_registered`: Prep Modeメール登録完了
- `invite_lp_view`: 友人紹介LPページ表示
- `invite_lp_cta_fitgate_clicked`: 友人紹介LP「適合チェックに進む」ボタンクリック

### 未実装の内容（Phase 3〜5）

1. **Fit Gateに友人経由パラメータを追加**
   - URLパラメータ`src=friend_invite`、`inviteToken`を取得
   - フォーム上部に「招待トークン適用中」を表示
   - submit時にsrcとinviteTokenをfitGateResponsesに保存

2. **FitResult.tsxにprep_near例外購入ボタンを追加**
   - Prep Near判定結果ページに「紹介経由でPassを購入する」ボタンを追加
   - 確認モーダルを実装（2つのチェックボックス必須）
   - prep_notyetでは例外ボタンを表示しない

3. **友人経由の計測イベントを追加**
   - `invite_lp_view`、`invite_lp_cta_fitgate_clicked`を追加
   - Fit Gate、FitResult、Pass決済成功時にsrc付きイベントを送信

### 再開の条件

公開ワンパスが安定し、以下の条件を満たしたタイミングで友人導線を再開します：

1. Acquisition FunnelとRevenue and Activation Funnelのボトルネックが特定されている
2. 公開導線の改善施策が実施され、効果が測定されている
3. 友人導線を別ファネルとして管理する体制が整っている

---

**作成者**: Manus AI  
**最終更新日**: 2024年12月19日
