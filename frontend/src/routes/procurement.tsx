import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Truck,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, KpiCard, SeverityBadge } from "@/components/widgets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  fmtCurrency,
  procurementItems as seedItems,
  type ProcurementItem,
} from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/procurement")({
  head: () => ({
    meta: [{ title: "Procurement Recommendations — SokoPulse AI" }],
  }),
  component: ProcurementPage,
});

interface StatefulProcurement extends ProcurementItem {
  status: "pending" | "approved" | "ignored";
  productId?: number;
  supplierId?: number;
  poNumber?: string;
  etaDate?: string;
  trackingStatus?: string;
}

const mockActivePOs: StatefulProcurement[] = [
  {
    id: "active1",
    product: "Titan Grade Castings",
    qty: 120,
    supplier: "Iron Bridge Co.",
    leadTime: 9,
    cost: 10680,
    urgency: "medium",
    reason: "Scheduled restocking cycle",
    status: "approved",
    poNumber: "PO-22180",
    etaDate: "2026-06-18",
    trackingStatus: "In Transit",
  },
  {
    id: "active2",
    product: "Lithium Cell Mod-8",
    qty: 300,
    supplier: "VoltCore Industries",
    leadTime: 14,
    cost: 23400,
    urgency: "critical",
    reason: "Delayed previous delivery fallback",
    status: "approved",
    poNumber: "PO-22183",
    etaDate: "2026-06-24",
    trackingStatus: "Delayed (Customs Hold)",
  },
];

