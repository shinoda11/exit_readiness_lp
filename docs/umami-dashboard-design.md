# Umami Analytics ダッシュボード設計書

## 概要

Exit Readiness OS LP v5のユーザー行動を可視化するためのUmamiダッシュボード設計書です。LP訪問からFit Gate、Prep Mode登録までのファネルを1画面で把握できるようにします。

---

## 計測イベント一覧

### 実装済みイベント（7つ）

| イベント名 | 発火タイミング | 実装場所 | 備考 |
|---|---|---|---|
| `lp_hero_cta_clicked` | Hero「適合チェックに進む」ボタンクリック | `Home.tsx` (Hero + CTA Section) | 2箇所で発火 |
| `fitgate_started` | 適合チェックページ表示 | `FitGate.tsx` (useEffect) | ページ読み込み時 |
| `fitgate_submitted` | 適合チェック送信 | `FitGate.tsx` (onSubmit) | フォーム送信時 |
| `fitgate_result_session` | 判定結果：Session解放 | `FitResult.tsx` (useEffect) | result=session |
| `fitgate_result_prep` | 判定結果：Prep Mode | `FitResult.tsx` (useEffect) | result=prep |
| `fitgate_result_notyet` | 判定結果：Pass（まだ早い） | `FitResult.tsx` (useEffect) | result=pass |
| `prep_registered` | Prep Modeメール登録完了 | `PrepMode.tsx` (onSubmit) | メール登録時 |

### 未実装イベント（将来的に追加可能）

- `session_cta_clicked` - 1on1セッション申込CTA（現在は紹介制のため不要）
- `session_form_submitted` - 1on1セッション申込フォーム送信（現在は紹介制のため不要）

---

## ダッシュボード構成

### 1. 概要セクション（Overview）

**期間：** 過去7日間（デフォルト）、過去30日間、カスタム期間

**主要指標：**

- **LP訪問数（Page Views）** - トップページ（`/`）のPV数
- **ユニークビジター数（Unique Visitors）** - トップページのUV数
- **Hero CTA クリック数** - `lp_hero_cta_clicked` イベント数
- **Fit Gate 開始数** - `fitgate_started` イベント数
- **Fit Gate 送信数** - `fitgate_submitted` イベント数
- **Prep Mode 登録数** - `prep_registered` イベント数

### 2. ファネル可視化（Funnel Visualization）

```
LP訪問
  ↓ (Hero CTA → Fit Gate Start率)
Fit Gate 開始
  ↓ (Fit Gate 完了率)
Fit Gate 送信
  ↓ (判定結果内訳)
  ├─ Session解放
  ├─ Prep Mode推奨
  └─ Not Yet（まだ早い）
      ↓ (Prep Mode登録率)
      Prep Mode登録
```

**計算式：**

- **Hero CTA → Fit Gate Start率** = `fitgate_started` / `lp_hero_cta_clicked` × 100%
- **Fit Gate 完了率** = `fitgate_submitted` / `fitgate_started` × 100%
- **Session解放率** = `fitgate_result_session` / `fitgate_submitted` × 100%
- **Prep Mode推奨率** = `fitgate_result_prep` / `fitgate_submitted` × 100%
- **Not Yet率** = `fitgate_result_notyet` / `fitgate_submitted` × 100%
- **Prep Mode登録率** = `prep_registered` / (`fitgate_result_prep` + `fitgate_result_notyet`) × 100%

### 3. 判定結果内訳（Fit Gate Results Breakdown）

**円グラフまたは棒グラフ：**

- Session解放（`fitgate_result_session`）
- Prep Mode推奨（`fitgate_result_prep`）
- Not Yet（`fitgate_result_notyet`）

### 4. 時系列推移（Time Series）

**折れ線グラフ：**

- LP訪問数（日別）
- Fit Gate開始数（日別）
- Fit Gate送信数（日別）
- Prep Mode登録数（日別）

---

## Umamiでの設定方法

### ステップ1: イベント確認

Umamiダッシュボードで以下を確認：

1. 左メニュー「Events」をクリック
2. 実装済みイベント7つが表示されているか確認
3. 各イベントの発火数を確認

### ステップ2: カスタムダッシュボード作成

1. Umamiダッシュボードで「Dashboards」→「Create Dashboard」
2. ダッシュボード名：「Exit Readiness OS LP - Funnel」
3. 以下のウィジェットを追加：

**ウィジェット1: 主要指標（Metrics）**
- タイプ：Metrics
- 指標：Page Views, Unique Visitors
- フィルター：Path = `/`

**ウィジェット2: イベント数（Events Count）**
- タイプ：Events
- イベント：`lp_hero_cta_clicked`, `fitgate_started`, `fitgate_submitted`, `prep_registered`

**ウィジェット3: 判定結果内訳（Pie Chart）**
- タイプ：Events (Pie Chart)
- イベント：`fitgate_result_session`, `fitgate_result_prep`, `fitgate_result_notyet`

**ウィジェット4: 時系列推移（Line Chart）**
- タイプ：Events (Line Chart)
- イベント：`lp_hero_cta_clicked`, `fitgate_started`, `fitgate_submitted`, `prep_registered`
- 期間：過去7日間

### ステップ3: ファネル計算（手動またはスプレッドシート）

Umamiの標準機能ではファネル計算が自動化されていないため、以下の方法で対応：

**方法A: 手動計算**
- 各イベント数を確認し、Excelやスプレッドシートで計算

**方法B: Umami API経由でデータ取得**
- Umami APIを使用してイベントデータを取得
- Google SheetsやLooker Studioで可視化

---

## 命名規則の統一

現在の実装では以下の命名規則を使用：

- **スネークケース（snake_case）** - `lp_hero_cta_clicked`, `fitgate_started`
- **プレフィックス** - `lp_`, `fitgate_`, `prep_`

**推奨：** この命名規則を維持し、将来的なイベント追加時も統一する。

---

## 動作確認チェックリスト

- [ ] Umamiダッシュボードで7つのイベントが表示される
- [ ] 各イベントが正しいタイミングで発火している（開発環境でconsole.log確認）
- [ ] LP専用ダッシュボードが作成されている
- [ ] ファネルの各ステップの数値が確認できる
- [ ] 判定結果内訳（Session/Prep/NotYet）が可視化されている

---

## 今後の改善案

1. **Umami API統合** - 自動ファネル計算とリアルタイム可視化
2. **A/Bテスト** - Hero CTAのコピー変更による効果測定
3. **セグメント分析** - 流入元別（SNS/note/DM）のコンバージョン率比較
4. **リテンション分析** - Prep Mode登録者の再訪問率測定

---

## 参考リンク

- [Umami公式ドキュメント](https://umami.is/docs)
- [Umami API Reference](https://umami.is/docs/api)
- [Umami Events Tracking](https://umami.is/docs/track-events)
