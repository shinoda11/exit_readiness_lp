import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  name: z.string().optional(),
  currentHousing: z.enum(["賃貸", "持ち家"]),
  incomeRange: z.enum(["1000-1500", "1500-2000", "2000-3000", "3000以上"]),
  propertyRange: z.enum(["賃貸継続", "6000", "8000", "1億以上"]),
  goalMode: z.enum(["守り", "ゆるExit", "フルFIRE視野"]),
  preferredTime: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const osRef = useRef<HTMLElement>(null);
  const scenarioRef = useRef<HTMLElement>(null);
  const nowRef = useRef<HTMLElement>(null);
  const futureRef = useRef<HTMLElement>(null);
  const sessionRef = useRef<HTMLElement>(null);
  const suitedRef = useRef<HTMLElement>(null);
  const constraintsRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentHousing: "賃貸",
    },
  });

  const createTestSession = trpc.testSession.submit.useMutation({
    onSuccess: () => {
      toast.success("応募を受け付けました", {
        description: "ご登録いただいたメールアドレスに詳細をお送りします。",
      });
    },
    onError: (error: any) => {
      toast.error("エラーが発生しました", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createTestSession.mutate(data);
  };

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
      sessionRef,
      suitedRef,
      constraintsRef,
      formRef,
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
                高収入DINKs向け Exit OS β版
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                家と、仕事と、暮らす場所。<br />
                大きな選択ぜんぶを、6,000万〜8,000万クラスの"人生の決断"ごと、世界線で比べるOS。
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Exit Readiness OS は、都内の高収入DINKが「家」「仕事」「暮らす場所」「人生で大事にしたいイベント」を、1つのPLとキャッシュフローの上で世界線として比較するためのOSです。
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                最初の入口として「いまの賃貸を続ける」「都心でマンションを買う」といった住宅シナリオからスタートしますが、少しずつ「海外駐在を取り/取らない」「数年後にゆるい働き方に切り替える」「子どもの教育プランを変える」など、横串の選択肢を扱えるように していきます。
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                「この商品が正解です」「この物件が一番お得です」とゴールを決めてから逆算するのではなく、まずはすべての世界線を同じスケールで並べるところから始めます。一般的なFPツールや住宅サイトのように、「売りたい商品」や「売りたい物件」が決まっているわけではなく、どの世界線を選んでもよい前提で数字だけを並べる、フラットなOSです。
              </p>
              <div className="flex flex-col gap-4">
                <Button size="lg" className="w-full md:w-auto" onClick={() => window.location.href = "/fit-gate"}>
                  適合チェックに進む
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  いきなり1on1を申し込むのではなく、「いまOSを使うフェーズか」「まずPrep Modeで基礎を整えるべきか」を簡単な適合チェックで確認してから進んでもらいます。12問の質問に答えて、あなたに最適なステップを確認してください。
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                対象：年収1,000〜2,000万円・パートナーあり（DINKsまたは子ども1人）・東京都などで都市部在住の方を想定しています。<br />
                特に、都内で6,000〜8,000万円クラスのマンションを検討している、年収1,000〜2,000万円のDINK・プレDINK世帯の方を想定ユーザーとしています。
              </p>
            </div>

            {/* 右側：準備チェック3問 */}
            <div className="bg-card border rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6">準備チェック（3問）</h3>
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

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    これらの質問を含む12問の適合チェックで、<br />
                    あなたに最適なステップを判定します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 証拠パックセクション */}
        <section className="py-12 md:py-16 bg-card border-y">
          <div className="container max-w-4xl">
            <h3 className="text-2xl font-bold text-center mb-8">証拠パック：このツールが実際に機能する理由</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Evidence 1 */}
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">二本線比較の実装</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Rent vs Buyを「同じ前提」で並べることが、最初のハードルです。このツールは、二本の世界線を比較するためのロジックが実装済みです。
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
                    <h4 className="font-semibold mb-2">3指標の可視化</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      CF余裕、60歳資産、取り崩し開始年。この3つの指標を見ることで、「安心ライン」と「余白」を判断できます。
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
                    <h4 className="font-semibold mb-2">フラットなポジション</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      特定の商品や物件を売ることが出口ではありません。どの世界線を選んでも、このツールの側の利益は変わりません。
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              家だけじゃない。<br />
              仕事も、子どもも、場所も、一緒に揺れている。
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              住宅だけを最適化しても意味がない。海外・子ども・キャリアを含めて考えようとすると、Excelでは破綻する。<br />
              いくつもの選択肢を同時に頭の中で動かしているうちに、「どこから計算すればいいのか」が分からなくなる。
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <HomeIcon className="w-6 h-6" />,
                  text: "「都内で家を買うかどうか」と同時に、「海外駐在に手を挙げるかどうか」も頭にある。",
                },
                {
                  icon: <Calendar className="w-6 h-6" />,
                  text: "子どもを持つか / 持たないか、持つなら何歳差で、どんな教育プランを選ぶか、まだ決めきれていない。",
                },
                {
                  icon: <Briefcase className="w-6 h-6" />,
                  text: "5年後に年収を2〜3割落としても大丈夫なのか、家・子ども・場所を全部含めて見たうえで判断できていない。",
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  text: "6,000万円で抑えるか、8,000万円まで攻めるか、その差が「40代・50代・退職後」のどこに効いてくるのかをイメージしきれていない。",
                },
              ].map((item, index) => (
                <Card key={index} className="p-6 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="text-accent mt-1">{item.icon}</div>
                    <p className="text-sm leading-relaxed">{item.text}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* S3: Exit Readiness OS とは何か */}
        <section ref={osRef} className="container py-16 md:py-24 opacity-0">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Exit Readiness OS とは何か</h2>
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
                title: "世界線（Worldline）",
                subtitle: "「どの人生を歩くか」を並べて見る",
                description: "「賃貸を続ける」「都心で買う」「海外駐在を取る」「数年後にゆるい働き方に切り替える」──これらは別々の意思決定ではなく、同じPLとキャッシュフローの上で並べて比較できる「世界線」です。今できるのは住宅が中心ですが、世界線の概念自体はすでにOSに組み込まれています。",
                example: "例：都内に住み続ける世界線と、海外駐在を5年挟む世界線で、60歳時点の資産やキャッシュフローの山の形がどう変わるかを並べて見られます。",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "安心ライン（Safety Line）",
                subtitle: "「守るべき下限」を見える化する",
                description: "資産が尽き始める年齢、取り崩しペース、最低限必要なキャッシュフロー──どの世界線を選んでも、「ここを割ったらアウト」というラインを明確にします。安心ラインが見えることで、どこまで攻めていいかの判断基準が持てるようになります。",
                example: "例：いまの前提だと「68歳から取り崩し開始」「毎年300万円ペース」など、攻めすぎないための目安がRent / Buy両方で分かります。",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "人生の余白（Slack）",
                subtitle: "「どこに余白を置くか」で選ぶ",
                description: "世界線AとBの差分Δを、「旅に使える予算」「追加投資に回せる額」「残業を減らせる期間」などに翻訳します。どの年代の余白を厚くするかを、パートナーと具体的に話せる状態まで持っていくことが、このOSのゴールです。",
                example: "例：6,000万購入なら40代に毎年100万円分の余白が残せるが、8,000万購入だとその余白がほぼ消える、といった差が見えます。",
              },
            ].map((item, index) => (
              <Card key={index} className="p-8 bg-card">
                <div className="text-accent mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
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
                <h3 className="text-xl font-bold mb-3">フラットなOSであること ─ 何も「売らない」立場</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  FPツールは金融商品、住宅ツールは物件という「出口」があらかじめ決まっている。Exit Readiness OS は、特定の商品や物件に誘導することではなく、「どの世界線を選んでもよい状態」を作ることが目的である。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  どのシナリオを選んでもこのツール側の利益は変わらないからこそ、フラットに数字を見せられる──それが、Exit Readiness OS の設計思想です。どの世界線を選んでも、このOSの側の利益は変わりません。だからこそ、「買った方が得」「この投資商品が正解」といったバイアスなしに、数字だけで比べることができます。
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* S4: 実際の世界線は、例えばこんな組み合わせです。 */}
        <section ref={scenarioRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
          <div className="container max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
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
                    <p className="font-semibold mb-2">指標差分（数字）：</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>・40代の可処分キャッシュはほぼ同じ</li>
                      <li>・60歳時点資産は駐在ありの方がわずかに多い</li>
                      <li>・資産取り崩し開始は「駐在あり70歳」「購入のみ68歳」</li>
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
                <h3 className="text-xl font-bold mb-4">Scenario 2：賃貸継続＋ゆるExit準備</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold">前提：</span>世帯年収2,000万円／子ども1人／現在賃貸、数年後に年収800万円にダウン予定</p>
                  <p><span className="font-semibold">比較している世界線：</span>「賃貸継続＋年収維持」 vs 「賃貸継続＋年収ダウン」</p>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="font-semibold mb-2">指標差分（数字）：</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>・40代余剰は年収維持で＋25万円、60歳資産は年収維持で＋2,000万円</li>
                      <li>・取り崩し開始は年収維持65歳・ダウン72歳</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold">インサイト：</span>年収を落とすと40代の余白は減るが、長期的には取り崩し開始が遅くなり、むしろ安心ライン的には「ゆるExit」の方が守られる、という逆転が見えます。
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-accent/10 text-foreground rounded-full text-xs font-medium">住宅</span>
                  <span className="px-3 py-1 bg-accent/10 text-foreground rounded-full text-xs font-medium">ゆるExit</span>
                </div>
              </Card>

              {/* Scenario 3 */}
              <Card className="p-8 bg-card">
                <h3 className="text-xl font-bold mb-4">Scenario 3：購入＋子ども2人プラン</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold">前提：</span>世帯年収1,500万円／子ども0→2（3歳差）／検討中の物件6,500万円</p>
                  <p><span className="font-semibold">比較している世界線：</span>「6,500万購入＋子ども2人」 vs 「賃貸継続＋子ども1人」</p>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="font-semibold mb-2">指標差分（数字）：</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>・40代余剰は購入＋2人で月−8万円、60歳資産は購入＋2人で−1,500万円</li>
                      <li>・取り崩し開始は購入＋2人で65歳、賃貸＋1人で70歳</li>
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

        {/* S5: いま実際にできること（AS-IS：住宅モジュール中心） */}
        <section ref={nowRef} className="container py-16 md:py-24 opacity-0">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">いま実際にできること（AS-IS：住宅モジュール中心）</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              現在は「住宅」を軸にした世界線比較が中心です。<br />
              賃貸継続 vs 購入の二本線を、CF余裕・60歳資産・取り崩し開始年という3つの指標で比較できます。
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              これから増えていく横串（To-Be：海外駐在・イベント横断）
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              住宅モジュールは入口に過ぎません。<br />
              これから、「海外駐在」「ゆるExit」「子ども・イベント」などの世界線を横串で比較できるようにしていきます。
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

        {/* S7: 1on1テストセッションについて（紹介制） */}
        <section ref={sessionRef} className="container py-16 md:py-24 opacity-0">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">1on1テストセッションについて（紹介制）</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              1on1テストセッションは、現在「紹介制」で提供しています。<br />
              適合チェックで「Session解放」と判定された方、または招待トークンをお持ちの方のみが応募できます。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "STEP 1",
                title: "前提の整理",
                description: "年収・資産・支出・ライフプラン前提を、1つのPLとキャッシュフローに落とし込みます。「いまの世界線」を可視化することで、比較の土台を作ります。",
                outcome: "セッションが終わっても使い続けられるように、「自分たちの標準PL」として再利用できる形で前提を整理します。",
              },
              {
                step: "STEP 2",
                title: "世界線の比較",
                description: "「賃貸継続」「都心で買う」「海外駐在を取る」「ゆるExitに切り替える」など、2〜3本の世界線を並べて、CF余裕・60歳資産・取り崩し開始年を比較します。",
                outcome: "ここで見た2〜3本の世界線は、そのままスクリーンショットとして持ち帰り、後日パートナーと落ち着いて話す材料にできます。",
              },
              {
                step: "STEP 3",
                title: "Exit基準の言語化",
                description: "「この条件になったら会社にNOと言える」「ここまでなら家を買ってもよい」という基準を、一緒に文字として残します。",
                outcome: "最後に、「この条件になったら会社にNOと言える」「ここまでなら家を買ってもよい」という1〜2行の基準を、一緒に文字として残します。",
              },
            ].map((item, index) => (
              <Card key={index} className="p-8 bg-card">
                <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <p className="text-sm text-accent leading-relaxed">{item.outcome}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* S8: 向いている人 / 向いていない人 */}
        <section ref={suitedRef} className="bg-secondary/30 py-16 md:py-24 opacity-0">
          <div className="container max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">向いている人 / 向いていない人</h2>
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
                    <span>住宅だけでなく、「海外駐在」「ゆるExit」「子どもプラン」など、複数の選択肢を同時に考えている方。</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">モデルの前提と制約</h2>
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
                  <span>現時点では、住宅モジュールが中心です。海外駐在・ゆるExit・子どもプランなどの横串機能は、順次追加していきます。</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">次のステップ</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Exit Readiness OS の利用には、適合チェックが必要です。<br />
              12問の質問に答えて、あなたに最適なステップを確認してください。
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = "/fit-gate"}
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
