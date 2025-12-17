# Analytics - Umami ダッシュボード運用ガイド

## 概要

Exit Readiness OS LP v5のユーザー行動を計測するためのUmamiダッシュボード運用ガイドです。LP訪問からFit Gate、Prep Mode登録までの1本のファネルを1画面で把握できるようにします。

---

## ダッシュボードURL

**LP Funnel Dashboard（運用品）:**
- URL: `[ここにUmamiダッシュボードのURLを追記してください]`
- アクセス権限: LP Team / Dev / PdM
- 更新頻度: リアルタイム

---

## ダッシュボード構成

### 期間設定

- **直近7日間** - デフォルト表示、週次の進捗確認用
- **直近30日間** - 月次レポート用
- **カスタム期間** - 特定期間の分析用（例：キャンペーン期間中）

### 主要指標（1画面で表示）

#### 1. LPユニークビジター数（Unique Visitors）

**定義:** トップページ（`/`）を訪問したユニークユーザー数

**計算方法:** Umamiの標準指標（Page Views / Unique Visitors）

**目標値（α期間中）:**
- 直近7日間：50〜100 UV
- 直近30日間：200〜500 UV

**ウィジェット設定:**
```
Type: Metrics
Metric: Unique Visitors
Filter: Path = /
Time Range: Last 7 days / Last 30 days
```

---

#### 2. Hero CTA クリック率

**定義:** LP訪問者のうち、Hero「適合チェックに進む」ボタンをクリックした割合

**計算式:**
```
Hero CTA クリック率 = (lp_hero_cta_clicked イベント数) / (LPユニークビジター数) × 100%
```

**目標値（α期間中）:**
- 20〜30%（業界標準：15〜25%）

**ウィジェット設定:**
```
Type: Events
Event: lp_hero_cta_clicked
Time Range: Last 7 days / Last 30 days
```

**改善アクション:**
- クリック率が15%未満の場合：Heroコピー・CTAボタンのデザイン見直し
- クリック率が30%以上の場合：現状維持

---

#### 3. Fit Gate 開始率

**定義:** Hero CTAをクリックしたユーザーのうち、実際にFit Gateページを開いた割合

**計算式:**
```
Fit Gate 開始率 = (fitgate_started イベント数) / (lp_hero_cta_clicked イベント数) × 100%
```

**目標値（α期間中）:**
- 80〜95%（ほとんどのユーザーがFit Gateページに到達すべき）

**ウィジェット設定:**
```
Type: Events
Event: fitgate_started
Time Range: Last 7 days / Last 30 days
```

**改善アクション:**
- 開始率が80%未満の場合：ページ遷移の問題（リンク切れ、読み込み遅延）を確認

---

#### 4. Fit Gate 完了率

**定義:** Fit Gateページを開いたユーザーのうち、12問すべてに回答して送信した割合

**計算式:**
```
Fit Gate 完了率 = (fitgate_submitted イベント数) / (fitgate_started イベント数) × 100%
```

**目標値（α期間中）:**
- 40〜60%（業界標準：30〜50%）

**ウィジェット設定:**
```
Type: Events
Event: fitgate_submitted
Time Range: Last 7 days / Last 30 days
```

**改善アクション:**
- 完了率が30%未満の場合：質問数の削減、UI改善、プログレスバー追加を検討
- 完了率が60%以上の場合：現状維持

---

#### 5. Session / Prep / NotYet 比率

**定義:** Fit Gate送信者のうち、各判定結果（Session解放 / Prep Mode推奨 / Pass）の割合

**計算式:**
```
Session解放率 = (fitgate_result_session イベント数) / (fitgate_submitted イベント数) × 100%
Prep Mode推奨率 = (fitgate_result_prep イベント数) / (fitgate_submitted イベント数) × 100%
Pass率 = (fitgate_result_notyet イベント数) / (fitgate_submitted イベント数) × 100%
```

