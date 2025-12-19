# 本番設定の最終確認チェックリスト

**作成日**: 2024年12月19日  
**バージョン**: 1.0  
**目的**: 運用で壊れない状態を証明し、設定漏れで崩れないようにする

---

## 1. 環境変数チェック

本番だけでなく、Preview/Production相当の環境も含めて確認してください（リンク漏洩はPreviewでも起きます）。

### 1.1 友人導線無効化

| 変数名 | 設定値 | 確認方法 | ステータス |
|-------|--------|---------|----------|
| `FRIEND_INVITE_ENABLED` | `false` | Settings → Secretsで確認 | ⏳ 未確認 |
| `INVITE_TOKEN_BYPASS_VALIDATION` | `false` | Settings → Secretsで確認 | ⏳ 未確認 |

**重要**: 本番環境では必ず`false`に設定してください。これを`true`にすると、友人紹介LP導線が有効化され、計測の純度が損なわれます。

### 1.2 メール送信設定

| 変数名 | 設定値 | 確認方法 | ステータス |
|-------|--------|---------|----------|
| `MAIL_DRY_RUN` | `false` | Settings → Secretsで確認 | ⏳ 未確認 |
| `MAIL_PROVIDER` | `manus`（推奨）/ `sendgrid`（フォールバック） | Settings → Secretsで確認 | ⏳ 未確認 |

**重要**: 本番運用でメールを送信する場合は、`MAIL_DRY_RUN=false`に設定してください。`true`の場合、メール送信がスキップされます。

### 1.3 バッチ処理認証

| 変数名 | 設定値 | 確認方法 | ステータス |
|-------|--------|---------|----------|
| `JOB_AUTH_TOKEN` | 十分に長いランダム文字列（32文字以上推奨） | Settings → Secretsで確認 | ⏳ 未確認 |

**重要**: `JOB_AUTH_TOKEN`は、30日後再診断メールのバッチ処理（`/api/jobs/notyet-followup`）の認証に使用されます。十分に長いランダム文字列を設定してください。

**生成方法**:
```bash
# ランダムな32文字の文字列を生成
openssl rand -base64 32
```

---

## 2. Acceptance（本番環境での手動確認）

### 2.1 /invite/pass/:tokenへのアクセステスト

**確認方法**:
1. 本番URLで `/invite/pass/test-token` にアクセス
2. `/` にリダイレクトされることを確認

**期待結果**: `/` にリダイレクトされる

**ステータス**: ⏳ 未確認

**トラブルシューティング**:
- リダイレクトされない場合: `FRIEND_INVITE_ENABLED`環境変数が`true`に設定されている可能性があります。Settings → Secretsで確認してください。

---

### 2.2 inviteTokenパラメータの無視テスト

**確認方法**:
1. Fit Gateに `?inviteToken=test-token` を付けてアクセス
2. UIに「招待トークン適用中」が表示されないことを確認
3. Fit Gate送信後、DBに`invitationToken`が保存されていないことを確認

**期待結果**: UIに「招待トークン適用中」が表示されない、DBに`invitationToken`が保存されない

**ステータス**: ⏳ 未確認

**DB確認方法**:
1. Management UI → Databaseを開く
2. `fitGateResponses`テーブルを確認
3. 最新のレコードの`invitationToken`カラムが`NULL`であることを確認

**トラブルシューティング**:
- `invitationToken`が保存される場合: `FRIEND_INVITE_ENABLED`環境変数が`true`に設定されている可能性があります。Settings → Secretsで確認してください。

---

### 2.3 src=friend_inviteパラメータの無視テスト

**確認方法**:
1. Fit Gateに `?src=friend_invite` を付けてアクセス
2. UIに「友人経由」などの表示がないことを確認
3. Fit Gate送信後、DBに`src`が保存されていないことを確認

**期待結果**: UIに「友人経由」などの表示がない、DBに`src`が保存されない

**ステータス**: ⏳ 未確認

**注意**: 現在の実装では、`src`パラメータはDBに保存されていません。将来的に`src`パラメータを保存する実装が追加された場合、本番では`FRIEND_INVITE_ENABLED=false`により無視されることを確認してください。

---

### 2.4 bypassが無効な状態でのinvite経由閲覧テスト

**確認方法**:
1. `INVITE_TOKEN_BYPASS_VALIDATION=false`に設定
2. 有効なinviteTokenを使って`/invite/pass/:token`にアクセス
3. `/`にリダイレクトされることを確認

