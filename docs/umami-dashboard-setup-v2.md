# Umami ダッシュボード設定ガイド v2.0

**作成日**: 2024年12月19日  
**バージョン**: 2.0（公開ワンパス専用）  
**ステータス**: 友人導線イベントを除外、2枚固定

---

## 1. 方針

**公開ワンパス（公開LP→Fit Gate→Ready→Pass→Onboarding→App）の計測に特化します。**

友人紹介LP導線は「実装は残してよいが、提供はしない」方針のため、友人導線イベントはダッシュボードから完全に除外します。フィルタで隠すのではなく、そもそもダッシュボードに置きません。

---

## 2. ダッシュボード構成（2枚固定）

### Dashboard A: Acquisition Funnel

**目的**: 公開LPからFit Gate完了までのファネルを可視化

**対象イベント**:
- `lp_hero_cta_clicked`: Hero「適合チェックに進む」ボタンクリック
- `fitgate_started`: Fit Gateページ表示
- `fitgate_submitted`: Fit Gate回答送信

**ウィジェット構成**:

| ウィジェット名 | タイプ | 設定 |
|--------------|--------|------|
| LPユニークビジター数 | Unique Visitors | ページ: `/` |
| Hero CTAクリック数 | Event Count | イベント: `lp_hero_cta_clicked` |
| Fit Gate開始数 | Event Count | イベント: `fitgate_started` |
| Fit Gate完了数 | Event Count | イベント: `fitgate_submitted` |
| Hero CTA → Fit Gate開始率 | Custom Metric | `fitgate_started / lp_hero_cta_clicked * 100` |
| Fit Gate完了率 | Custom Metric | `fitgate_submitted / fitgate_started * 100` |

### Dashboard B: Revenue and Activation Funnel

**目的**: Fit Gate判定結果からPass購入、Onboarding完了までのファネルを可視化

**対象イベント**:
- `fitgate_result_ready`: Ready判定結果表示
- `pass_checkout_opened`: Pass購入ボタンクリック
- `pass_payment_success`: Pass決済完了
- `onboarding_completed`: Pass Onboarding 3タスク完了

**ウィジェット構成**:

| ウィジェット名 | タイプ | 設定 |
|--------------|--------|------|
| Ready判定数 | Event Count | イベント: `fitgate_result_ready` |
| Pass購入ボタンクリック数 | Event Count | イベント: `pass_checkout_opened` |
| Pass決済完了数 | Event Count | イベント: `pass_payment_success` |
| Onboarding完了数 | Event Count | イベント: `onboarding_completed` |
| Pass購入ボタンクリック率 | Custom Metric | `pass_checkout_opened / fitgate_result_ready * 100` |
| Pass決済完了率 | Custom Metric | `pass_payment_success / pass_checkout_opened * 100` |
| Onboarding完了率 | Custom Metric | `onboarding_completed / pass_payment_success * 100` |

---

## 3. 除外するイベント

以下のイベントは友人導線用のため、ダッシュボードに含めません：

- `fitgate_result_prep_near`: Prep Near判定結果表示
- `fitgate_result_prep_notyet`: Prep NotYet判定結果表示
- `prep_registered`: Prep Modeメール登録完了
- `invite_lp_view`: 友人紹介LPページ表示
- `invite_lp_cta_fitgate_clicked`: 友人紹介LP「適合チェックに進む」ボタンクリック

**理由**: 友人導線は母集団が別物で、公開導線の改善判断が歪むため。一本線が「勝手に回っている」状態を数値で確認してから、友人導線を別ファネルとしてローンチします。

---

## 4. ダッシュボード作成手順

### Step 1: Umami管理画面にログイン

1. Umami管理画面にアクセス
2. Exit Readiness OS LPのプロジェクトを選択

### Step 2: Dashboard A作成

1. 左メニューから「Dashboards」を選択
2. 「Create Dashboard」をクリック
3. ダッシュボード名: `Acquisition Funnel`
4. 以下のウィジェットを追加:
   - LPユニークビジター数（Unique Visitors, ページ: `/`）
   - Hero CTAクリック数（Event Count, イベント: `lp_hero_cta_clicked`）
   - Fit Gate開始数（Event Count, イベント: `fitgate_started`）
   - Fit Gate完了数（Event Count, イベント: `fitgate_submitted`）
   - Hero CTA → Fit Gate開始率（Custom Metric, `fitgate_started / lp_hero_cta_clicked * 100`）
   - Fit Gate完了率（Custom Metric, `fitgate_submitted / fitgate_started * 100`）

