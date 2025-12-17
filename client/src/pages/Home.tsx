import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Check, TrendingUp, Target, Layers } from "lucide-react";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
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

    [heroRef, problemRef, solutionRef, featuresRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [currentHousing, setCurrentHousing] = useState<"賃貸" | "持ち家" | "">("");
  const [incomeRange, setIncomeRange] = useState<"1000-1500" | "1500-2000" | "2000-3000" | "3000以上" | "">("");
  const [propertyRange, setPropertyRange] = useState<"賃貸継続" | "6000" | "8000" | "1億以上" | "">("");
  const [goalMode, setGoalMode] = useState<"守り" | "ゆるExit" | "フルFIRE視野" | "">("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
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

  const submitMutation = trpc.testSession.submit.useMutation({
    onSuccess: () => {
      setShowThankYou(true);
      toast.success("応募ありがとうございます");
      // フォームをリセット
      setEmail("");
      setName("");
      setCurrentHousing("");
      setIncomeRange("");
      setPropertyRange("");
      setGoalMode("");
      setPreferredTime("");
      setNotes("");
    },
    onError: (error: any) => {
      toast.error("応募に失敗しました: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent, location: "hero" | "form") => {
    e.preventDefault();
    
    if (!email || !currentHousing || !incomeRange || !propertyRange || !goalMode) {
      toast.error("必須項目を入力してください");
      return;
    }

    // GTMイベント送信
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: location === "hero" ? "cta_click_hero" : "cta_click_form",
      });
    }

    submitMutation.mutate({
      email,
      name: name || undefined,
      currentHousing,
      incomeRange,
      propertyRange,
      goalMode,
      preferredTime: preferredTime || undefined,
      notes: notes || undefined,
      ...utmParams,
    });
  };

  const scrollToCTA = () => {
    const ctaElement = document.getElementById("application-form");
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
            <div className="inline-block px-4 py-2 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium mb-4">
              高収入DINKs向け 住宅シミュレーター β版
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              家を買うか迷う時間を、<br />
              「賃貸 vs 購入」の<br />
              世界線比較に変える。
            </h1>
            <p className="text-base text-muted-foreground mb-4">
              都内DINK/プレDINK・世帯年収1,500〜3,000万円・6,000〜8,000万円レンジで迷っている方へ
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Rent と Buy を同じ前提で二本線として並べ、40〜50代のキャッシュフロー余裕、60歳資産、取り崩し開始年が一気に見えます。結論を押し付けず、「どの年代に余白が欲しいかで選べる」設計です。
            </p>
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6"
                onClick={scrollToCTA}
              >
                1on1テストセッションに応募する
              </Button>
              <p className="text-sm text-muted-foreground">
                年収1,000〜2,000万円・パートナーあり（DINKs or 子ども1人）の方向け。先着10〜30名。
              </p>
            </div>
          </div>

          {/* 右側：Mini Cockpit */}
          <div className="relative">
            <Card className="p-8 bg-card shadow-lg">
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">比較例：年収1,500万円、金融資産3,000万円</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">賃貸継続</span>
                    <span className="text-sm font-medium text-muted-foreground">購入（8,000万）</span>
                  </div>
                  <div className="h-32 relative">
                    {/* 簡易的なグラフのイメージ */}
                    <svg viewBox="0 0 400 120" className="w-full h-full">
                      <line x1="0" y1="100" x2="400" y2="20" stroke="oklch(0.50 0.08 150)" strokeWidth="2.5" />
                      <line x1="0" y1="90" x2="400" y2="50" stroke="oklch(0.45 0.02 220)" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-accent">40代余裕</p>
                      <p className="text-xs text-muted-foreground">CF margin</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-accent">60歳資産</p>
                      <p className="text-xs text-muted-foreground">Assets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-accent">取崩開始</p>
                      <p className="text-xs text-muted-foreground">Drawdown</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground pt-4 border-t border-border">
                  二本線と3指標で、「どちらがどの年代で楽か」を会話できるようにします。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* こんな状態を解決するセクション */}
      <section ref={problemRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            年収も貯蓄もあるのに、<br />「買っていい」と言い切れない。
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            都内在住、世帯年収1,500〜3,000万円。金融資産も数千万円ある。それでも、6,000万にするか、8,000万にするか、あるいは1億まで攻めるかで数年単位で止まっている。計算しても変数が多すぎて決めきれない。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "6,000万 vs 8,000万で止まっている",
              "手取りベースと体感がズレている",
              "退職後のグラフを見るのが怖い",
              "FIREではなく「レールから外れる自由」が欲しい",
              "パートナーとの議論が感覚論で終わっている",
            ].map((text, index) => (
              <Card key={index} className="p-6 bg-card flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <p className="text-base">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 解き方セクション（3ステップ） */}
      <section ref={solutionRef} className="container py-16 md:py-24 opacity-0">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          現実のPLを揃え、世界線で比べ、<br />差分を余白に翻訳する。
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              icon: <Layers className="w-6 h-6" />,
              title: "現実の前提を揃える",
              description: "手取りベースの世帯サマリーを作成します。実効税率は自動推定されますが、固定値を入力することもできます。黒字は投資として反映され、資産推移に乗ります。",
            },
            {
              step: "2",
              icon: <TrendingUp className="w-6 h-6" />,
              title: "Rent vs Buy を世界線として比較する",
              description: "賃貸継続と購入を、同じ前提で二本線として並べます。40〜50代のキャッシュフロー余裕、60歳時点の資産、取り崩し開始年の3指標で、「どの年代でどちらの方が楽か」を会話できるようにします。",
            },
            {
              step: "3",
              icon: <Target className="w-6 h-6" />,
              title: "差分を「人生の余白」に翻訳する",
              description: "Rent vs Buy の差分（Δ）を、旅・投資・自由時間・セーフティマージンなどに翻訳します。働き方モードを設定し、同じ数字でも読み方がぶれないようにします。",
            },
          ].map((item) => (
            <Card key={item.step} className="p-8 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div className="text-accent">{item.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 主要機能セクション（5カード） */}
      <section ref={featuresRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            主要機能
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Rent vs Buy レンズ",
                description: "賃貸継続と購入を、同じ前提で二本線として並べます。金融資産レンズと総資産レンズを切り替えることで、「売却しない限り使えない資産」と「流動性のある資産」を分けて見ることができます。",
              },
              {
                title: "3指標＋drawdown",
                description: "40〜50代のキャッシュフロー余裕、60歳時点の資産、資産取り崩し開始年の3つの指標を表示します。加えて、100歳まで資産が尽きない確率と、取り崩し後のおおよそのペースも確認できます。",
              },
              {
                title: "Buy Now 条件入力",
                description: "物件価格、頭金、購入諸費用、金利、ローン年数を変えながら比較できます。6,000万、8,000万、1億といった複数のシナリオを試すことで、「どこまで攻めてよいか」を判断できます。",
              },
              {
                title: "Goal Lens",
                description: "働き方モード（守り／ゆるExit／フルFIRE視野）、残し方スタンス、ライフイベントタグを設定し、同じ数字でも読み方がぶれないようにします。FIREを目指していなくても使えます。",
              },
              {
                title: "信頼性のためのエンジン",
                description: "税・社会保険は実効税率の目安で推定されますが、手動調整も可能です。総資産は現金と同じではなく、売却しない限り使えない資産を含みます。前提を明示することで、数字を押し付けない設計にしています。",
              },
            ].map((feature, index) => (
              <Card key={index} className="p-8 bg-card">
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* モデルの前提と制約セクション */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 max-w-4xl mx-auto">
          数字は"決めるための目安"であって、<br />将来を保証するものではありません。
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              title: "税・社会保険",
              content: "実効税率の目安で推定しています。手動調整も可能ですが、税務ソフトではありません。",
            },
            {
              title: "住宅価格",
              content: "将来の価格変動や住み替えのシナリオは完全には再現していません。",
            },
            {
              title: "投資助言ではない",
              content: "これは意思決定の整理ツールであり、特定の金融商品や不動産の販売を推奨するものではありません。",
            },
            {
              title: "前提の明示",
              content: "入力と挙動が不一致にならないように設計していますが、すべてのケースを網羅するものではありません。",
            },
          ].map((item, index) => (
            <Card key={index} className="p-6 bg-card">
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.content}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQセクション */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            よくある質問
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="q1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                FIREを目指していなくても使えますか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                はい。働き方モード（守り／ゆるExit／フルFIRE視野）を設定することで、同じ数字でも読み方がぶれないようにします。「いつ会社を変えてもいい」程度の自由を設計したい方にも適しています。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                手取り計算の精度はどれくらいですか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                実効税率の目安で推定しています。税務ソフトではありませんが、まず手取りの実感に近づけるための目安として使えます。固定値を入力することもできます。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                購入が不利に見えるケースについて教えてください
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                金融資産レンズで見ると、購入は頭金や諸費用で流動性が減るため、短期的には不利に見えることがあります。総資産レンズに切り替えると、住まいの純資産が加わるため、長期的には有利に見えることがあります。どちらが「正しい」かではなく、「どの年代に余白が欲しいか」で選べるようにしています。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                既に持ち家がある場合はどうすればよいですか？
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                現在のβ版は「賃貸継続 vs 今すぐ購入」に特化しています。既に持ち家がある場合の住み替えシナリオは、今後のアップデートで対応予定です。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 申込フォームセクション */}
      <section id="application-form" className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            1on1テストセッションに応募する
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            事前にいくつかの情報を入力していただき、条件が近い方から順にご案内します。セッションでは、あなたの前提を入力しながら、Rent vs Buy の世界線比較を一緒に見ていきます。所要時間は30〜60分を想定しています。
          </p>

          {showThankYou ? (
            <Card className="p-12 bg-card text-center">
              <h3 className="text-2xl font-bold mb-4">応募ありがとうございます</h3>
              <p className="text-muted-foreground">
                条件が近い方から順にご案内します。しばらくお待ちください。
              </p>
            </Card>
          ) : (
            <Card className="p-8 bg-card">
              <form onSubmit={(e) => handleSubmit(e, "form")} className="space-y-6">
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
                  <Label htmlFor="name">お名前（任意）</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="山田 太郎"
                  />
                </div>

                <div className="space-y-2">
                  <Label>居住形態 *</Label>
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
                  <Label htmlFor="income">世帯年収レンジ *</Label>
                  <Select value={incomeRange} onValueChange={(v) => setIncomeRange(v as any)}>
                    <SelectTrigger id="income">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000-1500">1,000〜1,500万円</SelectItem>
                      <SelectItem value="1500-2000">1,500〜2,000万円</SelectItem>
                      <SelectItem value="2000-3000">2,000〜3,000万円</SelectItem>
                      <SelectItem value="3000以上">3,000万円以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property">検討中物件レンジ *</Label>
                  <Select value={propertyRange} onValueChange={(v) => setPropertyRange(v as any)}>
                    <SelectTrigger id="property">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="賃貸継続">賃貸継続</SelectItem>
                      <SelectItem value="6000">6,000万円</SelectItem>
                      <SelectItem value="8000">8,000万円</SelectItem>
                      <SelectItem value="1億以上">1億円以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Goal Mode *</Label>
                  <Select value={goalMode} onValueChange={(v) => setGoalMode(v as any)}>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="守り">守り</SelectItem>
                      <SelectItem value="ゆるExit">ゆるExit</SelectItem>
                      <SelectItem value="フルFIRE視野">フルFIRE視野</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">1on1希望時間帯（任意）</Label>
                  <Input
                    id="time"
                    type="text"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    placeholder="例: 平日夜、土日午前"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">自由記述欄（任意）</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="その他、お伝えしたいことがあればご記入ください"
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? "送信中..." : "この内容で応募する"}
                </Button>
              </form>
            </Card>
          )}
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
