import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Mail, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function FitResult() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<"prep" | "pass" | "session" | null>(null);

  useEffect(() => {
    // Get result from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const resultParam = params.get("result") as "prep" | "pass" | "session" | null;
    setResult(resultParam);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container py-4">
            <h1 className="text-xl font-bold">Exit Readiness OS - 適合チェック結果</h1>
          </div>
        </header>

        {/* Result Content */}
        <section className="container py-12 max-w-3xl">
          {result === "prep" && <PrepResult setLocation={setLocation} />}
          {result === "pass" && <PassResult />}
          {result === "session" && <SessionResult />}
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

// Prep Mode Result Component
function PrepResult({ setLocation }: { setLocation: (path: string) => void }) {
  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
          <Mail className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Prep Mode をおすすめします</h2>
        <p className="text-muted-foreground">
          まずは準備を整えてから、再度適合チェックにお越しください
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Prep Mode とは</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Exit Readiness OS を使いこなすための準備ガイドです。年収・資産・支出の整理方法、数字の扱い方、よくある質問への回答などを、メールレターでお届けします。
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">こんな方におすすめ</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>まだ年収・資産・支出を整理できていない</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>数字を入力することに抵抗がある</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>まず概要だけ知りたい</span>
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => setLocation("/prep-mode")}
          >
            Prep Mode に登録する
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            準備が整ったら、再度適合チェックにお越しください。<br />
            招待トークンをお持ちの方は、適合チェック時に入力してください。
          </p>
        </div>
      </div>
    </Card>
  );
}

// Pass Result Component
function PassResult() {
  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Pass（推奨）</h2>
        <p className="text-muted-foreground">
          Exit Readiness OS の利用に適した状態です
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">次のステップ</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            現在、Exit Readiness OS はクローズドβ版として、招待制で1on1テストセッションを実施しています。
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            招待トークンをお持ちの方は、適合チェック時に入力することで、Session に進むことができます。
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">招待トークンをお持ちでない方</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            現在、招待トークンの新規発行は、既存ユーザーからの紹介のみとなっております。
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ご興味がある方は、Prep Mode に登録いただくと、今後の展開をメールでお知らせします。
          </p>
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = "/prep-mode"}
          >
            Prep Mode に登録する
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            招待トークンをお持ちの方は、適合チェックページに戻って入力してください。
          </p>
        </div>
      </div>
    </Card>
  );
}

// Session Result Component
function SessionResult() {
  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Session 解放</h2>
        <p className="text-muted-foreground">
          1on1テストセッションにご参加いただけます
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">次のステップ</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            招待トークンが確認されました。1on1テストセッションの詳細を、ご登録いただいたメールアドレスにお送りします。
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">1on1テストセッションの内容</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>所要時間: 90分</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>形式: オンライン（Zoom）</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>内容: 住宅・キャリア・ライフイベントを横断した世界線比較</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>出口: 数字と世界線をフラットに見せる（特定の商品や物件の販売はありません）</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            ご不明な点がございましたら、メールにてお問い合わせください。
          </p>
        </div>
      </div>
    </Card>
  );
}