### Step 3: Dashboard B作成

1. 左メニューから「Dashboards」を選択
2. 「Create Dashboard」をクリック
3. ダッシュボード名: `Revenue and Activation Funnel`
4. 以下のウィジェットを追加:
   - Ready判定数（Event Count, イベント: `fitgate_result_ready`）
   - Pass購入ボタンクリック数（Event Count, イベント: `pass_checkout_opened`）
   - Pass決済完了数（Event Count, イベント: `pass_payment_success`）
   - Onboarding完了数（Event Count, イベント: `onboarding_completed`）
   - Pass購入ボタンクリック率（Custom Metric, `pass_checkout_opened / fitgate_result_ready * 100`）
   - Pass決済完了率（Custom Metric, `pass_payment_success / pass_checkout_opened * 100`）
   - Onboarding完了率（Custom Metric, `onboarding_completed / pass_payment_success * 100`）

### Step 4: ダッシュボードURLを記録

1. Dashboard AのURLをコピー
2. Dashboard BのURLをコピー
3. このドキュメントに追記:

**Dashboard A URL**: （未設定）

**Dashboard B URL**: （未設定）

---

## 5. 週次レポートフォーマット

毎週月曜日に以下の指標を確認し、改善施策を検討します。

### Acquisition Funnel（Dashboard A）

| 指標 | 今週 | 先週 | 変化率 |
|-----|------|------|--------|
| LPユニークビジター数 | - | - | - |
| Hero CTAクリック数 | - | - | - |
| Fit Gate開始数 | - | - | - |
| Fit Gate完了数 | - | - | - |
| Hero CTA → Fit Gate開始率 | - | - | - |
| Fit Gate完了率 | - | - | - |

### Revenue and Activation Funnel（Dashboard B）

| 指標 | 今週 | 先週 | 変化率 |
|-----|------|------|--------|
| Ready判定数 | - | - | - |
| Pass購入ボタンクリック数 | - | - | - |
| Pass決済完了数 | - | - | - |
| Onboarding完了数 | - | - | - |
| Pass購入ボタンクリック率 | - | - | - |
| Pass決済完了率 | - | - | - |
| Onboarding完了率 | - | - | - |

### 改善施策

- **ボトルネック特定**: どの指標が最も低いか？
- **仮説立案**: なぜその指標が低いのか？
- **施策実施**: どのような改善を行うか？
- **効果測定**: 次週の指標で効果を確認

---

## 6. トラブルシューティング

### イベントが発火しない

**原因**: Umamiスクリプトが正しく読み込まれていない、またはイベント名が間違っている

**解決方法**:
1. ブラウザのコンソールでUmamiスクリプトが読み込まれているか確認
2. `client/src/lib/analytics.ts`でイベント名が正しいか確認
3. Umami管理画面の「Events」タブでイベントが記録されているか確認

### ダッシュボードに数値が表示されない

**原因**: ウィジェット設定が間違っている、またはイベントが発火していない

**解決方法**:
1. ウィジェット設定でイベント名が正しいか確認
2. Umami管理画面の「Events」タブでイベントが記録されているか確認
3. 日付範囲を調整して、イベントが記録されている期間を確認

### Custom Metricの計算が合わない

**原因**: 計算式が間違っている、または分母が0になっている

**解決方法**:
1. 計算式を確認（例: `fitgate_started / lp_hero_cta_clicked * 100`）
2. 分母が0の場合は、イベントが発火していないことを確認
3. 必要に応じて計算式を修正

---

## 7. 次のステップ

1. **Umami管理画面でDashboard AとBを作成**（ユーザーが実施）
2. **ダッシュボードURLをこのドキュメントに追記**
3. **週次レポートを開始**（毎週月曜日）
4. **公開ワンパスが安定したら、友人導線を別ファネルとして再開**

---

**作成者**: Manus AI  
**最終更新日**: 2024年12月19日
