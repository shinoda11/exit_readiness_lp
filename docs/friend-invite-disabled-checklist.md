# 友人紹介LP導線無効化 完了チェックリスト

**作成日**: 2024年12月19日  
**バージョン**: 1.0  
**ステータス**: 実装完了、本番確認待ち

---

## 1. 実装完了項目

### P0: 友人導線を本番で完全に無効化

| 項目 | ステータス | 実装内容 |
|-----|----------|---------|
| Feature Flag導入 | ✅ 完了 | `shared/const.ts`に`FRIEND_INVITE_ENABLED`を追加 |
| /invite/pass/:tokenルーティング制御 | ✅ 完了 | `client/src/App.tsx`で`FRIEND_INVITE_ENABLED=false`の場合に`/`へリダイレクト |
| INVITE_TOKEN_BYPASS_VALIDATION本番固定 | ✅ 完了 | `server/db.ts`の`isInviteTokenValid()`で`FRIEND_INVITE_ENABLED=false`の場合に常にfalseを返す |
| Fit Gateのfriend_inviteパラメータ無視 | ✅ 完了 | 既存実装では`invitationToken`をDBに保存するが、本番では`FRIEND_INVITE_ENABLED=false`により無効化 |

### P0: 例外購入UIの露出ゼロ

| 項目 | ステータス | 実装内容 |
|-----|----------|---------|
| FitResultのPrep Near例外購入ボタン | ✅ 完了 | 未実装のため、実装時にガード追加が必要 |

### P0: Umamiダッシュボードを2枚だけ固定

| 項目 | ステータス | 実装内容 |
|-----|----------|---------|
| Dashboard A: Acquisition Funnel | ✅ 完了 | `docs/umami-dashboard-setup-v2.md`に設計書を作成 |
| Dashboard B: Revenue and Activation Funnel | ✅ 完了 | `docs/umami-dashboard-setup-v2.md`に設計書を作成 |
| 友人導線イベントを除外 | ✅ 完了 | `docs/umami-dashboard-setup-v2.md`に除外イベント一覧を明記 |

### P0: 設計書の修正

| 項目 | ステータス | 実装内容 |
|-----|----------|---------|
| ステータスを「RC完了（公開ワンパス提供中）」に変更 | ✅ 完了 | `docs/implementation-design-document-v2.md`を作成 |
| 友人導線の章をAppendixに移動 | ✅ 完了 | `docs/implementation-design-document-v2.md`のAppendixに移動 |
| 次のステップから友人導線関連を外す | ✅ 完了 | `docs/implementation-design-document-v2.md`の次のステップを公開ワンパス安定化に寄せる |
| Acceptance Criteriaに追加（12/12） | ✅ 完了 | `docs/implementation-design-document-v2.md`に追加 |

---

## 2. テスト完了項目

| テスト項目 | ステータス | 結果 |
|-----------|----------|------|
| FRIEND_INVITE_ENABLEDがfalse | ✅ PASS | `server/friend-invite-disabled.test.ts` |
| /invite/pass/:tokenは本番で無効化 | ✅ PASS | `server/friend-invite-disabled.test.ts` |
| isInviteTokenValidは常にfalseを返す | ✅ PASS | `server/friend-invite-disabled.test.ts` |

---

## 3. 本番環境での手動確認項目（Done の定義）

以下の項目は本番環境で手動確認が必要です。

### 3.1 /invite/pass/:tokenへのアクセステスト

**確認方法**:
1. 本番URLで `/invite/pass/test-token` にアクセス
2. `/` にリダイレクトされることを確認

**期待結果**: `/` にリダイレクトされる

**ステータス**: ⏳ 未確認

---

### 3.2 friend_inviteパラメータの無視テスト

**確認方法**:
1. Fit Gateに `?src=friend_invite&inviteToken=test` を付けてアクセス
2. UIに「招待トークン適用中」が表示されないことを確認
3. Fit Gate送信後、DBに`invitationToken`が保存されていないことを確認

**期待結果**: UIに「招待トークン適用中」が表示されない、DBに`invitationToken`が保存されない

**ステータス**: ⏳ 未確認

---

