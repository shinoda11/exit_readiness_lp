import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PassDecisionMemo() {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  // Mock memo content (3 blocks)
  const memoContent = {
    upperRange: {
      title: "上限レンジ（OKライン/NGライン）",
      content: `【OK ライン】
- 物件価格: 8,000万円まで
- 頭金: 2,000万円
- 月次投資: 50万円

【NG ライン】
- 物件価格: 1億円超
- 頭金: 500万円未満
- 月次投資: 20万円未満`,
    },
    scenarioConclusion: {
      title: "3シナリオ結論（Rent/Buy/Buy+Shockの要点）",
      content: `【Rent（賃貸継続）】
- 60歳時点資産: 8,500万円
- 柔軟性が高く、リスクが低い
- 40〜50代のCFは月45万円程度

【Buy（持ち家購入）】
- 60歳時点資産: 9,200万円（最大）
- 住居費の固定化により安定
- 40〜50代のCFは月38万円程度

【Buy+Shock（購入+ショック）】
- 60歳時点資産: 7,800万円
- 収入減30%を想定
- 40〜50代のCFは月32万円程度
- 取り崩し開始が60歳に前倒し`,
    },
    next30DaysAction: {
      title: "次の30日アクション（更新すべき数字と順番）",
      content: `【優先順位1】
- 現在の金融資産残高を確認（証券口座・銀行口座）
- 目標: 正確な数字を±50万円以内で把握

【優先順位2】
- 月次支出の実績を3ヶ月分集計
- 目標: 固定費と変動費を分離

【優先順位3】
- 物件価格の相場を3〜5件リサーチ
- 目標: 希望エリアの価格レンジを把握`,
    },
  };

  const handleCopy = () => {
    const fullMemo = `
# 意思決定メモ

## ${memoContent.upperRange.title}
${memoContent.upperRange.content}

## ${memoContent.scenarioConclusion.title}
${memoContent.scenarioConclusion.content}

## ${memoContent.next30DaysAction.title}
${memoContent.next30DaysAction.content}
    `.trim();

    navigator.clipboard.writeText(fullMemo);
    setCopied(true);
    toast.success("メモをコピーしました");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/pass/onboarding")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <h1 className="text-xl font-bold">Decision Memo - 意思決定メモ</h1>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  コピー済み
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  全体をコピー
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Decision Memo Content */}
        <section className="container py-8 max-w-4xl">
          <div className="mb-6">
            <p className="text-muted-foreground">
              あなたの状況に合わせた意思決定メモです。このメモをコピーして、今後の検討に活用してください。
            </p>
          </div>

          <div className="space-y-6">
            {/* Block 1: Upper Range */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{memoContent.upperRange.title}</h2>
              <Textarea
                value={memoContent.upperRange.content}
                readOnly
                className="min-h-[200px] font-mono text-sm"
              />
            </Card>

            {/* Block 2: Scenario Conclusion */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{memoContent.scenarioConclusion.title}</h2>
              <Textarea
                value={memoContent.scenarioConclusion.content}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </Card>

            {/* Block 3: Next 30 Days Action */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{memoContent.next30DaysAction.title}</h2>
              <Textarea
                value={memoContent.next30DaysAction.content}
                readOnly
                className="min-h-[250px] font-mono text-sm"
              />
            </Card>
          </div>

          <div className="mt-8 p-4 bg-accent/10 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>ヒント：</strong>このメモは、Cockpitでレバーを操作するたびに自動更新されます。定期的に見直して、最新の状況を反映させましょう。
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Exit Readiness OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
