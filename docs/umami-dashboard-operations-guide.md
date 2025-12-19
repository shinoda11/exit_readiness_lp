# Umamiダッシュボード運用開始ガイド

**作成日**: 2024年12月19日  
**バージョン**: 1.0  
**目的**: 「イベント追加済み」ではなく、ダッシュボード2枚が固定されて初めて意思決定できる状態を作る

---

## 1. 運用ルール（必読）

**ダッシュボードは2枚だけ**

これが無い状態で改善を始めると、全員の脳内でストーリーが増殖して終わります。

1. **Dashboard A: Acquisition Funnel** - 公開LPからFit Gate完了までのファネル
2. **Dashboard B: Revenue and Activation Funnel** - Fit Gate判定結果からPass購入、Onboarding完了までのファネル

**友人導線イベントは作らない、置かない、見ない**

Parkedなら存在しないのと同義です。フィルタで隠すのではなく、そもそもダッシュボードに置きません。

**2枚が毎日更新される状態を作る**

見ないダッシュボードは存在しないのと同じです。毎日数字を見て、週次で判断できる状態を作ります。

---

## 2. Dashboard A: Acquisition Funnel

### 目的

公開LPからFit Gate完了までのファネルを可視化し、どこでユーザーが離脱しているかを特定します。

### 対象イベント

| イベント名 | 発火タイミング | 実装箇所 |
|-----------|--------------|---------|
| `lp_hero_cta_clicked` | Hero「適合チェックに進む」ボタンクリック | `client/src/pages/Home.tsx` |
| `fitgate_started` | Fit Gateページ表示 | `client/src/pages/FitGate.tsx` |
| `fitgate_submitted` | Fit Gate回答送信 | `client/src/pages/FitGate.tsx` |

### ウィジェット構成

| ウィジェット名 | タイプ | 設定 | 目的 |
|--------------|--------|------|------|
| LPユニークビジター数 | Unique Visitors | ページ: `/` | LPへの流入数を把握 |
| Hero CTAクリック数 | Event Count | イベント: `lp_hero_cta_clicked` | Hero CTAの効果を測定 |
| Fit Gate開始数 | Event Count | イベント: `fitgate_started` | Fit Gateへの遷移数を測定 |
| Fit Gate完了数 | Event Count | イベント: `fitgate_submitted` | Fit Gate完了数を測定 |
| Hero CTA → Fit Gate開始率 | Custom Metric | `(fitgate_started / lp_hero_cta_clicked) * 100` | Hero CTAからFit Gateへの遷移率 |
| Fit Gate完了率 | Custom Metric | `(fitgate_submitted / fitgate_started) * 100` | Fit Gate開始から完了までの完了率 |

### 作成手順

#### Step 1: ダッシュボード作成

1. Umami管理画面にログイン
2. 左メニューから「Dashboards」を選択
3. 「Create Dashboard」をクリック
4. ダッシュボード名: `Acquisition Funnel`
5. 「Create」をクリック

#### Step 2: ウィジェット追加

以下のウィジェットを順番に追加します。

**ウィジェット1: LPユニークビジター数**

1. 「Add Widget」をクリック
2. Widget Type: `Unique Visitors`
3. Title: `LPユニークビジター数`
4. Filter: Page = `/`
5. 「Save」をクリック

**ウィジェット2: Hero CTAクリック数**

1. 「Add Widget」をクリック
2. Widget Type: `Event Count`
3. Title: `Hero CTAクリック数`
4. Filter: Event = `lp_hero_cta_clicked`
5. 「Save」をクリック

**ウィジェット3: Fit Gate開始数**

1. 「Add Widget」をクリック
2. Widget Type: `Event Count`
3. Title: `Fit Gate開始数`
4. Filter: Event = `fitgate_started`
5. 「Save」をクリック

**ウィジェット4: Fit Gate完了数**

1. 「Add Widget」をクリック
2. Widget Type: `Event Count`
3. Title: `Fit Gate完了数`
4. Filter: Event = `fitgate_submitted`
5. 「Save」をクリック

**ウィジェット5: Hero CTA → Fit Gate開始率**

1. 「Add Widget」をクリック
2. Widget Type: `Custom Metric`
3. Title: `Hero CTA → Fit Gate開始率`
4. Formula: `(fitgate_started / lp_hero_cta_clicked) * 100`
5. Unit: `%`
6. 「Save」をクリック

**ウィジェット6: Fit Gate完了率**

1. 「Add Widget」をクリック
2. Widget Type: `Custom Metric`
3. Title: `Fit Gate完了率`
4. Formula: `(fitgate_submitted / fitgate_started) * 100`
5. Unit: `%`
6. 「Save」をクリック

#### Step 3: ダッシュボードURLを記録

1. ダッシュボードのURLをコピー
2. このドキュメントに追記:

**Dashboard A URL**: （未設定）

---