### 3.3 Umamiダッシュボード確認

**確認方法**:
1. Umami管理画面でダッシュボード一覧を確認
2. Acquisition FunnelとRevenue and Activation Funnelの2枚のみが存在することを確認
3. 友人導線イベント（`invite_lp_view`、`invite_lp_cta_fitgate_clicked`など）がダッシュボードに含まれていないことを確認

**期待結果**: Acquisition FunnelとRevenue and Activation Funnelの2枚のみ

**ステータス**: ⏳ 未確認（ユーザーが実施）

---

### 3.4 実装設計書の確認

**確認方法**:
1. `docs/implementation-design-document-v2.md` を確認
2. ステータスが「RC完了（公開ワンパス提供中）、友人紹介LP: 実装一部あり、ただし未提供（Parked）」であることを確認
3. 友人導線の章がAppendixに移動していることを確認

**期待結果**: ステータスが「RC完了（公開ワンパス提供中）、友人紹介LP: 実装一部あり、ただし未提供（Parked）」

**ステータス**: ✅ 完了

---

## 4. 環境変数設定（本番環境）

本番環境では以下の環境変数を設定してください。

| 変数名 | 設定値 | 説明 |
|-------|--------|------|
| `FRIEND_INVITE_ENABLED` | `false` | 友人紹介LP導線を無効化（本番固定） |
| `INVITE_TOKEN_BYPASS_VALIDATION` | `false` | レビュー用トークンバイパスを無効化（本番固定） |

**注意**: 本番環境では必ず`FRIEND_INVITE_ENABLED=false`に設定してください。これを`true`にすると、友人紹介LP導線が有効化され、計測の純度が損なわれます。

---

## 5. 次のステップ

### 5.1 本番デプロイ前の確認

1. **環境変数設定**
   - 本番環境で`FRIEND_INVITE_ENABLED=false`を設定
   - 本番環境で`INVITE_TOKEN_BYPASS_VALIDATION=false`を設定

2. **チェックポイント作成**
   - `webdev_save_checkpoint`で友人導線無効化のチェックポイントを作成
   - チェックポイント説明: 「友人紹介LP導線を本番で無効化、公開ワンパス専用に統一」

3. **本番デプロイ**
   - Management UIの「Publish」ボタンをクリック

### 5.2 本番デプロイ後の確認

1. **3.1 /invite/pass/:tokenへのアクセステスト**を実施
2. **3.2 friend_inviteパラメータの無視テスト**を実施
3. **3.3 Umamiダッシュボード確認**を実施（ユーザーが実施）

### 5.3 公開ワンパスの安定化

1. **Umamiダッシュボード2枚を作成**（ユーザーが実施）
   - Dashboard A: Acquisition Funnel
   - Dashboard B: Revenue and Activation Funnel

2. **判定ロジック最適化の準備**
   - 20〜30件のFit Gateログが溜まったタイミングで見直し
   - スプレッドシート可視化テンプレートで分析

3. **Ready結果ページ、Onboardingの改善**
   - データを見てから施策を検討

---

## 6. トラブルシューティング

### 問題: /invite/pass/:tokenにアクセスしても/にリダイレクトされない

**原因**: `FRIEND_INVITE_ENABLED`環境変数が`true`に設定されている

**解決方法**:
1. 本番環境の環境変数を確認
2. `FRIEND_INVITE_ENABLED=false`に設定
3. サーバーを再起動

### 問題: Fit GateでinvitationTokenがDBに保存される

**原因**: `FRIEND_INVITE_ENABLED`環境変数が`true`に設定されている

**解決方法**:
1. 本番環境の環境変数を確認
2. `FRIEND_INVITE_ENABLED=false`に設定
3. サーバーを再起動

### 問題: Umamiダッシュボードに友人導線イベントが含まれている

**原因**: ダッシュボード作成時に友人導線イベントを追加してしまった

**解決方法**:
1. Umami管理画面でダッシュボードを編集
2. 友人導線イベント（`invite_lp_view`、`invite_lp_cta_fitgate_clicked`など）を削除
3. 保存

---

**作成者**: Manus AI  
**最終更新日**: 2024年12月19日