function ProcurementPage() {
  const [recommendations, setRecommendations] = useState<StatefulProcurement[]>(
    () => seedItems.map((item) => ({ ...item, status: "pending" })),
  );
  const [activePOs, setActivePOs] =
    useState<StatefulProcurement[]>(mockActivePOs);
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");
  const [adjustItem, setAdjustItem] = useState<StatefulProcurement | null>(
    null,
  );
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustSupplier, setAdjustSupplier] = useState("");
  const [isBulkApproving, setIsBulkApproving] = useState(false);

  // Load telemetry from backend on mount
  useEffect(() => {
    apiClient.getProcurement().then((data) => {
      if (data && data.length > 0) {
        setRecommendations(data);
      }
    });

    apiClient.getPurchaseOrders().then((data) => {
      if (data && data.length > 0) {
        setActivePOs(
          data.map((po: any) => ({
            id: String(po.id),
            product: po.product_name || "Unknown Product",
            qty: po.qty,
            supplier: po.supplier_name || "Unknown Supplier",
            leadTime: po.lead_time_days || 7,
            cost: Number(po.cost),
            urgency: po.status === "delayed" ? "critical" : "medium",
            reason: "Active purchase order",
            status: "approved",
            poNumber: po.po_number,
            etaDate: po.expected_delivery,
            trackingStatus:
              po.status.charAt(0).toUpperCase() + po.status.slice(1),
          })),
        );
      }
    });
  }, []);

  // Totals
  const pendingItems = recommendations.filter((r) => r.status === "pending");
  const totalBudgetImpact = pendingItems.reduce((s, p) => s + p.cost, 0);
  const criticalCount = pendingItems.filter(
    (p) => p.urgency === "critical",
  ).length;

  const handleCreatePO = (id: string) => {
    const item = recommendations.find((r) => r.id === id);
    if (!item) return;

    // Generate PO info
    const poNumber = `PO-${Math.floor(10000 + Math.random() * 90000)}`;
    const eta = new Date();
    eta.setDate(eta.getDate() + item.leadTime);
    const etaStr = eta.toISOString().split("T")[0];

    apiClient
      .createPurchaseOrder({
        po_number: poNumber,
        product: item.productId || 1,
        supplier: item.supplierId || 1,
        qty: item.qty,
        cost: item.cost,
        expected_delivery: etaStr,
        status: "pending",
      })
      .then((res) => {
        apiClient.updateRecommendationStatus(item.id, "approved");

        const approvedItem: StatefulProcurement = {
          ...item,
          status: "approved",
          poNumber,
          etaDate: etaStr,
          trackingStatus: "Awaiting Confirmation",
        };

        setRecommendations((prev) => prev.filter((r) => r.id !== id));
        setActivePOs((prev) => [approvedItem, ...prev]);

        toast.success(
          `Purchase Order ${poNumber} created for ${item.product}!`,
        );
      });
  };

  const handleIgnore = (id: string) => {
    apiClient.updateRecommendationStatus(id, "rejected").then(() => {
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      toast.info("Recommendation dismissed.");
    });
  };

  const handleBulkApprove = () => {
    const criticalPOs = pendingItems.filter((r) => r.urgency === "critical");
    if (criticalPOs.length === 0) {
      toast.info("No critical PO recommendations pending.");
      return;
    }

    setIsBulkApproving(true);
    const promises = criticalPOs.map((item) => {
      const poNumber = `PO-${Math.floor(10000 + Math.random() * 90000)}`;
      const eta = new Date();
      eta.setDate(eta.getDate() + item.leadTime);
      const etaStr = eta.toISOString().split("T")[0];

      return apiClient
        .createPurchaseOrder({
          po_number: poNumber,
          product: item.productId || 1,
          supplier: item.supplierId || 1,
          qty: item.qty,
          cost: item.cost,
          expected_delivery: etaStr,
          status: "pending",
        })
        .then(() => {
          return apiClient
            .updateRecommendationStatus(item.id, "approved")
            .then(() => {
              return {
                ...item,
                status: "approved" as const,
                poNumber,
                etaDate: etaStr,
                trackingStatus: "Awaiting Confirmation",
              };
            });
        });
    });

    Promise.all(promises)
      .then((newApprovedItems) => {
        setRecommendations((prev) =>
          prev.filter((r) => r.urgency !== "critical"),
        );
        setActivePOs((prev) => [...newApprovedItems, ...prev]);
        setIsBulkApproving(false);
        toast.success(
          `Bulk approved ${criticalPOs.length} critical purchase orders.`,
        );
      })
      .catch((err) => {
        setIsBulkApproving(false);
        toast.error("Bulk approval failed.");
      });
  };

  const openAdjustDialog = (item: StatefulProcurement) => {
    setAdjustItem(item);
    setAdjustQty(item.qty.toString());
    setAdjustSupplier(item.supplier);
  };

  const saveAdjustment = () => {
    if (!adjustItem) return;
    const newQty = parseInt(adjustQty);
    if (isNaN(newQty) || newQty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    // Estimate new cost based on unit cost
    const unitCost = adjustItem.cost / adjustItem.qty;
    const newCost = Math.round(newQty * unitCost);

    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === adjustItem.id
          ? {
              ...r,
              qty: newQty,
              cost: newCost,
              supplier: adjustSupplier,
            }
          : r,
      ),
    );

    toast.success(`Adjusted PO order details for ${adjustItem.product}.`);
    setAdjustItem(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Procurement Recommendations"
        description="AI-generated purchase orders ranked by urgency, supplier reliability, and budget impact."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRecommendations(
                  seedItems.map((r) => ({ ...r, status: "pending" })),
                );
                setActivePOs(mockActivePOs);
                toast.success("Procurement states reset to default.");
              }}
            >
              Reset Data
            </Button>
            <Button
              size="sm"
              onClick={handleBulkApprove}
              disabled={isBulkApproving || criticalCount === 0}
            >
              <RefreshCw
                className={`size-3.5 mr-1.5 ${isBulkApproving ? "animate-spin" : ""}`}
              />
              Approve All Critical
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Recommended POs"
          value={`${pendingItems.length}`}
          accent="primary"
        />
        <KpiCard
          label="Total Budget Impact"
          value={fmtCurrency(totalBudgetImpact)}
          hint="Across all recommendations"
        />
        <KpiCard
          label="Critical Urgency"
          value={`${criticalCount}`}
          accent={criticalCount > 0 ? "destructive" : undefined}
        />
        <KpiCard
          label="Active POs In-Flight"
          value={`${activePOs.length}`}
          accent="success"
        />
      </div>

      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="pending">
              Recommendations ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active Orders ({activePOs.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "pending" ? (
        <div className="space-y-4">
          {pendingItems.map((p) => (
            <Card key={p.id} className="p-6 gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base">{p.product}</h3>
                    <SeverityBadge severity={p.urgency} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supplier: {p.supplier} · Lead time: {p.leadTime} days
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-destructive hover:bg-destructive/10"
                    onClick={() => handleIgnore(p.id)}
                  >
                    <X className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => openAdjustDialog(p)}
                  >
                    Adjust
                  </Button>
                  <Button
                    size="sm"
                    className="h-9"
                    onClick={() => handleCreatePO(p.id)}
                  >
                    Create PO
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Stat
                  label="Recommended Qty"
                  value={`${p.qty.toLocaleString()} units`}
                />
                <Stat label="Estimated Cost" value={fmtCurrency(p.cost)} />
                <Stat label="Lead Time" value={`${p.leadTime} days`} />
              </div>

              <div className="rounded-md border border-border bg-surface-2 p-3 flex gap-2">
                <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">
                    AI reasoning:
                  </span>{" "}
                  {p.reason}
                </p>
              </div>
            </Card>
          ))}
          {pendingItems.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="font-medium text-sm text-muted-foreground">
                All recommendations resolved.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {activePOs.map((p) => (
            <Card key={p.id} className="p-6 gap-4 border-l-2 border-l-success">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">
                      {p.poNumber}
                    </span>
                    <h3 className="font-semibold text-base">{p.product}</h3>
                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success border-success/30 font-mono text-[10px]"
                    >
                      {p.trackingStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supplier: {p.supplier} · Handled via platform
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.info(`Syncing status for PO ${p.poNumber}...`)
                    }
                  >
                    Track
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <Stat
                  label="Ordered Qty"
                  value={`${p.qty.toLocaleString()} units`}
                />
                <Stat label="Spend" value={fmtCurrency(p.cost)} />
                <Stat label="ETA Delivery" value={p.etaDate ?? "N/A"} />
                <Stat label="Fulfillment Speed" value={`${p.leadTime} days`} />
              </div>
            </Card>
          ))}
          {activePOs.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="font-medium text-sm text-muted-foreground">
                No active purchase orders.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Adjust PO Dialog */}
      <Dialog
        open={!!adjustItem}
        onOpenChange={(o) => !o && setAdjustItem(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          {adjustItem && (
            <>
              <DialogHeader>
                <DialogTitle>Adjust Recommendation</DialogTitle>
                <DialogDescription>
                  Modify quantity and supplier for your upcoming purchase order.
                  Cost will recalculate.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="qtyInput">Order Quantity</Label>
                  <Input
                    id="qtyInput"
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Baseline recommendation: {adjustItem.qty.toLocaleString()}{" "}
                    units
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="supplierSelect">Supplier Choice</Label>
                  <Input
                    id="supplierSelect"
                    value={adjustSupplier}
                    onChange={(e) => setAdjustSupplier(e.target.value)}
                  />
                </div>

                {parseInt(adjustQty) > 0 && (
                  <div className="rounded-lg bg-surface-2 border border-border p-3 space-y-2 text-xs">
                    <p className="font-semibold text-foreground">
                      Live Budget Impact
                    </p>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        New Quantity:
                      </span>
                      <span className="font-mono">
                        {parseInt(adjustQty).toLocaleString()} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        New Estimated Cost:
                      </span>
                      <span className="font-mono font-bold text-primary">
                        {(() => {
                          const unitCost = adjustItem.cost / adjustItem.qty;
                          return fmtCurrency(
                            Math.round(parseInt(adjustQty) * unitCost),
                          );
                        })()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAdjustItem(null)}>
                  Cancel
                </Button>
                <Button onClick={saveAdjustment}>Apply Adjustments</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-2 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium font-mono mt-1">{value}</p>
    </div>
  );
}
