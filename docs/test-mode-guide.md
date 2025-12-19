# テストモード使用ガイド

**作成日**: 2024年12月19日  
**バージョン**: 1.0  
**目的**: 開発・レビュー時にFit Gateをスキップしてユーザー体験をスムーズに確認できるようにする

---

## 1. テストモードとは

テストモードは、開発・レビュー時にFit Gateアンケートを毎回答えるストレスを解消するための機能です。特定のテストセッションIDを使って、Fit Gateをスキップし、各判定結果のユーザー体験を直接確認できます。

### 背景

ユーザー体験を確認したいだけなのに、毎回12問のFit Gateアンケートに答えるのはストレスです。本番環境稼働前に、テストモードフラグを追加し、スムーズに行き来できるようにしました。

### 方針

- **開発環境**: `TEST_MODE=true`に設定し、テストモードを有効化
- **本番環境**: `TEST_MODE=false`に固定し、テストモードを無効化

---

## 2. テストモードの使い方

### 2.1 環境変数設定

開発環境で以下の環境変数を設定してください。

```bash
TEST_MODE=true
```

本番環境では必ず`false`に設定してください。

```bash
TEST_MODE=false
```

### 2.2 テストセッションID

テストモードが有効な場合、以下の3種類のテストセッションIDを使ってFit Gateをスキップできます。

| テストセッションID | 判定結果 | 説明 |
|------------------|---------|------|
| `test_ready` | Ready | Pass購入可能な状態 |
| `test_prep_near` | Prep Near | 準備が近い状態（4〜5項目が準備できている） |
| `test_prep_notyet` | Prep NotYet | まだ早い状態（3項目以下が準備できている） |

### 2.3 クイックリンク（Home.tsx）

テストモードが有効な場合、Home.tsxの右下に「⚠️ TEST MODE」というクイックリンクが表示されます。

**表示内容**:
- Ready結果を見る
- Prep Near結果を見る
- Prep NotYet結果を見る

各ボタンをクリックすると、対応する判定結果ページに直接遷移します。

### 2.4 FitResult.tsx

テストモードが有効な場合、URLパラメータ`?sessionId=<テストセッションID>`で判定結果を表示できます。

**例**:
- `/fit-result?sessionId=test_ready` → Ready判定結果を表示
- `/fit-result?sessionId=test_prep_near` → Prep Near判定結果を表示
- `/fit-result?sessionId=test_prep_notyet` → Prep NotYet判定結果を表示

### 2.5 PassOnboarding.tsx

テストモードが有効な場合、テストセッションIDを使ってダミーログイン情報を表示できます。

**ダミーログイン情報**:
- ログインID: `test@example.com`
- ログインパスワード: `test1234567890ab`

**例**:
- `/pass/onboarding?session_id=test_ready` → ダミーログイン情報を表示

---

## 3. テストモードの実装詳細

### 3.1 shared/const.ts

テストモードフラグとテストセッションIDを定義しています。

```typescript
/**
 * Feature Flag: Test Mode
 * 
 * 本番環境では必ずfalseに設定してください。
 * 開発・レビュー時にFit Gateをスキップしてユーザー体験を確認できるようにします。
 * 
 * - true: テストモードを有効化（開発環境のみ）
 * - false: テストモードを無効化（本番環境）
 */
export const TEST_MODE = process.env.TEST_MODE === 'true';

/**
 * Test Session IDs for skipping Fit Gate
 * 
 * テストモードが有効な場合、以下のセッションIDを使ってFit Gateをスキップできます。
 * - test_ready: Ready判定結果を表示
 * - test_prep_near: Prep Near判定結果を表示
 * - test_prep_notyet: Prep NotYet判定結果を表示
 */
export const TEST_SESSION_IDS = {
  READY: 'test_ready',
  PREP_NEAR: 'test_prep_near',
  PREP_NOTYET: 'test_prep_notyet',
} as const;

/**
 * Check if the given session ID is a test session ID
 */
export function isTestSessionId(sessionId: string | null | undefined): boolean {
  if (!sessionId) return false;
  return Object.values(TEST_SESSION_IDS).includes(sessionId as any);
}
```

### 3.2 Home.tsx

テストモードが有効な場合、右下にクイックリンクを表示します。

