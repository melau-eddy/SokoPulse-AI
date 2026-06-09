import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, Radar, Sparkles, Info, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { a as apiClient, P as PageHeader, b as Button, L as Label, B as Badge, D as Dialog, c as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter } from "./router-DisKIf5n.js";
import { K as KpiCard, C as Card, S as SectionCard } from "./widgets-BnYJmuU8.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-PembC1pz.js";
import { C as CompetitorPriceChart } from "./charts-icuv4hmZ.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CeloYL4T.js";
import { T as TooltipProvider } from "./tooltip-Bfl79iCH.js";
import { e as competitors, g as competitorPrices, a as pricingItems } from "./mock-data-CXBJH4HK.js";
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
import "@radix-ui/react-select";
import "recharts";
import "@radix-ui/react-tooltip";
function CompetitorsPage() {
  const [selectedProductId, setSelectedProductId] = useState("pr1");
  const [showOppDialog, setShowOppDialog] = useState(false);
  const [activeCompareCompetitor, setActiveCompareCompetitor] = useState(null);
  const [isScraping, setIsScraping] = useState(false);
  const [competitors$1, setCompetitors] = useState(competitors);
  const [competitorPrices$1, setCompetitorPrices] = useState(competitorPrices);
  const [pricingItems$1, setPricingItems] = useState(pricingItems);
  useEffect(() => {
    apiClient.getCompetitors().then((res) => {
      if (res) {
        if (res.competitors) setCompetitors(res.competitors);
        if (res.competitorPrices) setCompetitorPrices(res.competitorPrices);
        if (res.pricingItems) setPricingItems(res.pricingItems);
      }
    });
  }, []);
  const activeProduct = pricingItems$1.find((p) => p.id === selectedProductId) ?? pricingItems$1[0];
  const basePrice = activeProduct ? activeProduct.currentPrice : 1199;
  const scaleRatio = basePrice / 1199;
  const simulatedChartData = competitorPrices$1.map((d) => ({
    day: d.day,
    us: Math.round(d.us * scaleRatio),
    competitorA: Math.round(d.competitorA * scaleRatio),
    competitorB: Math.round(d.competitorB * scaleRatio),
    competitorC: Math.round(d.competitorC * scaleRatio)
  }));
  const simulatedCompetitors = competitors$1.map((c, i) => {
    let itemPrice = activeProduct ? activeProduct.competitorAvg : 1248;
    if (c.id === "c1" && activeProduct) itemPrice = Math.round(activeProduct.competitorAvg * 1.03);
    if (c.id === "c2" && activeProduct) itemPrice = activeProduct.competitorAvg;
    if (c.id === "c3" && activeProduct) itemPrice = Math.round(activeProduct.competitorAvg * 0.98);
    if (c.id === "c4" && activeProduct) itemPrice = Math.round(activeProduct.competitorAvg * 0.95);
    return {
      ...c,
      itemPrice,
      availability: i % 3 === 0 ? "Out of Stock" : "In Stock"
    };
  });
  const cheapestCompetitor = simulatedCompetitors.reduce((prev, curr) => prev.itemPrice < curr.itemPrice ? prev : curr);
  const highestCompetitor = simulatedCompetitors.reduce((prev, curr) => prev.itemPrice > curr.itemPrice ? prev : curr);
  const triggerScrapeRefresh = () => {
    setIsScraping(true);
    apiClient.triggerCompetitorScrape().then((res) => {
      setIsScraping(false);
      if (res) {
        if (res.competitors) setCompetitors(res.competitors);
        if (res.competitorPrices) setCompetitorPrices(res.competitorPrices);
        if (res.pricingItems) setPricingItems(res.pricingItems);
        toast.success("Scraper task executed on backend. Database updated.");
      } else {
        toast.success("Scraper queries dispatched: 47 endpoints crawled. Data updated.");
      }
    }).catch((err) => {
      setIsScraping(false);
      toast.error("Failed to run crawler on backend.");
    });
  };
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Competitor Intelligence", description: "Live market signals scraped and matched from 47 distributor channels.", actions: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: triggerScrapeRefresh, disabled: isScraping, children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: `size-3.5 mr-1.5 ${isScraping ? "animate-spin" : ""}` }),
        "Scrape Now"
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => setShowOppDialog(true), children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "size-4" }),
        " Analyze Opportunities"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Cheapest Competitor", value: cheapestCompetitor.name, hint: `Price: $${cheapestCompetitor.itemPrice.toLocaleString()} (Avg)`, accent: "success" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Highest Competitor", value: highestCompetitor.name, hint: `Price: $${highestCompetitor.itemPrice.toLocaleString()} (Avg)`, accent: "warning" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Pricing Opportunities", value: "9 SKUs", delta: "+3 new", trend: "up", accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Significant Moves (24h)", value: "14 matches", hint: "Changes exceeding ±3.5%" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6 bg-card border border-border p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxs(Label, { className: "text-sm font-semibold whitespace-nowrap text-foreground flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Radar, { className: "size-4 text-primary" }),
        "Select Monitored SKU:"
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: selectedProductId, onValueChange: setSelectedProductId, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-72 bg-surface-2", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsx(SelectContent, { children: pricingItems$1.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p.id, children: p.product }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex text-xs text-muted-foreground ml-auto items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-success animate-pulse" }),
        "Scraped targets status: healthy (Last sync 2 hours ago)"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6", children: simulatedCompetitors.map((c) => /* @__PURE__ */ jsxs(Card, { className: "p-5 gap-3 flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: c.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
            c.monitored,
            " SKUs tracked"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "font-mono text-xs", children: [
          c.marketShare,
          "% share"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "my-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold font-mono tracking-tight", children: [
          "$",
          c.itemPrice.toLocaleString()
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground ml-1.5", children: [
          "for ",
          activeProduct.product
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border/55 pt-3 mt-1", children: [
        /* @__PURE__ */ jsx(TrendBadge, { t: c.trend }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: c.availability === "In Stock" ? "bg-success/10 text-success border-success/30 text-[10px]" : "bg-destructive/10 text-destructive border-destructive/30 text-[10px]", children: c.availability })
      ] })
    ] }, c.id)) }),
    /* @__PURE__ */ jsx(SectionCard, { title: `Price Movements Comparison — ${activeProduct.product}`, description: "Last 7 days · daily crawler benchmark snapshots", className: "mb-6", children: /* @__PURE__ */ jsx(CompetitorPriceChart, { data: simulatedChartData }) }),
    /* @__PURE__ */ jsx(SectionCard, { title: "Product Comparative Price Matrix", description: `Competitor pricing audit matrix for ${activeProduct.product}`, children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Competitor Name" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Price" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Difference" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Trend Status" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Availability" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: simulatedCompetitors.map((c) => {
        const diff = c.itemPrice - basePrice;
        const diffPct = diff / basePrice * 100;
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: c.name }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono font-semibold", children: [
            "$",
            c.itemPrice.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: `text-right font-mono ${diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"}`, children: [
            diff > 0 ? "+" : "",
            diffPct.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(TrendBadge, { t: c.trend }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: c.availability === "In Stock" ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30", children: c.availability }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => setActiveCompareCompetitor(c), children: "Compare" }) })
        ] }, c.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showOppDialog, onOpenChange: setShowOppDialog, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "size-4 text-primary" }),
          "AI Market Pricing Opportunities"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "The pricing crawler detected SokoPulse prices lagging behind competitor averages. Approved adjustments can boost margins." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "py-2", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "SKU / Product" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "SokoPulse Price" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Competitor Avg" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Potential Margin Gain" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Recommendation" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: pricingItems$1.slice(0, 3).map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("p", { className: "font-semibold text-xs", children: item.product }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono text-xs", children: [
            "$",
            item.currentPrice
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono text-xs", children: [
            "$",
            item.competitorAvg
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right text-success font-mono text-xs font-semibold", children: [
            "+$",
            (item.recommendedPrice - item.currentPrice).toFixed(0),
            " (",
            item.expectedImpact,
            "%)"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-primary/10 text-primary border-primary/20 text-[10px]", children: [
            "Raise to $",
            item.recommendedPrice
          ] }) })
        ] }, item.id)) })
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setShowOppDialog(false), children: "Close" }),
        /* @__PURE__ */ jsx(Button, { onClick: () => {
          setShowOppDialog(false);
          toast.success("Applied pricing recommendations to Dynamic Pricing module.");
        }, children: "Apply All Recommendations" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!activeCompareCompetitor, onOpenChange: (o) => !o && setActiveCompareCompetitor(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[450px]", children: activeCompareCompetitor && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { children: [
          "Competitor Audit: ",
          activeCompareCompetitor.name
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Scraper performance metadata and endpoint target details." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-surface-2 border border-border rounded-md", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground uppercase text-[10px]", children: "Scrape Status" }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold mt-1 text-success flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-success inline-block" }),
              " Active"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-surface-2 border border-border rounded-md", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground uppercase text-[10px]", children: "Scrape Target Frequency" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold mt-1", children: "4 Hours Cadence" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-surface-2 border border-border rounded-md", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground uppercase text-[10px]", children: "Scraped Endpoints" }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold mt-1", children: [
              activeCompareCompetitor.monitored,
              " active pages"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-surface-2 border border-border rounded-md", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground uppercase text-[10px]", children: "Scrape Success Rate" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold mt-1", children: "99.4% (Healthy)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs leading-relaxed text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-semibold text-foreground mb-1 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Info, { className: "size-3.5 text-primary" }),
            "Competitor Strategy Profile"
          ] }),
          activeCompareCompetitor.id === "c1" ? /* @__PURE__ */ jsx("span", { children: "GlobalLogix operates as a premium supplier with longer delivery windows. They lead prices upwards, creating high margin adjustment buffers." }) : activeCompareCompetitor.id === "c4" ? /* @__PURE__ */ jsx("span", { children: "Meridian Imports operates as a discount distributor. They trade margins for volume. We recommend keeping pricing alerts tight here." }) : /* @__PURE__ */ jsx("span", { children: "Nexus Pro maintains a matching index with SokoPulse. They actively scrap SokoPulse catalog and maintain exact parity within ±2.5%." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { onClick: () => setActiveCompareCompetitor(null), children: "Close Audit" }) })
    ] }) }) })
  ] }) });
}
function TrendBadge({
  t
}) {
  const Icon = t === "up" ? ArrowUp : t === "down" ? ArrowDown : Minus;
  const cls = t === "up" ? "text-destructive bg-destructive/10" : t === "down" ? "text-success bg-success/10" : "text-muted-foreground bg-muted";
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono ${cls}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "size-3" }),
    t === "up" ? "Rising" : t === "down" ? "Falling" : "Stable"
  ] });
}
export {
  CompetitorsPage as component
};
