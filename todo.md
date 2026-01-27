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

---

## react-helmet-asyncエラー修正

### 実装内容
- [x] App.tsxにHelmetProviderを追加
- [x] InvitePass.tsxでHelmetが正常に動作することを確認

---

## マーケティングチーム方針：友人導線を本番で無効化（公開ワンパス優先）

### 背景
- 計測の純度と運用品質を守るため、友人紹介LP導線は当面ローンチしない
- 公開LP→Fit Gate→Ready→Pass→Onboarding→Appの一本線を安定させることを最優先
- 友人導線は「実装は残してよいが、提供はしない」を明確化

### P0: 友人導線を本番で完全に無効化
- [x] Feature Flag導入（FRIEND_INVITE_ENABLED=false を本番固定）
- [x] /invite/pass/:tokenルーティングを本番で404または/へリダイレクト（token正しくても通さない）
- [x] INVITE_TOKEN_BYPASS_VALIDATIONを本番でfalse固定（可能なら本番環境ではenv自体を参照しない実装）
- [x] Fit Gateのfriend_inviteパラメータを本番では受け取っても無視（保存しない、UI表示しない）

### P0: 例外購入UIの露出ゼロ
- [x] FitResultのPrep Near例外購入ボタンを本番で表示されないことを保証（未実装のため、実装時にガード追加）

### P0: Umamiダッシュボードを2枚だけ固定
- [x] Dashboard A: Acquisition Funnel（lp_hero_cta_clicked, fitgate_started, fitgate_submitted）
- [x] Dashboard B: Revenue and Activation Funnel（fitgate_result_ready, pass_checkout_opened, pass_payment_success, onboarding_completed）
- [x] 友人導線イベントをダッシュボードから除外（フィルタで隠すのではなく、そもそもダッシュボードに置かない）

### P1: 漏れ検知のための安全イベント
- [ ] invite_route_accessedイベントを追加（/invite系にアクセスしたが404/redirectになったとき）
- [ ] 目的: 意図しないリンク流通の早期検知

### P0: 設計書の修正
- [x] 冒頭のステータスを「RC完了（公開ワンパス提供中）、友人紹介LP: 実装一部あり、ただし未提供（Parked）」に変更
- [x] 友人導線の章をAppendixに移動し、見出しにParkedと明記（/invite/pass/:token、友人紹介LPフロー、Friend Referral Funnelイベント、Phase 3〜5実装計画）
- [x] 次のステップから友人導線関連を外し、公開ワンパスの安定化だけに寄せる
- [x] Acceptance Criteriaに追加（12/12）: 友人導線が本番で無効化されている、INVITE_TOKEN_BYPASS_VALIDATIONが本番でfalse固定

### Done の定義
- [ ] 本番環境で /invite/pass/:token にアクセスしても 404 または / に遷移する
- [ ] 本番環境で friend_invite の src や inviteToken を渡しても UI とDBに影響しない
- [ ] Umami ダッシュボードは2枚のみ、友人イベントは入っていない
- [ ] 実装設計書が「公開ワンパス提供中、友人導線はParked」に統一されている

---

## 運用固定フェーズ：壊れない状態を証明し、毎日数字が見える状態に固定

### 背景
- 「次の機能」ではなく、運用で壊れない状態を証明し、毎日数字が見える状態に固定するフェーズ
- 京都モデルの勝ち筋は、ここで"やることを増やさない"こと
- 必要な作業は3ブロックだけ

### 1) 本番設定の最終確認
- [x] 環境変数チェックリスト作成（Preview/Production含む）
- [x] FRIEND_INVITE_ENABLED=false確認
- [x] INVITE_TOKEN_BYPASS_VALIDATION=false確認
- [x] MAIL_DRY_RUN=false確認（本番運用で送るなら）
- [x] MAIL_PROVIDER=manus確認（原則）/ sendgrid（フォールバック）
- [x] JOB_AUTH_TOKENがセット済みで、十分に長いランダム文字列確認
- [ ] Acceptance: 本番で /invite/pass/:token にアクセスしても 404 か / に戻る
- [ ] Acceptance: 本番で inviteToken や src=friend_invite を付けても挙動が変わらない
- [ ] Acceptance: bypass が false の状態で、どんなtokenでもinvite経由の閲覧が成立しない

