import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { RefreshCw, Info, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { a as apiClient, P as PageHeader, b as Button } from "./router-piqkfnbA.js";
import { K as KpiCard, S as SectionCard, C as Card } from "./widgets-CtN5f3kO.js";
import { D as DemandAreaChart, S as SalesTrendChart } from "./charts-D0wwd6r_.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-BFAjJf7u.js";
import { S as Slider } from "./slider-CWQY72Jv.js";
import { d as demandForecast, e as salesTrend } from "./mock-data-BF-8ZobF.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
import "recharts";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-slider";
const defaultGrowers = [{
  name: "Smart Hub Z-Wave",
  growth: 43,
  units: 612
}, {
  name: "Neural Engine Core v2",
  growth: 28,
  units: 890
}, {
  name: "Solar-X Panel 400W",
  growth: 19,
  units: 64
}];
const defaultSlow = [{
  name: "Ceramic Capacitor 220uF",
  growth: -18,
  units: 85e3
}, {
  name: "Titan Castings (Legacy)",
  growth: -12,
  units: 142
}, {
  name: "Flex-Cable Assembly",
  growth: -4,
  units: 2400
}];
function ForecastingPage() {
  const [marketingSpend, setMarketingSpend] = useState([0]);
  const [marketGrowth, setMarketGrowth] = useState([0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [forecast, setForecast] = useState(demandForecast);
  const [trend, setTrend] = useState(salesTrend);
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
  const mMultiplier = 1 + marketingSpend[0] * 6e-3;
  const gMultiplier = 1 + marketGrowth[0] * 0.012;
  const simulatedForecast = forecast.map((item) => {
    if (item.actual === 0) {
      return {
        ...item,
        forecast: Math.round(item.forecast * mMultiplier * gMultiplier),
        upper: Math.round(item.upper * mMultiplier * gMultiplier * 1.05),
        lower: Math.max(0, Math.round(item.lower * mMultiplier * gMultiplier * 0.95))
      };
    }
    return item;
  });
  const simulatedGrowers = defaultGrowers.map((g) => {
    const factor = marketingSpend[0] * 0.2 + marketGrowth[0] * 0.5;
    return {
      ...g,
      growth: Math.round(g.growth + factor)
    };
  });
  const simulatedSlow = defaultSlow.map((s) => {
    const factor = marketingSpend[0] * 0.1 + marketGrowth[0] * 0.2;
    return {
      ...s,
      growth: Math.round(s.growth + factor)
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
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Demand Forecasting", description: "Machine learning predictions trained on 24 months of demand signals.", actions: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleReset, disabled: isSimulating, children: [
      /* @__PURE__ */ jsx(RefreshCw, { className: `size-3.5 mr-1.5 ${isSimulating ? "animate-spin" : ""}` }),
      "Reset Simulation"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Forecast Accuracy (90d)", value: metrics.accuracy, delta: "+1.4%", trend: "up", accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "MAPE", value: metrics.mape, hint: "Mean absolute % error" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Confidence Interval", value: metrics.confidence, hint: "95% prediction band" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Model Version", value: metrics.version, hint: "Updated recently" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(SectionCard, { title: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
        "Forecast vs. Actual Demand",
        /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Info, { className: "size-3.5 text-muted-foreground cursor-pointer" }) }) }),
          /* @__PURE__ */ jsx(TooltipContent, { className: "max-w-xs", children: "Forecast band shows 95% confidence interval from the ensemble model. Simulating parameters will shift the future weeks." })
        ] })
      ] }), description: "Aggregated weekly demand · electronics category", children: /* @__PURE__ */ jsx(DemandAreaChart, { data: simulatedForecast }) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SectionCard, { title: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "size-4 text-primary" }),
        "AI Scenario Simulator"
      ] }), description: "Simulate business impacts to see real-time demand adjustments", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsx(LabelWithTooltip, { label: "Marketing Campaign Spend", tooltip: "Simulates demand generation based on advertising budget increases (+0% to +50%)." }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs font-semibold text-primary", children: [
              "+",
              marketingSpend[0],
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Slider, { value: marketingSpend, onValueChange: setMarketingSpend, min: 0, max: 50, step: 5 }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Increases baseline promotional velocity across products." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsx(LabelWithTooltip, { label: "Market Growth Rate", tooltip: "Simulates macroeconomic changes, market expansion, or competitor stock-out scenarios (-10% to +20%)." }),
            /* @__PURE__ */ jsxs("span", { className: `font-mono text-xs font-semibold ${marketGrowth[0] >= 0 ? "text-success" : "text-destructive"}`, children: [
              marketGrowth[0] >= 0 ? "+" : "",
              marketGrowth[0],
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Slider, { value: marketGrowth, onValueChange: setMarketGrowth, min: -10, max: 20, step: 2 }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Applies an organic growth factor to overall demand curves." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-primary mb-1", children: "AI Prediction Summary" }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground leading-relaxed", children: [
            "Under this scenario, peak demand is estimated to reach",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "font-semibold font-mono text-foreground", children: [
              Math.round(720 * mMultiplier * gMultiplier),
              " units"
            ] }),
            " ",
            "in Week 8. Recommended safety stock buffers should be adjusted by",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "font-semibold font-mono text-foreground", children: [
              Math.round((mMultiplier * gMultiplier - 1) * 100),
              "%"
            ] }),
            " ",
            "to prevent stockouts."
          ] })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6", children: [
      /* @__PURE__ */ jsx(SectionCard, { title: "Seasonal Trend", description: "Indexed sales over 12 months", children: /* @__PURE__ */ jsx(SalesTrendChart, { data: trend }) }),
      /* @__PURE__ */ jsx(SectionCard, { title: "Model Summary", description: "Ensemble: XGBoost + LSTM + Prophet", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
        /* @__PURE__ */ jsx(Row, { label: "Training samples", value: "284,902" }),
        /* @__PURE__ */ jsx(Row, { label: "Features Used", value: "48 (Price, Promo, Competitor, Weather, Lagged Demand)" }),
        /* @__PURE__ */ jsx(Row, { label: "Validation R²", value: "0.917" }),
        /* @__PURE__ */ jsx(Row, { label: "Last retrain", value: "2026-06-05" }),
        /* @__PURE__ */ jsx(Row, { label: "Prediction horizon", value: "12 weeks" }),
        /* @__PURE__ */ jsx(Row, { label: "Refresh cadence", value: "Daily 04:00 UTC" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(SectionCard, { title: "Top-growing Products", description: "Highest predicted demand uplift (simulated)", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: simulatedGrowers.map((g) => /* @__PURE__ */ jsxs(Card, { className: "p-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: g.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            g.units.toLocaleString(),
            " units in stock"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 text-sm font-mono ${g.growth >= 0 ? "text-success" : "text-destructive"}`, children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "size-4" }),
          " ",
          g.growth >= 0 ? "+" : "",
          g.growth,
          "%"
        ] })
      ] }, g.name)) }) }),
      /* @__PURE__ */ jsx(SectionCard, { title: "Slow-moving Inventory", description: "Predicted demand decline (simulated)", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: simulatedSlow.map((g) => /* @__PURE__ */ jsxs(Card, { className: "p-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: g.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            g.units.toLocaleString(),
            " units in stock"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 text-sm font-mono ${g.growth >= 0 ? "text-success" : "text-destructive"}`, children: [
          g.growth >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "size-4" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "size-4" }),
          g.growth >= 0 ? "+" : "",
          g.growth,
          "%"
        ] })
      ] }, g.name)) }) })
    ] })
  ] }) });
}
function LabelWithTooltip({
  label,
  tooltip
}) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-medium text-foreground", children: [
    label,
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Info, { className: "size-3.5 text-muted-foreground cursor-pointer" }) }) }),
      /* @__PURE__ */ jsx(TooltipContent, { className: "max-w-xs", children: tooltip })
    ] })
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-border pb-2 last:border-0", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-mono text-right", children: value })
  ] });
}
export {
  ForecastingPage as component
};
