# Fit Gate ログ可視化準備（データ溜まるまで触らない）

## 概要

Fit Gateの判定ロジックは、**20〜30件分の`FitGateResponses`が溜まるまで触らない**ことを原則とします。このドキュメントでは、ログをきれいに積むための準備と、データが溜まった後の可視化方法を定義します。

---

## 基本方針

### やること

1. **ログをきれいに積む**
   - `fitGateResponses` テーブルに回答データを確実に記録
   - `sessionId` の一意性を保証
   - `judgmentResult` の正確性を確保

2. **可視化の準備**
   - スプレッドシートのテンプレートを作成
   - データエクスポート方法を確立
   - 分析項目を定義

### やらないこと

1. **判定ロジックの変更**
   - 20〜30件溜まるまで、`server/routers.ts` の判定ロジックに手を入れない
   - 年収・資産の閾値を変更しない
   - 質問項目を追加・削除しない

2. **データの手動修正**
   - `fitGateResponses` テーブルのデータを手動で修正しない
   - `judgmentResult` を後から変更しない

---

## ログの蓄積状況確認

### 現在の件数を確認

**方法A: Manus Management UI（推奨）**
1. Management UI → Database パネルを開く
2. `fitGateResponses` テーブルを選択
3. レコード数を確認

**方法B: SQL直接クエリ**
```sql
SELECT COUNT(*) AS total_count FROM fitGateResponses;
```

### 判定結果の分布を確認

```sql
SELECT 
  judgmentResult,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM fitGateResponses), 2) AS percentage
FROM fitGateResponses
GROUP BY judgmentResult;
```

**期待される分布（α期間中）:**
- Session解放：10〜20%
- Prep Mode推奨：30〜50%
- Pass：30〜60%

---

## スプレッドシート可視化テンプレート

### シート1: Raw Data（生データ）

**カラム構成:**

| sessionId | email | q1 | q2 | q3 | q4 | q5 | q6 | q7 | q8 | q9 | q10 | q11 | q12 | token | result | sessionDone | createdAt |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fg_1234... | user@example.com | 1か月以内 | 賃貸 | 6000 | 1500-2000 | 1000-3000 | できる | ... | ... | ... | ... | true | ... | - | session | false | 2024-01-01 |

**データエクスポート方法:**

**方法A: Manus Management UI（推奨）**
1. Management UI → Database パネルを開く
2. `fitGateResponses` テーブルを選択
3. 「Export」ボタンをクリック
4. CSV形式でダウンロード
5. Google Sheetsにインポート

**方法B: SQL直接クエリ**
```sql
SELECT 
  sessionId,
  email,
  q1DecisionDeadline AS q1,
  q2HousingStatus AS q2,
  q3PriceRange AS q3,
  q4IncomeRange AS q4,
  q5AssetRange AS q5,
  q6NumberInputTolerance AS q6,
  q7CareerChange AS q7,
  q8LifeEvent AS q8,
  q9CurrentQuestion AS q9,
  q10PreferredApproach AS q10,
  q11PrivacyConsent AS q11,
  q12BudgetSense AS q12,
  invitationToken AS token,
  judgmentResult AS result,
  sessionDone,
  createdAt
FROM fitGateResponses
ORDER BY createdAt DESC;
```

---

### シート2: 判定結果サマリ

**目的:** 判定結果の分布を確認し、ロジックの妥当性を評価

**テーブル構成:**

| 判定結果 | 件数 | 割合 | 目標範囲 | 評価 |
|---|---|---|---|---|
| Session解放 | 5 | 16.7% | 10〜20% | ✅ |
| Prep Mode推奨 | 12 | 40.0% | 30〜50% | ✅ |
| Pass | 13 | 43.3% | 30〜60% | ✅ |
| **合計** | **30** | **100%** | - | - |

**計算式（Google Sheets）:**
```
件数: =COUNTIF(Raw Data!P:P, "session")
割合: =B2 / SUM(B$2:B$4) * 100
評価: =IF(AND(C2 >= 10, C2 <= 20), "✅", "⚠️")
```

---

### シート3: 質問別集計

**目的:** 各質問の回答分布を確認し、質問項目の有効性を評価

#### Q4: 世帯年収レンジ

| 選択肢 | 件数 | 割合 | Session解放数 | Prep Mode推奨数 | Pass数 |
|---|---|---|---|---|---|
| 1000-1500 | 3 | 10% | 0 | 1 | 2 |
| 1500-2000 | 12 | 40% | 2 | 5 | 5 |
| 2000-3000 | 10 | 33.3% | 2 | 4 | 4 |
| 3000以上 | 5 | 16.7% | 1 | 2 | 2 |

**計算式（Google Sheets）:**
```
件数: =COUNTIF(Raw Data!D:D, "1000-1500")
割合: =B2 / SUM(B$2:B$5) * 100
Session解放数: =COUNTIFS(Raw Data!D:D, "1000-1500", Raw Data!P:P, "session")
```

#### Q5: 金融資産レンジ

| 選択肢 | 件数 | 割合 | Session解放数 | Prep Mode推奨数 | Pass数 |
|---|---|---|---|---|---|
| 500未満 | 2 | 6.7% | 0 | 0 | 2 |
| 500-1000 | 5 | 16.7% | 0 | 2 | 3 |
| 1000-3000 | 15 | 50% | 3 | 7 | 5 |
| 3000-5000 | 6 | 20% | 1 | 2 | 3 |
| 5000以上 | 2 | 6.7% | 1 | 1 | 0 |

#### Q6: 数字入力の許容度