## 3. Dashboard B: Revenue and Activation Funnel

### 目的

Fit Gate判定結果からPass購入、Onboarding完了までのファネルを可視化し、収益化とアクティベーションのボトルネックを特定します。

### 対象イベント

| イベント名 | 発火タイミング | 実装箇所 |
|-----------|--------------|---------|
| `fitgate_result_ready` | Ready判定結果表示 | `client/src/pages/FitResult.tsx` |
| `pass_checkout_opened` | Pass購入ボタンクリック | `client/src/pages/FitResult.tsx` |
| `pass_payment_success` | Pass決済完了 | `server/routes/stripe/webhook.ts` |
| `onboarding_completed` | Pass Onboarding 3タスク完了 | `client/src/pages/PassOnboarding.tsx` |

### ウィジェット構成

| ウィジェット名 | タイプ | 設定 | 目的 |
|--------------|--------|------|------|
| Ready判定数 | Event Count | イベント: `fitgate_result_ready` | Ready判定されたユーザー数を測定 |
| Pass購入ボタンクリック数 | Event Count | イベント: `pass_checkout_opened` | Pass購入ボタンのクリック数を測定 |
| Pass決済完了数 | Event Count | イベント: `pass_payment_success` | Pass決済完了数を測定 |
| Onboarding完了数 | Event Count | イベント: `onboarding_completed` | Onboarding完了数を測定 |
| Pass購入ボタンクリック率 | Custom Metric | `(pass_checkout_opened / fitgate_result_ready) * 100` | Ready判定からPass購入ボタンクリックまでの遷移率 |
| Pass決済完了率 | Custom Metric | `(pass_payment_success / pass_checkout_opened) * 100` | Pass購入ボタンクリックから決済完了までの完了率 |
| Onboarding完了率 | Custom Metric | `(onboarding_completed / pass_payment_success) * 100` | Pass決済完了からOnboarding完了までの完了率 |

### 作成手順

#### Step 1: ダッシュボード作成

1. Umami管理画面にログイン
2. 左メニューから「Dashboards」を選択
3. 「Create Dashboard」をクリック
4. ダッシュボード名: `Revenue and Activation Funnel`
5. 「Create」をクリック

#### Step 2: ウィジェット追加

以下のウィジェットを順番に追加します。

**ウィジェット1: Ready判定数**

1. 「Add Widget」をクリック
2. Widget Type: `Event Count`
3. Title: `Ready判定数`
4. Filter: Event = `fitgate_result_ready`
5. 「Save」をクリック

**ウィジェット2: Pass購入ボタンクリック数**

1. 「Add Widget」をクリック
2. Widget Type: `Event Count`
3. Title: `Pass購入ボタンクリック数`
4. Filter: Event = `pass_checkout_opened`
5. 「Save」をクリック

**ウィジェット3: Pass決済完了数**

1. 「Add Widget」をクリック
2. Widget Type: `Event Count`
3. Title: `Pass決済完了数`
4. Filter: Event = `pass_payment_success`
5. 「Save」をクリック

**ウィジェット4: Onboarding完了数**

1. 「Add Widget」をクリック
2. Widget Type: `Event Count`
3. Title: `Onboarding完了数`
4. Filter: Event = `onboarding_completed`
5. 「Save」をクリック

**ウィジェット5: Pass購入ボタンクリック率**

1. 「Add Widget」をクリック
2. Widget Type: `Custom Metric`
3. Title: `Pass購入ボタンクリック率`
4. Formula: `(pass_checkout_opened / fitgate_result_ready) * 100`
5. Unit: `%`
6. 「Save」をクリック

**ウィジェット6: Pass決済完了率**

1. 「Add Widget」をクリック
2. Widget Type: `Custom Metric`
3. Title: `Pass決済完了率`
4. Formula: `(pass_payment_success / pass_checkout_opened) * 100`
5. Unit: `%`
6. 「Save」をクリック

**ウィジェット7: Onboarding完了率**

1. 「Add Widget」をクリック
2. Widget Type: `Custom Metric`
3. Title: `Onboarding完了率`
4. Formula: `(onboarding_completed / pass_payment_success) * 100`
5. Unit: `%`
6. 「Save」をクリック

#### Step 3: ダッシュボードURLを記録

1. ダッシュボードのURLをコピー
2. このドキュメントに追記:

**Dashboard B URL**: （未設定）

---

## 4. Acceptance（完了条件）

### 4.1 今日の数字が2枚に出る

**確認方法**:
1. Dashboard AとDashboard Bを開く
2. 今日の日付で数字が表示されることを確認

**期待結果**: 今日の数字が2枚に表示される

**ステータス**: ⏳ 未確認

**トラブルシューティング**:
- 数字が表示されない場合: イベントが発火していない可能性があります。ブラウザのコンソールでUmamiスクリプトが読み込まれているか確認してください。

---

### 4.2 7日分の推移が見える（週次で判断できる）

