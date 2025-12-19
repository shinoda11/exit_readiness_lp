# Exit Readiness OS LP - TODO

## 実装予定の機能

- [x] グローバルスタイルの設定（カラーパレット、フォント）
- [x] ヒーローセクション（ファーストビュー）の実装
- [x] 痛みの言語化セクションの実装
- [x] 解決の仕方セクションの実装
- [x] 主要機能セクションの実装
- [x] 信頼の担保セクションの実装
- [x] ウェイティングリストフォーム（中段）の実装
- [x] FAQセクションの実装
- [x] フッターの実装
- [x] ウェイティングリストフォーム機能（データベース保存）の実装
- [ ] サンクスメール送信機能の実装
- [x] GTMイベント計測の実装
- [x] レスポンシブデザインの調整
- [x] アニメーション効果の追加

## Pass購入後のVercel版アプリ連携（実装方針確定）

### 実装方針
- Pass購入後、Vercel版アプリ（https://exit-readiness-os.vercel.app/）のログインID/パスワードを発行
- PassOnboarding画面で、ログインID/パスワードを表示し、Vercel版アプリへのリンクを提供
- PassCockpit.tsx、PassDecisionMemo.tsxは不要（Vercel版アプリで完結）

### タスク
- [x] PassCockpit.tsxを削除
- [x] PassDecisionMemo.tsxを削除
- [x] App.tsxから不要なルーティングを削除
- [x] passSubscriptionsテーブルにloginId、loginPasswordフィールドを追加
- [x] Webhook処理修正（ログインID/パスワード生成）
- [x] PassOnboarding.tsx修正（Vercel版アプリへの導線）
- [x] Upgrade申請API実装
- [x] Private Checkout（Session）API実装

## 次ステップ（優先度順）

### 優先度1：Stripe決済フローの動作確認
- [x] Stripeテストサンドボックスをクレーム（2026年2月15日まで有効）
- [x] Fit Gate 12問でReady判定→Pass購入ボタン→Stripe Checkout→決済完了の流れをテスト
- [x] Webhook処理が正しく発火し、passSubscriptionsテーブルにloginId/loginPasswordが生成されるか確認
- [x] PassOnboarding画面でログイン情報が正しく表示され、Vercel版アプリへのリンクが機能するか確認
- [x] getStripeSession APIエンドポイントを追加してStripe SessionからメールアドレスをPassOnboardingページで取得

### 優先度2：証拠パック（匿名サンプル）セクションの実装
- [x] Evidence Packセクション（現在は空カードCase A/B/C）に実際のコンテンツを追加
- [x] Case A/B/C：匿名化した意思決定メモ例（前提、比較世界線、指標差分、インサイト1行）
- [x] opacity-0を削除してセクションを表示
- [x] ホバー効果を追加

### 優先度3：Prep Mode再診断リンクの常設
- [x] FitResult.tsxのPrep Mode判定結果ページに「再診断リンク」を常設
- [x] 準備チェックリスト（期限、価格帯、入力数字、予算感）を表示
- [x] 「準備が整ったら、再度適合チェックを受けてください」のメッセージを追加
- [x] 「再診断を受ける」ボタンを追加（/fit-gateへのリンク）

### 優先度4：Umamiダッシュボード整備
- [ ] Umamiで7つのイベント（lp_hero_cta_clicked、fitgate_started/submitted、fitgate_result_session/prep/notyet、prep_registered）が正しく発火しているか確認
- [ ] LP専用ダッシュボードを作成（LP訪問数、Hero CTA→Fit Gate Start率、Fit Gate結果内訳、Prep登録数）
- [ ] ダッシュボードURLをdocs/analytics.mdに追記

### 優先度5：Fit Gate判定ロジック最適化準備
- [ ] fitGateResponsesテーブルにsessionIdが正しく記録されているか確認
- [ ] スプレッドシート可視化テンプレート（Raw Data、判定結果サマリ、質問別集計、クロス集計、時系列推移）を作成
- [ ] 20〜30件溜まるまでロジックに手を入れず、ログをきれいに積むことに集中