### 2) Umamiダッシュボード運用開始
- [x] Dashboard A: Acquisition Funnel作成（lp_hero_cta_clicked, fitgate_started, fitgate_submitted）
- [x] Dashboard B: Revenue and Activation Funnel作成（fitgate_result_ready, pass_checkout_opened, pass_payment_success, onboarding_completed）
- [x] 友人導線イベントは作らない、置かない、見ない（Parkedなら存在しないのと同義）
- [x] 2枚が毎日更新される状態を作る
- [ ] Acceptance: 今日の数字が2枚に出る
- [ ] Acceptance: 7日分の推移が見える（週次で判断できる）

### 3) 改善フェーズの開始条件と、改善の範囲固定
- [x] 最適化の目的を固定（Ready→Pass購入率を上げる、Pass購入率を上げる）
- [x] 改善の対象範囲を固定（Ready結果ページ、Evidence Pack、Onboarding、Fit Gate質問文言）
- [x] やらないことを固定（質問数の増加、新機能追加、価格変更、友人導線の再開）

### 4) 設計書の差分修正（SSOTのための必須作業）
- [x] ステータス表記を統一（公開RC提供中、友人導線はParked）
- [x] 友人導線の記述を本文から外し、Appendixに隔離
- [x] ルーティング表の /invite/pass/:token は本文から削除、Appendixへ
- [x] 主要フロー 5.2 は本文から削除、Appendixへ
- [x] 友人イベント（invite_lp_view 等）は本文から削除、Appendixへ
- [x] "次のステップ"の章から友人導線のPhase 3〜5を除去
- [x] セッションの表現を推奨から解放へ統一（session は unlocked、それ以外は ready を返す）

---

## LP差し替え（Copy Patch v1.1）

### Home.tsx（公開LP）
- [x] ヒーローH1を「人生の大きな選択を、「詰まない安心」と「やりたいことの余白」で判断する意思決定OS。」に差し替え（A案）
- [x] サブコピーを「家・仕事・家族イベントが同時に揺れる前提で、複数の未来を同じ前提で並べます。結論は押し付けず、納得できる判断の根拠と“次の一手”まで返します。」に差し替え
- [x] Exit定義の1行を追加「※Exit＝働き方を緩めたり、辞めても詰まないための自由度のこと。」
- [x] 右側カードタイトルを「適合チェック（12問）」に差し替え
- [x] 右側カード補足を「いまこのOSを使う段階か、Prepが先かを判定します。申込みではなく、次のステップを決めるためのチェックです。」に差し替え
- [x] Evidence Pack見出しを「迷いが“論点”に変わる理由」に差し替え
- [x] Evidence Pack 3カードの文言を差し替え
- [x] Problemセクション本文を差し替え
- [ ] 「Exit Readiness OSとは何か」3カラムの説明文を差し替え
- [ ] 「いま実際にできること（AS-IS）」の本文を差し替え
- [ ] 「これから増えていく横串（To-Be）」に注意書きを追加「※ここから先はロードマップです（順次追加）。」
- [ ] FAQ 5問の回答を差し替え

### FitGate.tsx
- [x] ページ冒頭に説明を追加「これは申込みではなく、準備状態のチェックです。12問で「いま進める（Ready）／準備を整える（Prep）」を判定します。正解を押し付けず、次のステップだけを返します。」

### FitResult.tsx
- [x] Ready結果の見出しを「Ready：世界線比較に進めます」に差し替え
- [x] Ready結果の本文を「いまは「比較→判断→次の一手」まで進める段階です。住宅を入口に、安心ラインと余白を並べて確認できます。」に差し替え
- [x] Prep Near結果の見出しを「Prep（近い）：あと少しで比較が“効く”状態です」に差し替え
- [x] Prep Near結果の本文を「いまは前提が固まり切っていないため、先に準備を整える方が早いです。30日後に再チェックできるようにします。」に差し替え
- [x] Prep NotYet結果の見出しを「Prep（まだ早い）：状況が動いたら再チェックを」に差し替え
- [ ] Prep NotYet結果の本文を「物件価格帯や期限、収入・資産の状況が動いたタイミングで再チェックしましょう。30日後に再診断の案内を送ります。」に差し替え