**確認方法**:
1. Dashboard AとDashboard Bを開く
2. 日付範囲を「Last 7 days」に設定
3. 7日分の推移が表示されることを確認

**期待結果**: 7日分の推移が2枚に表示される

**ステータス**: ⏳ 未確認

**トラブルシューティング**:
- 推移が表示されない場合: データが7日分蓄積されていない可能性があります。7日間運用してから再確認してください。

---

## 5. 週次レポートフォーマット

毎週月曜日に以下の指標を確認し、改善施策を検討します。

### Acquisition Funnel（Dashboard A）

| 指標 | 今週 | 先週 | 変化率 | 判断 |
|-----|------|------|--------|------|
| LPユニークビジター数 | - | - | - | - |
| Hero CTAクリック数 | - | - | - | - |
| Fit Gate開始数 | - | - | - | - |
| Fit Gate完了数 | - | - | - | - |
| Hero CTA → Fit Gate開始率 | - | - | - | - |
| Fit Gate完了率 | - | - | - | - |

**ボトルネック特定**: どの指標が最も低いか？

**仮説立案**: なぜその指標が低いのか？

**施策実施**: どのような改善を行うか？

### Revenue and Activation Funnel（Dashboard B）

| 指標 | 今週 | 先週 | 変化率 | 判断 |
|-----|------|------|--------|------|
| Ready判定数 | - | - | - | - |
| Pass購入ボタンクリック数 | - | - | - | - |
| Pass決済完了数 | - | - | - | - |
| Onboarding完了数 | - | - | - | - |
| Pass購入ボタンクリック率 | - | - | - | - |
| Pass決済完了率 | - | - | - | - |
| Onboarding完了率 | - | - | - | - |

**ボトルネック特定**: どの指標が最も低いか？

**仮説立案**: なぜその指標が低いのか？

**施策実施**: どのような改善を行うか？

---

## 6. 改善フェーズの開始条件と、改善の範囲固定

### 6.1 最適化の目的（固定）

**Ready→Pass購入率を上げる**

Ready判定されたユーザーが、Pass購入ボタンをクリックし、決済完了する率を上げます。

**Pass購入→Onboarding完了率を上げる**

Pass購入したユーザーが、Onboarding 3タスクを完了する率を上げます。

**Ready割合を上げるのは目的ではありません**

Readyを増やして購入率が落ちたら、改善ではなく事故です。

### 6.2 改善の対象範囲（最初の20〜30件はここだけ）

#### やる

- **Ready結果ページの販売ブロック**（スクショ、順序、文言）
- **Evidence Packの見せ方**（上部の構造、具体の出し方）
- **Onboardingの摩擦**（3タスクが詰まる箇所の削減）
- **Fit Gateの質問文言の明確化**（意味が取れない質問の修正）

#### やらない

- 質問数の増加
- 新機能追加
- 価格変更
- 友人導線の再開

**理由**: 要因を1つに絞らないと、改善の効果が観測できなくなります。

---

## 7. トラブルシューティング

### 問題: イベントが発火しない

**原因**: Umamiスクリプトが正しく読み込まれていない、またはイベント名が間違っている

**解決方法**:
1. ブラウザのコンソールでUmamiスクリプトが読み込まれているか確認
2. `client/src/lib/analytics.ts`でイベント名が正しいか確認
3. Umami管理画面の「Events」タブでイベントが記録されているか確認

### 問題: ダッシュボードに数値が表示されない

**原因**: ウィジェット設定が間違っている、またはイベントが発火していない

**解決方法**:
1. ウィジェット設定でイベント名が正しいか確認
2. Umami管理画面の「Events」タブでイベントが記録されているか確認
3. 日付範囲を調整して、イベントが記録されている期間を確認

### 問題: Custom Metricの計算が合わない

**原因**: 計算式が間違っている、または分母が0になっている

**解決方法**:
1. 計算式を確認（例: `(fitgate_started / lp_hero_cta_clicked) * 100`）
2. 分母が0の場合は、イベントが発火していないことを確認
3. 必要に応じて計算式を修正

### 問題: 友人導線イベントがダッシュボードに表示される

**原因**: ダッシュボード作成時に友人導線イベントを追加してしまった

**解決方法**:
1. Umami管理画面でダッシュボードを編集
2. 友人導線イベント（`invite_lp_view`、`invite_lp_cta_fitgate_clicked`など）を削除
3. 保存

---

## 8. 次のステップ

1. **Dashboard AとDashboard Bを作成**（このガイドに従って実施）
2. **ダッシュボードURLをこのドキュメントに追記**
3. **毎日数字を確認**（朝会や夕会で確認）
4. **週次レポートを開始**（毎週月曜日）
5. **20〜30件のFit Gateログが溜まったタイミングで改善施策を検討**

---

**作成者**: Manus AI  
**最終更新日**: 2024年12月19日
