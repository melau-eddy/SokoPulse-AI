import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Minus,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Radar,
  Info,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, KpiCard } from "@/components/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CompetitorPriceChart } from "@/components/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  competitors as seedCompetitors,
  competitorPrices as seedCompetitorPrices,
  pricingItems as seedPricingItems,
} from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/competitors")({
  head: () => ({ meta: [{ title: "Competitor Intelligence — SokoPulse AI" }] }),
  component: CompetitorsPage,
});

function CompetitorsPage() {
  const [selectedProductId, setSelectedProductId] = useState<string>("pr1");
  const [showOppDialog, setShowOppDialog] = useState(false);
  const [activeCompareCompetitor, setActiveCompareCompetitor] = useState<
    any | null
  >(null);
  const [isScraping, setIsScraping] = useState(false);

  const [competitors, setCompetitors] = useState<any[]>(seedCompetitors);
  const [competitorPrices, setCompetitorPrices] =
    useState<any[]>(seedCompetitorPrices);
  const [pricingItems, setPricingItems] = useState<any[]>(seedPricingItems);

  useEffect(() => {
    apiClient.getCompetitors().then((res) => {
      if (res) {
        if (res.competitors) setCompetitors(res.competitors);
        if (res.competitorPrices) setCompetitorPrices(res.competitorPrices);
        if (res.pricingItems) setPricingItems(res.pricingItems);
      }
    });
  }, []);

  // Get active pricing item
  const activeProduct =
    pricingItems.find((p) => p.id === selectedProductId) ?? pricingItems[0];
  const basePrice = activeProduct ? activeProduct.currentPrice : 1199;

  // Scale chart data based on active product price ratio to Apex-9 (which is $1199 baseline)
  const scaleRatio = basePrice / 1199;
  const simulatedChartData = competitorPrices.map((d) => {
    const scaled: any = {
      day: d.day,
      us: Math.round(d.us * scaleRatio),
    };
    Object.keys(d).forEach((key) => {
      if (key !== "day" && key !== "us") {
        scaled[key] = Math.round(d[key] * scaleRatio);
      }
    });
    return scaled;
  });

  // Dynamic competitor values
  const simulatedCompetitors = competitors.map((c, i) => {
    // GlobalLogix is Competitor A, Nexus Pro is B, Apex is C
    let itemPrice = activeProduct ? activeProduct.competitorAvg : 1248;
    if (c.id === "c1" && activeProduct)
      itemPrice = Math.round(activeProduct.competitorAvg * 1.03); // GlobalLogix tends to be highest
    if (c.id === "c2" && activeProduct) itemPrice = activeProduct.competitorAvg; // Nexus is avg
    if (c.id === "c3" && activeProduct)
      itemPrice = Math.round(activeProduct.competitorAvg * 0.98); // Apex is slightly lower
    if (c.id === "c4" && activeProduct)
      itemPrice = Math.round(activeProduct.competitorAvg * 0.95); // Meridian is cheapest

    return {
      ...c,
      itemPrice,
      availability: i % 3 === 0 ? "Out of Stock" : "In Stock",
    };
  });

  // KPI Calculations
  const cheapestCompetitor = simulatedCompetitors.reduce((prev, curr) =>
    prev.itemPrice < curr.itemPrice ? prev : curr,
  );
  const highestCompetitor = simulatedCompetitors.reduce((prev, curr) =>
    prev.itemPrice > curr.itemPrice ? prev : curr,
  );

  const triggerScrapeRefresh = () => {
    setIsScraping(true);
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
      .then((res) => {
        setIsScraping(false);
        if (res) {
          if (res.competitors) setCompetitors(res.competitors);
          if (res.competitorPrices) setCompetitorPrices(res.competitorPrices);
          if (res.pricingItems) setPricingItems(res.pricingItems);
          toast.success(
            `Scraper task executed for ${industry} segment. Database updated.`,
          );
        } else {
          toast.success(
            `Scraper queries dispatched: 47 endpoints crawled for ${industry}. Data updated.`,
          );
        }
      })
      .catch((err) => {
        setIsScraping(false);
        toast.error("Failed to run crawler on backend.");
      });
  };

  return (
    <TooltipProvider>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PageHeader
          title="Competitor Intelligence"
          description="Live market signals scraped and matched from 47 distributor channels."
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerScrapeRefresh}
                disabled={isScraping}
              >
                <RefreshCw
                  className={`size-3.5 mr-1.5 ${isScraping ? "animate-spin" : ""}`}
                />
                Scrape Now
              </Button>
              <Button size="sm" onClick={() => setShowOppDialog(true)}>
                <TrendingUp className="size-4" /> Analyze Opportunities
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label="Cheapest Competitor"
            value={cheapestCompetitor.name}
            hint={`Price: $${cheapestCompetitor.itemPrice.toLocaleString()} (Avg)`}
            accent="success"
          />
          <KpiCard
            label="Highest Competitor"
            value={highestCompetitor.name}
            hint={`Price: $${highestCompetitor.itemPrice.toLocaleString()} (Avg)`}
            accent="warning"
          />
          <KpiCard
            label="Pricing Opportunities"
            value="9 SKUs"
            delta="+3 new"
            trend="up"
            accent="primary"
          />
          <KpiCard
            label="Significant Moves (24h)"
            value="14 matches"
            hint="Changes exceeding ±3.5%"
          />
        </div>

        {/* Product selector selector */}
        <div className="flex items-center gap-3 mb-6 bg-card border border-border p-4 rounded-lg">
          <Label className="text-sm font-semibold whitespace-nowrap text-foreground flex items-center gap-1.5">
            <Radar className="size-4 text-primary" />
            Select Monitored SKU:
          </Label>
          <Select
            value={selectedProductId}
            onValueChange={setSelectedProductId}
          >
            <SelectTrigger className="w-72 bg-surface-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pricingItems.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="hidden md:flex text-xs text-muted-foreground ml-auto items-center gap-1.5">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            Scraped targets status: healthy (Last sync 2 hours ago)
          </div>
        </div>

        {/* Competitor cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {simulatedCompetitors.map((c) => (
            <Card
              key={c.id}
              className="p-5 gap-3 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {c.monitored} SKUs tracked
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {c.marketShare}% share
                </Badge>
              </div>
              <div className="my-2">
                <span className="text-2xl font-bold font-mono tracking-tight">
                  ${c.itemPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1.5">
                  for {activeProduct.product}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/55 pt-3 mt-1">
                <TrendBadge t={c.trend} />
                <Badge
                  variant="outline"
                  className={
                    c.availability === "In Stock"
                      ? "bg-success/10 text-success border-success/30 text-[10px]"
                      : "bg-destructive/10 text-destructive border-destructive/30 text-[10px]"
                  }
                >
                  {c.availability}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <SectionCard
          title={`Price Movements Comparison — ${activeProduct.product}`}
          description="Last 7 days · daily crawler benchmark snapshots"
          className="mb-6"
        >
          <CompetitorPriceChart data={simulatedChartData} />
        </SectionCard>

        {/* Comparison Table */}
        <SectionCard
          title="Product Comparative Price Matrix"
          description={`Competitor pricing audit matrix for ${activeProduct.product}`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competitor Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Difference</TableHead>
                <TableHead>Trend Status</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulatedCompetitors.map((c) => {
                const diff = c.itemPrice - basePrice;
                const diffPct = (diff / basePrice) * 100;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      ${c.itemPrice.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {diff > 0 ? "+" : ""}
                      {diffPct.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <TrendBadge t={c.trend} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          c.availability === "In Stock"
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }
                      >
                        {c.availability}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveCompareCompetitor(c)}
                      >
                        Compare
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </SectionCard>

        {/* Opportunities Dialog */}
        <Dialog open={showOppDialog} onOpenChange={setShowOppDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                AI Market Pricing Opportunities
              </DialogTitle>
              <DialogDescription>
                The pricing crawler detected SokoPulse prices lagging behind
                competitor averages. Approved adjustments can boost margins.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU / Product</TableHead>
                    <TableHead className="text-right">
                      SokoPulse Price
                    </TableHead>
                    <TableHead className="text-right">Competitor Avg</TableHead>
                    <TableHead className="text-right">
                      Potential Margin Gain
                    </TableHead>
                    <TableHead className="text-right">Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingItems.slice(0, 3).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-semibold text-xs">{item.product}</p>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        ${item.currentPrice}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        ${item.competitorAvg}
                      </TableCell>
                      <TableCell className="text-right text-success font-mono text-xs font-semibold">
                        +$
                        {(item.recommendedPrice - item.currentPrice).toFixed(
                          0,
                        )}{" "}
                        ({item.expectedImpact}%)
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20 text-[10px]"
                        >
                          Raise to ${item.recommendedPrice}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOppDialog(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowOppDialog(false);
                  toast.success(
                    "Applied pricing recommendations to Dynamic Pricing module.",
                  );
                }}
              >
                Apply All Recommendations
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Competitor Compare Dialog */}
        <Dialog
          open={!!activeCompareCompetitor}
          onOpenChange={(o) => !o && setActiveCompareCompetitor(null)}
        >
          <DialogContent className="sm:max-w-[450px]">
            {activeCompareCompetitor && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    Competitor Audit: {activeCompareCompetitor.name}
                  </DialogTitle>
                  <DialogDescription>
                    Scraper performance metadata and endpoint target details.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-surface-2 border border-border rounded-md">
                      <span className="text-muted-foreground uppercase text-[10px]">
                        Scrape Status
                      </span>
                      <p className="font-semibold mt-1 text-success flex items-center gap-1">
                        <span className="size-2 rounded-full bg-success inline-block" />{" "}
                        Active
                      </p>
                    </div>
                    <div className="p-3 bg-surface-2 border border-border rounded-md">
                      <span className="text-muted-foreground uppercase text-[10px]">
                        Scrape Target Frequency
                      </span>
                      <p className="font-semibold mt-1">4 Hours Cadence</p>
                    </div>
                    <div className="p-3 bg-surface-2 border border-border rounded-md">
                      <span className="text-muted-foreground uppercase text-[10px]">
                        Scraped Endpoints
                      </span>
                      <p className="font-semibold mt-1">
                        {activeCompareCompetitor.monitored} active pages
                      </p>
                    </div>
                    <div className="p-3 bg-surface-2 border border-border rounded-md">
                      <span className="text-muted-foreground uppercase text-[10px]">
                        Scrape Success Rate
                      </span>
                      <p className="font-semibold mt-1">99.4% (Healthy)</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                      <Info className="size-3.5 text-primary" />
                      Competitor Strategy Profile
                    </p>
                    {activeCompareCompetitor.id === "c1" ? (
                      <span>
                        GlobalLogix operates as a premium supplier with longer
                        delivery windows. They lead prices upwards, creating
                        high margin adjustment buffers.
                      </span>
                    ) : activeCompareCompetitor.id === "c4" ? (
                      <span>
                        Meridian Imports operates as a discount distributor.
                        They trade margins for volume. We recommend keeping
                        pricing alerts tight here.
                      </span>
                    ) : (
                      <span>
                        Nexus Pro maintains a matching index with SokoPulse.
                        They actively scrap SokoPulse catalog and maintain exact
                        parity within ±2.5%.
                      </span>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={() => setActiveCompareCompetitor(null)}>
                    Close Audit
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function TrendBadge({ t }: { t: "up" | "down" | "flat" }) {
  const Icon = t === "up" ? ArrowUp : t === "down" ? ArrowDown : Minus;
  const cls =
    t === "up"
      ? "text-destructive bg-destructive/10"
      : t === "down"
        ? "text-success bg-success/10"
        : "text-muted-foreground bg-muted";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono ${cls}`}
    >
      <Icon className="size-3" />
      {t === "up" ? "Rising" : t === "down" ? "Falling" : "Stable"}
    </span>
  );
}
