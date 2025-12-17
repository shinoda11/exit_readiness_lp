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
import { Check, TrendingUp, Target, Layers, Shield, LineChart, Wallet } from "lucide-react";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const approachRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLElement>(null);

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

    [heroRef, problemRef, approachRef, metricsRef].forEach((ref) => {
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
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              賃貸を続けるか、都心でマンションを買うか。6,000万か、8,000万か。<br />
              Exit Readiness OS は、年収1,000〜2,000万円クラスの共働き世帯向けに、賃貸継続と購入の二つの世界線を同じ前提で並べて比較するシミュレーターです。40〜50代のキャッシュフロー余裕、60歳時点の資産、資産取り崩し開始年まで一度に見えるようにし、「どこまで攻めてよいか」と「どこに余白を残すか」を数字で決められるようにします。
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
                対象：年収1,000〜2,000万円・パートナーあり（DINKs または子ども1人）・都内在住の方を想定しています。
              </p>
            </div>
          </div>

          {/* 右側：Mini Cockpit */}
          <div className="relative">
            <Card className="p-8 bg-card shadow-lg">
              <div className="space-y-6">
                <h3 className="text-lg font-bold mb-4">【前提例：年収1,500万円／金融資産3,000万円】</h3>
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
                  賃貸継続と「8,000万円の物件を35年ローンで購入」の2本線を、同じ前提で比較したイメージです。<br />
                  実際のアプリでは、このグラフに 40〜50代のCF余裕・60歳資産・取り崩し開始年などの指標が重なります。
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
            都内でそこそこの賃貸に住みながら、数年分の貯蓄と投資も積み上がってきた。<br />
            6,000万なら行けそうな気もするし、8,000万でも大丈夫かもしれない。<br />
            でも、40代・50代の余裕や、退職後の資産の減り方まで考え出すと、Excelだけでは判断が止まってしまう──そういう状態の人のためのツールです。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "6,000万と8,000万、\nどこまで攻めていいか分からない",
              "頭金をどれくらい入れるべきか、\nもしくは入れない方がいいのか迷っている",
              "40〜50代の「可処分キャッシュ」を\nどこまで確保しておくべきか決めきれない",
              "退職後の資産が\n「いつ・どれくらいのペースで減るか」が怖くて判断できない",
            ].map((text, index) => (
              <Card key={index} className="p-6 bg-card flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <p className="text-base whitespace-pre-line">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 新セクション：同じ前提で、未来を並べる */}
      <section ref={approachRef} className="container py-16 md:py-24 opacity-0">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          同じ前提で、未来を並べる。
        </h2>
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Exit Readiness OS は、「計算量を増やす」のではなく、「前提と比較軸を揃える」ことにフォーカスしています。<br />
          手取りベースのPLに落とし、賃貸と購入の2つの世界線を同じスケールで並べることで、感覚論ではなく、どの年代に余白を置くかで選べる状態をつくります。
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              icon: <Layers className="w-6 h-6" />,
              title: "現実のPLを揃える",
              description: "年収・ボーナス・貯蓄・投資額・生活費・ローン残高などを入力し、手取りベースの家計に落とし込みます。黒字は自動で投資に回り、退職金や企業DCなどのロック資産は別枠で扱います。",
            },
            {
              step: "2",
              icon: <TrendingUp className="w-6 h-6" />,
              title: "Rent vs Buy を世界線として比較する",
              description: "「今の賃貸を続ける」「8,000万円の物件を35年ローンで買う」といったパターンを、二本線として並べます。40〜50代のキャッシュフロー余裕、60歳時点資産、資産取り崩し開始年などを、両方の世界線で同じ指標で比較します。",
            },
            {
              step: "3",
              icon: <Target className="w-6 h-6" />,
              title: "差分を\"人生の余白\"に翻訳する",
              description: "Rent と Buy の差分Δを、「旅に使える予算」「追加投資に回せる額」「残業を減らせる期間」などに翻訳します。どの年代の余白を厚くするかを、パートナーと具体的に話せる状態まで持っていきます。",
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

      {/* 新セクション：見えるようになること */}
      <section ref={metricsRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            このツールで、具体的に見えるようになること。
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            ただ「総資産がいくらになるか」ではなく、「いつ・どのフェーズでどれくらい余裕があるか」を見るための指標を揃えています。
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "安心ライン（守るべき下限）",
                description: "資産が尽き始める年齢と、その後の取り崩しペースを、賃貸／購入それぞれで把握できます。",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "40〜50代のキャッシュフロー余裕",
                description: "子どもの教育費やキャリアチェンジを踏まえて、どこまで「攻めた年収ダウン」を許容できるかを見ます。",
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: "60歳時点の資産",
                description: "退職のタイミングでどれくらいの資産を持っていたいか、Rent／Buy それぞれの世界線で比較します。",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "頭金のインパクト",
                description: "頭金を多く入れる／あえて温存する場合の差分が、老後ではなく「今〜10年」の生活にどう効くかを可視化します。",
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Goal Lens による読み方の違い",
                description: "「守り重視」「ゆるExit」「FIRE視野」のモードを選ぶことで、同じ数字でもどこに注目すべきかのガイドが変わります。",
              },
            ].map((item, index) => (
              <Card key={index} className="p-6 bg-card flex items-start gap-4">
                <div className="text-accent flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
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
              title: "税制は実効税率による概算",
              content: "個別控除・特例までは完全には織り込んでいません。手取りの実感に近づけるための目安として使えます。",
            },
            {
              title: "住宅価格の上下、売却・住み替えイベント",
              content: "現時点では簡易的な扱いです。将来の価格変動や住み替えのシナリオは完全には再現していません。",
            },
            {
              title: "投資助言・販売推奨ではない",
              content: "このツール自体は特定の物件や金融商品の販売・推奨を目的としたものではありません。意思決定の整理ツールとしてご利用ください。",
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
            現在は少人数のクローズドテストとして、1on1でのオンラインセッションを行っています。<br />
            事前にいくつかの情報を入力いただき、条件が近い方から順にご案内します。<br />
            セッションでは、実際の画面を共有しながら、あなたのRent vs Buyの世界線をその場で一緒に見ていきます。
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
