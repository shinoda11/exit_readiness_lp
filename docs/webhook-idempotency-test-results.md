# Webhook冪等性テスト結果

**実施日時**: 2025-12-18T07:46:43.104Z

**テスト環境**: Development

**テスト対象**: Stripe Webhook `checkout.session.completed`

---

## 1. Test Case 1: 同一イベントの二重送信

**結果**: ✅ PASS

**詳細**:

```json
{
  "sessionId": "cs_test_1766043998809_case1",
  "firstResult": "created",
  "secondResult": "skipped",
  "dbRecordCount": 1
}
```

**検証内容**:
- 同一の`checkout.session.completed`イベントを2回送信
- 1回目: Pass購入情報が正常に作成される
- 2回目: 既処理として検出され、スキップされる
- DB件数: 1件（期待通り）

---

## 2. Test Case 2: 異なるイベントIDだが同一session.id

**結果**: ✅ PASS

**詳細**:

```json
{
  "sessionId": "cs_test_1766044001061_case2",
  "firstResult": "created",
  "secondResult": "skipped",
  "dbRecordCount": 1
}
```

**検証内容**:
- 異なるイベントIDだが同一の`session.id`を持つイベントを2回送信
- 1回目: Pass購入情報が正常に作成される
- 2回目: 既処理として検出され、スキップされる
- DB件数: 1件（期待通り）

**重要性**: Stripeは同一セッションに対して異なるイベントIDで複数回Webhookを送信する可能性があるため、このケースの冪等性が重要

---

## 3. Test Case 3: UNIQUE制約違反のエラーハンドリング

**結果**: ✅ PASS

**詳細**:

```json
{
  "sessionId": "cs_test_1766044002245_case3",
  "uniqueConstraintErrorCaught": true
}
```

**検証内容**:
- 冪等性チェックをバイパスして、同一`stripeSessionId`でDB挿入を試行
- UNIQUE制約違反エラーが正しくキャッチされる
- データベースレベルでの二重発行防止が機能している

**重要性**: アプリケーションレベルの冪等性チェックが失敗した場合でも、データベースレベルで二重発行を防止できる

---

## 総合結果

✅ **ALL TESTS PASSED**

**合格基準**:
- 同一 `checkout.session.id` が複数回届いても、アカウント発行が1回で終わる
- UNIQUE制約違反エラーが正しくキャッチされる
- 冪等性チェックで既処理イベントがスキップされる

---

## 実装詳細

### 冪等性の実装方法

1. **データベーススキーマ**: `passSubscriptions`テーブルの`stripeSessionId`カラムにUNIQUE制約を追加
2. **アプリケーションロジック**: Webhook処理の冒頭で`stripeSessionId`を検索し、既存レコードがあればスキップ
3. **二重防御**: アプリケーションレベルとデータベースレベルの両方で冪等性を保証

### テストコード

テストスクリプト: `server/tests/webhook-idempotency-test.mjs`

実行コマンド:
```bash
cd /home/ubuntu/exit_readiness_lp
npx tsx server/tests/webhook-idempotency-test.mjs
```

---

## 残りのテストケース（今後実施予定）

### 4. Webhook未到達の状態でPassOnboarding表示

**条件**: 決済後すぐにOnboarding表示、Webhook処理が遅延

**期待**: ログイン情報が未生成なら「再取得」導線が出る。一定時間後に自動復帰できる

**実装状況**: `/pass/resend-login`ページで対応済み

### 5. ログイン情報再送

**条件**: 購入メールアドレスで再送を実行

**期待**: 正しいID/Passwordが届く。別のユーザーに誤送信しない

**実装状況**: `server/routers.ts`の`resendLoginInfo` APIで対応済み

### 6. Session Private Checkout 48h期限切れ

**条件**: 期限切れURLでアクセス

**期待**: 決済不可、再発行フローへ誘導（または失効表示のみ）

**実装状況**: Session Private Checkoutの実装確認が必要

---

## 再発防止策

1. **定期的な冪等性テストの実行**: デプロイ前に必ずテストを実行
2. **監視**: Webhook処理の失敗率とリトライ回数を監視
3. **ログ記録**: すべてのWebhook処理を記録し、異常パターンを検出

---

## 結論

Webhook冪等性の実装は正常に機能しており、以下のリスクが軽減されました：

- ✅ 二重送信による重複アカウント発行
- ✅ 決済成功後のログイン情報未発行
- ✅ データベース整合性の破損

**次のステップ**: 残りのテストケース（4-6）を実施し、エンドツーエンドの信頼性を確保する。
