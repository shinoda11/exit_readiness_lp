# 白文字が見えない問題の修正完了

## 問題の原因

`bg-accent/10 text-accent-foreground`の組み合わせで、薄いグリーン背景（ほぼ白）に白文字を表示していたため、タグが見えなくなっていました。

## 修正内容

以下の2箇所で`text-accent-foreground`を`text-foreground`に変更：

1. **Heroセクションのタグ** (line 132)
   - Before: `bg-accent/10 text-accent-foreground`
   - After: `bg-accent/10 text-foreground`

2. **S4「実際の世界線」セクションのタグ** (line 390)
   - Before: `bg-accent/10 text-accent-foreground`
   - After: `bg-accent/10 text-foreground`

## 確認結果

ブラウザで確認した結果、以下のタグが正しく表示されることを確認：

- Heroセクション：「高収入DINKs向け Exit OS β版」が薄いグリーン背景に濃い文字で表示
- S4セクション：「住宅」「海外駐在」などのタグが薄いグリーン背景に濃い文字で表示

## 修正の理由

`--accent-foreground`は`oklch(0.98 0.005 150)`（ほぼ白）に設定されており、これは`bg-accent`（濃いグリーン）の上で使うことを想定した色です。`bg-accent/10`のような薄い背景では、代わりに`text-foreground`（濃い色）を使う必要があります。