## P0修正（優先度最高）

### P0-1: Onboarding 3タスク必須化とUpgrade封印
- [x] PassOnboardingページを「Onboarding 3タスク」画面に変更
- [x] タスク1：アプリを開いた（自己申告チェックボックス）
- [x] タスク2：シナリオ比較を1回見た（自己申告チェックボックス）
- [x] タスク3：意思決定メモを1回生成した（自己申告チェックボックス）
- [x] 3タスク完了までUpgrade申請ボタンを非表示
- [x] サーバ側でUpgrade申請を3タスク完了までブロック
- [x] passOnboardingテーブルを作成（email, task1AppOpened, task2CompareViewed, task3MemoGenerated, completedAt）
- [x] getOnboarding / updateOnboarding APIエンドポイントを追加
- [x] hasCompletedPassOnboardingヘルパー関数を実装
- [x] 3タスク完了後に「すべてのタスクが完了しました！」メッセージとUpgrade申請ボタンを表示

### P0-2: Evidence Packをヒーロー直下へ移動しFAQ 5問と比較ビジュアルを追加
- [x] Evidence Packプレビューセクションを証拠パックセクション直後に追加
- [x] FAQ 5問をEvidence Pack直後に追加（何をしてくれるか、物件紹介はあるか、税務代行か、個人情報の扱い、保証はあるか）
- [x] 世界線比較のビジュアル例を追加（簡易版とフル版のテーブル）
- [x] Heroに「Evidence Packを見る」スムーズスクロールリンクを追加

### P0-3: Fit Gateメール実質必須化
- [x] Fit Gateフォームでメールアドレスを必須入力に変更
- [x] バリデーションエラーメッセージを追加

## P1修正（次の優先度）

### P1-1: Webhook冪等性とログイン情報再送（最優先）

#### 冪等性実装
- [x] passSubscriptionsテーブルにstripeSessionIdカラムを追加（UNIQUE制約）
- [x] Webhook処理で「既に処理済みか」を判定して早期return
- [ ] 二重送信テスト：同一session.idでWebhookを2回呼んでも二重発行しないことを確認

#### ログイン情報再送導線
- [x] /pass/resend-loginページを作成（メールアドレス入力フォーム）
- [x] server/routers.tsにresendLoginInfo APIを追加（メールでpassSubscriptions検索→loginId/loginPassword返却）
- [x] メールが見つからない場合は「購入メールの受領確認」へ誘導
- [ ] PassOnboardingページに「ログイン情報を失った場合」リンクを追加

#### UI改善
- [x] PassOnboardingページにID/パスワードコピーボタンを追加（既に実装済み）
- [x] PassOnboardingページに「ログイン情報を失った場合」リンクを追加
- [x] FitResult.tsxのReady結果ページに「決済後すぐにログイン情報が発行され、90日間利用できます」を追加

#### Evidence Pack二重感の整理
- [x] Home.tsxの上部Evidence Packプレビューを削除
- [x] 上部は「3分で適合チェック」CTAだけに寄せる（Heroセクションに下部アンカーリンクあり）
- [x] 下部は詳細版Evidence Pack＋FAQを残す

#### NotYet出口設計（prep_bucketでnear/notyetを分類）
- [x] drizzle/schema.tsのfitGateResponsesにprep_bucketカラムを追加（near/notyet）
- [x] server/routers.tsのprep判定ロジックにprep_bucket分類を追加
- [x] FitResult.tsxのPrep結果ページをnear/notyetで出し分け
- [x] prepModeSubscribersテーブルにprep_bucketカラムを追加
- [x] server/routers.tsにsubscribePrepMode APIを修正（prep_bucketを保存）
- [x] lib/analytics.tsにfitgate_result_prep_nearとfitgate_result_prep_notyetを追加

