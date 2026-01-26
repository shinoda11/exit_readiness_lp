import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PassUpgrade() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Upgrade理由を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Call backend API to submit upgrade request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      toast.success("Upgrade申請を送信しました");
    } catch (error) {
      toast.error("申請の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container py-4">
              <h1 className="text-xl font-bold">Upgrade申請</h1>
            </div>
          </header>

          {/* Success Message */}
          <section className="container py-12 max-w-2xl">
            <Card className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">申請を受け付けました</h2>
                <p className="text-muted-foreground mb-6">
                  Upgrade申請を確認次第、48時間以内にメールでご連絡いたします。
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/pass/onboarding")}
                >
                  Onboardingに戻る
                </Button>
              </div>
            </Card>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/pass/onboarding")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
            <h1 className="text-xl font-bold">Upgrade申請 - Decision Sessionへ</h1>
          </div>
        </header>

        {/* Upgrade Form */}
        <section className="container py-8 max-w-2xl">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Decision Sessionへのアップグレード</h2>
              <p className="text-sm text-muted-foreground">
                Pass利用者は、Decision Sessionへのアップグレードを申請できます。承認された場合、48時間以内に決済リンクをメールでお送りします。
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Decision Sessionとは</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>所要時間: 90分（オンライン）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>内容: 住宅・キャリア・ライフイベントを横断した世界線比較</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>出口: 数字と世界線をフラットに見せる（特定の商品や物件の販売はありません）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>価格: ¥50,000（Pass購入者限定）</span>
                  </li>
                </ul>
              </div>

              <div>
                <Label htmlFor="reason">Upgrade理由（必須）</Label>
                <Textarea
                  id="reason"
                  placeholder="Decision Sessionで相談したい内容や、Upgradeを希望する理由を簡潔にご記入ください（200字程度）"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-2 min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  例: 「持ち家購入を検討中だが、キャリアチェンジも考えており、両方を考慮した世界線比較をしたい」
                </p>
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    "Upgrade申請を送信"
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>注意：</strong>申請は承認制です。承認された場合のみ、48時間以内に決済リンクをメールでお送りします。決済リンクは1回限り有効で、期限は48時間です。
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 YOHACK. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
