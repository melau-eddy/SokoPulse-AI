import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Info, TrendingDown, TrendingUp, Sparkles, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, KpiCard } from "@/components/widgets";
import { DemandAreaChart, SalesTrendChart } from "@/components/charts";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { demandForecast as seedForecast, salesTrend as seedTrend } from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/forecasting")({
  head: () => ({ meta: [{ title: "Demand Forecasting — SokoPulse AI" }] }),
  component: ForecastingPage,
});

const defaultGrowers = [
  { name: "Smart Hub Z-Wave", growth: 43, units: 612 },
  { name: "Neural Engine Core v2", growth: 28, units: 890 },
  { name: "Solar-X Panel 400W", growth: 19, units: 64 },
];

const defaultSlow = [
  { name: "Ceramic Capacitor 220uF", growth: -18, units: 85000 },
  { name: "Titan Castings (Legacy)", growth: -12, units: 142 },
  { name: "Flex-Cable Assembly", growth: -4, units: 2400 },
];

function ForecastingPage() {
  const [marketingSpend, setMarketingSpend] = useState<number[]>([0]);
  const [marketGrowth, setMarketGrowth] = useState<number[]>([0]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const [forecast, setForecast] = useState<any[]>(seedForecast);
  const [trend, setTrend] = useState<any[]>(seedTrend);
  const [metrics, setMetrics] = useState({
    accuracy: "94.2%",
    mape: "5.8%",
    confidence: "±8.4%",
    version: "v3.2.1"
  });

  useEffect(() => {
    apiClient.getForecasting().then((res) => {
      if (res) {
        if (res.demandForecast) setForecast(res.demandForecast);
        if (res.salesTrend) setTrend(res.salesTrend);
        setMetrics({
          accuracy: res.accuracy || "94.2%",
          mape: res.mape || "5.8%",
          confidence: res.confidenceInterval || "±8.4%",
          version: res.modelVersion || "v3.2.1"
        });
      }
    });
  }, []);

  // Dynamic forecast based on sliders
  const mMultiplier = 1 + marketingSpend[0] * 0.006;
  const gMultiplier = 1 + marketGrowth[0] * 0.012;
  
  const simulatedForecast = forecast.map((item) => {
    if (item.actual === 0) {
      return {
        ...item,
        forecast: Math.round(item.forecast * mMultiplier * gMultiplier),
        upper: Math.round(item.upper * mMultiplier * gMultiplier * 1.05),
        lower: Math.max(0, Math.round(item.lower * mMultiplier * gMultiplier * 0.95)),
      };
    }
    return item;
  });

  const simulatedGrowers = defaultGrowers.map((g) => {
    const factor = (marketingSpend[0] * 0.2 + marketGrowth[0] * 0.5);
    return {
      ...g,
      growth: Math.round(g.growth + factor),
    };
  });

  const simulatedSlow = defaultSlow.map((s) => {
    const factor = (marketingSpend[0] * 0.1 + marketGrowth[0] * 0.2);
    return {
      ...s,
      growth: Math.round(s.growth + factor),
    };
  });

  const handleReset = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setMarketingSpend([0]);
      setMarketGrowth([0]);
      setIsSimulating(false);
      toast.success("Simulation parameters reset to baseline.");
    }, 400);
  };

  return (
    <TooltipProvider>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PageHeader
          title="Demand Forecasting"
          description="Machine learning predictions trained on 24 months of demand signals."
          actions={
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isSimulating}>
              <RefreshCw className={`size-3.5 mr-1.5 ${isSimulating ? "animate-spin" : ""}`} />
              Reset Simulation
            </Button>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Forecast Accuracy (90d)" value={metrics.accuracy} delta="+1.4%" trend="up" accent="primary" />
          <KpiCard label="MAPE" value={metrics.mape} hint="Mean absolute % error" />
          <KpiCard label="Confidence Interval" value={metrics.confidence} hint="95% prediction band" />
          <KpiCard label="Model Version" value={metrics.version} hint="Updated recently" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <SectionCard
              title={
                <span className="inline-flex items-center gap-1.5">
                  Forecast vs. Actual Demand
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Info className="size-3.5 text-muted-foreground cursor-pointer" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Forecast band shows 95% confidence interval from the ensemble model. Simulating parameters will shift the future weeks.
                    </TooltipContent>
                  </Tooltip>
                </span>
              }
              description="Aggregated weekly demand · electronics category"
            >
              <DemandAreaChart data={simulatedForecast} />
            </SectionCard>
          </div>

          {/* Scenario Simulator */}
          <div>
            <SectionCard 
              title={
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-4 text-primary" />
                  AI Scenario Simulator
                </span>
              }
              description="Simulate business impacts to see real-time demand adjustments"
            >
              <div className="space-y-6 py-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <LabelWithTooltip 
                      label="Marketing Campaign Spend" 
                      tooltip="Simulates demand generation based on advertising budget increases (+0% to +50%)."
                    />
                    <span className="font-mono text-xs font-semibold text-primary">+{marketingSpend[0]}%</span>
                  </div>
                  <Slider 
                    value={marketingSpend} 
                    onValueChange={setMarketingSpend} 
                    min={0} 
                    max={50} 
                    step={5} 
                  />
                  <p className="text-[10px] text-muted-foreground">Increases baseline promotional velocity across products.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <LabelWithTooltip 
                      label="Market Growth Rate" 
                      tooltip="Simulates macroeconomic changes, market expansion, or competitor stock-out scenarios (-10% to +20%)."
                    />
                    <span className={`font-mono text-xs font-semibold ${marketGrowth[0] >= 0 ? "text-success" : "text-destructive"}`}>
                      {marketGrowth[0] >= 0 ? "+" : ""}{marketGrowth[0]}%
                    </span>
                  </div>
                  <Slider 
                    value={marketGrowth} 
                    onValueChange={setMarketGrowth} 
                    min={-10} 
                    max={20} 
                    step={2} 
                  />
                  <p className="text-[10px] text-muted-foreground">Applies an organic growth factor to overall demand curves.</p>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
                  <p className="font-semibold text-primary mb-1">AI Prediction Summary</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Under this scenario, peak demand is estimated to reach{" "}
                    <span className="font-semibold font-mono text-foreground">
                      {Math.round(720 * mMultiplier * gMultiplier)} units
                    </span>{" "}
                    in Week 8. Recommended safety stock buffers should be adjusted by{" "}
                    <span className="font-semibold font-mono text-foreground">
                      {Math.round((mMultiplier * gMultiplier - 1) * 100)}%
                    </span>{" "}
                    to prevent stockouts.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SectionCard title="Seasonal Trend" description="Indexed sales over 12 months">
            <SalesTrendChart data={trend} />
          </SectionCard>
          <SectionCard title="Model Summary" description="Ensemble: XGBoost + LSTM + Prophet">
            <div className="space-y-3 text-sm">
              <Row label="Training samples" value="284,902" />
              <Row label="Features Used" value="48 (Price, Promo, Competitor, Weather, Lagged Demand)" />
              <Row label="Validation R²" value="0.917" />
              <Row label="Last retrain" value="2026-06-05" />
              <Row label="Prediction horizon" value="12 weeks" />
              <Row label="Refresh cadence" value="Daily 04:00 UTC" />
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Top-growing Products" description="Highest predicted demand uplift (simulated)">
            <div className="space-y-2">
              {simulatedGrowers.map((g) => (
                <Card key={g.name} className="p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.units.toLocaleString()} units in stock</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-sm font-mono ${g.growth >= 0 ? "text-success" : "text-destructive"}`}>
                    <TrendingUp className="size-4" /> {g.growth >= 0 ? "+" : ""}{g.growth}%
                  </span>
                </Card>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Slow-moving Inventory" description="Predicted demand decline (simulated)">
            <div className="space-y-2">
              {simulatedSlow.map((g) => (
                <Card key={g.name} className="p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.units.toLocaleString()} units in stock</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-sm font-mono ${g.growth >= 0 ? "text-success" : "text-destructive"}`}>
                    {g.growth >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                    {g.growth >= 0 ? "+" : ""}{g.growth}%
                  </span>
                </Card>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </TooltipProvider>
  );
}

function LabelWithTooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
      {label}
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Info className="size-3.5 text-muted-foreground cursor-pointer" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
      </Tooltip>
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}