#### Go/No-Go基準
- [x] Webhookの二重送信を意図的に起こしても二重発行しない（stripeSessionId UNIQUE制約）
- [x] 購入者がサポート連絡なしにログイン情報を取り戻せる（/pass/resend-login）
- [x] Evidence Packが二重に見えない（上部プレビュー削除）
- [x] NotYetに出口がある（prep_bucket: near/notyetで分類）

### P1-2: LPの価格レンジ表記の統一
- [ ] ヒーローセクションの価格レンジを「6,000万〜1億」に統一
- [ ] Evidence PackのCase例の価格レンジを統一
- [ ] Fit Gateの質問選択肢の価格レンジを統一

---

## 検証フェーズ（京都モデル v0.3.1 RC完了判定）

### Webhook冪等性の二重送信テスト（5ケース実施、Notion記録用）
- [x] テストケース1: 同一イベントの二重送信
- [x] テストケース2: 異なるイベントIDだが同一session.id
- [x] テストケース3: UNIQUE制約違反のエラーハンドリング
- [ ] テストケース4: Webhook未到達の状態でPassOnboarding表示（今後実施）
- [ ] テストケース5: ログイン情報再送（今後実施）
- [ ] テストケース6: Session Private Checkout 48h期限切れ（今後実施）
- [x] テスト結果をMarkdown形式でNotion貼り付け用に出力

### Umamiダッシュボード（イベント名固定、2枚構成）
- [x] イベント名を京都モデル v0.3.1 仕様に統一
- [x] lib/analytics.tsでAnalyticsEventsを固定
- [x] FitResult.tsxとPrepMode.tsxで新しいイベント名を使用
- [x] docs/umami-dashboard-setup.mdでダッシュボード設定ガイドを作成
- [ ] Umami管理画面でDashboard AとBを実際に作成（ユーザーが実施）

### Acceptance Criteriaチェック表作成（証拠付き）
- [x] Public LPにSession申込フォームが存在しない
- [x] Public LPに決済リンクが存在しない
- [x] Fit GateでEmailが必須
- [x] Ready結果ページでSessionが表示されない
- [x] Sessionは招待トークン有効 または Upgrade承認時のみ購入導線が出る
- [x] Pass購入後にOnboarding 3タスクが必須で、完了までUpgrade申請が封印される
- [x] Evidence PackがLP上部にあり、比較ビジュアルとFAQが存在する（PARTIAL PASS: FAQは存在、Evidence Pack上部プレビューは削除）
- [x] Stripe決済からログイン発行までのE2Eが正常
- [x] Webhook冪等性とログイン情報再送が実装されている
- [x] Prep Mode分類（near/notyet）が実装されている
- [x] Umamiイベント名が京都モデル v0.3.1 仕様に準拠している
- [x] docs/acceptance-criteria-checklist.mdでチェック表を作成

### 返金・チャージバック時のアクセス剥奪（余力があれば）
- [x] charge.refundedイベントでPass無効化
- [x] charge.dispute.createdイベントでPass無効化
- [x] server/db.tsにgetPassSubscriptionByPaymentIntentIdとupdatePassSubscriptionStatus関数を追加
- [x] 無効化時のログイン拒否処理（hasActivePassSubscriptionでstatusをチェック）

---

## Acceptance Criteria 11/11項目完全PASS（最終タスク）

### タスクC: 30日後再診断メール（NotYet向け）の実装
- [x] notyet_followupテーブルを作成（email, sentAt, fitGateResponseId）
- [x] server/db.tsにnotyetFollowup関連の関数を追加
- [x] メールテンプレートを作成（server/email-templates/notyet-followup.ts）
- [x] 30日後バッチ処理のスケジューラーを実装（server/schedulers/notyet-followup-scheduler.ts）
- [x] 送信ログをnotyet_followupテーブルに記録
- [ ] 実際のメール送信サービスと統合（SendGrid / SES / Manus側メール）
- [ ] 実際のcronスケジューラーと統合（node-cron / Manus scheduler）

### タスクB: Webhook冪等性の実Stripe CLI実証テスト（追加）
- [ ] Stripe CLIで実際の二重送信を再現
- [ ] DBログを確認して二重登録が防止されていることを確認
- [ ] docs/webhook-idempotency-test-results.mdに実証テスト結果を追記

