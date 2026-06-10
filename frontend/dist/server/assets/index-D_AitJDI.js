import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { RefreshCw, Boxes, DollarSign, Activity, AlertTriangle, TrendingUp, Brain, Truck, Radar } from "lucide-react";
import { h as cn, P as PageHeader, b as Button, a as apiClient } from "./router-DTaeCIgy.js";
import { K as KpiCard, S as SectionCard, I as InsightCard, b as StatusBadge } from "./widgets-CxcUKQRj.js";
import { S as SalesTrendChart, D as DemandAreaChart, I as InventoryDonut, R as RevenueBarChart, C as CompetitorPriceChart } from "./charts-CgHWaLLA.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-zU7fJY9A.js";
import { k as kpis, j as insights, e as salesTrend, d as demandForecast, c as products, a as fmtCurrency, l as inventoryDistribution, r as revenueByCategory, h as competitorPrices } from "./mock-data-Nl4nWPc2.js";
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
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-primary/10", className),
      ...props
    }
  );
}
function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [kpis$1, setKpis] = useState(kpis);
  const [insights$1, setInsights] = useState(insights);
  const [salesTrend$1, setSalesTrend] = useState(salesTrend);
  const [demandForecast$1, setDemandForecast] = useState(demandForecast);
  const [products$1, setProducts] = useState(products);
  const critical = products$1.filter((p) => p.status === "critical" || p.status === "low").slice(0, 5);
  const fetchDashboardData = () => {
    setIsLoading(true);
    Promise.all([apiClient.getKPIs(), apiClient.getRecommendations(), apiClient.getForecasting(), apiClient.getProducts()]).then(([kpisRes, recsRes, forecastRes, productsRes]) => {
      if (kpisRes) setKpis(kpisRes);
      if (recsRes && recsRes.length > 0) {
        const mapped = recsRes.map((r) => ({
          id: String(r.id),
          title: r.recommendation_type === "price" ? "Pricing Opportunity" : "Restock Needed",
          detail: r.recommendation_text,
          priority: r.recommendation_type === "price" ? "high" : "critical",
          confidence: Number(r.confidence_score) || 90,
          action: r.recommendation_type === "price" ? "Apply Pricing" : "Trigger Replenishment"
        }));
        setInsights(mapped);
      }
      if (forecastRes) {
        if (forecastRes.salesTrend) setSalesTrend(forecastRes.salesTrend);
        if (forecastRes.demandForecast) setDemandForecast(forecastRes.demandForecast);
      }
      if (productsRes && productsRes.length > 0) {
        setProducts(productsRes.map((p) => {
          const stock = p.stock !== void 0 ? p.stock : 14;
          return {
            id: String(p.id),
            name: p.product_name,
            sku: p.sku,
            category: p.category,
            stock,
            reorderPoint: p.reorder_point || 0,
            expiry: p.expiry_date || "",
            status: p.status,
            supplier: p.supplier || "",
            price: Number(p.unit_price) || 0
          };
        }));
      }
      setIsLoading(false);
    }).catch((err) => {
      console.error("Dashboard hydration error", err);
      setIsLoading(false);
    });
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const handleRefresh = () => {
    setIsLoading(true);
    const industry = typeof window !== "undefined" ? localStorage.getItem("sokopulse_industry") || "Industrial" : "Industrial";
    const competitorUrlsStr = typeof window !== "undefined" ? localStorage.getItem("sokopulse_competitor_urls") || "" : "";
    const competitorNames = competitorUrlsStr ? competitorUrlsStr.split(",").map((url) => {
      let name = url.trim();
      name = name.replace(/^(https?:\/\/)?(www\.)?/, "");
      const dotIndex = name.indexOf(".");
      if (dotIndex > -1) name = name.substring(0, dotIndex);
      name = name.replace(/-/g, " ");
      return name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }).filter(Boolean) : void 0;
    apiClient.triggerCompetitorScrape(industry, competitorNames).then(() => {
      fetchDashboardData();
      toast.success("AI insights and market telemetry refreshed.");
    }).catch(() => {
      setIsLoading(false);
      toast.error("Telemetry refresh failed.");
    });
  };
  const handleRestock = (id, name) => {
    apiClient.restockProduct(id).then((res) => {
      toast.success(`Replenishment queued for ${name}`);
      apiClient.getProducts().then((productsRes) => {
        if (productsRes && productsRes.length > 0) {
          setProducts(productsRes.map((p) => {
            const stock = p.stock !== void 0 ? p.stock : 14;
            return {
              id: String(p.id),
              name: p.product_name,
              sku: p.sku,
              category: p.category,
              stock,
              reorderPoint: p.reorder_point || 0,
              expiry: p.expiry_date || "",
              status: p.status,
              supplier: p.supplier || "",
              price: Number(p.unit_price) || 0
            };
          }));
        }
      });
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Supply Chain Overview", description: "Live market intelligence, inventory health, and AI-driven recommendations.", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => toast.success("PDF summary compiled for download."), children: "Export" }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleRefresh, disabled: isLoading, children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: `size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}` }),
        "Refresh AI Insights"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: isLoading ? Array.from({
      length: 8
    }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 h-[116px] space-y-3", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-24" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-7 w-20" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-16" })
    ] }, i)) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Inventory Value", value: fmtCurrency(kpis$1.inventoryValue), delta: "+12.4%", trend: "up", accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Turnover Rate", value: `${kpis$1.turnover}x`, delta: "+0.6", trend: "up", hint: "Target ≥ 7x" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Stock-Out Risk", value: `${kpis$1.stockOutRisk} SKU`, delta: "3 new", trend: "down", accent: "destructive", hint: "Requires action" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Overstocked", value: `${kpis$1.overstocked} SKU`, delta: "-4", trend: "up", accent: "warning" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Predicted Revenue", value: fmtCurrency(kpis$1.predictedRevenue), delta: "+8.1%", trend: "up", hint: "Next 30 days" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "AI Confidence", value: `${kpis$1.aiConfidence}%`, delta: "Stable", trend: "flat", accent: "primary", hint: "1.2M signals" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Active Suppliers", value: `${kpis$1.activeSuppliers}`, delta: "3 delayed", trend: "down" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Competitors Tracked", value: `${kpis$1.competitorsMonitored}`, delta: "Live", trend: "up", accent: "success" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(SectionCard, { title: "Sales Trend", description: "Monthly performance vs. AI forecast", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "h-[260px] flex flex-col justify-between py-2", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-full w-full" }) }) : /* @__PURE__ */ jsx(SalesTrendChart, { data: salesTrend$1 }) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SectionCard, { title: "AI Recommendations", description: "Priority actions across the network", children: /* @__PURE__ */ jsx("div", { className: "space-y-3 -mt-2", children: isLoading ? Array.from({
        length: 3
      }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-surface-2 p-4 h-[126px] space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-16" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-44" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-7 w-full pt-1" })
      ] }, i)) : insights$1.slice(0, 3).map((i) => /* @__PURE__ */ jsx(InsightCard, { insight: i, onAction: () => toast.success(`${i.action} queued`) }, i.id)) }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(SectionCard, { title: "Demand Forecast vs. Actual", description: "8-week rolling window", children: isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-[280px] w-full" }) : /* @__PURE__ */ jsx(DemandAreaChart, { data: demandForecast$1 }) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SectionCard, { title: "Inventory Distribution", description: "Share by category", children: isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-[260px] w-full rounded-full" }) : /* @__PURE__ */ jsx(InventoryDonut, { data: inventoryDistribution }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(SectionCard, { title: "Revenue Performance", description: "Last 30 days by category", children: isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-[260px] w-full" }) : /* @__PURE__ */ jsx(RevenueBarChart, { data: revenueByCategory }) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SectionCard, { title: "At-a-glance", children: /* @__PURE__ */ jsx("div", { className: "space-y-3 text-sm", children: isLoading ? Array.from({
        length: 8
      }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-1 border-b border-border/40 last:border-0", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-10" })
      ] }, i)) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Boxes, { className: "size-4" }), label: "Total SKUs", value: "1,240" }),
        /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(DollarSign, { className: "size-4" }), label: "Avg. Order Value", value: "$284" }),
        /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Activity, { className: "size-4" }), label: "Forecast Accuracy (90d)", value: "94.2%" }),
        /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "size-4" }), label: "Open Alerts", value: "11" }),
        /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(TrendingUp, { className: "size-4" }), label: "Demand Growth", value: "+18%" }),
        /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Brain, { className: "size-4" }), label: "AI Recommendations", value: "24 pending" }),
        /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Truck, { className: "size-4" }), label: "POs In-Flight", value: "38" }),
        /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Radar, { className: "size-4" }), label: "Price Movements (24h)", value: "9" })
      ] }) }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(SectionCard, { title: "Competitor Price Comparison", description: "Apex-9 Optical Sensor · 7-day window", children: isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-[280px] w-full" }) : /* @__PURE__ */ jsx(CompetitorPriceChart, { data: competitorPrices }) }),
      /* @__PURE__ */ jsx(SectionCard, { title: "Critical Inventory", description: "Items requiring immediate action", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" })
      ] }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Product" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Stock" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: critical.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxs(TableCell, { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: p.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-muted-foreground uppercase", children: p.sku })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: p.status }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: p.stock }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "link", size: "sm", onClick: () => handleRestock(p.id, p.name), children: "Restock" }) })
        ] }, p.id)) })
      ] }) })
    ] })
  ] });
}
function Stat({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1.5 border-b border-border last:border-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
      icon,
      /* @__PURE__ */ jsx("span", { className: "text-xs", children: label })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-medium text-foreground", children: value })
  ] });
}
export {
  DashboardPage as component
};
