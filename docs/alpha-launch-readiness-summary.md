# LP v5 α公開準備 完了サマリー

## 概要

Exit Readiness OS LP v5のα公開に向けた準備作業が完了しました。このドキュメントは、実施した作業内容と次のステップをまとめたものです。

**実施日:** 2024年12月17日  
**バージョン:** 721acca5（前回チェックポイント）→ 最新版

---

## 実施した作業

### 1. Evidence Packセクション枠の追加 ✅

**場所:** トップページ（Home.tsx）の Scenario（S4）セクションと AS-IS（S5）セクションの間

**内容:**
- 3つの空カード（Case A / B / C）を配置
- 1on1の匿名アウトプット例を載せる枠を用意
- 実際のセッションが3〜5件溜まったタイミングで中身を差し替え可能

**ドキュメント:**
- [Evidence Pack運用ルール](./evidence-pack-operation-rules.md)

---

### 2. 計測タグの設置（7つのイベント） ✅

**実装済みイベント:**

| イベント名 | 発火タイミング | 実装場所 |
|---|---|---|
| `lp_hero_cta_clicked` | Hero「適合チェックに進む」ボタンクリック | `Home.tsx` (2箇所) |
| `fitgate_started` | 適合チェックページ表示 | `FitGate.tsx` |
| `fitgate_submitted` | 適合チェック送信 | `FitGate.tsx` |
| `fitgate_result_session` | 判定結果：Session解放 | `FitResult.tsx` |
| `fitgate_result_prep` | 判定結果：Prep Mode | `FitResult.tsx` |
| `fitgate_result_notyet` | 判定結果：Pass（まだ早い） | `FitResult.tsx` |
| `prep_registered` | Prep Modeメール登録完了 | `PrepMode.tsx` |

**ドキュメント:**
- [Umamiダッシュボード設計書](./umami-dashboard-design.md)

---

### 3. Fit Gateログ設計実装（DBテーブル拡張） ✅

**実施内容:**
- `fitGateResponses` テーブルに `sessionId` カラムを追加
- `server/routers.ts` で `sessionId` を自動生成（`fg_{timestamp}_{random}` 形式）
- DBスキーマ変更をマイグレーション（`pnpm db:push`）

**目的:**
- 20〜30件の回答データが溜まった時点で判定ロジックを最適化するためのログを記録

**ドキュメント:**
- [Fit Gateログ設計書](./fitgate-log-design.md)

---

### 4. Evidence Pack運用ルール定義 ✅

**内容:**
- 1on1セッション3件溜まったタイミングでケース例を差し替える運用ルールを定義
- 各ケースカードに載せる要素（前提・世界線・指標差分・インサイト）を明確化
- 匿名化のガイドラインを策定

**ドキュメント:**
- [Evidence Pack運用ルール](./evidence-pack-operation-rules.md)

---

### 5. 1on1オペテンプレート作成 ✅

**作成したテンプレート:**

1. **申込確認メールテンプレート**
   - 件名：[Exit Readiness OS] 1on1テストセッションのお申込みありがとうございます
   - 本文：申込内容サマリ、日程調整方法、セッション準備、当日の流れ
   - ドキュメント：[1on1申込確認メールテンプレート](./session-confirmation-email-template.md)

2. **世界線メモフォーマット**
   - セッション後にユーザーに送付する参考資料
   - 前提・世界線・指標差分・インサイトを整理
   - Evidence Packにも流用可能
   - ドキュメント：[世界線メモフォーマット](./session-worldline-memo-template.md)

---

## 次のステップ（LP Team / Dev への指示）

### 1. α公開を本当に開始する

- [ ] 現行LP v5を本番環境に反映済み確認
- [ ] 表から誰でも到達できる状態にする（hidden URLではなく）
- [ ] 旧LPが残っている場合は/beta等に退避または301リダイレクト
- [ ] Exit Readiness OSの正式リンクを1本に決定（例：https://exit-os.xxx/）

**備考:** 現在のプロジェクトは既にManusの本番環境で動作しています。公開URLを確定し、SNS/note/DMで共有する準備を進めてください。

---

### 2. Umamiイベントの動作確認とダッシュボード整備

- [ ] Umamiで7つのイベントが正しく発火しているか確認
  - [ ] `lp_hero_cta_clicked`
  - [ ] `fitgate_started`
  - [ ] `fitgate_submitted`
  - [ ] `fitgate_result_session`
  - [ ] `fitgate_result_prep`
  - [ ] `fitgate_result_notyet`
  - [ ] `prep_registered`
- [ ] LP専用ダッシュボードを1枚用意（1週間あたりのファネル可視化）
  - [ ] LP訪問数
  - [ ] Hero CTA → Fit Gate Start率
  - [ ] Fit Gate結果内訳（Session / Prep / Not yet）
  - [ ] Prep登録数
