# Fit Gate ログ設計書

## 概要

Fit Gateの回答データを記録し、将来的な判定ロジック調整に活用するためのログ設計書です。20〜30件の回答データが溜まった時点で、Prep/Pass/Sessionの分岐閾値を最適化するためのデータ分析を行います。

---

## データベーステーブル

### fitGateResponses テーブル

Fit Gateの12問の回答と判定結果を保存するテーブルです。

**テーブル名:** `fitGateResponses`

**カラム一覧:**

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | INT | NOT NULL | AUTO_INCREMENT | 主キー |
| `sessionId` | VARCHAR(64) | NOT NULL | - | セッションID（`fg_{timestamp}_{random}`形式） |
| `email` | VARCHAR(320) | NULL | - | メールアドレス（任意） |
| `q1DecisionDeadline` | VARCHAR(64) | NULL | - | Q1: 意思決定期限 |
| `q2HousingStatus` | VARCHAR(64) | NULL | - | Q2: 現在の住宅状況 |
| `q3PriceRange` | VARCHAR(64) | NULL | - | Q3: 物件価格帯 |
| `q4IncomeRange` | VARCHAR(64) | NULL | - | Q4: 世帯年収レンジ |
| `q5AssetRange` | VARCHAR(64) | NULL | - | Q5: 金融資産レンジ |
| `q6NumberInputTolerance` | VARCHAR(128) | NULL | - | Q6: 数字入力の許容度 |
| `q7CareerChange` | VARCHAR(128) | NULL | - | Q7: キャリア変更の可能性 |
| `q8LifeEvent` | VARCHAR(128) | NULL | - | Q8: ライフイベント |
| `q9CurrentQuestion` | VARCHAR(255) | NULL | - | Q9: 現在の疑問 |
| `q10PreferredApproach` | VARCHAR(128) | NULL | - | Q10: 好みのアプローチ |
| `q11PrivacyConsent` | BOOLEAN | NOT NULL | - | Q11: プライバシー同意 |
| `q12BudgetSense` | VARCHAR(64) | NULL | - | Q12: 予算感覚 |
| `invitationToken` | VARCHAR(64) | NULL | - | 招待トークン（任意） |
| `judgmentResult` | ENUM('prep', 'pass', 'session') | NULL | - | 判定結果 |
| `createdAt` | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |

---

## 判定ロジック（現在の実装）

### 判定フロー

```
1. 招待トークンチェック
   ↓ 有効な招待トークンあり
   → Session解放

2. 基本条件チェック（年収・資産・数字入力）
   ↓ 条件を満たす
   → Pass推奨

3. それ以外
   → Prep Mode推奨
```

### 判定条件の詳細

**Session解放条件:**
- 有効な招待トークン（`invitationToken`）が提供されている

**Pass推奨条件:**
- 世帯年収が1,500万円以上（`q4IncomeRange` が "1500-2000", "2000-3000", "3000以上"）
- **かつ** 金融資産が1,000万円以上（`q5AssetRange` が "1000-3000", "3000-5000", "5000以上"）
- **かつ** 数字入力ができる（`q6NumberInputTolerance` が "できる" または "一部できる"）

**Prep Mode推奨条件:**
- 上記のいずれにも該当しない場合

---

## ログの活用方法

### データ分析の目的

20〜30件の回答データが溜まった時点で、以下の分析を行います：

1. **判定結果の分布確認**
   - Session解放 / Pass推奨 / Prep Mode推奨の割合
   - 各判定結果の妥当性検証

2. **閾値の最適化**
   - 年収・資産の閾値が適切か
   - 数字入力の許容度が判定に与える影響

3. **質問項目の有効性検証**
   - Q7（キャリア変更）、Q8（ライフイベント）、Q9（現在の疑問）が判定に活用できるか
   - 不要な質問項目の削除または追加項目の検討

4. **ユーザー属性の把握**
   - 実際のユーザー層（年収・資産・住宅状況）の分布
   - ターゲット層（都内DINK、年収1,500〜3,000万、6,000〜8,000万レンジ）との乖離

### データエクスポート方法

**方法1: データベース直接クエリ**