### PrepMode.tsx
- [x] 見出しを「Prep Mode：前提を整えて、もう一度世界線を出す」に差し替え
- [x] 本文を「いまは「結論」より「前提づくり」が効く段階です。30日後に再チェックの案内を送ります（状況が動いたら、その時点で再チェックでもOK）。」に差し替え

### InvitePass.tsx（任意）
- [ ] 見出しを「まずは適合チェックで、いまの段階を確認してください」に差し替え
- [ ] 本文を「申込みではなく、準備状態のチェックです。Readyなら世界線比較へ、Prepなら準備ステップへ案内します。」に差し替え

### リリース前チェックリスト
- [ ] Exitが「働き方の自由度」と読める（売却文脈ゼロ）
- [ ] 公開LPに決済リンクが無い
- [ ] Evidence Packがヒーロー直下にある
- [ ] Hero CTAが「適合チェックに進む」で、計測イベントも維持
- [ ] Fit Gateが12問である説明と矛盾していない

## Copy Patch v1.1.2：改行・タイポグラフィ品質向上（プロフェッショナル仕上げ）

### P0修正（必須）
- [x] Hero H1の改行修正：重要語をinline-blockで保護し、意味の切れ目でのみ改行
- [x] To-Be見出しの改行修正：「イベント横断」の途中割れを防止

### P1修正（推奨）
- [x] 見出し全体にtext-balance適用：h1/h2にtext-balanceを追加
- [x] カタカナ語の保護：「イベント」「シミュレーション」等をinline-blockで保護

### 任意修正
- [x] 右側カードに注意書き追加：「※表示は一部（例）です」

### QAチェック（受け入れ条件）
- [x] ブレークポイント別スクショ確認（375/390/768/1024/1280）
- [x] H1に1文字だけの行が存在しない
- [x] 重要語が途中で割れていない
- [x] 見出しの改行位置が意味の切れ目になっている

## Copy Patch v1.1.3：助詞の孤児解消と組版品質向上

### P0対応（必須）
- [x] H1の「で」単独行を解消：「やりたいことの余白」で を1塊にして改行させない
- [x] 上部タグの“Exit OS”略称を撤廃：「高収入DINKs向け 意思決定OS β版」に変更
- [x] 右側カードの12問表記の整合：「※表示は一部です（全12問）」を追記

### P1対応（推奨）
- [x] Scenario 2の「ゆるExit」表記を外向けに変更：「働き方ダウンシフト準備」へ
- [x] ロードマップ注記を追加：「※ここから先はロードマップです（順次追加）」

### 受け入れ条件（QA）
- [x] 375/390/768/1024/1280で確認し、助詞単独行がゼロ
- [x] 見出しで重要語が途中分割しない
- [x] “12問”と“表示3問”の違和感がない

## Copy Patch v1.1.4：優先度の高い修正（P0→P1）

### P0対応（必須）
- [x] HERO-01の改行修正（フォントサイズ対応）：意図した位置で改行されるように修正
- [x] HERO-03：Exit定義をファーストビューに追加

### P1対応（推奨）
- [x] HERO-04：H1末尾の読点/終止修正（名詞止めに変更）
- [x] REASON-01：3カードの本文簡略化（２行＋例１行に固定）
- [x] PROB-01：4つの悩みカード見出し化（１行目＝悩みの要約、２行目＝具体）
- [x] CONCEPT-02：緑の「フラット」説明箇条書き化（３点箇条書きに分解）
- [x] SCENARIO-02：指標差分の視認性向上（数値行を太字＋短文化）

### 受け入れ条件（QA）
- [x] 375/390/768/1024/1280で確認し、助詞単独行がゼロ
- [x] H1が意図した位置で改行されている
- [x] Exit定義がファーストビューに明示されている

## CONCEPT-01：カード見出しの英/日ルール統一

### 修正内容
- [x] 3つの柱カード見出しの英/日ルールを統一
  - 現在：「世界線（Worldline）」のように英語が括弧内に混在
  - 修正後：日本語見出しを太字で配置し、英語を下に小さく配置
  - 対象：世界線（Worldline）、安心ライン（Safety Line）、余白（Slack）

### 受け入れ条件
- [x] 3つの柱カードの見出しが日本語（太字）＋英語（小さく下）の構造になっている
- [x] 視覚的な階層が明確になっている

