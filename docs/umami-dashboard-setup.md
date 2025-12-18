# Umami ダッシュボード設定ガイド

**京都モデル v0.3.1 仕様準拠**

---

## イベント名の固定

以下のイベント名を使用してください。これらは`client/src/lib/analytics.ts`の`AnalyticsEvents`で定義されています。

### Landing Page
- `lp_view`: LPページビュー
- `lp_hero_cta_clicked`: ヒーローセクションのCTAクリック

### Fit Gate
- `fitgate_started`: Fit Gate開始
- `fitgate_submitted`: Fit Gate送信
- `fitgate_result_ready`: Ready結果表示（Pass推奨）
- `fitgate_result_prep_near`: Prep Near結果表示（準備不足だが近い）
- `fitgate_result_prep_notyet`: Prep NotYet結果表示（時期尚早）
- `fitgate_result_session_unlocked`: Session Unlocked結果表示（招待トークン有効）

### Pass
- `pass_checkout_opened`: Pass決済ページ表示
- `pass_payment_success`: Pass決済成功

### Onboarding
- `onboarding_completed`: Onboarding完了

### Upgrade
- `upgrade_request_submitted`: Upgrade申請送信

---

## ダッシュボード構成

### Dashboard A: Acquisition Funnel（獲得ファネル）

**目的**: LP訪問からFit Gate送信までの流れを可視化

**表示イベント**:
1. `lp_view` → LP訪問数
2. `lp_hero_cta_clicked` → ヒーローCTAクリック数
3. `fitgate_started` → Fit Gate開始数
4. `fitgate_submitted` → Fit Gate送信数

**推奨ビジュアライゼーション**:
- Funnel Chart（ファネルチャート）
- Conversion Rate（各ステップの転換率）

**KPI**:
- LP → Fit Gate開始率
- Fit Gate開始 → 送信率

---

### Dashboard B: Revenue and Activation Funnel（収益とActivationファネル）

**目的**: Fit Gate結果からPass購入、Onboarding完了までの流れを可視化

**表示イベント**:
1. `fitgate_result_ready` → Ready結果表示数
2. `pass_checkout_opened` → Pass決済ページ表示数
3. `pass_payment_success` → Pass決済成功数
4. `onboarding_completed` → Onboarding完了数

**推奨ビジュアライゼーション**:
- Funnel Chart（ファネルチャート）
- Conversion Rate（各ステップの転換率）

**KPI**:
- Ready → Pass購入率
- Pass購入 → Onboarding完了率

---

## 補足ダッシュボード（オプション）

### Dashboard C: Prep Mode分析

**目的**: Prep ModeのNear/NotYet分類を可視化

**表示イベント**:
1. `fitgate_result_prep_near` → Prep Near結果表示数
2. `fitgate_result_prep_notyet` → Prep NotYet結果表示数

**KPI**:
- Prep Near割合
- Prep NotYet割合
- Prep Near → 再診断率（今後実装）

---

### Dashboard D: Session Unlock分析

**目的**: Session Unlock（招待トークン）の利用状況を可視化

**表示イベント**:
1. `fitgate_result_session_unlocked` → Session Unlocked結果表示数
2. `upgrade_request_submitted` → Upgrade申請送信数

**KPI**:
- 招待トークン利用率
- Upgrade申請率

---

## Umamiでのダッシュボード作成手順

### 1. Umamiにログイン

Umami管理画面にアクセスし、ログインします。

### 2. ダッシュボードを作成

1. 左メニューから「Dashboards」を選択
2. 「Create Dashboard」をクリック
3. ダッシュボード名を入力（例: "Dashboard A: Acquisition Funnel"）
4. 「Create」をクリック

### 3. イベントを追加

1. 作成したダッシュボードを開く
2. 「Add Widget」をクリック
3. Widget Typeで「Funnel」を選択
4. イベント名を順番に追加（例: `lp_view`, `lp_hero_cta_clicked`, `fitgate_started`, `fitgate_submitted`）
5. 「Save」をクリック

### 4. Conversion Rateを追加

1. 「Add Widget」をクリック
2. Widget Typeで「Metric」を選択
3. Metricで「Conversion Rate」を選択
4. 開始イベントと終了イベントを選択（例: `lp_view` → `fitgate_submitted`）
5. 「Save」をクリック

---

## 重要な注意事項

### イベント名の固定

- **絶対に変更しないでください**: イベント名を変更すると、過去のデータとの比較ができなくなります
- **Deprecatedイベントは使用しないでください**: `fitgate_result_prep`や`fitgate_result_notyet`は廃止されました

### 計測の解釈ルール

> **Ready率を上げることが目的ではない**
> 
> 目的は **Ready→Pass購入率** と **Pass購入→Onboarding完了率** を上げること

- Prep Nearが増えても、Ready→Pass購入率が落ちたら改悪
- Ready率が下がっても、Ready→Pass購入率が上がれば改善

---

## ダッシュボードの見方（毎日5分チェック）

### 毎日確認すべき3つの数字

1. **Ready → Pass購入率**: 適合者が実際に購入しているか
2. **Pass購入 → Onboarding完了率**: 購入者が価値体験に到達しているか
3. **Prep Near割合**: 準備不足だが近い人の割合（将来の売上の種）

### 異常検知

- Ready → Pass購入率が急落 → 決済導線の問題
- Pass購入 → Onboarding完了率が急落 → Onboarding体験の問題
- Prep NotYet割合が急増 → 流入チャネルの質が低下

---

## トラブルシューティング

### イベントが記録されない

1. `client/index.html`にUmami scriptが正しく挿入されているか確認
2. `trackEvent()`が正しく呼ばれているか、ブラウザのコンソールで確認（DEVモードではログが出力される）
3. Umami管理画面で「Real-time」を開き、リアルタイムでイベントが記録されているか確認

### ダッシュボードにデータが表示されない

1. イベント名が正しいか確認（大文字小文字を含む）
2. 日付範囲が正しいか確認
3. フィルター条件が正しいか確認

---

## 次のステップ

1. Dashboard AとBを作成し、毎日5分チェックする習慣をつける
2. 1週間分のデータが溜まったら、ボトルネックを特定する
3. ボトルネックに対して仮説を立て、改善施策を実施する
4. 改善施策の効果を計測し、PDCAを回す

---

## 参考資料

- [Umami公式ドキュメント](https://umami.is/docs)
- [京都モデル v0.3.1 Distribution Design Spec](./distribution-design-spec.md)
- [Webhook冪等性テスト結果](./webhook-idempotency-test-results.md)