```sql
SELECT 
  id,
  sessionId,
  email,
  q1DecisionDeadline,
  q2HousingStatus,
  q3PriceRange,
  q4IncomeRange,
  q5AssetRange,
  q6NumberInputTolerance,
  q7CareerChange,
  q8LifeEvent,
  q9CurrentQuestion,
  q10PreferredApproach,
  q11PrivacyConsent,
  q12BudgetSense,
  invitationToken,
  judgmentResult,
  createdAt
FROM fitGateResponses
ORDER BY createdAt DESC;
```

**方法2: Manus Management UI（Database パネル）**

1. Management UI → Database パネルを開く
2. `fitGateResponses` テーブルを選択
3. データをCSV/Excelでエクスポート

**方法3: API経由でデータ取得**

```typescript
// server/routers.ts に追加
fitGate: router({
  // 既存のsubmitエンドポイント
  submit: publicProcedure.input(...).mutation(...),
  
  // 新規：全回答データ取得（管理者用）
  getAllResponses: publicProcedure.query(async () => {
    const responses = await db.select().from(fitGateResponses).orderBy(desc(fitGateResponses.createdAt));
    return responses;
  }),
}),
```

---

## 分析用スプレッドシート構成案

### シート1: Raw Data

| sessionId | email | q1 | q2 | q3 | q4 | q5 | q6 | q7 | q8 | q9 | q10 | q11 | q12 | token | result | createdAt |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fg_1234... | user@example.com | 1か月以内 | 賃貸 | 6000 | 1500-2000 | 1000-3000 | できる | ... | ... | ... | ... | true | ... | - | pass | 2024-01-01 |

### シート2: 判定結果サマリ

| 判定結果 | 件数 | 割合 |
|---|---|---|
| Session解放 | 5 | 16.7% |
| Pass推奨 | 18 | 60.0% |
| Prep Mode推奨 | 7 | 23.3% |
| **合計** | **30** | **100%** |

### シート3: 質問別集計

**Q4: 世帯年収レンジ**

| 選択肢 | 件数 | 割合 |
|---|---|---|
| 1000-1500 | 3 | 10% |
| 1500-2000 | 12 | 40% |
| 2000-3000 | 10 | 33.3% |
| 3000以上 | 5 | 16.7% |

**Q5: 金融資産レンジ**

| 選択肢 | 件数 | 割合 |
|---|---|---|
| 500未満 | 2 | 6.7% |
| 500-1000 | 5 | 16.7% |
| 1000-3000 | 15 | 50% |
| 3000-5000 | 6 | 20% |
| 5000以上 | 2 | 6.7% |

### シート4: クロス集計

**年収 × 資産 × 判定結果**

| 年収レンジ | 資産レンジ | Pass推奨 | Prep Mode推奨 | Session解放 |
|---|---|---|---|---|
| 1500-2000 | 1000-3000 | 8 | 2 | 2 |
| 2000-3000 | 3000-5000 | 6 | 0 | 2 |
| ... | ... | ... | ... | ... |

---

## 今後の改善案

### 1. 判定ロジックの高度化

- **機械学習モデルの導入** - 20〜30件のデータでロジスティック回帰やランダムフォレストを適用
- **スコアリング方式** - 各質問に重みをつけて総合スコアで判定

### 2. 追加データの収集

- **ユーザーのその後の行動** - Prep Mode登録率、Pass購入率、Session参加率
- **満足度調査** - 判定結果に対するユーザーの納得度

### 3. リアルタイム分析ダッシュボード

- **Looker Studio / Metabase** - fitGateResponsesテーブルを直接可視化
- **自動アラート** - 特定の判定結果が偏った場合に通知

---

## 運用チェックリスト

- [x] `fitGateResponses` テーブルに `sessionId` カラムを追加
- [x] `server/routers.ts` で `sessionId` を自動生成
- [x] DBスキーマ変更をマイグレーション（`pnpm db:push`）
- [ ] 20〜30件のデータが溜まったタイミングでデータエクスポート
- [ ] スプレッドシートで分析（判定結果分布、質問別集計、クロス集計）
- [ ] 判定ロジックの調整案をPdMとすり合わせ
- [ ] 調整後のロジックを実装・デプロイ

---

## 参考リンク

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [MySQL Data Types](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)
- [Google Sheets API](https://developers.google.com/sheets/api)
