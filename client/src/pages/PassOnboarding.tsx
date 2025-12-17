import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ExternalLink, Copy, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function PassOnboarding() {
  const [email, setEmail] = useState<string | null>(null);
  const [loginId, setLoginId] = useState<string | null>(null);
  const [loginPassword, setLoginPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get session_id from URL to fetch Stripe session details
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  const getStripeSession = trpc.pass.getStripeSession.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId }
  );

  const getPassSubscription = trpc.pass.getSubscription.useQuery(
    { email: email || "" },
    { enabled: !!email }
  );

  useEffect(() => {
    // Get email from Stripe session
    if (getStripeSession.data?.email) {
      setEmail(getStripeSession.data.email);
    }
    
    setLoading(false);
  }, [getStripeSession.data]);

  useEffect(() => {
    if (getPassSubscription.data) {
      setLoginId(getPassSubscription.data.loginId || null);
      setLoginPassword(getPassSubscription.data.loginPassword || null);
    }
  }, [getPassSubscription.data]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label}をコピーしました`);
  };

  if (loading || getPassSubscription.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container py-4">
            <h1 className="text-xl font-bold">Exit Readiness OS - Pass</h1>
          </div>
        </header>

        {/* Onboarding Content */}
        <section className="container py-12 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pass購入ありがとうございます！</h2>
            <p className="text-muted-foreground">
              Exit Readiness OS Pass（90日間）のご利用を開始できます
            </p>
          </div>

          {/* Login Credentials Card */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">ログイン情報</h3>
            <p className="text-sm text-muted-foreground mb-4">
              以下のログインID/パスワードを使用して、Exit Readiness OS アプリにアクセスしてください。
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">ログインID</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={loginId || "読み込み中..."}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-muted"
                  />
                  {loginId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(loginId, "ログインID")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">パスワード</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={loginPassword || "読み込み中..."}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-muted font-mono"
                  />
                  {loginPassword && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(loginPassword, "パスワード")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full"
                onClick={() => window.open("https://exit-readiness-os.vercel.app/", "_blank")}
              >
                Exit Readiness OS アプリを開く
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              ※ ログイン情報は大切に保管してください。90日間有効です。
            </p>
          </Card>

          {/* What You Can Do */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Passでできること</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Asset Cockpit</strong> - 収入・支出・資産から「何歳まで働けば資産が尽きないか」を可視化</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Exit Readiness Score</strong> - Survival/Lifestyle/Risk/Liquidityの4指標で現在地を数値化</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>資産推移シミュレーション</strong> - 35歳〜100歳までの資産推移を4つのビューで表示</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>戦略アドバイス</strong> - NEXT ACTIONS（次の一手）と具体的な改善提案</span>
              </li>
            </ul>
          </Card>

          {/* Upgrade to Session */}
          <Card className="p-6 bg-accent/10">
            <h3 className="font-semibold mb-2">Decision Sessionへのアップグレード</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Passを使い込んだ後、より深い意思決定サポートが必要な場合は、Decision Session（1on1、90分）へのアップグレード申請が可能です。
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/pass/upgrade"}
            >
              Upgrade申請フォームへ
            </Button>
          </Card>
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
