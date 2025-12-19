import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ExternalLink, Copy, Loader2, CheckCircle2, Circle } from "lucide-react";
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

  const getOnboarding = trpc.pass.getOnboarding.useQuery(
    { email: email || "" },
    { enabled: !!email }
  );

  const updateOnboarding = trpc.pass.updateOnboarding.useMutation({
    onSuccess: () => {
      getOnboarding.refetch();
      toast.success("タスクを完了しました");
    },
  });

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

  const handleTaskComplete = (taskNumber: 1 | 2 | 3) => {
    if (!email) return;
    updateOnboarding.mutate({ email, taskNumber });
  };

  const task1Completed = getOnboarding.data?.task1AppOpened ?? false;
  const task2Completed = getOnboarding.data?.task2CompareViewed ?? false;
  const task3Completed = getOnboarding.data?.task3MemoGenerated ?? false;
  const allTasksCompleted = task1Completed && task2Completed && task3Completed;

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
              まずは3つのタスクを完了して、Exit Readiness OS Passの価値を体験してください
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
                onClick={() => {
                  window.open("https://exit-readiness-os.vercel.app/", "_blank");
                  if (!task1Completed) {
                    handleTaskComplete(1);
                  }
                }}
              >
                Exit Readiness OS アプリを開く
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              ※ ログイン情報は大切に保管してください。90日間有効です。<br />
              ログイン情報を失った場合は、<a href="/pass/resend-login" className="text-primary underline">こちら</a>から再表示できます。
            </p>
          </Card>

          {/* Onboarding 3 Tasks */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Onboarding 3タスク</h3>
            <p className="text-sm text-muted-foreground mb-6">
              以下の3つのタスクを完了すると、Decision Sessionへのアップグレード申請が可能になります。
            </p>
            
            <div className="space-y-4">
              {/* Task 1 */}
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                {task1Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium mb-1">タスク1：アプリを開いた</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    上の「Exit Readiness OS アプリを開く」ボタンをクリックしてアプリにアクセスしてください。
                  </p>
                  {!task1Completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTaskComplete(1)}
                    >
                      完了済みにする
                    </Button>
                  )}
                </div>
              </div>

              {/* Task 2 */}
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                {task2Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium mb-1">タスク2：シナリオ比較を1回見た</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Asset Cockpitでシナリオ比較（Rent/Buy/Buy+Shock）を確認してください。
                  </p>
                  {!task2Completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTaskComplete(2)}
                    >
                      完了済みにする
                    </Button>
                  )}
                </div>
              </div>

              {/* Task 3 */}
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                {task3Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium mb-1">タスク3：意思決定メモを1回生成した</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Decision Memoで意思決定メモを生成してください。
                  </p>
                  {!task3Completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTaskComplete(3)}
                    >
                      完了済みにする
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {allTasksCompleted && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  🎉 すべてのタスクが完了しました！Decision Sessionへのアップグレード申請が可能です。
                </p>
              </div>
            )}
          </Card>

          {/* Upgrade to Session */}
          {allTasksCompleted && (
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
          )}

          {!allTasksCompleted && (
            <Card className="p-6 bg-muted/50">
              <h3 className="font-semibold mb-2">Decision Sessionへのアップグレード</h3>
              <p className="text-sm text-muted-foreground">
                3つのタスクを完了すると、Decision Session（1on1、90分）へのアップグレード申請が可能になります。
              </p>
            </Card>
          )}
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