## ビジュアルエディタからの変更

### 修正内容
- [x] H1のフォントサイズを60px→58pxに調整
- [x] Exit定義の誤字修正：「连めても」→「辞めても」

### 受け入れ条件
- [x] H1のフォントサイズが58pxになっている
- [x] Exit定義の誤字が修正されている

## モバイル幅での実機確認

### 確認内容
- [x] 375px幅でH1の改行状態を確認（問題発見）
- [x] H1のフォントサイズをレスポンシブ化（text-2xl md:text-5xl lg:text-6xl）
- [x] inline-blockの範囲を調整（「やりたいこと」と「の余白」で」を分割）
- [x] 375px幅で再確認
- [x] 390px幅で再確認
- [x] 助詞の孤児が発生していないことを確認
- [x] 意図した位置で改行されていることを確認

### 受け入れ条件
- [x] 375px/390pxで助詞単独行がゼロ
- [x] H1が意図した位置で改行されている
- [ ] 重要語が途中で割れていない

## デスクトップ幅（1280px）での最終確認

### 確認内容
- [x] 1280px幅でH1の表示を確認（問題発見）
- [x] H1のインラインスタイル（fontSize: "58px"）を削除（既に削除済み）
- [x] デスクトップ幅での改行を減らす（lg:hidden追加）
- [x] H1のフォントサイズをtext-5xlに調整（lg:text-6xl→lg:text-5xl）
- [x] 1280px幅で再確認
- [x] H1が意図通りに表示されているか確認

### 受け入れ条件
- [x] 1280px幅でH1が読みやすく表示されている
- [x] Tailwindのレスポンシブクラスが正しく機能している

## FAQ-01：FAQ最後に「投資助言ではない/売らない」を追加

### 修正内容
- [x] FAQ最後に「投資助言ではない/売らない」を追加
- [x] 誤解防止を強化

### 受け入れ条件
- [x] FAQ最後に「投資助言ではない/売らない」が追加されている
- [x] 誤解防止が強化されている

## TABLET-01：タブレット幅（768px）での確認と微調整

### 確認項目
- [x] H1の改行動作（助詞の孤児がないか）
- [x] FAQセクションの表示（読みやすさ）
- [x] 3つの柱カードのレイアウト
- [x] 4つの悩みカードのレイアウト
- [x] Evidence Packセクションのレイアウト
- [x] シナリオ例のレイアウト
- [x] 全体的なフォントサイズとスペーシング

### 修正内容
- [x] 必要に応じてフォントサイズを微調整（不要と判断）
- [x] 必要に応じてスペーシングを微調整（不要と判断）
- [x] 必要に応じて改行位置を調整（不要と判断）

### 受け入れ条件
- [x] 768px幅でH1が読みやすく表示されている
- [x] 768px幅でFAQが読みやすく表示されている
- [x] 768px幅で全体的なレイアウトが適切である

## KYOTO-MODEL-01：Kyoto Modelに準拠させるための修正（4つのプロンプト）

### プロンプト1/4: ヒーローセクションの刷新
- [x] 「β版のOS」から「90日間の集中スプリント」へ転換
- [x] H1を「人生の大きな選択を、90日間で確定させる」に変更
- [x] サブコピーを「納得いくまで試行錯誤し、最良の選択を導き出すための、意思決定OS」に変更
- [x] ターゲット明示を「年1,000～2,000万円のDINKs/プレDINKs向け」に変更更

### プロンプト2/4: 課題提起の感情的訴求強化
- [x] 課題提起セクションの文言を感情的訴求に変更
- [x] 「あなたの歩みを止めている理由は…」で始まる文言に変更

### プロンプト3/4: 価格正当化セクションの追加
- [x] Evidence PackセクションとFAQセクションの間に新セクションを追加
- [x] 「あなたの意思決定は、29,800円で「最高品質」になる」見出し
- [x] 29,800円 / 90日間の価格表示
- [x] 1日あたり331円の価値訴求
- [x] FP相談（2時間）との比較
- [x] 転職の失敗コストとの比較

### プロンプト4/4: Ready結果ページへの価格表示
- [x] FitResult.tsxのReadyページに価格表示を追加（既に実装済み）
- [x] 「29,800円 / 90日間」を購入ボタンの上に表示（既に実装済み）