**目標値（α期間中）:**
- Session解放率：10〜20%（招待トークン利用者＋高年収・高資産層）
- Prep Mode推奨率：30〜50%（ターゲット層だが準備不足）
- Pass率：30〜60%（ターゲット外）

**ウィジェット設定:**
```
Type: Events (Pie Chart)
Events: fitgate_result_session, fitgate_result_prep, fitgate_result_notyet
Time Range: Last 7 days / Last 30 days
```

**改善アクション:**
- Session解放率が5%未満の場合：判定ロジックが厳しすぎる可能性（20〜30件溜まった後に調整）
- Pass率が70%以上の場合：ターゲット層以外の流入が多い（広告・SNSのターゲティング見直し）

---

#### 6. Prep Mode 登録率

**定義:** Prep Mode推奨またはPass判定を受けたユーザーのうち、実際にメール登録した割合

**計算式:**
```
Prep Mode 登録率 = (prep_registered イベント数) / (fitgate_result_prep + fitgate_result_notyet イベント数) × 100%
```

**目標値（α期間中）:**
- 20〜40%（業界標準：15〜30%）

**ウィジェット設定:**
```
Type: Events
Event: prep_registered
Time Range: Last 7 days / Last 30 days
```

**改善アクション:**
- 登録率が15%未満の場合：Prep Modeページのコピー・CTA見直し
- 登録率が40%以上の場合：現状維持

---

## ファネル全体の可視化

### ファネル図（理想形）

```
LPユニークビジター数: 100人
  ↓ (Hero CTAクリック率: 25%)
Hero CTAクリック: 25人
  ↓ (Fit Gate開始率: 90%)
Fit Gate開始: 22人
  ↓ (Fit Gate完了率: 50%)
Fit Gate送信: 11人
  ↓ (判定結果内訳)
  ├─ Session解放: 2人 (18%)
  ├─ Prep Mode推奨: 4人 (36%)
  └─ Pass: 5人 (46%)
      ↓ (Prep Mode登録率: 30%)
      Prep Mode登録: 3人
```

### ファネル効率の評価

**総合コンバージョン率（LP訪問 → Prep Mode登録）:**
```
総合CV率 = (prep_registered イベント数) / (LPユニークビジター数) × 100%
```

**目標値（α期間中）:**
- 3〜5%（100人訪問 → 3〜5人がPrep Mode登録）

---

## Umamiダッシュボード作成手順

### ステップ1: ダッシュボード作成

1. Umamiにログイン
2. 左メニュー「Dashboards」→「Create Dashboard」
3. ダッシュボード名：`Exit Readiness OS - LP Funnel`
4. 説明：`LP訪問からFit Gate、Prep Mode登録までのファネル可視化`

### ステップ2: ウィジェット追加

以下のウィジェットを順番に追加：

**ウィジェット1: LPユニークビジター数**
```
Type: Metrics
Title: LPユニークビジター数
Metric: Unique Visitors
Filter: Path = /
Time Range: Last 7 days
```

**ウィジェット2: Hero CTAクリック数**
```
Type: Events (Number)
Title: Hero CTAクリック数
Event: lp_hero_cta_clicked
Time Range: Last 7 days
```

**ウィジェット3: Fit Gate開始数**
```
Type: Events (Number)
Title: Fit Gate開始数
Event: fitgate_started
Time Range: Last 7 days
```

**ウィジェット4: Fit Gate送信数**
```
Type: Events (Number)
Title: Fit Gate送信数
Event: fitgate_submitted
Time Range: Last 7 days
```

**ウィジェット5: 判定結果内訳（円グラフ）**
```
Type: Events (Pie Chart)
Title: 判定結果内訳
Events: fitgate_result_session, fitgate_result_prep, fitgate_result_notyet
Time Range: Last 7 days
```

**ウィジェット6: Prep Mode登録数**
```
Type: Events (Number)
Title: Prep Mode登録数
Event: prep_registered
Time Range: Last 7 days
```

