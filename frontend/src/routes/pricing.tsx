import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, X, Pencil, Sparkles, TrendingUp, Info, Activity, Globe, Calendar, Truck, DollarSign, Percent, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, KpiCard } from "@/components/widgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { pricingItems as seedItems, type PricingItem, formatPrice, fmtCurrency } from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Dynamic Pricing — SokoPulse AI" }] }),
  component: PricingPage,
});

type ItemStatus = "pending" | "approved" | "rejected" | "overridden";

interface StatefulPricingItem extends PricingItem {
  status: ItemStatus;
  overridePrice?: number;
  overrideMargin?: number;
  overrideImpact?: number;
}

function PricingPage() {
  const [items, setItems] = useState<StatefulPricingItem[]>(() =>
    seedItems.map((item) => ({ ...item, status: "pending" as const })),
  );
  const [activeTab, setActiveTab] = useState<ItemStatus | "all">("pending");
  const [overrideItem, setOverrideItem] = useState<StatefulPricingItem | null>(
    null,
  );
  const [customPriceInput, setCustomPriceInput] = useState("");
  const [simulationMultiplier, setSimulationMultiplier] = useState<number[]>([
    100,
  ]); // percentage of recommended adjustment (50% to 150%)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeCurrency, setActiveCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_currency") || "USD";
    }
    return "USD";
  });

  // Load pricing recommendations from backend
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

  // Filter items
  const filteredItems = items.filter(
    (item) => activeTab === "all" || item.status === activeTab,
  );

  // Statistics
  const pendingCount = items.filter((i) => i.status === "pending").length;
  const approvedCount = items.filter(
    (i) => i.status === "approved" || i.status === "overridden",
  ).length;

  // Calculate average margin of approved & pending
  const activeItemsForMargin = items.filter(
    (i) =>
      i.status === "approved" ||
      i.status === "pending" ||
      i.status === "overridden",
  );
  const avgMargin =
    activeItemsForMargin.length > 0
      ? activeItemsForMargin.reduce(
          (sum, item) => sum + (item.overrideMargin ?? item.margin),
          0,
        ) / activeItemsForMargin.length
      : 0;

  // Elasticity Simulation calculations
  const multiplierVal = simulationMultiplier[0] / 100; // e.g. 1.0
  const baseRevenueLift = items.length > 0 ? 184000 : 0;
  const simulatedRevenueLift =
    baseRevenueLift * multiplierVal * (1 - (multiplierVal - 1) * 0.4); // simulates price elasticity decay

  const handleAccept = (id: string) => {
    apiClient.updateRecommendationStatus(id, "approved").then((res) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "approved" as const } : item,
        ),
      );
      const item = items.find((i) => i.id === id);
      toast.success(`Pricing recommendation approved for ${item?.product}`);
    });
  };

  const handleReject = (id: string) => {
    apiClient.updateRecommendationStatus(id, "rejected").then((res) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "rejected" as const } : item,
        ),
      );
      const item = items.find((i) => i.id === id);
      toast.success(`Pricing recommendation rejected for ${item?.product}`);
    });
  };

  const openOverrideDialog = (item: StatefulPricingItem) => {
    setOverrideItem(item);
    const rate = activeCurrency === "KES" ? 130.0 : 1.0;
    setCustomPriceInput(
      ((item.overridePrice ?? item.recommendedPrice) * rate).toFixed(2),
    );
  };

  const saveOverride = () => {
    if (!overrideItem) return;
    const inputPrice = parseFloat(customPriceInput);
    if (isNaN(inputPrice) || inputPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const rate = activeCurrency === "KES" ? 130.0 : 1.0;
    // Convert back to USD base price to store in DB
    const newPriceUSD = inputPrice / rate;

    // Estimate cost based on current price and base margin
    const estimatedCostUSD =
      overrideItem.currentPrice * (1 - overrideItem.margin / 100);
    const newMargin = Math.round(((newPriceUSD - estimatedCostUSD) / newPriceUSD) * 100);

    // Relative impact estimate
    const priceChangePct =
      (newPriceUSD - overrideItem.currentPrice) / overrideItem.currentPrice;
    const estimatedImpact = Math.round(priceChangePct * 10 * 10) / 10; // Simple linear pricing impact model

    apiClient
      .updateRecommendationStatus(overrideItem.id, "overridden", {
        override_price: newPriceUSD,
        override_margin: newMargin,
        override_impact: estimatedImpact,
      })
      .then((res) => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === overrideItem.id
              ? {
                  ...item,
                  status: "overridden" as const,
                  overridePrice: newPriceUSD,
                  overrideMargin: newMargin,
                  overrideImpact: estimatedImpact,
                }
              : item,
          ),
        );

        const displayFormattedPrice = activeCurrency === "KES" ? `KES ${(newPriceUSD * 130.0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `$${newPriceUSD.toFixed(2)}`;
        toast.success(
          `Applied custom override of ${displayFormattedPrice} for ${overrideItem.product}`,
        );
        setOverrideItem(null);
      });
  };

  const resetAll = () => {
    setItems(seedItems.map((item) => ({ ...item, status: "pending" })));
    setSimulationMultiplier([100]);
    toast.success("Pricing recommendations reset to defaults.");
  };

  return (
    <TooltipProvider>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PageHeader
          title="Dynamic Pricing"
          description="AI-recommended price adjustments based on demand elasticity, margins, and competitor signals."
          actions={
            <Button variant="outline" size="sm" onClick={resetAll}>
              Reset Workspace
            </Button>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label="Recommendations Pending"
            value={`${pendingCount}`}
            accent={pendingCount > 0 ? "primary" : undefined}
          />
          <KpiCard
            label="Avg. Target Margin"
            value={`${avgMargin.toFixed(1)}%`}
            delta={items.length > 0 ? "+1.2%" : undefined}
            trend={items.length > 0 ? "up" : undefined}
            accent={items.length > 0 ? "success" : undefined}
          />
          <KpiCard
            label="Simulated Revenue Lift"
            value={fmtCurrency(simulatedRevenueLift)}
            hint="Next 30 days projection"
            accent="primary"
          />
          <KpiCard
            label="Approval Rate (30d)"
            value={items.length > 0 ? "78%" : "0%"}
            hint={items.length > 0 ? "42 of 54 accepted" : "No recent data"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2">
            <SectionCard>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as never)}
                >
                  <TabsList>
                    <TabsTrigger value="pending">
                      Pending ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                      Approved ({approvedCount})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected (
                      {items.filter((i) => i.status === "rejected").length})
                    </TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="text-xs text-muted-foreground">
                  Showing {filteredItems.length} recommendations
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Recommended</TableHead>
                      <TableHead className="text-right">
                        Competitor Avg.
                      </TableHead>
                      <TableHead className="text-right">Est. Margin</TableHead>
                      <TableHead className="text-right">
                        Expected Impact
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((p) => {
                      const displayPrice =
                        p.overridePrice ?? p.recommendedPrice;
                      const displayMargin = p.overrideMargin ?? p.margin;
                      const displayImpact =
                        p.overrideImpact ?? p.expectedImpact;
                      const delta = displayPrice - p.currentPrice;

                      return (
                        <TableRow
                          key={p.id}
                          onClick={() => setSelectedItemId(p.id)}
                          className={`cursor-pointer transition-colors duration-150 ${
                            selectedItemId === p.id
                              ? "bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <TableCell className="font-medium">
                            <div className="flex flex-col gap-1.5 py-1">
                              <div className="flex items-center">
                                <span className="text-sm font-semibold text-foreground">{p.product}</span>
                                {p.overridePrice && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-primary/10 text-primary border-primary/20 text-[9px] px-1.5 py-0 h-4"
                                  >
                                    Overridden
                                  </Badge>
                                )}
                              </div>
                              {/* Market Factors Section */}
                              {(p.demandElasticity || p.seasonalityFactor || p.supplierCostFactor || p.externalFactor) && (
                                <div className="flex flex-wrap gap-1 items-center mt-1">
                                  {p.demandElasticity && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-blue-500/5 text-blue-400 border-blue-500/20 cursor-help font-mono">
                                          Elas: {p.demandElasticity.split(" ")[0]}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Demand Elasticity: {p.demandElasticity}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {p.seasonalityFactor && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-500/5 text-amber-400 border-amber-500/20 cursor-help font-mono">
                                          Seas: {p.seasonalityFactor.split(" ")[0]}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Seasonality Index: {p.seasonalityFactor}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {p.supplierCostFactor && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-purple-500/5 text-purple-400 border-purple-500/20 cursor-help font-mono">
                                          Cost: {p.supplierCostFactor.split(" ")[0]}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Supplier Cost Factor: {p.supplierCostFactor}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {p.externalFactor && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-500/5 text-emerald-400 border-emerald-500/20 cursor-help max-w-[150px] truncate">
                                          Ext: {p.externalFactor.split(":")[0]}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs max-w-[250px]">{p.externalFactor}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                           <TableCell className="text-right font-mono">
                            {formatPrice(p.currentPrice)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {formatPrice(displayPrice)}
                            <Badge
                              variant="outline"
                              className={`ml-2 text-[10px] ${delta >= 0 ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30"}`}
                            >
                              {delta >= 0 ? "+" : ""}
                              {((delta / p.currentPrice) * 100).toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
                            {formatPrice(p.competitorAvg)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {displayMargin}%
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono font-semibold ${displayImpact >= 0 ? "text-success" : "text-destructive"}`}
                          >
                            {displayImpact >= 0 ? "+" : ""}
                            {displayImpact}%
                          </TableCell>
                          <TableCell className="text-right">
                            {p.status === "pending" ? (
                              <div className="inline-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleReject(p.id)}
                                  title="Reject"
                                >
                                  <X className="size-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                  onClick={() => openOverrideDialog(p)}
                                  title="Override Price"
                                >
                                  <Pencil className="size-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-8"
                                  onClick={() => handleAccept(p.id)}
                                >
                                  <Check className="size-3.5" /> Accept
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => {
                                  apiClient
                                    .updateRecommendationStatus(
                                      p.id,
                                      "pending",
                                      {
                                        override_price: null,
                                        override_margin: null,
                                        override_impact: null,
                                      },
                                    )
                                    .then(() => {
                                      setItems((prev) =>
                                        prev.map((item) =>
                                          item.id === p.id
                                            ? {
                                                ...item,
                                                status: "pending" as const,
                                                overridePrice: undefined,
                                                overrideMargin: undefined,
                                                overrideImpact: undefined,
                                              }
                                            : item,
                                        ),
                                      );
                                      toast.info(
                                        `Moved ${p.product} back to pending`,
                                      );
                                    });
                                }}
                              >
                                Revert
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground py-12"
                        >
                          No recommendations found in this status.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real-time Pricing Drivers Audit */}
            {(() => {
              const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];
              if (!selectedItem) return null;
              
              return (
                <SectionCard
                  title={
                    <span className="flex items-center gap-1.5 text-base font-semibold text-foreground">
                      <Activity className="size-4.5 text-primary animate-pulse" />
                      Real-time Pricing Drivers
                    </span>
                  }
                  description="Dynamic audit details justifying the recommended target price"
                >
                  <div className="space-y-4 py-2 text-sm">
                    {/* Header product info */}
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/15">
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="font-bold text-foreground truncate max-w-[180px]">
                          {selectedItem.product}
                        </h4>
                        <Badge variant="outline" className="text-[10px] font-mono capitalize">
                          Status: {selectedItem.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-border/50">
                        <div>
                          <span className="text-muted-foreground block text-[9px] uppercase">Current</span>
                          <span className="font-mono font-semibold">{formatPrice(selectedItem.currentPrice)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[9px] uppercase">Advised</span>
                          <span className="font-mono font-bold text-primary">{formatPrice(selectedItem.overridePrice ?? selectedItem.recommendedPrice)}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Explanation Box */}
                    {selectedItem.recommendationText && (
                      <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs leading-relaxed text-muted-foreground space-y-1">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <AlertCircle className="size-3.5 text-primary" />
                          AI Recommendation Rationale
                        </span>
                        <p>{selectedItem.recommendationText}</p>
                      </div>
                    )}

                    {/* Factors Grid */}
                    <div className="space-y-3 pt-1">
                      {/* Elasticity */}
                      {selectedItem.demandElasticity && (
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/40 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-blue-500/10 text-blue-400">
                              <Percent className="size-3.5" />
                            </span>
                            <div className="text-left">
                              <span className="text-xs font-semibold text-foreground block">Price Elasticity</span>
                              <span className="text-[10px] text-muted-foreground">Demand volume sensitivity</span>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                            {selectedItem.demandElasticity}
                          </span>
                        </div>
                      )}

                      {/* Seasonality */}
                      {selectedItem.seasonalityFactor && (
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/40 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
                              <Calendar className="size-3.5" />
                            </span>
                            <div className="text-left">
                              <span className="text-xs font-semibold text-foreground block">Seasonality Index</span>
                              <span className="text-[10px] text-muted-foreground">Temporal demand variations</span>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                            {selectedItem.seasonalityFactor}
                          </span>
                        </div>
                      )}

                      {/* Supplier Cost */}
                      {selectedItem.supplierCostFactor && (
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/40 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-purple-500/10 text-purple-400">
                              <Truck className="size-3.5" />
                            </span>
                            <div className="text-left">
                              <span className="text-xs font-semibold text-foreground block">Supplier Costs</span>
                              <span className="text-[10px] text-muted-foreground">Logistics & supply margins</span>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                            {selectedItem.supplierCostFactor}
                          </span>
                        </div>
                      )}

                      {/* External/Macro Factors */}
                      {selectedItem.externalFactor && (
                        <div className="p-2.5 rounded-md bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Globe className="size-3.5" />
                            <span className="text-xs font-semibold">External Market Factor</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-muted-foreground pl-5">
                            {selectedItem.externalFactor}
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] text-center text-muted-foreground italic pt-1 border-t border-border/40">
                      💡 Click any item in the pricing table to audit its drivers
                    </p>
                  </div>
                </SectionCard>
              );
            })()}

            {/* Elasticity Simulator */}
            <SectionCard
              title={
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-4 text-primary" />
                  Revenue Elasticity Sandbox
                </span>
              }
              description="Adjust market pricing factor to simulate sales decay vs margin optimization"
            >
              <div className="space-y-6 py-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      Pricing Aggressiveness
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Info className="size-3.5 text-muted-foreground cursor-pointer" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          Adjusting pricing aggressiveness scaling. 100% is the
                          AI recommended baseline. Higher levels increase
                          pricing margins but will begin to decay purchase
                          velocity.
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <span className="font-mono text-xs font-semibold text-primary">
                      {simulationMultiplier[0]}%
                    </span>
                  </div>
                  <Slider
                    value={simulationMultiplier}
                    onValueChange={setSimulationMultiplier}
                    min={50}
                    max={150}
                    step={5}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Defensive (Volume)</span>
                    <span>AI Optimal</span>
                    <span>Aggressive (Margin)</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="rounded-lg border border-border bg-surface-2 p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Simulated Net Margin:
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        {(avgMargin * (simulationMultiplier[0] / 100)).toFixed(
                          1,
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Expected Demand Change:
                      </span>
                      <span
                        className={`font-mono font-medium ${simulationMultiplier[0] > 100 ? "text-destructive" : "text-success"}`}
                      >
                        {simulationMultiplier[0] === 100
                          ? "0.0%"
                          : simulationMultiplier[0] > 100
                            ? `-${((simulationMultiplier[0] - 100) * 0.35).toFixed(1)}%`
                            : `+${((100 - simulationMultiplier[0]) * 0.25).toFixed(1)}%`}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-medium text-foreground">
                        Projected Revenue Lift:
                      </span>
                      <span className="font-mono font-bold text-primary">
                        {fmtCurrency(simulatedRevenueLift)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 text-xs leading-relaxed text-muted-foreground bg-muted/30 rounded-lg border border-border">
                    <p className="font-semibold text-foreground mb-1 flex items-center gap-1">
                      <TrendingUp className="size-3.5 text-success" />
                      AI Optimization Insight
                    </p>
                    {simulationMultiplier[0] > 115 ? (
                      <span>
                        Setting pricing this high triggers customer attrition
                        warnings in Electronics categories. Optimal revenue lift
                        peaks around 105%.
                      </span>
                    ) : simulationMultiplier[0] < 85 ? (
                      <span>
                        Pricing defensively increases volume but drops net
                        profit margins below acceptable corporate target
                        thresholds of 28%.
                      </span>
                    ) : (
                      <span>
                        Current pricing strategy is balanced. You are capturing
                        optimal customer conversion without sacrificing
                        item-level margins.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Override Modal */}
        <Dialog
          open={!!overrideItem}
          onOpenChange={(o) => !o && setOverrideItem(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            {overrideItem && (
              <>
                <DialogHeader>
                  <DialogTitle>Override Recommendation</DialogTitle>
                  <DialogDescription>
                    Manually adjust target pricing for {overrideItem.product}.
                    This will override the AI recommendation.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase text-muted-foreground">
                        Current Price
                      </span>
                      <p className="text-base font-semibold font-mono">
                        {formatPrice(overrideItem.currentPrice)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase text-muted-foreground">
                        AI Recommended
                      </span>
                      <p className="text-base font-semibold font-mono text-primary">
                        {formatPrice(overrideItem.recommendedPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="customPrice">Custom Target Price ({activeCurrency})</Label>
                    <Input
                      id="customPrice"
                      type="number"
                      step="0.01"
                      value={customPriceInput}
                      onChange={(e) => setCustomPriceInput(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  {parseFloat(customPriceInput) > 0 && (
                    <div className="rounded-lg bg-surface-2 border border-border p-3 space-y-2 text-xs">
                      <p className="font-semibold text-foreground">
                        Live Simulation Calculations
                      </p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Proposed Price Delta:
                        </span>
                        <span className="font-mono">
                          {(() => {
                            const rate = activeCurrency === "KES" ? 130.0 : 1.0;
                            const currentVal = overrideItem.currentPrice * rate;
                            const inputVal = parseFloat(customPriceInput) || 0;
                            const diff = inputVal - currentVal;
                            const diffPct = currentVal > 0 ? (diff / currentVal) * 100 : 0;
                            return `${diff >= 0 ? "+" : ""}${diffPct.toFixed(1)}%`;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          New Estimated Margin:
                        </span>
                        <span className="font-mono font-medium">
                          {(() => {
                            const newP = parseFloat(customPriceInput);
                            if (!newP || newP <= 0) return 0;
                            const rate = activeCurrency === "KES" ? 130.0 : 1.0;
                            const cost =
                              overrideItem.currentPrice *
                              (1 - overrideItem.margin / 100) * rate;
                            return Math.round(((newP - cost) / newP) * 100);
                          })()}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOverrideItem(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveOverride}>Apply Override</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
