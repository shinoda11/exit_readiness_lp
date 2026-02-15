import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRight,
  Check,
  Layers,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { YohackSymbol, YohackLockup } from "@/components/yohack-logo";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const scenarioRef = useRef<HTMLElement>(null);
  const flatRef = useRef<HTMLElement>(null);
  const osRef = useRef<HTMLElement>(null);
  const suitedRef = useRef<HTMLElement>(null);

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

    const refs = [heroRef, scenarioRef, flatRef, osRef, suitedRef];

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
        {/* S1: ヒーロー — 問いの再提示 */}
        <section ref={heroRef} className="py-20 md:py-28 opacity-0">
          <div className="container max-w-3xl text-center">
            <div className="flex justify-center mb-10">
              <YohackSymbol theme="light" size={48} />
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              この家を買ったあと、<br />
              年収が 20% 下がっても、<br />
              <span className="text-accent">まだ動けるか。</span>
            </h1>

            <div className="text-lg md:text-xl text-muted-foreground leading-relaxed opacity-80 max-w-2xl mx-auto mb-3">
              <p>
                8,000万の家を買う世界線と、買わない世界線。<br />
                100歳までの資産推移を並べたとき、<br />
                差がいちばん開くのは、何歳のときか。
              </p>
            </div>

            <p className="text-sm italic text-muted-foreground opacity-60 mb-12">
              答えられるなら、このページは必要ありません。
            </p>

            <Button
              size="lg"
              className="bg-[#C8B89A] hover:bg-[#8A7A62] text-white text-lg px-10 py-4 rounded-full shadow-lg transition-all duration-300"
              onClick={() => {
                trackEvent(AnalyticsEvents.LP_HERO_CTA_CLICKED);
                window.location.href = "/fit-gate";
              }}
            >
              あなたのケースで確かめる
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* S2: 何が見えるようになるか — 成果物の提示 */}
        <section ref={scenarioRef} className="py-20 md:py-28 bg-secondary/10 opacity-0">
          <div className="container max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
              ある夫婦のケースでは、こうなった。
            </h2>

            <div className="space-y-10">
              {/* Case 1 */}
              <div>
                <Card className="p-8 bg-card border-l-4 border-l-[#C8B89A]">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#C8B89A]/10 text-[#8A7A62] rounded-full text-xs font-medium mr-2 mb-2">外資IT × メガバンク</span>
                    <span className="inline-block px-3 py-1 bg-[#C8B89A]/10 text-[#8A7A62] rounded-full text-xs font-medium mr-2 mb-2">都心2LDK</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    世帯年収 2,400万。家賃 32万。都心 8,500万の 2LDK を検討中。<br />
                    「買うか・買わないか」で悩んでいたが、<br />
                    世界線を並べると、60歳時点の資産差は{" "}
                    <span className="text-2xl font-bold text-[#C8B89A]">400万</span>
                    {" "}しかなかった。<br />
                    一方、「海外駐在を取るかどうか」では{" "}
                    <span className="text-2xl font-bold text-[#C8B89A]">2,800万</span>
                    {" "}の差が開いた。
                  </p>
                </Card>
                <p className="text-center text-lg font-bold text-[#5A5550] mt-6">論点が、変わった。</p>
              </div>

              {/* Case 2 */}
              <div>
                <Card className="p-8 bg-card border-l-4 border-l-[#C8B89A]">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#C8B89A]/10 text-[#8A7A62] rounded-full text-xs font-medium mr-2 mb-2">コンサル × 事業会社</span>
                    <span className="inline-block px-3 py-1 bg-[#C8B89A]/10 text-[#8A7A62] rounded-full text-xs font-medium mr-2 mb-2">ペースダウン検討</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    世帯年収 2,400万。コンサル × 事業会社。<br />
                    年収{" "}
                    <span className="text-2xl font-bold text-[#C8B89A]">1,800万</span>
                    {" "}→{" "}
                    <span className="text-2xl font-bold text-[#C8B89A]">1,200万</span>
                    {" "}のペースダウンを織り込んでも、<br />
                    8,000万ラインなら安心ラインを割らなかった。
                  </p>
                </Card>
                <p className="text-center text-lg font-bold text-[#5A5550] mt-6">ペースダウンの「いつ」が、家より効いていた。</p>
              </div>
            </div>
          </div>
        </section>

        {/* S4: フラットな立場 — 何も売らない宣言 */}
        <section ref={flatRef} className="py-12 md:py-16 bg-[#F5F0E8]/50 opacity-0">
          <div className="container max-w-3xl text-center">
            <div className="flex justify-center mb-6">
              <YohackSymbol theme="light" size={32} />
            </div>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p><span className="text-accent mr-2">✓</span>YOHACK は、物件も保険も投資商品も売りません。</p>
              <p><span className="text-accent mr-2">✓</span>どの世界線を選んでも、この OS の利益は変わりません。</p>
              <p><span className="text-accent mr-2">✓</span>返すのは結論ではなく、比較と判断の土台です。</p>
            </div>
          </div>
        </section>

        {/* S3: 3つの軸 — 余白・安心ライン・世界線 */}
        <section ref={osRef} className="py-20 md:py-28 bg-secondary/10 opacity-0">
          <div className="container max-w-3xl">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 bg-white border border-[#E8E2D8] shadow-sm min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">余白</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  その差分を「どの年代にどれだけ余裕が残るか」に翻訳する。
                </p>
              </Card>

              <Card className="p-8 bg-white border border-[#E8E2D8] shadow-sm min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">安心ライン</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  「ここを割ると厳しい」の下限を見える化する。
                </p>
              </Card>

              <Card className="p-8 bg-white border border-[#E8E2D8] shadow-sm min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">世界線</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  同じ前提で、異なる選択肢を並べて比較する。
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* S5: 向いている人 / 向いていない人 */}
        <section ref={suitedRef} className="py-20 md:py-28 opacity-0">
          <div className="container max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">向いている人 / 向いていない人</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* 向いている人 */}
              <Card className="p-10 bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Check className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">向いている人</h3>
                </div>
                <ul className="space-y-4 text-base text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span>世帯年収 1,000〜3,000万で、7,000〜10,000万クラスの物件を本気で検討している</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span>「買えるか」ではなく「買った後も動けるか」を気にしている</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span>夫婦で論点を整理するための客観データが欲しい</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span>自分で数字を動かして判断したい（人に答えを出してほしいのではなく）</span>
                  </li>
                </ul>
              </Card>

              {/* 向いていない人 */}
              <Card className="p-10 bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold">向いていない人</h3>
                </div>
                <ul className="space-y-4 text-base text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                    <span>予算 5,000万以下 or 1.5億以上（シミュレーションの精度が最適化されていないレンジ）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                    <span>「買うか買わないか」をすでに決めている（世界線を並べて比較する必要がない）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                    <span>数字よりもフィーリングで決めたい（数値シミュレーションが判断材料にならない）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                    <span>ファイナンシャルプランナーに全部任せたい（自分で操作するセルフサービス型のため）</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* S6: FAQ（4問） */}
        <section className="py-20 md:py-28 bg-secondary/10">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">よくある質問</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="faq-1" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  何をしてくれるサービスですか？
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  人生の選択肢（住宅購入・キャリア変更・家族計画など）をシミュレーションし、「世界線」として並べて比較するツールです。モンテカルロシミュレーションで 100歳までの資産推移を計算します。物件紹介や投資助言は行いません。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  物件の紹介や投資のアドバイスはありますか？
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  ありません。YOHACK はどの選択肢を選ぶべきかを提案しません。比較に必要な数字の土台を返すだけです。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  個人情報はどう扱われますか？
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  シミュレーションに使用する情報は、セッション内でのみ使用されます。第三者への提供は行いません。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  適合チェックの後に何が起きますか？
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  12問のチェックに回答いただくと、自動で判定結果が出ます。条件に合う方には、YOHACK へのアクセス方法をご案内します。条件に合わない場合も、その旨をお伝えします。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* S7: CTA — 適合チェックへ */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#F5F0E8]">
          <div className="container max-w-2xl text-center">
            <p className="text-lg md:text-xl text-muted-foreground mb-2 leading-relaxed">
              あなたの年収、あなたの物件価格、あなたの家族構成で、
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              世界線がどう分岐するか。12問答えると、分かります。
            </p>
            <Button
              size="lg"
              className="bg-[#C8B89A] hover:bg-[#8A7A62] text-white text-lg px-10 py-4 rounded-full shadow-lg transition-all duration-300"
              onClick={() => {
                trackEvent(AnalyticsEvents.LP_HERO_CTA_CLICKED);
                window.location.href = "/fit-gate";
              }}
            >
              確かめる
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-xs text-[#8A7A62]/60 mt-4">所要時間：約3分</p>
          </div>
        </section>

        {/* フッター */}
        <footer className="border-t py-8">
          <div className="container max-w-3xl text-center space-y-4">
            <div className="flex justify-center">
              <YohackLockup theme="light" size="sm" />
            </div>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              YOHACK は金融商品・保険・不動産の販売や仲介を行うサービスではありません。シミュレーション結果は将来を保証するものではなく、意思決定の参考情報としてご利用ください。
            </p>
            <p className="text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} YOHACK. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