- [ ] 命名規則調整が必要なら統一

**参考:** [Umamiダッシュボード設計書](./umami-dashboard-design.md)

---

### 3. Evidence Packセクション：運用開始

- [ ] 1on1テストセッションが3件実施されたタイミングで、ケース例を作成
- [ ] 匿名化処理を実施
- [ ] PdMとすり合わせてケース例を確定
- [ ] `Home.tsx` の該当箇所を編集してケース例を差し替え

**参考:** [Evidence Pack運用ルール](./evidence-pack-operation-rules.md)

---

### 4. Fit Gateログの活用

- [ ] 20〜30件の回答データが溜まったタイミングでデータエクスポート
- [ ] スプレッドシートで分析（判定結果分布、質問別集計、クロス集計）
- [ ] 判定ロジックの調整案をPdMとすり合わせ
- [ ] 調整後のロジックを実装・デプロイ

**参考:** [Fit Gateログ設計書](./fitgate-log-design.md)

---

### 5. 1on1申込→セッション実施の運用

- [ ] `session_form_submitted` 時に申込確認メールを送信（現在は手動）
- [ ] セッション実施後、世界線メモを作成してユーザーに送付
- [ ] 世界線メモを匿名化してEvidence Pack用に保存

**参考:**
- [1on1申込確認メールテンプレート](./session-confirmation-email-template.md)
- [世界線メモフォーマット](./session-worldline-memo-template.md)

---

## 技術的な変更点

### データベーススキーマ変更

**テーブル:** `fitGateResponses`

**追加カラム:**
- `sessionId` (VARCHAR(64), NOT NULL) - セッションID（`fg_{timestamp}_{random}` 形式）

**マイグレーション:**
- `drizzle/0004_magenta_baron_zemo.sql` が生成・適用済み

### 新規ファイル

**クライアント側:**
- `client/src/lib/analytics.ts` - Umamiイベント送信用ユーティリティ

**ドキュメント:**
- `docs/umami-dashboard-design.md` - Umamiダッシュボード設計書
- `docs/fitgate-log-design.md` - Fit Gateログ設計書
- `docs/evidence-pack-operation-rules.md` - Evidence Pack運用ルール
- `docs/session-confirmation-email-template.md` - 1on1申込確認メールテンプレート
- `docs/session-worldline-memo-template.md` - 世界線メモフォーマット
- `docs/alpha-launch-readiness-summary.md` - 本ドキュメント

---

## 動作確認済み項目

- [x] TypeScriptエラーなし
- [x] 開発サーバー正常起動
- [x] DBスキーマ変更適用済み（`pnpm db:push`）
- [x] Evidence Packセクション表示確認
- [x] analyticsイベント実装確認（開発環境でconsole.log出力）

---

## 未実装項目（将来的に検討）

### 自動化

- [ ] 1on1申込確認メールの自動送信（現在は手動）
- [ ] Fit Gateログの自動エクスポート（現在は手動）
- [ ] Umamiダッシュボードの自動更新（現在は手動）

### 機能追加

- [ ] Evidence Packのインタラクティブ化（ケース例クリックで詳細展開）
- [ ] Fit Gate判定ロジックの機械学習化（20〜30件のデータが溜まった後）
- [ ] 世界線メモのPDF自動生成

---

## 問い合わせ先

ご不明点や追加のご要望がございましたら、以下までお気軽にご連絡ください。

**Dev Team**
- GitHub Issues: [exit_readiness_lp](https://github.com/your-org/exit_readiness_lp/issues)（※実際のURLに置き換え）
- Slack: #exit-os-dev（※実際のチャンネル名に置き換え）

**PdM**
- Notion: [Exit OS プロジェクト](https://notion.so/...)（※実際のURLに置き換え）
- メール: pdm@exit-os.xxx（※実際のメールアドレスに置き換え）

---

## バージョン履歴

| バージョン | 日付 | 変更内容 |
|---|---|---|
| 721acca5 | 2024-12-17 | Evidence Pack枠追加、計測タグ設置 |
| 最新版 | 2024-12-17 | Fit Gateログ設計、運用ルール・テンプレート作成 |

---

## まとめ

LP v5のα公開準備が完了しました。次のステップとして、以下を実施してください：

1. **Umamiダッシュボード整備** - 7つのイベントが正しく計測されているか確認し、ファネル可視化ダッシュボードを作成
2. **Evidence Pack運用開始** - 1on1セッション3件実施後、ケース例を差し替え
3. **Fit Gateログ活用** - 20〜30件のデータが溜まったタイミングで判定ロジックを最適化
4. **1on1オペ実施** - 申込確認メール送信、セッション実施、世界線メモ作成

すべてのドキュメントは `docs/` ディレクトリに格納されています。運用開始後、必要に応じてドキュメントを更新してください。