---

## Manusメール + Manus scheduler統合（京都モデル v0.3.1 完全運用化）

### Task A: mailer adapter実装（Manus mail + SendGrid、DRY_RUNモード）
- [x] notyetFollowupテーブルにstatusカラムを追加（pending/sending/sent/failed）
- [x] notyetFollowupテーブルにlast_errorカラムを追加
- [x] notyetFollowupテーブルにprovider_message_idカラムを追加
- [x] notyetFollowupテーブルにcreatedAtカラムを追加
- [x] fitGateResponseId + followup_typeのユニーク制約を追加（二重送信防止）
- [x] unsubscribeテーブルを作成（email, opt_out, unsubscribedAt）
- [x] server/lib/mailer/index.tsを作成（sendMail関数、sendNotYetFollowupEmail関数）
- [x] MAIL_PROVIDER環境変数（manus / sendgrid）
- [x] MAIL_DRY_RUN環境変数（true / false）
- [x] Manus mail provider実装（server/lib/mailer/providers/manus.ts）
- [x] SendGrid provider実装（server/lib/mailer/providers/sendgrid.ts）
- [x] DRY_RUN時はプロバイダへの送信を行わず、成功相当の戻り値を返す
- [ ] 送信ログを記録（provider_message_id, sent_at, last_error）→ エンドポイント側で実装

### Task B: /api/jobs/notyet-followupエンドポイント実装
- [x] server/routers.tsに/api/jobs/notyet-followupエンドポイントを作成（POST）
- [x] Authorization: Bearer <JOB_AUTH_TOKEN>必須
- [x] JOB_AUTH_TOKEN環境変数を追加
- [x] jobLocksテーブルで同時実行ロックを実装
- [x] dueなfollowupをpendingかつopt_outではない条件でバッチ取得し、sendingへ遷移
- [x] DRY_RUN時は確保したレコードをpendingへ戻して終了
- [x] 実送信時は送信成功でsentへ更新、送信失敗でfailedへ更新
- [ ] Manus schedulerで毎日10:00 JSTに実行設定（ユーザーが実施）

### Task C: unsubscribe登録時にpending followupを終端化
- [ ] server/routers.tsにunsubscribe APIを追加
- [ ] unsubscribe登録時にそのメールに紐づくpendingのfollowupをfailed（last_error=opt_out）に更新
- [ ] client/src/pages/Unsubscribe.tsxを作成（配信停止ページ）

### Task D: 二重送信テスト3ケースを実施しNotionに証跡を記録
- [ ] ケース1: 同一ユーザーをdueにしてschedulerを2回連続実行
- [ ] ケース2: schedulerを並列実行（2プロセス想定）
- [ ] ケース3: opt_outのユーザーをdueにして実行
- [ ] 結果をNotionに貼り付け（実行日時、対象ユーザー、DBのstatus遷移、実際の受信有無、provider_message_id）

### Task E: Umamiダッシュボード作成（ユーザーが実施）
- [ ] Dashboard 1: Acquisition Funnel（lp_view, lp_hero_cta_clicked, fitgate_started, fitgate_submitted）
- [ ] Dashboard 2: Revenue and Activation Funnel（fitgate_result_ready, pass_checkout_opened, pass_payment_success, onboarding_completed）
- [ ] ダッシュボードURLをdocs/とNotionに貼り付け

---

## 友人紹介LP実装（京都モデル v0.3.1 + 友人経由の例外購入）

### Phase 1: inviteTokensテーブル作成（PASS専用、14日期限1回使用）
- [x] drizzle/schema.tsにinviteTokensテーブルを作成（token, type=PASS, expiresAt, isUsed, usedAt, revokedAt）
- [x] server/db.tsにgetInviteTokenByToken関数を追加
- [x] server/db.tsにmarkInviteTokenAsUsed関数を追加
- [x] server/db.tsにisInviteTokenValid関数を追加
- [x] inviteTokensテーブルを手動で作成