```tsx
{/* テストモード用クイックリンク */}
{TEST_MODE && (
  <div className="fixed bottom-4 right-4 bg-card border-2 border-yellow-500 rounded-lg p-4 shadow-lg max-w-xs z-50">
    <div className="text-xs font-bold text-yellow-600 mb-2">⚠️ TEST MODE</div>
    <div className="text-xs text-muted-foreground mb-3">
      Fit Gateをスキップして結果ページを確認:
    </div>
    <div className="flex flex-col gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-8"
        onClick={() => window.location.href = `/fit-result?sessionId=${TEST_SESSION_IDS.READY}`}
      >
        Ready結果を見る
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-8"
        onClick={() => window.location.href = `/fit-result?sessionId=${TEST_SESSION_IDS.PREP_NEAR}`}
      >
        Prep Near結果を見る
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-8"
        onClick={() => window.location.href = `/fit-result?sessionId=${TEST_SESSION_IDS.PREP_NOTYET}`}
      >
        Prep NotYet結果を見る
      </Button>
    </div>
  </div>
)}
```

### 3.3 FitResult.tsx

テストモードが有効な場合、テストセッションIDで判定結果を表示します。

```tsx
useEffect(() => {
  // Get result from URL query parameter
  const params = new URLSearchParams(window.location.search);
  const sessionIdParam = params.get("sessionId");
  const resultParam = params.get("result") as "prep" | "ready" | "session" | null;
  const prepBucketParam = params.get("prepBucket") as "near" | "notyet" | null;

  // Test mode: Use test session ID to determine result
  if (TEST_MODE && sessionIdParam && isTestSessionId(sessionIdParam)) {
    if (sessionIdParam === TEST_SESSION_IDS.READY) {
      setResult("ready");
      setPrepBucket(null);
    } else if (sessionIdParam === TEST_SESSION_IDS.PREP_NEAR) {
      setResult("prep");
      setPrepBucket("near");
    } else if (sessionIdParam === TEST_SESSION_IDS.PREP_NOTYET) {
      setResult("prep");
      setPrepBucket("notyet");
    }
  } else {
    // Normal mode: Use result and prepBucket parameters
    setResult(resultParam || "ready");
    setPrepBucket(prepBucketParam);
  }

  // Track result event
  // ...
}, []);
```

### 3.4 PassOnboarding.tsx

テストモードが有効な場合、ダミーログイン情報を表示します。

```tsx
useEffect(() => {
  // Test mode: Use dummy email and login info
  if (isTestMode) {
    setEmail("test@example.com");
    setLoginId("test@example.com");
    setLoginPassword("test1234567890ab");
    setLoading(false);
    return;
  }

  // Get email from Stripe session
  if (getStripeSession.data?.email) {
    setEmail(getStripeSession.data.email);
  }
  
  setLoading(false);
}, [getStripeSession.data, isTestMode]);
```

---

## 4. 注意事項

### 4.1 本番環境では必ず無効化

本番環境では必ず`TEST_MODE=false`に設定してください。テストモードが有効な状態で本番環境にデプロイすると、ユーザーがテストセッションIDを使ってFit Gateをスキップできてしまいます。

### 4.2 テストセッションIDはDBに保存されない

テストセッションIDは、DBに保存されません。テストモードが有効な場合、Fit Gateをスキップして判定結果を表示するだけです。

### 4.3 テストモードはフロントエンドのみ

テストモードは、フロントエンドのみで動作します。バックエンドのAPIは、通常通り動作します。

### 4.4 Umamiイベントは発火しない

テストモードでは、Umamiイベントは発火しません（通常のURLパラメータ`?result=ready`等を使った場合は発火します）。

---

## 5. トラブルシューティング

### 問題: クイックリンクが表示されない

**原因**: `TEST_MODE`環境変数が`false`に設定されている

**解決方法**:
1. Settings → Secretsで`TEST_MODE=true`を設定
2. サーバーを再起動

### 問題: テストセッションIDで判定結果が表示されない

**原因**: `TEST_MODE`環境変数が`false`に設定されている、またはテストセッションIDが間違っている

**解決方法**:
1. Settings → Secretsで`TEST_MODE=true`を設定
2. テストセッションIDが正しいか確認（`test_ready`、`test_prep_near`、`test_prep_notyet`）
3. サーバーを再起動

### 問題: PassOnboardingでダミーログイン情報が表示されない

**原因**: `TEST_MODE`環境変数が`false`に設定されている、またはテストセッションIDが間違っている

**解決方法**:
1. Settings → Secretsで`TEST_MODE=true`を設定
2. URLパラメータ`?session_id=test_ready`等を使用
3. サーバーを再起動

---

## 6. 今後の拡張

### 6.1 PassUpgrade.tsx

Pass→Session Upgrade申請ページでも、テストモードを実装する予定です。テストセッションIDの場合、Upgrade申請をスキップし、ダミーのPrivate Checkout URLを表示します。

### 6.2 テストモード用のダッシュボード

テストモードが有効な場合、開発者向けのダッシュボードを表示し、各ページへのクイックリンクや環境変数の確認ができるようにする予定です。

---

**作成者**: Manus AI  
**最終更新日**: 2024年12月19日
