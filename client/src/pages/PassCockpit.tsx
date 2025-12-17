import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PassCockpit() {
  const [, setLocation] = useLocation();
  
  // Lever states
  const [propertyPrice, setPropertyPrice] = useState(8000); // 万円
  const [downPayment, setDownPayment] = useState(2000); // 万円
  const [investmentDeposit, setInvestment] = useState(500); // 万円/月
  const [shockScenario, setShockScenario] = useState("none");

  // Scenario results (mock data)
  const scenarios = [
    {
      name: "Rent（賃貸継続）",
      color: "bg-blue-500",
      age60Assets: 8500,
      age40to50CF: 450,
      withdrawalStartAge: 62,
    },
    {
      name: "Buy（持ち家購入）",
      color: "bg-green-500",
      age60Assets: 9200,
      age40to50CF: 380,
      withdrawalStartAge: 64,
    },
    {
      name: "Buy+Shock（購入+ショック）",
      color: "bg-red-500",
      age60Assets: 7800,
      age40to50CF: 320,
      withdrawalStartAge: 60,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/pass/onboarding")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
            <h1 className="text-xl font-bold">Cockpit - シナリオ比較</h1>
          </div>
        </header>

        {/* Cockpit Content */}
        <section className="container py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Levers */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">レバー操作</h2>
                
                <div className="space-y-6">
                  {/* Property Price */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      物件価格: {propertyPrice}万円
                    </label>
                    <Slider
                      value={[propertyPrice]}
                      onValueChange={(v) => setPropertyPrice(v[0])}
                      min={3000}
                      max={15000}
                      step={500}
                    />
                  </div>

                  {/* Down Payment */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      頭金: {downPayment}万円
                    </label>
                    <Slider
                      value={[downPayment]}
                      onValueChange={(v) => setDownPayment(v[0])}
                      min={0}
                      max={5000}
                      step={100}
                    />
                  </div>

                  {/* Investment Deposit */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      投資入金: {investmentDeposit}万円/月
                    </label>
                    <Slider
                      value={[investmentDeposit]}
                      onValueChange={(v) => setInvestment(v[0])}
                      min={0}
                      max={2000}
                      step={50}
                    />
                  </div>

                  {/* Shock Scenario */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      ショック選択
                    </label>
                    <Select value={shockScenario} onValueChange={setShockScenario}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">なし</SelectItem>
                        <SelectItem value="income_drop">収入減（-30%）</SelectItem>
                        <SelectItem value="medical">医療費増（+200万円）</SelectItem>
                        <SelectItem value="education">教育費増（+500万円）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" size="lg">
                    再計算
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right: Scenario Comparison */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">3つのシナリオ比較</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Rent/Buy/Buy+Shockの3つの世界線を比較して、あなたに最適な選択を見つけましょう
                  </p>
                </div>

                {scenarios.map((scenario) => (
                  <Card key={scenario.name} className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-3 h-3 rounded-full ${scenario.color} mt-1.5`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{scenario.name}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">60歳時点資産</p>
                        <p className="text-xl font-bold">{scenario.age60Assets}万円</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">40〜50代CF</p>
                        <p className="text-xl font-bold">{scenario.age40to50CF}万円/年</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">取り崩し開始年</p>
                        <p className="text-xl font-bold">{scenario.withdrawalStartAge}歳</p>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>ヒント：</strong>レバーを操作して、各シナリオの結果がどう変化するか確認しましょう。
                  </p>
                </div>
              </div>
            </div>
          </div>
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
