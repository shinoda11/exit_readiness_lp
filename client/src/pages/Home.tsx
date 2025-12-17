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
import { Globe, Briefcase, Home as HomeIcon, Calendar, TrendingUp, Shield, Sparkles, Target, Layers, Check, X } from "lucide-react";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const conceptRef = useRef<HTMLElement>(null);
  const asIsRef = useRef<HTMLElement>(null);
  const toBeRef = useRef<HTMLElement>(null);
  const scenariosRef = useRef<HTMLElement>(null);

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

    [heroRef, problemRef, conceptRef, asIsRef, toBeRef, scenariosRef].forEach((ref) => {
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
      {/* S1: ヒーローセクション - OSビジョン × 入口としての住宅 */}
      <section ref={heroRef} className="container py-16 md:py-24 lg:py-32 opacity-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左側：テキスト */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium mb-4">
              高収入DINKs向け Exit OS β版
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              家と、仕事と、暮らす場所。<br />
              大きな選択ぜんぶを、<br />
              世界線で比べるOS。
            </h1>
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p>
                Exit Readiness OS は、都内の高収入DINKが「家」「仕事」「暮らす場所」「人生で大事にしたいイベント」を、1つのPLとキャッシュフローの上で世界線として比較するためのOSです。
              </p>
              <p>
                最初の入口として、「賃貸を続ける」「都心で買う」といった住宅シナリオからスタートしますが、少しずつ「海外駐在を取る」「数年後にゆるい働き方に切り替える」「子どもの教育プランを変える」など、人生の大きな選択肢を横串で扱えるようにしていきます。
              </p>
              <p>
                どのケースでも、「どこまで攻めていいか」と「どこに余白を残すか」を、安心ラインと人生の余白という2つの軸で見えるようにすることがゴールです。
              </p>
            </div>
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6"
                onClick={scrollToCTA}
              >
                1on1テストセッションに応募する
              </Button>
              <p className="text-sm text-muted-foreground">
                対象：年収1,000〜2,000万円・パートナーあり（DINKs または子ども1人）・東京圏など都市部在住の方を想定しています。
              </p>
            </div>
          </div>

          {/* 右側：Asset Cockpit イメージ */}
          <div className="relative">
            <Card className="p-8 bg-card shadow-lg">
              <div className="space-y-6">
                <h3 className="text-lg font-bold mb-4">Asset Cockpit</h3>
                <div className="space-y-4">
                  {/* 上半分：Exit Score と主要指標 */}
                  <div className="p-4 bg-accent/5 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">Exit Score</span>
                      <span className="text-2xl font-bold text-accent">72</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">現在の資産</p>
                        <p className="font-bold">3,200万円</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">月次CF</p>
                        <p className="font-bold">+42万円</p>
                      </div>
                    </div>
                  </div>

                  {/* 下半分：世界線タブ */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">世界線シナリオ</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-primary/10 rounded border-2 border-primary">
                        <div className="flex items-center gap-2">
                          <HomeIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">住宅</span>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded border border-border opacity-50">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm font-medium">海外駐在</span>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded border border-border opacity-50">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span className="text-sm font-medium">ゆるExit</span>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded border border-border opacity-50">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">イベント</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground pt-4 border-t border-border">
                  画面右側は、Asset Cockpit のイメージです。上半分に Exit Score や現在の資産・キャッシュフロー、下半分に「住宅」「海外駐在」「ゆるExit」「イベント」などの世界線タブが並びます。<br />
                  いま触れるのは「住宅」タブですが、将来的にはここに「海外駐在を取る世界線」「数年だけ年収を落としてゆるい働き方をする世界線」などが増えていきます。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* S2: 状態の言語化 - 家・仕事・場所・イベントが絡み合った決められなさ */}
      <section ref={problemRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            家だけじゃない。<br />
            仕事も、子どもも、場所も、一緒に揺れている。
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            住宅だけを最適化しても意味がない。海外・子ども・キャリアを含めて考えようとすると、Excelでは破綻する。<br />
            いくつもの選択肢を同時に頭の中で動かしているうちに、「どこから計算すればいいのか」が分からなくなる。
          </p>
          <div className="space-y-4">
            {[
              {
                icon: <HomeIcon className="w-5 h-5" />,
                text: "「都内で家を買うかどうか」と同時に、「海外駐在に手を挙げるかどうか」も頭にある。",
              },
              {
                icon: <Calendar className="w-5 h-5" />,
                text: "子どもを持つか／持たないか、持つなら何歳差で何人か、まだ決めきれていない。",
              },
              {
                icon: <Briefcase className="w-5 h-5" />,
                text: "数年後に今の働き方を続けている自分を想像できず、年収レンジの前提すら置きづらい。",
              },
              {
                icon: <Globe className="w-5 h-5" />,
                text: "将来どこかで「場所を変える」（地方や海外に移る／ノマド期間を挟む）可能性も捨てきれない。",
              },
              {
                icon: <Target className="w-5 h-5" />,
                text: "いくつもの選択肢を同時に頭の中で動かしているうちに、「どこから計算すればいいのか」が分からなくなる。",
              },
            ].map((item, index) => (
              <Card key={index} className="p-6 bg-card flex items-start gap-4">
                <div className="text-accent flex-shrink-0 mt-1">{item.icon}</div>
                <p className="text-base">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* S3: Exit Readiness OSとは何か - OSコンセプト */}
      <section ref={conceptRef} className="container py-16 md:py-24 opacity-0">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Exit Readiness OS とは何か
        </h2>
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          縦割りの選択肢を、横串で比較する。<br />
          「どの人生を歩むか」を、安心ラインと人生の余白という2つの軸で見えるようにします。
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {[
            {
              icon: <Layers className="w-6 h-6" />,
              title: "世界線（Worldline）",
              subtitle: "「どの人生を歩くか」を並べて見る",
              description: "「賃貸を続ける」「都心で買う」「海外駐在を取る」「数年後にゆるい働き方に切り替える」──これらは別々の意思決定ではなく、同じPLとキャッシュフローの上で並べて比較できる「世界線」です。今できるのは住宅が中心ですが、世界線の概念自体はすでにOSに組み込まれています。",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "安心ライン（Safety Line）",
              subtitle: "「守るべき下限」を見える化する",
              description: "資産が尽き始める年齢、取り崩しペース、最低限必要なキャッシュフロー──どの世界線を選んでも、「ここを割ったらアウト」というラインを明確にします。安心ラインが見えることで、どこまで攻めていいかの判断基準が持てるようになります。",
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "人生の余白（Slack）",
              subtitle: "「どこに余白を置くか」で選ぶ",
              description: "世界線AとBの差分Δを、「旅に使える予算」「追加投資に回せる額」「残業を減らせる期間」などに翻訳します。どの年代の余白を厚くするかを、パートナーと具体的に話せる状態まで持っていくことが、このOSのゴールです。",
            },
          ].map((item, index) => (
            <Card key={index} className="p-8 bg-card">
              <div className="text-accent mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-accent-foreground mb-3">{item.subtitle}</p>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>

        {/* フラットなポジション */}
        <Card className="p-8 bg-accent/5 border-2 border-accent/20 max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="text-accent flex-shrink-0 mt-1">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">フラットなOSであること ─ 何も「売らない」立場</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                従来のFPツールは「金融商品を売る」こと、住宅ツールは「家を売る」ことが出口として決まっている。Exit Readiness OS の出口は「特定の商品や物件」ではなく、「どの世界線を選んでもいい状態をつくること」である。
              </p>
              <p className="text-muted-foreground leading-relaxed">
                どのシナリオを選んでも、このツールの側の利益は変わらない。だからこそ、数字と世界線をフラットに見せられる──それが、Exit Readiness OS の設計思想です。
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* S4: いま実際にできること - AS-IS：住宅モジュール */}
      <section ref={asIsRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            いま実際にできること
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            最初に触れるのは「住宅モジュール」です。<br />
            ただの住宅サイトではなく、OSの最初のモジュールとして、将来的に他の選択肢と連携する前提で設計されています。
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "賃貸 vs 購入の二本線比較",
                description: "「今の賃貸を続ける」「8,000万円の物件を35年ローンで買う」といったパターンを、同じ前提で並べます。手取りベースのPLに落とし、二本線として比較することで、感覚論ではなく数字で判断できる状態をつくります。",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "3つの主要指標",
                description: "40〜50代のキャッシュフロー余裕、60歳時点の資産、資産取り崩し開始年──この3つの指標を、賃貸と購入それぞれの世界線で同時に見えるようにします。どの年代に余白を置くかで選べるようになります。",
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Buy Now 条件の詳細設定",
                description: "物件価格、頭金、諸費用、金利、借入年数などを細かく設定できます。頭金を多く入れる／あえて温存する場合の差分が、老後ではなく「今〜10年」の生活にどう効くかを可視化します。",
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Goal Lens による読み方の違い",
                description: "「守り重視」「ゆるExit」「FIRE視野」のモードを選ぶことで、同じ数字でもどこに注目すべきかのガイドが変わります。働き方や人生設計に合わせて、最適な読み方ができます。",
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

      {/* S5: これから増えていく横串 - To-Be */}
      <section ref={toBeRef} className="container py-16 md:py-24 opacity-0">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          これから増えていく横串
        </h2>
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Exit Readiness OS は、住宅だけで終わりません。<br />
          将来的には、海外・キャリア・イベントなど、人生の大きな選択肢を横串で扱えるようにしていきます。
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <Globe className="w-6 h-6" />,
              title: "Overseas / Expat Lens",
              description: "海外駐在を取る／取らない、海外ベースで働く／日本をベースにする──これらの選択肢を世界線として比較します。為替リスク、税制の違い、帰国後のキャリアパスまで含めて、同じPLの上で並べて見えるようにします。",
            },
            {
              icon: <Briefcase className="w-6 h-6" />,
              title: "Work Mode Lens",
              description: "今の会社で昇進し続ける vs 数年後にゆるい働き方に切り替える vs 独立する──働き方の選択肢を世界線として比較します。年収ダウンのインパクト、キャリアチェンジのタイミング、余白の確保などを数字で見えるようにします。",
            },
            {
              icon: <Calendar className="w-6 h-6" />,
              title: "Life Event Lens",
              description: "子どもを持つ／持たない、留学させる／させない、数年ノマドする──大きなイベント前提を変えたときのPLを比較します。教育費、生活費、キャリアへの影響などを、世界線として並べて見えるようにします。",
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Travel / Sabbatical Lens",
              description: "数ヶ月〜1年レベルの世界一周やサバティカルを挟んだ場合の世界線を比較します。キャリアの中断、収入の減少、資産の取り崩しペースなどを、具体的な数字で見えるようにします。",
            },
          ].map((item, index) => (
            <Card key={index} className="p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-accent">{item.icon}</div>
                <h3 className="font-bold">{item.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </Card>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-8 max-w-3xl mx-auto">
          これらは将来のロードマップです。何年後にどのモジュールを出すかは未定ですが、「複数の大きな決断を横串で比較する」という思想で、OSとして設計しています。
        </p>
      </section>

      {/* S6: 3つの代表シナリオ */}
      <section ref={scenariosRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            3つの代表シナリオ
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            住宅だけでなく、キャリアやイベントが絡んだ「混合シナリオ」で考える。<br />
            OSとしての世界線比較のイメージを、具体例で見ていきます。
          </p>
          <div className="space-y-8 max-w-4xl mx-auto">
            {[
              {
                title: "Scenario 1: 都内購入 × 海外駐在オプション",
                description: "「都内で8,000万円の物件を買う」前提で、数年後に「海外駐在のオファーを受ける／断る」という選択肢が出てきた場合。住宅ローンを抱えたまま海外に行くリスク、賃貸に出す場合の収支、帰国後の資産状況などを、世界線として並べて比較します。",
                tags: ["住宅", "海外駐在"],
              },
              {
                title: "Scenario 2: 賃貸継続 × ゆるExit準備",
                description: "「賃貸を続けながら、数年後にゆるい働き方に切り替える」前提で、年収が1,500万円から800万円にダウンした場合のPLを比較します。40〜50代のキャッシュフロー余裕、60歳時点の資産、取り崩し開始年などを、世界線として見えるようにします。",
                tags: ["住宅", "ゆるExit"],
              },
              {
                title: "Scenario 3: 都内購入 × 子どもプラン変更",
                description: "「都内で6,000万円の物件を買う」前提で、「子どもを1人持つ／2人持つ」という選択肢が出てきた場合。教育費、生活費、住宅の広さ、キャリアへの影響などを、世界線として並べて比較します。",
                tags: ["住宅", "子どもプラン"],
              },
            ].map((scenario, index) => (
              <Card key={index} className="p-8 bg-card">
                <h3 className="text-xl font-bold mb-3">{scenario.title}</h3>
                <p className="text-muted-foreground mb-4">{scenario.description}</p>
                <div className="flex gap-2">
                  {scenario.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 max-w-3xl mx-auto text-sm">
            これらのシナリオは、完全に実装済みではありません。ただし、OSとしてこう並べて見る予定で設計しています。
          </p>
        </div>
      </section>

      {/* S7: この1on1で一緒にやること */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          この1on1で一緒にやること
        </h2>
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          現在は少人数のクローズドテストとして、1on1でのオンラインセッションを行っています。<br />
          実際の画面を共有しながら、あなたの世界線をその場で一緒に見ていきます。
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              title: "まずは住宅のRent vs Buyを整理",
              description: "年収、貯蓄、生活費、ローン条件などを入力し、賃貸継続と購入の二本線を並べます。40〜50代のCF余裕、60歳資産、取り崩し開始年を確認します。",
            },
            {
              step: "2",
              title: "余力があれば他の軸も軽く触る",
              description: "「海外駐在あり／なし」「数年後にゆるい働き方に切り替える」など、他の選択肢も軽く触ります。OSとしての世界線比較のイメージを体感していただきます。",
            },
            {
              step: "3",
              title: "セッション後に「世界線メモ」が残る",
              description: "セッションで見た世界線の比較結果を、簡易レポートとしてお渡しします。パートナーと話すときの材料として使えます。",
            },
          ].map((item) => (
            <Card key={item.step} className="p-8 bg-card">
              <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* S8: 向いている人／向いていない人 */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            どんな人に向いているか／向いていないか
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* 向いている人 */}
            <Card className="p-8 bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">向いている人</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "家・仕事・場所・イベントなど、複数の大きな決断が絡み合っていて、どこから手をつけていいか分からない人。",
                  "Excelで試算はしているが、前提が変わるたびに計算し直すのに疲れた人。",
                  "「どこまで攻めていいか」と「どこに余白を残すか」を、数字で決めたい人。",
                  "FPや住宅営業から「この商品／この物件が正解です」と一方的に言われるのではなく、フラットな立場で数字だけを整理してほしい人。",
                  "パートナーと「世界線」を並べて話したい人。",
                ].map((text, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
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
              <ul className="space-y-3">
                {[
                  "住宅だけを決めたい人（他の選択肢は考えていない人）。",
                  "「正解」を教えてほしい人（このツールは意思決定支援であり、答えを出すものではありません）。",
                  "特定の金融商品や保険、不動産物件の紹介・販売を期待している人（Exit Readiness OS は販売代理ではなく、意思決定のためのOSです）。",
                  "数字を見るのが苦手で、感覚で決めたい人。",
                  "すでに決断が固まっていて、背中を押してほしいだけの人。",
                ].map((text, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* S9: モデルの前提と制約 */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 max-w-4xl mx-auto">
          モデルの前提と制約
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
              title: "今できるのは主に住宅 × キャリア × 子ども1人想定",
              content: "将来的には他のイベントをフルに載せる前提で設計していますが、現時点では簡略化しています。",
            },
            {
              title: "フラットなポジション",
              content: "このツールは、金融商品・保険・不動産など特定の商品の販売や仲介を目的としたものではなく、ユーザー自身が選択肢を比較し、納得して決めるための意思決定支援ツールとして設計されています。",
            },
          ].map((item, index) => (
            <Card key={index} className="p-6 bg-card">
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.content}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* S10: 1on1テストセッション応募フォーム */}
      <section id="application-form" className="bg-secondary/30 py-16 md:py-24">
        <div className="container max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            1on1テストセッションに応募する
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            現在は少人数のクローズドテストとして、1on1でのオンラインセッションを行っています。<br />
            事前にいくつかの情報を入力いただき、条件が近い方から順にご案内します。<br />
            セッションでは、住宅の話から始めつつ、「海外」「仕事」「イベント」の話も前提として聞かせてください。
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
