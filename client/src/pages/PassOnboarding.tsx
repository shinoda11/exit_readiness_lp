import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function PassOnboarding() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get email from session or URL params
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    
    // TODO: Verify session_id with backend and get email
    // For now, use localStorage or prompt user
    const storedEmail = localStorage.getItem("user_email");
    setEmail(storedEmail);
  }, []);

  const tasks = [
    {
      id: 1,
      title: "シナリオ比較を体験",
      description: "Rent/Buy/Buy+Shockの3つの世界線を比較してみましょう",
      completed: false,
      action: () => setLocation("/pass/cockpit?task=compare"),
    },
    {
      id: 2,
      title: "レバーを操作してみる",
      description: "物件価格や頭金を変更して、結果の変化を確認しましょう",
      completed: false,
      action: () => setLocation("/pass/cockpit?task=lever"),
    },
    {
      id: 3,
      title: "意思決定メモを生成",
      description: "あなたの状況に合わせた意思決定メモを作成しましょう",
      completed: false,
      action: () => setLocation("/pass/memo?task=generate"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container py-4">
            <h1 className="text-xl font-bold">Exit Readiness OS - Pass Onboarding</h1>
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
              まずは3つのタスクを体験して、Exit Readiness OS Passの使い方を学びましょう
            </p>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-accent">{task.id}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={task.action}
                    >
                      始める
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  {task.completed && (
                    <div className="flex-shrink-0">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-accent/10 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>ヒント：</strong>3つのタスクを完了すると、Upgrade申請（Decision Sessionへの昇格）が可能になります。
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
