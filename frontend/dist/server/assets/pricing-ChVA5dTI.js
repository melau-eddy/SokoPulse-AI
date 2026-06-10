import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, Pencil, Check, AlertCircle, Percent, Calendar, Truck, Globe, Activity, Info, TrendingUp, Sparkles } from "lucide-react";
import { a as apiClient, P as PageHeader, b as Button, B as Badge, D as Dialog, c as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, L as Label, I as Input, g as DialogFooter } from "./router-DmYFa0HW.js";
import { K as KpiCard, S as SectionCard } from "./widgets-CqJ4_jAo.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-DRZ-Tzoo.js";
import { S as Slider } from "./slider-Cc9n10eo.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CeW7GHO_.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-CVXzNilM.js";
import { a as pricingItems, b as formatPrice, f as fmtCurrency } from "./mock-data-BF-8ZobF.js";
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
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeCurrency, setActiveCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_currency") || "USD";
    }
    return "USD";
  });
  useEffect(() => {
    apiClient.getPricing().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
        setSelectedItemId(data[0].id);
      }
    });
    const handleCurrencyUpdated = () => {
      setActiveCurrency(localStorage.getItem("sokopulse_currency") || "USD");
    };
    window.addEventListener("currency-updated", handleCurrencyUpdated);
    return () => {
      window.removeEventListener("currency-updated", handleCurrencyUpdated);
    };
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
    const rate = activeCurrency === "KES" ? 130 : 1;
    setCustomPriceInput(((item.overridePrice ?? item.recommendedPrice) * rate).toFixed(2));
  };
  const saveOverride = () => {
    if (!overrideItem) return;
    const inputPrice = parseFloat(customPriceInput);
    if (isNaN(inputPrice) || inputPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    const rate = activeCurrency === "KES" ? 130 : 1;
    const newPriceUSD = inputPrice / rate;
    const estimatedCostUSD = overrideItem.currentPrice * (1 - overrideItem.margin / 100);
    const newMargin = Math.round((newPriceUSD - estimatedCostUSD) / newPriceUSD * 100);
    const priceChangePct = (newPriceUSD - overrideItem.currentPrice) / overrideItem.currentPrice;
    const estimatedImpact = Math.round(priceChangePct * 10 * 10) / 10;
    apiClient.updateRecommendationStatus(overrideItem.id, "overridden", {
      override_price: newPriceUSD,
      override_margin: newMargin,
      override_impact: estimatedImpact
    }).then((res) => {
      setItems((prev) => prev.map((item) => item.id === overrideItem.id ? {
        ...item,
        status: "overridden",
        overridePrice: newPriceUSD,
        overrideMargin: newMargin,
        overrideImpact: estimatedImpact
      } : item));
      const displayFormattedPrice = activeCurrency === "KES" ? `KES ${(newPriceUSD * 130).toLocaleString(void 0, {
        minimumFractionDigits: 2
      })}` : `$${newPriceUSD.toFixed(2)}`;
      toast.success(`Applied custom override of ${displayFormattedPrice} for ${overrideItem.product}`);
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
              return /* @__PURE__ */ jsxs(TableRow, { onClick: () => setSelectedItemId(p.id), className: `cursor-pointer transition-colors duration-150 ${selectedItemId === p.id ? "bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/50"}`, children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 py-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: p.product }),
                    p.overridePrice && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "ml-2 bg-primary/10 text-primary border-primary/20 text-[9px] px-1.5 py-0 h-4", children: "Overridden" })
                  ] }),
                  (p.demandElasticity || p.seasonalityFactor || p.supplierCostFactor || p.externalFactor) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 items-center mt-1", children: [
                    p.demandElasticity && /* @__PURE__ */ jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0 bg-blue-500/5 text-blue-400 border-blue-500/20 cursor-help font-mono", children: [
                        "Elas: ",
                        p.demandElasticity.split(" ")[0]
                      ] }) }),
                      /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsxs("p", { className: "text-xs", children: [
                        "Demand Elasticity: ",
                        p.demandElasticity
                      ] }) })
                    ] }),
                    p.seasonalityFactor && /* @__PURE__ */ jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0 bg-amber-500/5 text-amber-400 border-amber-500/20 cursor-help font-mono", children: [
                        "Seas: ",
                        p.seasonalityFactor.split(" ")[0]
                      ] }) }),
                      /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsxs("p", { className: "text-xs", children: [
                        "Seasonality Index: ",
                        p.seasonalityFactor
                      ] }) })
                    ] }),
                    p.supplierCostFactor && /* @__PURE__ */ jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0 bg-purple-500/5 text-purple-400 border-purple-500/20 cursor-help font-mono", children: [
                        "Cost: ",
                        p.supplierCostFactor.split(" ")[0]
                      ] }) }),
                      /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsxs("p", { className: "text-xs", children: [
                        "Supplier Cost Factor: ",
                        p.supplierCostFactor
                      ] }) })
                    ] }),
                    p.externalFactor && /* @__PURE__ */ jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0 bg-emerald-500/5 text-emerald-400 border-emerald-500/20 cursor-help max-w-[150px] truncate", children: [
                        "Ext: ",
                        p.externalFactor.split(":")[0]
                      ] }) }),
                      /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsx("p", { className: "text-xs max-w-[250px]", children: p.externalFactor }) })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono", children: formatPrice(p.currentPrice) }),
                /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono font-semibold", children: [
                  formatPrice(displayPrice),
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `ml-2 text-[10px] ${delta >= 0 ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30"}`, children: [
                    delta >= 0 ? "+" : "",
                    (delta / p.currentPrice * 100).toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-muted-foreground", children: formatPrice(p.competitorAvg) }),
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
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        (() => {
          const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];
          if (!selectedItem) return null;
          return /* @__PURE__ */ jsx(SectionCard, { title: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-base font-semibold text-foreground", children: [
            /* @__PURE__ */ jsx(Activity, { className: "size-4.5 text-primary animate-pulse" }),
            "Real-time Pricing Drivers"
          ] }), description: "Dynamic audit details justifying the recommended target price", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3 bg-primary/5 rounded-lg border border-primary/15", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-1.5", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground truncate max-w-[180px]", children: selectedItem.product }),
                /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] font-mono capitalize", children: [
                  "Status: ",
                  selectedItem.status
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-border/50", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block text-[9px] uppercase", children: "Current" }),
                  /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold", children: formatPrice(selectedItem.currentPrice) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground block text-[9px] uppercase", children: "Advised" }),
                  /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-primary", children: formatPrice(selectedItem.overridePrice ?? selectedItem.recommendedPrice) })
                ] })
              ] })
            ] }),
            selectedItem.recommendationText && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-muted/40 rounded-lg border border-border text-xs leading-relaxed text-muted-foreground space-y-1", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "size-3.5 text-primary" }),
                "AI Recommendation Rationale"
              ] }),
              /* @__PURE__ */ jsx("p", { children: selectedItem.recommendationText })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-1", children: [
              selectedItem.demandElasticity && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 rounded-md hover:bg-muted/40 transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "p-1 rounded bg-blue-500/10 text-blue-400", children: /* @__PURE__ */ jsx(Percent, { className: "size-3.5" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-foreground block", children: "Price Elasticity" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Demand volume sensitivity" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-mono text-xs font-bold text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10", children: selectedItem.demandElasticity })
              ] }),
              selectedItem.seasonalityFactor && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 rounded-md hover:bg-muted/40 transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "p-1 rounded bg-amber-500/10 text-amber-400", children: /* @__PURE__ */ jsx(Calendar, { className: "size-3.5" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-foreground block", children: "Seasonality Index" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Temporal demand variations" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-mono text-xs font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10", children: selectedItem.seasonalityFactor })
              ] }),
              selectedItem.supplierCostFactor && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 rounded-md hover:bg-muted/40 transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "p-1 rounded bg-purple-500/10 text-purple-400", children: /* @__PURE__ */ jsx(Truck, { className: "size-3.5" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-foreground block", children: "Supplier Costs" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Logistics & supply margins" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-mono text-xs font-bold text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10", children: selectedItem.supplierCostFactor })
              ] }),
              selectedItem.externalFactor && /* @__PURE__ */ jsxs("div", { className: "p-2.5 rounded-md bg-emerald-500/5 border border-emerald-500/10 space-y-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-emerald-400", children: [
                  /* @__PURE__ */ jsx(Globe, { className: "size-3.5" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "External Market Factor" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed text-muted-foreground pl-5", children: selectedItem.externalFactor })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center text-muted-foreground italic pt-1 border-t border-border/40", children: "💡 Click any item in the pricing table to audit its drivers" })
          ] }) });
        })(),
        /* @__PURE__ */ jsx(SectionCard, { title: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
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
                /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-primary", children: fmtCurrency(simulatedRevenueLift) })
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
        ] }) })
      ] })
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
            /* @__PURE__ */ jsx("p", { className: "text-base font-semibold font-mono", children: formatPrice(overrideItem.currentPrice) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-muted-foreground", children: "AI Recommended" }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-semibold font-mono text-primary", children: formatPrice(overrideItem.recommendedPrice) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "customPrice", children: [
            "Custom Target Price (",
            activeCurrency,
            ")"
          ] }),
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