### Phase 2: /invite/pass/:tokenページ作成（デザインとコピー）
- [x] client/src/pages/InvitePass.tsxを作成
- [x] Hero: 「友人紹介枚: 家の意思決定を世界線比較で整理するPass」
- [x] 信用付与ブロック: 「紹介として一言」
- [x] 90日で手に入る成果物: 上限レンジ、3世界線の結論、次の30日アクション
- [x] 60秒プレビュー: シナリオ比較、レバー操作、意思決定メモ（スクショト3枚）
- [x] 向いている人 / 向いていない人（友人版）
- [x] Passの範囲（含む / 含まない）
- [x] FAQ 友人向け（5問固定）
- [x] 最終CTA: 「まず適合チェックから始めてください」
- [x] meta robots: noindex, nofollow
- [x] token無効時: 「この招待リンクは期限切れ、または無効になりました」
- [x] App.tsxに/invite/pass/:tokenルーティングを追加
- [x] server/routers.tsにinviteToken.validateエンドポイントを追加
- [x] lib/analytics.tsにINVITE_LP_VIEW、INVITE_LP_CTA_FITGATE_CLICKEDを追加
- [x] react-helmet-asyncをインストール

### Phase 3: Fit Gateに友人経由パラメータを追加
- [ ] FitGate.tsxでURLパラメータsrc=friend_invite、inviteTokenを取得
- [ ] フォーム上部に「招待トークン適用中」を表示
- [ ] submit時にsrcとinviteTokenをfitGateResponsesに保存
- [ ] drizzle/schema.tsのfitGateResponsesにsrc、inviteTokenカラムを追加

### Phase 4: FitResult.tsxにprep_near例外購入ボタンを追加
- [ ] FitResult.tsxのPrep Near結果ページに「紹介経由でPassを購入する」ボタンを追加
- [ ] 条件: src=friend_invite、inviteTokenが有効、result=prep_near
- [ ] 確認モーダルを実装（2つのチェックボックス必須）
- [ ] モーダル文言: 「確認: いまは準備不足の可能性があります」
- [ ] チェックボックス1: 「いまの状態では価値体験に到達しない可能性があることを理解しました」
- [ ] チェックボックス2: 「物件価格帯と意思決定期限を、購入後に入力して整える前提で開始します」
- [ ] ボタン: 「Passを開始する（29,800円 / 90日）」「いまは準備を整える」
- [ ] prep_notyetでは例外ボタンを表示しない

### Phase 5: 友人経由の計測イベントを追加
- [ ] lib/analytics.tsにinvite_lp_view、invite_lp_cta_fitgate_clickedを追加
- [ ] InvitePass.tsxでinvite_lp_viewを送信
- [ ] InvitePass.tsxのCTAでinvite_lp_cta_fitgate_clickedを送信
- [ ] FitGate.tsxでsrc付きfitgate_started、fitgate_submittedを送信
- [ ] FitResult.tsxでsrc付きfitgate_result_*を送信
- [ ] Pass決済成功時にsrc付きpass_payment_successを送信

### 受け入れ基準
- [ ] LPに決済リンクが存在しない
- [ ] LPにSession申込導線が存在しない
- [ ] LPのPrimary CTAがFit Gateへ遷移する
- [ ] noindexが設定されている
- [ ] token無効時はFit Gateへ進めない
- [ ] prep_nearのみ例外購入が出る
- [ ] prep_notyetは例外購入が出ない
- [ ] 例外購入には2つの確認チェックが必須
- [ ] src=friend_inviteが計測に残る

---

## レビュー用トークンバイパス機能

### 実装内容
- [x] 環境変数INVITE_TOKEN_BYPASS_VALIDATIONを追加（開発環境でtrue、本番環境でfalse）
- [x] server/db.tsのisInviteTokenValid関数にバイパスロジックを追加
- [x] バイパス時はtoken検証をスキップし、常に有効として扱う
- [x] 本番環境では必ずfalseにして、実際のtoken検証を行う
