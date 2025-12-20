import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRight,
  Check,
  Globe,
  Home as HomeIcon,
  Layers,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";




export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const osRef = useRef<HTMLElement>(null);
  const scenarioRef = useRef<HTMLElement>(null);
  const nowRef = useRef<HTMLElement>(null);
  const futureRef = useRef<HTMLElement>(null);

  const suitedRef = useRef<HTMLElement>(null);
  const constraintsRef = useRef<HTMLElement>(null);




  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0");
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    const refs = [
      heroRef,
      problemRef,
      osRef,
      scenarioRef,
      nowRef,
      futureRef,

      suitedRef,
      constraintsRef,

    ];

    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* S1: Heroセクション */}
        <section ref={heroRef} className="container py-16 md:py-24 lg:py-32 opacity-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左側：テキスト */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-accent/10 text-foreground rounded-full text-sm font-medium mb-4">
                高収入DINKs向け 意思決定OS β版
              </div>
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="inline-block">人生の大きな</span><span className="inline-block">選択を、</span><br />
                <span className="text-accent inline-block">「詰まない安心」と</span><br />
                <span className="text-accent inline-block">「やりたいこと</span><br className="md:hidden" />
                <span className="text-accent inline-block">の余白」で</span><br />
                <span className="inline-block">判断できる</span><span className="inline-block">意思決定OS</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                家・仕事・家族イベントが同時に揺れる前提で、複数の未来を同じ前提で並べます。<br />
                結論は押し付けず、納得できる判断の根拠と“次の一手”まで返します。
              </p>
              <p className="text-sm text-muted-foreground italic">                ※Exit＝働き方を緩めたり、辞めても詰まないための「選択肢」のこと（企業売却ではありません）
              </p>
              <div className="flex flex-col gap-4">
                <Button size="lg" className="w-full md:w-auto" onClick={() => {
                  trackEvent(AnalyticsEvents.LP_HERO_CTA_CLICKED);
                  window.location.href = "/fit-gate";
                }}>
                  適合チェックに進む
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <a
                  href="#evidence-pack-full"
                  className="text-sm text-accent hover:underline flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("evidence-pack-full")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  ↓ Evidence Pack（匿名ケース例）を見る
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                対象：年収1,000〜2,000万円・パートナーあり（DINKsまたは子ども1人）・東京都などで都市部在住の方を想定しています。<br />
                特に、都内で6,000〜8,000万円クラスのマンションを検討している、年収1,000〜2,000万円のDINK・プレDINK世帯の方を想定ユーザーとしています。
              </p>
            </div>

            {/* 右側：準備チェック3問 */}
            <div className="bg-card border rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6">適合チェック（12問）</h3>
              <div className="space-y-6">
                {/* Question 1 */}
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Q1. 世帯年収は？</p>
                  <p className="text-xs text-muted-foreground">
                    1,500万円以上の方を想定しています
                  </p>
                </div>

                {/* Question 2 */}
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Q2. 金融資産は？</p>
                  <p className="text-xs text-muted-foreground">
                    2,000万円以上の方を想定しています
                  </p>
                </div>

                {/* Question 3 */}
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Q3. 数字入力はできますか？</p>
                  <p className="text-xs text-muted-foreground">
                    年収・資産・支出・物件価格を入力できる方
                  </p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <p className="text-xs text-muted-foreground text-center">
                    いまこのOSを使う段階か、Prepが先かを判定します。申込みではなく、次のステップを決めるためのチェックです。
                  </p>
                  <p className="text-xs text-muted-foreground text-center italic">
                    ※表示は一部です（全12問）
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 証拠パックセクション */}
        <section className="py-12 md:py-16 bg-card border-y">
          <div className="container max-w-4xl">
            <h3 className="text-2xl font-bold text-center mb-8">迷いが“論点”に変わる理由</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Evidence 1 */}
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">同じ前提で並べる（世界線）</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      賃貸/購入を“同じ尺度”で比較します。<br />
                      <span className="text-xs opacity-70">例：今買う vs 後で買う</span>
                    </p>
                  </div>
                </div>
              </Card>

              {/* Evidence 2 */}
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">安心ラインを見える化</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      「ここを割ると厳しい」を先に掴みます。<br />
                      <span className="text-xs opacity-70">例：取り崩し開始の目安</span>
                    </p>
                  </div>
                </div>
              </Card>

              {/* Evidence 3 */}
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">余白を次の一手に翻訳</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      足りないなら、何を動かすかが分かります。<br />
                      <span className="text-xs opacity-70">例：支出/収入/タイミング</span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>


        {/* S2: 家だけじゃない。仕事も、子どもも、場所も、一緒に揺れている。 */}
        <section ref={problemRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
          <div className="container max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">
              家だけじゃない。<br />
              仕事も、子どもも、場所も、一緒に揺れている。
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              止まっている理由は「損得が分からない」ではなく、<br />
              安心ライン・余白・打ち手が同時に見えないから。<br />
              だから“結論”ではなく、“比較できる状態”を先に作ります。
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <HomeIcon className="w-6 h-6" />,
                  title: "家＋海外の両にらみ",
                  text: "都内で買うか迷う一方で、海外駐在の可能性もある。",
                },
                {
                  icon: <Calendar className="w-6 h-6" />,
                  title: "子どもプランが未確定",
                  text: "何人/いつ/教育方針で、必要コストが変わる。",
                },
              {
                  icon: <Briefcase className="w-6 h-6" />,
                  title: "年収が落ちる未来が怖い",
                  text: "2～3割落ちても耐えられるか分からない。",
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "価格帯の差が“いつ効くか”不明",
                  text: "6,000万と8,000万の差が、どの年代に効くか見えない。",
                },
              ].map((item, index) => (
                <Card key={index} className="p-6 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="text-accent mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* S3: Exit Readiness OS とは何か */}
        <section ref={osRef} className="container py-16 md:py-24 opacity-0">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Exit Readiness OS とは何か</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              縦割りの選択肢を、横串で比較する。<br />
              「どの人生を歩むか」を、安心ラインと人生の余白という2つの軸で見えるようにします。
            </p>
          </div>

          {/* 3つの柱 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {[
              {
                icon: <Layers className="w-6 h-6" />,
                title: "世界線",
                titleEn: "Worldline",
                subtitle: "「どの人生を歩くか」を並べて見る",
                description: "「どの人生を歩くか」を、同じ前提で並べて比較します。賃貸/購入、今買う/後で買う、働き方の変化も、1つの枠で扱います。",
                example: "",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "安心ライン",
                titleEn: "Safety Line",
                subtitle: "「守るべき下限」を見える化する",
                description: "守るべき下限を見える化します。“ここを割ると厳しい”が分かると、判断の軸が定まります。",
                example: "",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "余白",
                titleEn: "Slack",
                subtitle: "「どこに余白を置くか」で選ぶ",
                description: "余白は「どの年代に、どれだけ残るか」。余白が足りないなら、収入/支出/タイミングのどれを動かすかに翻訳します。",
                example: "",
              },
            ].map((item, index) => (
              <Card key={index} className="p-8 bg-card">
                <div className="text-accent mb-4">{item.icon}</div>
                <div className="mb-3">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.titleEn}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{item.subtitle}</p>
                <p className="text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <p className="text-sm text-accent leading-relaxed">{item.example}</p>
              </Card>
            ))}
          </div>

          {/* フラットなポジション */}
          <Card className="p-8 bg-accent/5 border-2 border-accent/20 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">フラットな立場（何も売らない）</h3>
                <ul className="space-y-3 text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>物件・保険・投資商品に誘導しません</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>どの世界線を選んでも、このOSの利益は変わりません</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>だから“結論”ではなく、比較と判断の土台を返します</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* S4: 実際の世界線は、例えばこんな組み合わせです。 */}
        <section ref={scenarioRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
          <div className="container max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">
              実際の世界線は、例えばこんな組み合わせです。
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              抽象的な概念だけではなく、「家」「仕事」「場所」「イベント」がセットになった世界線を3つだけ例として示します。数字は概算ですが、読んだ人が自分ごとにできるレベルの具体性を入れています。
            </p>

            <div className="space-y-8">
              {/* Scenario 1 */}
              <Card className="p-8 bg-card">
                <h3 className="text-xl font-bold mb-4">Scenario 1：都内DINK、海外駐在に手を挙げるか迷っているケース</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold">前提：</span>世帯年収1,800万円／子ども0→1／検討中の物件8,000万円</p>
                  <p><span className="font-semibold">比較している世界線：</span>「賃貸継続＋40代で海外駐在5年」 vs 「8,000万購入＋日本ベース継続」</p>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="font-semibold mb-2">指標差分：</p>
                    <ul className="space-y-1">
                      <li><span className="font-semibold">40代余白：</span>ほぼ同じ</li>
                      <li><span className="font-semibold">60歳資産：</span>駐在ありがわずかに多い</li>
                      <li><span className="font-semibold">取り崩し開始：</span>70歳 → 68歳</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold">インサイト：</span>この場合、「家を買う／買わない」よりも「駐在を取るかどうか」の方が全体の絵に効いてくる、ということが分かります。
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-accent/10 text-foreground rounded-full text-xs font-medium">住宅</span>
                  <span className="px-3 py-1 bg-accent/10 text-foreground rounded-full text-xs font-medium">海外駐在</span>
                </div>
              </Card>

              {/* Scenario 2 */}
              <Card className="p-8 bg-card">
                <h3 className="text-xl font-bold mb-4">Scenario 2：賃貸継続＋働き方ダウンシフト準備</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold">前提：</span>世帯年収2,000万円／子ども1人／現在賃貸、数年後に年収800万円にダウン予定</p>
                  <p><span className="font-semibold">比較している世界線：</span>「賃貸継続＋年収維持」 vs 「賃貸継続＋年収ダウン」</p>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="font-semibold mb-2">指標差分：</p>
                    <ul className="space-y-1">
                      <li><span className="font-semibold">40代余白：</span>＋25万円（維持）</li>
                      <li><span className="font-semibold">60歳資産：</span>＋2,000万円（維持）</li>
                      <li><span className="font-semibold">取り崩し開始：</span>65歳 → 72歳</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold">インサイト：</span>年収を落とすと40代の余白は減るが、長期的には取り崩し開始が遅くなり、むしろ安心ライン的には「ダウンシフト」の方が守られる、という逆転が見えます。
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-accent/10 text-foreground rounded-full text-xs font-medium">住宅</span>
                  <span className="px-3 py-1 bg-accent/10 text-foreground rounded-full text-xs font-medium">働き方</span>
                </div>
              </Card>

              {/* Scenario 3 */}
              <Card className="p-8 bg-card">
                <h3 className="text-xl font-bold mb-4">Scenario 3：購入＋子ども2人プラン</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold">前提：</span>世帯年収1,500万円／子ども0→2（3歳差）／検討中の物件6,500万円</p>
                  <p><span className="font-semibold">比較している世界線：</span>「6,500万購入＋子ども2人」 vs 「賃貸継続＋子ども1人」</p>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="font-semibold mb-2">指標差分：</p>
                    <ul className="space-y-1">
                      <li><span className="font-semibold">40代余白：</span>−８万円/月（購入＋2人）</li>
                      <li><span className="font-semibold">60歳資産：</span>−1,500万円（購入＋2人）</li>
                      <li><span className="font-semibold">取り崩し開始：</span>65歳 → 70歳</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold">インサイト：</span>「家を買う」と「子どもを2人持つ」を同時に選ぶと、40代の余白がほぼ消える。どちらかを調整するか、年収を上げるか、という判断が必要になります。
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-accent/10 text-foreground rounded-full text-xs font-medium">住宅</span>
                  <span className="px-3 py-1 bg-accent/10 text-foreground rounded-full text-xs font-medium">子ども</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Evidence Pack（匿名ケース例）*/}
        <section id="evidence-pack-full" className="bg-secondary/20 py-16 md:py-24">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Evidence Pack（匿名ケース例）</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                実際の1on1セッションで生成された意思決定メモの匿名例です。<br />
                前提条件、比較世界線、指標差分、インサイトを含んでいます。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Case A */}
              <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                    Case A
                  </div>
                  <h3 className="text-lg font-bold mb-2">賢明な攻め方</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">前提</p>
                    <p className="text-xs">世帯年収1,800万・資産3,000万・子ど1人</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">比較世界線</p>
                    <p className="text-xs">賢貸継続 vs 6,000万購入</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">指標差分</p>
                    <p className="text-xs">60歳資産：+800万円（賢貸有利）<br />CF余裕：同等<br />取り崩し開始：同じ</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold text-accent">
                      「賢貸継続で浮いた800万を旅行と教育に振る」と決定
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-semibold mb-2">世界線比較（フル版）</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1 pr-2">指標</th>
                            <th className="text-left py-1 px-2">Rent</th>
                            <th className="text-left py-1 px-2">Buy</th>
                            <th className="text-left py-1 px-2">Buy + Shock</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">下振れ耐性</td>
                            <td className="py-1 px-2">中</td>
                            <td className="py-1 px-2">低</td>
                            <td className="py-1 px-2">低</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">意思決定の自由度</td>
                            <td className="py-1 px-2">高</td>
                            <td className="py-1 px-2">中</td>
                            <td className="py-1 px-2">低</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">主要リスク</td>
                            <td className="py-1 px-2">賢料上昇</td>
                            <td className="py-1 px-2">流動性低下</td>
                            <td className="py-1 px-2">返済負担</td>
                          </tr>
                          <tr>
                            <td className="py-1 pr-2 text-muted-foreground">次の30日</td>
                            <td className="py-1 px-2">現状維持</td>
                            <td className="py-1 px-2">物件検索</td>
                            <td className="py-1 px-2">資金計画見直し</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Case B */}
              <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                    Case B
                  </div>
                  <h3 className="text-lg font-bold mb-2">安全マージン確保</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">前提</p>
                    <p className="text-xs">世帯年収2,200万・資産5,000万・子ど2人</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">比較世界線</p>
                    <p className="text-xs">8,000万購入 vs 郊外広め</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">指標差分</p>
                    <p className="text-xs">60歳資産：-1,200万円（8,000万不利）<br />CF余裕：年-50万<br />取り崩し開始：3年早まる</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold text-accent">
                      「郊外広めで安全マージンを残し、教育費に備える」と決定
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-semibold mb-2">世界線比較（フル版）</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1 pr-2">指標</th>
                            <th className="text-left py-1 px-2">Buy郊外</th>
                            <th className="text-left py-1 px-2">Buy都心</th>
                            <th className="text-left py-1 px-2">Buy + Shock</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">下振れ耐性</td>
                            <td className="py-1 px-2">中</td>
                            <td className="py-1 px-2">低</td>
                            <td className="py-1 px-2">低</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">意思決定の自由度</td>
                            <td className="py-1 px-2">中</td>
                            <td className="py-1 px-2">低</td>
                            <td className="py-1 px-2">低</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">主要リスク</td>
                            <td className="py-1 px-2">通勤負担</td>
                            <td className="py-1 px-2">流動性低下</td>
                            <td className="py-1 px-2">返済負担</td>
                          </tr>
                          <tr>
                            <td className="py-1 pr-2 text-muted-foreground">次の30日</td>
                            <td className="py-1 px-2">物件検索</td>
                            <td className="py-1 px-2">資金計画確定</td>
                            <td className="py-1 px-2">資金計画見直し</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Case C */}
              <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                    Case C
                  </div>
                  <h3 className="text-lg font-bold mb-2">キャリア柔軟性優先</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">前提</p>
                    <p className="text-xs">世帯年収1,500万・資産2,500万・子ど1人</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">比較世界線</p>
                    <p className="text-xs">賢貸継続 vs 都心コンパクト</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">指標差分</p>
                    <p className="text-xs">60歳資産：同等<br />CF余裕：年-30万（購入不利）<br />取り崩し開始：同じ</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold text-accent">
                      「賢貸継続でキャリア柔軟性を保ち、転勤リスクに備える」と決定
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-semibold mb-2">世界線比較（フル版）</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1 pr-2">指標</th>
                            <th className="text-left py-1 px-2">Rent</th>
                            <th className="text-left py-1 px-2">Buy</th>
                            <th className="text-left py-1 px-2">Buy + Shock</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">下振れ耐性</td>
                            <td className="py-1 px-2">中</td>
                            <td className="py-1 px-2">低</td>
                            <td className="py-1 px-2">低</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">意思決定の自由度</td>
                            <td className="py-1 px-2">高</td>
                            <td className="py-1 px-2">中</td>
                            <td className="py-1 px-2">低</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-1 pr-2 text-muted-foreground">主要リスク</td>
                            <td className="py-1 px-2">賢料上昇</td>
                            <td className="py-1 px-2">流動性低下</td>
                            <td className="py-1 px-2">返済負担</td>
                          </tr>
                          <tr>
                            <td className="py-1 pr-2 text-muted-foreground">次の30日</td>
                            <td className="py-1 px-2">現状維持</td>
                            <td className="py-1 px-2">物件検索</td>
                            <td className="py-1 px-2">資金計画見直し</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pass購入前の納得形成用FAQ 5問 */}
        <section className="py-16 md:py-24 bg-card border-y">
          <div className="container max-w-4xl">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">よくある質問（購入前）</h3>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="faq-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Q1. 何をしてくれるサービスですか
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  複数の世界線を同じ前提で並べ、安心ラインと余白を見える化します。<br />
                  さらに、余白が足りない場合に「次の一手（収入/支出/タイミング）」へ翻訳します。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Q2. 物件紹介や保険・投資商品の販売はありますか
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  ありません。特定の商品や物件に誘導せず、比較と意思決定の土台を作ることに徹します。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Q3. 税務や法務の代行ですか
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  いいえ。精密な税額計算や申告代行ではありません。判断の材料整理が中心です。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Q4. 個人情報はどう扱いますか
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  適合チェックはメールが必須です。目的は判定とフォローアップです。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Q5. 保証はありますか
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  未来を断定しません。正解を保証するサービスではなく、比較できる状態を作るためのOSです。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* S5: いま実際にできること（AS-IS：住宅モジュール中心） */}
        <section ref={nowRef} className="container py-16 md:py-24 opacity-0">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">いま実際にできること（AS-IS：住宅モジュール中心）</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              いまは住宅（Rent vs Buy）を入口に、世界線比較の作法を体験できます。<br />
              住宅が主役ではなく、「安心ライン×余白×次の一手」で判断できる状態を作るのが本体です。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 数字例カード */}
            <Card className="p-8 bg-accent/5 border-2 border-accent/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">例：賃貸継続 vs 6,000万 vs 8,000万の世界線がどう変わるか</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                例として、世帯年収1,800万円・金融資産3,000万円・子ども1人という前提で、「賃貸継続」「6,000万購入」「8,000万購入」の3本を並べると、
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li>・40代の可処分キャッシュ</li>
                <li>・60歳時点資産</li>
                <li>・資産取り崩し開始年</li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed">
                がどのくらいずれるかが一目で分かります。「家を買うかどうか」ではなく、「どのラインまで攻めるか」の議論に変わります。
              </p>
            </Card>

            {/* 他の機能カード */}
            {[
              {
                icon: <Layers className="w-6 h-6" />,
                title: "「買うか買わないか」ではなく「どのラインまで攻めるか」が判断できる",
                description: "賃貸継続、都心で買う、郊外で広めに買う…などの世界線を並べて、どのラインが自分の人生にフィットするかを比較できます。",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "「安心ライン」を守れるかどうかが判断できる",
                description: "資産が尽き始める年齢、取り崩し開始年、最低限必要なキャッシュフローを世界線ごとに比較し、「守るべき下限」を割らない選択ができるかどうかを判断できます。",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "「人生の余白」をどこに置くかが判断できる",
                description: "世界線間の差分Δを、「旅に使える予算」「追加投資に回せる額」「残業を減らせる期間」などに翻訳し、余白をどこに置くかを判断できます。",
              },
            ].map((item, index) => (
              <Card key={index} className="p-8 bg-card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <div className="text-accent">{item.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* S6: これから増えていく横串（To-Be：海外駐在・イベント横断） */}
        <section ref={futureRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
          <div className="container max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">
              これから増える横串（ロードマップ）
            </h2>
            <p className="text-center text-muted-foreground mb-2 max-w-2xl mx-auto">
              <span className="inline-block">海外駐在</span>／<span className="inline-block">働き方</span>／<span className="inline-block">ライフイベント</span>
            </p>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              ※ここから先はロードマップです（順次追加）。<br />
              住宅モジュールは入口に過ぎません。<br />
              これから、「海外駐在」「働き方ダウンシフト」「子ども・イベント」などの世界線を横串で比較できるようにしていきます。
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
              {
                  icon: <Globe className="w-6 h-6" />,
                  title: "Overseas / Expat Lens",
                  description: "海外駐在を取る／取らない、あるいは海外ベースで働く世界線を、住宅や子どもプランと同じPL上で比較できるようにしていきます。",
                },
                {
                  icon: <Briefcase className="w-6 h-6" />,
                  title: "Work Mode Lens",
                  description: "「今の会社で走り切る」「数年後に年収を落としてゆるい働き方に切り替える」など、働き方のモードごとの世界線を並べて比較できるようにしていきます。",
                },
                {
                  icon: <Calendar className="w-6 h-6" />,
                  title: "Life Event Lens",
                  description: "子どもを持つ／持たない、留学させる／させない、世界一周やサバティカルを挿むなど、人生イベント前提を切り替えたときのPLを比較できるようにしていきます。",
                },
              ].map((item, index) => (
                <Card key={index} className="p-8 bg-card">
                  <div className="text-accent mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>



        {/* S8: 向いている人 / 向いていない人 */}
        <section ref={suitedRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
          <div className="container max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">向いている人 / 向いていない人</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* 向いている人 */}
              <Card className="p-8 bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Check className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">向いている人</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>世帯年収1,000〜2,000万円、金融資産1,000万円以上、パートナーあり（DINKsまたは子ども1人）の方。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>都内で6,000〜8,000万円クラスのマンションを検討しているが、「買うべきか」「どこまで攻めるべきか」が決めきれていない方。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>住宅だけでなく、「海外駐在」「働き方ダウンシフト」「子どもプラン」など、複数の選択肢を同時に考えている方。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>FPや住宅営業から「この商品／この物件が正解です」と一方的に言われるのではなく、フラットな立場で数字だけを整理してほしい人。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Excelで試算したことはあるが、変数が多すぎて「どこから計算すればいいのか」が分からなくなっている方。</span>
                  </li>
                </ul>
              </Card>

              {/* 向いていない人 */}
              <Card className="p-8 bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold">向いていない人</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>「とにかく今すぐ家を買いたい」「物件を紹介してほしい」という方（Exit Readiness OS は不動産仲介ではありません）。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>特定の金融商品や保険、不動産物件の紹介・販売を期待している人。（Exit Readiness OS は販売代理ではなく、意思決定のためのOSです）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>「正解を教えてほしい」という方（このOSは、あなた自身が納得して決めるための道具です）。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>世帯年収500万円以下、金融資産100万円以下の方（現時点では、高収入DINK層向けに最適化されています）。</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* S9: モデルの前提と制約 */}
        <section ref={constraintsRef} className="container py-16 md:py-24 opacity-0">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">モデルの前提と制約</h2>
            <Card className="p-8 bg-card">
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span>このツールは、金融商品・保険・不動産など特定の商品の販売や仲介を目的としたものではなく、ユーザー自身が選択肢を比較し、納得して決めるための意思決定支援ツールとして設計されています。</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span>シミュレーションは、ユーザーが入力した前提（年収・資産・支出・ライフプラン）に基づいて計算されます。前提が変われば、結果も変わります。</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span>将来の年収・資産運用リターン・インフレ率・税制などは不確実です。このOSは「確実な未来」を保証するものではなく、「いまの前提で、どの世界線がどう見えるか」を可視化するためのものです。</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span>現時点では、住宅モジュールが中心です。海外駐在・働き方ダウンシフト・子どもプランなどの横串機能は、順次追加していきます。</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span>このOSは、都内の高収入DINK層（世帯年収1,000〜2,000万円、金融資産1,000万円以上）を想定して設計されています。他の属性の方にも使えますが、最適化されているわけではありません。</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary/30 py-16 md:py-24">
          <div className="container max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">次のステップ</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Exit Readiness OS の利用には、適合チェックが必要です。<br />
              12問の質問に答えて、あなたに最適なステップを確認してください。
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => {
                trackEvent(AnalyticsEvents.LP_HERO_CTA_CLICKED);
                window.location.href = "/fit-gate";
              }}
            >
              適合チェックに進む
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* フッター */}
        <footer className="bg-card border-t py-8">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© 2024 Exit Readiness OS. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