**期待結果**: どんなtokenでもinvite経由の閲覧が成立しない（`/`にリダイレクトされる）

**ステータス**: ⏳ 未確認

**トラブルシューティング**:
- リダイレクトされない場合: `FRIEND_INVITE_ENABLED`環境変数が`true`に設定されている可能性があります。Settings → Secretsで確認してください。

---

## 3. 環境変数設定手順（Manus Management UI）

### Step 1: Management UIを開く

1. Chatboxヘッダーの設定アイコンをクリック
2. Management UIが右側に表示されます

### Step 2: Secretsパネルを開く

1. Management UIの左側ナビゲーションで「Settings」をクリック
2. サブメニューで「Secrets」をクリック

### Step 3: 環境変数を確認・設定

1. 既存の環境変数一覧が表示されます
2. 以下の環境変数を確認・設定してください：
   - `FRIEND_INVITE_ENABLED=false`
   - `INVITE_TOKEN_BYPASS_VALIDATION=false`
   - `MAIL_DRY_RUN=false`
   - `MAIL_PROVIDER=manus`
   - `JOB_AUTH_TOKEN=<32文字以上のランダム文字列>`

### Step 4: 変更を保存

1. 環境変数を変更した場合、「Save」ボタンをクリック
2. サーバーが自動的に再起動されます

---

## 4. Preview環境での確認

Preview環境でも同様の設定を確認してください。リンク漏洩はPreview環境でも起きる可能性があります。

### Preview環境の環境変数

Preview環境では、本番環境と同じ環境変数を設定してください。特に以下の環境変数は必ず`false`に設定してください：

- `FRIEND_INVITE_ENABLED=false`
- `INVITE_TOKEN_BYPASS_VALIDATION=false`

### Preview環境でのAcceptanceテスト

本番環境と同様のAcceptanceテストをPreview環境でも実施してください：

1. `/invite/pass/:token`へのアクセステスト
2. `inviteToken`パラメータの無視テスト
3. `src=friend_invite`パラメータの無視テスト
4. bypassが無効な状態でのinvite経由閲覧テスト

---

## 5. チェックリスト完了確認

すべての項目を確認し、ステータスを✅に更新してください。

### 環境変数チェック

- [ ] `FRIEND_INVITE_ENABLED=false`（本番）
- [ ] `FRIEND_INVITE_ENABLED=false`（Preview）
- [ ] `INVITE_TOKEN_BYPASS_VALIDATION=false`（本番）
- [ ] `INVITE_TOKEN_BYPASS_VALIDATION=false`（Preview）
- [ ] `MAIL_DRY_RUN=false`（本番）
- [ ] `MAIL_PROVIDER=manus`（本番）
- [ ] `JOB_AUTH_TOKEN`がセット済み（本番）

### Acceptanceテスト

- [ ] `/invite/pass/:token`へのアクセステスト（本番）
- [ ] `/invite/pass/:token`へのアクセステスト（Preview）
- [ ] `inviteToken`パラメータの無視テスト（本番）
- [ ] `inviteToken`パラメータの無視テスト（Preview）
- [ ] `src=friend_invite`パラメータの無視テスト（本番）
- [ ] `src=friend_invite`パラメータの無視テスト（Preview）
- [ ] bypassが無効な状態でのinvite経由閲覧テスト（本番）
- [ ] bypassが無効な状態でのinvite経由閲覧テスト（Preview）

---

## 6. トラブルシューティング

### 問題: 環境変数が設定できない

**原因**: Management UIのSecretsパネルで環境変数を追加・編集する権限がない

**解決方法**:
1. プロジェクトのOwnerに確認してください
2. Ownerであれば、Management UI → Settings → Secretsで環境変数を追加・編集できます

### 問題: 環境変数を変更してもサーバーに反映されない

**原因**: サーバーが再起動されていない

**解決方法**:
1. Management UIのDashboardパネルで「Restart Server」ボタンをクリック
2. サーバーが再起動されるまで待ちます（通常30秒〜1分）

### 問題: Acceptanceテストが失敗する

**原因**: 環境変数が正しく設定されていない、またはサーバーが再起動されていない

**解決方法**:
1. Settings → Secretsで環境変数を確認
2. サーバーを再起動
3. Acceptanceテストを再実施

---

**作成者**: Manus AI  
**最終更新日**: 2024年12月19日