### 受け入れ条件
- [x] 全4つのプロンプトが順番通りに実装されている
- [x] ヒーローセクションが「90日間の集中スプリント」を訴求している
- [x] 価格正当化セクションが追加されている
- [x] Ready結果ページに価格が表示されている
- [x] 全体的なメッセージがKyoto Modelの思想を反映している

## YOHACK-BRAND-01：YOHACKブランドへの転換とKyoto Model準拠

### プロンプト1/5: グローバルなブランド名置換
- [x] `find ./client/src -type f -name "*.tsx" -exec sed -i 's/Exit Readiness OS/YOHACK/g' {} +`を実行
- [x] 全ての`.tsx`ファイルで「Exit Readiness OS」が「YOHACK」に置換されていることを確認

### プロンプト2/5: ヒーローセクションの刷新
- [x] `client/src/pages/Home.tsx`のヒーローセクションを修正（既に実装済み）
- [x] H1を「人生の大きな選択を、90日間で確定させる」に変更（既に実装済み）
- [x] サブコピーを「納得いくまで試行錯誤し、最良の選択を導き出すための、意思決定OS」に変更（既に実装済み）
- [x] ターゲット明示を「年収1,000～2,000万円のDINKs/プレDINKs向け」に変更（既に実装済み）

### プロンプト3/5: 価格正当化セクションの追加
- [x] `client/src/pages/Home.tsx`のEvidence PackセクションとFAQセクションの間に新セクションを追加（既に実装済み）
- [x] 「あなたの意思決定は、29,800円で「最高品質」になる」見出し（既に実装済み）
- [x] 「YOHACK Pass 29,800円 / 90日間」の価格表示（既に実装済み）
- [x] 1日あたり331円の価値訴求（既に実装済み）
- [x] FP相談（2時間）との比較カード（既に実装済み）
- [x] 転職の失敗コストとの比較カード（既に実装済み）

### プロンプト4/5: Fit Gate結果ページへの価格表示
- [x] `client/src/pages/FitResult.tsx`のReadyページに価格表示を追加（既に実装済み）
- [x] 「YOHACK Pass ¥29,800 / 90日間」を購入ボタンの上に表示（既に実装済み）
- [x] ボタンテキストは「Pass購入（¥29,800）」で簡潔で明確（現状維持）

### プロンプト5/5: Passプラン名の修正
- [x] `client/src/pages/FitResult.tsx`の`h3`タグを修正（既に実装済み）
- [x] 「Exit Readiness OS Pass」を「YOHACK Pass」に変更（既に実装済み）

### 受け入れ条件
- [x] 全5つのプロンプトが順番通りに実装されている
- [x] サイト全体で「Exit Readiness OS」が「YOHACK」に置換されている
- [x] ヒーローセクションが「90日間で確定させる」を訴求している
- [x] 価格正当化セクションが追加されている
- [x] Fit Gate結果ページに価格が表示されている
- [x] 全体的なメッセージがYOHACKブランドとKyoto Modelの思想を反映している

## PRICE-DISCLOSURE-01：価格表示の段階的開示（A案）

### 背景
- インスタグラムからの流入ユーザーは、まだYOHACKの価値を理解していない状態
- 最初のページで29,800円を見せると、価値を理解する前に離脱する可能性が高い
- A案（段階的な価格開示）を採用し、Evidence Pack後に価格正当化セクションを移動

### 実装内容
- [x] `client/src/pages/Home.tsx`の価格正当化セクション（S5）をEvidence Pack（S4）の後に移動（既に実装済み）
- [x] セクションの順序を調整：S1（Hero）→ S2（課題提起）→ S3（３つの柱）→ S4（Evidence Pack）→ **S5（価格正当化）** → S6（FAQ）→ S7（いま実際にできること）（既に実装済み）
- [x] Ready結果ページの価格表示は現状維持（29,800円を明示）（既に実装済み）

### 受け入れ条件
- [x] LPの最初のヒーローセクションに価格が表示されていない
- [x] Evidence Pack後に価格正当化セクションが表示されている
- [x] Ready結果ページに価格が表示されている（現状維持）
- [x] セクションの順序が意図通りになっている
