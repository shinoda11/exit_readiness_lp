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
