import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, Pencil, Check, Info, TrendingUp, Sparkles } from "lucide-react";
import { a as apiClient, P as PageHeader, b as Button, B as Badge, D as Dialog, c as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, L as Label, I as Input, g as DialogFooter } from "./router-BY-t8vno.js";
import { K as KpiCard, S as SectionCard } from "./widgets-zPe-5n--.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-BPJEiix8.js";
import { S as Slider } from "./slider-DmDLIJel.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DuZHhhIr.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-wmEOSE2e.js";
import { a as pricingItems } from "./mock-data-DR5Lercr.js";
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
import "@radix-ui/react-tabs";
import "@radix-ui/react-slider";
import "@radix-ui/react-tooltip";
function PricingPage() {
  const [items, setItems] = useState(() => pricingItems.map((item) => ({
    ...item,
    status: "pending"
  })));
  const [activeTab, setActiveTab] = useState("pending");
  const [overrideItem, setOverrideItem] = useState(null);
  const [customPriceInput, setCustomPriceInput] = useState("");
  const [simulationMultiplier, setSimulationMultiplier] = useState([100]);
  useEffect(() => {
    apiClient.getPricing().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
      }
    });
  }, []);
  const filteredItems = items.filter((item) => activeTab === "all" || item.status === activeTab);
  const pendingCount = items.filter((i) => i.status === "pending").length;
  const approvedCount = items.filter((i) => i.status === "approved" || i.status === "overridden").length;
  const activeItemsForMargin = items.filter((i) => i.status === "approved" || i.status === "pending" || i.status === "overridden");
  const avgMargin = activeItemsForMargin.length > 0 ? activeItemsForMargin.reduce((sum, item) => sum + (item.overrideMargin ?? item.margin), 0) / activeItemsForMargin.length : 32;
  const multiplierVal = simulationMultiplier[0] / 100;
  const baseRevenueLift = 184e3;
  const simulatedRevenueLift = baseRevenueLift * multiplierVal * (1 - (multiplierVal - 1) * 0.4);
  const handleAccept = (id) => {
    apiClient.updateRecommendationStatus(id, "approved").then((res) => {
      setItems((prev) => prev.map((item2) => item2.id === id ? {
        ...item2,
        status: "approved"
      } : item2));
      const item = items.find((i) => i.id === id);
      toast.success(`Pricing recommendation approved for ${item?.product}`);
    });
  };
  const handleReject = (id) => {
    apiClient.updateRecommendationStatus(id, "rejected").then((res) => {
      setItems((prev) => prev.map((item2) => item2.id === id ? {
        ...item2,
        status: "rejected"
      } : item2));
      const item = items.find((i) => i.id === id);
      toast.success(`Pricing recommendation rejected for ${item?.product}`);
    });
  };
  const openOverrideDialog = (item) => {
    setOverrideItem(item);
    setCustomPriceInput((item.overridePrice ?? item.recommendedPrice).toFixed(2));
  };
  const saveOverride = () => {
    if (!overrideItem) return;
    const newPrice = parseFloat(customPriceInput);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    const estimatedCost = overrideItem.currentPrice * (1 - overrideItem.margin / 100);
    const newMargin = Math.round((newPrice - estimatedCost) / newPrice * 100);
    const priceChangePct = (newPrice - overrideItem.currentPrice) / overrideItem.currentPrice;
    const estimatedImpact = Math.round(priceChangePct * 10 * 10) / 10;
    apiClient.updateRecommendationStatus(overrideItem.id, "overridden", {
      override_price: newPrice,
      override_margin: newMargin,
      override_impact: estimatedImpact
    }).then((res) => {
      setItems((prev) => prev.map((item) => item.id === overrideItem.id ? {
        ...item,
        status: "overridden",
        overridePrice: newPrice,
        overrideMargin: newMargin,
        overrideImpact: estimatedImpact
      } : item));
      toast.success(`Applied custom override of $${newPrice.toFixed(2)} for ${overrideItem.product}`);
      setOverrideItem(null);
    });
  };
  const resetAll = () => {
    setItems(pricingItems.map((item) => ({
      ...item,
      status: "pending"
    })));
    setSimulationMultiplier([100]);
    toast.success("Pricing recommendations reset to defaults.");
  };
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Dynamic Pricing", description: "AI-recommended price adjustments based on demand elasticity, margins, and competitor signals.", actions: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: resetAll, children: "Reset Workspace" }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Recommendations Pending", value: `${pendingCount}`, accent: pendingCount > 0 ? "primary" : void 0 }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Avg. Target Margin", value: `${avgMargin.toFixed(1)}%`, delta: "+1.2%", trend: "up", accent: "success" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Simulated Revenue Lift", value: `$${Math.round(simulatedRevenueLift / 1e3)}K`, hint: "Next 30 days projection", accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Approval Rate (30d)", value: "78%", hint: "42 of 54 accepted" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs(SectionCard, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 mb-4", children: [
          /* @__PURE__ */ jsx(Tabs, { value: activeTab, onValueChange: (v) => setActiveTab(v), children: /* @__PURE__ */ jsxs(TabsList, { children: [
            /* @__PURE__ */ jsxs(TabsTrigger, { value: "pending", children: [
              "Pending (",
              pendingCount,
              ")"
            ] }),
            /* @__PURE__ */ jsxs(TabsTrigger, { value: "approved", children: [
              "Approved (",
              approvedCount,
              ")"
            ] }),
            /* @__PURE__ */ jsxs(TabsTrigger, { value: "rejected", children: [
              "Rejected (",
              items.filter((i) => i.status === "rejected").length,
              ")"
            ] }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "all", children: "All" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Showing ",
            filteredItems.length,
            " recommendations"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Product" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Current" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Recommended" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Competitor Avg." }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Est. Margin" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Expected Impact" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxs(TableBody, { children: [
            filteredItems.map((p) => {
              const displayPrice = p.overridePrice ?? p.recommendedPrice;
              const displayMargin = p.overrideMargin ?? p.margin;
              const displayImpact = p.overrideImpact ?? p.expectedImpact;
              const delta = displayPrice - p.currentPrice;
              return /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { children: p.product }),
                  p.overridePrice && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "ml-2 bg-primary/10 text-primary border-primary/20 text-[9px] px-1 py-0 h-4", children: "Overridden" })
                ] }) }),
                /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono", children: [
                  "$",
                  p.currentPrice.toFixed(2)
                ] }),
                /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono font-semibold", children: [
                  "$",
                  displayPrice.toFixed(2),
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `ml-2 text-[10px] ${delta >= 0 ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30"}`, children: [
                    delta >= 0 ? "+" : "",
                    (delta / p.currentPrice * 100).toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono text-muted-foreground", children: [
                  "$",
                  p.competitorAvg.toFixed(2)
                ] }),
                /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono", children: [
                  displayMargin,
                  "%"
                ] }),
                /* @__PURE__ */ jsxs(TableCell, { className: `text-right font-mono font-semibold ${displayImpact >= 0 ? "text-success" : "text-destructive"}`, children: [
                  displayImpact >= 0 ? "+" : "",
                  displayImpact,
                  "%"
                ] }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: p.status === "pending" ? /* @__PURE__ */ jsxs("div", { className: "inline-flex gap-1", children: [
                  /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-8 text-destructive hover:bg-destructive/10 hover:text-destructive", onClick: () => handleReject(p.id), title: "Reject", children: /* @__PURE__ */ jsx(X, { className: "size-3.5" }) }),
                  /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-8", onClick: () => openOverrideDialog(p), title: "Override Price", children: /* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }) }),
                  /* @__PURE__ */ jsxs(Button, { size: "sm", className: "h-8", onClick: () => handleAccept(p.id), children: [
                    /* @__PURE__ */ jsx(Check, { className: "size-3.5" }),
                    " Accept"
                  ] })
                ] }) : /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "h-8 text-xs", onClick: () => {
                  apiClient.updateRecommendationStatus(p.id, "pending", {
                    override_price: null,
                    override_margin: null,
                    override_impact: null
                  }).then(() => {
                    setItems((prev) => prev.map((item) => item.id === p.id ? {
                      ...item,
                      status: "pending",
                      overridePrice: void 0,
                      overrideMargin: void 0,
                      overrideImpact: void 0
                    } : item));
                    toast.info(`Moved ${p.product} back to pending`);
                  });
                }, children: "Revert" }) })
              ] }, p.id);
            }),
            filteredItems.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center text-muted-foreground py-12", children: "No recommendations found in this status." }) })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SectionCard, { title: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "size-4 text-primary" }),
        "Revenue Elasticity Sandbox"
      ] }), description: "Adjust market pricing factor to simulate sales decay vs margin optimization", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-medium text-foreground", children: [
              "Pricing Aggressiveness",
              /* @__PURE__ */ jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Info, { className: "size-3.5 text-muted-foreground cursor-pointer" }) }) }),
                /* @__PURE__ */ jsx(TooltipContent, { className: "max-w-xs", children: "Adjusting pricing aggressiveness scaling. 100% is the AI recommended baseline. Higher levels increase pricing margins but will begin to decay purchase velocity." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs font-semibold text-primary", children: [
              simulationMultiplier[0],
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Slider, { value: simulationMultiplier, onValueChange: setSimulationMultiplier, min: 50, max: 150, step: 5 }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { children: "Defensive (Volume)" }),
            /* @__PURE__ */ jsx("span", { children: "AI Optimal" }),
            /* @__PURE__ */ jsx("span", { children: "Aggressive (Margin)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-surface-2 p-3 space-y-2 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Simulated Net Margin:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono font-medium text-foreground", children: [
                (avgMargin * (simulationMultiplier[0] / 100)).toFixed(1),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Expected Demand Change:" }),
              /* @__PURE__ */ jsx("span", { className: `font-mono font-medium ${simulationMultiplier[0] > 100 ? "text-destructive" : "text-success"}`, children: simulationMultiplier[0] === 100 ? "0.0%" : simulationMultiplier[0] > 100 ? `-${((simulationMultiplier[0] - 100) * 0.35).toFixed(1)}%` : `+${((100 - simulationMultiplier[0]) * 0.25).toFixed(1)}%` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-border pt-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: "Projected Revenue Lift:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono font-bold text-primary", children: [
                "$",
                simulatedRevenueLift.toLocaleString(void 0, {
                  maximumFractionDigits: 0
                })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs leading-relaxed text-muted-foreground bg-muted/30 rounded-lg border border-border", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-semibold text-foreground mb-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "size-3.5 text-success" }),
              "AI Optimization Insight"
            ] }),
            simulationMultiplier[0] > 115 ? /* @__PURE__ */ jsx("span", { children: "Setting pricing this high triggers customer attrition warnings in Electronics categories. Optimal revenue lift peaks around 105%." }) : simulationMultiplier[0] < 85 ? /* @__PURE__ */ jsx("span", { children: "Pricing defensively increases volume but drops net profit margins below acceptable corporate target thresholds of 28%." }) : /* @__PURE__ */ jsx("span", { children: "Current pricing strategy is balanced. You are capturing optimal customer conversion without sacrificing item-level margins." })
          ] })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!overrideItem, onOpenChange: (o) => !o && setOverrideItem(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: overrideItem && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Override Recommendation" }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Manually adjust target pricing for ",
          overrideItem.product,
          ". This will override the AI recommendation."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-muted-foreground", children: "Current Price" }),
            /* @__PURE__ */ jsxs("p", { className: "text-base font-semibold font-mono", children: [
              "$",
              overrideItem.currentPrice.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-muted-foreground", children: "AI Recommended" }),
            /* @__PURE__ */ jsxs("p", { className: "text-base font-semibold font-mono text-primary", children: [
              "$",
              overrideItem.recommendedPrice.toFixed(2)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "customPrice", children: "Custom Target Price ($)" }),
          /* @__PURE__ */ jsx(Input, { id: "customPrice", type: "number", step: "0.01", value: customPriceInput, onChange: (e) => setCustomPriceInput(e.target.value), className: "font-mono" })
        ] }),
        parseFloat(customPriceInput) > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-surface-2 border border-border p-3 space-y-2 text-xs", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: "Live Simulation Calculations" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Proposed Price Delta:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
              parseFloat(customPriceInput) - overrideItem.currentPrice >= 0 ? "+" : "",
              ((parseFloat(customPriceInput) - overrideItem.currentPrice) / overrideItem.currentPrice * 100).toFixed(1),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "New Estimated Margin:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono font-medium", children: [
              (() => {
                const newP = parseFloat(customPriceInput);
                const cost = overrideItem.currentPrice * (1 - overrideItem.margin / 100);
                return Math.round((newP - cost) / newP * 100);
              })(),
              "%"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOverrideItem(null), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: saveOverride, children: "Apply Override" })
      ] })
    ] }) }) })
  ] }) });
}
export {
  PricingPage as component
};