**ウィジェット7: ファネル推移（折れ線グラフ）**
```
Type: Events (Line Chart)
Title: ファネル推移（日別）
Events: lp_hero_cta_clicked, fitgate_started, fitgate_submitted, prep_registered
Time Range: Last 7 days
```

### ステップ3: レイアウト調整

- ウィジェット1〜6を2列×3行で配置
- ウィジェット7を最下部に横幅いっぱいで配置

### ステップ4: ダッシュボードURL取得

1. ダッシュボード右上の「Share」ボタンをクリック
2. 共有URLをコピー
3. このドキュメントの冒頭「ダッシュボードURL」に貼り付け

---

## 週次レポートの作成方法

### レポート項目

1. **LPユニークビジター数** - 前週比（増減率）
2. **Hero CTAクリック率** - 目標値（20〜30%）との比較
3. **Fit Gate完了率** - 目標値（40〜60%）との比較
4. **判定結果内訳** - Session / Prep / NotYet の比率
5. **Prep Mode登録率** - 目標値（20〜40%）との比較
6. **総合コンバージョン率** - 目標値（3〜5%）との比較

### レポートフォーマット（例）

```
【Exit Readiness OS LP - 週次レポート】
期間：2024年1月1日〜1月7日

■ 主要指標
- LPユニークビジター数：85人（前週比 +12%）
- Hero CTAクリック率：23%（目標：20〜30%）✅
- Fit Gate完了率：48%（目標：40〜60%）✅
- Prep Mode登録率：28%（目標：20〜40%）✅
- 総合コンバージョン率：3.5%（目標：3〜5%）✅

■ 判定結果内訳
- Session解放：3人（15%）
- Prep Mode推奨：8人（40%）
- Pass：9人（45%）

■ 改善アクション
- Hero CTAクリック率が目標範囲内のため、現状維持
- Fit Gate完了率が目標範囲内のため、現状維持
- Session解放率が15%と目標範囲内（10〜20%）のため、判定ロジックは適切
```

---

## トラブルシューティング

### イベントが発火しない場合

1. **開発環境でconsole.logを確認**
   - `client/src/lib/analytics.ts` の `trackEvent` 関数内に `console.log` を追加
   - ブラウザのコンソールでイベント送信を確認

2. **Umami設定を確認**
   - Umamiダッシュボードで「Settings」→「Tracking Code」を確認
   - `client/index.html` に正しいトラッキングコードが埋め込まれているか確認

3. **ネットワークエラーを確認**
   - ブラウザの開発者ツール「Network」タブでUmami APIへのリクエストを確認
   - CORS エラーやタイムアウトがないか確認

### ダッシュボードが表示されない場合

1. **アクセス権限を確認**
   - Umamiダッシュボードで「Settings」→「Users」を確認
   - LP Team / Dev / PdM がダッシュボードへのアクセス権限を持っているか確認

2. **ウィジェットの設定を確認**
   - ウィジェットのフィルター（Path, Event名）が正しいか確認
   - 期間設定が適切か確認

---

## 今後の改善案

### 自動レポート生成

- **Umami API連携** - 週次レポートを自動生成してSlack / メールに送信
- **Google Sheets連携** - ダッシュボードデータをスプレッドシートに自動エクスポート

### セグメント分析

- **流入元別分析** - SNS / note / DM からの流入別にコンバージョン率を比較
- **デバイス別分析** - PC / スマホ別にFit Gate完了率を比較

### A/Bテスト

- **Hero CTAコピー変更** - 「適合チェックに進む」vs「無料で診断する」
- **Fit Gate質問数** - 12問 vs 8問（簡易版）

---

## 参考リンク

- [Umami公式ドキュメント](https://umami.is/docs)
- [Umami API Reference](https://umami.is/docs/api)
- [Umami Events Tracking](https://umami.is/docs/track-events)
- [Umami Dashboards](https://umami.is/docs/dashboards)

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2024-12-17 | 初版作成 | Dev Team |
| - | ダッシュボードURL追記予定 | LP Team |
