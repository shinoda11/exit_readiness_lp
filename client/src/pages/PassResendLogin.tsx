import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";

export default function PassResendLogin() {
  const [email, setEmail] = useState("");
  const [loginInfo, setLoginInfo] = useState<{ loginId: string; loginPassword: string } | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<"id" | "password" | null>(null);

  const resendMutation = trpc.pass.resendLoginInfo.useMutation({
    onSuccess: (data) => {
      setLoginInfo(data);
      setError("");
    },
    onError: (err) => {
      setError(err.message);
      setLoginInfo(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    resendMutation.mutate({ email });
  };

  const copyToClipboard = async (text: string, field: "id" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">ログイン情報の再送</CardTitle>
          <CardDescription>
            Pass購入時のメールアドレスを入力してください。ログインID/パスワードを再表示します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loginInfo ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={resendMutation.isPending}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending ? "確認中..." : "ログイン情報を再表示"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                メールアドレスが見つからない場合は、購入時のメールをご確認いただくか、サポートまでお問い合わせください。
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  ログイン情報が見つかりました
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ログインID</label>
                  <div className="flex gap-2">
                    <Input
                      value={loginInfo.loginId}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(loginInfo.loginId, "id")}
                    >
                      {copiedField === "id" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">パスワード</label>
                  <div className="flex gap-2">
                    <Input
                      value={loginInfo.loginPassword}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(loginInfo.loginPassword, "password")}
                    >
                      {copiedField === "password" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  このログイン情報でVercel版アプリにアクセスできます：
                </p>
                <Button
                  asChild
                  className="w-full"
                >
                  <a
                    href="https://exit-readiness-os.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vercel版アプリを開く →
                  </a>
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setLoginInfo(null);
                  setEmail("");
                }}
              >
                別のメールアドレスで確認
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