| 選択肢 | 件数 | 割合 | Session解放数 | Prep Mode推奨数 | Pass数 |
|---|---|---|---|---|---|
| できる | 18 | 60% | 4 | 8 | 6 |
| 一部できる | 8 | 26.7% | 1 | 3 | 4 |
| できない | 4 | 13.3% | 0 | 1 | 3 |

---

### シート4: クロス集計（年収 × 資産 × 判定結果）

**目的:** 年収と資産の組み合わせによる判定結果の傾向を把握

| 年収レンジ | 資産レンジ | Session解放 | Prep Mode推奨 | Pass | 合計 |
|---|---|---|---|---|---|
| 1500-2000 | 1000-3000 | 2 | 3 | 2 | 7 |
| 1500-2000 | 3000-5000 | 0 | 1 | 1 | 2 |
| 2000-3000 | 1000-3000 | 1 | 3 | 2 | 6 |
| 2000-3000 | 3000-5000 | 1 | 1 | 1 | 3 |
| 3000以上 | 3000-5000 | 0 | 1 | 0 | 1 |
| 3000以上 | 5000以上 | 1 | 1 | 0 | 2 |

**計算式（Google Sheets）:**
```
Session解放: =COUNTIFS(Raw Data!D:D, "1500-2000", Raw Data!E:E, "1000-3000", Raw Data!P:P, "session")
```

---

### シート5: 時系列推移

**目的:** 判定結果の時系列推移を確認し、季節性や傾向を把握

| 週 | 回答数 | Session解放 | Prep Mode推奨 | Pass | Session解放率 |
|---|---|---|---|---|---|
| 2024-W01 | 5 | 1 | 2 | 2 | 20% |
| 2024-W02 | 8 | 1 | 3 | 4 | 12.5% |
| 2024-W03 | 7 | 2 | 3 | 2 | 28.6% |
| 2024-W04 | 10 | 1 | 4 | 5 | 10% |

**計算式（Google Sheets）:**
```
週: =WEEKNUM(Raw Data!Q2)
回答数: =COUNTIF(Raw Data!Q:Q, WEEKNUM(A2))
Session解放率: =C2 / B2 * 100
```

---

## データが20〜30件溜まった後の分析手順

### ステップ1: データエクスポート

1. Manus Management UI → Database パネルで `fitGateResponses` テーブルをCSVエクスポート
2. Google Sheetsにインポート
3. 上記のシート2〜5を作成

### ステップ2: 判定結果の分布確認

1. シート2「判定結果サマリ」を確認
2. 各判定結果の割合が目標範囲内か評価
3. 目標範囲外の場合、原因を分析

**分析観点:**
- Session解放率が5%未満 → 判定ロジックが厳しすぎる可能性
- Pass率が70%以上 → ターゲット層以外の流入が多い可能性

### ステップ3: 質問別集計の確認

1. シート3「質問別集計」を確認
2. 各質問の回答分布を確認
3. 判定結果との相関を分析

**分析観点:**
- Q4（年収）とQ5（資産）の閾値が適切か
- Q6（数字入力）が判定に与える影響
- Q7〜Q10が判定に活用できるか

### ステップ4: クロス集計の確認

1. シート4「クロス集計」を確認
2. 年収と資産の組み合わせによる判定結果の傾向を把握
3. 閾値の調整案を検討

**調整案の例:**
- 年収1,500〜2,000万 × 資産1,000〜3,000万 → Session解放率が高い場合、この組み合わせを優遇
- 年収2,000〜3,000万 × 資産500〜1,000万 → Pass率が高い場合、資産閾値を引き下げ

### ステップ5: PdMとすり合わせ

1. 分析結果をNotionまたはスプレッドシートにまとめる
2. PdMと判定ロジックの調整案をすり合わせ
3. 調整案を確定

### ステップ6: 判定ロジックの調整実装

1. `server/routers.ts` の判定ロジックを修正
2. 開発環境でテスト
3. 本番デプロイ

---

## 注意事項

### データの品質管理

1. **重複データの確認**
   - 同じメールアドレスで複数回回答している場合、最新のデータのみを使用
   ```sql
   SELECT email, COUNT(*) AS count
   FROM fitGateResponses
   GROUP BY email
   HAVING count > 1;
   ```

2. **不正データの確認**
   - `q11PrivacyConsent` が `false` のデータは除外
   - `judgmentResult` が `NULL` のデータは除外

3. **テストデータの除外**
   - 開発環境でのテストデータは除外
   - 特定のメールアドレス（例：`test@example.com`）は除外

---

## 判定ロジック調整の基準

### 調整が必要な場合

1. **Session解放率が5%未満**
   - 閾値が厳しすぎる可能性
   - 年収・資産の閾値を引き下げ

2. **Pass率が70%以上**
   - ターゲット層以外の流入が多い可能性
   - 広告・SNSのターゲティング見直し
   - または、Prep Mode推奨の閾値を引き下げ

3. **Prep Mode推奨率が20%未満**
   - Prep Modeの価値が伝わっていない可能性
   - LPのコピー見直し
   - または、Prep Mode推奨の閾値を引き上げ

### 調整が不要な場合

1. **各判定結果の割合が目標範囲内**
   - 現状維持

2. **ユーザーからのフィードバックが良好**
   - 判定結果に納得しているユーザーが多い場合、現状維持

---

## 関連ドキュメント

- [Fit Gateログ設計](./fitgate-log-design.md)
- [Umamiダッシュボード運用ガイド](./analytics.md)
- [1on1セッション実行フロー](./session-execution-flow.md)

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|---|---|---|
| 2024-12-17 | 初版作成 | Dev Team |
