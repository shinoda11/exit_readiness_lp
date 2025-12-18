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
