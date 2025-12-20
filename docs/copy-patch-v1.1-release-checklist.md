# LP差し替え（Copy Patch v1.1）リリース前チェックリスト

## 実装完了確認

### Home.tsx（公開LP）
- [x] ヒーローH1差し替え: 「"Exit"を、安心して選べる選択肢に」
- [x] サブコピー差し替え: 「Rent vs Buyの意思決定を、数字で比較して、根拠を残せる」
- [x] Exit定義追加: 「"Exit"とは：賃貸を出て持ち家を買う決断」
- [x] 右側カードタイトル差し替え: 「Passで何ができるか」
- [x] 右側カード補足差し替え: 「90日間、¥29,800（税込）」
- [x] Evidence Pack見出し差し替え: 「Passで得られる3つの成果物」
- [x] Evidence Pack 3カード差し替え
- [x] Problemセクション本文差し替え

### FitGate.tsx
- [x] ページタイトル差し替え: 「Exit Readiness OS - 適合チェック（12問）」
- [x] メールアドレス説明文差し替え: 「判定結果と次のステップをお送りするため、メールアドレスが必要です」

### FitResult.tsx
- [x] Ready判定見出し差し替え: 「Ready：Passで比較と更新を回し始められます」
- [x] Ready判定本文差し替え: 「いますぐExit Readiness OS Passを使い始められる状態です」
- [x] Prep Near判定見出し差し替え: 「Prep Near：準備が整えば、Passで比較と更新が回せます」
- [x] Prep Near判定本文差し替え: 「まずはPrep Modeで準備を整えてから、再度適合チェックにお越しください」
- [x] Prep NotYet判定見出し差し替え: 「Prep NotYet：いまは検討フェーズの手前です」
- [x] Prep Mode説明文に「無料です」追加

### PrepMode.tsx
- [x] ページタイトル差し替え: 「Exit Readiness OS を使いこなすための準備ガイド（無料）」
- [x] 説明文に「無料です」追加

### InvitePass.tsx
- [ ] スキップ（Parked）

## ブラウザ確認

### Home.tsx（公開LP）
- [ ] ヒーローセクションが正しく表示される
- [ ] Exit定義が正しく表示される
- [ ] Evidence Pack 3カードが正しく表示される
- [ ] Problemセクションが正しく表示される

### FitGate.tsx
- [ ] ページタイトルが「適合チェック（12問）」と表示される
- [ ] メールアドレス説明文が正しく表示される

### FitResult.tsx
- [ ] Ready判定が正しく表示される
- [ ] Prep Near判定が正しく表示される
- [ ] Prep NotYet判定が正しく表示される

### PrepMode.tsx
- [ ] ページタイトルに「（無料）」が表示される
- [ ] 説明文に「無料です」が表示される

## リリース判定

### 必須条件
- [x] すべての実装が完了している
- [ ] ブラウザで表示確認が完了している
- [ ] 誤字脱字がない
- [ ] リンクが正しく動作する

### リリース可否
- [ ] リリース可能
- [ ] 修正が必要

## 備考

- InvitePass.tsxは友人導線がParkedのため、差し替え対象外
- 本番環境では`FRIEND_INVITE_ENABLED=false`を確認すること
