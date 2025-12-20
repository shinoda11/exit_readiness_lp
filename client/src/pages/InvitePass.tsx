import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { CheckCircle2, XCircle, ArrowRight, ExternalLink } from "lucide-react";

export default function InvitePass() {
  const { token } = useParams<{ token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const validateToken = trpc.inviteToken.validate.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  useEffect(() => {
    if (validateToken.data !== undefined) {
      setIsValidToken(validateToken.data.isValid);
      if (validateToken.data.isValid) {
        trackEvent(AnalyticsEvents.INVITE_LP_VIEW);
      }
    }
  }, [validateToken.data]);

  if (!token || isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <Helmet>
          <title>招待リンク無効 | Exit Readiness OS</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Card className="max-w-md w-full p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">招待リンクが無効です</h1>
          <p className="text-muted-foreground mb-6">
            この招待リンクは期限切れ、または無効になりました。必要であれば紹介者に連絡してください。
          </p>
          <Button asChild className="w-full">
            <Link href="/">公開LPへ戻る</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">招待リンクを確認中...</p>
        </div>
      </div>
    );
  }

  const handleCTAClick = () => {
    trackEvent(AnalyticsEvents.INVITE_LP_CTA_FITGATE_CLICKED);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>友人紹介枠: 家の意思決定を世界線比較で整理するPass | Exit Readiness OS</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="友人紹介枠: Exit Readiness OS Pass（招待制ページ）" />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              招待制ページ
            </span>
            <span className="text-xs text-muted-foreground">共有は控えてください</span>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            公開LPへ
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            友人紹介枠: 家の意思決定を<br />世界線比較で整理するPass
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed">
            家、仕事、暮らす場所の意思決定を、Rent / Buy / Buy+Shock の世界線で並べて、数値ベースの意思決定メモに落とすオンラインツールです。
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            決済リンクは公開しません。適合チェック通過者にのみ案内します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6"
              onClick={handleCTAClick}
            >
              <Link href={`/fit-gate?src=friend_invite&inviteToken=${token}`}>
                適合チェックに進む（3分）
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <a href="#preview">まずは中身を見る（60秒）</a>
            </Button>
          </div>
        </div>
      </section>

      {/* 信用付与ブロック */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto p-8 md:p-12 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">紹介として一言</h2>
          <p className="text-lg leading-relaxed mb-4">
            これは万人向けではありません。ただ、条件が合う人には、意思決定が一気に進みます。
            買う前に適合チェックを挟むのは、あなたの時間とお金を無駄にしないためです。
          </p>
          <p className="text-sm text-muted-foreground">
            合わない状態で買うと、刺身に醤油をかける前に満腹になります。
          </p>
        </Card>
      </section>

      {/* 90日で手に入る成果物 */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Passで手に入るもの</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">上限レンジ</h3>
              <p className="text-muted-foreground">
                買っても逃げ道が残る上限と、危険ラインを数値で固定します
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">3世界線の結論</h3>
              <p className="text-muted-foreground">
                Rent / Buy / Buy+Shock を同じ指標で横並び比較します
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">次の30日アクション</h3>
              <p className="text-muted-foreground">
                更新すべき数字と順番が決まるので迷子になりません
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 60秒プレビュー */}
      <section id="preview" className="container mx-auto px-4 py-16 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">中身はこうなっています（60秒）</h2>
          <p className="text-center text-muted-foreground mb-12">実際のツール画面をプレビューできます</p>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card className="p-6">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">スクショ: Cockpit比較画面</span>
              </div>
              <h3 className="text-lg font-bold mb-2">シナリオ比較（Rent / Buy / Buy+Shock）</h3>
              <p className="text-sm text-muted-foreground">
                結論がブレないよう、同じ指標で並べて比較します
              </p>
            </Card>
            <Card className="p-6">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">スクショ: レバー操作画面</span>
              </div>
              <h3 className="text-lg font-bold mb-2">レバー操作（前提を動かして耐性を見る）</h3>
              <p className="text-sm text-muted-foreground">
                物件価格、頭金、投資入金、ショックを動かして安全ラインを確認します
              </p>
            </Card>
            <Card className="p-6">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">スクショ: 意思決定メモ</span>
              </div>
              <h3 className="text-lg font-bold mb-2">意思決定メモ（成果物）</h3>
              <p className="text-sm text-muted-foreground">
                上限レンジ、3世界線結論、次の30日を1枚に固定します
              </p>
            </Card>
          </div>
          <div className="text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              onClick={handleCTAClick}
            >
              <Link href={`/fit-gate?src=friend_invite&inviteToken=${token}`}>
                適合チェックに進む（3分）
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 向いている人 / 向いていない人 */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">合う人 合わない人</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-green-200 bg-green-50/50">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold">合う人</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>1〜6か月以内に意思決定がある</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>物件の価格帯がある程度見えている</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>数字入力に抵抗がない</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>迷いの原因が「比較軸が揃っていない」ことにある</span>
                </li>
              </ul>
            </Card>
            <Card className="p-8 border-red-200 bg-red-50/50">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold">合わない人</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>期限が未定で、まず情報収集だけしたい</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>価格帯が未定で、何を比較すべきかも未定</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>数字入力をしたくない</span>
                </li>
              </ul>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            合わない状態で買うと、価値体験に到達しにくいので適合チェックで分岐します。
          </p>
        </div>
      </section>

      {/* Passの範囲 */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">含まれるもの</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Pass 90日（29,800円）</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>ツール利用（比較、レバー操作、意思決定メモ生成）</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Onboarding 3タスク（成果物まで到達させる仕組み）</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">含まれないもの</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>物件紹介、仲介、営業</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>保険や投資商品の販売</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>税務申告代行、個別税務判断の確定</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>チャット相談などの人的サポートの常設</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            必要な場合のみ、利用開始後にDecision Sessionへのアップグレード申請が可能です（審査制、枠制）。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">FAQ 友人向け</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-2">Q 何をしてくれるツールですか</h3>
              <p className="text-muted-foreground">
                A 家、仕事、暮らす場所の選択を世界線比較で整理し、意思決定メモに落とします
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">Q 物件紹介や営業はありますか</h3>
              <p className="text-muted-foreground">
                A ありません。物件紹介、保険や投資商品の販売はしません
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">Q 税務や法務の代行ですか</h3>
              <p className="text-muted-foreground">
                A 違います。税務申告代行、個別の税務判断の確定は行いません
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">Q 個人情報はどう扱いますか</h3>
              <p className="text-muted-foreground">
                A 判定と提供の目的にのみ利用し、目的外利用はしません。決済リンクは公開しません
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">Q うまく使えなかった場合はどうなりますか</h3>
              <p className="text-muted-foreground">
                A 提供側の不備で体験が成立しない場合は、再案内または利用期間の調整でリカバリーします
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">まずは適合チェックで、いまの段階を確認してください</h2>
          <p className="text-lg text-muted-foreground mb-8">
            申込みではなく、準備状態のチェックです。<br />
            Readyなら世界線比較へ、Prepなら準備ステップへ案内します。
          </p>
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6"
            onClick={handleCTAClick}
          >
            <Link href={`/fit-gate?src=friend_invite&inviteToken=${token}`}>
              適合チェックに進む（3分）
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-6">
            決済後はログイン情報が自動発行され、Onboardingから開始します。
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Exit Readiness OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
