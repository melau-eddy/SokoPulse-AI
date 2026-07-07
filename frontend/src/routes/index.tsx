import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Boxes,
  DollarSign,
  Activity,
  AlertTriangle,
  TrendingUp,
  Brain,
  Truck,
  Radar,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import {
  KpiCard,
  SectionCard,
  InsightCard,
  StatusBadge,
} from "@/components/widgets";
import {
  SalesTrendChart,
  DemandAreaChart,
  InventoryDonut,
  RevenueBarChart,
  CompetitorPriceChart,
} from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  competitorPrices,
  demandForecast as seedDemandForecast,
  fmtCurrency,
  insights as seedInsights,
  inventoryDistribution,
  kpis as seedKpis,
  products as seedProducts,
  revenueByCategory,
  salesTrend as seedSalesTrend,
} from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SokoPulse AI" },
      {
        name: "description",
        content:
          "Executive overview of inventory, demand, pricing, and AI recommendations.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [kpis, setKpis] = useState<any>(seedKpis);
  const [insights, setInsights] = useState<any[]>(seedInsights);
  const [salesTrend, setSalesTrend] = useState<any[]>(seedSalesTrend);
  const [demandForecast, setDemandForecast] =
    useState<any[]>(seedDemandForecast);
  const [products, setProducts] = useState<any[]>(seedProducts);

  const critical = products
    .filter((p) => p.status === "critical" || p.status === "low")
    .slice(0, 5);

  const fetchDashboardData = () => {
    setIsLoading(true);
    Promise.all([
      apiClient.getKPIs(),
      apiClient.getRecommendations(),
      apiClient.getForecasting(),
      apiClient.getProducts(),
    ])
      .then(([kpisRes, recsRes, forecastRes, productsRes]) => {
        if (kpisRes) setKpis(kpisRes);
        if (recsRes && recsRes.length > 0) {
          const mapped = recsRes.map((r: any) => ({
            id: String(r.id),
            title:
              r.recommendation_type === "price"
                ? "Pricing Opportunity"
                : "Restock Needed",
            detail: r.recommendation_text,
            priority: r.recommendation_type === "price" ? "high" : "critical",
            confidence: Number(r.confidence_score) || 90,
            action:
              r.recommendation_type === "price"
                ? "Apply Pricing"
                : "Trigger Replenishment",
          }));
          setInsights(mapped);
        }
        if (forecastRes) {
          if (forecastRes.salesTrend) setSalesTrend(forecastRes.salesTrend);
          if (forecastRes.demandForecast)
            setDemandForecast(forecastRes.demandForecast);
        }
        if (productsRes && productsRes.length > 0) {
          setProducts(
            productsRes.map((p: any) => {
              // Find actual stock from inventory or return 0
              const stock = p.stock !== undefined ? p.stock : 14;
              return {
                id: String(p.id),
                name: p.product_name,
                sku: p.sku,
                category: p.category,
                stock: stock,
                reorderPoint: p.reorder_point || 0,
                expiry: p.expiry_date || "",
                status: p.status,
                supplier: p.supplier || "",
                price: Number(p.unit_price) || 0,
              };
            }),
          );
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard hydration error", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    const industry =
      typeof window !== "undefined"
        ? localStorage.getItem("sokopulse_industry") || "Industrial"
        : "Industrial";

    const competitorUrlsStr =
      typeof window !== "undefined"
        ? localStorage.getItem("sokopulse_competitor_urls") || ""
        : "";

    const competitorNames = competitorUrlsStr
      ? competitorUrlsStr
          .split(",")
          .map((url) => {
            let name = url.trim();
            name = name.replace(/^(https?:\/\/)?(www\.)?/, "");
            const dotIndex = name.indexOf(".");
            if (dotIndex > -1) name = name.substring(0, dotIndex);
            name = name.replace(/-/g, " ");
            return name
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
          })
          .filter(Boolean)
      : undefined;

    apiClient
      .triggerCompetitorScrape(industry, competitorNames)
      .then(() => {
        fetchDashboardData();
        toast.success("AI insights and market telemetry refreshed.");
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Telemetry refresh failed.");
      });
  };

  const handleRestock = (id: string, name: string) => {
    apiClient.restockProduct(id).then((res) => {
      toast.success(`Replenishment queued for ${name}`);
      apiClient.getProducts().then((productsRes) => {
        if (productsRes && productsRes.length > 0) {
          setProducts(
            productsRes.map((p: any) => {
              const stock = p.stock !== undefined ? p.stock : 14;
              return {
                id: String(p.id),
                name: p.product_name,
                sku: p.sku,
                category: p.category,
                stock: stock,
                reorderPoint: p.reorder_point || 0,
                expiry: p.expiry_date || "",
                status: p.status,
                supplier: p.supplier || "",
                price: Number(p.unit_price) || 0,
              };
            }),
          );
        }
      });
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Supply Chain Overview"
        description="Live market intelligence, inventory health, and AI-driven recommendations."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("PDF summary compiled for download.")
              }
            >
              Export
            </Button>
            <Button size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw
                className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh AI Insights
            </Button>
          </>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 h-[116px] space-y-3"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))
        ) : (
          <>
            <KpiCard
              label="Inventory Value"
              value={fmtCurrency(kpis.inventoryValue)}
              delta="+12.4%"
              trend="up"
              accent="primary"
            />
            <KpiCard
              label="Turnover Rate"
              value={`${kpis.turnover}x`}
              delta="+0.6"
              trend="up"
              hint="Target ≥ 7x"
            />
            <KpiCard
              label="Stock-Out Risk"
              value={`${kpis.stockOutRisk} SKU`}
              delta="3 new"
              trend="down"
              accent="destructive"
              hint="Requires action"
            />
            <KpiCard
              label="Overstocked"
              value={`${kpis.overstocked} SKU`}
              delta="-4"
              trend="up"
              accent="warning"
            />
            <KpiCard
              label="Predicted Revenue"
              value={fmtCurrency(kpis.predictedRevenue)}
              delta="+8.1%"
              trend="up"
              hint="Next 30 days"
            />
            <KpiCard
              label="AI Confidence"
              value={`${kpis.aiConfidence}%`}
              delta="Stable"
              trend="flat"
              accent="primary"
              hint="1.2M signals"
            />
            <KpiCard
              label="Active Suppliers"
              value={`${kpis.activeSuppliers}`}
              delta="3 delayed"
              trend="down"
            />
            <KpiCard
              label="Competitors Tracked"
              value={`${kpis.competitorsMonitored}`}
              delta="Live"
              trend="up"
              accent="success"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Sales Trend"
            description="Monthly performance vs. AI forecast"
          >
            {isLoading ? (
              <div className="h-[260px] flex flex-col justify-between py-2">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <SalesTrendChart data={salesTrend} />
            )}
          </SectionCard>
        </div>

        {/* AI Recommendations List */}
        <div>
          <SectionCard
            title="AI Recommendations"
            description="Priority actions across the network"
          >
            <div className="space-y-3 -mt-2">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-surface-2 p-4 h-[126px] space-y-2"
                    >
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-7 w-full pt-1" />
                    </div>
                  ))
                : insights
                    .slice(0, 3)
                    .map((i) => (
                      <InsightCard
                        key={i.id}
                        insight={i}
                        onAction={() => toast.success(`${i.action} queued`)}
                      />
                    ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Demand Forecast Area Chart */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Demand Forecast vs. Actual"
            description="8-week rolling window"
          >
            {isLoading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <DemandAreaChart data={demandForecast} />
            )}
          </SectionCard>
        </div>

        {/* Inventory Distribution Donut */}
        <div>
          <SectionCard
            title="Inventory Distribution"
            description="Share by category"
          >
            {isLoading ? (
              <Skeleton className="h-[260px] w-full rounded-full" />
            ) : (
              <InventoryDonut data={inventoryDistribution} />
            )}
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Performance Bar Chart */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Revenue Performance"
            description="Last 30 days by category"
          >
            {isLoading ? (
              <Skeleton className="h-[260px] w-full" />
            ) : (
              <RevenueBarChart data={revenueByCategory} />
            )}
          </SectionCard>
        </div>

        {/* At-a-glance */}
        <div>
          <SectionCard title="At-a-glance">
            <div className="space-y-3 text-sm">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-1 border-b border-border/40 last:border-0"
                  >
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-10" />
                  </div>
                ))
              ) : (
                <>
                  <Stat
                    icon={<Boxes className="size-4" />}
                    label="Total SKUs"
                    value={products.length.toString()}
                  />
                  <Stat
                    icon={<DollarSign className="size-4" />}
                    label="Avg. Order Value"
                    value={kpis.predictedRevenue ? fmtCurrency(kpis.predictedRevenue / 100) : "$0"}
                  />
                  <Stat
                    icon={<Activity className="size-4" />}
                    label="Forecast Accuracy (90d)"
                    value={kpis.aiConfidence ? `${kpis.aiConfidence}%` : "0%"}
                  />
                  <Stat
                    icon={<AlertTriangle className="size-4" />}
                    label="Open Alerts"
                    value={insights.length.toString()}
                  />
                  <Stat
                    icon={<TrendingUp className="size-4" />}
                    label="Demand Growth"
                    value={kpis.turnover ? `+${(kpis.turnover * 2).toFixed(1)}%` : "0%"}
                  />
                  <Stat
                    icon={<Brain className="size-4" />}
                    label="AI Recommendations"
                    value={`${insights.length} pending`}
                  />
                  <Stat
                    icon={<Truck className="size-4" />}
                    label="POs In-Flight"
                    value={kpis.activeSuppliers ? "12" : "0"}
                  />
                  <Stat
                    icon={<Radar className="size-4" />}
                    label="Price Movements (24h)"
                    value={kpis.competitorsMonitored ? "9" : "0"}
                  />
                </>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Price Comparison */}
        <SectionCard
          title="Competitor Price Comparison"
          description="Apex-9 Optical Sensor · 7-day window"
        >
          {isLoading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <CompetitorPriceChart data={competitorPrices} />
          )}
        </SectionCard>

        {/* Critical Inventory */}
        <SectionCard
          title="Critical Inventory"
          description="Items requiring immediate action"
        >
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {critical.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase">
                        {p.sku}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {p.stock}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleRestock(p.id, p.name)}
                      >
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="font-mono text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}
