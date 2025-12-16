import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ChevronDown, Check } from "lucide-react";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const painRef = useRef<HTMLElement>(null);
  const solutionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    [heroRef, painRef, solutionRef, featuresRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const [email, setEmail] = useState("");
  const [currentHousing, setCurrentHousing] = useState<"賃貸" | "持ち家" | "">("");
  const [purchaseStatus, setPurchaseStatus] = useState<"検討中" | "未検討" | "購入済" | "">("");
  const [incomeRange, setIncomeRange] = useState("");
  const [propertyRange, setPropertyRange] = useState("");
  const [workStyle, setWorkStyle] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [oneOnOneInterest, setOneOnOneInterest] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // UTMパラメータの取得
  const [utmParams, setUtmParams] = useState({
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
      utmContent: params.get("utm_content") || "",
    });
  }, []);

  const submitMutation = trpc.waitlist.submit.useMutation({
    onSuccess: () => {
      setShowThankYou(true);
      toast.success("登録ありがとうございます");
      // フォームをリセット
      setEmail("");
      setCurrentHousing("");
      setPurchaseStatus("");
      setIncomeRange("");
      setPropertyRange("");
      setWorkStyle("");
      setInterests([]);
      setOneOnOneInterest(false);
    },
    onError: (error) => {
      toast.error("登録に失敗しました: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent, location: "hero" | "mid") => {
    e.preventDefault();
    
    if (!email || !currentHousing || !purchaseStatus) {
      toast.error("必須項目を入力してください");
      return;
    }

    // GTMイベント送信
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: location === "hero" ? "cta_click_hero" : "cta_click_mid",
      });
    }

    submitMutation.mutate({
      email,
      currentHousing,
      purchaseStatus,
      incomeRange: incomeRange || undefined,
      propertyRange: propertyRange || undefined,
      workStyle: workStyle || undefined,
      interests: interests.length > 0 ? interests : undefined,
      oneOnOneInterest,
      ...utmParams,
    });
  };

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const scrollToCTA = () => {
    const ctaElement = document.getElementById("waitlist-form");
    if (ctaElement) {
      ctaElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ヒーローセクション */}
      <section ref={heroRef} className="container py-16 md:py-24 lg:py-32 opacity-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左側：テキスト */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              家を買うか迷う時間を、<br />納得できる判断に変える
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              賃貸と購入の未来を同じ前提で並べて、40〜50代の余裕、老後の取り崩し開始、60歳時点の資産まで一気に見せます。結論は押し付けません。
            </p>
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6"
                onClick={scrollToCTA}
              >
                ウェイティングリストに登録
              </Button>
              <p className="text-sm text-muted-foreground">登録は30秒、無料</p>
            </div>
          </div>

          {/* 右側：ビジュアル */}
          <div className="relative">
            <Card className="p-8 bg-card shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">賃貸継続</span>
                  <span className="text-sm font-medium text-muted-foreground">購入</span>
                </div>
                <div className="h-48 relative">
                  {/* 簡易的なグラフのイメージ */}
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <line x1="0" y1="180" x2="400" y2="20" stroke="oklch(0.50 0.08 150)" strokeWidth="3" />
                    <line x1="0" y1="150" x2="400" y2="80" stroke="oklch(0.45 0.02 220)" strokeWidth="3" />
                  </svg>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">40代</p>
                    <p className="text-xs text-muted-foreground">余裕</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">60歳</p>
                    <p className="text-xs text-muted-foreground">資産</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">取崩開始</p>
                    <p className="text-xs text-muted-foreground">年齢</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 痛みの言語化セクション */}
      <section ref={painRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            迷うのは、計算が足りないからではありません
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "いまの年収が続く確信がない",
              "家を買った瞬間に、自由が減る気がする",
              "退職後の資産減少が怖くて、判断が止まる",
              "数字を見ても「じゃあどうする?」に落ちない",
            ].map((text, index) => (
              <Card key={index} className="p-6 bg-card">
                <p className="text-lg">{text}</p>
              </Card>
            ))}
          </div>
          <p className="text-center mt-12 text-lg text-muted-foreground">
            Exit Readiness OSは、損得ではなく「安心ラインと余白」を軸に、判断を前に進めます。
          </p>
        </div>
      </section>

      {/* 解決の仕方セクション */}
      <section ref={solutionRef} className="container py-16 md:py-24 opacity-0">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          同じ前提で、未来を並べる
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              title: "いまの前提を揃える",
              description: "手取り、住居費、ローン、入金ペース",
            },
            {
              step: "2",
              title: "賃貸と購入の未来を並べて見る",
              description: "どの年代が楽か",
            },
            {
              step: "3",
              title: "余白が何を増やすかを言葉にする",
              description: "旅、投資、自由時間",
            },
          ].map((item) => (
            <Card key={item.step} className="p-8 bg-card text-center">
              <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 主要機能セクション */}
      <section ref={featuresRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            見えるようになること
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "安心ライン",
                items: [
                  "100歳まで資産が尽きにくい確率",
                  "取り崩し開始年齢と、おおよその取り崩しペース",
                  "40〜50代の余裕（CFマージン）",
                ],
              },
              {
                title: "未来の比較",
                items: [
                  "賃貸と購入を二本線で比較",
                  "総資産と流動資産の違いが説明できる表示",
                  "頭金を入れる／入れないも比較に反映",
                ],
              },
              {
                title: "次の一手が言語化される",
                items: [
                  "余白を「旅／投資／自由時間」に翻訳",
                  "結論を押し付けず、選べる形で出す",
                ],
              },
            ].map((feature, index) => (
              <Card key={index} className="p-8 bg-card">
                <h3 className="text-2xl font-bold mb-6">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 信頼の担保セクション */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          数字を押し付けないために、前提を明示します
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            "税・社会保険は実効税率の目安で推定（手動調整も可能）",
            "総資産は現金と同じではありません（売却しない限り使えない資産を含む）",
            "これは投資助言ではなく、意思決定の整理ツールです",
          ].map((text, index) => (
            <Card key={index} className="p-6 bg-card">
              <p className="text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ウェイティングリストフォーム（中段） */}
      <section id="waitlist-form" className="bg-accent/5 py-16 md:py-24">
        <div className="container max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            ウェイティングリストに登録する
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            先行アクセスと、テスター募集の案内をお送りします。
          </p>

          {showThankYou ? (
            <Card className="p-12 bg-card text-center">
              <h3 className="text-2xl font-bold mb-4">登録ありがとうございます</h3>
              <p className="text-muted-foreground">
                先行案内が準備でき次第お送りします。
              </p>
            </Card>
          ) : (
            <Card className="p-8 bg-card">
              <form onSubmit={(e) => handleSubmit(e, "mid")} className="space-y-6">
                {/* 必須項目 */}
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>現在の住まい *</Label>
                  <RadioGroup value={currentHousing} onValueChange={(v) => setCurrentHousing(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="賃貸" id="rent" />
                      <Label htmlFor="rent" className="font-normal cursor-pointer">賃貸</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="持ち家" id="own" />
                      <Label htmlFor="own" className="font-normal cursor-pointer">持ち家</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>購入検討 *</Label>
                  <RadioGroup value={purchaseStatus} onValueChange={(v) => setPurchaseStatus(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="検討中" id="considering" />
                      <Label htmlFor="considering" className="font-normal cursor-pointer">検討中</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="未検討" id="not-considering" />
                      <Label htmlFor="not-considering" className="font-normal cursor-pointer">未検討</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="購入済" id="purchased" />
                      <Label htmlFor="purchased" className="font-normal cursor-pointer">購入済</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 任意項目 */}
                <div className="space-y-2">
                  <Label htmlFor="income">世帯年収レンジ（任意）</Label>
                  <Select value={incomeRange} onValueChange={setIncomeRange}>
                    <SelectTrigger id="income">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1500未満">1500万円未満</SelectItem>
                      <SelectItem value="1500-2000">1500-2000万円</SelectItem>
                      <SelectItem value="2000-3000">2000-3000万円</SelectItem>
                      <SelectItem value="3000以上">3000万円以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property">物件レンジ（任意）</Label>
                  <Select value={propertyRange} onValueChange={setPropertyRange}>
                    <SelectTrigger id="property">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="賃貸継続">賃貸継続</SelectItem>
                      <SelectItem value="6000">6000万円</SelectItem>
                      <SelectItem value="8000">8000万円</SelectItem>
                      <SelectItem value="10000以上">10000万円以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work">働き方の希望（任意）</Label>
                  <Select value={workStyle} onValueChange={setWorkStyle}>
                    <SelectTrigger id="work">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="守り">守り</SelectItem>
                      <SelectItem value="ゆるExit">ゆるExit</SelectItem>
                      <SelectItem value="フルFIRE視野">フルFIRE視野</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>興味のあるテーマ（任意・複数選択可）</Label>
                  {["住宅購入", "働き方を緩める", "子どもと教育", "海外イベント", "資産の使い方"].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={interest} className="font-normal cursor-pointer">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oneOnOne"
                    checked={oneOnOneInterest}
                    onCheckedChange={(checked) => setOneOnOneInterest(checked as boolean)}
                  />
                  <Label htmlFor="oneOnOne" className="font-normal cursor-pointer">
                    1on1参加を希望する
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? "送信中..." : "登録する"}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </section>

      {/* FAQセクション */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          よくある質問
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="q1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                FIREを目指していなくても使えますか
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                はい。働き方の前提を選び、同じ数字でも読み方がズレないように揃えます。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                総資産が増えるのは現金が増えたということですか
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                いいえ。住まいの純資産を含むため、売却しない限り生活費に使えるお金ではありません。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                税金はどれくらい正確ですか
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                税務ソフトではありません。まず手取りの実感に近づけるための目安です。調整もできます。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                入力したのに効いていない項目はありますか
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                ありません。入力と挙動が不一致にならないように設計しています。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-secondary/30 py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">免責事項</h3>
              <p className="text-sm text-muted-foreground">
                本サービスは投資助言ではありません。結果を保証するものではありません。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">プライバシー</h3>
              <p className="text-sm text-muted-foreground">
                取得したデータは適切に管理し、第三者に提供することはありません。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">お問い合わせ</h3>
              <p className="text-sm text-muted-foreground">
                ご質問はメールにてお問い合わせください。
              </p>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
            © 2025 Exit Readiness OS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
